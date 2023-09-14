import { OPERATION_SCOPE } from './constants'
const axios = require('axios').default

export interface DeltaStorageConfig {
  apiKey: string
  host?: string
}

const isCommandAllowed = (scope: number, flag: number) => {
  if (scope === 0) return true
  return (scope & flag) === flag
}

const verifyAuthorizedCommand = (
  scope: number,
  flag: number,
  message = 'Operation is not allowed.'
) => {
  if (!isCommandAllowed(scope, flag)) {
    throw Error(message)
  }
}

class DeltaStorageSDK {
  public readonly apiKey: string
  public readonly scope: number
  public readonly host: string

  constructor(config: DeltaStorageConfig) {
    const [_apiKeyId, scope, _userId, _hash] = config.apiKey.split('.')
    this.apiKey = config.apiKey
    this.scope = parseInt(scope)
    this.host = config.host ?? ''
    this.host = this.host.slice(-1) === '/' ? this.host.slice(0, -1) : this.host
  }

  async readFile() {
    verifyAuthorizedCommand(
      this.scope,
      OPERATION_SCOPE.READ_FILE,
      'READ_FILE is not allowed.'
    )
  }

  async uploadFile() {
    verifyAuthorizedCommand(
      this.scope,
      OPERATION_SCOPE.UPLOAD_FILE,
      'UPLOAD_FILE is not allowed.'
    )
  }

  async deleteFile() {
    verifyAuthorizedCommand(
      this.scope,
      OPERATION_SCOPE.DELETE_FILE,
      'DELETE_FILE is not allowed.'
    )
  }

  async readDirectory(id?: string) {
    verifyAuthorizedCommand(
      this.scope,
      OPERATION_SCOPE.READ_DIRECTORY,
      'READ_DIRECTORY is not allowed.'
    )

    return axios.get(`${this.host}/api/directory/${id ?? ''}`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`
      }
    })
  }

  async getDirectoryById(id?: string) {
    verifyAuthorizedCommand(
      this.scope,
      OPERATION_SCOPE.READ_DIRECTORY,
      'READ_DIRECTORY is not allowed.'
    )

    return axios.get(`${this.host}/api/directory/get/${id ?? ''}`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`
      }
    })
  }

  async createDirectory(name: string, parentDirectoryId?: string) {
    verifyAuthorizedCommand(
      this.scope,
      OPERATION_SCOPE.CREATE_DIRECTORY,
      'CREATE_DIRECTORY is not allowed.'
    )

    return axios.post(
      `${this.host}/api/directory/create`,
      { name, parentDirectoryId },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`
        }
      }
    )
  }

  async renameDirectory(id: string, name: string) {
    verifyAuthorizedCommand(
      this.scope,
      OPERATION_SCOPE.CREATE_DIRECTORY | OPERATION_SCOPE.DELETE_DIRECTORY,
      'UPDATE_DIRECTORY is not allowed.'
    )

    return axios.put(
      `${this.host}/api/directory/${id}`,
      { name },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`
        }
      }
    )
  }

  async move(parentId: string, childrenIds: string[]) {
    verifyAuthorizedCommand(
      this.scope,
      OPERATION_SCOPE.CREATE_DIRECTORY | OPERATION_SCOPE.DELETE_DIRECTORY,
      'UPDATE_DIRECTORY is not allowed.'
    )

    return axios.put(
      `${this.host}/api/directory/${parentId}`,
      { move: childrenIds },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`
        }
      }
    )
  }

  async deleteDirectory(id: string) {
    verifyAuthorizedCommand(
      this.scope,
      OPERATION_SCOPE.DELETE_DIRECTORY,
      'DELETE_DIRECTORY is not allowed.'
    )

    return axios.delete(`${this.host}/api/directory/${id}`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`
      }
    })
  }
}

export default DeltaStorageSDK
