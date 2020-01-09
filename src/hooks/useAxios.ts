import { useState, useEffect } from 'react'
import { AxiosRequestConfig, Method } from 'axios'
import { RequestHandler } from '@/listview.type'

import fetch from '@/utils/fetch'

export default function useAxios(
  requestUrl?: string,
  requestMethod: Method = 'get',
  requestConfig?: AxiosRequestConfig,
  requestHandler?: RequestHandler
): any {
  const [response, setResponse] = useState(null)
  const [loadingStatus, setLoadingStatus] = useState(true)

  useEffect(() => {
    if (requestHandler) {
      setLoadingStatus(true)
      requestHandler().then(res => {
        setLoadingStatus(false)
        setResponse(res)
      })
    } else if (requestUrl) {
      setLoadingStatus(true)
      fetch(requestUrl, requestMethod, requestConfig).then(res => {
        setLoadingStatus(false)
        setResponse(res)
      })
    } else {
      setLoadingStatus(false)
    }
  }, [response, loadingStatus])

  return [response, loadingStatus]
}
