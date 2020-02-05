import React, { FC, useState, useEffect, useRef, ReactNode } from 'react'

// components
import ListviewHeader from '@/components/listview-header.tsx'
import Filterbar from '@/components/filterbar.tsx'
import { Table, Alert } from 'antd'

// types
import { AxiosResponse } from 'axios'
import { ListviewProps, FilterbarProps, PlainObject } from '@/listview.type'

// utils
import { cloneDeep, isPlainObject, merge } from 'lodash'
import { warn } from '@/utils/debug.ts'
import {
  resolveFilterModelGetters,
  applyFieldGetter,
  dataMapping,
  isValidatedFieldValues,
  parseSize
} from '@/utils/utils.ts'

// fetch
import fetch from '@/utils/fetch'

import './style.less'

const filterbarMarginBottom = 8
const listviewMainPadding = 8
const listviewMainPaddingBottom = 4
const listviewMainBorderWidth = 4
const listviewPaginationHeight = 64
const listviewMainYGapSize =
  listviewMainPadding + listviewMainPaddingBottom + listviewMainBorderWidth * 2

const listviewMainStyle = {
  padding: `${listviewMainPadding}px`,
  paddingBottom: `${listviewMainPaddingBottom}px`,
  border: `${listviewMainBorderWidth}px solid #f0f2f5`
}

