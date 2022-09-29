import axiosClient from './api/axiosClient';
import postApi from './api/postApi';

console.log('Hello');

async function main() {
  try {
    const queryParams = {
      _page: 1,
      _limit: 3,
    };
    const data = await postApi.getAll(queryParams);
    console.log(data);
  } catch (error) {
    console.log('get all fail', error);
    // show modal...
  }

  await postApi.update({
    id: 'lea2aa9l7x3a5th',
    title: 'Error amet sit 11',
  });
}

main();
