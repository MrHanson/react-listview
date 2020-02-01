import React from 'react'
import { render } from 'react-dom'
import Listview from '@/listview'
import { ListviewProps } from '@/listview.type'

function App(): any {
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
      [
        {
          type: 'primary',
          text: 'Left'
        },
        {
          type: 'primary',
          text: 'Right'
        }
      ],
      {
        text: 'Default'
      },
      {
        danger: true,
        type: 'primary',
        text: 'Danger'
      }
    ],
    filterFields: [
      {
        model: 'input1',
        type: 'Input',
        placeholder: 'Input1'
      },
      {
        model: 'input2',
        type: 'Input',
        placeholder: 'Input2'
      },
      {
        model: 'input3',
        type: 'Input',
        placeholder: 'Input3'
      },
      {
        model: 'selectA',
        type: 'Select',
        placeholder: 'SelectA',
        options: new Array(2).fill(0).map((_, index) => ({
          title: `optionA${index}`,
          value: `optionA${index}`,
          key: `optionA${index}`
        }))
      },
      {
        model: 'selectB',
        type: 'Select',
        placeholder: 'SelectB',
        options: new Array(4).fill(0).map((_, index) => ({
          title: `optionB${index}`,
          value: `optionB${index}`,
          key: `optionB${index}`
        }))
      },
      {
        model: 'dateRange',
        type: 'RangePicker',
        placeholderPair: ['起始日期', '终止日期']
      },
      {
        model: 'treeData',
        type: 'TreeSelect',
        placeholder: 'TreeData',
        componentProps: {
          treeData
        }
      }
    ]
  }

  return <Listview {...listviewConfig} />
}

render(<App />, document.querySelector('#root'))
