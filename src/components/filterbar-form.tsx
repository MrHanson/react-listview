import React, { FC, ReactNode } from 'react'
import { FilterbarFormProps, FilterField, SelectOption } from '@/listview.type'

// prettier-ignore
import { AutoComplete, Cascader, Select, DatePicker, Input, InputNumber, Mentions, TreeSelect, Form } from 'antd'
const { MonthPicker, RangePicker, WeekPicker } = DatePicker

import { isFunction, camelCase } from 'lodash'

const getFieldComponent = (field: FilterField): ReactNode => {
  const key = field.key || field.model || null
  const fieldKey = camelCase(key || undefined)
  const type = field.type
  const componentProps = field.componentProps || {}

  if (type) {
    let component
    switch (type) {
      case 'autoComplete':
        component = (
          <AutoComplete
            allowClear
            key={fieldKey}
            style={{ width: 200 }}
            disabled={field.disabled}
            placeholder={field.placeholder}
            onChange={field.onChange}
            {...componentProps}
          ></AutoComplete>
        )
        break
      case 'cascader':
        component = (
          <Cascader
            allowClear
            key={fieldKey}
            style={{ width: 250 }}
            disabled={field.disabled}
            placeholder={field.placeholder}
            onChange={field.onChange}
            {...componentProps}
          ></Cascader>
        )
        break
      case 'datePicker':
        component = (
          <DatePicker
            allowClear
            key={fieldKey}
            disabled={field.disabled}
            placeholder={field.placeholder}
            onChange={field.onChange}
            {...componentProps}
          ></DatePicker>
        )
        break
      case 'monthPicker':
        component = (
          <MonthPicker
            allowClear
            key={fieldKey}
            disabled={field.disabled}
            placeholder={field.placeholder}
            onChange={field.onChange}
            {...componentProps}
          ></MonthPicker>
        )
        break
      case 'rangePicker':
        component = (
          <RangePicker
            allowClear
            key={fieldKey}
            disabled={field.disabled}
            placeholder={field.placeholderPair}
            onChange={field.onChange}
            {...componentProps}
          ></RangePicker>
        )
        break
      case 'weekPicker':
        component = (
          <WeekPicker
            allowClear
            key={fieldKey}
            disabled={field.disabled}
            placeholder={field.placeholder}
            onChange={field.onChange}
            {...componentProps}
          ></WeekPicker>
        )
        break
      case 'inputNumber':
        component = (
          <InputNumber
            key={fieldKey}
            disabled={field.disabled}
            placeholder={field.placeholder}
            onChange={field.onChange}
            {...componentProps}
          ></InputNumber>
        )
        break
      case 'input':
        component = (
          <Input
            allowClear
            key={fieldKey}
            disabled={field.disabled}
            placeholder={field.placeholder}
            onChange={field.onChange}
            {...componentProps}
          ></Input>
        )
        break
      case 'mentions':
        component = (
          <Mentions key={fieldKey} onChange={field.onChange} {...componentProps}>
            {Array.isArray(field.options) &&
              field.options.map((item: SelectOption) => (
                <Mentions.Option key={item.key} value={item.value}>
                  {item.title}
                </Mentions.Option>
              ))}
          </Mentions>
        )
        break
      case 'select':
        component = (
          <Select
            allowClear
            key={fieldKey}
            style={{ width: 250 }}
            disabled={field.disabled}
            placeholder={field.placeholder}
            onChange={field.onChange}
            {...componentProps}
          >
            {Array.isArray(field.options) &&
              field.options.map((item: SelectOption) => (
                <Select.Option key={item.key} value={item.value}>
                  {item.title}
                </Select.Option>
              ))}
          </Select>
        )
        break
      case 'treeSelect':
        component = (
          <TreeSelect
            allowClear
            key={fieldKey}
            disabled={field.disabled}
            placeholder={field.placeholder}
            onChange={field.onChange}
            {...componentProps}
          ></TreeSelect>
        )
        break
    }

    return component
  }
  return null
}

const renderField = (model, field): ReactNode => {
  const label = field.label ? (
    <div className='filterbar__label-trans'>{/**To do: label transition animation */}</div>
  ) : null

  let content
  if (isFunction(field.render)) {
    content = field.render(field)
  } else {
    content = <Form.Item>{getFieldComponent(field)}</Form.Item>
  }

  return (
    <div className='filterbar__field'>
      {label}
      {content}
    </div>
  )
}

/* To do: use React.Provider pass params */
const FilterbarForm: FC<FilterbarFormProps> = function({
  filterFields = [],
  filterModel = {}
}: FilterbarFormProps) {
  return filterFields.length > 0 ? (
    <div className='filterbar__form'>
      {filterFields.map(field => {
        if (Array.isArray(field)) {
          const subFieldNodes: ReactNode[] = []
          field.forEach(subField => {
            subFieldNodes.push(renderField(filterModel, subField))
          })
          return subFieldNodes.length > 0 ? (
            <div className='filterbar__field filterbar__field--group'>{subFieldNodes}</div>
          ) : null
        }
        return renderField(filterModel, field)
      })}
    </div>
  ) : null
}

export default FilterbarForm
