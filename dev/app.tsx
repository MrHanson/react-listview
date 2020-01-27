import React, { ReactNode } from 'react'
import { render } from 'react-dom'
import Listview from '@/listview'
import { ListviewProps } from '@/listview.type'

const treeData = [
  {
    title: 'Node1',
    value: '0-0',
    key: '0-0',
    children: [
      {
        title: 'Child Node1',
        value: '0-0-0',
        key: '0-0-0'
      }
    ]
  },
  {
    title: 'Node2',
    value: '0-1',
    key: '0-1',
    children: [
      {
        title: 'Child Node3',
        value: '0-1-0',
        key: '0-1-0'
      },
      {
        title: 'Child Node4',
        value: '0-1-1',
        key: '0-1-1'
      },
      {
        title: 'Child Node5',
        value: '0-1-2',
        key: '0-1-2'
      }
    ]
  }
]

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
  ],
  filterFields: [
    {
      type: 'input',
      label: 'Input1',
      model: 'input1',
      placeholder: 'input1',
      onChange(val): void {
        console.log('Input1', val)
      }
    },
    {
      type: 'select',
      label: 'Select2',
      model: 'Select2',
      placeholder: 'select2',
      options: [
        {
          key: 'option1',
          title: 'option1',
          value: 'option1'
        },
        {
          key: 'option2',
          title: 'option2',
          value: 'option2'
        }
      ],
      onChange(val): void {
        console.log('Select2', val)
      }
    },
    {
      type: 'inputNumber',
      label: 'inputNumber3',
      model: 'inputNumber3',
      placeholder: 'inputNumber3',
      onChange(val): void {
        console.log('Select2', val)
      }
    },
    {
      type: 'datePicker',
      label: 'datePicker4',
      model: 'datePicker4',
      placeholder: 'datePicker4',
      onChange(val): void {
        console.log('Select2', val)
      }
    },
    {
      type: 'treeSelect',
      label: 'treeSelect5',
      model: 'treeSelect5',
      placeholder: 'treeSelect5',
      style: {
        width: 350,
        maxHeight: 33,
        overflow: 'auto'
      },
      componentProps: {
        treeData,
        treeCheckable: true,
        maxTagCount: 2,
        maxTagPlaceholder(values): ReactNode {
          console.log('maxTagPlaceholder', values)
          return `${values?.length} More`
        }
      },
      onChange(val): void {
        console.log(val)
      }
    },
    {
      type: 'weekPicker',
      label: 'weekPicker6',
      model: 'weekPicker6',
      placeholder: 'weekPicker6',
      onChange(val): void {
        console.log('weekPicker6', val)
      }
    }
  ]
}

render(<Listview {...listviewConfig} />, document.querySelector('#root'))
