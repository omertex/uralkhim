import initialState from './initialState';

const reducer = (state = initialState, action) => {
  console.log('reducer', state, action);
  switch (action.type) {
    case 'SET_USER': {
      return {user: {id: action.userId, role: action.role}}
    }
    default:
      return state;
  }
};

export default reducer;
