# delta.storage SDK

Official SDK for [delta.storage](https://delta.storage/)

## Overview

The delta.storage SDK provides asbtraction for interacting with the hot [delta.storage API](https://docs.delta.storage/).

## Installation

```
npm install --save @delta-storage/sdk
```

## Setup

Acquire your `API_KEY` from your [hot.delta.storage](https://hot.delta.storage) account. After installing, you can use the SDK as follows:

```typescript
import DeltaStorageSDK from '@delta-storage/sdk'

const sdk = new DeltaStorageSDK({
  apiKey: 'YOUR API KEY'
})
```

## Usage

Once you've set up your instance, using the delta.storage SDK is easy.

- General

  - [getTotalSize](#getTotalSize)

- Directory Management

  - [readDirectory](#readDirectory)
  - [readDirectoryBySegment](#readDirectoryBySegment)
  - [createDirectory](#createDirectory)
  - [renameDirectory](#renameDirectory)
  - [move](#move)
  - [deleteDirectory](#deleteDirectory)

- File Management

  - [readFile](#readFile)
  - [uploadFile](#uploadFile)
  - [deleteFile](#deleteFile)

<br />

<a name="#getTotalSize"></a>
### `getTotalSize`

Returns the total size of files uploaded to hot.delta.storage.

```typescript
const totalSize: bigint = await sdk.getTotalSize()
```

<a name="#readDirectory"></a>
### `readDirectory`

Returns the `Files` and `Directories` contained in the given directory.

<a name="#readDirectoryBySegment"></a>
### `readDirectoryBySegment`

Returns the `Files` and `Directories` contained in the given directory by segment.

<a name="#createDirectory"></a>
### `createDirectory`

Create a new directory.

<a name="#renameDirectory"></a>
### `renameDirectory`

Rename a directory.

<a name="#move"></a>
### `move`

Move all `Files` and `Directories` to the given `Directory` ID.

<a name="#deleteDirectory"></a>
### `deleteDirectory`

Delete a directory and its contents.

<a name="#readFile"></a>
### `readFile`

Read the file and its metadata.

<a name="#uploadFile"></a>
### `uploadFile`

Upload a new file.

<a name="#deleteFile"></a>
### `deleteFile`

Delete a file.
