import axios from 'axios'
import { Config } from '..'

export interface EdgeNodeOperationsInterface {
  read: () => Promise<{ edgeNodes: string[] }>
  add: (params: { edgeNode: string }) => Promise<any>
}

const EdgeNodeOperations = (
  config: Config,
  edgeNodes: string[]
): EdgeNodeOperationsInterface => {
  return {
    read: async () => {
      const result = await axios.get(
        `${config.webAppHost}/api/user/settings/custom-edge-nodes`,
        { headers: { Authorization: `Bearer ${config.apiKey}` } }
      )

      return {
        edgeNodes: [...result.data.customEdgeNodes, ...edgeNodes]
      }
    },
    add: async ({ edgeNode }) => {
      const result = await axios.post(
        `${config.webAppHost}/api/user/settings/custom-edge-nodes`,
        { edgeNode },
        { headers: { Authorization: `Bearer ${config.apiKey}` } }
      )

      return result.data
    }
  }
}

export default EdgeNodeOperations
