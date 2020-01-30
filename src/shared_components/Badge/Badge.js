import React from 'react';
import * as Styled from './Badge.styled';

const VARIANTS = {
  'in_review': 'На ознакомлении',
  'draft': 'Черновик'
}

const Badge = ({variant}) => (
  <Styled.Badge variant={variant}>
    {VARIANTS[variant]}
  </Styled.Badge>
);

export default Badge;
