import React, { FC, ReactNode, Ref, forwardRef, useState, useMemo } from 'react'
import { FilterbarProps, AntButton } from '@/listview.type'

import FilterbarForm from './filterbar-form'
import { Form, Button } from 'antd'

const renderButton = (item: AntButton, index?: string): ReactNode => {
  // prettier-ignore
  const { text, disabled, ghost, href, target, htmlType, icon, loading, shape, size, type, onClick, block } = item
  return (
    <Button
      key={index}
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

const Filterbar: FC<FilterbarProps> = function(
  {
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
  }: FilterbarProps,
  ref: Ref<any>
) {
  function showSubmit(): boolean {
    return (
      showFilterSearch ||
      showFilterReset ||
      !!prependSubmitSlot?.(filterModel) ||
      !!appendSubmitSlot?.(filterModel)
    )
  }

  const [filterbarIsFold, setFilterbarIsFold] = useState(filterbarFold)
  const isNoneFields = useMemo(() => filterFields.length === 0, filterFields)
  const filterbarHasMore = useMemo(() => false, filterFields)

  return (
    <div
      ref={ref}
      className={`listview__filterbar ${filterbarIsFold ? 'listview__filterbar--fold' : null}`}
    >
      <Form layout='inline'>
        {showSubmit() ? (
          <div
            className={`filterbar__submit ${isNoneFields ? 'filterbar__submit--onleft' : ''} ${
              filterbarHasMore ? '' : ''
            }`}
          >
            <Form.Item>
              <div className='filterbar__submit-btn'>
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
              <Button
                type='primary'
                className={filterbarHasMore ? '' : 'filterbar__submit-more'}
                icon={filterbarIsFold ? 'caret-down' : 'caret-up'}
                onClick={(): void => setFilterbarIsFold(filterbarIsFold => !filterbarIsFold)}
              ></Button>
            </Form.Item>
          </div>
        ) : null}

        {filterButtons.length > 0 ? (
          <div className='filterbar__buttons'>
            {filterButtons
              .map((item: any, i) => {
                if (item && Array.isArray(item.children)) {
                  const ButtonGroup = Button.Group
                  return (
                    <ButtonGroup size={item.size} key={'fBG' + i}>
                      {item.children.map((child, j) => renderButton(child, 'fBG' + i + j))}
                    </ButtonGroup>
                  )
                }
                return item && renderButton(item, 'fB' + i)
              })
              .filter(item => !!item)}
          </div>
        ) : null}

        <FilterbarForm filterFields={filterFields} filterModel={filterModel} />
      </Form>
    </div>
  )
}

export default forwardRef(Filterbar)
