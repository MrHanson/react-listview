import React, { FC, useState, useEffect } from 'react'

// components
import ListviewHeader from '@/components/listview-header'
import Filterbar from '@/components/filterbar'
import { Table } from 'antd'

// types
import { ListviewProps, FilterField, FilterbarProps } from '@/listview.type'

// hooks
import useAxios from '@/hooks/useAxios'

// utils
import { cloneDeep, omitBy, isPlainObject, merge } from 'lodash'
import { warn, error } from '@/utils/debug'
import { dataMapping, isValidateFieldValues } from '@/utils/utils'

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
  showFilterReset = true,
  tableColumns = [],
  tableProps,
  tableEvents,
  tableSelectionColumn = true,
  usePage = true,
  pageSizeOptions = ['20', '50', '100'],
  pageSize = 20
}: ListviewProps) {
  const [loading, setLoading] = useState(true)
  const [contentData, setContentData] = useState([])
  const [currentPageSize, setCurrentPageSize] = useState(pageSize)
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [tableSelection, setTableSelection] = useState([])

  if (!requestUrl && !requestHandler) {
    warn('unavailable requestUrl & requestHandler, unable to reqeust')
  } else {
    useEffect(() => {
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
        // prettier-ignore
        const [response, loadingStatus] = useAxios(requestUrl, requestMethod, requestConfig, requestHandler)

        /* To do: validateResponse, resolveResponseErrorMessage, transformResponseData, contentDataMap, contentMessage  */

        setLoading(loadingStatus)
        setContentData(response)
      }
    }, [])
  }

  const filterBarProps: FilterbarProps = {
    filterButtons,
    filterFields,
    filterModel,
    showFilterSearch,
    showFilterReset
  }

  /* set default tableProps & default tableEvents */
  let rowSelection = {}
  if (tableSelectionColumn === true) {
    rowSelection = {
      selectedRowKeys: tableSelection,
      onChange: (selectedRowKeys, selectedRows): void => {
        setTableSelection(selectedRows)
      }
    }
  }

  // prettier-ignore
  const pagination = usePage ? {
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions,
    currentPageSize,
    total,
    showTotal: function(total): string {
      return `Total：${total}`
    },
    onChange: function(page, pageSize): void {
      // request
    }
  } : {}

  return (
    <div className='listview'>
      <ListviewHeader title={headerTitle} nav={headerNav} />
      <div className='listview__main'>
        <Filterbar {...filterBarProps} />
        <Table
          loading={loading}
          rowSelection={rowSelection}
          columns={tableColumns}
          dataSource={contentData}
          pagination={pagination}
          bordered
        ></Table>
      </div>
    </div>
  )
}

export default Listview
