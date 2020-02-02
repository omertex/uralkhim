import styled from 'styled-components';

const DefaultButton = styled.button`
  border: unset;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  padding: 6px 16px;
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
