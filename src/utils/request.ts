import axios, { AxiosRequestConfig } from 'axios'

// utils
import { merge } from 'lodash'
import { warn } from '@/utils/debug'

// types
import {
  RequestHandler,
  TransformRequestData,
  TransformResponseData,
  ValidateResponse,
  ResolveResponseErrorMessage
} from '@/listview.type'

let _requestCancelToken

const DEFAULT_PROPS = {
  validateResponse: (response): boolean => (response.is_success ? true : false),
  resolveResponseErrorMessage: (response): string => {
    try {
      return response.error_info.msg
    } catch (e) {
      return '未知错误'
    }
  }
}

async function request(
  requestConfig: AxiosRequestConfig,
  requestHandler?: RequestHandler,
  transformRequestData?: TransformRequestData,
  validateResponse: ValidateResponse = DEFAULT_PROPS.validateResponse,
  resolveResponseErrorMessage?: ResolveResponseErrorMessage = DEFAULT_PROPS.resolveResponseErrorMessage,
  transformResponseData?: TransformResponseData
  // eslint-disable-next-line
): Promise<any> {
  if (!requestHandler && !requestConfig.url) {
    return warn('unavailable requestUrl & requestHandler ，unable to reqeust')
  }

  let response, _responseErr
  if (requestHandler) {
    // customize request Handler
    response = requestHandler(requestConfig.data)
  } else if (requestConfig.url) {
    if (transformRequestData) {
      transformRequestData(requestConfig.data)
    }

    // debounce, the last request work
    _requestCancelToken && _requestCancelToken()

    const _requestConfig = {
      method: 'get',
      withCredentials: true
    }

    const finalRequestConfig = merge(_requestConfig, requestConfig)
    finalRequestConfig.cancelToken = new axios.CancelToken((cancel) => {
      _requestCancelToken = cancel
    })

    // fetch Data
    try {
      const res = await axios(finalRequestConfig)
      response = res.data
    } catch (err) {
      _responseErr = true
      return err
    }
  }

  if (!_responseErr) {
    // validate response
    if (validateResponse(response)) {
      resolveResponseErrorMessage(response)
    } else {
      // set error tip content
    }
  }

  if (transformResponseData) {
    return transformResponseData(response)
  }

  return response
}

export default request
