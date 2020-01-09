import React, { FC } from 'react'
import { FilterbarProps } from '@/listview.type'
import FilterbarForm from './filterbar-form'

const Filterbar: FC<FilterbarProps> = function({
  filterButtons,
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
      {/* To do: render filterButtons */}
      <FilterbarForm {...filterbarFormProps} />
    </div>
  )
}

export default Filterbar
