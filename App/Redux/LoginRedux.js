import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  loginRequest: ['username', 'password'],
  loginSuccess: ['username'],
  loginUpdate: ['userobj'],
  loginFailure: ['error'],
  logout: null,
  setCurrentPack: ['name']
})

export const LoginTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  username: null,
  userobj: null,
  error: null,
  fetching: false,
  currentPack: null
})

/* ------------- Reducers ------------- */

// we're attempting to login
export const request = (state) => state.merge({ fetching: true })

// we've successfully logged in
export const success = (state, { username }) =>
state.merge({ fetching: false, error: null, username })

export const update = (state, { userobj }) => 
  state.merge({ fetching: false, error: null, userobj })
  

// we've had a problem logging in
export const failure = (state, { error }) =>
state.merge({ fetching: false, error })

// we've logged out
export const logout = (state) => INITIAL_STATE

//set pack
export const setpack = (state, { name }) =>
state.merge({ currentPack: name })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOGIN_REQUEST]: request,
  [Types.LOGIN_UPDATE]: update,
  [Types.LOGIN_SUCCESS]: success,
  [Types.LOGIN_FAILURE]: failure,
  [Types.LOGOUT]: logout,
  [Types.SET_CURRENT_PACK]: setpack
})

/* ------------- Selectors ------------- */

// Is the current user logged in?
export const isLoggedIn = (loginState) => loginState.username !== null
