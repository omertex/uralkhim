import React from 'react';
import * as Styled from './EditGoal.styled';
import Form from 'react-jsonschema-form';
import {
  BtnPrimaryLarge,
  BtnSecondaryLarge
} from '../../shared_components/Buttons/Buttons.styled';

// const EditForm = () => (
//   <Styled.DialogContent>
//     <Styled.DialogHeader>Редактирование цели</Styled.DialogHeader>
//     <div className="dropdown-divider" />
//     <Styled.ViewGoalContainer>
//       <Form noValidate
//         schema={schemaData.entity_definitions[0].schema}
//         uiSchema={
//           uiSchemaData.ui_schemas.find(item => item.entity_state === 'edit')
//             .schema
//         }
//         formData={{
//           countingMethod: goalsData.goals[aside.idx].verification_method,
//           category: goalsData.goals[aside.idx].category,
//           period: {
//             from: goalsData.goals[aside.idx].date_from,
//             to: goalsData.goals[aside.idx].date_to
//           },
//           verifier_id: goalsData.goals[aside.idx].verifier_id,
//           description: goalsData.goals[aside.idx].description,
//           weight: goalsData.goals[aside.idx].weight
//         }}
//         idPrefix={'edit_'}
//         onSubmit={onUpdateGoal}
//       >
//         <Styled.DialogBtns>
//           <Styled.DialogCancel
//             type="button"
//             onClick={() => {
//               setIsEditDialogOpen(false);
//             }}
//           >
//             Отмена
//           </Styled.DialogCancel>
//           <Styled.DialogSubmit type="submit">Сохранить</Styled.DialogSubmit>
//         </Styled.DialogBtns>
//       </Form>
//     </Styled.ViewGoalContainer>
//   </Styled.DialogContent>
// );

const EditGoal = ({ goal, goalsSchema, goalsUISchema, onSubmit, onClose }) => {
  return (
    <Styled.DialogContent>
      <Styled.DialogHeader>Редактирование цели</Styled.DialogHeader>
      <div className="dropdown-divider" />
      <Styled.ViewGoalContainer>
        <Form
          noValidate
          schema={goalsSchema}
          uiSchema={goalsUISchema}
          formData={{
            countingMethod: goal.verification_method,
            category: goal.category,
            period: {
              from: goal.date_from,
              to: goal.date_to
            },
            verifier_id: goal.verifier_id,
            description: goal.description,
            weight: goal.weight
          }}
          idPrefix={'edit_'}
          onSubmit={onSubmit}
        >
          <Styled.DialogBtns>
            <BtnSecondaryLarge type="button" onClick={onClose}>
              Отмена
            </BtnSecondaryLarge>
            <BtnPrimaryLarge type="submit">Сохранить</BtnPrimaryLarge>
          </Styled.DialogBtns>
        </Form>
      </Styled.ViewGoalContainer>
    </Styled.DialogContent>
  );
};

export default EditGoal;
