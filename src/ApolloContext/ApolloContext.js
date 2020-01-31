import React from 'react';
import { ApolloProvider } from 'react-apollo';
import {AuthContext} from '../AuthContext/AuthContext';
import ApolloClient from 'apollo-boost';

const ApolloContext = ({children}) => {
  const [client, setClient] = React.useState(null);
  const authContext = React.useContext(AuthContext);
  React.useEffect(() => {
    if (authContext.isAuth) {
      const accessToken = sessionStorage.getItem('accessToken');
      setClient(new ApolloClient({
        uri: 'https://scalaxi-graphql.herokuapp.com/graphql',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      }))
    }
  }, [authContext.isAuth]);

  return (
    client && (<ApolloProvider client={client}>
      {children}
    </ApolloProvider>)
  );
};

export default ApolloContext;
