import postApi from './api/postApi';
import { setTextContent, registerLightBox } from './utils';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

function renderPostDetail(post) {
  const postHeroImgElement = document.getElementById('postHeroImage');
  if (!postHeroImgElement) return;
  postHeroImgElement.style.backgroundImage = `url(${post.imageUrl})`;

  const editPageLink = document.getElementById('goToEditPageLink');
  if (editPageLink) {
    editPageLink.href = `/add-edit-post.html?id=${post.id}`;
    editPageLink.innerHTML = '<li class="fas fa-edit"></li> Edit post';
  }

  setTextContent(document, '#postDetailTitle', post.title);
  setTextContent(document, '#postDetailAuthor', post.author);
  setTextContent(document, '#postDetailDescription', post.description);
  setTextContent(document, '#postDetailTimeSpan', dayjs(post.updatedAt).format('DD/MM/YYYY HH:mm'));
}

function handleClickEditPost() {
  const editPostButton = document.getElementById('goToEditPageLink');
  if (editPostButton) {
    editPostButton.addEventListener('click', () => {
      window.location.assign(`/add-edit-post.html?id=${post.id}`);
    });
  }
}

(async () => {
  try {
    registerLightBox({
      modalId: 'lightbox',
      imgSelector: 'img[data-id="lightboxImg"]',
      prevSelector: 'button[data-id="lightboxPre"]',
      nextSelector: 'button[data-id="lightboxNext"]',
    });

    const url = new URL(window.location);
    const queryParams = url.searchParams.get('id');

    const post = await postApi.getById(queryParams);
    renderPostDetail(post);
    handleClickEditPost();
  } catch (error) {
    console.log('get all fail', error);
  }
})();
