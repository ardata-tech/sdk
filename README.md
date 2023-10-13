# Delta Storage SDK

Official SDK for [Delta Storage](https://delta.storage/)

## Introduction

The Delta Storage SDK is a JavaScript library that provides asbtraction for interacting with the [Delta Storage API](https://delta-storage.readme.io). This SDK allows you to perform various operations such as reading files, uploading files, managing directories, and more.

## Installation

You can install the Delta Storage SDK using your preferred package manager:

```
npm install --save @delta-storage/sdk
```

```
yarn add --save @delta-storage/sdk
```

## Getting Started

To start using the Delta Storage SDK, you need to acquire your API_KEY from your [app.delta.storage](https://app.delta.storage/) account. Once you have your API_KEY, Here's how you can get started:

```typescript
import DeltaStorageSDK from '@delta-storage/sdk'

const deltaStorage = new DeltaStorageSDK({
  apiKey: 'YOUR API KEY'
})
```

## Usage

Once you've set up your instance, using the Delta Storage SDK is easy as follows:

- Directory Management
  - [createDirectory](#createDirectory)
  - [readDirectory](#readDirectory)
  - [readDirectorySize](#readDirectorySize)
  - [readDirectoryBySegment](#readDirectoryBySegment)
  - [getDirectoryAsZip](#getDirectoryAsZip)
  - [downloadDirectoryAsZip](#downloadDirectoryAsZip)
  - [renameDirectory](#renameDirectory)
  - [deleteDirectory](#deleteDirectory)
- File Management
  - [uploadFile](#uploadFile)
  - [uploadMultipleFiles](#uploadFiles)
  - [readFile](#readFile)
  - [renameFile](#renameFile)
  - [updateFile](#updateFile)
  - [deleteFile](#deleteFile)
  - [addFileAccess](#addFileAccess)
  - [readFileAccess](#readFileAccess)
  - [verifyFileAccessPassword](#verifyFileAccessPassword)
  - [updateFileAccess](#updateFileAccess)
  - [deleteFileAccess](#deleteFileAccess)
- General
  - [move](#move)
  - [getTotalSize](#getTotalSize) (Storage Used)
  - [readStorage](#readStorage) (Storage Capacity)
  - [readSettings](#readSettings)
  - [readEncryptionKey](#readEncryptionKey)
  - [verifyEncryptionKey](#verifyEncryptionKey)
  - [updateSettings](#updateSettings)

## Directory Management

<a name="#createDirectory"></a>

### `createDirectory`

Use the createDirectory method to create a new directory or folder.

```typescript
try {
  const directoryName = 'new_directory' // The name of the directory to create.
  const parentDirectoryId = 'parent_directory_id_here' // The ID of the parent directory or drive.
  const response = await deltaStorage.createDirectory(
    directoryName,
    parentDirectoryId
  )
  console.log(response.data) // Newly created directory details
} catch (error) {
  console.error(error.message)
}
```

**Params**

- `directoryName` (string): The name of the new directory.
- `parentDirectoryId`: The ID of the parent directory where the new directory will be created.

**Required API Key Permission**

- `Create Directory`

<a name="#readDirectory"></a>

### `readDirectory`

Retrieve the contents of a directory by its ID. This method is useful when you want to list the directories and files within a specific directory.

```typescript
try {
  const directoryId = 'directory_id_here' // Replace with the desired directory ID
  const response = await deltaStorage.readDirectory(directoryId)
  const { directories, files } = response.data

  console.log('Directories:')
  directories.forEach((directory) => {
    console.log(directory.name)
  })

  console.log('Files:')
  files.forEach((file) => {
    console.log(file.name)
  })
} catch (error) {
  console.error(error.message)
}
```

**Params**

- `directoryId` (string, optional): The ID of the directory you want to retrieve. If not provided, it retrieves the root directory.

**Required API Key Permission**

- `Read Directory`

<a name="#readDirectorySize"></a>

### `readDirectorySize`

Use the readDirectorySize method to retrieve the total size of a directory.

```typescript
try {
  const directoryId = 'directory_id_here' // The ID of the directory to get the size of.
  const size = await deltaStorage.readDirectorySize(directoryId)
  console.log(`Total size of directory: ${size} bytes`)
} catch (error) {
  console.error(error.message)
}
```

**Params**

- `directoryId` (string): The ID of the directory for which you want to retrieve the size.

**Required API Key Permission**

- `Read Directory`

<a name="#readDirectoryBySegment"></a>

### `readDirectoryBySegment`

Retrieve the contents of a directory by specifying a path using segments. This method is useful when you want to navigate through directories based on a custom path.

```typescript
try {
  const segments = 'folder1/subfolder1/subfolder2' // Replace with your desired path
  const response = await deltaStorage.readDirectoryBySegment(segments)
  const { directories, files } = response.data

  console.log('Directories:')
  directories.forEach((directory) => {
    console.log(directory.name)
  })

  console.log('Files:')
  files.forEach((file) => {
    console.log(file.name)
  })
} catch (error) {
  console.error(error.message)
}
```

**Params**

- `segments` (string): A custom path to the directory, where segments are separated by slashes ('/'). Specify the path to the directory you want to retrieve.

**Required API Key Permission**

- `Read Directory`

<a name="#getDirectoryAsZip"></a>

### `getDirectoryAsZip`

Use the getDirectoryAsZip method to retrieve a directory in Delta Storage as a compressed ZIP archive.

```typescript
try {
  const directoryId = 'directory_id_here' // The ID of the directory to retrieve as a ZIP archive.
  const zipFileName = 'retrieved_directory' // The name of the ZIP file to save on the client side.
  const result = await deltaStorage.getDirectoryAsZip(directoryId, zipFileName)
  if (result.success) {
    console.log(`Directory retrieved as ZIP: ${zipFileName}.zip`)
  } else {
    console.error('Failed to retrieve the directory as a ZIP file.')
  }
} catch (error) {
  console.error(error.message)
}
```

**Params**

- `directoryId` - The ID of the directory to be zipped and downloaded.
- `zipFileName` - The name of the downloaded ZIP file (excluding the ".zip" extension).

**Required API Key Permission**

- `Read Directory`

<a name="#downloadDirectoryAsZip"></a>

### `downloadDirectoryAsZip`

Use the downloadDirectoryAsZip method to download the contents of a directory as a compressed ZIP archive.

```typescript
try {
  const directoryId = 'directory_id_here' // The ID of the directory to be zipped and downloaded.
  const zipFileName = 'downloaded_directory' // The name of the downloaded ZIP file.
  const result = await deltaStorage.downloadDirectoryAsZip(
    directoryId,
    zipFileName
  )
  if (result.success) {
    console.log(`Downloaded ZIP file: ${zipFileName}.zip`)
  } else {
    console.error('Failed to download the directory as a ZIP file.')
  }
} catch (error) {
  console.error(error.message)
}
```

**Params**

- `directoryId` - The ID of the directory to be zipped and downloaded.
- `zipFileName` - The name of the downloaded ZIP file (excluding the ".zip" extension).

**Required API Key Permission**

- `Read Directory`

<a name="#renameDirectory"></a>

### `renameDirectory`

Use the renameDirectory method to rename a directory.

```typescript
try {
  const directoryId = 'directory_id_here' // The ID of the directory to rename.
  const newName = 'new_directory_name' // The new name for the directory.
  await deltaStorage.renameDirectory(directoryId, newName)
  console.log(`Directory renamed to: ${newName}`)
} catch (error) {
  console.error(error.message)
}
```

**Params**

- `directoryId` - The ID of the directory you want to rename.
- `newName ` - The new name for the directory.

**Required API Key Permission**

- `Create Directory` or `Delete Directory`

<a name="#deleteDirectory"></a>

### `deleteDirectory`

Use the deleteDirectory method to delete a directory.

```typescript
try {
  const directoryId = 'directory_id_here' // The ID of the directory to delete.
  await deltaStorage.deleteDirectory(directoryId)
  console.log(`Directory with ID ${directoryId} has been deleted.`)
} catch (error) {
  console.error(error.message)
}
```

**Params**

- `directoryId` - The ID of the directory you want to delete.

**Required API Key Permission**

- `Delete Directory`

## File Management

<a name="#uploadFile"></a>

### `uploadFile`

Use the uploadFile method to upload a file.

```typescript
try {
  const file = /* your file data */; // Your file input or Blob.
  const directoryId = 'directory_id_here'; // The ID of the target directory.
  const storageClasses = ['class1', 'class2']; // An array of storage classes (optional).

  const response = await deltaStorage.uploadFile(file, directoryId, storageClasses);
  console.log(response.data); // Uploaded file details
} catch (error) {
  console.error(error.message);
}
```

**Params**

- `file` (formData): The file data to be uploaded.
- `directoryId` (string): The ID of the target directory.
- `storageClasses` (string[], optional): An array of storage classes. (hot, warm, glacier)

**Required API Key Permission**

- `Upload File`

<a name="#uploadFiles"></a>

### `uploadFiles`

Use the uploadFiles method to upload multiple files.

```typescript
try {
  const files = [
    {
      file: /* file_data_1 */,
      directoryId: 'directory_id_1',
      storageClasses: ['class1', 'class2']
    },
    {
      file: /* file_data_2 */,
      directoryId: 'directory_id_2'
    },
    // Add more file objects as needed
  ];

  await deltaStorage.uploadFiles(files);
  console.log('Files uploaded successfully');
} catch (error) {
  console.error(error.message);
}
```

**Params**

- `files` (array): An array of objects, each containing the properties for file uploads, including `file`, `directoryId`, and `storageClasses` (optional).

**Required API Key Permission**

- `Upload File`

<a name="#readFile"></a>

### `readFile`

Use the readFile method to retrieve the contents of a file by its ID.

```typescript
try {
  const fileId = 'file_id_here' // The ID of the file you want to read.
  const response = await deltaStorage.readFile(fileId)
  console.log(response.data) // The file contents
} catch (error) {
  console.error(error.message)
}
```

**Params**

- `fileId` (string, optional): The ID of the file you want to retrieve. If not provided, it retrieves all your files.

**Required API Key Permission**

- `Read File`

<a name="#renameFile"></a>

### `renameFile`

Use the renameFile method to rename a file.

```typescript
try {
  const fileId = 'file_id_here' // The ID of the file to rename.
  const newName = 'new_file_name.txt' // The new name for the file.
  await deltaStorage.renameFile(fileId, newName)
  console.log(`File renamed to: ${newName}`)
} catch (error) {
  console.error(error.message)
}
```

**Params**

- `fileId` (string): The ID of the file you want to rename.
- `newName` (string): The new name for the file.

**Required API Key Permission**

- `Upload File` or `Delete File`

<a name="#updateFile"></a>

### `updateFile`

Use the updateFile method to update information about a file

```typescript
try {
  const fileId = 'file_id_here' // The ID of the file to update.
  const newName = 'new_file_name.txt' // The new name for the file (optional).
  const additionalClasses = ['class1', 'class2'] // Additional storage classes (optional).
  const removalClasses = ['class3', 'class4'] // Storage classes to remove (optional).

  await deltaStorage.updateFile(
    fileId,
    newName,
    additionalClasses,
    removalClasses
  )
  console.log('File information updated successfully')
} catch (error) {
  console.error(error.message)
}
```

**Params**

- `fileId` (string): The ID of the file you want to rename.
- `newName` (string, optional): The new name for the file.
- `addStorageClasses` (string[], optional): An array of additional - storage classes.
- `removeStorageClasses` (string[], optional): An array of storage classes to remove.

**Required API Key Permission**

- `Upload File` or `Delete File`

<a name="#deleteFile"></a>

### `deleteFile`

Use the deleteFile method to delete a file.

```typescript
try {
  const fileId = 'file_id_here' // The ID of the file to delete.
  await deltaStorage.deleteFile(fileId)
  console.log(`File with ID ${fileId} has been deleted.`)
} catch (error) {
  console.error(error.message)
}
```

**Params**

- `fileId` (string): The ID of the file you want to delete.

**Required API Key Permission**

- `Delete File`

<a name="#addFileAccess"></a>

### `addFileAccess`

Use the addFileAccess method to enable file protection via password or invite-only via emails.

```typescript
try {
  const fileId = 'file_id_here' // The ID of the file to grant access to.
  const cid = 'content_identifier_here' // The CID for acccessing the file.
  const accessInfo = {
    email: 'user@example.com', // The email of the user you want to grant access to (optional).
    password: 'access_password' // The password to access the file (optional).
  }

  const result = await deltaStorage.addFileAccess(fileId, cid, accessInfo)
  console.log(`Access granted to file ID ${fileId} with CID ${cid}`)
} catch (error) {
  console.error(error.message)
}
```

**Params**

- `fileId` (string): The ID of the file you want to grant access to.
- `cid` (string): The content identifier (CID) for accessing the file.
- `accessInfo` (object): An object containing access information, including an optional `email` and `password`.

**Required API Key Permission**

- `Upload File`

<a name="#readFileAccess"></a>

### `readFileAccess`

Use the readFileAccess method to retrieve access information for a specific file identified by a content identifier (CID).

```typescript
try {
  const fileId = 'file_id_here' // The ID of the file for which you want to retrieve access information.
  const cid = 'content_identifier_here' // The content identifier (CID) for accessing the file.

  const accessInfo = await deltaStorage.readFileAccess(fileId, cid)
  console.log('Access Information:', accessInfo)
} catch (error) {
  console.error(error.message)
}
```

**Params**

- `fileId` (string): The ID of the file for which you want to retrieve access information.
- `cid` (string): The content identifier (CID) for accessing the file.

**Required API Key Permission**

- `Read File`

<a name="#verifyFileAccessPassword"></a>

### `verifyFileAccessPassword`

Use the verifyFileAccessPassword method to verify the password for accessing a specific file identified by a content identifier (CID).

```typescript
try {
  const fileId = 'file_id_here' // The ID of the file for which you want to verify access.
  const cid = 'content_identifier_here' // The content identifier (CID) for accessing the file.
  const accessInfo = {
    password: 'access_password' // The password to verify.
  }

  const verificationResult = await deltaStorage.verifyFileAccessPassword(
    fileId,
    cid,
    accessInfo
  )
  if (verificationResult.accessGranted) {
    console.log('Access granted.')
  } else {
    console.log('Access denied.')
  }
} catch (error) {
  console.error(error.message)
}
```

**Params**

- `fileId` (string): The ID of the file for which you want to verify access.
- `cid` (string): The content identifier (CID) for accessing the file.
- `accessInfo` (object): An object containing the access `password` to verify.

**Required API Key Permission**

- `Upload File`

<a name="#updateFileAccess"></a>

### `updateFileAccess`

Use the updateFileAccess method to modify access settings for a specific file.

```typescript
try {
  const fileId = 'file_id_here' // The ID of the file for which you want to modify access settings.
  const cid = 'content_identifier_here' // The content identifier (CID) for accessing the file.
  const accessSettings = {
    secureSharing: 'PUBLIC' // The desired access setting: 'PUBLIC', 'PASSWORD', or 'RESTRICTED'.
  }

  const updateResult = await deltaStorage.updateFileAccess(
    fileId,
    cid,
    accessSettings
  )
  console.log('Access settings updated successfully.')
} catch (error) {
  console.error(error.message)
}
```

**Params**

- `fileId` (string): The ID of the file for which you want to verify access.
- `cid` (string): The content identifier (CID) for accessing the file.
- `accessSettings` (object): An object containing the desired access setting (secureSharing can be 'PUBLIC', 'PASSWORD', or 'RESTRICTED').

**Required API Key Permission**

- `Upload File`

<a name="#deleteFileAccess"></a>

### `deleteFileAccess`

Use the deleteFileAccess method to remove access to a specific file.

```typescript
try {
  const fileId = 'file_id_here' // The ID of the file for which you want to remove access.
  const cid = 'content_identifier_here' // The content identifier (CID) for accessing the file.
  const accessInfo = {
    email: 'user@example.com', // The email of the user to remove access from.
    deleteAll: true // (optional) Set to `true` to delete all access, or `false` to remove access for a specific user.
  }

  const deleteResult = await deltaStorage.deleteFileAccess(
    fileId,
    cid,
    accessInfo
  )
  console.log('Access removed successfully.')
} catch (error) {
  console.error(error.message)
}
```

**Params**

- `fileId` (string): The ID of the file for which you want to verify access.
- `cid` (string): The content identifier (CID) for accessing the file.
- `accessInfo` (object): An object containing the email of the user from whom you want to remove access and an optional deleteAll flag.

**Required API Key Permission**

- `Upload File`

## General

<a name="#move"></a>

### `move`

Use the move method to move files and directories to a new parent directory.

```typescript
try {
  const newParentId = 'new_parent_directory_id' // The ID of the new parent directory.
  const childrenIds = ['child_directory_id_1', 'child_directory_id_2'] // An array of child directory IDs to move.
  const childrenFileIds = ['child_file_id_1', 'child_file_id_2'] // (optional) An array of child file IDs to move.

  await deltaStorage.move(parentId, childrenIds, childrenFileIds)
  console.log('Files and directories moved successfully.')
} catch (error) {
  console.error(error.message)
}
```

**Params**

- `newParentId` (string): The ID of the new parent directory where the child directories/files will be moved.
- `childDirectoryIds` (string[]): An array of child directory IDs to move.
- `childFileIds` (string[], optional): An array of child file IDs to move (if applicable).

**Required API Key Permission**

- `Create Directory`
- `Delete Directory`

<a name="#getTotalSize"></a>

### `getTotalSize`

Use the getTotalSize method to retrieve the total storage size used by authenticated user.

```typescript
try {
  const storageSize = await deltaStorage.getTotalSize()
  console.log('Total storage size used:', storageSize, 'bytes')
} catch (error) {
  console.error(error.message)
}
```

**Required API Key Permission**

- `Read Directory`

<a name="#readStorage"></a>

### `readStorage`

Use the readStorage method to retrieve information about the storage capacity of authenticated user.

```typescript
try {
  const storageInfo = await deltaStorage.readStorage()
  console.log('Storage Capacity:', storageInfo.capacity, 'bytes')
  console.log('Storage Used:', storageInfo.used, 'bytes')
} catch (error) {
  console.error(error.message)
}
```

**Required API Key Permission**

- `Read Directory`

<a name="#readSettings"></a>

### `readSettings`

This method allows you to retrieve user-specific settings and account information, such as whether the user is in secured mode, the edge node they are using, and more.

```typescript
try {
  const userSettings = await deltaStorage.readSettings()
  console.log('User Settings:', userSettings)
} catch (error) {
  console.error(error.message)
}
```

<a name="#readEncryptionKey"></a>

### `readEncryptionKey`

This allows you to retrieve the encryption key used for secure data access in your Delta Storage account.

```typescript
try {
  const encryptionKey = await deltaStorage.readEncryptionKey()
  console.log('Encryption Key:', encryptionKey)
} catch (error) {
  console.error(error.message)
}
```

<a name="#verifyEncryptionKey"></a>

### `verifyEncryptionKey`

This allows you to verify an encryption key associated with your Delta Storage account. The result indicates whether the provided key is valid or not.

```typescript
try {
  const providedEncryptionKey = 'your_encryption_key_here' // The encryption key to verify.

  const verificationResult = await deltaStorage.verifyEncryptionKey(
    providedEncryptionKey
  )
  if (verificationResult.isValid) {
    console.log('Encryption Key is valid.')
  } else {
    console.log('Encryption Key is not valid.')
  }
} catch (error) {
  console.error(error.message)
}
```

<a name="#updateSettings"></a>

### `updateSettings`

This allows you to modify user-specific settings for your Delta Storage account, including the edge node, encryption key, and secured mode.

```typescript
try {
  const updatedSettings = {
    node: 'new_edge_node', // (optional) Specify a new edge node.
    encryptionKey: 'new_encryption_key', // (optional) Set a new encryption key.
    isSecureMode: true // (optional) Enable or disable secured mode (true or false).
  }

  const updateResult = await deltaStorage.updateSettings(updatedSettings)
  console.log('User settings updated successfully.')
} catch (error) {
  console.error(error.message)
}
```

**Params**

- `body` (object): An object containing the user-specific settings to update (node, encryptionKey, isSecureMode).

## Troubleshooting

Problem: Unauthorized error when performing an operation. <br/>
Solution: Ensure that your API key has the necessary permissions for the operation you're trying to perform.

## License

[MIT](https://github.com/delta-storage/sdk/blob/main/LICENSE)
