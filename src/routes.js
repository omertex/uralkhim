import React from 'react';

const MyGoals = React.lazy(() => import('./views/MyGoals/MyGoals'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/my-goals', exact: true, name: 'Test Form', component: MyGoals },
];

export default routes;
