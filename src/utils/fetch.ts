import axios, { AxiosRequestConfig, Method } from 'axios'
import { merge } from 'lodash'

let _requestCancelToken
async function fetch(
  requestUrl: string,
  reqeustMethod: Method = 'GET',
  reqeustConfig?: AxiosRequestConfig
  // eslint-disable-next-line
): Promise<any> {
  // debounce
  _requestCancelToken && _requestCancelToken()

  const _requestConfig = {
    url: requestUrl,
    method: reqeustMethod || 'GET',
    withCredentials: true
  }

  const finalRequestConfig = merge(_requestConfig, reqeustConfig)
  finalRequestConfig.cancelToken = new axios.CancelToken((cancel) => {
    _requestCancelToken = cancel
  })

  try {
    const axiosService = axios.create()
    const res = await axiosService(finalRequestConfig)
    return res
  } catch (err) {
    throw err
  }
}

export default fetch
