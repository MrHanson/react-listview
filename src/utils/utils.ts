import { PlainObject, FilterField } from '@/listview.type'
import get from './getValue'
import { error } from './debug'

export function isValidatedFieldValues(val: any): boolean {
  return !(
    val === null ||
    val === undefined ||
    val === '' ||
    JSON.stringify(val) === '[]' ||
    JSON.stringify(val) === '{}'
  )
}

export function isFunction(val: any): boolean {
  return typeof val === 'function'
}

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
export function dataMapping(data = {}, dataMap = {}): PlainObject {
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

// prettier-ignore
export function resolveFilterModelGetters(fields: FilterField[], getters = {}): { [k: string]: any; } {
  return fields.reduce((result, field) => {
    if (Array.isArray(field)) {
      resolveFilterModelGetters(field, getters)
    } else {
      if (field.get && field.model) {
        result[field.model] = field.get
      }
    }
    return result
  }, getters)
}

// prettier-ignore
export function applyFieldGetter(payload: { [k: string]: any }, getters: { [k: string]: any }): void {
  Object.keys(getters).forEach(key => {
    try {
      payload[key] = isFunction(getters[key]) ? getters[key](payload[key], payload) : getters[key]
    } catch (e) {
      error(
        [
          `FilterFields '${key}' getter error:`,
          `  - Value: ${JSON.stringify(payload[key])}`,
          `  - Getter: ${getters[key].toString()}`,
          `  - Error: ${e}`
        ].join('\n')
      )
    }
  })
}

export function parseSize(val: any, unit = 'px'): string {
  if (!val) return ''
  return parseFloat(val) + unit
}
