import React, { FC } from 'react'
import { ListviewHeaderProps } from '@/listview.type'
import { Breadcrumb } from 'antd'
import BreadcrumbItem from 'antd/lib/breadcrumb/BreadcrumbItem'

const ListviewHeader: FC<ListviewHeaderProps> = function({ title, nav }: ListviewHeaderProps) {
  return (
    <div className='listview__header'>
      <h1>{title}</h1>
      <Breadcrumb>
        {nav.map((item, index) => (
          <BreadcrumbItem key={'BI' + index}>{item}</BreadcrumbItem>
        ))}
      </Breadcrumb>
    </div>
  )
}

export default ListviewHeader
