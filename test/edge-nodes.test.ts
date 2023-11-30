import DeltaStorage, { DeltaStorageInit } from '../src'
import * as matchers from 'jest-extended'
import dotenv from 'dotenv'

expect.extend(matchers)
dotenv.config()

const API_KEY = process.env.API_KEY ?? ''

if (!API_KEY) {
  throw new Error(
    'API_KEY is not defined. Make sure to set it in your .env file.'
  )
}

let sdk: DeltaStorageInit

describe('===== Edge Node test =====', () => {
  beforeAll(async () => {
    sdk = DeltaStorage.init({ apiKey: API_KEY })
  })

  describe('Get Edge Nodes', () => {
    it('should get a list of edge nodes', async () => {
      const [data, error] = await sdk.edgeNodes.read()

      expect(error).toBeNull()
      expect(data).not.toBeNull()
      expect(data?.success).toBeTruthy()
      expect(data?.code).toStrictEqual(200)
      expect(data?.edgeNodes).toBeArray()
    })
  })

  describe('Add Edge Node', () => {
    it('should not add edge node if not valid', async () => {
      const [data, error] = await sdk.edgeNodes.add({
        edgeNode: 'https://www.delta.storage'
      })

      expect(data).toBeNull()
      expect(error).not.toBeNull()
      expect(error?.success).toBeFalsy()
      expect(error?.code).toStrictEqual(400)
    })

    it('should not add edge node if its already on the list', async () => {
      const [edgeNodesData] = await sdk.edgeNodes.read()
      const [data, error] = await sdk.edgeNodes.add({
        edgeNode: edgeNodesData?.edgeNodes[0] ?? ''
      })

      expect(data).toBeNull()
      expect(error).not.toBeNull()
      expect(error?.success).toBeFalsy()
      expect(error?.code).toStrictEqual(400)
    })
  })
})
