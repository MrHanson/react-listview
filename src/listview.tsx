import React, { FC, MutableRefObject, useState, useEffect, useRef } from 'react'

// components
import ListviewHeader from '@/components/listview-header.tsx'
import Filterbar from '@/components/filterbar.tsx'
import { Table } from 'antd'

// types
import {
  ListviewProps,
  FilterField,
  FilterbarProps,
  ValidateResponse,
  TransformResponseData,
  ResolveResponseErrorMessage,
  ContentDataMap
} from '@/listview.type'

// fetch
import fetch from '@/utils/fetch'

// utils
import { cloneDeep, omitBy, isPlainObject, merge } from 'lodash'
import { warn, error } from '@/utils/debug.ts'
import { dataMapping, isValidateFieldValues } from '@/utils/utils.ts'
import { TableEventListeners } from 'antd/es/table'

import './style.less'
const listviewMainPadding = 8
const listviewMainPaddingBottom = 4
const listviewMainBorderWidth = 4
const listviewMainYGapSize =
  listviewMainPadding + listviewMainPaddingBottom + listviewMainBorderWidth * 2

const listviewMainStyle = {
  padding: `${listviewMainPadding}px`,
  paddingBottom: `${listviewMainPaddingBottom}px`,
  border: `${listviewMainBorderWidth}px solid #f0f2f5`
}

// prettier-ignore
function resolveFilterModelGetters(fields: FilterField[], getters = {}): { [k: string]: any; } {
  return fields.reduce((result, field) => {
    if (Array.isArray(field)) {
      resolveFilterModelGetters(field, getters)
    } else {
      if (field.get && field.model) {
        result[field.model] = field.get
      }
    }
    return result
  }, getters)
}

// prettier-ignore
function applyFieldGetter(payloadData: { [k: string]: any }, getters: { [k: string]: any }): void {
  Object.keys(getters).forEach(key => {
    try {
      payloadData[key] = getters[key](payloadData[key], payloadData)
    } catch (e) {
      error(
        [
          `FilterFields '${key}' getter error:`,
          `  - Value: ${JSON.stringify(payloadData[key])}`,
          `  - Getter: ${getters[key].toString()}`,
          `  - Error: ${e}`
        ].join('\n')
      )
    }
  })
}

