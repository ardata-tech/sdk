import DeltaStorage, { DeltaStorageInit } from '../src/index'
const apiKey =
  '00000000-0000-0000-0000-000000000000.0.7e66e3b8-82be-422a-ba53-5acb1bcf3940.B35TSfU1jDkmidXUwsUze49uYz9wRWiVQ1iby1567dHS'

let sdk: DeltaStorageInit
let directoryId: string
let driveId: string
let fileAccessEmail = 'test@gmail.com'
let originalSettingsNode: string
let originalSettingsSecureMode: boolean
const fileId = '58b95726-1465-413c-b7ff-939126c657f2'
const fileCid = 'bafybeierynf7q33vfbvpbotg42mjgfvrqj5ql7efzst6pkvhm7ceeq3ccu'

beforeAll(() => {
  sdk = DeltaStorage.init({
    apiKey
  })
})

afterAll(async () => {
  await sdk.directory.delete({ id: directoryId })
  await sdk.drive.delete({ id: driveId })
})

test('should be able to create a drive', async () => {
  const drive = await sdk.drive.create({ name: 'Drive' })
  expect(drive.name).toEqual('Drive')
  driveId = drive.id
})

test('should be able to view drive contents', async () => {
  const drive = await sdk.drive.contents({ id: driveId })
  expect(drive.directories).toBeInstanceOf(Array)
  expect(drive.files).toBeInstanceOf(Array)
})

test('should be able to create a directory in a drive', async () => {
  const name = 'Sub-directory'
  const directory = await sdk.directory.create({
    name,
    parentDirectoryId: driveId
  })
  expect(directory.name).toEqual(name)
  const drive = await sdk.drive.contents({ id: driveId })
  directoryId = directory.id
  expect(drive.directories).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        id: directoryId
      })
    ])
  )
})

test('should be able to read root directory', async () => {
  const directory = await sdk.directory.contents({})
  expect(directory.directories).toBeInstanceOf(Array)
  expect(directory.files).toBeInstanceOf(Array)
})

test('should be able to read a specific directory', async () => {
  const directory = await sdk.directory.contents({ id: directoryId })
  expect(directory.directories).toBeInstanceOf(Array)
  expect(directory.files).toBeInstanceOf(Array)
})

test('should be able to rename a specific directory', async () => {
  const name = 'Directory new name'
  const directory = await sdk.directory.rename({
    id: directoryId,
    name
  })
  expect(directory.name).toEqual(name)
})

test('should be able to move to a new directory', async () => {
  const subDirectory = await sdk.directory.create({
    name: 'Inside sub-directory',
    parentDirectoryId: directoryId
  })
  const subDirectoryId = subDirectory.id
  await sdk.drive.move({
    driveId,
    directoryIdsToMove: [subDirectoryId]
  })
  const drive = await sdk.drive.contents({
    id: driveId
  })
  expect(drive.directories).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        id: subDirectoryId
      })
    ])
  )
  await sdk.directory.delete({ id: subDirectoryId })
})
test('should be able to get the total size', async () => {
  const totalSize = await sdk.file.getTotalSize()
  expect(typeof totalSize).toBe('number')
})

test('should be able to get the directory size', async () => {
  const totalSize = await sdk.directory.getTotalSize({ id: directoryId })
  expect(typeof totalSize).toBe('number')
})

test('should be able to get the drive size', async () => {
  const drive = await sdk.drive.create({
    name: 'drive delete'
  })
  const totalSize = await sdk.drive.getTotalSize({
    id: driveId
  })
  expect(typeof totalSize).toBe('number')
  sdk.drive.delete({
    id: drive.id
  })
})

test('should be able to soft delete a directory', async () => {
  const result = await sdk.directory.delete({
    id: directoryId
  })
  expect(result.success).toBeTruthy()
})

test('should be able to read storage', async () => {
  const data = await sdk.storage.read()
  const storage = data.storage
  expect(storage).toHaveProperty('id')
  expect(storage).toHaveProperty('name')
  expect(storage).toHaveProperty('capacity')
  expect(typeof storage.capacity).toBe('string')
  expect(data).toHaveProperty('quantity')
  expect(typeof data.quantity).toBe('number')
})

test('should be able to add file access to an email', async () => {
  const data = await sdk.fileAccess.add({
    fileId,
    cid: fileCid,
    body: {
      email: fileAccessEmail
    }
  })
  expect(data).toHaveProperty('success')
  expect(data.success).toBeTruthy()
})

