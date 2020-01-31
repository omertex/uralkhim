import styled from 'styled-components';

export const Main = styled.main`
  flex: 1 1;

  .sidebar-minimized & {
    margin-left: 50px;
  }

  @media (min-width: 992px) {
    margin-left: 200px;
  }
`;

export const Logo = styled.img`
    width: 60px;
    margin: 20px 0 30px 20px;

    .sidebar-minimized & {
      display: none;
    }
`;
