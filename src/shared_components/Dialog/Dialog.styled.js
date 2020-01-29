import styled from 'styled-components';
import CleanButton from '../CleanButton/CleanButton';

export const Overlay = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 10000;
  transition: all 0.25s;
  display: ${({ state }) => (state === 'exited' ? 'none' : 'div')};
  opacity: ${({ state }) =>
    state === 'entering' || state === 'exiting' ? '0' : '1'};
`;

export const DialogWrapper = styled.div`
  position: absolute;
    padding: 30px;
  left: calc(50% + 100px);
  top: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 600px;
  max-height: 90%;
  margin: auto;
  background-color: #fff;
  border-radius: 5px;
  transition: all 0.25s;
  display: ${({ state }) => (state === 'exited' ? 'none' : 'div')};
  opacity: ${({ state }) =>
    state === 'entering' || state === 'exiting' ? '0' : '1'};
  overflow: hidden;
`;

export const BtnClose = styled(CleanButton)`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 5px;
`;
