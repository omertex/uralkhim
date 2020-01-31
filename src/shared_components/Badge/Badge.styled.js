import styled from 'styled-components';

const badgeColor = variant => {
  switch (variant) {
    case 'in_review':
      return '#05a9af';
    case 'in_progress':
      return '#05a9af';
    case 'draft':
      return '#415062';
  }
}

const badgeBGColor = variant => {
  switch (variant) {
    case 'in_review':
      return '#d1f3f4';
    case 'in_progress':
      return '#d1f3f4';
    case 'draft':
      return '#e0e4e9';
  }
}

export const Badge = styled.span`
  padding: 5px;
  font-size: 12px;
  font-weight: 600;
  color: ${({variant}) => badgeColor(variant)};
  background-color: ${({variant}) => badgeBGColor(variant)};
  border-radius: 3px;
`;
