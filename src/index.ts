import { OPERATION_SCOPE } from './constants'

export interface DeltaStorageConfig {
  apiKey: string
  scope: number
}

const commandAllowed = (scope: number, flag: number) => {
  if (scope === 0) return true
  return (scope & flag) === flag
}

const verifyAuthorizedCommand = (
  scope: number,
  flag: number,
  message = 'Operation is not allowed.'
) => {
  if (!commandAllowed(scope, flag)) {
    throw Error(message)
  }
}

class DeltaStorageSDK {
  public readonly scope: number

  constructor(config: DeltaStorageConfig) {
    // apiKey has 4 parts
    const [_apiKeyId, scope, _userId, _hash] = config.apiKey.split('.')
    this.scope = parseInt(scope)
  }

  readFile() {
    verifyAuthorizedCommand(
      this.scope,
      OPERATION_SCOPE.READ_FILE,
      'READ_FILE operation is not allowed.'
    )
  }

  uploadFile() {
    verifyAuthorizedCommand(
      this.scope,
      OPERATION_SCOPE.UPLOAD_FILE,
      'UPLOAD_FILE operation is not allowed.'
    )
  }

  deleteFile() {
    verifyAuthorizedCommand(
      this.scope,
      OPERATION_SCOPE.DELETE_FILE,
      'DELETE_FILE operation is not allowed.'
    )
  }

  readDirectory() {
    verifyAuthorizedCommand(
      this.scope,
      OPERATION_SCOPE.READ_DIRECTORY,
      'READ_DIRECTORY operation is not allowed.'
    )
  }

  createDirectory() {
    verifyAuthorizedCommand(
      this.scope,
      OPERATION_SCOPE.CREATE_DIRECTORY,
      'CREATE_DIRECTORY operation is not allowed.'
    )
  }

  deleteDirectory() {
    verifyAuthorizedCommand(
      this.scope,
      OPERATION_SCOPE.DELETE_DIRECTORY,
      'DELETE_DIRECTORY operation is not allowed.'
    )
  }
}

export default DeltaStorageSDK
