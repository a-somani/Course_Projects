//autoBind decorator
export function autoBind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value
  const newDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const binder = method.bind(this)
      return binder
    },
  }
  return newDescriptor
}
