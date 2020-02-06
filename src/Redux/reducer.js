import initialState from './initialState';

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_AUTH': {
      return {
        ...state,
        isAuth: action.isAuth,
        user: { id: action.userId, role: action.role }
      };
    }
    case 'SET_CLIENT': {
      return { ...state, client: action.client };
    }
    case 'LOGOUT': {
      return { user: { id: null, isAuth: false, role: null } };
    }
    case 'SET_USERS': {
      return { ...state, users: action.users };
    }
    case 'SET_MY_GOALS': {
      return { ...state, myGoals: action.myGoals };
    }
    case 'SET_GOALS_SCHEMA': {
      return { ...state, goalsSchema: action.goalsSchema };
    }
    case 'SET_GOALS_UI_SCHEMA': {
      return { ...state, goalsUISchema: action.goalsUISchema };
    }
    case 'SET_SUBORDINATES': {
      return { ...state, subordinates: action.subordinates };
    }
    case 'SET_MUTATIONS': {
      return { ...state, mutations: action.mutations };
    }
    case 'SET_DATA_LOADED': {
      return { ...state, dataLoaded: action.dataLoaded };
    }
    default:
      return state;
  }
};

export default reducer;
