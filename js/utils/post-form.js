import { randomNumber, setBackgroudImage, setFieldValue, setTextContent } from './common';
import * as yup from 'yup';

const imageSource = {
  PICSUM: 'picsum',
  UPLOAD: 'upload',
};

function setFormValues(form, formValues) {
  setFieldValue(form, '[name="title"]', formValues?.title);
  setFieldValue(form, '[name="author"]', formValues?.author);
  setFieldValue(form, '[name="description"]', formValues?.description);
  setFieldValue(form, '[name="id"]', formValues?.id);

  setFieldValue(form, '[name="imageUrl"]', formValues?.imageUrl);
  setBackgroudImage(document, '#postHeroImage', formValues?.imageUrl);
}

function getFormValues(form) {
  const formValues = {};

  // S1 : query each input and add to values object
  //   ['title', 'author', 'description', 'imageUrl'].forEach((name) => {
  //     const field = form.querySelector(`[name="${name}"]`);
  //     if (field) formValues[name] = field.value;
  //   });

  // S2: using form data
  const data = new FormData(form);
  for (const [key, value] of data) {
    formValues[key] = value;
  }

  return formValues;
}

function getPostSchema() {
  return yup.object().shape({
    title: yup.string().required('Please enter title'),
    author: yup
      .string()
      .required('Please enter author')
      .test(
        'at-least-two-words',
        'Please enter at least two word',
        (value) => value.split(' ').filter((x) => !!x && x.length >= 3).length >= 2
      ),
    description: yup.string(),
    imageSource: yup
      .string()
      .required('Please select an image source')
      .oneOf([imageSource.PICSUM, imageSource.UPLOAD], 'Invalid image source'),
    imageUrl: yup.string().when('imageSource', {
      is: imageSource.PICSUM,
      then: yup
        .string()
        .required('Please random a background Image')
        .url('Please enter a valid URL'),
    }),
    image: yup.mixed().when('imageSource', {
      is: imageSource.UPLOAD,
      then: yup
        .mixed()
        .test('require', 'Please select an image to upload', (file) => Boolean(file?.name))
        .test('max-3mb', 'The image is too large (max 3mb)', (file) => {
          const fileSize = file?.size || 0;
          const MAX_SIZE = 3 * 1024 * 1024; //3mb
          return fileSize < MAX_SIZE;
        }),
    }),
  });
}

function setFiledError(form, name, error) {
  const element = form.querySelector(`[name="${name}"]`);
  if (element) {
    element.setCustomValidity(error);
    setTextContent(element.parentElement, '.invalid-feedback', error);
  }
}

async function validatePostForm(form, formValues) {
  try {
    // reset previous errors
    ['title', 'author', 'imageUrl', 'image'].forEach((name) => setFiledError(form, name, ''));

    // start validating
    const schema = getPostSchema();
    await schema.validate(formValues, { abortEarly: false });
  } catch (error) {
    const errorLog = {};
    console.log(error.name);
    console.log(error.inner);

    if (error.name === 'ValidationError' && Array.isArray(error.inner)) {
      for (const validationError of error.inner) {
        const name = validationError.path;

        // ignore if the field is already logged
        if (errorLog[name]) continue;

        // set field error and mark as logged
        setFiledError(form, name, validationError.message);
        errorLog[name] = true;
      }
    }
  }

  // add was-validated class to form element
  const isValid = form.checkValidity();
  if (!isValid) form.classList.add('was-validated');
  return isValid;
}

function showLoading(form) {
  const buttonElement = form.querySelector('[name="submit"]');
  if (buttonElement) {
    buttonElement.disabled = true;
    buttonElement.textContent = 'Saving...';
  }
}

function hideLoading(form) {
  const buttonElement = form.querySelector('[name="submit"]');
  if (buttonElement) {
    buttonElement.disabled = false;
    buttonElement.textContent = 'Save';
  }
}

function initRandomImg(form) {
  const randomButton = document.getElementById('postChangeImage');
  if (randomButton) {
    randomButton.addEventListener('click', () => {
      const imgUrl = `https://picsum.photos/id/${randomNumber(1000)}/1680/400`;

      setFieldValue(form, '[name="imageUrl"]', imgUrl);
      setBackgroudImage(document, '#postHeroImage', imgUrl);
    });
  }
}

function renderImageSource(form, radioValue) {
  const controlList = form.querySelectorAll('[data-id="imageSource"]');

  if (controlList) {
    controlList.forEach((control) => {
      control.hidden = control.dataset.imageSource !== radioValue;
    });
  }
}

function initRadioImageSource(form) {
  const radioList = document.querySelectorAll('[name="imageSource"]');

  if (radioList) {
    radioList.forEach((radio) => {
      radio.addEventListener('change', (e) => renderImageSource(form, e.target.value));
    });
  }
}

async function validateFormField(form, formValues, name) {
  try {
    setFiledError(form, formValues, '');

    const schema = getPostSchema();
    await schema.validateAt(name, formValues);
  } catch (error) {
    setFiledError(form, formValues, error.message);
  }

  // show validation error
  const field = form.querySelector(`[name="${name}"]`);
  if (field && !field.checkValidity()) {
    field.parentElement.classList.add('was-validated');
  }
}

function initUploadImage(form) {
  const uploadImage = form.querySelector('[name="image"]');

  if (uploadImage) {
    uploadImage.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setBackgroudImage(document, '#postHeroImage', imageUrl);

        validateFormField(form, {}, 'image');
      }
    });
  }
}

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId);
  if (!form) return;
  let submitting = false;
  setFormValues(form, defaultValues);

  initRandomImg(form);
  initRadioImageSource(form);
  initUploadImage(form);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (submitting) return;

    showLoading(form);
    submitting = true;

    const formValues = getFormValues(form);
    console.log(formValues);
    const isValid = await validatePostForm(form, formValues);

    if (isValid) await onSubmit?.(formValues);

    hideLoading(form);
    submitting = false;
  });
}
