import axios from 'axios'
import DeltaStorageSDK from '../index'

export async function readSettings(this: DeltaStorageSDK): Promise<any> {
  const result = await axios.get(`${this.webAppHost}/api/user/settings`, {
    headers: {
      Authorization: `Bearer ${this.apiKey}`
    }
  })

  return result.data
}

export async function updateSettings(
  this: DeltaStorageSDK,
  node?: string,
  encryptionKey?: string,
  isSecureMode?: boolean
): Promise<any> {
  const result = await axios.put(
    `${this.webAppHost}/api/user/settings`,
    { node, encryptionKey, isSecureMode },
    {
      headers: {
        Authorization: `Bearer ${this.apiKey}`
      }
    }
  )

  return result.data
}

export async function readEncryptionKey(this: DeltaStorageSDK): Promise<any> {
  const result = await axios.get(
    `${this.webAppHost}/api/user/settings/encryption-key`,
    {
      headers: {
        Authorization: `Bearer ${this.apiKey}`
      }
    }
  )

  return result.data
}

export async function verifyEncryptionKey(
  this: DeltaStorageSDK,
  encryptionKey: string
): Promise<any> {
  const result = await axios.post(
    `${this.webAppHost}/api/user/settings/encryption-key`,
    { encryptionKey },
    {
      headers: {
        Authorization: `Bearer ${this.apiKey}`
      }
    }
  )

  return result.data
}
