import React from 'react';
import { ApolloProvider } from 'react-apollo';
import {AuthContext} from '../AuthContext/AuthContext';
import ApolloClient from 'apollo-boost';
import { connect } from 'react-redux';

const ApolloContext = ({children, user}) => {
  const [client, setClient] = React.useState(null);
  React.useEffect(() => {
    if (user.isAuth) {
      const accessToken = sessionStorage.getItem('accessToken');
      setClient(new ApolloClient({
        uri: 'https://scalaxi-graphql.herokuapp.com/graphql',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      }))
    }
  }, [user.isAuth]);

  return (
    client ? (<ApolloProvider client={client}>
      {children}
    </ApolloProvider>) : null
  );
};

const mapStateToProps = state => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(ApolloContext);
