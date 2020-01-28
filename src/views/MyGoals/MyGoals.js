import React from "react";
import Aside from "../../shared_components/Aside/Aside";
import { Transition } from "react-transition-group"
import gql from "graphql-tag";
import { useQuery } from '@apollo/react-hooks';
import Form from "react-jsonschema-form";

const localStyles = {
  card: {
    height: 80
  },
  btnAddTarget: {
    height: 80,
    width: '100%'
  },
  contentContainer: {
    position: "relative",
  }
}

export const GET_GOALS = gql`
  {
    goals {
      id,
      category,
      description,
      issued_by,
      weight,
      state
    }
  }
`;

export const GET_GOALS_SCHEMA = gql`
 {
    entity_definitions(where: {name: {_eq: "goal"}}) {
      id,
      name,
      schema
    }
 }
`;

export const GET_GOALS_UI_SCHEMA = gql`
 {
    ui_schemas(where:
      {_and: {entity_state: {_eq: "creating"}, entity_definition_id: {_eq: 1}}})
        {
          schema
        }
 }
`;

const MyGoals = () => {
  const [aside, setAside] = React.useState({visible: false, idx: 0, isCreating: false});

  const {loading: goalsLoading, error: goalsError, data: goalsData} = useQuery(GET_GOALS);
  const {loading: schemaLoading, error: schemaError, data: schemaData} = useQuery(GET_GOALS_SCHEMA);
  const {loading: uiSchemaLoading, error: uiSchemaError, data: uiSchemaData} = useQuery(GET_GOALS_UI_SCHEMA);
  const loading = goalsLoading || schemaLoading || uiSchemaLoading;

  const getProperty = ({name, idx}) => {
    const properties = schemaData.entity_definitions[0].schema.properties;
    console.log(properties);
    return properties[name].enumNames[idx];
  };

  console.log(goalsData, schemaData, uiSchemaData, loading);

  const showAside = (idx) => {
    setAside({visible: true, idx, isCreating: false});
  }
  const closeAside = () => {
    setAside({visible: false, idx: 0, isCreating: false});
  }
  const showAsideCreating = () => {
    setAside({visible: true, idx: 0, isCreating: true});
  }
  const addGoal = (event) => {
    event.preventDefault();
  }

  const ViewGoal = () => (
    <>
      <div className="p-3">
        <div className="pt-4"><span className="badge badge-primary">{goalsData.goals[aside.idx].state}</span></div>
        <div className="mt-4 h3 font-weight-bold">{goalsData.goals[aside.idx].description}</div>
        <button type="button" className="btn btn-info">Делегировать</button>
        <button type="button" className="btn btn-info ml-2">Декомпозировать</button>
      </div>
      <div className="dropdown-divider"></div>
      <div className="p-3">
        <div className="font-weight-bold">Основная информация</div>
        <div className="text-secondary mt-4">категория</div>
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

  const NewGoal = () => (
    <Form className="p-5" schema={schemaData.entity_definitions[0].schema} uiSchema={uiSchemaData.ui_schemas[0].schema} />
    // <form onSubmit={addGoal}>
    //   <div className="p-3">
    //     <div className="pt-4"><span className="badge badge-primary">{goalsData.goals[aside.idx].state}</span></div>
    //     <div className="text-secondary mt-4">Название</div>
    //     <div className="h3 font-weight-bold"><input type="text"></input></div>
    //     <button type="button" className="btn btn-info">Делегировать</button>
    //     <button type="button" className="btn btn-info ml-2">Декомпозировать</button>
    //   </div>
    //   <div className="dropdown-divider"></div>
    //   <div className="p-3">
    //     <div className="font-weight-bold">Основная информация</div>
    //     <div className="text-secondary mt-4">категория</div>
    //     <div className="text-secondary mt-4">Тип цели</div>
    //     <div className="text-secondary mt-4">Описание цели</div>
    //     <div><input type="text"></input></div>
    //     <div className="text-secondary mt-4">Метод подсчета</div>
    //     <div className="text-secondary mt-4">Источник подтверждения</div>
    //     <div className="text-secondary mt-4">Вес цели</div>
    //     <div><input type="text"></input>%</div>
    //     <div className="text-secondary mt-4">Период</div>
    //   </div>
    //   <input className="p-2 m-3" type="submit" value="Добавить" />
    // </form>
  );

  return (
    <div style={localStyles.contentContainer}>
      <Transition in={aside.visible} timeout={250}>
        {(state) => <Aside close={closeAside} state={state}>
          {!goalsLoading && !schemaLoading &&
          (aside.isCreating ? <NewGoal /> : <ViewGoal/>)}
        </Aside>}
      </Transition>
      <div className="row h2 font-weight-bold p-4">Мои цели</div>
      <div className="row h6">
        <div className="col-2">Статус</div>
        <div className="col-3">Название</div>
        <div className="col-2">Категория</div>
        <div className="col-2">Согласующие</div>
        <div className="col-2">Дочерние цели</div>
        <div className="col-1">Вес цели</div>
      </div>
      {!goalsLoading && !schemaLoading && goalsData.goals.map((goal, idx) => (
        <div className="card flex-row align-items-center h6" style={localStyles.card} onClick={() => showAside(idx)} key={goal.id}>
          <div className="col-2"><span className="badge badge-primary">{goal.state}</span></div>
          <div className="col-3">{goal.description}</div>
          <div className="col-2">{getProperty({name: "category", idx: goal.category})}</div>
          <div className="col-2">{goal.issued_by}</div>
          <div className="col-2">0</div>
          <div className="col-1 font-weight-bold">{goal.weight}%</div>
        </div>
      ))}
      <button className="card flex-row justify-content-center align-items-center h4" style={localStyles.btnAddTarget}
              onClick={showAsideCreating}
      >
        + Создать персональную цель
      </button>
    </div>
  );
}

export default MyGoals;
