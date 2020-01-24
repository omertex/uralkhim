import React from "react";
import * as Styled from "./Aside.styled.js";


const Aside = ({children, close, state}) => (
  <Styled.Overlay state={state}>
    <Styled.Aside state={state}>
      <Styled.CloseBtn onClick={close}>X</Styled.CloseBtn>
      {children}
    </Styled.Aside>
  </Styled.Overlay>
);

export default Aside;
