import Axios, { AxiosInstance, AxiosRequestConfig, Method, Canceler } from 'Axios'
import { merge } from 'lodash'
import { PlainObject } from '@/listview.type'

let _requestCancelToken: Canceler
function fetch(
  requestUrl?: string,
  reqeustMethod: Method = 'get',
  reqeustConfig?: AxiosRequestConfig,
  requestData?: PlainObject
): {
  axiosService: AxiosInstance
  axiosConfig: AxiosRequestConfig
} {
  // debounce
  _requestCancelToken?.()

  const _requestConfig = {
    url: requestUrl,
    method: reqeustConfig?.method || reqeustMethod,
    withCredentials: true
  }

  const finalRequestConfig = merge(_requestConfig, reqeustConfig)
  finalRequestConfig.cancelToken = new Axios.CancelToken(cancel => {
    _requestCancelToken = cancel
  })

  if (requestData) {
    if (_requestConfig.method === 'get') {
      finalRequestConfig['params'] = requestData
    } else {
      finalRequestConfig['data'] = requestData
    }
  }

  const axiosService = Axios.create()
  return { axiosService, axiosConfig: finalRequestConfig }
}

export default fetch
