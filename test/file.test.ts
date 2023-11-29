import DeltaStorage, { DeltaStorageInit } from '../src'
import dotenv from 'dotenv'
import crypto from 'crypto'
import * as matchers from 'jest-extended'
import fs from 'fs/promises'
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
let directoryId: string

let filesIds: string[] = []
let cid: string

const path = `${__dirname}/testing.txt`
let file: File

describe('===== Drive test =====', () => {
  beforeAll(async () => {
    sdk = DeltaStorage.init({ apiKey: API_KEY })
    let fileContent = await fs.readFile(path)
    const blob = new Blob([fileContent], { type: 'text/plain' })
    file = new global.File([blob], 'testing.txt', { type: 'text/plain' })

    const [driveData] = await sdk.drive.getAll()
    const [data] = await sdk.directory.create({
      parentDirectoryId: driveData?.drives[0].id ?? '',
      name: 'Testing Directory'
    })

    directoryId = data?.id ?? ''
  })

  describe('» Upload a File', () => {
    it('should upload a file', async () => {
      const [data, error] = await sdk.file.upload({ file, directoryId })

      expect(error).toBeNull()
      expect(data).not.toBeNull()
      expect(data?.success).toBeTruthy()
      expect(data?.code).toStrictEqual(201)

      filesIds.push(data?.id ?? '')
    })

    it('should not upload a file and return error', async () => {
      const [data, error] = await sdk.file.upload({
        file,
        directoryId: crypto.randomUUID()
      })

      expect(data).toBeNull()
      expect(error).not.toBeNull()
      expect(error?.success).toBeFalsy()
      expect(error?.code).toStrictEqual(404)
    })

    it('should bulk upload file', async () => {
      const fileArray = Array(4).fill({ file, directoryId })

      const [data, error] = await sdk.file.bulkUpload({ files: fileArray })

      const fileItemMatcher = {
        success: expect.toBeTrue(),
        code: expect.toEqualCaseInsensitive('201'),
        id: expect.any(String),
        name: expect.any(String),
        cid: expect.any(String),
        directoryId: expect.toEqualCaseInsensitive(directoryId),
        ownerId: expect.any(String),
        size: expect.any(Number),
        contentType: expect.any(String),
        softDeleted: expect.toBeFalse(),
        status: expect.any(String),
        network: null,
        pieceId: null,
        onChainId: null,
        createdAt: expect.toBeDateString(),
        updatedAt: expect.toBeDateString(),
        driveId: expect.any(String),
        edgeURL: expect.any(String),
        password: null,
        isEncrypted: expect.toBeFalse(),
        version: expect.toEqualCaseInsensitive('1'),
        versionTag: expect.toEqualCaseInsensitive('latest'),
        sharedId: expect.any(String),
        storageClasses: expect.toBeArray(),
        labels: expect.toBeArray(),
        imageLink: expect.any(String)
      }

      const filesArrayMatcher = Array(data?.length).fill(fileItemMatcher)

      expect(error).toBeNull()
      expect(data).not.toBeNull()
      expect(data).toBeArray()
      expect(data).toBeArrayOfSize(4)
      expect(data).toMatchSnapshot(filesArrayMatcher)

      data?.forEach((d) => filesIds.push(d.id))
    })
  })

  describe('List of Files', () => {
    it('should get a list of files', async () => {
      const [data, error] = await sdk.file.list()

      const fileItemMatcher = {
        id: expect.any(String),
        name: expect.any(String),
        cid: expect.any(String),
        directoryId: expect.any(String),
        ownerId: expect.any(String),
        size: expect.any(Number),
        contentType: expect.any(String),
        softDeleted: expect.toBeFalse(),
        status: expect.any(String),
        network: null,
        pieceId: null,
        onChainId: null,
        createdAt: expect.toBeDateString(),
        updatedAt: expect.toBeDateString(),
        driveId: expect.any(String),
        edgeURL: expect.any(String),
        password: null,
        isEncrypted: expect.toBeFalse(),
        version: expect.toEqualCaseInsensitive('1'),
        versionTag: expect.toEqualCaseInsensitive('latest'),
        sharedId: expect.any(String),
        storageClasses: expect.toBeArray(),
        labels: expect.toBeArray(),
        imageLink: expect.any(String)
      }

      const filesArrayMatcher = Array(data?.files.length).fill(fileItemMatcher)

      expect(error).toBeNull()
      expect(data).not.toBeNull()
      expect(data?.success).toBeTruthy()
      expect(data?.code).toStrictEqual(200)
      expect(data?.files).toMatchSnapshot(filesArrayMatcher)
    })
  })

  describe('File Details', () => {
    it('should get the file details', async () => {
      const [data, error] = await sdk.file.details({ id: filesIds[0] })

      expect(error).toBeNull()
      expect(data).not.toBeNull()
      expect(data?.success).toBeTruthy()
      expect(data?.code).toStrictEqual(200)
      expect(data?.id).toStrictEqual(filesIds[0])
    })

    it('should not get the file details and return error', async () => {
      const [data, error] = await sdk.file.details({ id: crypto.randomUUID() })

      expect(data).toBeNull()
      expect(error).not.toBeNull()
      expect(error?.success).toBeFalsy()
      expect(error?.code).toStrictEqual(404)

      cid = data?.cid ?? ''
    })
  })

  describe('Rename a file', () => {
    it('should rename a file', async () => {
      const newName = 'New Testing'
      const [data, error] = await sdk.file.rename({
        id: filesIds[0],
        name: newName
      })

      const [details] = await sdk.file.details({
        id: filesIds[0]
      })

      expect(error).toBeNull()
      expect(data).not.toBeNull()
      expect(data?.success).toBeTruthy()
      expect(data?.code).toStrictEqual(200)

      expect(details).not.toBeNull()
      expect(details?.name).toStrictEqual(`${newName}.txt`)
    })

    it('should not rename a file and return error', async () => {
      const newName = 'New Testing'
      const [data, error] = await sdk.file.rename({
        id: crypto.randomUUID(),
        name: newName
      })

      expect(data).toBeNull()
      expect(error).not.toBeNull()
      expect(error?.success).toBeFalsy()
      expect(error?.code).toStrictEqual(404)
    })
  })

  describe('Update a file', () => {
    it('should update file name', async () => {
      const newName = 'New Testing'
      const [data, error] = await sdk.file.update({
        id: filesIds[1],
        name: newName
      })

      const [details] = await sdk.file.details({
        id: filesIds[1]
      })

      expect(error).toBeNull()
      expect(data).not.toBeNull()
      expect(data?.success).toBeTruthy()
      expect(data?.code).toStrictEqual(200)

      expect(details).not.toBeNull()
      expect(details?.name).toStrictEqual(`${newName}.txt`)
    })

    it('should not update file content if same file content', async () => {
      const [details] = await sdk.file.details({
        id: filesIds[0]
      })

      const fileCid = details?.cid

      const [data, error] = await sdk.file.update({ id: filesIds[0], file })

      expect(error).toBeNull()
      expect(data).not.toBeNull()
      expect(data?.success).toBeTruthy()
      expect(data?.code).toStrictEqual(201)
      expect(data?.cid).toStrictEqual(fileCid)
    })
  })

  describe('File Replication', () => {
    it('should get file replication', async () => {
      const [data] = await sdk.file.getReplications({ cid })

      const replicationItemMatcher = {
        IPFS: {
          links: expect.toBeArray(),
          status: expect.any(String),
          metadata: null
        },
        Sia: {
          links: expect.toBeArray(),
          status: expect.any(String),
          metadata: null
        },
        Filecoin: {
          links: expect.toBeArray(),
          status: expect.any(String),
          metadata: null
        },
        Filefilego: {
          links: expect.toBeArray(),
          status: expect.any(String),
          metadata: null
        }
      }

      // expect(error).toBeNull()
      expect(data).not.toBeNull()
      expect(data).toMatchSnapshot(replicationItemMatcher)
    })
  })

  describe('File Url', () => {
    it('should get the file url', async () => {
      const [url, error] = await sdk.file.getURL({ id: filesIds[0] })

      expect(error).toBeNull()
      expect(url).not.toBeNull()
      expect(url).toBeString()
    })

    it('should not get the file url and return error', async () => {
      const [url, error] = await sdk.file.getURL({ id: crypto.randomUUID() })

      expect(url).toBeNull()
      expect(error).not.toBeNull()
      expect(error?.success).toBeFalsy()
      expect(error?.code).toStrictEqual(404)
    })
  })

  describe('Get total size', () => {
    it('should get the total size', async () => {
      const [data, error] = await sdk.file.getTotalSize()

      expect(error).toBeNull()
      expect(data).not.toBeNull()
      expect(data?.success).toBeTruthy()
      expect(data?.code).toStrictEqual(200)
      expect(data?.totalSize).toBeNumber()
    })
  })

  describe('Delete file', () => {
    it('should delete a file', async () => {
      const [data, error] = await sdk.file.delete({ id: filesIds[2] })

      expect(error).toBeNull()
      expect(data).not.toBeNull()
      expect(data?.success).toBeTruthy()
      expect(data?.code).toStrictEqual(200)
      expect(data?.id).toStrictEqual(filesIds[2])
      expect(data?.softDeleted).toBeTruthy()
    })

    it('should not delete a file and return error', async () => {
      const [data, error] = await sdk.file.delete({ id: crypto.randomUUID() })

      expect(data).toBeNull()
      expect(error).not.toBeNull()
      expect(error?.success).toBeFalsy()
      expect(error?.code).toStrictEqual(404)
    })
  })

  afterAll(async () => {
    await sdk.directory.delete({ id: directoryId })
    for (const id of filesIds) {
      await sdk.file.delete({ id })
    }
  })
})
