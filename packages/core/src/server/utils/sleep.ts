export default function sleep(n = 0) {
  return new Promise(resolve => setTimeout(resolve, n))
}
