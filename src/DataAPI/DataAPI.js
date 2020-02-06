import React from 'react';
import { connect } from 'react-redux';
import gql from 'graphql-tag';
import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks';

const SUBSCRIPTION_GOALS = gql`
  subscription getGoals($id: String) {
    goals(where: { delegated_to_id: { _eq: $id } }) {
      id
      category
      date_from
      date_to
      description
      goals_aggregate {
        aggregate {
          count
        }
      }
      verification_method
      verifier_id
      weight
      state
    }
  }
`;

export const GET_GOALS_SCHEMA = gql`
  {
    entity_definitions(where: { name: { _eq: "goal" } }) {
      id
      name
      schema
    }
  }
`;

export const GET_GOALS_UI_SCHEMA = gql`
  {
    ui_schemas(
      where: {
        _and: {
          entity_state: { _in: ["creating", "edit"] }
          entity_definition_id: { _eq: 1 }
        }
      }
    ) {
      entity_state
      schema
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

const GET_SUBORDINATES = gql`
  query getSubordinates($id: Int) {
    subordinates(id: $id) {
      id
      fullName
    }
  }
`;

// Mutations

const ADD_GOAL = gql`
  mutation InsertGoal(
    $countingMethod: String
    $date_from: date
    $date_to: date
    $description: String
    $verifier_id: String
    $delegated_to_id: String
    $type: smallint
    $weight: smallint
  ) {
    insert_goals(
      objects: {
        verification_method: $countingMethod
        date_from: $date_from
        date_to: $date_to
        description: $description
        delegated_to_id: $delegated_to_id
        verifier_id: $verifier_id
        type: $type
        weight: $weight
      }
    ) {
      returning {
        id
      }
    }
  }
`;

const TAKE_GOAL = gql`
  mutation doGoalAction($goalId: Int) {
    insert_goal_actions(objects: { goal_id: $goalId, name: "in_work" }) {
      returning {
        id
      }
    }
  }
`;

const UPDATE_GOAL = gql`
  mutation updateGoal(
    $countingMethod: String
    $goalId: Int
    $date_from: date
    $date_to: date
    $description: String
    $verifier_id: String
    $type: smallint
    $weight: smallint
  ) {
    update_goals(
      where: { id: { _eq: $goalId } }
      _set: {
        verification_method: $countingMethod
        date_from: $date_from
        date_to: $date_to
        description: $description
        verifier_id: $verifier_id
        type: $type
        weight: $weight
      }
    ) {
      returning {
        id
      }
    }
  }
`;

const DELETE_GOAL = gql`
  mutation deleteGoal($goalId: Int) {
    delete_goals(where: { id: { _eq: $goalId } }) {
      returning {
        id
      }
    }
  }
`;

const DELEGATE_GOAL = gql`
  mutation doGoalAction($data: jsonb, $goalId: Int) {
    insert_goal_actions(
      objects: { goal_id: $goalId, name: "delegate", data: $data }
    ) {
      returning {
        id
      }
    }
  }
`;

const DataAPI = ({ client, children, dispatch, user }) => {
  const {
    loading: usersLoading,
    error: usersError,
    data: usersData
  } = useQuery(GET_USERS, { client });

  React.useEffect(() => {
    if (!usersLoading && usersData) {
      dispatch({ type: 'SET_USERS', users: usersData.users });
    }
  }, [usersLoading, usersData]);

  const { loading: goalsLoading, data: goalsData } = useSubscription(
    SUBSCRIPTION_GOALS,
    {
      client,
      variables: { id: user.id.toString() }
    }
  );

  React.useEffect(() => {
    if (!goalsLoading && goalsData) {
      dispatch({ type: 'SET_MY_GOALS', myGoals: goalsData.goals });
    }
  }, [usersLoading, goalsData]);

  const {
    loading: schemaLoading,
    error: schemaError,
    data: schemaData
  } = useQuery(GET_GOALS_SCHEMA, { client });

  React.useEffect(() => {
    if (!schemaLoading && schemaData) {
      dispatch({
        type: 'SET_GOALS_SCHEMA',
        goalsSchema: schemaData.entity_definitions[0].schema
      });
    }
  }, [schemaLoading, schemaData]);

  const {
    loading: uiSchemaLoading,
    error: uiSchemaError,
    data: uiSchemaData
  } = useQuery(GET_GOALS_UI_SCHEMA, { client });

  React.useEffect(() => {
    if (!uiSchemaLoading && uiSchemaData) {
      dispatch({
        type: 'SET_GOALS_UI_SCHEMA',
        goalsUISchema: uiSchemaData.ui_schemas
      });
    }
  }, [uiSchemaLoading, uiSchemaData]);

  React.useEffect(() => {
    if (goalsData && schemaData && uiSchemaData) {
      dispatch({
        type: 'SET_DATA_LOADED',
        dataLoaded: true
      });
    }
  }, [goalsData, schemaData, uiSchemaData]);

  const {
    loading: subordinatesLoading,
    error: subordinatesError,
    data: subordinatesData
  } = useQuery(GET_SUBORDINATES, { client, variables: { id: user.id } });

  React.useEffect(() => {
    if (!subordinatesLoading && subordinatesData) {
      dispatch({
        type: 'SET_SUBORDINATES',
        subordinates: subordinatesData.subordinates
      });
    }
  }, [subordinatesLoading, subordinatesData]);

  const [addGoal, { addGoalData }] = useMutation(ADD_GOAL, { client });
  const [updateGoal, { updateGoalData }] = useMutation(UPDATE_GOAL, { client });
  const [takeGoal, { takeGoalData }] = useMutation(TAKE_GOAL, { client });
  const [deleteGoal, { deleteData }] = useMutation(DELETE_GOAL, { client });
  const [delegateGoal, { delegateGoalData }] = useMutation(DELEGATE_GOAL, {
    client
  });
  React.useEffect(() => {
      dispatch({
        type: 'SET_MUTATIONS',
        mutations: { addGoal, deleteGoal, delegateGoal, takeGoal, updateGoal }
      });
  }, [addGoal, deleteGoal, delegateGoal, takeGoal, updateGoal]);

  return goalsData ? children : null;
};

const mapStateToProps = state => {
  return {
    client: state.client,
    isAuth: state.isAuth,
    user: state.user,
    myGoals: state.myGoals,
    subGoals: state.subGoals
  };
};

export default connect(mapStateToProps)(DataAPI);
