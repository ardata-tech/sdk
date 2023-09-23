# Delta Storage SDK

Official SDK for [Delta Storage](https://delta.storage/)

## Introduction

The Delta Storage SDK is a JavaScript library that provides asbtraction for interacting with the [Delta Storage API](https://docs.delta.storage/). This SDK allows you to perform various operations such as reading files, uploading files, managing directories, and more.

## Installation

You can install the Delta Storage SDK using your preferred package manager:
```
npm install --save @delta-storage/sdk
```
```
yarn add --save @delta-storage/sdk
```

## Getting Started

To start using the Delta Storage SDK, you need to acquire your API_KEY from your [hot.delta.storage](https://hot.delta.storage/). Once you have your API_KEY, Here's how you can get started:

```typescript
import DeltaStorageSDK from '@delta-storage/sdk'

const deltaStorage = new DeltaStorageSDK({
  apiKey: 'YOUR API KEY'
})
```

## Usage

Once you've set up your instance, using the Delta Storage SDK is easy as follows:
- File Management
  - [readFile](#readFile)
  - [uploadFile](#uploadFile)
  - [renameFile](#renameFile)
  - [deleteFile](#deleteFile)
- Directory Management
  - [readDirectory](#readDirectory)
  - [readDirectoryBySegment](#readDirectoryBySegment)
  - [createDirectory](#createDirectory)
  - [renameDirectory](#renameDirectory)
  - [deleteDirectory](#deleteDirectory)
 - General
    - [move](#move)
    - [getTotalSize](#getTotalSize)

<a name="#readFile"></a>
### `readFile`

You can use the readFile method to retrieve the contents of a file by its ID.

```
try {
  const fileId = 'file_id_here'; //The id of the file you want to read.
  const response = await deltaStorage.readFile(fileId);
  console.log(response.data); // The file contents
} catch (error) {
  console.error(error.message);
}
```

**Params**
- fileId (string, optional): The ID of the file you want to retrieve. If not provided, it retrieves all your files.

**Required API Key Permission**
- Read File

<a name="#uploadFile"></a>
### `uploadFile`

This method allows you to upload a file to Delta Storage.

```
try {
  const name = 'example.txt';
  const file = /* Your file input or Blob */;
  const collectionName = 'collection_name';
  const directoryId = 'directory_id';
  
  const response = await deltaStorage.uploadFile(name, file, collectionName, directoryId);
  console.log(response.data); // The uploaded file details
} catch (error) {
  console.error(error.message);
}
```

**Params**
- name (string): The name of the file.
- file (form data): The file to upload.
- collectionName (string): The name of the collection.
- directoryId (string): The ID of the directory where the file will be uploaded.

**Required API Key Permission**
- Upload File

<a name="#renameFile"></a>
### `renameFile`

Rename an existing file by providing its ID and the new name.

```
try {
  const fileId = 'file_id_here'; // Replace with the file ID you want to rename
  const newName = 'new_file_name.txt'; // Replace with the new file name
  const response = await deltaStorage.renameFile(fileId, newName);
  console.log('File renamed successfully');
} catch (error) {
  console.error(error.message);
}
```

**Params**
- fileId (string): The ID of the file you want to rename.
- newName (string): The new name for the file.

**Required API Key Permissions**
- Upload File
- Delete File

<a name="#deleteFile"></a>
### `deleteFile`

Delete a file by its ID using the deleteFile method.

```
try {
  const fileId = 'file_id_here';
  const response = await deltaStorage.deleteFile(fileId);
  console.log('File deleted successfully');
} catch (error) {
  console.error(error.message);
}
```

**Params**
- fileId (string): The ID of the file to delete.

**Required API Key Permission**
- Delete File

<a name="#readDirectory"></a>
### `readDirectory`

Retrieve the contents of a directory by its ID. This method is useful when you want to list the directories and files within a specific directory.

```
try {
  const directoryId = 'directory_id_here'; // Replace with the desired directory ID
  const response = await deltaStorage.readDirectory(directoryId);
  const { directories, files } = response.data;

  console.log('Directories:');
  directories.forEach((directory) => {
    console.log(directory.name);
  });

  console.log('Files:');
  files.forEach((file) => {
    console.log(file.name);
  });
} catch (error) {
  console.error(error.message);
}
```

**Params**
- directoryId (string, optional): The ID of the directory you want to retrieve. If not provided, it retrieves the root directory.

**Required API Key Permission**
- Read Directory

<a name="#readDirectoryBySegment"></a>
### `readDirectoryBySegment`

Retrieve the contents of a directory by specifying a path using segments. This method is useful when you want to navigate through directories based on a custom path.

```
try {
  const segments = 'folder1/subfolder1/subfolder2'; // Replace with your desired path
  const response = await deltaStorage.readDirectoryBySegment(segments);
  const { directories, files } = response.data;

  console.log('Directories:');
  directories.forEach((directory) => {
    console.log(directory.name);
  });

  console.log('Files:');
  files.forEach((file) => {
    console.log(file.name);
  });
} catch (error) {
  console.error(error.message);
}
```

**Params**
- segments (string): A custom path to the directory, where segments are separated by slashes ('/'). Specify the path to the directory you want to retrieve.

**Required API Key Permission**
- Read Directory

<a name="#createDirectory"></a>
### `createDirectory`

Create a new directory with a specified name and, optionally, within a parent directory.

```
try {
  const directoryName = 'new_directory'; // Replace with the desired directory name
  const parentDirectoryId = 'parent_directory_id'; // Optional: Provide the parent directory ID if creating a nested directory
  
  const response = await deltaStorage.createDirectory(directoryName, parentDirectoryId);
  console.log(response.data); // The created directory details
} catch (error) {
  console.error(error.message);
}
```

**Params**
- directoryName (string): The name of the new directory.
- parentDirectoryId (string, optional): The ID of the parent directory where the new directory will be created. If not provided, the directory will be created at the root level.

**Required API Key Permission**
- Create Directory

<a name="#renameDirectory"></a>
### `renameDirectory`

Rename an existing directory by providing its ID and the new name.

```
try {
  const directoryId = 'directory_id_here'; // Replace with the directory ID you want to rename
  const newName = 'new_directory_name'; // Replace with the new directory name
  const response = await deltaStorage.renameDirectory(directoryId, newName);
  console.log('Directory renamed successfully');
} catch (error) {
  console.error(error.message);
}
```

**Params**
- directoryId (string): The ID of the directory you want to rename.
- newName (string): The new name for the directory.

**Required API Key Permission**
- Create Directory
- Delete Directory

<a name="#deleteDirectory"></a>
### `deleteDirectory`

Delete a directory and its contents.

```
try {
  const directoryId = 'directory_id_here'; // Replace with the directory ID you want to delete
  const response = await deltaStorage.deleteDirectory(directoryId);
  console.log('Directory deleted successfully');
} catch (error) {
  console.error(error.message);
}
```

**Params**
- directoryId (string): The ID of the directory to delete.

**Required API Key Permission**
- Delete Directory

<a name="#move"></a>
### `move`

Move one or more child directories or files to a new parent directory.

```
try {
  const newParentId = 'new_parent_directory_id'; // Replace with the ID of the new parent directory
  const childDirectoryIds = ['child_dir_id1', 'child_dir_id2']; // Replace with the IDs of child directories to move
  const childFileIds = ['child_file_id1', 'child_file_id2']; // Optional: Replace with the IDs of child files to move
  
  const response = await deltaStorage.move(newParentId, childDirectoryIds, childFileIds);
  console.log('Items moved successfully');
} catch (error) {
  console.error(error.message);
}
```

**Params**
- newParentId (string): The ID of the new parent directory where the child directories/files will be moved.
- childDirectoryIds (string[]): An array of child directory IDs to move.
- childFileIds (string[], optional): An array of child file IDs to move (if applicable).

**Required API Key Permission**
- Create Directory
- Delete Directory

<a name="#getTotalSize"></a>
### `getTotalSize`

Returns the total size of files uploaded to [hot.delta.storage](https://hot.delta.storage/).

```
try {
  const totalSize = await deltaStorage.getTotalSize();
  console.log(`Total size: ${totalSize} bytes`);
} catch (error) {
  console.error(error.message);
}
```

## Troubleshooting
Problem: Unauthorized error when performing an operation.
Solution: Ensure that your API key has the necessary permissions for the operation you're trying to perform.

## License
MIT
