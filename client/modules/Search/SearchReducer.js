import {ADD_SEARCH_OPTIONS, ADD_SEARCH_PARAMETERS, ADD_SEARCH_RESULTS} from './SearchActions'

const initialState = {
  options: {},
  parameters: {brand: '', model: '', firstRegistration: '', country: ''},
  results: {},
  showResults: false,
}

const SearchReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_SEARCH_OPTIONS:
      return {
        ...state,
        options: action.options,
      }

    case ADD_SEARCH_PARAMETERS:
      return {
        ...state,
        parameters: action.parameters,
      }

    case ADD_SEARCH_RESULTS:
      return {
        ...state,
        results: action.results,
        showResults: true,
      }

    default:
      return state
  }
}

// Selectors
export const getSearchOptions = state => state.search.options
export const getSearchResults = state => state.search.results
export const getShowResults = state => state.search.showResults
export const getSearchParameters = state => state.search.parameters

export default SearchReducer
