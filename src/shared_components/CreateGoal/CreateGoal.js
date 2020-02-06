import React from 'react';
import * as Styled from './CreateGoal.styled';
import Form from 'react-jsonschema-form';
import {
  BtnPrimaryLarge,
  BtnSecondaryLarge
} from '../../shared_components/Buttons/Buttons.styled';

// const NewGoalForm = () => (
//   <Styled.DialogContent>
//     <Styled.DialogHeader>Создание цели</Styled.DialogHeader>
//     <div className="dropdown-divider" />
//     <Styled.DialogForm>
//       <Form
//         schema={schemaData.entity_definitions[0].schema}
//         uiSchema={
//           uiSchemaData.ui_schemas.find(
//             item => item.entity_state === 'creating'
//           ).schema
//         }
//         idPrefix={'new_'}
//         onSubmit={onSubmit}
//       >
//         <Styled.DialogBtns>
//           <Styled.DialogCancel
//             type="button"
//             onClick={() => {
//               setIsDialogOpen(false);
//             }}
//           >
//             Отмена
//           </Styled.DialogCancel>
//           <Styled.DialogSubmit type="submit">Сохранить</Styled.DialogSubmit>
//         </Styled.DialogBtns>
//       </Form>
//     </Styled.DialogForm>
//   </Styled.DialogContent>
// );

const CreateGoal = ({ goalsSchema, goalsUISchema, onSubmit, onClose }) => {
  return (
    <Styled.DialogContent>
           <Styled.DialogHeader>Создание цели</Styled.DialogHeader>
           <div className="dropdown-divider" />
           <Styled.DialogForm>
             <Form
              schema={goalsSchema}
              uiSchema={goalsUISchema}
              idPrefix={'new_'}
              onSubmit={onSubmit}
            >
              <Styled.DialogBtns>
                <BtnSecondaryLarge
                  type="button"
                  onClick={onClose}
                >
                  Отмена
                </BtnSecondaryLarge>
                <BtnPrimaryLarge type="submit">Сохранить</BtnPrimaryLarge>
              </Styled.DialogBtns>
            </Form>
          </Styled.DialogForm>
        </Styled.DialogContent>
  );
};

export default CreateGoal;