test('should be able to read file access', async () => {
  const data = await sdk.fileAccess.read({
    fileId,
    cid: fileCid
  })
  const users = data.users
  expect(users).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        email: fileAccessEmail
      })
    ])
  )
  expect(data).toHaveProperty('users')
  expect(data).toHaveProperty('secureSharing')
  expect(data).toHaveProperty('password')
})
test('should be able to delete file access from an email', async () => {
  const data = await sdk.fileAccess.delete({
    fileId,
    cid: fileCid,
    body: {
      email: fileAccessEmail
    }
  })
  expect(data).toHaveProperty('success')
  expect(data.success).toBeTruthy()

  const fileAccess = await sdk.fileAccess.read({
    cid: fileCid,
    fileId
  })

  const users = fileAccess.users
  expect(users).toEqual(
    expect.arrayContaining([
      expect.not.objectContaining({
        email: fileAccessEmail
      })
    ])
  )
})

test('should be able to update file access to public', async () => {
  const secureSharingMode = 'PUBLIC'
  const data = await sdk.fileAccess.update({
    fileId,
    cid: fileCid,
    body: {
      secureSharing: secureSharingMode
    }
  })
  expect(data).toHaveProperty('success')
  expect(data.success).toBeTruthy()

  const fileAccess = await sdk.fileAccess.read({
    fileId,
    cid: fileCid
  })

  expect(fileAccess.secureSharing).toBe(secureSharingMode)
})

test('should be able to update file access to password', async () => {
  const secureSharingMode = 'PASSWORD'
  const data = await sdk.fileAccess.update({
    fileId,
    cid: fileCid,
    body: {
      secureSharing: secureSharingMode
    }
  })
  expect(data).toHaveProperty('success')
  expect(data.success).toBeTruthy()

  const fileAccess = await sdk.fileAccess.read({
    fileId,
    cid: fileCid
  })

  expect(fileAccess.secureSharing).toBe(secureSharingMode)
})

test('should be able to update file access to restricted', async () => {
  const secureSharingMode = 'RESTRICTED'
  const data = await sdk.fileAccess.update({
    fileId,
    cid: fileCid,
    body: {
      secureSharing: secureSharingMode
    }
  })
  expect(data).toHaveProperty('success')
  expect(data.success).toBeTruthy()

  const fileAccess = await sdk.fileAccess.read({
    fileId,
    cid: fileCid
  })

  expect(fileAccess.secureSharing).toBe(secureSharingMode)
})

test('should verify correct file access password', async () => {
  const password = 'qwerty123'
  const data = await sdk.fileAccess.verifyPassword({
    fileId,
    cid: fileCid,
    body: {
      password
    }
  })
  expect(data).toHaveProperty('success')
  expect(data.success).toBeTruthy()
  expect(data.isVerify).toBeTruthy()
})

test('should be able to read settings', async () => {
  const data = await sdk.settings.read()
  originalSettingsNode = data.settings.node
  originalSettingsSecureMode = data.settings.isSecureMode
  expect(data).toHaveProperty('settings')
  expect(data.settings).toHaveProperty('node')
  expect(data.settings).toHaveProperty('isSecureMode')
  expect(data.success).toBeTruthy()
})

test('should be able to update settings', async () => {
  const node = 'https://test.vulcaniclabs.com'
  const data = await sdk.settings.update({ node, isSecureMode: false })
  expect(data.success).toBeTruthy()
  const res = await sdk.settings.read()
  const settings = res.settings
  expect(settings.node).toBe(node)
  expect(settings.isSecureMode).toBeFalsy()
  await sdk.settings.update({
    node: originalSettingsNode,
    isSecureMode: originalSettingsSecureMode
  })
})

test('should be able read encryption key', async () => {
  const data = await sdk.settings.getEncryptionKey()
  expect(data.success).toBeTruthy()
  expect(data).toHaveProperty('encryptionKey')
})
test('should be able to verify encryption key', async () => {
  const data = await sdk.settings.verifyEncryptionKey({
    encryptionKey: 'f9e39c95-dbff-409a-8895-fc73fa70dde9'
  })
  expect(data.success).toBeTruthy()
  expect(data.isVerify).toBeTruthy()
})

test('should be able get all file replications', async () => {
  const replications = await sdk.file.getReplications({
    cid: 'bafybeicq3v2b44mbw7kv7tbzr6jmala7ipxwclugw56tomwtvmz3bdqls4'
  })

  expect(replications?.Sia).toHaveProperty('hasMore')
  expect(replications?.IPFS).toHaveProperty('name')
})
