import { isPlainObject, isEmpty } from 'lodash'
import get from './getValue'

/**
 * @description handler of response data
 * @example
 * dataMapping({
 *   result: {
 *     results: [1, 2, 3]
 *   }
 * }, {
 *   items: 'result.results'
 * })
 *
 * -> { items: [1, 2, 3] }
 *
 * @param {object} data
 * @param {object} dataMap
 */
export function dataMapping(data = {}, dataMap = {}): object {
  const result = {}
  Object.keys(dataMap).forEach(key => {
    try {
      const dataKey = key.toString()
      const dataValue = get(data, dataMap[key])
      result[dataKey] = dataValue
    } catch (e) {}
  })

  return result
}

export function isValidateFieldValues(val: any): boolean {
  return !(
    val === null ||
    val === undefined ||
    val === '' ||
    ((Array.isArray(val) || isPlainObject(val)) && isEmpty(val))
  )
}
