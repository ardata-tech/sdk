import axios from 'axios'
import { Config } from '..'
import { DataResponsePromise } from '../types'

export interface EdgeNodeOperationsInterface {
  read: () => DataResponsePromise<{ edgeNodes: string[] }>
  add: (params: { edgeNode: string }) => DataResponsePromise
}

const EdgeNodeOperations = (config: Config): EdgeNodeOperationsInterface => {
  return {
    read: async () => {
      try {
        const defaults = axios.get(`${config.host}/edge-nodes`, {
          headers: { Authorization: `Bearer ${config.apiKey}` }
        })

        const custom = axios.get(
          `${config.webAppHost}/api/user/settings/custom-edge-nodes`,
          { headers: { Authorization: `Bearer ${config.apiKey}` } }
        )

        const [defaultsData, customData] = await Promise.all([defaults, custom])

        const edgeNodes: string[] = [
          ...customData.data.customEdgeNodes,
          ...defaultsData.data.edgeNodes
        ]

        return [
          {
            success: true,
            code: 200,
            edgeNodes
          },
          null
        ]
      } catch (error: any) {
        const response = error.response.data
        return [null, response ?? { success: false, code: 400 }]
      }
    },
    add: async ({ edgeNode }) => {
      try {
        const result = await axios.post(
          `${config.webAppHost}/api/user/settings/custom-edge-nodes`,
          { edgeNode },
          { headers: { Authorization: `Bearer ${config.apiKey}` } }
        )

        return [result.data, null]
      } catch (error: any) {
        return [null, error.response.data]
      }
    }
  }
}

export default EdgeNodeOperations
