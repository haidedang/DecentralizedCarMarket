import axios from 'axios'
import Config from '../../server/config'

export const API_URL = typeof window === 'undefined' || process.env.NODE_ENV === 'test' ? process.env.BASE_URL || `http://localhost:${process.env.PORT || Config.port}/api` : '/api'

export function callApi(endpoint) {
  return axios
    .get(`${API_URL}/${endpoint}`)
    .then(res => {
      return res
    })
    .catch(err => {
      return err
    })
}
