import React from "react";

const styles = {
  card: {
    height: 80
  },
  btnAddTarget: {
    height: 80,
    width: '100%'
  }
}

const MyTargets = () => {
  return (
    <>
      <div className="row h2 font-weight-bold mb-4">Мои цели</div>
      <div className="row h6">
        <div className="col-2">Статус</div>
        <div className="col-3">Название</div>
        <div className="col-2">Категория</div>
        <div className="col-2">Согласующие</div>
        <div className="col-2">Дочерние цели</div>
        <div className="col-1">Вес цели</div>
      </div>
      <div className="card flex-row align-items-center h6" style={styles.card}>
        <div className="col-2"><span className="badge badge-primary">В работе</span></div>
        <div className="col-3">Снизить ПОС на 20%</div>
        <div className="col-2">Поставленная руководителем</div>
        <div className="col-2">Звягинцев Е.И.</div>
        <div className="col-2">0</div>
        <div className="col-1 font-weight-bold">50%</div>
      </div>
      <div className="card flex-row align-items-center h6" style={styles.card}>
        <div className="col-2"><span className="badge badge-info">На ознакомлении</span></div>
        <div className="col-3">Повысить производство бутадиена на 20%</div>
        <div className="col-2">Поставленная руководителем</div>
        <div className="col-2">Звягинцев Е.И.</div>
        <div className="col-2">0</div>
        <div className="col-1 font-weight-bold">40%</div>
      </div>
      <button className="card flex-row justify-content-center align-items-center h4" style={styles.btnAddTarget}>
        + Создать персональную цель
      </button>
    </>
  );
}

export default MyTargets;
