import styled from 'styled-components';

export const DialogContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const DialogBtns = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  & * {
    margin-left: 20px;
  }
  & *:first-child {
    margin-left: unset;
  }
`;

export const DialogForm = styled.div`
  margin: 32px 40px;

  fieldset {
    padding: 0;
  }
`;

export const DialogHeader = styled.span`
  font-size: 28px;
  line-height: 32px;
  font-weight: bold;
  margin: 40px 40px 28px;
`;
