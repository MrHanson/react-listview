import React, { FC, ReactNode, useRef } from 'react'
import { FilterbarProps, AntButton } from '@/listview.type'

import FilterbarForm from './filterbar-form'
import { Form, Button } from 'antd'

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
  filterSearchText = 'Search',
  showFilterReset = true,
  filterResetText = 'Reset',
  prependSubmitSlot,
  appendSubmitSlot
}: FilterbarProps) {
  function showSubmit(): boolean {
    return (
      showFilterSearch ||
      showFilterReset ||
      !!prependSubmitSlot?.(filterModel) ||
      !!appendSubmitSlot?.(filterModel)
    )
  }

  return (
    <div className={`listview__filterbar ${filterbarFold ? 'listview__filterbar' : null}`}>
      <Form layout='inline'>
        {showSubmit() ? (
          <div className='filterbar__submit'>
            {prependSubmitSlot?.(filterModel)}
            {showFilterSearch ? (
              <Button
                type='primary'
                icon='search'
                onClick={(): void => {
                  console.log('search')
                }}
              >
                {filterSearchText}
              </Button>
            ) : null}
            {showFilterReset ? (
              <Button
                onClick={(): void => {
                  console.log('reset')
                }}
              >
                {filterResetText}
              </Button>
            ) : null}
            {appendSubmitSlot?.(filterModel)}
          </div>
        ) : null}

        {filterButtons.length > 0 ? (
          <div className='filterbar__buttons'>
            {filterButtons
              .map((item: any) => {
                if (item && Array.isArray(item.children)) {
                  const ButtonGroup = Button.Group
                  return (
                    <ButtonGroup size={item.size}>
                      {item.children.map(child => renderButton(child))}
                    </ButtonGroup>
                  )
                }
                return item && renderButton(item)
              })
              .filter(item => !!item)}
          </div>
        ) : null}

        <FilterbarForm filterFields={filterFields} filterModel={filterModel} />
      </Form>
    </div>
  )
}

export default Filterbar
