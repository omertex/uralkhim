import styled from 'styled-components';
import CleanButton from '../CleanButton/CleanButton';
import burger from '../../assets/burger.svg';

export const Main = styled.main`
  flex: 1 1;

  .sidebar-show & {
    margin-left: 200px;
  }
  .sidebar-show2 & {
    margin-left: 200px;
  }

  .sidebar-show.sidebar-minimized & {
    margin-left: 50px;
  }
  .sidebar-show2.sidebar-minimized & {
    margin-left: 50px;
  }
`;

export const Logo = styled.img`
    width: 60px;
    margin: 20px 0 30px 20px;

    .sidebar-minimized & {
      display: none;
    }
`;

export const BtnSidebar = styled(CleanButton)`
    width: 40px;
    height: 40px;
    position: fixed;
    background: url(${burger}) no-repeat center rgba(255, 255, 255, 0.9);
    z-index: 1;
    border-bottom-right-radius: 10px;
    box-shadow: 0 0px 5px rgba(0 ,0,0, 0.2);
    &:focus {
      outline: none;
    }
    @media (min-width: 992px) {
      display: none;
    }
`;
