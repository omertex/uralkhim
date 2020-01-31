import React from 'react';
import Aside from '../../shared_components/Aside/Aside';
import { Transition } from 'react-transition-group';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import Form from 'react-jsonschema-form';
import * as Styled from './MyGoals.styled';
import Badge from '../../shared_components/Badge/Badge';
import Dialog from '../../shared_components/Dialog/Dialog';
import { BtnSecondary } from '../../shared_components/Buttons/Buttons.styled';
import { connect } from 'react-redux';
import {
  BtnPrimaryLarge,
  BtnSecondaryLarge
} from '../../shared_components/Buttons/Buttons.styled';

export const GET_GOALS = gql`
  query getGoals($id: String) {
    goals(where: {delegated_to_id: {_eq: $id}}) {
      id
      category
      description
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
          entity_state: { _eq: "creating" }
          entity_definition_id: { _eq: 1 }
        }
      }
    ) {
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

const MyGoals = ({ user }) => {
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

  const {
    loading: goalsLoading,
    error: goalsError,
    data: goalsData
  } = useQuery(GET_GOALS, { variables: { id: user.id.toString() } });
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

  const getProperty = ({ name, idx }) => {
    const properties = schemaData.entity_definitions[0].schema.properties;
    return properties[name].enumNames[idx];
  };

  console.log(goalsData, schemaData, uiSchemaData, user);

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
    console.log('onDelegateSubmit formData', formData);
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
    console.log('formData', formData);
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

  const ViewGoal = () => (
    <>
      <div className="p-3">
        <div className="pt-4">
          <Badge variant={goalsData.goals[aside.idx].state} />
        </div>
        <div className="mt-4 h3 font-weight-bold">
          {goalsData.goals[aside.idx].description}
        </div>
        <BtnSecondary onClick={onDelegate}>Делегировать</BtnSecondary>
      </div>
      <div className="dropdown-divider"></div>
      <div className="p-3">
        <div className="font-weight-bold">Основная информация</div>
        <div className="text-secondary mt-4">категория</div>
        <div>{goalsData.goals[aside.idx].category}</div>
        <div className="text-secondary mt-4">Тип цели</div>
        <div className="text-secondary mt-4">Описание цели</div>
        <div>{goalsData.goals[aside.idx].description}</div>
        <div className="text-secondary mt-4">Метод подсчета</div>
        <div className="text-secondary mt-4">Источник подтверждения</div>
        <div className="text-secondary mt-4">Вес цели</div>
        <div>{goalsData.goals[aside.idx].weight}%</div>
        <div className="text-secondary mt-4">Период</div>
      </div>
    </>
  );

  const NewGoalForm = () => (
    <Styled.DialogContent>
      <Styled.DialogHeader>Создание цели</Styled.DialogHeader>
      <Styled.DialogForm>
        <Form
          schema={schemaData.entity_definitions[0].schema}
          uiSchema={uiSchemaData.ui_schemas[0].schema}
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
              <BtnSecondaryLarge>Отмена</BtnSecondaryLarge>
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
      <div className="row h2 font-weight-bold p-4">Мои цели</div>
      <Styled.Header>
        <Styled.TextGray className="col-2">Статус</Styled.TextGray>
        <Styled.TextGray className="col-3">Название</Styled.TextGray>
        <Styled.TextGray className="col-2">Категория</Styled.TextGray>
        <Styled.TextGray className="col-2">Согласующие</Styled.TextGray>
        <Styled.TextGray className="col-2">Дочерние цели</Styled.TextGray>
        <Styled.TextGray className="col-1">Вес цели</Styled.TextGray>
      </Styled.Header>
      {!isLoading &&
        isData &&
        goalsData.goals.map((goal, idx) => (
          <Styled.Card onClick={() => showAside(idx)} key={goal.id}>
            <div className="col-2">
              <Badge variant={goal.state} />
            </div>
            <div className="col-3">{goal.description}</div>
            <div className="col-2">
              {getProperty({ name: 'category', idx: goal.category })}
            </div>
            <div className="col-2">{goal.issued_by}</div>
            <div className="col-2">0</div>
            <div className="col-1 font-weight-bold">{goal.weight}%</div>
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
