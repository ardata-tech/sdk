import DeltaStorageSDK from '../src/index'

const apiKey =
  '00000000-0000-0000-0000-000000000000.0.f2e395ca-a158-48d5-9bcc-d00b952a7c2f.31dFnqgGjnh1NbguqD7CKQh7DzvaCe9sraytpWn3E9Lu'

let sdk: DeltaStorageSDK
let directoryId: string
let parentDirectoryId: string

beforeAll(() => {
  sdk = new DeltaStorageSDK({
    apiKey,
    host: 'http://localhost:1337'
  })
})

test('should be able to create directory', async () => {
  const name = 'Directory created from test'
  const directory = await sdk.createDirectory(name)
  const parent = await sdk.createDirectory('Parent Directory')

  expect(directory.data.name).toEqual(name)
  directoryId = directory.data.id
  parentDirectoryId = parent.data.id
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
  await sdk.move(parentDirectoryId, [directoryId])
  const directory = await sdk.readDirectory(parentDirectoryId)
  expect(directory.data.directories).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        id: directoryId
      })
    ])
  )
})

test('should be able to soft delete a directory', async () => {
  const result = await sdk.deleteDirectory(directoryId)
  expect(result.data.success).toBeTruthy()
})
