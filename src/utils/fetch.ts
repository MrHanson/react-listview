import Axios, { AxiosRequestConfig, Method } from 'Axios'
import { merge } from 'lodash'

let _requestCancelToken
async function fetch(
  requestUrl: string,
  reqeustMethod: Method = 'get',
  reqeustConfig?: AxiosRequestConfig
  // eslint-disable-next-line
): Promise<any> {
  // debounce
  _requestCancelToken?.()

  const _requestConfig = {
    url: requestUrl,
    method: reqeustConfig?.method || reqeustMethod,
    withCredentials: true
  }

  const finalRequestConfig = merge(_requestConfig, reqeustConfig)
  finalRequestConfig.cancelToken = new Axios.CancelToken((cancel) => {
    _requestCancelToken = cancel
  })

  if (_requestConfig.method === 'get') {
    _requestConfig['params'] = reqeustConfig?.params
  } else {
    _requestConfig['data'] = reqeustConfig?.data
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
