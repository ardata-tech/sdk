import DeltaStorageSDK from '../src/index'

const apiKey =
  '00000000-0000-0000-0000-000000000000.0.7e66e3b8-82be-422a-ba53-5acb1bcf3940.B35TSfU1jDkmidXUwsUze49uYz9wRWiVQ1iby1567dHS'

let sdk: DeltaStorageSDK
let directoryId: string
let driveId: string
let fileAccessEmail = 'test@gmail.com'
let originalSettingsNode: string
let originalSettingsSecureMode: boolean
const fileId = '58b95726-1465-413c-b7ff-939126c657f2'
const fileCid = 'bafybeierynf7q33vfbvpbotg42mjgfvrqj5ql7efzst6pkvhm7ceeq3ccu'

beforeAll(() => {
  sdk = new DeltaStorageSDK({
    apiKey
  })
})

afterAll(async () => {
  await sdk.deleteDirectory(directoryId)
  await sdk.deleteDrive(driveId)
})

test('should be able to create a drive', async () => {
  const drive = await sdk.createDrive('Drive')
  expect(drive.data.name).toEqual('Drive')
  driveId = drive.data.id
})

test('should be able to view drive contents', async () => {
  const drive = await sdk.viewDriveContents(driveId)
  expect(drive.data.directories).toBeInstanceOf(Array)
  expect(drive.data.files).toBeInstanceOf(Array)
})

test('should be able to create a directory in a drive', async () => {
  const name = 'Sub-directory'
  const directory = await sdk.createDirectory(name, driveId)
  expect(directory.data.name).toEqual(name)
  const drive = await sdk.readDirectory(driveId)
  directoryId = directory.data.id
  expect(drive.data.directories).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        id: directoryId
      })
    ])
  )
})

test('should be able to read root directory', async () => {
  const directory = await sdk.readDirectory()
  expect(directory.data.directories).toBeInstanceOf(Array)
  expect(directory.data.files).toBeInstanceOf(Array)
})

test('should be able to read a specific directory', async () => {
  const directory = await sdk.readDirectory(directoryId)
  expect(directory.data.directories).toBeInstanceOf(Array)
  expect(directory.data.files).toBeInstanceOf(Array)
})

test('should be able to rename a specific directory', async () => {
  const name = 'Directory new name'
  const directory = await sdk.renameDirectory(directoryId, name)
  expect(directory.data.name).toEqual(name)
})

test('should be able to move to a new directory', async () => {
  const subDirectory = await sdk.createDirectory(
    'Inside sub-directory',
    directoryId
  )
  const subDirectoryId = subDirectory.data.id
  await sdk.move(driveId, [subDirectoryId])
  const drive = await sdk.readDirectory(driveId)
  expect(drive.data.directories).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        id: subDirectoryId
      })
    ])
  )
  await sdk.deleteDirectory(subDirectoryId)
})
test('should be able to get the total size', async () => {
  const totalSize = await sdk.getTotalSize()
  expect(typeof totalSize).toBe('number')
})

test('should be able to get the directory size', async () => {
  const totalSize = await sdk.readDirectorySize(directoryId)
  expect(typeof totalSize).toBe('number')
})

test('should be able to get the drive size', async () => {
  const drive = await sdk.createDrive('drive delete')
  const totalSize = await sdk.readDriveSize(driveId)
  expect(typeof totalSize).toBe('number')
  sdk.deleteDrive(drive.data.id)
})

test('should be able to soft delete a directory', async () => {
  const result = await sdk.deleteDirectory(directoryId)
  expect(result.data.success).toBeTruthy()
})

test('should be able to read storage', async () => {
  const data = await sdk.readStorage()
  const storage = data.storage
  expect(storage).toHaveProperty('id')
  expect(storage).toHaveProperty('name')
  expect(storage).toHaveProperty('capacity')
  expect(typeof storage.capacity).toBe('string')
  expect(data).toHaveProperty('quantity')
  expect(typeof data.quantity).toBe('number')
})

