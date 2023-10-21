export const baseUrl = ''

export enum OPERATION_SCOPE {
  ADMIN = 0b0000_0000,

  READ_FILE = 0b0000_0001,
  UPLOAD_FILE = 0b0000_0010,
  DELETE_FILE = 0b0000_0100,

  READ_DIRECTORY = 0b0001_0000,
  CREATE_DIRECTORY = 0b0010_0000,
  DELETE_DIRECTORY = 0b0100_0000
}

export const edgeNodes = [
  'https://edgeurid.estuary.tech',
  'https://storage.web3ph.dev',
  'https://delta.vulcaniclabs.com',
  'https://edgeurid.chat3.one'
]
