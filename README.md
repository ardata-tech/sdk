# Delta Storage SDK

Official SDK for [Delta Storage App](https://app.delta.storage/)

![deltaui](https://github.com/delta-storage/sdk/assets/71435340/557ee2c4-c0ca-4d25-8792-8e9b6002cffc)

## Introduction

This [Documentation](https://delta-storage.readme.io/reference/quick-start) provides detailed information on how to use delta storage developer tools to interact with directories and files in your application.

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

- Drives Management
  - [createDrive](https://delta-storage.readme.io/reference/createdirectory)
  - [listAllDrives](https://delta-storage.readme.io/reference/createdrive)
  - [readDriveSize](https://delta-storage.readme.io/reference/readdrivesize)
  - [viewDriveContents](https://delta-storage.readme.io/reference/viewdrivecontents)
  - [downloadDriveAsZip](https://delta-storage.readme.io/reference/downloaddriveaszip)
  - [renameDrive](https://delta-storage.readme.io/reference/renamedrive)
  - [moveToDrive](https://delta-storage.readme.io/reference/movetodrive)
  - [deleteDrive](https://delta-storage.readme.io/reference/deletedrive)
- Directory Management
  - [createDirectory](https://delta-storage.readme.io/reference/createdirectory)
  - [readDirectory](https://delta-storage.readme.io/reference/readdirectory)
  - [readDirectorySize](https://delta-storage.readme.io/reference/readdirectorysize)
  - [readDirectoryBySegment](https://delta-storage.readme.io/reference/readdirectorybysegment)
  - [getDirectoryAsZip](https://delta-storage.readme.io/reference/getdirectoryaszip)
  - [downloadDirectoryAsZip](https://delta-storage.readme.io/reference/downloaddirectoryaszip)
  - [move](https://delta-storage.readme.io/reference/move)
  - [renameDirectory](https://delta-storage.readme.io/reference/renamedirectory)
  - [deleteDirectory](https://delta-storage.readme.io/reference/deletedirectory)
- File Management
  - [uploadFile](https://delta-storage.readme.io/reference/uploadfile)
  - [uploadMultipleFiles](https://delta-storage.readme.io/reference/uploadfiles)
  - [readFile](https://delta-storage.readme.io/reference/readfile)
  - [renameFile](https://delta-storage.readme.io/reference/renamefile)
  - [updateFile](https://delta-storage.readme.io/reference/updatefile)
  - [deleteFile](https://delta-storage.readme.io/reference/deletefile)
  - [getFileReplications](https://delta-storage.readme.io/reference/getfilereplications)
  - [getIPFSFileMetadata](https://delta-storage.readme.io/reference/getipfsfilemetadata)
  - [getSiaFileMetadata](https://delta-storage.readme.io/reference/getsiafilemetadata)
  - [getDataURI](https://delta-storage.readme.io/reference/getdatauri)
  - [addFileAccess](https://delta-storage.readme.io/reference/addfileaccess)
  - [readFileAccess](https://delta-storage.readme.io/reference/readfileaccess)
  - [verifyFileAccessPassword](https://delta-storage.readme.io/reference/verifyfileaccesspassword)
  - [updateFileAccess](https://delta-storage.readme.io/reference/updatefileaccess)
  - [deleteFileAccess](https://delta-storage.readme.io/reference/deletefileaccess)
- General
  - [getTotalSize](https://delta-storage.readme.io/reference/gettotalsize) (Storage Used)
  - [readStorage](https://delta-storage.readme.io/reference/readstorage) (Storage Capacity)
  - [readSettings](https://delta-storage.readme.io/reference/readsettings)
  - [updateSettings](https://delta-storage.readme.io/reference/updatesettings)

## Troubleshooting

Problem: Unauthorized error when performing an operation. <br/>
Solution: Ensure that your API key has the necessary permissions for the operation you're trying to perform.

## License

[MIT](https://github.com/delta-storage/sdk/blob/main/LICENSE)
