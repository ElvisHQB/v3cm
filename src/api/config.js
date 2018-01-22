// 需要从原生获取sessionid
const sessionid = ''
const debug = process.env.NODE_ENV !== 'production'
export const HOST = debug ? 'http://114.80.154.45/3CWeb' : '/3CWeb'
export const sid = debug ? '26a580e45724401f9dcc07da8630bb0f' : sessionid
