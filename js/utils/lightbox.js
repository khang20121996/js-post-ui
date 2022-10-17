function showModal(modalElement) {
  if (!window.bootstrap) return;

  const modal = new window.bootstrap.Modal(modalElement);
  if (modal) modal.show();
}

export function registerLightBox({ modalId, imgSelector, prevSelector, nextSelector }) {
  const modalElement = document.getElementById(modalId);
  if (!modalElement) return;

  //   check modal is registered or not
  if (Boolean(modalElement.dataset.registered)) return;

  // selector
  const imgElememt = modalElement.querySelector(imgSelector);
  const prevButton = modalElement.querySelector(prevSelector);
  const nextButton = modalElement.querySelector(nextSelector);
  if (!imgElememt || !prevButton || !nextButton) return;

  let imgList = [];
  let currentIndex = 0;

  function showImgIndex(index) {
    imgElememt.src = imgList[index].src;
  }

  // handle click for all imgs
  // img click => find all imgs with the same album
  // determin index for  selected img
  // show modal with selected img
  // handle prev/ click
  document.addEventListener('click', (event) => {
    const { target } = event;
    if (target.tagName !== 'IMG' || !target.dataset.album) return;

    // img with data album
    imgList = document.querySelectorAll(`img[data-album="${target.dataset.album}"]`);
    currentIndex = [...imgList].findIndex((x) => x === target);
    console.log(currentIndex, target, imgList);

    showModal(modalElement);
    showImgIndex(currentIndex);
  });

  prevButton.addEventListener('click', () => {
    // show prev img of current img in album
    currentIndex = (currentIndex - 1 + imgList.length) % imgList.length;
    showImgIndex(currentIndex);
  });

  nextButton.addEventListener('click', () => {
    // show next img of current img in album
    currentIndex = (currentIndex + 1) % imgList.length;
    showImgIndex(currentIndex);
  });

  //   mark this madal is already registered
  modalElement.dataset.registered = true;
}
