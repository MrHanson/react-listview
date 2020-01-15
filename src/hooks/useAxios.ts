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
    setLoadingStatus(true)
    if (requestHandler) {
      requestHandler().then(res => {
        setLoadingStatus(false)
        setResponse(res)
      })
    } else if (requestUrl) {
      fetch(requestUrl, requestMethod, requestConfig).then(res => {
        setLoadingStatus(false)
        setResponse(res)
      })
    } else {
      setLoadingStatus(false)
    }
  }, [])

  return { response, loadingStatus }
}
