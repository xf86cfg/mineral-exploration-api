export function createLogger(name: string) {
  return {
    log: (args: any) => console.log(name, ...args),
    err: (args: any) => console.error(name, ...args),
    warn: (args: any) => console.warn(name, ...args),
  }
}
