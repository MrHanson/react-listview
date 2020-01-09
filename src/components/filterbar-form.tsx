import React, { FC } from 'react'
import { FilterbarFormProps } from '@/listview.type'

/* To do: use React.Provider pass params */
const FilterbarForm: FC<FilterbarFormProps> = function({
  filterFields = [],
  filterModel = {},
  filterbarFold = true,
  showFilterSearch = true,
  showFilterReset = true
}: FilterbarFormProps) {
  return (
    <div className='filterbar__form'>
      {/* To do: render filterFields */}
      {/* To do: render submit & reset button */}
    </div>
  )
}

export default FilterbarForm
