import initialState from './initialState';

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER': {
      console.log('set', action);
      return {user: {id: action.userId, isAuth: action.isAuth, role: action.role}}
    }
    case 'LOGOUT': {
      return {user: {id: null, isAuth: false, role: null}}
    }
    case 'ADD_USERS': {
      return {users: action.users}
    }
    default:
      return state;
  }
};

export default reducer;
