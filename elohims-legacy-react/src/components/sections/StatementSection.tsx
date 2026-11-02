import React from 'react';
import styled from 'styled-components';

interface StatementSectionProps {
  statement: string;
}

const BigHeading = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  text-transform: uppercase;
  font-size: clamp(1.6rem, 4.2vw, 4rem);
  line-height: 1.1;
  max-width: 22ch;
  margin-left: auto;
  text-align: right;

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
