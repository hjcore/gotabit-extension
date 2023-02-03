import { Storage } from "@plasmohq/storage"

export class BaseStore<T extends Record<string, any>> {
  public store: Storage
  public bucketName: string

  constructor(bucketName: string) {
    this.store = new Storage({
      area: "local"
    })
    this.bucketName = bucketName
  }

  async set(setter: Partial<T>) {
    return this.store.set(this.bucketName, setter)
  }

  get(): Promise<T>

  get(key: keyof T): Promise<Partial<T>>

  async get(key?: keyof T) {
    const data = await this.store.get<T>(this.bucketName)

    return key ? data[key] : data
  }

  clear() {
    this.store.clear()
  }
}
