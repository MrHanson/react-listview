import Axios, { AxiosRequestConfig, Method, Canceler } from 'Axios'
import { merge } from 'lodash'

let _requestCancelToken: Canceler
async function fetch(
  requestUrl?: string,
  reqeustMethod: Method = 'get',
  reqeustConfig?: AxiosRequestConfig,
  requestData?: { [k: string]: any } | boolean
): Promise<any> {
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

  try {
    const axiosService = Axios.create()
    const axiosResponse = await axiosService(finalRequestConfig)
    return axiosResponse.data
  } catch (err) {
    if (Axios.isCancel(err)) {
      // axios internal cancel
      return false
    } else {
      return err
    }
  }
}

export default fetch
