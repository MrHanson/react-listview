import React, { FC } from 'react'

// components
import ListviewHeader from '@/components/listview-header'

// types
import { ListviewProps } from '@/listview.type'

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
  filterButtons,
  filterFields,
  filterModel = {},
  showFilterSearch = true,
  showFilterReset = false,
  tableColumns = [],
  tableProps,
  tableEvents,
  tableSelectionColumn = true,
  usePage = true,
  pageSizes = [20, 50, 100],
  pageSize = 20
}: ListviewProps) {
  return (
    <div className='listview'>
      <ListviewHeader title={headerTitle} nav={headerNav} />

      <div className='listview__main'></div>
    </div>
  )
}

export default Listview
