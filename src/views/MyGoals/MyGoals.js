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

const MyGoals = () => {
  const [aside, setAside] = React.useState({visible: false, idx: 0});
  const showAside = (idx) => {
    setAside({visible: true, idx});
  }
  const closeAside = () => {
    setAside({visible: false, idx: 0});
  }

  const {loading, error, data} = useQuery(GET_GOALS);
  console.log('loading', loading);
  console.log('data', data);

  return (
    <div style={localStyles.contentContainer}>
      <Transition in={aside.visible} timeout={250}>
        {(state) => <Aside close={closeAside} state={state}>
          {aside.visible && !loading &&
          (
            <>
            <div className="p-3">
              <div className="pt-4"><span className="badge badge-primary">В работе</span></div>
              <div className="mt-4 h3 font-weight-bold">Снизить ПОС на 20%</div>
              <button type="button" className="btn btn-info">Делегировать</button>
              <button type="button" className="btn btn-info ml-2">Декомпозировать</button>
            </div>
            <div className="dropdown-divider"></div>
              <div className="p-3">
              <div className="font-weight-bold">Основная информация</div>
              <div>категория</div>
              <div>категория</div>
              <div>Описание цели</div>
              <div>{data.goals[aside.idx].description}</div>
              <div>Метод подсчета</div>
              <div>Источник подтверждения</div>
              <div>Вес цели</div>
              <div>{data.goals[aside.idx].weight}%</div>
              <div>Период</div>
            </div>
            </>
          )}
        </Aside>}
      </Transition>
      <div className="row h2 font-weight-bold mb-4">Мои цели</div>
      <div className="row h6">
        <div className="col-2">Статус</div>
        <div className="col-3">Название</div>
        <div className="col-2">Категория</div>
        <div className="col-2">Согласующие</div>
        <div className="col-2">Дочерние цели</div>
        <div className="col-1">Вес цели</div>
      </div>
      {data && data.goals.map((goal, idx) => (
        <div className="card flex-row align-items-center h6" style={localStyles.card} onClick={() => showAside(idx)} key={goal.id}>
          <div className="col-2"><span className="badge badge-primary">{goal.state}</span></div>
          <div className="col-3">{goal.description}</div>
          <div className="col-2">{goal.category}</div>
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
