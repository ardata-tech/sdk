import DeltaStorage, { DeltaStorageInit } from '../src'
import dotenv from 'dotenv'
import crypto from 'crypto'
import * as matchers from 'jest-extended'
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
let driveId: string

describe('===== Drive test =====', () => {
  beforeAll(async () => {
    sdk = DeltaStorage.init({ apiKey: API_KEY })

    // const name = 'Testing Drive'
    // const [drive, error] = await sdk.drive.create({ name })
  })

  describe('» Create a Drive', () => {
    it('should create a drive', async () => {
      const name = 'Testing Drive'

      const [drive, error] = await sdk.drive.create({ name })

      expect(error).toBeNull()
      expect(drive).not.toBeNull()
      expect(drive?.success).toBeTruthy()
      expect(drive?.code).toStrictEqual(201)
      expect(drive?.name).toStrictEqual(name)
      driveId = drive?.id ?? ''
    })
  })

  describe('» Rename a Drive', () => {
    it('should rename a drive', async () => {
      const newName = 'New Testing Drive'
      const [drive, error] = await sdk.drive.rename({
        id: driveId,
        name: newName
      })

      expect(error).toBeNull()
      expect(drive).not.toBeNull()
      expect(drive?.success).toBeTruthy()
      expect(drive?.code).toStrictEqual(200)
      expect(drive?.name).toStrictEqual(newName)
    })
  })

  describe('» Get All Drives', () => {
    it('should get all drives', async () => {
      const [data, error] = await sdk.drive.getAll()

      const driveItemMatcher = {
        name: expect.any(String),
        id: expect.any(String),
        parentDirectoryId: null,
        ownerId: expect.any(String),
        softDeleted: expect.any(Boolean),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        storageClassName: expect.toBeOneOf([expect.any(String), null]),
        driveId: null
      }

      const driveArrayMatcher = Array(data?.drives.length).fill(
        driveItemMatcher
      )

      expect(error).toBe(null)
      expect(data).not.toBeNull()
      expect(data?.success).toBeTruthy()
      expect(data?.code).toStrictEqual(200)
      expect(data?.drives).toMatchSnapshot(driveArrayMatcher)
    })
  })

  describe('» Get Drive Contents', () => {
    it('should get drive contents', async () => {
      const [data, error] = await sdk.drive.contents({ id: driveId })

      const directoryItemMatcher = {
        name: expect.any(String),
        id: expect.any(String),
        itemCount: expect.any(Number),
        parentDirectoryId: expect.toBeOneOf([expect.any(String), null]),
        ownerId: expect.any(String),
        softDeleted: expect.any(Boolean),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        storageClassName: expect.toBeOneOf([expect.any(String), null]),
        driveId: expect.any(String)
      }

      const directoriesArrayMatcher = Array(data?.directories.length).fill(
        directoryItemMatcher
      )

      const fileItemMatcher = {
        contentType: expect.any(String),
        createdAt: expect.toBeOneOf([expect.any(Date), expect.any(String)]),
        directoryId: expect.any(String),
        id: expect.any(String),
        imageLink: expect.any(String),
        name: expect.any(String),
        ownerId: expect.any(String),
        size: expect.any(Number),
        softDeleted: expect.any(Boolean),
        status: expect.any(String),
        cid: expect.any(String),
        updatedAt: expect.toBeOneOf([expect.any(Date), expect.any(String)]),
        storageClasses: expect.toBeArray(),
        pieceId: expect.toBeOneOf([expect.any(String), expect.anything()]),
        network: expect.toBeOneOf([expect.any(String), expect.anything()]),
        onChainId: expect.toBeOneOf([expect.any(String), expect.anything()]),
        edgeURL: expect.any(String),
        dataURI: expect.any(String),
        isEncrypted: expect.any(Boolean)
      }

      const filesArrayMatcher = Array(data?.files.length).fill(fileItemMatcher)

      expect(error).toBeNull()
      expect(data).not.toBeNull()
      expect(data?.success).toBeTruthy()
      expect(data?.code).toStrictEqual(200)
      expect(data?.directories).toMatchSnapshot(directoriesArrayMatcher)
      expect(data?.files).toMatchSnapshot(filesArrayMatcher)
    })

    it('should not get drive content and return error', async () => {
      const [data, error] = await sdk.drive.contents({
        id: crypto.randomUUID()
      })

      expect(data).toBeNull()
      expect(error).not.toBeNull()
      expect(error?.success).toBeFalsy()
      expect(error?.code).toStrictEqual(404)
    })
  })

  describe('» Get Dive Total Size', () => {
    it('should get the drive total size', async () => {
      const [data, error] = await sdk.drive.getTotalSize({ id: driveId })

      expect(error).toBeNull()
      expect(data).not.toBeNull()
      expect(data?.success).toBeTruthy()
      expect(data?.code).toStrictEqual(200)
      expect(data?.totalSize).toBeNumber()
    })

    it('should return 0 if no directory found', async () => {
      const [data, error] = await sdk.drive.getTotalSize({
        id: crypto.randomUUID()
      })

      expect(error).toBeNull()
      expect(data).not.toBeNull()
      expect(data?.success).toBeTruthy()
      expect(data?.code).toStrictEqual(200)
      expect(data?.totalSize).toStrictEqual(0)
    })
  })

  describe('» Delete a Drive', () => {
    it('should delete a drive', async () => {
      const [data, error] = await sdk.drive.delete({ id: driveId })

      expect(error).toBeNull()
      expect(data).not.toBeNull()
      expect(data?.success).toBeTruthy()
      expect(data?.deletedFolders).toBeArrayOfSize(1)
      expect(data?.deletedFolders).toIncludeAllPartialMembers([driveId])
    })

    it('should return error if no drive found', async () => {
      const [data, error] = await sdk.drive.delete({
        id: crypto.randomUUID()
      })

      expect(data).toBeNull()
      expect(error).not.toBeNull()
      expect(error?.success).toBeFalsy()
      expect(error?.code).toStrictEqual(404)
    })
  })

  afterAll(async () => {
    await sdk.drive.delete({ id: driveId })
  })
})
