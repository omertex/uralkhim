import styled from 'styled-components';

const DefaultButton = styled.button`
  height: 35px;
  min-width: 50px;
  border: unset;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 600;
  padding: 0 15px;
  padding: 0 15px;
`;

export const BtnPrimary = styled(DefaultButton)`
  color: #fff;
  background-color: #1348cf;
`;

export const BtnSecondary = styled(DefaultButton)`
  color: #1b2839;
  background-color: #e9eff4;
`;

export const BtnPrimaryLarge = styled(DefaultButton)`
  height: 40px;
  color: #fff;
  background-color: #1348cf;
`;

export const BtnSecondaryLarge = styled(DefaultButton)`
  height: 40px;
  color: #1b2839;
  background-color: #e9eff4;
`;
