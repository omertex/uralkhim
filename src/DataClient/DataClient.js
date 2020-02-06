import React from 'react';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { connect } from 'react-redux';

const DataClient = ({ children, dispatch, user }) => {
  const [client, setClient] = React.useState(null);

  React.useEffect(() => {
    if (user) {
      const accessToken = sessionStorage.getItem('accessToken');

      const httpsLink = new HttpLink({
        uri: 'https://scalaxi-graphql.herokuapp.com/graphql', // use https for secure endpoint
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      const wssLink = new WebSocketLink(
        new SubscriptionClient(
          'wss://scalaxi-hasura.herokuapp.com/v1/graphql',
          {
            reconnect: true,
            connectionParams: {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            }
          }
        )
      );

      const link = split(
        // split based on operation type
        ({ query }) => {
          const { kind, operation } = getMainDefinition(query);
          return kind === 'OperationDefinition' && operation === 'subscription';
        },
        wssLink,
        httpsLink
      );

      const client = new ApolloClient({
        link,
        cache: new InMemoryCache()
      });

      dispatch({ type: 'SET_CLIENT', client });
      setClient(client);
    }
  }, [user]);

  return client ? children : null;
};

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps)(DataClient);
