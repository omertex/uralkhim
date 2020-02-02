import React from 'react';
import Aside from '../../shared_components/Aside/Aside';
import { Transition } from 'react-transition-group';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import Form from 'react-jsonschema-form';
import * as Styled from './SubrordinatesGoals.styled';
import Badge from '../../shared_components/Badge/Badge';
import Dialog from '../../shared_components/Dialog/Dialog';
import {
  BtnPrimary,
  BtnSecondary
} from '../../shared_components/Buttons/Buttons.styled';
import { connect } from 'react-redux';
import {
  BtnPrimaryLarge,
  BtnSecondaryLarge
} from '../../shared_components/Buttons/Buttons.styled';

const GET_GOALS = gql`
  query getSubs($subs: [String!]) {
    goals(where: { delegated_to_id: { _in: $subs } }) {
      id
      category
      description
      delegated_to {
        id
        fullName
      }
      weight
      state
    }
  }
`;

const GET_GOALS_SCHEMA = gql`
  {
    entity_definitions(where: { name: { _eq: "goal" } }) {
      id
      name
      schema
    }
  }
`;

const GET_GOALS_UI_SCHEMA = gql`
  {
    ui_schemas(
      where: {
        _and: {
          entity_state: { _eq: "creating" }
          entity_definition_id: { _eq: 1 }
        }
      }
    ) {
      schema
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

const SubordinatesGoals = ({ user }) => {
  const [aside, setAside] = React.useState({
    visible: false,
    idx: 0,
    isCreating: false
  });
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isDelegateDialogOpen, setIsDelegateDialogOpen] = React.useState(false);

  const {
    loading: subordinatesLoading,
    error: subordinatesError,
    data: subordinatesData
  } = useQuery(GET_SUBORDINATES, { variables: { id: user.id } });
  console.log(
    'subordinatesData',
    subordinatesLoading,
    subordinatesError,
    subordinatesData
  );

  const subsArray = subordinatesData.subordinates.map(item => item.id);
  console.log('subsArray', subsArray);
  const {
    loading: goalsLoading,
    error: goalsError,
    data: goalsData
  } = useQuery(GET_GOALS, { variables: { subs: subsArray } });
  console.log('Goals!!!!', goalsLoading, goalsError, goalsData);

  const {
    loading: schemaLoading,
    error: schemaError,
    data: schemaData
  } = useQuery(GET_GOALS_SCHEMA);
  const {
    loading: uiSchemaLoading,
    error: uiSchemaError,
    data: uiSchemaData
  } = useQuery(GET_GOALS_UI_SCHEMA);

  const isData =
    goalsData &&
    goalsData.goals.length &&
    schemaData &&
    schemaData.entity_definitions.length &&
    uiSchemaData &&
    uiSchemaData.ui_schemas.length;
  const isLoading = goalsLoading || schemaLoading || uiSchemaLoading;

  const getProperty = ({ name, idx }) => {
    const properties = schemaData.entity_definitions[0].schema.properties;
    return properties[name].enumNames[idx - 1];
  };

  console.log(goalsData, schemaData, uiSchemaData, user);

  const showAside = idx => {
    setAside({ visible: true, idx, isCreating: false });
  };
  const closeAside = () => {
    setAside({ visible: false, idx: 0, isCreating: false });
  };

  const ViewGoal = () => (
    <>
      <Styled.ViewGoalContainer>
        <div className="mt-3">
          <Badge variant={goalsData.goals[aside.idx].state} />
        </div>
        <div className="mt-3 mb-3 h2 font-weight-bold">
          {goalsData.goals[aside.idx].description}
        </div>
      </Styled.ViewGoalContainer>
      <div className="dropdown-divider" />
      <Styled.ViewGoalContainer>
        <div className="font-weight-bold mb-2">Основная информация</div>
        <div className="mb-4">
          <Styled.TextBlueGray>Категория</Styled.TextBlueGray>
          <div>
            {getProperty({
              name: 'category',
              idx: goalsData.goals[aside.idx].category
            })}
          </div>
        </div>
        <div className="mb-4">
          <Styled.TextBlueGray>Тип цели</Styled.TextBlueGray>
        </div>
        <div className="mb-4">
          <Styled.TextBlueGray>Описание цели</Styled.TextBlueGray>
          <div>{goalsData.goals[aside.idx].description}</div>
        </div>
        <div className="mb-4">
          <Styled.TextBlueGray>Метод подсчета</Styled.TextBlueGray>
        </div>
        <div className="mb-4">
          <Styled.TextBlueGray>Источник подтверждения</Styled.TextBlueGray>
        </div>
        <div className="mb-4">
          <Styled.TextBlueGray>Вес цели</Styled.TextBlueGray>
          <div>{goalsData.goals[aside.idx].weight}%</div>
        </div>
        <div className="mb-4">
          <Styled.TextBlueGray>Период</Styled.TextBlueGray>
        </div>
      </Styled.ViewGoalContainer>
    </>
  );

  return (
    <Styled.Content>
      <Dialog
        isOpen={isDelegateDialogOpen}
        close={() => {
          setIsDelegateDialogOpen(false);
        }}
      ></Dialog>
      <Transition in={aside.visible} timeout={250}>
        {state => (
          <Aside close={closeAside} state={state}>
            {!isLoading && isData && <ViewGoal />}
          </Aside>
        )}
      </Transition>
      <div className="h2 font-weight-bold">Мои цели</div>
      <Styled.Header>
        <span className="col-2">Статус</span>
        <span className="col-3">Название</span>
        <span className="col-3">Категория</span>
        <span className="col-3">Сотрудник</span>
        <span className="col-1 text-right">Вес цели</span>
      </Styled.Header>
      {!isLoading &&
        isData &&
        goalsData.goals.map((goal, idx) => (
          <Styled.Card onClick={() => showAside(idx)} key={goal.id}>
            <span className="col-2">
              <Badge variant={goal.state} />
            </span>
            <span className="col-3">{goal.description}</span>
            <Styled.TextBlueGray className="col-3">
              {getProperty({ name: 'category', idx: goal.category })}
            </Styled.TextBlueGray>
            <Styled.TextBlueGray className="col-3">
              {goal.delegated_to.fullName}
            </Styled.TextBlueGray>
            <span className="col-1 font-weight-bold text-right">
              {goal.weight}%
            </span>
          </Styled.Card>
        ))}
    </Styled.Content>
  );
};

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps)(SubordinatesGoals);
