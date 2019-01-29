import api from './api';

const intToBool = function(int){
  return int !== '0';
};

const timeToStr = function(time){
  const date = new Date();
  date.setTime(time * 1000);
  const y = date.getFullYear();
  let m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  let d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  return y + '年' + m + '月' + d + '日';
};

const imageFullSrc = function(src){
  return api.baseUrl + src;
};

const _filters = {
  intToBool,
  timeToStr,
  imageFullSrc
};

export default _filters;
