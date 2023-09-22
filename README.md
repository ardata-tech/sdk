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

  - [getTotalSize](#getTotalSize-anchor)

- Directory Management

  - [readDirectory](#readDirectory-anchor)
  - [readDirectoryBySegment](#readDirectoryBySegment-anchor)
  - [createDirectory](#createDirectory-anchor)
  - [renameDirectory](#renameDirectory-anchor)
  - [move](#move-anchor)
  - [deleteDirectory](#deleteDirectory-anchor)

- File Management

  - [readFile](#readFile-anchor)
  - [uploadFile](#uploadFile-anchor)
  - [deleteFile](#deleteFile-anchor)

<br />

<a name="#getTotalSize-anchor"></a>
### `getTotalSize`

Returns the total size of files uploaded to hot.delta.storage.

```typescript
const totalSize: bigint = await sdk.getTotalSize()
```

<a name="#readDirectory-anchor"></a>
### `readDirectory`

Returns the `Files` and `Directories` contained in the given directory.

<a name="#readDirectoryBySegment-anchor"></a>
### `readDirectoryBySegment`

Returns the `Files` and `Directories` contained in the given directory by segment.

<a name="#createDirectory-anchor"></a>
### `createDirectory`

Create a new directory.

<a name="#renameDirectory-anchor"></a>
### `renameDirectory`

Rename a directory.

<a name="#move-anchor"></a>
### `move`

Move all `Files` and `Directories` to the given `Directory` ID.

<a name="#deleteDirectory-anchor"></a>
### `deleteDirectory`

Delete a directory and its contents.

<a name="#readFile-anchor"></a>
### `readFile`

Read the file and its metadata.

<a name="#uploadFile-anchor"></a>
### `uploadFile`

Upload a new file.

<a name="#deleteFile-anchor"></a>
### `deleteFile`

Delete a file.
