import React from 'react'
import { render } from 'react-dom'
import Listview from '@/listview'
import { ListviewProps } from '@/listview.type'

const listviewConfig: ListviewProps = {
  headerTitle: 'Demo',
  headerNav: ['father', 'child']
}

render(<Listview {...listviewConfig} />, document.querySelector('#root'))
