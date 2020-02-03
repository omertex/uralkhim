import initialState from './initialState';

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER': {
      return {user: {id: action.userId, isAuth: action.isAuth, role: action.role}}
    }
    default:
      return state;
  }
};

export default reducer;
