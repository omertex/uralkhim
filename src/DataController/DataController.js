import React from 'react';
import { connect } from 'react-redux';
import { WebSocketLink } from 'apollo-link-ws';
import gql from 'graphql-tag';
import { useQuery, useSubscription } from '@apollo/react-hooks';

const GOALS_SUBSCRIPTION = gql`
  subscription onGoalUpdate($id: String) {
    goals(where: { delegated_to_id: { _eq: $id } }) {
      id
      description
    }
  }
`;

const GET_USERS = gql`
  {
    users {
      id
      fullName
    }
  }
`;

const DataController = ({ dispatch, user, myGoals, subGoals }) => {
  const {
    loading: usersLoading,
    error: usersError,
    data: usersData
  } = useQuery(GET_USERS);

  console.log('DataController', user);

  React.useEffect(() => {
    if (!usersLoading && usersData) {
      dispatch({ type: 'ADD_USERS', users: usersData.users });
    }
  }, [usersLoading, usersData]);

  return null;
};

const mapStateToProps = state => {
  return {
    user: state.user,
    myGoals: state.myGoals,
    subGoals: state.subGoals
  };
};

export default connect(mapStateToProps)(DataController);
