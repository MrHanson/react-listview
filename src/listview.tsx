import React, { FC, useState, useEffect } from 'react'

// components
import ListviewHeader from '@/components/listview-header'
import Filterbar from '@/components/filterbar'
import { Skeleton, Table } from 'antd'

// types
import { ListviewProps, FilterbarProps, RequestMethod } from '@/listview.type'

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
  // skeleton loading animation
  const [loading, setLoading] = useState(true)
  const [contentData, setContentData] = useState([])

  useEffect(() => {
    setLoading(false)

    // auto fetch table data
    // if (autoload) {
    // }
  }, [])

  const filterBarProps: FilterbarProps = {
    filterButtons,
    filterFields,
    filterModel,
    showFilterSearch,
    showFilterReset
  }

  return (
    <div className='listview'>
      {headerTitle && headerNav ? <ListviewHeader title={headerTitle} nav={headerNav} /> : ''}

      <div className='listview__main'>
        <Filterbar {...filterBarProps} />
        <Skeleton loading={loading} active>
          <Table
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions,
              pageSize,
              total: contentData.length,
              showTotal: function(total): string {
                return `合计：${total}`
              },
              onChange: function(page, pageSize): void {}
            }}
          ></Table>
        </Skeleton>
      </div>
    </div>
  )
}

export default Listview
