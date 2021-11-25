import './HTTPInterceptor.css'
import axios from 'axios'
import { Fragment, useState } from 'react'
import AuthContext from '../store/auth-context'
import { useHistory } from 'react-router'
import { useContext } from 'react'

const HTTPInterceptor = () => {
  const [isLoading, setLoadingStatus] = useState(false);
  const authctx = useContext(AuthContext);
  const history = useHistory();
  axios.interceptors.request.use(req => {
    req.headers.Authorization = localStorage.getItem('token') ? 'Bearer ' + localStorage.getItem('token') : null;
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
    if(err.response.data.error.statusCode === 401){
      Promise.resolve( authctx.logout()).then(()=>{
        history.push("/signin")
      })
     
     
    }
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