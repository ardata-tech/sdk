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
let fileCid: string

const user: string = 'user@delta.storage'
const password: string = 'delta123'

const path = `${__dirname}/testing.txt`

describe('===== File Access test =====', () => {
  beforeAll(async () => {
    sdk = DeltaStorage.init({ apiKey: API_KEY })
    const fileContent = await fs.readFile(path)
    const blob = new Blob([fileContent], { type: 'text/plain' })
    const file = new File([blob], 'testing.txt', { type: 'text/plain' })

    const [driveData] = await sdk.drive.getAll()
    const [fileData] = await sdk.file.upload({
      file,
      directoryId: driveData?.drives[0].id ?? ''
    })

    fileId = fileData?.id ?? ''
    fileCid = fileData?.cid ?? ''
  })

  describe('Read File Access', () => {
    it('should read the file access', async () => {
      const [data, error] = await sdk.fileAccess.read({ fileId, cid: fileCid })

      const fileAccessResponse = {
        success: true,
        code: 200,
        users: [],
        secureSharing: 'PUBLIC',
        password: null
      }

      expect(error).toBeNull()
      expect(data).toMatchObject(fileAccessResponse)
    })

    it('should not read the file access and return error', async () => {
      const [data, error] = await sdk.fileAccess.read({
        fileId: crypto.randomUUID(),
        cid: crypto.randomUUID()
      })

      expect(data).toBeNull()
      expect(error).not.toBeNull()
      expect(error?.success).toBeFalsy()
      expect(error?.code).toStrictEqual(404)
    })
  })

  describe('Add File Access', () => {
    it('should add users to the file access', async () => {
      const [data, error] = await sdk.fileAccess.add({
        fileId,
        cid: fileCid,
        body: { email: user }
      })

      const [readData] = await sdk.fileAccess.read({ fileId, cid: fileCid })

      expect(error).toBeNull()
      expect(data).not.toBeNull()
      expect(data?.code).toStrictEqual(201)
      expect(data?.success).toBeTruthy()

      expect(readData?.users).toIncludeAllPartialMembers([{ email: user }])
      expect(readData?.secureSharing).toStrictEqual('RESTRICTED')
    })

    it('should not add user if existing', async () => {
      const [data, error] = await sdk.fileAccess.add({
        fileId,
        cid: fileCid,
        body: { email: user }
      })

      expect(data).toBeNull()
      expect(error).not.toBeNull()
      expect(error?.success).toBeFalsy()
      expect(error?.code).toStrictEqual(400)
    })

    it('should not add user if no fileId or cid found', async () => {
      const [data, error] = await sdk.fileAccess.add({
        fileId: crypto.randomUUID(),
        cid: crypto.randomUUID(),
        body: { email: user }
      })

      expect(data).toBeNull()
      expect(error).not.toBeNull()
      expect(error?.success).toBeFalsy()
      expect(error?.code).toStrictEqual(404)
    })

    it('should add a password to the file access', async () => {
      const [data, error] = await sdk.fileAccess.add({
        fileId,
        cid: fileCid,
        body: { password }
      })

      const [readData] = await sdk.fileAccess.read({ fileId, cid: fileCid })

      expect(error).toBeNull()
      expect(data).not.toBeNull()
      expect(data?.success).toBeTruthy()
      expect(data?.code).toStrictEqual(201)

      expect(readData?.secureSharing).toStrictEqual('PASSWORD')
      expect(readData?.password).not.toBeNull()
    })
  })

  describe('Update File Access', () => {
    it('should update the file access to PUBLIC', async () => {
      const [data, error] = await sdk.fileAccess.update({
        fileId,
        cid: fileCid,
        body: { secureSharing: 'PUBLIC' }
      })
      const [readData] = await sdk.fileAccess.read({ fileId, cid: fileCid })

      expect(error).toBeNull()
      expect(data).not.toBeNull()
      expect(data?.code).toStrictEqual(200)
      expect(data?.success).toBeTruthy()

      expect(readData?.secureSharing).toStrictEqual('PUBLIC')
    })

    it('should update the file access to RESTRICTED', async () => {
      const [data, error] = await sdk.fileAccess.update({
        fileId,
        cid: fileCid,
        body: { secureSharing: 'RESTRICTED' }
      })
      const [readData] = await sdk.fileAccess.read({ fileId, cid: fileCid })

      expect(error).toBeNull()
      expect(data).not.toBeNull()
      expect(data?.code).toStrictEqual(200)
      expect(data?.success).toBeTruthy()

      expect(readData?.secureSharing).toStrictEqual('RESTRICTED')
    })

    it('should update the file access to PASSWORD', async () => {
      const [data, error] = await sdk.fileAccess.update({
        fileId,
        cid: fileCid,
        body: { secureSharing: 'PASSWORD' }
      })
      const [readData] = await sdk.fileAccess.read({ fileId, cid: fileCid })

      expect(error).toBeNull()
      expect(data).not.toBeNull()
      expect(data?.code).toStrictEqual(200)
      expect(data?.success).toBeTruthy()

      expect(readData?.secureSharing).toStrictEqual('PASSWORD')
    })

    it('should not update file access and return error', async () => {
      const [data, error] = await sdk.fileAccess.update({
        fileId: crypto.randomUUID(),
        cid: crypto.randomUUID(),
        body: { secureSharing: 'PUBLIC' }
      })

      expect(data).toBeNull()
      expect(error).not.toBeNull()
      expect(error?.success).toBeFalsy()
      expect(error?.code).toStrictEqual(404)
    })
  })

  describe('Verify Password', () => {
    it('should verify file access password', async () => {
      const [data, error] = await sdk.fileAccess.verifyPassword({
        fileId,
        cid: fileCid,
        body: { password }
      })

      expect(error).toBeNull()
      expect(data).not.toBeNull()
      expect(data?.success).toBeTruthy()
      expect(data?.code).toStrictEqual(200)
      expect(data?.isVerify).toBeTruthy()
    })

    it('should not verify file access password', async () => {
      const [data, error] = await sdk.fileAccess.verifyPassword({
        fileId,
        cid: fileCid,
        body: { password: crypto.randomUUID() }
      })

      expect(data).toBeNull()
      expect(error).not.toBeNull()
      expect(error?.success).toBeFalsy()
      expect(error?.code).toStrictEqual(400)
      expect(error?.isVerify).toBeFalsy()
    })

    it('should not verify file access if file not found', async () => {
      const [data, error] = await sdk.fileAccess.verifyPassword({
        fileId: crypto.randomUUID(),
        cid: crypto.randomUUID(),
        body: { password }
      })

      expect(data).toBeNull()
      expect(error).not.toBeNull()
      expect(error?.success).toBeFalsy()
      expect(error?.code).toStrictEqual(404)
    })
  })

  describe('Delete User File Access', () => {
    it('should delete a user in the users file access', async () => {
      const newUser = `1${user}`
      await sdk.fileAccess.add({
        fileId,
        cid: fileCid,
        body: { email: newUser }
      })

      const [data, error] = await sdk.fileAccess.delete({
        fileId,
        cid: fileCid,
        body: { email: user }
      })

      const [readData] = await sdk.fileAccess.read({ fileId, cid: fileCid })

      expect(error).toBeNull()
      expect(data).not.toBeNull()
      expect(data?.success).toBeTruthy()
      expect(data?.code).toStrictEqual(200)

      expect(readData?.users).toBeArrayOfSize(1)
      expect(readData?.users).toIncludeAllPartialMembers([{ email: newUser }])
    })

    it('should delete all the users in the file access', async () => {
      const [data, error] = await sdk.fileAccess.delete({
        fileId,
        cid: fileCid,
        body: { deleteAll: true }
      })

      const [readData] = await sdk.fileAccess.read({ fileId, cid: fileCid })

      expect(error).toBeNull()
      expect(data).not.toBeNull()
      expect(data?.code).toStrictEqual(200)
      expect(data?.success).toBeTruthy()

      expect(readData?.users).toBeArrayOfSize(0)
    })
  })

  afterAll(async () => {
    await sdk.file.delete({ id: fileId })
  })
})
