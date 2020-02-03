import styled from 'styled-components';

export const Content = styled.div`
  padding: 40px;
  position: relative;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 9px;
  margin-top: 10px;
  color: #617691;
  font-size: 11px;
  justify-content: flex-start;
`;

export const FullName = styled.div`
    margin-top: 30px;
    font-size: 18px;
    font-weight: 600;
`;

export const Card = styled.div`
  padding: 24px 9px;
  border-radius: 4px;
  margin: 8px 0;
  box-shadow: 0 8px 15px 0 rgba(97, 118, 145, 0.25),
    0 0 6px 0 rgba(169, 186, 206, 0.2);
  display: flex;
  align-items: center;
  background-color: #fff;
  font-size: 16px;
  color: #1b2839;
`;

export const TextBlueGray = styled.div`
  color: #617691;
  font-size: 14px;
  line-height: 20px;
`;

export const ButtonAdd = styled.button`
  color: #1b2839;
  padding: 26px;
  width: 100%;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  line-height: 20px;
  background-color: #e9eff4;
  border: unset;
  border-radius: 4px;
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
  & * {
    margin-left: 20px;
  }
  & *:first-child {
    margin-left: unset;
  }
`;

export const DialogCancel = styled.button`
  height: 40px;
  width: 100px;
  background-color: #e9eff4;
  font-weight: 600;
  border: unset;
  border-radius: 5px;
`;

export const DialogSubmit = styled.button`
  margin-left: 20px;
  height: 40px;
  width: 100px;
  color: #fff;
  background-color: #1348cf;
  font-weight: 700;
  border: unset;
  border-radius: 5px;
`;

export const ViewGoalContainer = styled.div`
  padding: 24px 40px;
  font-size: 16px;
  color: #1b2839;
`;
