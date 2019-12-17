export const warn = function(msg): void {
  // eslint-disable-next-line no-console
  console.warn(
    `%c Listview warn %c ${msg}`,
    'background:#f90;padding:1px;border-radius:3px;color:#fff',
    'background:transparent'
  )
}
export const error = function(msg): void {
  // eslint-disable-next-line no-console
  console.error(
    `%c Listview error %c ${msg}`,
    'background:#e30;padding:1px;border-radius:3px;color:#fff',
    'background:transparent'
  )
}
