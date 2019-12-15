import React, { FC } from 'react'
import { Breadcrumb } from 'antd'
import BreadcrumbItem from 'antd/lib/breadcrumb/BreadcrumbItem'

interface ListviewHeaderProps {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nav: Array<any>;
}

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
