import DeltaStorage, { DeltaStorageInit } from '../src'
import crypto from 'crypto'
import dotenv from 'dotenv'
import * as matchers from 'jest-extended'
dotenv.config()
expect.extend(matchers)

// TODO: Create a test account for each env
const API_KEY = process.env.API_KEY ?? ''

if (!API_KEY) {
  throw new Error(
    'API_KEY is not defined. Make sure to set it in your .env file.'
  )
}

let sdk: DeltaStorageInit
let driveId: string
let directoryId: string
let subDirectoryId: string

describe('===== Directory test =====', () => {
  beforeAll(async () => {
    sdk = DeltaStorage.init({ apiKey: API_KEY })
    const drive = await sdk.drive.create({ name: 'Testing Drive' })
    driveId = drive.id
  })

  describe('» Create a Directory', () => {
    it('should create a directory and return data', async () => {
      const name = 'Test Directory'
      const [directory, error] = await sdk.directory.create({
        name,
        parentDirectoryId: driveId
      })

      expect(error).toBeNull()
      expect(directory).not.toBeNull()
      expect(directory?.success).toBeTruthy()
      expect(directory?.code).toStrictEqual(200)
      expect(directory?.name).toStrictEqual(name)

      directoryId = directory?.id ?? ''
    })
  })

  describe('» Create a Sub Directory', () => {
    it('should create a sub directory and return data', async () => {
      const name = 'Test Sub Directory'
      const [directory, error] = await sdk.directory.create({
        name,
        parentDirectoryId: directoryId
      })

      expect(error).toBeNull()
      expect(directory).not.toBeNull()
      expect(directory?.success).toBeTruthy()
      expect(directory?.code).toStrictEqual(200)
      expect(directory?.name).toStrictEqual(name)

      subDirectoryId = directory?.id ?? ''
    })

    it('should not create a sub directory if parentDirectoryId not exist', async () => {
      const name = 'Test Sub Directory'
      const [directory, error] = await sdk.directory.create({
        name,
        parentDirectoryId: crypto.randomUUID()
      })

      expect(directory).toBeNull()
      expect(error).not.toBeNull()
      expect(error?.success).toBeFalsy()
      expect(error?.code).toStrictEqual(404)
    })
  })

  describe('» Directory Size', () => {
    it('should get the directory size', async () => {
      const [data, error] = await sdk.directory.getTotalSize({
        id: driveId
      })

      expect(error).toBeNull()
      expect(data).not.toBeNull()
      expect(data?.success).toBeTruthy()
      expect(data?.code).toStrictEqual(200)
      expect(data?.totalSize).toBeNumber()
    })

    it('should return error if no directory found', async () => {
      const [data, error] = await sdk.directory.getTotalSize({
        id: crypto.randomUUID()
      })

      expect(data).toBeNull()
      expect(error).not.toBeNull()
      expect(error?.success).toBeFalsy()
      expect(error?.code).toStrictEqual(404)
    })
  })

  describe('» Directory Content', () => {
    it('should get the directory content', async () => {
      const [data, error] = await sdk.directory.contents({
        id: directoryId
      })

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

    it('should not get directory content and return error', async () => {
      const [data, error] = await sdk.directory.contents({
        id: crypto.randomUUID()
      })

      expect(data).toBeNull()
      expect(error).not.toBeNull()
      expect(error?.success).toBeFalsy()
      expect(error?.code).toStrictEqual(404)
    })
  })

  describe('» Directory By Segment', () => {
    it('should get directory by segment', async () => {
      const segments = `${driveId}/${directoryId}/${subDirectoryId}`
      const [data, error] = await sdk.directory.getBySegment({
        segments
      })

      const directoryItemMatcher = {
        id: expect.any(String),
        name: expect.any(String)
      }

      const directoriesArrayMatcher = Array(data?.directories.length).fill(
        directoryItemMatcher
      )

      expect(error).toBeNull()
      expect(data).not.toBeNull()
      expect(data?.success).toBeTruthy()
      expect(data?.code).toStrictEqual(200)
      expect(data?.directoryLink).toStrictEqual(segments)
      expect(data?.directories).toMatchSnapshot(directoriesArrayMatcher)
    })

    it('should return empty array if segments not found', async () => {
      const segments = `${crypto.randomUUID()}/${crypto.randomUUID()}/${crypto.randomUUID()}`
      const [data, error] = await sdk.directory.getBySegment({
        segments
      })

      expect(error).toBeNull()
      expect(data).not.toBeNull()
      expect(data?.success).toBeTruthy()
      expect(data?.code).toStrictEqual(200)
      expect(data?.directories).toBeEmpty()
    })

    it('should return error if segments is empty', async () => {
      const [data, error] = await sdk.directory.getBySegment({
        segments: ''
      })

      expect(data).toBeNull()
      expect(error).not.toBeNull()
      expect(error?.success).toBeFalsy()
      expect(error?.code).toStrictEqual(500)
    })
  })

  describe('» Rename a Directory', () => {
    it('should rename a directory', async () => {
      const newName = 'New testing directory'
      const [data, error] = await sdk.directory.rename({
        id: directoryId,
        name: newName
      })

      expect(error).toBeNull()
      expect(data).not.toBeNull()
      expect(data?.success).toBeTruthy()
      expect(data?.code).toStrictEqual(200)
      expect(data?.id).toStrictEqual(directoryId)
      expect(data?.name).toStrictEqual(newName)
    })

    it('should return error if directory not found', async () => {
      const newName = 'New testing directory'
      const [data, error] = await sdk.directory.rename({
        id: crypto.randomUUID(),
        name: newName
      })

      expect(data).toBeNull()
      expect(error).not.toBeNull()
      expect(error?.code).toStrictEqual(404)
    })
  })

  describe('» Update a Directory', () => {
    it('should update a directory', async () => {
      const newName = 'New testing directory'
      const newStorageClass = 'warm'
      const [data, error] = await sdk.directory.update({
        id: directoryId,
        name: newName,
        storageClass: newStorageClass
      })

      expect(error).toBeNull()
      expect(data).not.toBeNull()
      expect(data?.success).toBeTruthy()
      expect(data?.code).toStrictEqual(200)
      expect(data?.id).toStrictEqual(directoryId)
      expect(data?.name).toStrictEqual(newName)
      expect(data?.storageClassName).toStrictEqual(newStorageClass)
    })
  })

  describe('» Move a Directory', () => {
    it('should move the sub directory to drive', async () => {
      const [data, error] = await sdk.directory.move({
        id: driveId,
        directoryIdsToMove: [subDirectoryId]
      })

      const [content, contentError] = await sdk.directory.contents({
        id: driveId
      })

      expect(error).toBeNull()
      expect(contentError).toBeNull()

      expect(data).not.toBeNull()
      expect(content).not.toBeNull()

      expect(data?.success).toBeTruthy()
      expect(content?.success).toBeTruthy()

      expect(content?.directories).toBeArrayOfSize(2)
      expect(content?.directories).toIncludeAllPartialMembers([
        { id: directoryId },
        { id: subDirectoryId }
      ])
    })

    it('should return error if no directory found', async () => {
      const [data, error] = await sdk.directory.move({
        id: crypto.randomUUID(),
        directoryIdsToMove: [crypto.randomUUID()]
      })

      expect(data).toBeNull()
      expect(error).not.toBeNull()
      expect(error?.success).toBeFalsy()
      expect(error?.code).toStrictEqual(404)
    })
  })

  describe('» Delete a Directory', () => {
    it('should delete a directory', async () => {
      const [data, error] = await sdk.directory.delete({ id: subDirectoryId })

      const [content, contentError] = await sdk.directory.contents({
        id: driveId
      })

      expect(error).toBeNull()
      expect(contentError).toBeNull()

      expect(data).not.toBeNull()
      expect(content).not.toBeNull()

      expect(data?.success).toBeTruthy()
      expect(content?.success).toBeTruthy()

      expect(data?.deletedFolders).toBeArrayOfSize(1)
      expect(data?.deletedFolders).toIncludeAllPartialMembers([subDirectoryId])

      expect(content?.directories).toBeArrayOfSize(1)
      expect(content?.directories).not.toIncludeAllPartialMembers([
        { id: subDirectoryId }
      ])
    })

    it('should return error if no directory found', async () => {
      const [data, error] = await sdk.directory.delete({
        id: crypto.randomUUID()
      })

      expect(data).toBeNull()
      expect(error).not.toBeNull()
      expect(error?.success).toBeFalsy()
      expect(error?.code).toStrictEqual(404)
    })
  })

  afterAll(async () => {
    await sdk.directory.delete({ id: directoryId })
    await sdk.drive.delete({ id: driveId })
  })
})
