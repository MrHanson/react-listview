import React, { FC } from 'react'
import { ListviewHeaderProps } from '@/listview.type'
import { Breadcrumb } from 'antd'

const ListviewHeader: FC<ListviewHeaderProps> = function({
  headerTitle,
  headerNav
}: ListviewHeaderProps) {
  let BreadCrumb

  if (Array.isArray(headerNav) && headerNav.length > 0) {
    BreadCrumb = (
      <Breadcrumb>
        {headerNav.map((item, index) => (
          <Breadcrumb.Item key={'BI' + index}>{item}</Breadcrumb.Item>
        ))}
      </Breadcrumb>
    )
  } else if (headerNav) {
    BreadCrumb = (
      <Breadcrumb separator={headerNav['separator']}>
        {headerNav['children'].map((item, index) => (
          <Breadcrumb.Item key={'BI' + index}>{item}</Breadcrumb.Item>
        ))}
      </Breadcrumb>
    )
  }

  return (
    <div className='listview__header'>
      {headerTitle ? <h1 className='listview__title'>{headerTitle}</h1> : ''}
      {BreadCrumb}
    </div>
  )
}

export default ListviewHeader
