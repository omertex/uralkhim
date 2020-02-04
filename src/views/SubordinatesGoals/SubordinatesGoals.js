import React from 'react';
import Aside from '../../shared_components/Aside/Aside';
import { Transition } from 'react-transition-group';
import gql from 'graphql-tag';
import {useQuery, useMutation, useSubscription} from '@apollo/react-hooks';
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
  subscription getSubs($subs: [String!]) {
    goals(where: { delegated_to_id: { _in: $subs } }) {
      id
      category
      description
      delegated_to_id
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

const ADD_GOAL = gql`
  mutation InsertGoal(
    $countingMethod: String
    $date_from: date
    $date_to: date
    $description: String
    $delegate_to_id: String
    $type: smallint
    $weight: smallint
  ) {
    insert_goals(
      objects: {
        verification_method: $countingMethod
        date_from: $date_from
        date_to: $date_to
        description: $description
        delegated_to_id: $delegate_to_id
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

export const GET_GOALS_UI_SCHEMA = gql`
  {
    ui_schemas(
      where: {
        _and: {
          entity_state: { _in: ["creating", "edit", "creating_sub"] }
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
  console.log('subordinatesData', subordinatesData);
  const subsArray = subordinatesData.subordinates.map(item => item.id);
  console.log('subsArray', subsArray);
  const {
    loading: goalsLoading,
    error: goalsError,
    data: goalsData
  } = useSubscription(GET_GOALS, { variables: { subs: subsArray } });
  console.log('*****goalsData', goalsData);

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
    schemaData &&
    schemaData.entity_definitions.length &&
    uiSchemaData &&
    uiSchemaData.ui_schemas.length;

  let goalsPerSub;
  if (isData) {
    goalsPerSub = goalsData.goals.reduce((acc, goal) => {
      if (goal.delegated_to_id in acc) {
        acc[goal.delegated_to_id].push(goal);
      } else {
        acc[goal.delegated_to_id] = [goal];
      }
      return acc;
    }, {});
    console.log('goalsPerSub', goalsPerSub);
  }

  const isLoading = goalsLoading || schemaLoading || uiSchemaLoading;

  const [updateGoal, { updateGoalData }] = useMutation(UPDATE_GOAL);
  const [addGoal, { addGoalData }] = useMutation(ADD_GOAL);

  const getProperty = ({ name, idx }) => {
    const properties = schemaData.entity_definitions[0].schema.properties;
    return properties[name].enumNames[idx - 1];
  };
  const showDialogCreate = () => {
    setIsDialogOpen(true);
  };
  const showAside = id => {
    setAside({ visible: true, id, isCreating: false });
  };
  const closeAside = () => {
    setAside({ visible: false, id: 0, isCreating: false });
  };
  const onUpdateGoal = ({ formData }, event) => {
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
  const getSubName = (id) => subordinatesData.subordinates.find(item => item.id === id).fullName;
  const onSubmit = ({ formData }, event) => {
    closeDialog();
    event.preventDefault();
    addGoal({
      variables: {
        countingMethod: formData.countingMethod,
        type: formData.type,
        date_from: formData.period.from,
        date_to: formData.period.to,
        description: formData.description,
        delegate_to_id: formData.delegate_to,
        weight: +formData.weight
      }
    });
  };
  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const NewGoalForm = () => (
    <Styled.DialogContent>
      <Styled.DialogHeader>Создание цели</Styled.DialogHeader>
      <div className="dropdown-divider" />
      <Styled.DialogForm>
        <Form
          schema={schemaData.entity_definitions[0].schema}
          uiSchema={
            uiSchemaData.ui_schemas.find(
              item => item.entity_state === 'creating_sub'
            ).schema
          }
          idPrefix={'new_'}
          onSubmit={onSubmit}
        >
          <Styled.DialogBtns>
            <Styled.DialogCancel
              type="button"
              onClick={() => {
                setIsDialogOpen(false);
              }}
            >
              Отмена
            </Styled.DialogCancel>
            <Styled.DialogSubmit type="submit">Сохранить</Styled.DialogSubmit>
          </Styled.DialogBtns>
        </Form>
      </Styled.DialogForm>
    </Styled.DialogContent>
  );

  const ViewGoal = () => {
    const selectedGoal = goalsData.goals.find(goal => goal.id === aside.id);
    console.log('selectedGoal', selectedGoal);
    return (
      <>
        <Styled.ViewGoalContainer>
          <div className="mt-3">
            <Badge variant={selectedGoal.state} />
          </div>
          <div className="mt-3 mb-3 h2 font-weight-bold">
            {selectedGoal.description}
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
              category: selectedGoal.category,
              period: {
                from: selectedGoal.date_from,
                to: selectedGoal.date_to
              },
              description: selectedGoal.description,
              weight: selectedGoal.weight
            }}
            idPrefix={'view_'}
            onSubmit={onUpdateGoal}
          >
            {<div /> /*<BtnPrimary type="submit">Сохранить</BtnPrimary>*/}
          </Form>
        </Styled.ViewGoalContainer>
      </>
    );
  };

  return (
    <Styled.Content>
      <Dialog isOpen={isDialogOpen} close={closeDialog}>
        {!isLoading && isData && <NewGoalForm />}
      </Dialog>
      <Dialog
        isOpen={isDelegateDialogOpen}
        close={() => {
          setIsDelegateDialogOpen(false);
        }}
      ></Dialog>
      <Transition in={aside.visible} timeout={250}>
        {state => (
          <Aside close={closeAside} state={state}>
            {!isLoading && isData && aside.visible && <ViewGoal />}
          </Aside>
        )}
      </Transition>
      <div className="h2 font-weight-bold">Цели подчиненных</div>
      {!isLoading && isData && goalsPerSub
        ? Object.keys(goalsPerSub).map(fullName => (
            <div key={fullName}>
              <Styled.FullName>{getSubName(fullName)}</Styled.FullName>
              <Styled.Header>
                <span className="col-2">Статус</span>
                <span className="col-3">Название</span>
                <span className="col-3">Категория</span>
                <span className="col-3">Сотрудник</span>
                <span className="col-1 text-right">Вес цели</span>
              </Styled.Header>
              {goalsPerSub[fullName].map(goal => (
                <Styled.Card onClick={() => showAside(goal.id)} key={goal.id}>
                  <span className="col-2">
                    <Badge variant={goal.state} />
                  </span>
                  <span className="col-3">{goal.description}</span>
                  <Styled.TextBlueGray className="col-3">
                    {getProperty({ name: 'category', idx: goal.category })}
                  </Styled.TextBlueGray>
                  <Styled.TextBlueGray className="col-3">
                    {getSubName(goal.delegated_to_id)}
                  </Styled.TextBlueGray>
                  <span className="col-1 font-weight-bold text-right">
                    {goal.weight}%
                  </span>
                </Styled.Card>
              ))}
            </div>
          ))
        : null}
      <Styled.ButtonAdd onClick={showDialogCreate}>
        + Создать цель подчиненному
      </Styled.ButtonAdd>
    </Styled.Content>
  );
};

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps)(SubordinatesGoals);
