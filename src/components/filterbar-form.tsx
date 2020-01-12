import React, { FC, ReactNode } from 'react'
import { FilterbarFormProps, FilterField, RenderReactDomFn } from '@/listview.type'

// prettier-ignore
import { AutoComplete, Select, Cascader, DatePicker, Input, InputNumber, Mentions, TreeSelect, Form } from 'antd'

import { isFunction, camelCase } from 'lodash'

import FIELD_KEYS_MAP from '@/constant/fieldKeyMap'

const getFieldComponent = (key: string): ReactNode => {
  if (key) {
    const fieldKey = camelCase(key)
    return FIELD_KEYS_MAP[fieldKey]
  }
  return null
}

const renderField = (model, field): ReactNode => {
  const label = field.label ? (
    <div className='filterbar__label-trans'>{/**To do: label transition animation */}</div>
  ) : null
  const key = field.key || field.model || null

  let content
  if (isFunction(field)) {
    content = field()
  } else if (isFunction(field.render)) {
    content = field.render(field)
  } else {
    const FieldComponent = getFieldComponent(field)
    content = (
      <Form.Item>
        <FieldComponent model={model} field={field} />
      </Form.Item>
    )
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
  return (
    <div>
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
  )
}

export default FilterbarForm
