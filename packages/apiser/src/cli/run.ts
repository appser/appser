export default () => {
  process.env.NODE_ENV = process.env.NODE_ENV ?? 'production'
  import('../server')
}
