import React from 'react';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-client';
import { connect } from 'react-redux';
import { WebSocketLink } from 'apollo-link-ws';
import { HttpLink } from 'apollo-link-http';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { SubscriptionClient } from 'subscriptions-transport-ws';

const ApolloContext = ({ children, user }) => {
  const [client, setClient] = React.useState(null);
  React.useEffect(() => {
    if (user.isAuth) {
      const accessToken = sessionStorage.getItem('accessToken');
      console.log(accessToken);

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

      setClient(client);
      // setClient(new ApolloClient({
      //   uri: 'https://scalaxi-graphql.herokuapp.com/graphql',
      //   headers: {
      //     Authorization: `Bearer ${accessToken}`,
      //   }
      // }))
    }
  }, [user.isAuth]);

  return client ? (
    <ApolloProvider client={client}>{children}</ApolloProvider>
  ) : null;
};

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps)(ApolloContext);
