export function log(message: string) {
  const dt = new Date();
  const formattedDate = `${dt.getHours()}:${dt.getMinutes()}:${dt.getSeconds()}.${dt.getMilliseconds()}`;
  console.log(`${formattedDate} ${message}`)
}