import React, { FC, useState, useEffect } from 'react'

// components
import ListviewHeader from '@/components/listview-header'
import Filterbar from '@/components/filterbar'
import { Skeleton, Table } from 'antd'

// types
import { ListviewProps, FilterbarProps } from '@/listview.type'

// utils
import request from '@/utils/request'

const Listview: FC<ListviewProps> = function({
  headerTitle,
  headerNav,
  height,
  fullHeight = true,
  autoload = true,
  requestUrl,
  requestMethod = 'get',
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

  useEffect(() => {
    setLoading(false)

    // auto fetch table data
    if (autoload) {
      request(
        {
          url: requestUrl,
          method: requestMethod
        },
        requestHandler,
        transformRequestData,
        validateResponse,
        resolveResponseErrorMessage,
        transformResponseData,
        contentDataMap
      ).then((res) => {
        if (typeof res === 'string') {
          // contentMessage to do
        } else {
          setContentData(res.items)
          setTotal(res.total)
        }
      })
    }
  }, [])

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
    onChange: function(page, pageSize): void {}
  } : {}

  return (
    <div className='listview'>
      {headerTitle && headerNav ? <ListviewHeader title={headerTitle} nav={headerNav} /> : ''}

      <div className='listview__main'>
        <Filterbar {...filterBarProps} />
        <Skeleton loading={loading} active>
          <Table dataSource={contentData} pagination={pagination}></Table>
        </Skeleton>
      </div>
    </div>
  )
}

export default Listview
