import debounce from 'lodash.debounce';

export function initSearch({ elementId, defaultParams, onChange }) {
  const searchInput = document.getElementById(elementId);
  if (!searchInput) return;

  // set searchInput value when reload page
  if (defaultParams.get('title_like')) {
    searchInput.value = queryParams.get('title_like');
  }

  // set default value from query params
  // title_like
  const debounceSearch = debounce((event) => onChange?.(event.target.value), 500);
  searchInput.addEventListener('input', debounceSearch);
}
