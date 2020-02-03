import initialState from './initialState';

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER': {
      return {user: {id: action.userId, isAuth: action.isAuth, role: action.role}}
    }
    case 'LOGOUT': {
      return {user: {id: null, isAuth: false, role: null}}
    }
    default:
      return state;
  }
};

export default reducer;
