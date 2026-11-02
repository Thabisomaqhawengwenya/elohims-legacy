import React from 'react';
import styled from 'styled-components';

interface StatementSectionProps {
  statement: string;
}

const BigHeading = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  text-transform: uppercase;
  font-size: clamp(1.8rem, 4.4vw, 4.2rem);
  line-height: 1.15;
  max-width: 22ch;
  margin-left: auto;
  text-align: right;
  color: #ffffff;
  text-shadow:
    0 4px 24px rgba(0, 0, 0, 0.95),
    0 2px 8px rgba(0, 0, 0, 0.9);

  @media (max-width: 800px) {
    margin-left: 0;
    text-align: left;
  }
`;

export const StatementSection: React.FC<StatementSectionProps> = ({
  statement,
}) => {
  return (
    <section>
      <BigHeading className="big rv">{statement}</BigHeading>
    </section>
  );
};
