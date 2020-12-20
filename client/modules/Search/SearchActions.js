import {callApi} from '../../util/apiCaller'
import EthereumClient from '../../EthereumClient'
import dummyInventory from '../../../server/util/dummyData/inventory.json'
import {mapChainSales, mapSalesObjects} from '../../util/chainAttributeMapper'
import {filterSalesByBrand, filterSalesByModel} from '../../util/searchOptionFilter'

export const ADD_SEARCH_OPTIONS = 'ADD_SEARCH_OPTIONS'
export const ADD_SEARCH_PARAMETERS = 'ADD_SEARCH_PARAMETERS'
export const ADD_SEARCH_RESULTS = 'ADD_SEARCH_RESULTS'

export function fetchSearchOptions() {
  return dispatch => {
    return callApi('inventory').then(res => {
      dispatch(addSearchOptions(res.data))
    })
  }
}

function addSearchOptions(options) {
  return {
    type: ADD_SEARCH_OPTIONS,
    options,
  }
}

export function addSearchParameters(parameters) {
  return dispatch => {
    dispatch({
      type: ADD_SEARCH_PARAMETERS,
      parameters,
    })
  }
}

export function fetchSearchResults(brand, model) {
  return dispatch => {
    return EthereumClient.getInstance().then(client => {
      client
        .getSalesNotOfUser()
        .then(results => {
          // map array results to our backend data structure
          let mappedResults = mapChainSales(results, dummyInventory)
          mappedResults = filterSalesByBrand(mappedResults, brand)
          mappedResults = filterSalesByModel(mappedResults, model)

          // transform array results to objects
          const sales = mapSalesObjects(mappedResults)
          dispatch(addSearchResults(sales))
        })
        .catch(error => {
          console.log(error)
        })
    })
  }
}

function addSearchResults(results) {
  return {
    type: ADD_SEARCH_RESULTS,
    results,
  }
}
