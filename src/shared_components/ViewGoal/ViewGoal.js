import React from 'react';
import Badge from '../Badge/Badge';
import * as Styled from './ViewGoal.styled';
import Form from 'react-jsonschema-form';

// const ViewGoal = () => (
//   <>
//     <Styled.ViewGoalContainer>
//       <div className="mt-3">
//         <Badge variant={goalsData.goals[aside.idx].state} />
//       </div>
//       <div className="mt-3 mb-3 h2 font-weight-bold">
//         {goalsData.goals[aside.idx].description}
//       </div>
//       {user.role === 'manager' ? (
//         <>
//           <BtnSecondary onClick={onDelegate}>Делегировать</BtnSecondary>
//           {(goalsData.goals[aside.idx].state === 'draft' ||
//             goalsData.goals[aside.idx].state === 'in_review') && (
//             <BtnPrimary className="ml-3" onClick={onTakeGoal}>
//               Взять в работу
//             </BtnPrimary>
//           )}
//           <BtnPrimary
//             className="ml-3"
//             onClick={() => setIsEditDialogOpen(true)}
//           >
//             Редактировать
//           </BtnPrimary>
//           {goalsData.goals[aside.idx].state === 'draft' && <BtnError
//             className="ml-3"
//             onClick={onDeleteGoal}
//           >
//             Удалить
//           </BtnError>}
//         </>
//       ) : (
//         (goalsData.goals[aside.idx].state === 'draft' ||
//           goalsData.goals[aside.idx].state === 'in_review') && (
//           <BtnPrimary onClick={onTakeGoal}>Взять в работу</BtnPrimary>
//         )
//       )}
//     </Styled.ViewGoalContainer>
//     <div className="dropdown-divider"></div>
//     <Styled.ViewGoalContainer>
//       <div className="font-weight-bold mb-2">Основная информация</div>
//       <Form
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
//         idPrefix={'view_'}
//         onSubmit={onUpdateGoal}
//       >
//         <div />
//       </Form>
//     </Styled.ViewGoalContainer>
//   </>
// );

const ViewGoal = ({ controls, goal, goalsSchema, goalsUISchema }) => {
  return (
  <>
    <Styled.ViewGoalContainer>
      <div className="mt-3">
        <Badge variant={goal.state} />
      </div>
      <div className="mt-3 mb-3 h2 font-weight-bold">{goal.description}</div>
      {controls}
    </Styled.ViewGoalContainer>
    <div className="dropdown-divider"></div>
    <Styled.ViewGoalContainer>
      <div className="font-weight-bold mb-2">Основная информация</div>
      <Form
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
        idPrefix={'view_'}
      >
        <div />
      </Form>
    </Styled.ViewGoalContainer>
  </>
);}

export default ViewGoal;
