import styled from 'styled-components';
import CleanButton from '../CleanButton/CleanButton';

export const Aside = styled.div`
  position: relative;
  width: 640px;
  height: 100%;
  background-color: #fff;
  margin-left: auto;
  transition: 0.25s;
  margin-right: ${({state}) => (state === 'entering' || state === 'entered' ? 0 : -500)}px;
  overflow-y: auto;
`;

export const Overlay = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1;
  width: ${({state}) => state === 'exited' ? 0 : '100%'};
`;

export const CloseBtn = styled(CleanButton)`
  padding: 10px;
  position: absolute;
  right: 10px;
  top: 25px;
`;
