import React from 'react';
import Aside from '../../shared_components/Aside/Aside';
import Form from 'react-jsonschema-form';
import * as Styled from './MyGoals.styled';
import Badge from '../../shared_components/Badge/Badge';
import Dialog from '../../shared_components/Dialog/Dialog';
import { connect } from 'react-redux';
import {
  BtnSecondary,
  BtnPrimary,
  BtnError,
  BtnPrimaryLarge,
  BtnSecondaryLarge
} from '../../shared_components/Buttons/Buttons.styled';
import ViewGoal from '../../shared_components/ViewGoal/ViewGoal';
import EditGoal from '../../shared_components/EditGoal/EditGoal';
import CreateGoal from '../../shared_components/CreateGoal/CreateGoal';


const MyGoals = ({
  dataLoaded,
  goalsSchema,
  goalsUISchema,
  mutations,
  myGoals,
  user
}) => {
  const [aside, setAside] = React.useState({
    visible: false,
    id: 0
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [isDelegateDialogOpen, setIsDelegateDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  React.useEffect(() => {
    if (user.role !== 'manager') {
      document.querySelector('.subs-link').style.display = 'none';
    }
  }, []);

  const showAside = id => {
    setAside({ visible: true, id, goal: myGoals.find(goal => goal.id === id) });
  };
  const closeAside = () => {
    setAside({ visible: false, id: 0 });
  };
  const onDelegate = () => {
    closeAside();
    setIsDelegateDialogOpen(true);
  };
  const onTakeGoal = goalId => {
    closeAside();
    mutations.takeGoal({
      variables: {
        goalId
      }
    });
  };
  // const onDelegateSubmit = ({ formData }, event) => {
  //   setIsDelegateDialogOpen(false);
  //   event.preventDefault();
  //   setIsDelegateDialogOpen(false);
  //   delegateGoal({
  //     variables: {
  //       data: {
  //         delegated_to_id: formData.subordinateEnum.toString(),
  //         weight: formData.weight
  //       },
  //       goalId: goalsData.goals[aside.idx].id
  //     }
  //   });
  // };
  const onCreateGoal = ({ formData }, event) => {
    setIsCreateDialogOpen(false);
    event.preventDefault();
    mutations.addGoal({
      variables: {
        countingMethod: formData.countingMethod,
        type: formData.type,
        date_from: formData.period.from,
        date_to: formData.period.to,
        description: formData.description,
        verifier_id: formData.verifier_id,
        delegated_to_id: formData.delegate_to_id && formData.delegate_to_id.toString() || user.id.toString(),
        weight: +formData.weight
      }
    });
  };

  const onDeleteGoal = goalId => {
    closeAside();
    mutations.deleteGoal({
      variables: {
        goalId
      }
    });
  };
  const onUpdateGoal = ({ formData }, event) => {
    event.preventDefault();
    setIsEditDialogOpen(false);
    mutations.updateGoal({
      variables: {
        countingMethod: formData.countingMethod,
        goalId: aside.id,
        date_from: formData.period.from,
        date_to: formData.period.to,
        description: formData.description,
        verifier_id: formData.verifier_id,
        type: formData.type,
        weight: formData.weight
      }
    });
  };



  // const DelegateForm = () => {
  //   let enumArray = [];
  //   let enumNamesArray = [];
  //   subordinatesData.subordinates.forEach(item => {
  //     enumArray.push(+item.id);
  //     enumNamesArray.push(item.fullName);
  //   });
  //
  //   const schema = {
  //     type: 'object',
  //     properties: {
  //       subordinateEnum: {
  //         type: 'number',
  //         title: 'Сотрудник',
  //         enum: enumArray,
  //         enumNames: enumNamesArray
  //       },
  //       weight: {
  //         type: 'number',
  //         title: 'Вес цели'
  //       }
  //     }
  //   };
  //
  //   return (
  //     <Styled.DialogContent>
  //       <Styled.DialogHeader>Делегирование цели</Styled.DialogHeader>
  //       <Styled.DialogForm>
  //         <Form
  //           schema={schema}
  //           onSubmit={onDelegateSubmit}
  //           idPrefix={'delegate_'}
  //         >
  //           <Styled.DialogBtns>
  //             <BtnSecondaryLarge
  //               type="button"
  //               onClick={() => setIsDelegateDialogOpen(false)}
  //             >
  //               Отмена
  //             </BtnSecondaryLarge>
  //             <BtnPrimaryLarge type="submit">Делегировать</BtnPrimaryLarge>
  //           </Styled.DialogBtns>
  //         </Form>
  //       </Styled.DialogForm>
  //     </Styled.DialogContent>
  //   );
  // };

  const ViewGoalControls = () =>
    user.role === 'manager' ? (
      <>
        <BtnSecondary onClick={onDelegate}>Делегировать</BtnSecondary>
        {(aside.goal.state === 'draft' || aside.goal.state === 'in_review') && (
          <BtnPrimary className="ml-3" onClick={() => onTakeGoal(aside.id)}>
            Взять в работу
          </BtnPrimary>
        )}
        <BtnPrimary className="ml-3" onClick={() => setIsEditDialogOpen(true)}>
          Редактировать
        </BtnPrimary>
        {aside.goal.state === 'draft' && (
          <BtnError className="ml-3" onClick={() => onDeleteGoal(aside.id)}>
            Удалить
          </BtnError>
        )}
      </>
    ) : (
      (aside.goal.state === 'draft' || aside.goal.state === 'in_review') && (
        <BtnPrimary onClick={() => onTakeGoal(aside.id)}>
          Взять в работу
        </BtnPrimary>
      )
    );

  return (
    <Styled.Content>

      {/*<Dialog*/}
      {/*  isOpen={isDelegateDialogOpen}*/}
      {/*  close={() => {*/}
      {/*    setIsDelegateDialogOpen(false);*/}
      {/*  }}*/}
      {/*>*/}
      {/*  {!subordinatesLoading && subordinatesData && <DelegateForm />}*/}
      {/*</Dialog>*/}

      {dataLoaded && (
        <>
          <Aside close={closeAside} isOpen={aside.visible}>
            {aside.visible && (
              <ViewGoal
                controls={<ViewGoalControls />}
                goal={aside.goal}
                goalsSchema={goalsSchema}
                goalsUISchema={
                  goalsUISchema.find(
                    uiSchema => uiSchema.entity_state === 'edit'
                  ).schema
                }
              />
            )}
          </Aside>
          <Dialog isOpen={isCreateDialogOpen} close={() => setIsCreateDialogOpen(false)}>
            <CreateGoal
              goalsSchema={goalsSchema}
              goalsUISchema={
                goalsUISchema.find(
                  uiSchema => uiSchema.entity_state === 'creating'
                ).schema
              }
              onSubmit={onCreateGoal}
              onClose={() => setIsCreateDialogOpen(false)}
            />
          </Dialog>
          <Dialog
            isOpen={isEditDialogOpen}
            close={() => setIsEditDialogOpen(false)}
          >
            {isEditDialogOpen && (
              <EditGoal
                goal={aside.goal}
                goalsSchema={goalsSchema}
                goalsUISchema={
                  goalsUISchema.find(
                    uiSchema => uiSchema.entity_state === 'edit'
                  ).schema
                }
                onSubmit={onUpdateGoal}
                onClose={() => setIsEditDialogOpen(false)}
              />
            )}
          </Dialog>
          <div className="h2 font-weight-bold">Мои цели</div>
          <Styled.Header>
            <span className="col-2">Статус</span>
            <span className="col-3">Название</span>
            <span className="col-3">Категория</span>
            <span className="col-3">Дочерние цели</span>
            <span className="col-1 text-right">Вес цели</span>
          </Styled.Header>
          {myGoals &&
            myGoals.map(goal => (
              <Styled.Card onClick={() => showAside(goal.id)} key={goal.id}>
                <span className="col-2">
                  <Badge variant={goal.state} />
                </span>
                <span className="col-3">{goal.description}</span>
                <Styled.TextBlueGray className="col-3">
                  {goalsSchema.properties.category.enumNames[goal.category - 1]}
                </Styled.TextBlueGray>
                <Styled.TextBlueGray className="col-3">
                  {goal.goals_aggregate.aggregate.count}
                </Styled.TextBlueGray>
                <span className="col-1 font-weight-bold text-right">
                  {goal.weight}%
                </span>
              </Styled.Card>
            ))}
          <Styled.ButtonAdd onClick={() => setIsCreateDialogOpen(true)}>
            + Создать персональную цель
          </Styled.ButtonAdd>
        </>
      )}
    </Styled.Content>
  );
};

const mapStateToProps = state => {
  return {
    user: state.user,
    dataLoaded: state.dataLoaded,
    myGoals: state.myGoals,
    mutations: state.mutations,
    goalsSchema: state.goalsSchema,
    goalsUISchema: state.goalsUISchema
  };
};

export default connect(mapStateToProps)(MyGoals);
