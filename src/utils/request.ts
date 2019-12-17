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
  ResolveResponseErrorMessage,
  ContentDataMap
} from '@/listview.type'
import { dataMapping } from './utils'

let _requestCancelToken

const DEFAULT_PROPS = {
  validateResponse: (response): boolean => (response.is_success ? true : false),
  resolveResponseErrorMessage: (response): string => response?.error_info?.msg || 'unknown error',
  contentDataMap: { items: 'result.items', total: 'result.total_count' }
}

async function request(
  requestConfig: AxiosRequestConfig,
  requestHandler?: RequestHandler,
  transformRequestData?: TransformRequestData,
  validateResponse: ValidateResponse = DEFAULT_PROPS.validateResponse,
  resolveResponseErrorMessage: ResolveResponseErrorMessage = DEFAULT_PROPS.resolveResponseErrorMessage,
  transformResponseData?: TransformResponseData,
  contentDataMap: ContentDataMap = DEFAULT_PROPS.contentDataMap
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

  let contentResponse
  if (!_responseErr) {
    // validate response
    if (validateResponse(response)) {
      contentResponse = transformResponseData?.(response) || response
    } else {
      resolveResponseErrorMessage?.(response)
    }
  }

  return dataMapping(contentResponse, contentDataMap)
}

export default request
