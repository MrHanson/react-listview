import React, { FC, ReactNode } from 'react'
import { FilterbarProps, AntButton } from '@/listview.type'

import FilterbarForm from './filterbar-form'
import { Button } from 'antd'

const renderButton = (item: AntButton): ReactNode => {
  // prettier-ignore
  const { text, disabled, ghost, href, target, htmlType, icon, loading, shape, size, type, onClick, block } = item
  return (
    <Button
      disabled={disabled}
      ghost={ghost}
      href={href}
      target={target}
      htmlType={htmlType}
      icon={icon}
      loading={loading}
      shape={shape}
      size={size}
      type={type}
      onClick={onClick}
      block={block}
    >
      {text}
    </Button>
  )
}

const Filterbar: FC<FilterbarProps> = function({
  filterButtons = [],
  filterFields = [],
  filterModel = {},
  filterbarFold = true,
  showFilterSearch = true,
  showFilterReset = true
}: FilterbarProps) {
  const filterbarFormProps = {
    filterFields,
    filterModel,
    filterbarFold,
    showFilterSearch,
    showFilterReset
  }

  return (
    <div className='filterbar'>
      {filterButtons
        .map((item: any) => {
          if (Array.isArray(item.children)) {
            const ButtonGroup = Button.Group
            return (
              <ButtonGroup size={item.size}>
                {item.children.map(child => renderButton(child))}
              </ButtonGroup>
            )
          }
          return renderButton(item)
        })
        .filter(item => !!item)}
      <FilterbarForm {...filterbarFormProps} />
    </div>
  )
}

export default Filterbar
