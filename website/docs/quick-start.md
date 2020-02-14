---
id: quick-start
title: Quick Start
sidebar_label: Quick start
---

A React component to gennerate listview layout based on [AntD](<(https://github.com/ant-design/ant-design/)>) & [hooks](<(https://reactjs.org/docs/hooks-intro.html)>) & [Typescript](https://www.typescriptlang.org/).

![demo-pic](/img/demo-pic.png)

> Using table as default layout, customizing layout by `props.children`

## Install

```bash
yarn add @mrhanson/react-listview antd

# OR

npm i -S @mrhanson/react-listview antd
```

## Example

```ts
// *.tsx
import React, { ReactNode } from 'react'
import { render } from 'react-dom'
import Listview from '@mrhanson/react-listview'
import { ListviewProps } from '@mrhanson/react-listview/listview.type'

function App(): ReactNode {
  const listviewConfig: ListviewProps = {
    headerTitle: 'Demo',
    headerNav: ['father', 'child'],
    requestUrl: '/mock/listview',
    requestMethod: 'post'
    /** ...other props **/
  }
  return <Listview {...listviewConfig} />
}

render(<App />, document.querySelector('#root'))
```
