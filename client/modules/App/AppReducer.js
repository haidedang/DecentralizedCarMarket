import {LOGIN, LOGOUT} from './AppActions'

const initialState = {
  token: false
}

const AppReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        token: action.token
      }
    case LOGOUT:
      return {
        ...state,
        token: false
      }
    default:
      return state
  }
}

/* Selectors */
export const getShowAddPost = state => state.app.showAddPost
export const getToken = state => state.app.token

export default AppReducer
