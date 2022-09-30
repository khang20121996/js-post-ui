export function renderPagination(elementId, pagination) {
  const ulPagination = document.getElementById(elementId);
  if (!pagination || !ulPagination) return;

  // calculate total page
  const { _page, _limit, _totalRows } = pagination;
  const totalPage = Math.ceil(_totalRows / _limit);
  ulPagination.dataset.page = _page;
  ulPagination.dataset.totalPage = totalPage;

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

export function initPagination({ elementId, defaultParams, onChange }) {
  // bind click event for prev/next button
  const ulPagination = document.getElementById(elementId);
  if (!ulPagination) return;

  const prevLink = ulPagination.firstElementChild?.firstElementChild;
  if (prevLink) {
    prevLink.addEventListener('click', (e) => {
      e.preventDefault();
      const page = Number.parseInt(ulPagination.dataset.page) || 1;

      if (page > 1) onChange?.(page - 1);
    });
  }

  const nextLink = ulPagination.lastElementChild?.lastElementChild;
  if (nextLink) {
    nextLink.addEventListener('click', (e) => {
      e.preventDefault();
      const totalPage = ulPagination.dataset.totalPage;
      const page = Number.parseInt(ulPagination.dataset.page) || 1;

      if (page < totalPage) onChange?.(page + 1);
    });
  }
}
