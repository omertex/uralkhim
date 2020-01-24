import React from "react";
import Aside from "../../shared_components/Aside/Aside";
import { Transition } from "react-transition-group"

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

const MyTargets = () => {
  const [asideVisible, setAsideVisible] = React.useState(false);
  const showAside = () => {
    setAsideVisible((prevState => !prevState));
    console.log("showAside");
  }
  const closeAside = () => {
    setAsideVisible(false);
  }

  return (
    <div style={localStyles.contentContainer}>
      <Transition in={asideVisible} timeout={250}>
        {(state) => <Aside close={closeAside} state={state}>
          <div className="p-3">
            <div className="pt-4"><span className="badge badge-primary">В работе</span></div>
            <div className="mt-4 h3 font-weight-bold">Снизить ПОС на 20%</div>
            <button type="button" className="btn btn-info">Делегировать</button>
            <button type="button" className="btn btn-info ml-2">Декомпозировать</button>
          </div>
          <div className="dropdown-divider"></div>
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
      <div className="card flex-row align-items-center h6" style={localStyles.card} onClick={showAside}>
        <div className="col-2"><span className="badge badge-primary">В работе</span></div>
        <div className="col-3">Снизить ПОС на 20%</div>
        <div className="col-2">Поставленная руководителем</div>
        <div className="col-2">Звягинцев Е.И.</div>
        <div className="col-2">0</div>
        <div className="col-1 font-weight-bold">50%</div>
      </div>
      <div className="card flex-row align-items-center h6" style={localStyles.card}>
        <div className="col-2"><span className="badge badge-info">На ознакомлении</span></div>
        <div className="col-3">Повысить производство бутадиена на 20%</div>
        <div className="col-2">Поставленная руководителем</div>
        <div className="col-2">Звягинцев Е.И.</div>
        <div className="col-2">0</div>
        <div className="col-1 font-weight-bold">40%</div>
      </div>
      <button className="card flex-row justify-content-center align-items-center h4" style={localStyles.btnAddTarget}
      >
        + Создать персональную цель
      </button>
    </div>
  );
}

export default MyTargets;
