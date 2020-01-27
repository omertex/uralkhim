import React from "react";
import Aside from "../../shared_components/Aside/Aside";
import { Transition } from "react-transition-group"
import gql from "graphql-tag";
import { useQuery } from '@apollo/react-hooks';

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

const MyGoals = () => {
  const [aside, setAside] = React.useState({visible: false, idx: 0});

  const {loading: goalsLoading, error: goalsError, data: goalsData} = useQuery(GET_GOALS);
  const {loading: schemaLoading, error: schemaError, data: schemaData} = useQuery(GET_GOALS_SCHEMA);

  const getProperty = ({name, idx}) => {
    const properties = schemaData.entity_definitions[0].schema.properties;
    return properties[name].enumNames[idx];
  };

  console.log(goalsData, schemaData);

  const showAside = (idx) => {
    setAside({visible: true, idx});
  }
  const closeAside = () => {
    setAside({visible: false, idx: 0});
  }

  return (
    <div style={localStyles.contentContainer}>
      <Transition in={aside.visible} timeout={250}>
        {(state) => <Aside close={closeAside} state={state}>
          {!goalsLoading && !schemaLoading &&
          (
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
          )}
        </Aside>}
      </Transition>
      <div className="row h2 font-weight-bold m-4">Мои цели</div>
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
      >
        + Создать персональную цель
      </button>
    </div>
  );
}

export default MyGoals;
