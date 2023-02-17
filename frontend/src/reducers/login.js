import {LOGIN} from '../constants/ActionTypes'

const initState = {};

export default (state = initState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state
      };
    default:
      return state
  }
}
