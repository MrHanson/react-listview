import React, { FC, useState, useEffect } from 'react'

// components
import ListviewHeader from '@/components/listview-header'
import Filterbar from '@/components/filterbar'
import { Skeleton, Table } from 'antd'

// types
import { ListviewProps, FilterbarProps } from '@/listview.type'

// hooks
import useAxios from '@/hooks/useAxios'

// utils
import { warn } from '@/utils/debug'
import fetch from '@/utils/fetch'
import { dataMapping } from '@/utils/utils'

const DEFAULT_PROPS = {
  validateResponse: (response): boolean => (response.is_success ? true : false),
  resolveResponseErrorMessage: (response): string => response?.error_info?.msg || 'unknown error',
  contentDataMap: { items: 'result.items', total: 'result.total_count' }
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
  contentDataMap,
  contentMessage = null,
  validateResponse,
  resolveResponseErrorMessage,
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
  const [total, setTotal] = useState(0)

  if (!requestUrl && !requestHandler) {
    warn('unavailable requestUrl & requestHandler ，unable to reqeust')
  } else {
    useEffect(() => {
      setLoading(false)

      if (autoload) {
        useAxios(
          requestUrl || '',
          requestMethod,
          requestConfig || {},
          requestHandler,
          transformRequestData,
          transformResponseData,
          contentDataMap,
          contentMessage,
          validateResponse,
          resolveResponseErrorMessage
        )
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

  // prettier-ignore
  const pagination = usePage ? {
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions,
    pageSize,
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
      {headerTitle && headerNav ? <ListviewHeader title={headerTitle} nav={headerNav} /> : ''}

      <div className='listview__main'>
        <Filterbar {...filterBarProps} />
        <Skeleton loading={loading} active>
          <Table
            columns={tableColumns}
            dataSource={contentData}
            pagination={pagination}
            bordered
          ></Table>
        </Skeleton>
      </div>
    </div>
  )
}

export default Listview
