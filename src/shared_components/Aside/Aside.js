import React from 'react';
import * as Styled from './Aside.styled.js';
import { ReactComponent as CloseIcon } from '../../assets/close.svg';
import { Transition } from 'react-transition-group';

const Aside = ({ children, close, isOpen }) => (
  <Transition in={isOpen} timeout={250}>
    {state => (
      <Styled.Overlay state={state}>
        <Styled.Aside state={state}>
          <Styled.CloseBtn onClick={close}>
            <CloseIcon />
          </Styled.CloseBtn>
          {children}
        </Styled.Aside>
      </Styled.Overlay>
    )}
  </Transition>
);

export default Aside;