const Listview: FC<ListviewProps> = function({
  headerTitle,
  headerNav,
  height,
  fullHeight = true,
  autoload = true,
  requestUrl,
  requestMethod = 'GET',
  requestConfig,
  requestHandler,
  transformRequestData,
  transformResponseData,
  contentDataMap = { items: 'result.items', total: 'result.total_count' },
  contentMessage = 'Unknow error',
  validateResponse = (response): boolean =>
    response.is_success || response.success ? true : false,
  resolveResponseErrorMessage = (response): string => response?.error_info?.msg || 'unknown error',
  filterButtons = [],
  filterFields = [],
  filterModel = {},
  showFilterSearch = true,
  filterSearchText = 'Search',
  showFilterReset = true,
  filterResetText = 'Reset',
  prependSubmitSlot,
  appendSubmitSlot,
  filterbarFold = true,
  onSearch,
  onChange,
  tableColumns = [],
  tableRowKey = 'id',
  tableProps,
  usePage = true,
  pagination,
  pageSizeOptions = ['20', '50', '100'],
  pageSize = 20
}: ListviewProps) {
  const [contentHeight, setContentHeight] = useState(parseSize(height))
  // ref
  const listviewRef = useRef(null)
  const listviewHeaderRef = useRef(null)
  const filterbarRef = useRef(null)

  const updateLayout = function(): void {
    requestAnimationFrame(() => {
      const innerHeight = window.innerHeight

      const headerRefCur: PlainObject = listviewHeaderRef.current || {}
      const headerHeight = headerRefCur?.getBoundingClientRect?.()?.height || 0

      const filterbarRefCur: PlainObject = filterbarRef.current || {}
      const filterbarHeight = filterbarRefCur?.getBoundingClientRect?.()?.height || 0

      const listviewRefCur: PlainObject = listviewRef.current || {}

      // 8 for filterbarMarginBottom, 64 for pagination
      const innerContentHeight =
        innerHeight -
        listviewMainYGapSize -
        headerHeight -
        filterbarHeight -
        filterbarMarginBottom -
        listviewPaginationHeight
      setContentHeight(parseSize(innerContentHeight))

      const antTblContentRef = listviewRefCur?.querySelector?.('.ant-table-content')
      if (antTblContentRef) {
        const antMainTbl = antTblContentRef?.querySelector?.('table')
        antMainTbl.style.height = parseSize(innerContentHeight)
      }
    })
  }

  // state
  const [model, setModel] = useState(filterModel)
  const [isLoading, setIsLoading] = useState(false)
  const contentDataInit: Array<any> = []
  const [contentData, setContentData] = useState(contentDataInit)
  const [innerContentMessage, setInnerContentMessage] = useState(contentMessage)
  const [currentPageSize, setCurrentPageSize] = useState(pageSize)
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)

  const beforeRequest = function(
    payload: PlainObject,
    pageIndex: number,
    pageSize: number
  ): PlainObject {
    const _payload = cloneDeep(payload)
    const filterModelGetters = resolveFilterModelGetters(filterFields, _payload)
    applyFieldGetter(_payload, filterModelGetters)

    // filter invalidate value
    for (const key in _payload) {
      if (!isValidatedFieldValues(_payload[key])) {
        delete _payload[key]
      }
    }

    let indexKey = 'page_index'
    let sizeKey = 'page_size'
    if (usePage) {
      if (isPlainObject(usePage)) {
        indexKey = usePage['pageIndex'] || 'page_index'
        sizeKey = usePage['pageSize'] || 'page_size'
      }
      _payload[indexKey] = pageIndex
      _payload[sizeKey] = pageSize
    } else {
      delete _payload[indexKey]
      delete _payload[sizeKey]
    }

    return transformRequestData?.(_payload) || _payload
  }

  const afterRequest = function(
    res
  ): {
    items: Array<any>
    total: number
    errorMsg: string
  } {
    const itemsInit: Array<any> = []
    let result = { items: itemsInit, total: 0, errorMsg: '' }
    const response = res.data
    if (validateResponse(response)) {
      const { items, total } = dataMapping(response, contentDataMap)
      result['items'] = items
      result['total'] = total

      result = transformResponseData?.(result) || result
    } else {
      result['errorMsg'] = resolveResponseErrorMessage(response)
    }

    return result
  }

  const renderTableBody = function(contentMessage): any {
    // return <Alert message={contentMessage} />
    return <div className='alert'></div>
  }

  const exeRequest = function(payloadData, pageIndex: number, pageSize: number): void {
    if (!requestUrl && !requestHandler) {
      return warn('unavailable requestUrl & requestHandler, unable to reqeust')
    }

    const payload = beforeRequest(payloadData, pageIndex, pageSize)
    try {
      if (requestUrl) {
        // prettier-ignore
        const { axiosService, axiosConfig } = fetch(requestUrl, requestMethod, requestConfig, payload)
        setIsLoading(true)
        axiosService(axiosConfig).then((axiosRes: AxiosResponse) => {
          setIsLoading(false)
          const { items, total, errorMsg } = afterRequest(axiosRes)
          setContentData(items)
          setTotal(total)
          setInnerContentMessage(errorMsg)
        })
      } else if (requestHandler) {
        setIsLoading(true)
        requestHandler().then(res => {
          setIsLoading(false)
          const { items, total, errorMsg } = afterRequest(res)
          setContentData(items)
          setTotal(total)
          setInnerContentMessage(errorMsg)
        })
      }
    } catch (e) {
      setIsLoading(false)
      setInnerContentMessage(e)
    }
  }

  useEffect(() => {
    if (fullHeight) {
      updateLayout()
      window.addEventListener('resize', updateLayout)
    } else {
      window.removeEventListener('resize', updateLayout)
    }

    if (autoload) {
      exeRequest(model, currentPage, currentPageSize)
    }
  }, [])

  const filterBarProps: FilterbarProps = {
    filterButtons,
    filterFields,
    filterModel,
    showFilterSearch,
    filterSearchText,
    showFilterReset,
    filterResetText,
    prependSubmitSlot,
    appendSubmitSlot,
    filterbarFold
  }

  // merge default pagination with custom pagination
  // prettier-ignore
  const _pagination = usePage ? merge({
    position: 'bottom',
    defaultPageSize: pageSize,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions,
    simple: false,
    total,
    showTotal: function(total: number): string {
      return `Total：${total}`
    },
    onChange: function(page: number, pageSize: number): void {
      setCurrentPage(page)
      exeRequest(model, page, pageSize)
    },
    onShowSizeChange: function(_, size: number): void {
      setCurrentPageSize(size)
      exeRequest(model, 1, size)
    }
  }, pagination) : {}

  return (
    <div ref={listviewRef} className='listview'>
      <ListviewHeader ref={listviewHeaderRef} headerTitle={headerTitle} headerNav={headerNav} />
      <div style={listviewMainStyle} className='listview__main'>
        <Filterbar
          ref={filterbarRef}
          {...filterBarProps}
          onSearch={(formName, info): void => {
            setModel(info.values)
            exeRequest(info.values, currentPage, currentPageSize)
            onSearch?.(formName, info)
          }}
          onChange={onChange}
        />
        <Table
          style={{ height: contentHeight }}
          loading={isLoading}
          scroll={{ y: parseFloat(contentHeight) - listviewPaginationHeight }}
          columns={tableColumns}
          dataSource={contentData}
          rowSelection={{ type: 'checkbox' }}
          rowKey={tableRowKey}
          // components={{ header: { wrapper: renderTableBody(innerContentMessage) } }}
          pagination={_pagination}
          bordered
          {...tableProps}
        ></Table>
      </div>
    </div>
  )
}

export default Listview
