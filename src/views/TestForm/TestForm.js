import React from 'react';
import Form from "react-jsonschema-form";

const MyCard = () => (
  <div className="card mb-2 flex-row"
    style={{
      height: 50,
    }}
    onClick={() => console.log('click')}
  >
    <span className="col-2 badge badge-primary">В работе</span>
    <div className="col-3">Снизить ПОС на 20%</div>
    <div className="col-3">Поставленная руководителем</div>
    <div className="col-2">Звягинцев Е.И.</div>
    <div className="col-1">0</div>
    <div className="col-1">40%</div>
  </div>
);

const fields = {card: MyCard};

const schema = {
  title: "Мои цели",
  type: "object",
  required: ["title"],
  properties: {
    card: {"type": "string",
     },
    done: {type: "boolean", title: "Done?", default: false}
  }
};

const uiSchema = {
  'card': {
    'ui:widget': MyCard
  }
};

const TestForm = () => {

  const log = (type) => console.log.bind(console, type);

  return(
    <Form schema={schema}
          uiSchema={uiSchema}
          fields={fields}
          onChange={log("changed")}
          onSubmit={log("submitted")}
          onError={log("errors")}
    >
      <div></div>
    </Form>
  );
};

export default TestForm;
