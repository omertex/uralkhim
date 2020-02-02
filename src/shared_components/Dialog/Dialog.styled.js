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
  display: ${({ state }) => (state === 'exited' ? 'none' : 'flex')};
  opacity: ${({ state }) =>
    state === 'entering' || state === 'exiting' ? '0' : '1'};
  align-items: center;
`;

export const DialogWrapper = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  width: 90%;
  max-width: 600px;
  max-height: 90%;
  margin: auto;
  background-color: #fff;
  border-radius: 5px;
  transition: all 0.25s;
  display: ${({ state }) => (state === 'exited' ? 'none' : 'flex')};
  opacity: ${({ state }) =>
    state === 'entering' || state === 'exiting' ? '0' : '1'};
  overflow: overlay;
`;

export const BtnClose = styled(CleanButton)`
  position: absolute;
  top: 40px;
  right: 30px;
  padding: 5px;
`;
