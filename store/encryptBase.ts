import { Storage } from "@plasmohq/storage"
import { SafeBotXChaCha20 } from '@gotabit/crypto'
import { toUtf8, fromUtf8 } from '@cosmjs/encoding'

export class EncryptBaseStore<T extends Record<string, any>> {
  public store: Storage
  public bucketName: string

  constructor(bucketName: string) {
    this.store = new Storage({
      area: "local"
    })
    this.bucketName = bucketName
  }

  async set(setter: Partial<T>, password: string) {
    const encryptSetter: { [k in keyof T]?: string } = {}
    const keys = Object.keys(setter)

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i] as keyof T
      const valueStr =
        typeof setter[key] === 'string'
          ? (setter[key] as string)
          : JSON.stringify(setter[key])

      encryptSetter[key] = fromUtf8(
        await SafeBotXChaCha20.encrypt(toUtf8(valueStr), password)
      )
    }

    return this.store.set(this.bucketName, encryptSetter)
  }

  get(password: string): Promise<T>

  get(password: string, key: keyof T): Promise<Partial<T>>

  async get(password: string, key?: keyof T) {
    const data = await this.store.get<T>(key as any)
    const decryptData: Partial<T> = {}

    const keys = Object.keys(data)

    for (let i = 0; i < keys.length; i++) {
      const _key = keys[i] as keyof T
      const valueStr = fromUtf8(
        await SafeBotXChaCha20.decrypt(toUtf8(data[_key]), password)
      )

      try {
        decryptData[_key] = JSON.parse(valueStr)
      } catch (error) {
        decryptData[_key] = valueStr as any
      }
    }

    return decryptData
  }

  clear() {
    this.store.clear()
  }
}
