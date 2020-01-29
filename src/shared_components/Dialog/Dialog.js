import React from 'react';
import ReactDOM from 'react-dom';
import { Transition } from 'react-transition-group';
import * as Styled from './Dialog.styled';

const Dialog = ({children, isOpen, close}) => {
    return ReactDOM.createPortal(
      <Transition in={isOpen} timeout={{ appear: 100, enter: 100, exit: 300 }}>
        {state => (
          <Styled.Overlay state={state}>
            <Styled.DialogWrapper state={state}>
              <Styled.BtnClose onClick={close}>X</Styled.BtnClose>
              {children}
            </Styled.DialogWrapper>
          </Styled.Overlay>
        )}
      </Transition>,
      document.body
    );
};

export default Dialog;
