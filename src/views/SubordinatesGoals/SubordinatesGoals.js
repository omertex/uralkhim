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

// const GET_GOALS_UI_SCHEMA = gql`
//   {
//     ui_schemas(
//       where: {
//         _and: {
//           entity_state: { _eq: "creating" }
//           entity_definition_id: { _eq: 1 }
//         }
//       }
//     ) {
//       schema
//     }
//   }
// `;

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

const GET_SUBORDINATES = gql`
  query getSubordinates($id: Int) {
    subordinates(id: $id) {
      id
      fullName
    }
  }
`;

const UPDATE_GOAL = gql`
  mutation updateGoal(
    $goalId: Int
    $date_from: date
    $date_to: date
    $description: String
    $type: smallint
    $weight: smallint
  ) {
    update_goals(
      where: { id: { _eq: $goalId } }
      _set: {
        date_from: $date_from
        date_to: $date_to
        description: $description
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

  const [updateGoal, { updateGoalData }] = useMutation(UPDATE_GOAL);

  const getProperty = ({ name, idx }) => {
    const properties = schemaData.entity_definitions[0].schema.properties;
    return properties[name].enumNames[idx - 1];
  };

  const showAside = idx => {
    setAside({ visible: true, idx, isCreating: false });
  };
  const closeAside = () => {
    setAside({ visible: false, idx: 0, isCreating: false });
  };
  const onUpdateGoal = ({ formData }, event) => {
    console.log('formData', formData);
    event.preventDefault();
    updateGoal({
      variables: {
        goalId: goalsData.goals[aside.idx].id,
        date_from: formData.period.from,
        date_to: formData.period.to,
        description: formData.description,
        type: formData.type,
        weight: formData.weight
      }
    });
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
        <Form
          schema={schemaData.entity_definitions[0].schema}
          uiSchema={
            uiSchemaData.ui_schemas.find(item => item.entity_state === 'edit')
              .schema
          }
          formData={{
            category: goalsData.goals[aside.idx].category,
            period: {
              from: goalsData.goals[aside.idx].date_from,
              to: goalsData.goals[aside.idx].date_to
            },
            description: goalsData.goals[aside.idx].description,
            weight: goalsData.goals[aside.idx].weight
          }}
          idPrefix={'view_'}
          onSubmit={onUpdateGoal}
        >
          {<div />/*<BtnPrimary type="submit">Сохранить</BtnPrimary>*/}
        </Form>
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
