export function getCurrentTime() {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}
export function getCurrentDay() {
  const today = new Date().toISOString().split('T')[0].replace(/-/g, '')
  return today
}
