import React, { FC, ReactNode, Ref, forwardRef, useState, useRef, useEffect } from 'react'
import { FilterbarProps, AntButton, JsObject } from '@/listview.type'

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

  const filterbarFormRef = useRef(null)
  const filterbarSubmitRef = useRef(null)
  const [filterbarIsFold, setFilterbarIsFold] = useState(filterbarFold)
  const [filterbarHasMore, setFilterbarHasMore] = useState(false)
  const isNoneFields = filterFields.length === 0

  useEffect(() => {
    const filterbarFormRefCur: JsObject = filterbarFormRef.current || {}
    const filterbarFormHeight = filterbarFormRefCur?.getBoundingClientRect?.()?.height || 0
    if (filterbarFormHeight > 40) {
      setFilterbarHasMore(true)
    }

    // if no fields, filterbar__submit float left
    if (isNoneFields) return

    // update filterbar__submit offset
    const filterbarSubmitRefCur: JsObject = filterbarSubmitRef.current || {}
    const allFields = filterbarFormRefCur.querySelectorAll('.filterbar__field')
    let { top: fieldTop } = allFields[0]?.getBoundingClientRect?.() || 0
    let topRightFieldIndex = -1
    for (let i = 0; i < allFields.length; i++) {
      const field = allFields[i]
      const curFieldTop = field.getBoundingClientRect().top || 0
      if (curFieldTop !== fieldTop) break

      fieldTop = curFieldTop
      topRightFieldIndex = i
    }
    const targetFieldRight = allFields[topRightFieldIndex]?.getBoundingClientRect?.().right || 0
    const left = filterbarSubmitRefCur?.getBoundingClientRect?.().left || 0
    const offset = Math.floor(left - targetFieldRight - 32)
    filterbarSubmitRefCur.style = `transform: translateX(${-offset}px)`
  }, [])

  return (
    <div
      ref={ref}
      className={`listview__filterbar ${
        filterbarIsFold && filterbarHasMore ? 'listview__filterbar--fold' : null
      }`}
    >
      <Form layout='inline'>
        {showSubmit() ? (
          <div
            ref={filterbarSubmitRef}
            className={`filterbar__submit ${isNoneFields ? 'filterbar__submit--onleft' : ''}`}
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
                className={filterbarHasMore ? '' : 'filterbar__submit--no-more'}
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

        <FilterbarForm ref={filterbarFormRef} {...{ filterFields, filterModel }} />
      </Form>
    </div>
  )
}

export default forwardRef(Filterbar)
