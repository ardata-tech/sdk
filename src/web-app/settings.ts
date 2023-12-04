import axios from 'axios'
import { Config } from '..'
export interface SettingsOperationsInterface {
  read: () => Promise<any>
  update: (params: {
    node?: string
    encryptionKey?: string
    isSecureMode?: boolean
  }) => Promise<any>
  getEncryptionKey: () => Promise<any>
  verifyEncryptionKey: (params: { encryptionKey: string }) => Promise<any>
}

const SettingsOperations = (config: Config): SettingsOperationsInterface => {
  return {
    read: async () => {
      const result = await axios.get(`${config.webAppHost}/api/user/settings`, {
        headers: {
          Authorization: `Bearer ${config.apiKey}`
        }
      })

      return result.data
    },
    update: async ({ node, encryptionKey, isSecureMode }) => {
      const result = await axios.put(
        `${config.webAppHost}/api/user/settings`,
        { node, encryptionKey, isSecureMode },
        {
          headers: {
            Authorization: `Bearer ${config.apiKey}`
          }
        }
      )

      return result.data
    },
    getEncryptionKey: async () => {
      const result = await axios.get(
        `${config.webAppHost}/api/user/settings/encryption-key`,
        {
          headers: {
            Authorization: `Bearer ${config.apiKey}`
          }
        }
      )

      return result.data
    },
    verifyEncryptionKey: async ({ encryptionKey }) => {
      const result = await axios.post(
        `${config.webAppHost}/api/user/settings/encryption-key`,
        { encryptionKey },
        {
          headers: {
            Authorization: `Bearer ${config.apiKey}`
          }
        }
      )

      return result.data
    }
  }
}

export default SettingsOperations
