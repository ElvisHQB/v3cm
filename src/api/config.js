// 需要从原生获取sessionid
const sessionid = ''
const debug = process.env.NODE_ENV !== 'production'
export const HOST = debug ? '/api/3CWeb' : '/3CWeb'
export const sid = debug ? 'f2910fa5d7d243959dc7287f088c2202' : sessionid
