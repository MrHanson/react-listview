import React, { FC, ReactNode, Ref, forwardRef, useState, useRef, useEffect } from 'react'

import { FilterbarProps, AntButton, JsObject, FilterField, SelectOption } from '@/listview.type'

import { SearchOutlined, DownOutlined, CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
// prettier-ignore
import { Form, Button, Dropdown, Menu, AutoComplete, Cascader, Select, DatePicker, Input, Mentions, TreeSelect } from 'antd'
const { MonthPicker, RangePicker, WeekPicker } = DatePicker

import { merge } from 'lodash'

const renderButton = (item: AntButton, key?: string): ReactNode => {
  // prettier-ignore
  const { text, disabled, ghost, href, target, icon, loading, type, danger, onClick, block, children, onSelect } = item

  if (children) {
    const menu = (
      <Menu onClick={onSelect}>
        {children.map((child, index) => (
          <Menu.Item key={child.key || `MenuI${index}`}>{child.text}</Menu.Item>
        ))}
      </Menu>
    )
    return (
      <Dropdown overlay={menu}>
        <Button icon={icon} type={type} danger={danger} disabled={disabled}>
          {text}
          <DownOutlined />
        </Button>
      </Dropdown>
    )
  }

  return (
    <Button
      key={key}
      disabled={disabled}
      ghost={ghost}
      href={href}
      target={target}
      icon={icon}
      loading={loading}
      type={type}
      danger={danger}
      onClick={onClick}
      block={block}
    >
      {text}
    </Button>
  )
}

const renderField = (field: FilterField, key: string): ReactNode => {
  const type = field.type || ''
  const componentProps = merge(field.componentProps, {
    key: field.model,
    disabled: field.disabled,
    style: merge(
      {
        width: '220px'
      },
      field.style
    )
  })

  let Component
  switch (type) {
    case 'AutoComplete':
      Component = <AutoComplete allowClear placeholder={field.placeholder} {...componentProps} />
      break
    case 'Cascader':
      Component = <Cascader allowClear placeholder={field.placeholder} {...componentProps} />
      break
    case 'Select':
      Component = (
        <Select allowClear placeholder={field.placeholder} {...componentProps}>
          {Array.isArray(field.options) &&
            field?.options?.map((item: SelectOption) => (
              <Select.Option key={item.key} value={item.value}>
                {item.title}
              </Select.Option>
            ))}
        </Select>
      )
      break
    case 'DatePicker':
      Component = (
        <DatePicker allowClear placeholder={field.placeholder} {...componentProps}></DatePicker>
      )
      break
    case 'Input':
      Component = <Input allowClear placeholder={field.placeholder} {...componentProps}></Input>
      break
    case 'Mentions':
      Component = (
        <Mentions placeholder={field.placeholder} {...componentProps}>
          {Array.isArray(field.options) &&
            field?.options?.map((item: SelectOption) => (
              <Mentions.Option key={item.key} value={item.value}>
                {item.title}
              </Mentions.Option>
            ))}
        </Mentions>
      )
      break
    case 'TreeSelect':
      Component = (
        <TreeSelect allowClear placeholder={field.placeholder} {...componentProps}></TreeSelect>
      )
      break
    case 'MonthPicker':
      Component = (
        <MonthPicker allowClear placeholder={field.placeholder} {...componentProps}></MonthPicker>
      )
      break
    case 'RangePicker':
      Component = (
        <RangePicker
          allowClear
          placeholder={field.placeholderPair}
          {...componentProps}
        ></RangePicker>
      )
      break
    case 'WeekPicker':
      Component = (
        <WeekPicker allowClear placeholder={field.placeholder} {...componentProps}></WeekPicker>
      )
      break
  }

  return (
    <Form.Item className='filterbar__field' key={key} name={field.model} label={field.label}>
      {Component}
    </Form.Item>
  )
}

const Filterbar: FC<FilterbarProps> = function(
  {
    filterButtons = [],
    filterFields = [],
    filterbarFold = true,
    showFilterSearch = true,
    filterSearchText = 'Search',
    showFilterReset = true,
    filterResetText = 'Reset',
    prependSubmitSlot,
    appendSubmitSlot,
    onSearch = (_, { values }): void => {
      console.log('onSearch', values)
    }
  }: FilterbarProps,
  ref: Ref<any>
) {
  const [form] = Form.useForm()

  const filterbarFormRef = useRef(null)
  const filterbarSubmitRef = useRef(null)
  const [filterbarIsFold, setFilterbarIsFold] = useState(filterbarFold)
  const [filterbarHasMore, setFilterbarHasMore] = useState(false)
  const isNoneFields = filterFields.length === 0

  // To do: fix submit offset bug

  useEffect(() => {
    const filterbarFormRefCur: JsObject = filterbarFormRef.current || {}
    const filterbarFormHeight = filterbarFormRefCur?.getBoundingClientRect?.()?.height || 0
    if (filterbarFormHeight > 40) {
      setFilterbarHasMore(true)
    }
  }, [])

  return (
    <div
      ref={ref}
      className={`listview__filterbar ${
        filterbarIsFold && filterbarHasMore ? 'listview__filterbar--fold' : ''
      }`}
    >
      <Form.Provider
        onFormChange={(_, { changedFields }): void => {
          console.log('onFormChange', changedFields)
        }}
        onFormFinish={onSearch}
      >
        <Form name='filterbar_form' form={form}>
          {filterButtons.length > 0 ? (
            <div className='filterbar__buttons'>
              {filterButtons.map((item: any, i) => {
                if (item && Array.isArray(item)) {
                  const ButtonGroup = Button.Group
                  return (
                    <ButtonGroup key={'fBG' + i}>
                      {item.map((child, j) => renderButton(child, 'fBG' + i + j))}
                    </ButtonGroup>
                  )
                }
                return item ? renderButton(item, 'fB' + i) : null
              })}
            </div>
          ) : null}

          {showFilterSearch || showFilterReset || !!prependSubmitSlot || !!appendSubmitSlot ? (
            <div
              ref={filterbarSubmitRef}
              className={`filterbar__submit ${isNoneFields ? 'filterbar__submit--onleft' : ''}`}
            >
              <div className='filterbar__submit-btn'>
                {prependSubmitSlot}
                {showFilterSearch ? (
                  <Button type='primary' htmlType='submit' icon={<SearchOutlined />}>
                    {filterSearchText}
                  </Button>
                ) : null}
                {showFilterReset ? (
                  <Button
                    onClick={(): void => {
                      form?.resetFields?.()
                    }}
                  >
                    {filterResetText}
                  </Button>
                ) : null}
                {appendSubmitSlot}
              </div>
              <Button
                type='primary'
                className={filterbarHasMore ? '' : 'filterbar__submit--no-more'}
                icon={filterbarIsFold ? <CaretDownOutlined /> : <CaretUpOutlined />}
                onClick={(): void => {
                  setFilterbarIsFold(filterbarIsFold => !filterbarIsFold)
                  window.dispatchEvent(new Event('resize'))
                }}
              ></Button>
            </div>
          ) : null}

          {filterFields.length > 0 ? (
            <div className='filterbar__form' ref={filterbarFormRef}>
              {filterFields.map(
                (field: FilterField, i): ReactNode => renderField(field, `field-${i}`)
              )}
            </div>
          ) : null}
        </Form>
      </Form.Provider>
    </div>
  )
}

export default forwardRef(Filterbar)
