import http from 'src/utils/http'

const COMMAND_URL = '/command-api/v1/configs'
const COMMAND_SLOT_URL = '/command-api/v1/slots'

const configApi = {
  generatePoint: () => http.post<any>(`${COMMAND_URL}/generate-point`),
  generatePointGroup: () => http.post<any>(`${COMMAND_URL}/generate-point-for-group`),
  generateSlot: () => http.post<any>(`${COMMAND_SLOT_URL}/generate`)
}

export default configApi
