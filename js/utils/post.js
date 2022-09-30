import { setTextContent, truncateText } from '../utils';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export function createPostElement(post) {
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

export function renderPostList(postList) {
  if (!Array.isArray(postList)) return;

  const ulElement = document.getElementById('postsList');
  if (!ulElement) return;

  // clear current post list
  ulElement.textContent = '';

  postList.forEach((post) => {
    const liElement = createPostElement(post);
    ulElement.appendChild(liElement);
  });
}
