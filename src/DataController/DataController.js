import React from 'react';
import { connect } from 'react-redux';
import { WebSocketLink } from 'apollo-link-ws';
import gql from 'graphql-tag';
import { useSubscription } from '@apollo/react-hooks';

const GOALS_SUBSCRIPTION = gql`
  subscription onGoalUpdate($id: String) {
    goals(where: { delegated_to_id: { _eq: $id } }) {
      id
      description
    }
  }
`;

const DataController = ({user, myGoals, subGoals}) => {
  let wsLink;
  const onGoalsUpdate = ({client, subscriptionData}) => {
  };
  React.useEffect(() => {
    if (user.isAuth) {
      wsLink = new WebSocketLink({
        uri: 'ws://scalaxi-graphql.herokuapp.com/graphql',
        options: {
          reconnect: true,
          connectionParams: {
              authToken: sessionStorage.getItem('accessToken')
          },
        }
      });
    }
  }, [user.isAuth]);

  // useSubscription(GOALS_SUBSCRIPTION, {
  //   onSubscriptionData: onGoalsUpdate,
  //   variables: { id: user.id.toString() }
  // });

  return null;
}

const mapStateToProps = state => {
  return {
    user: state.user,
    myGoals: state.myGoals,
    subGoals: state.subGoals
  };
};

export default connect(mapStateToProps)(DataController);
