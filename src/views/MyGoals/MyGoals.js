import React from 'react';
import Aside from '../../shared_components/Aside/Aside';
import { Transition } from 'react-transition-group';
import gql from 'graphql-tag';
import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import Form from 'react-jsonschema-form';
import * as Styled from './MyGoals.styled';
import Badge from '../../shared_components/Badge/Badge';
import Dialog from '../../shared_components/Dialog/Dialog';
import { connect } from 'react-redux';
import {
  BtnSecondary,
  BtnPrimary,
  BtnPrimaryLarge,
  BtnSecondaryLarge
} from '../../shared_components/Buttons/Buttons.styled';
import { WebSocketLink } from 'apollo-link-ws';

// export const GET_GOALS = gql`
//   query getGoals($id: String) {
//     goals(where: { delegated_to_id: { _eq: $id } }) {
//       id
//       category
//       date_from
//       date_to
//       description
//       goals_aggregate {
//         aggregate {
//           count
//         }
//       }
//       weight
//       state
//     }
//   }
// `;

const GET_GOALS = gql`
  query getGoals($id: String) {
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

const ADD_GOAL = gql`
  mutation InsertGoal(
    $date_from: date
    $date_to: date
    $description: String
    $type: smallint
    $weight: smallint
  ) {
    insert_goals(
      objects: {
        verification_method: "Яндекс метрика"
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

const GET_SUBORDINATES = gql`
  query getSubordinates($id: Int) {
    subordinates(id: $id) {
      id
      fullName
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

const MyGoals = ({ user }) => {
  const [aside, setAside] = React.useState({
    visible: false,
    idx: 0,
    isCreating: false
  });
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isDelegateDialogOpen, setIsDelegateDialogOpen] = React.useState(false);

  React.useEffect(() => {
    if (user.role !== 'manager') {
      document.querySelector('.subs-link').style.display = 'none';
    }
  }, []);

  const wsLink = new WebSocketLink({
    uri: 'wss://scalaxi-graphql.herokuapp.com/graphql',
    options: {
      reconnect: true,
      connectionParams: {
        authToken: sessionStorage.getItem('accessToken')
      }
    }
  });

  const {
    loading: subordinatesLoading,
    error: subordinatesError,
    data: subordinatesData
  } = useQuery(GET_SUBORDINATES, { variables: { id: user.id } });

  // const {
  //   loading: goalsLoading,
  //   error: goalsError,
  //   data: goalsData
  // } = useQuery(GET_GOALS, { variables: { id: user.id.toString() } });

  const {
    loading: goalsLoading,
    error: goalsError,
    data: goalsData
  } = useSubscription(GET_GOALS, { variables: { id: user.id.toString() } });

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

  const [addGoal, { addGoalData }] = useMutation(ADD_GOAL);
  const [delegateGoal, { delegateGoalData }] = useMutation(DELEGATE_GOAL);
  const [takeGoal, { takeGoalData }] = useMutation(TAKE_GOAL);
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
  const showDialogCreate = () => {
    setIsDialogOpen(true);
  };
  const closeDialog = () => {
    setIsDialogOpen(false);
  };
  const onDelegate = () => {
    setIsDelegateDialogOpen(true);
  };
  const onDelegateSubmit = ({ formData }, event) => {
    setIsDelegateDialogOpen(false);
    event.preventDefault();
    setIsDelegateDialogOpen(false);
    delegateGoal({
      variables: {
        data: {
          delegated_to_id: formData.subordinateEnum.toString(),
          weight: formData.weight
        },
        goalId: goalsData.goals[aside.idx].id
      }
    });
  };
  const onSubmit = ({ formData }, event) => {
    closeDialog();
    event.preventDefault();
    addGoal({
      variables: {
        type: formData.type,
        date_from: formData.period.from,
        date_to: formData.period.to,
        description: formData.description,
        weight: +formData.weight
      }
    }).then(res => console.log('res', res));
  };
  const onTakeGoal = () => {
    takeGoal({
      variables: {
        goalId: goalsData.goals[aside.idx].id
      }
    });
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

  const ViewGoal = () => (
    <>
      <Styled.ViewGoalContainer>
        <div className="mt-3">
          <Badge variant={goalsData.goals[aside.idx].state} />
        </div>
        <div className="mt-3 mb-3 h2 font-weight-bold">
          {goalsData.goals[aside.idx].description}
        </div>
        {user.role === 'manager'
          ? goalsData.goals[aside.idx].state === 'draft' &&
            goalsData.goals[aside.idx].category === 1 && (
              <>
                <BtnSecondary onClick={onDelegate}>Делегировать</BtnSecondary>
                <BtnPrimary className="ml-3" onClick={onTakeGoal}>
                  Взять в работу
                </BtnPrimary>
              </>
            )
          : goalsData.goals[aside.idx].state === 'draft' && (
              <BtnPrimary onClick={onTakeGoal}>Взять в работу</BtnPrimary>
            )}
      </Styled.ViewGoalContainer>
      <div className="dropdown-divider"></div>
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
          <BtnPrimary type="submit">Сохранить</BtnPrimary>
        </Form>
      </Styled.ViewGoalContainer>
    </>
  );

  const NewGoalForm = () => (
    <Styled.DialogContent>
      <Styled.DialogHeader>Создание цели</Styled.DialogHeader>
      <div className="dropdown-divider" />
      <Styled.DialogForm>
        <Form
          schema={schemaData.entity_definitions[0].schema}
          uiSchema={
            uiSchemaData.ui_schemas.find(
              item => item.entity_state === 'creating'
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

  const DelegateForm = () => {
    let enumArray = [];
    let enumNamesArray = [];
    subordinatesData.subordinates.forEach(item => {
      enumArray.push(+item.id);
      enumNamesArray.push(item.fullName);
    });

    const schema = {
      type: 'object',
      properties: {
        subordinateEnum: {
          type: 'number',
          title: 'Сотрудник',
          enum: enumArray,
          enumNames: enumNamesArray
        },
        weight: {
          type: 'number',
          title: 'Вес цели'
        }
      }
    };

    return (
      <Styled.DialogContent>
        <Styled.DialogHeader>Делегирование цели</Styled.DialogHeader>
        <Styled.DialogForm>
          <Form
            schema={schema}
            onSubmit={onDelegateSubmit}
            idPrefix={'delegate_'}
          >
            <Styled.DialogBtns>
              <BtnSecondaryLarge
                type="button"
                onClick={() => setIsDelegateDialogOpen(false)}
              >
                Отмена
              </BtnSecondaryLarge>
              <BtnPrimaryLarge type="submit">Делегировать</BtnPrimaryLarge>
            </Styled.DialogBtns>
          </Form>
        </Styled.DialogForm>
      </Styled.DialogContent>
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
      >
        {!subordinatesLoading && subordinatesData && <DelegateForm />}
      </Dialog>
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
        <span className="col-3">Дочерние цели</span>
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
              {goal.goals_aggregate.aggregate.count}
            </Styled.TextBlueGray>
            <span className="col-1 font-weight-bold text-right">
              {goal.weight}%
            </span>
          </Styled.Card>
        ))}
      <Styled.ButtonAdd onClick={showDialogCreate}>
        + Создать персональную цель
      </Styled.ButtonAdd>
    </Styled.Content>
  );
};

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps)(MyGoals);
