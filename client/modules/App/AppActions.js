// Constants
export const TOGGLE_ADD_POST = 'TOGGLE_ADD_POST'
export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'

// Actions
export function toggleAddPost() {
  return {
    type: TOGGLE_ADD_POST,
  }
}

export function login(token) {
  sessionStorage.setItem('token', token)
  console.log('dispatch successfull')
  return dispatch => {
    dispatch({
      type: LOGIN,
      token: sessionStorage.token,
    })
  }
}

export function logout() {
  return dispatch => {
    dispatch({
      type: LOGOUT,
    })
    sessionStorage.removeItem('token')
    console.log('LOGOUT successfully')
  }
}
