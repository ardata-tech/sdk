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
const node: string = 'https://delta.vulcaniclabs.com'

describe('===== Settings test =====', () => {
  beforeAll(async () => {
    sdk = DeltaStorage.init({ apiKey: API_KEY })
  })

  describe('Read Settings', () => {
    it('should read settings data', async () => {
      const [data, error] = await sdk.settings.read()

      const settingsItemMatcher = {
        node: expect.toBeOneOf([expect.any(String), null]),
        isSecureMode: expect.any(Boolean),
        customEdgeNodes: expect.toBeArray()
      }

      expect(error).toBeNull()
      expect(data).not.toBeNull()
      expect(data?.success).toBeTruthy()
      expect(data?.code).toStrictEqual(200)
      expect(data?.settings).toMatchSnapshot(settingsItemMatcher)
    })
  })

  describe('Update settings', () => {
    it('should update the settings node', async () => {
      const [data, error] = await sdk.settings.update({ node })

      const [readData] = await sdk.settings.read()

      expect(error).toBeNull()
      expect(data).not.toBeNull()
      expect(data?.success).toBeTruthy()
      expect(data?.code).toStrictEqual(200)

      expect(readData?.settings.node).toStrictEqual(node)
    })

    it('should update the settings secure mode', async () => {
      const [data, error] = await sdk.settings.update({ isSecureMode: false })

      const [readData] = await sdk.settings.read()

      expect(error).toBeNull()
      expect(data).not.toBeNull()
      expect(data?.success).toBeTruthy()
      expect(data?.code).toStrictEqual(200)

      expect(readData?.settings.isSecureMode).toBeFalse()
    })
  })

  afterAll(async () => {
    await sdk.settings.update({ node: null, isSecureMode: true })
  })
})
