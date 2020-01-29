import styled from 'styled-components';

export const Content = styled.div`
  padding: 30px;
  position: relative;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
`;

export const Card = styled.div`
  height: 80px;
  border-radius: 5px;
  margin: 10px 0;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  background-color: #fff;
`;

export const TextGray = styled.div`
  color: gray;
  font-size: 12px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export const ButtonAdd = styled.button`
  height: 80px;
  width: 100%;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  background-color: #e9eff4;
  border: unset;
  border-radius: 5px;
`;

export const DialogContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const DialogHeader = styled.span`
  font-size: 28px;
  font-weight: 600;
`;

export const DialogForm = styled.div`
  margin-top: 20px;
`;

export const DialogBtns = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export const DialogCancel= styled.button`
  height: 40px;
  width: 100px;
  background-color: #e9eff4;
  font-weight: 600;
  border: unset;
  border-radius: 5px;
`;

export const DialogSubmit= styled.button`
  margin-left: 20px;
  height: 40px;
  width: 100px;
  color: #fff;
  background-color: #1348cf;
  font-weight: 600;
    border: unset;
  border-radius: 5px;
`;
