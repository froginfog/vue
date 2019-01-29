import axios from 'axios';
import api from './api'

export default async function fileUpload(data){
  const formData = new FormData();
  formData.append('name', 'file');
  formData.append('file', data);
  let res = await axios.post(api.imageupload, formData);//todo
  if(res.data.success){
    return res.data.location;
  }else{
    return ''; //todo
  }
}
