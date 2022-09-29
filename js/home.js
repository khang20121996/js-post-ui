import postApi from './api/postApi';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { setTextContent, truncateText } from './utils';
dayjs.extend(relativeTime);

function createPostElement(post) {
  if (!post) return;
  // get template and clone li element
  const templateElement = document.getElementById('postItemTemplate');
  if (!templateElement) return;
  const liElement = templateElement.content.firstElementChild.cloneNode(true);
  if (!liElement) return;

  // set text content for post element
  setTextContent(liElement, '[data-id="title"]', post.title);
  setTextContent(liElement, '[data-id="description"]', truncateText(post.description, 150));
  setTextContent(liElement, '[data-id="author"]', post.author);
  // const titleElement = liElement.querySelector('[data-id="title"]');
  // if (titleElement) titleElement.textContent = post.title;

  // const descElement = liElement.querySelector('[data-id="description"]');
  // if (descElement) descElement.textContent = post.description;

  // const authorElement = liElement.querySelector('[data-id="author"]');
  // if (authorElement) authorElement.textContent = post.author;

  const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]');
  if (thumbnailElement) {
    thumbnailElement.src = post.imageUrl;

    thumbnailElement.addEventListener('error', () => {
      thumbnailElement.src = 'https://via.placeholder.com/728x90.png?text=thumbnail';
    });
  }

  // calculate timespan
  const timeSpanElement = liElement.querySelector('[data-id="timeSpan"]');
  if (timeSpanElement) timeSpanElement.textContent = dayjs(post.updatedAt).fromNow();

  // attach event
  return liElement;
}

function renderPostList(postList) {
  if (!Array.isArray(postList) || postList.length === 0) return;

  const ulElement = document.getElementById('postsList');
  if (!ulElement) return;

  postList.forEach((post) => {
    const liElement = createPostElement(post);
    ulElement.appendChild(liElement);
  });
}

function renderPagination(pagination) {
  const ulPagination = document.getElementById('postsPagination');
  if (!pagination || !ulPagination) return;

  // calculate total page
  const { _page, _limit, _totalRows } = pagination;
  const totalPage = Math.ceil(_totalRows / _limit);

  // check if enable / disable prev link
  const prevLink = ulPagination.firstElementChild;
  if (_page <= 1) {
    prevLink.classList.add('disabled');
  } else {
    prevLink.classList.remove('disabled');
  }

  // check if enable / disable next link
  const nextLink = ulPagination.lastElementChild;
  if (_page >= totalPage) {
    nextLink.classList.add('disabled');
  } else {
    nextLink.classList.remove('disabled');
  }
}

function handlePrevLink(e) {
  e.preventDefault();
  console.log('prev ');
}

function handleNextLink(e) {
  e.preventDefault();
  console.log('next');
}

function initPagination() {
  // bind click event for prev/next button
  const ulPagination = document.getElementById('postsPagination');
  if (!ulPagination) return;

  const prevLink = ulPagination.firstElementChild?.firstElementChild;
  if (prevLink) {
    prevLink.addEventListener('click', handlePrevLink);
  }

  const nextLink = ulPagination.lastElementChild?.lastElementChild;
  if (nextLink) {
    nextLink.addEventListener('click', handleNextLink);
  }
}

function initURL() {
  const url = new URL(window.location);

  if (!url.searchParams.get('_page')) {
    url.searchParams.set('_page', 1);
  }
  if (!url.searchParams.get('_limit')) {
    url.searchParams.set('_limit', 12);
  }

  history.pushState({}, '', url);
}

(async () => {
  try {
    initPagination();
    // set default queryparam if not existed
    initURL();

    const queryParams = new URLSearchParams(window.location.search);
    const { data, pagination } = await postApi.getAll(queryParams);
    renderPostList(data);
    renderPagination(pagination);
  } catch (error) {
    console.log('get all fail', error);
    // show modal...
  }
})();
