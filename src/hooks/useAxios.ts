import { useState, useEffect } from 'react'
import { AxiosRequestConfig, Method } from 'axios'
import {
  RequestHandler,
  TransformRequestData,
  TransformResponseData,
  ContentDataMap,
  ValidateResponse,
  ResolveResponseErrorMessage
} from '@/listview.type'

import fetch from '@/utils/fetch'

export default function useAxios(
  requestUrl: string,
  requestMethod: Method,
  requestConfig: AxiosRequestConfig,
  requestHandler?: RequestHandler,
  transformRequestData?: TransformRequestData,
  transformResponseData?: TransformResponseData,
  contentDataMap?: ContentDataMap,
  contentMessage: null | string = null,
  validateResponse?: ValidateResponse,
  resolveResponseErrorMessage?: ResolveResponseErrorMessage
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  const [response, setResponse] = useState(null)
  useEffect(() => {
    if (requestHandler) {
      requestHandler().then(res => {
        setResponse(res)
      })
    } else {
      fetch(requestUrl, requestMethod, requestConfig).then(res => {
        setResponse(res)
      })
    }
  }, [response])

  return response
}
