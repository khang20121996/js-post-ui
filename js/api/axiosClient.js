import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://js-post-api.herokuapp.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

<<<<<<< Updated upstream
=======
// Add a request interceptor
axiosClient.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    // attach token for request if exists
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      config.headers.Authorization = `Beaer ${accessToken}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    // Transform data for all responses
    return response.data;
  },
  function (error) {
    console.log('AxiosClient - Response Error', error.response);

    // redirect to login if not login
    if (error.response.status === 401) {
      // clear token, logout
      // ...
      window.location.assign('/login.html');
      return;
    }

    return Promise.reject(error);
  }
);

>>>>>>> Stashed changes
export default axiosClient;
