import './HTTPInterceptor.css'
import axios from 'axios'
import { Fragment, useState } from 'react'
const HTTPInterceptor = () => {

  const [isLoading, setLoadingStatus] = useState(false);
  axios.interceptors.request.use(req => {
    setLoadingStatus(true)
    return req;
  },err=>{
    setLoadingStatus(false)
    return Promise.reject(err)
  })
  axios.interceptors.response.use(res => {
    setLoadingStatus(false)
    return res;
  },err=>{
    setLoadingStatus(false)
    return Promise.reject(err)
  })

  return (<Fragment>
    {isLoading && <div className="spinnerContainer">
      <div className="ui active centered inline loader"></div>
    </div> }
  </Fragment>
  )
}
export default HTTPInterceptor;