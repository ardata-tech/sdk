import axios from 'axios'
import { Config } from '..'
export interface SettingsOperationsInterface {
  read: () => Promise<any>
  update: (params: {
    node?: string | null
    isSecureMode?: boolean
  }) => DataResponsePromise
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
    update: async ({ node, isSecureMode }) => {
      try {
        const result = await axios.put(
          `${config.webAppHost}/api/user/settings`,
          { node, isSecureMode },
          {
            headers: {
              Authorization: `Bearer ${config.apiKey}`
            }
          }
        }
      )

        return [result.data, null]
      } catch (error: any) {
        return [null, error.response.data]
      }
    }
  }
}

export default SettingsOperations
