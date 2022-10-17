import postApi from './api/postApi';
import { initPostForm, toast } from './utils';

function removeUnusedFields(formValues) {
  const payload = { ...formValues };

  if (payload.imageSource === 'picsum') {
    delete payload.image;
  } else {
    delete payload.imageUrl;
  }

  delete payload.imageSource;
  return payload;
}

function jsonToFormData(jsonObject) {
  const formData = new FormData();

  for (const key in jsonObject) {
    formData.set(key, jsonObject[key]);
  }

  return formData;
}

async function handlePostSubmitForm(formValues) {
  try {
    const payload = removeUnusedFields(formValues);
    const formData = jsonToFormData(payload);
    // check add/edit mode
    // s1: based on search param(check id)
    // s2: check id in formValues
    // call API
    const savedPost = formValues.id
      ? await postApi.updateFormData(formData)
      : await postApi.addFormData(formData);

    // show success message
    // redirect to detail page
    toast.success('Save post successfully!');

    setTimeout(() => {
      window.location.assign(`/post-detail.html?id=${savedPost.id}`);
    }, 1000);
  } catch (error) {
    toast.error(error.message);
  }
}

(async () => {
  try {
    const url = new URL(window.location);
    const postId = url.searchParams.get('id');

    const defaultValues = Boolean(postId)
      ? await postApi.getById(postId)
      : {
          title: '',
          description: '',
          author: '',
          imageUrl: '',
          id: '',
        };

    initPostForm({
      formId: 'postForm',
      defaultValues,
      onSubmit: handlePostSubmitForm,
    });
  } catch (error) {
    console.log('get all fail', error);
  }
})();
