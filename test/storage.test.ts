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

describe('===== Storage test =====', () => {
  beforeAll(async () => {
    sdk = DeltaStorage.init({ apiKey: API_KEY })
  })

  describe('Get Storage', () => {
    it('should get storage details', async () => {
      const [data, error] = await sdk.storage.read()

      const storageMatcher = {
        id: expect.any(String),
        name: expect.any(String),
        capacity: expect.toBeOneOf([expect.any(String), expect.any(BigInt)]),
        customCapacity: expect.toBeOneOf([
          expect.any(String),
          expect.any(BigInt)
        ]),
        userId: expect.any(String),
        createdAt: expect.toBeDateString(),
        updatedAt: expect.toBeDateString()
      }

      expect(error).toBeNull()
      expect(data).not.toBeNull()
      expect(data?.success).toBeTruthy()
      expect(data?.code).toStrictEqual(200)
      expect(data?.quantity).toBeNumber()
      expect(data?.storage).toMatchSnapshot(storageMatcher)
    })
  })
})
