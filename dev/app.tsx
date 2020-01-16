import React from 'react'
import { render } from 'react-dom'
import Listview from '@/listview'
import { ListviewProps } from '@/listview.type'

const listviewConfig: ListviewProps = {
  headerTitle: 'Demo',
  headerNav: ['father', 'child'],
  filterButtons: [
    {
      text: 'A',
      icon: 'file-add',
      type: 'primary'
    },
    {
      children: [
        { text: 'B', icon: 'export', type: 'dashed' },
        { text: 'C', icon: 'printer' }
      ]
    },
    {
      text: 'D',
      type: 'danger'
    }
  ]
}

render(<Listview {...listviewConfig} />, document.querySelector('#root'))
