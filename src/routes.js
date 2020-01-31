import React from 'react';

const MyGoals = React.lazy(() => import('./views/MyGoals/MyGoals'));
const SubordinatesGoals = React.lazy(() => import('./views/SubordinatesGoals/SubordinatesGoals'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/sub-goals', exact: true, name: 'Цели подчиненных', component: SubordinatesGoals },
  { path: '/my-goals', exact: true, name: 'Мои цели', component: MyGoals },
];

export default routes;
