import React from 'react'
import { FilterbarFormProps } from '@/listview.type'

const FilterbarForm: FC<FilterbarFormProps> = function({
  filterFields,
  filterModel,
  filterbarFold = true,
  showFilterSearch = true,
  showFilterReset = true
}: FilterbarFormProps) {
  return <div className='filterbar__form'></div>
}

export default FilterbarForm