test('should be able to add file access to an email', async () => {
  const data = await sdk.addFileAccess(fileId, fileCid, {
    email: fileAccessEmail
  })
  expect(data).toHaveProperty('success')
  expect(data.success).toBeTruthy()
})

test('should be able to read file access', async () => {
  const data = await sdk.readFileAccess(fileId, fileCid)
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
  const data = await sdk.deleteFileAccess(fileId, fileCid, {
    email: fileAccessEmail
  })
  expect(data).toHaveProperty('success')
  expect(data.success).toBeTruthy()

  const fileAccess = await sdk.readFileAccess(fileId, fileCid)

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
  const data = await sdk.updateFileAccess(fileId, fileCid, {
    secureSharing: secureSharingMode
  })
  expect(data).toHaveProperty('success')
  expect(data.success).toBeTruthy()

  const fileAccess = await sdk.readFileAccess(fileId, fileCid)

  expect(fileAccess.secureSharing).toBe(secureSharingMode)
})

test('should be able to update file access to password', async () => {
  const secureSharingMode = 'PASSWORD'
  const data = await sdk.updateFileAccess(fileId, fileCid, {
    secureSharing: secureSharingMode
  })
  expect(data).toHaveProperty('success')
  expect(data.success).toBeTruthy()

  const fileAccess = await sdk.readFileAccess(fileId, fileCid)

  expect(fileAccess.secureSharing).toBe(secureSharingMode)
})

test('should be able to update file access to restricted', async () => {
  const secureSharingMode = 'RESTRICTED'
  const data = await sdk.updateFileAccess(fileId, fileCid, {
    secureSharing: secureSharingMode
  })
  expect(data).toHaveProperty('success')
  expect(data.success).toBeTruthy()

  const fileAccess = await sdk.readFileAccess(fileId, fileCid)

  expect(fileAccess.secureSharing).toBe(secureSharingMode)
})

test('should verify correct file access password', async () => {
  const password = 'qwerty123'
  const data = await sdk.verifyFileAccessPassword(fileId, fileCid, {
    password
  })
  expect(data).toHaveProperty('success')
  expect(data.success).toBeTruthy()
  expect(data.isVerify).toBeTruthy()
})

test('should be able to read settings', async () => {
  const data = await sdk.readSettings()
  originalSettingsNode = data.settings.node
  originalSettingsSecureMode = data.settings.isSecureMode
  expect(data).toHaveProperty('settings')
  expect(data.settings).toHaveProperty('node')
  expect(data.settings).toHaveProperty('isSecureMode')
  expect(data.success).toBeTruthy()
})

test('should be able to update settings', async () => {
  const node = 'https://test.vulcaniclabs.com'
  const data = await sdk.updateSettings({ node, isSecureMode: false })
  expect(data.success).toBeTruthy()
  const res = await sdk.readSettings()
  const settings = res.settings
  expect(settings.node).toBe(node)
  expect(settings.isSecureMode).toBeFalsy()
  await sdk.updateSettings({
    node: originalSettingsNode,
    isSecureMode: originalSettingsSecureMode
  })
})

test('should be able read encryption key', async () => {
  const data = await sdk.readEncryptionKey()
  expect(data.success).toBeTruthy()
  expect(data).toHaveProperty('encryptionKey')
})
test('should be able to verify encryption key', async () => {
  const data = await sdk.verifyEncryptionKey(
    'f9e39c95-dbff-409a-8895-fc73fa70dde9'
  )
  expect(data.success).toBeTruthy()
  expect(data.isVerify).toBeTruthy()
})

test('should be able get all file replications', async () => {
  const replications = await sdk.getFileReplications(
    'bafybeicq3v2b44mbw7kv7tbzr6jmala7ipxwclugw56tomwtvmz3bdqls4'
  )

  expect(replications?.Sia).toHaveProperty('hasMore')
})
