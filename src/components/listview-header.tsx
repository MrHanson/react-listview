import React, { FC, Ref, forwardRef } from 'react'
import { ListviewHeaderProps } from '@/listview.type'
import { Breadcrumb } from 'antd'

const ListviewHeader: FC<ListviewHeaderProps> = function(
  { headerTitle, headerNav }: ListviewHeaderProps,
  ref: Ref<any>
) {
  let BreadcrumbArr

  if (Array.isArray(headerNav) && headerNav.length > 0) {
    BreadcrumbArr = (
      <Breadcrumb>
        {headerNav.map((item, index) => (
          <Breadcrumb.Item key={'BI' + index}>{item}</Breadcrumb.Item>
        ))}
      </Breadcrumb>
    )
  } else if (headerNav) {
    BreadcrumbArr = (
      <Breadcrumb separator={headerNav['separator']}>
        {headerNav['children'].map((item, index) => (
          <Breadcrumb.Item key={'BI' + index}>{item}</Breadcrumb.Item>
        ))}
      </Breadcrumb>
    )
  }

  return (
    <div className='listview__header' ref={ref}>
      {headerTitle ? <h1 className='listview__title'>{headerTitle}</h1> : null}
      {BreadcrumbArr ? <div className='listview__breadcrumb'>{BreadcrumbArr}</div> : null}
    </div>
  )
}

export default forwardRef(ListviewHeader)
