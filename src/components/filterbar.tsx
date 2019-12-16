import React, { FC } from 'react'
import { FilterbarProps } from '@/listview.type'
import FilterbarForm from './filterbar-form'

const Filterbar: FC<FilterbarProps> = function({
  filterButtons,
  filterFields,
  filterModel,
  filterbarFold,
  showFilterSearch,
  showFilterReset
}: FilterbarProps) {
  return (
    <div className='filterbar'>
      <FilterbarForm />
    </div>
  )
}

export default Filterbar
