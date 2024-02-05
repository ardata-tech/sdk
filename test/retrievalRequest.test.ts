import DeltaStorage, { DeltaStorageInit } from '../src'
import dotenv from 'dotenv'
import crypto from 'crypto'
import * as matchers from 'jest-extended'
import fs from 'fs/promises'
import { Blob, File } from '@web-std/file'
dotenv.config()
expect.extend(matchers)

// NOTE: Replace this with your own API_KEY
const API_KEY = process.env.API_KEY ?? ''

if (!API_KEY) {
  throw new Error(
    'API_KEY is not defined. Make sure to set it in your .env file.'
  )
}

let sdk: DeltaStorageInit

let fileId: string

const path = `${__dirname}/testing.txt`

describe('===== Retrieval Request test =====', () => {
  beforeAll(async () => {
    sdk = DeltaStorage.init({ apiKey: API_KEY })
    const fileContent = await fs.readFile(path)
    const blob = new Blob([fileContent], { type: 'text/plain' })
    const file = new File([blob], 'testing.txt', { type: 'text/plain' })

    const [dirData] = await sdk.drive.getAll()
    const [data] = await sdk.file.upload({
      file,
      directoryId: dirData?.drives[0].id ?? ''
    })

    fileId = data?.id ?? ''
  })

  describe('Create Retrieval Request', () => {
    it('should create a retrieval request', async () => {
      const [data, error] = await sdk.retrievalRequest.create({
        dsn: 'Sia',
        fileId
      })

      expect(error).toBeNull()
      expect(data).not.toBeNull()
      expect(data?.code).toStrictEqual(201)
      expect(data?.success).toBeTruthy()
    })

    it('should not create a retrieval request and return error', async () => {
      const [data, error] = await sdk.retrievalRequest.create({
        dsn: 'Sia',
        fileId: crypto.randomUUID()
      })

      expect(data).toBeNull()
      expect(error).not.toBeNull()
      expect(error?.success).toBeFalsy()
      expect(error?.code).toStrictEqual(404)
    })
  })

  describe('Retrieval Request Details', () => {
    it('should get retrieval request details', async () => {
      const [data, error] = await sdk.retrievalRequest.details({
        dsn: 'Sia',
        fileId
      })

      expect(error).toBeNull()
      expect(data).not.toBeNull()
      expect(data?.code).toStrictEqual(200)
      expect(data?.success).toBeTruthy()
    })

    it('should not get retrieval request details and return error', async () => {
      const [data, error] = await sdk.retrievalRequest.details({
        dsn: 'Sia',
        fileId: crypto.randomUUID()
      })

      expect(data).toBeNull()
      expect(error).not.toBeNull()
      expect(error?.success).toBeFalsy()
      expect(error?.code).toStrictEqual(400)
    })
  })

  afterAll(async () => {
    await sdk.file.delete({ id: fileId })
  })
})
