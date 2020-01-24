import React from 'react';

const MyTargets = React.lazy(() => import('./views/MyTargets/MyTargets'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/my-targets', exact: true, name: 'Test Form', component: MyTargets },
];

export default routes;
