import axios from 'axios';
let token = document.head.querySelector('meta[name="csrf-token"]');
if (token) {
  axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
  console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

let thttp = {};

thttp.config = {};

thttp.install = (Vue, option) => {
  thttp.config = option;
  thttp.config['X-CSRF-TOKEN'] = token.content;
  Vue.prototype.$http = axios.create({
    baseURL: option.baseURL,
    timeout: 5000,
    responseType: 'json',
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  });
  Vue.prototype.$http.interceptors.response.use((response) => {
    return response;
  }, (error) => {
    if (error.code === 'ECONNABORTED') {
      Vue.prototype.$message('请求超时');
    } else if (error.response.status === 401 && error.response.data.code === '401.1') {
      Vue.prototype.$Notice.warning({title: '请先登录', desc: false});
      Vue.router.replace({name: 'login'});
    } else if (error.response.status === 422) {
      let errorsTemp = error.response.data.errors;
      for (let index in errorsTemp) {
        errorsTemp[index] = errorsTemp[index].join(',');
      }
    } else {
      if (error.config.noErrorTip) {
        return Promise.reject(error);
      }
      if (error.response.data.message) {
        Vue.prototype.$Notice.error({
          title: '出错了',
          desc: error.response.data.message
        });
      }
    }
    return Promise.reject(error);
  });
};

export default thttp;