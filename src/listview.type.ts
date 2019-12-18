/* eslint-disable */

import { AxiosRequestConfig, Method } from 'axios'
import { ColumnProps } from 'antd/es/table'

export interface ListviewHeaderProps {
  title: string
  nav: Array<any>
}

export interface ListviewProps {
  /** 设置页面顶部通栏内的页面标题文本。 default: '' */
  headerTitle: string

  /** 设置页面顶部通栏内的面包屑。 default: [] */
  headerNav: Array<string>

  /** 优先级最高，设置整体布局高度，包含顶部标题栏、搜索栏、正文区域、页码区域所有内容的高度，支持百分比。 default: null */
  height?: string | number

  /** 垂直高度是否铺满屏幕高度。 default: true */
  fullHeight?: boolean

  /** 初始化后是否自动加载第一页内容。 default: true */
  autoload?: boolean

  /** 数据请求接口地址。 default: '' */
  requestUrl?: string

  /** 支持 Axios 所有支持的请求方法。 default: 'get' */
  requestMethod?: Method

  /** 兼容 Axios 的所有除了 cancelToken 之外的 requestConfig 配置。 default: {} */
  requestConfig?: AxiosRequestConfig

  /** 自定义请求方法，需要返回 Promise ，以返回的内容交由 `validateResponse` 进行验证 */
  requestHandler?: RequestHandler

  /** 对接口发起请求参数在发送前作最后的更改 */
  transformRequestData?: TransformRequestData

  /** 对原始响应数据的加工方法 default: null */
  transformResponseData?: TransformResponseData

  /** 数据接口响应内容属性映射。 default: { items: 'result.items', total: 'result.total_count' } */
  contentDataMap?: ContentDataMap

  /** 可用在 autoload 为 false 时候，初始显示的提示信息。 default: null */
  contentMessage?: null | string

  /** 验证接口响应是否成功 */
  validateResponse?: ValidateResponse

  /** 解析错误提示信息 */
  resolveResponseErrorMessage?: ResolveResponseErrorMessage

  /** 搜索栏左侧按钮配置。 default: [] */
  filterButtons?: FilterButton[]

  /** 搜索栏搜索字段配置。 default: [] */
  filterFields?: FilterField[]

  /** 可选，存储搜索栏的搜索条件值。 default: {} */
  filterModel?: { [k: string]: any }

  /** 是否显示搜索栏的“提交”按钮。 default: true */
  showFilterSearch?: boolean

  /** 是否显示搜索栏的“重置”按钮。 default: true */
  showFilterReset?: boolean

  /** 表格列配置。 default: [] */
  tableColumns?: ColumnProps<any>[]

  /** 可传入 Antd Table 的所有支持属性。 default: {} */
  tableProps?: { [k: string]: any }

  /** 可传入 Antd Table 的所有支持事件。 default: {} */
  tableEvents?: { [k: string]: () => void }

  /** 是否开启表格行选择功能，传入 'single' 为表格单选效果。 default: true */
  tableSelectionColumn?:
    | boolean
    | string
    | {
        type: string
        selectable: (row: any, index: number) => boolean
      }

  /** 是否开启底部分页功能，或配置请求时分页参数的键名。 default: true */
  usePage?:
    | boolean
    | {
        pageIndex: string
        pageSize: string
      }

  /** 分页“每页数量”可选值。 default: ['20', '50', '100'] */
  pageSizeOptions?: string[]

  /** 默认每页分页数量。 default: 20 */
  pageSize?: number
}

export interface FilterbarProps {
  filterButtons?: FilterButton[]
  filterFields?: FilterField[]
  filterModel?: { [k: string]: any }
  filterbarFold?: boolean
  showFilterSearch?: boolean
  showFilterReset?: boolean
}

export interface FilterbarFormProps {
  filterFields: FilterField[]
  filterModel: { [k: string]: any }
  filterbarFold?: boolean
  showFilterSearch?: boolean
  showFilterReset?: boolean
}

export interface Pagination {
  position: 'top' | 'bottom' | 'both'
}

export interface TableColumnGroup {
  title: string
  tableColumns: ColumnProps<any>[]
}

export interface FilterButton {
  disabled: boolean
  ghost: boolean
  href: string
  target: string // href启用时有效
  htmlType: string // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-type
  icon: string
  loading: boolean | /* delay */ number
  shape: 'circle' | 'round'
  type: 'primary' | 'dashed' | 'danger' | 'link'
  onClick: (event: Event) => void
}

export interface FilterField {
  /** 字段控件类型 */
  type?: FieldType

  /** 字段提交参数名 */
  model?: string

  /** 字段文本说明 */
  label?: string

  /** 是否显示为禁用状态 */
  disabled?: boolean

  /** 类型为 select 或 multipleSelect 时的选项配置 */
  options?:
    | SelectOption[]
    | Promise<SelectOption[]>
    | ((done: (options: SelectOption[]) => void) => void)

  /** 可传入对应控件原始的 props */
  componentProps?: { [k: string]: any }

  /** 可传入对应控件原始的 events */
  componentEvents?: { [k: string]: () => void }

  /** 可传入对应控件原始的 children */
  componentChildren?: { [k: string]: any }
}

type FieldType =
  | 'label'
  | 'text'
  | 'number'
  | 'select'
  | 'multipleSelect'
  | 'date'
  | 'dateRange'
  | 'timeSelect'
  | 'timePicker'
  | 'timePickerRange'
  | 'dateTime'
  | 'dateTimeRange'
  | 'cascader'

interface SelectOption {
  disabled: boolean
  title: string
  key: string
  value: string | number
  className: string
  children?: SelectOption[]
}

export type RequestHandler = (requestData?: object) => Promise<any>

export type TransformRequestData = (requestData?: object) => object | boolean

export type TransformResponseData = (responseData?: object) => void

export type ValidateResponse = (response?: any) => boolean

export type ResolveResponseErrorMessage = (response?: any) => any

export type ContentDataMap = { [k: string]: string }