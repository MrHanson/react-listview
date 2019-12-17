import React, { FC } from 'react'
import { ListviewHeaderProps } from '@/listview.type'
import { Breadcrumb } from 'antd'

const ListviewHeader: FC<ListviewHeaderProps> = function({ title, nav }: ListviewHeaderProps) {
  return (
    <div className='listview__header'>
      <h1 className='listview__title'>{title}</h1>
      <Breadcrumb>
        {nav.map((item, index) => (
          <Breadcrumb.Item key={'BI' + index}>{item}</Breadcrumb.Item>
        ))}
      </Breadcrumb>
    </div>
  )
}

export default ListviewHeader