function responseFlowHandler(
  response: any,
  validateResponse: ValidateResponse,
  resolveResponseErrorMessage: ResolveResponseErrorMessage,
  contentDataMap: ContentDataMap,
  transformResponseData?: TransformResponseData
): { [k: string]: any } {
  if (validateResponse(response)) {
    let responseData = response.result || response
    if (transformResponseData) {
      responseData = transformResponseData(responseData)
    }
    return {
      isValidate: true,
      data: dataMapping(responseData, contentDataMap)
    }
  } else {
    return {
      isValidate: false,
      errMsg: resolveResponseErrorMessage(response)
    }
  }
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
  contentMessage = 'No Data',
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
  tableColumns = [],
  tableProps,
  rowSelection = { type: 'checkbox', fixed: true },
  usePage = true,
  pagination,
  pageSizeOptions = ['20', '50', '100'],
  pageSize = 20
}: ListviewProps) {
  // state
  const [loading, setLoading] = useState(false)
  const [contentHeight, setContentHeight] = useState()
  const [contentData, setContentData] = useState([])
  const [innerContentMessage, setInnerContentMessage] = useState(contentMessage)
  const [currentPageSize, setCurrentPageSize] = useState(pageSize)
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)

  // ref
  const listviewRef = useRef(null)
  const listviewHeaderRef = useRef(null)
  const filterbarRef = useRef(null)
  const antTblRef = useRef(null)

  const updateLayout = (): void => {
    const innerHeight = window.innerHeight

    const headerRefCur: MutableRefObject = listviewHeaderRef.current
    const headerHeight = headerRefCur?.getBoundingClientRect?.()?.height || 0

    const filterbarRefCur: MutableRefObject = filterbarRef.current
    const filterbarHeight = filterbarRefCur?.getBoundingClientRect?.()?.height || 0

    const listviewRefCur: MutableRefObject = listviewRef.current

    const antTblHeader = listviewRefCur.querySelector('.ant-table-body')
    const tblHeaderHeight = antTblHeader?.getBoundingClientRect?.()?.height || 0

    const antTblFooter = listviewRefCur.querySelector('.ant-table-footer')
    const tblFooterHeight = antTblFooter?.getBoundingClientRect?.()?.height || 0

    const antTblPlaceholder = listviewRefCur.querySelector('.ant-table-placeholder')

    // 8 for filterbarMarginBottom
    const contentHeight = innerHeight - listviewMainYGapSize - headerHeight - filterbarHeight - 8
    const placeHolderHeight = contentHeight - tblHeaderHeight - tblFooterHeight
    if (antTblPlaceholder) {
      antTblPlaceholder.style.height = placeHolderHeight + 'px'
      antTblPlaceholder.style.lineHeight = placeHolderHeight + 'px'
    }

    setContentHeight(contentHeight)
  }

  useEffect(() => {
    if (fullHeight) {
      updateLayout()
      window.addEventListener('resize', updateLayout)
    } else if (height) {
      setContentHeight(height)
    } else {
      window.removeEventListener('resize', updateLayout)
    }

    if (!requestUrl && !requestHandler) {
      warn('unavailable requestUrl & requestHandler, unable to reqeust')
    } else {
      let payloadData = cloneDeep(filterModel)

      const filterModelGetters = resolveFilterModelGetters(filterFields)
      applyFieldGetter(payloadData, filterModelGetters)

      // filter invalidate value
      payloadData = omitBy(payloadData, val => {
        !isValidateFieldValues(val)
      })

      let indexKey = 'page_index'
      let sizeKey = 'page_size'
      if (usePage) {
        if (isPlainObject(usePage)) {
          indexKey = usePage['pageIndex'] || 'page_index'
          sizeKey = usePage['pageSize'] || 'page_size'
        }
        payloadData[indexKey] = currentPage
        payloadData[sizeKey] = currentPageSize
      } else {
        delete payloadData[indexKey]
        delete payloadData[sizeKey]
      }

      const requestData = transformRequestData?.(payloadData)
      if (requestData === false) {
        return setLoading(false)
      }

      if (autoload) {
        setLoading(true)
        if (requestHandler) {
          requestHandler(requestData).then(res => {
            setLoading(false)

            const result = responseFlowHandler(
              res,
              validateResponse,
              resolveResponseErrorMessage,
              contentDataMap,
              transformResponseData
            )
            if (result.isValidate) {
              const { items, total } = result.data
              setContentData(items)
              setTotal(total)
            } else {
              setInnerContentMessage(result.errMsg)
            }
          })
        } else if (requestUrl) {
          fetch(requestUrl, requestMethod, requestConfig, requestData).then(res => {
            setLoading(false)

            const result = responseFlowHandler(
              res,
              validateResponse,
              resolveResponseErrorMessage,
              contentDataMap,
              transformResponseData
            )
            if (result.isValidate) {
              const { items, total } = result.data
              setContentData(items)
              setTotal(total)
            } else {
              setInnerContentMessage(result.errMsg)
            }
          })
        } else {
          setLoading(false)
        }
      }
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
    size: 'small',
    total,
    showTotal: function(total): string {
      return `Total：${total}`
    },
    onChange: function(page, pageSize): void {
      setCurrentPage(page)
      setCurrentPageSize(pageSize)

      /* To do: validateResponse, resolveResponseErrorMessage, transformResponseData, contentDataMap, contentMessage  */

      setLoading(false)
    }
  }, pagination) : {}

  // merge default tableProps with custom tableProps
  const _tableProps = merge(
    {
      size: 'small',
      locale: {
        emptyText: innerContentMessage
      },
      scroll: fullHeight,
      onRow: (record): TableEventListeners => ({
        onClick: (): void => {
          console.log(antTblRef.current)
        }
      })
    },
    tableProps
  )

  return (
    <div ref={listviewRef} className='listview'>
      <ListviewHeader ref={listviewHeaderRef} headerTitle={headerTitle} headerNav={headerNav} />
      <div style={listviewMainStyle} className='listview__main'>
        <Filterbar ref={filterbarRef} {...filterBarProps} />
        <Table
          style={{ height: contentHeight + 'px' }}
          ref={antTblRef}
          loading={loading}
          rowSelection={rowSelection}
          columns={tableColumns}
          dataSource={contentData}
          pagination={_pagination}
          bordered
          {..._tableProps}
        ></Table>
      </div>
    </div>
  )
}

export default Listview
