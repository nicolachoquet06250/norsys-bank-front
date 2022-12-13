export const isProd = () => !window.location.host.indexOf('.local')
export const isDev = () => window.location.host.indexOf('.local')

export const getBackendUrl = () => isDev() ? process.env.BACK_URL : 'https://api.norsys-bank.nicolaschoquet.fr'
