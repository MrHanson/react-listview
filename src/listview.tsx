import React, { FC, useState, useEffect, useMemo, useRef } from 'react'

// components
import ListviewHeader from '@/components/listview-header.tsx'
import Filterbar from '@/components/filterbar.tsx'
import { Table } from 'antd'

// types
import { ListviewProps, FilterField, FilterbarProps } from '@/listview.type'

// hooks
import useAxios from '@/hooks/useAxios'

// utils
import { cloneDeep, omitBy, isPlainObject, merge } from 'lodash'
import { warn, error } from '@/utils/debug.ts'
import { dataMapping, isValidateFieldValues } from '@/utils/utils.ts'
import { TableEventListeners } from 'antd/es/table'

import './style.less'

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
  contentMessage = null,
  validateResponse = (response): boolean => (response.is_success ? true : false),
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
  const [contentData, setContentData] = useState([])
  const [currentPageSize, setCurrentPageSize] = useState(pageSize)
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)

  // computed
  const tableHeight = '300px'

  // ref
  const listviewHeaderRef = useRef(null)
  const filterbarRef = useRef(null)
  const antTblRef = useRef(null)

  const updateLayout = (): void => {
    const innerHeight = window.innerHeight
    const contentHeight = innerHeight - listviewHeaderRef.current.offsetHeight
  }

  useEffect(() => {
    if (fullHeight) {
      updateLayout()
      window.addEventListener('resize', updateLayout)
    } else {
      window.removeEventListener('resize', updateLayout)
    }
  }, [])

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
      setLoading(false)
    }

    if (autoload) {
      setLoading(true)
      // prettier-ignore
      const { response, loadingStatus } = useAxios(requestUrl, requestMethod, requestConfig, requestHandler)
      /* To do: validateResponse, resolveResponseErrorMessage, transformResponseData, contentDataMap, contentMessage  */

      setLoading(loadingStatus)
      setContentData(response)
    }
  }

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

      // prettier-ignore
      const [response, loadingStatus] = useAxios(requestUrl, requestMethod, requestConfig, requestHandler)

      /* To do: validateResponse, resolveResponseErrorMessage, transformResponseData, contentDataMap, contentMessage  */

      setLoading(loadingStatus)
      setContentData(response)
    }
  }, pagination) : {}

  // merge default tableProps with custom tableProps
  const _tableProps = merge(
    {
      size: 'small',
      locale: {
        emptyText: '暂无数据'
      },
      scroll: fullHeight,
      onRow: (record): TableEventListeners => ({
        onClick: (): void => {
          console.log(antTblRef.current)
        }
      }),
      footer: currentData => 'Footer'
    },
    tableProps
  )

  return (
    <div className='listview'>
      <ListviewHeader ref={listviewHeaderRef} headerTitle={headerTitle} headerNav={headerNav} />
      <div className='listview__main'>
        <Filterbar ref={filterbarRef} {...filterBarProps} />
        <Table
          style={{ height: tableHeight }}
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
