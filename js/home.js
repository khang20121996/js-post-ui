import postApi from './api/postApi';
import { initPagination, initSearch, renderPagination, renderPostList } from './utils';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

async function handleFilterChange(filterName, filterValue) {
  try {
    // update query params
    const url = new URL(window.location);
    url.searchParams.set(filterName, filterValue);
    // reset page if needed
    if (filterName === 'title_like') url.searchParams.set('_page', 1);
    history.pushState({}, '', url);

    // fetch API
    // re-render post list
    const { data, pagination } = await postApi.getAll(url.searchParams);
    renderPostList(data);
    renderPagination('postsPagination', pagination);
  } catch (error) {
    console.log('fail to fetch post list');
  }
}

(async () => {
  try {
    const url = new URL(window.location);

    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);

    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 12);

    history.pushState({}, '', url);
    const queryParams = url.searchParams;

    initPagination({
      elementId: 'postsPagination',
      defaultParams: queryParams,
      onChange: (page) => handleFilterChange('_page', page),
    });

    initSearch({
      elementId: 'searchInput',
      defaultParams: queryParams,
      onChange: (value) => handleFilterChange('title_like', value),
    });

    const { data, pagination } = await postApi.getAll(queryParams);
    renderPostList(data);
    renderPagination('postsPagination', pagination);
  } catch (error) {
    console.log('get all fail', error);
    // show modal...
  }
})();
