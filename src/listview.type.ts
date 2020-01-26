import { AxiosRequestConfig, Method } from 'axios'
import { TableProps, ColumnProps, TableRowSelection, PaginationConfig } from 'antd/es/table'
import { ReactNode } from 'react'

interface HeaderNav {
  separator: string
  children: ReactNode[]
}
export interface ListviewHeaderProps {
  headerTitle?: string
  headerNav?: Array<string> | HeaderNav
}

export interface ListviewProps extends ListviewHeaderProps, FilterbarProps {
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

  /** 表格列配置。 default: [] */
  tableColumns?: ColumnProps<any>[]

  /** 可传入 Antd Table 的所有支持属性。 default: {} */
  tableProps?: TableProps<any>

  /** 是否开启表格行选择功能，传入 'single' 为表格单选效果。 default: true */
  rowSelection?: TableRowSelection<any>

  /** 是否开启底部分页功能，或配置请求时分页参数的键名。 default: true */
  usePage?:
    | boolean
    | {
        pageIndex: string
        pageSize: string
      }

  pagination?: PaginationConfig

  /** 分页“每页数量”可选值。 default: ['20', '50', '100'] */
  pageSizeOptions?: string[]

  /** 默认每页分页数量。 default: 20 */
  pageSize?: number
}

export interface FilterbarProps extends FilterbarFormProps {
  filterButtons?: FilterButton[]
  filterbarFold?: boolean
  showFilterSearch?: boolean
  filterSearchText?: string
  showFilterReset?: boolean
  filterResetText?: string
  prependSubmitSlot?: (state: any) => ReactNode
  appendSubmitSlot?: (state: any) => ReactNode
}

export interface FilterbarFormProps {
  filterFields?: FilterField[]
  filterModel?: { [k: string]: any }
}

export interface TableColumnGroup {
  title: string
  tableColumns: ColumnProps<any>[]
}

export type FilterButton = AntButton | AntButtonGroup

export interface AntButton {
  text?: string
  disabled?: boolean
  ghost?: boolean
  href?: string
  target?: string // href启用时有效
  htmlType?: 'button' | 'reset' | 'submit' // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-type
  icon?: string
  loading?: boolean | { delay: number }
  shape?: 'circle' | 'round'
  size?: 'small' | 'default' | 'large'
  type?: 'link' | 'default' | 'ghost' | 'primary' | 'dashed' | 'danger'
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  block?: boolean
}

export interface AntButtonGroup {
  size?: 'small' | 'default' | 'large'
  children?: AntButton[]
}

export interface FilterField extends ComponentChild {
  render?: (modela: any) => ReactNode
}

type FieldType =
  | 'autoComplete'
  | 'cascader'
  | 'select'
  | 'datePicker'
  | 'monthPicker'
  | 'rangePicker'
  | 'weekPicker'
  | 'input'
  | 'inputNumber'
  | 'mentions'
  | 'treeSelect'

interface ComponentChild {
  /** 字段控件类型 */
  type?: FieldType

  style?: { [k: string]: any }

  /** 字段提交参数名 */
  model?: string

  /** 字段文本说明 */
  label?: string

  /** 是否显示为禁用状态 */
  disabled?: boolean

  placeholder?: string

  // placeholder for rangePicker
  placeholderPair?: [string, string]

  get?: (val: any) => any

  key?: string

  /** 类型为 select 或 mentions 时的选项配置 */
  options?: SelectOption[]

  /** 可传入对应控件原始的 props */
  componentProps?: { [k: string]: any }

  onChange?: (val: any) => void
}

export interface SelectOption {
  disabled?: boolean
  title: string
  key: string
  value: string
  children?: SelectOption[]
}

export type RequestHandler = (requestData?: object | boolean) => Promise<any>

export type TransformRequestData = (requestData?: object) => object | boolean

export type TransformResponseData = (responseData?: object) => object

export type ValidateResponse = (response?: any) => boolean

export type ResolveResponseErrorMessage = (response?: any) => string

export type ContentDataMap = { [k: string]: string }

export type JsObject = { [k: string]: any }
