import React from 'react';
import * as Styled from './Aside.styled.js';
import { ReactComponent as CloseIcon } from '../../assets/close.svg';

const Aside = ({ children, close, state }) => (
  <Styled.Overlay state={state}>
    <Styled.Aside state={state}>
      <Styled.CloseBtn onClick={close}>
        <CloseIcon />
      </Styled.CloseBtn>
      {children}
    </Styled.Aside>
  </Styled.Overlay>
);

export default Aside;
