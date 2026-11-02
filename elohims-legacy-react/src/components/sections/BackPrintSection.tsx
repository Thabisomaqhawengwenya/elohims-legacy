import React from 'react';
import styled from 'styled-components';

const RightSection = styled.section`
  align-items: flex-end;
  text-align: right;

  @media (max-width: 800px) {
    align-items: flex-start;
    text-align: left;
  }
`;

export const BackPrintSection: React.FC = () => {
  return (
    <RightSection className="r">
      <h2 className="d rv">
        The <span className="o">back</span>
        <br />
        says it all
      </h2>
      <p className="l rv">
        Matthew 6:9–13 printed across the back. The Lord's Prayer in white ink on
        soft-washed black.
      </p>
    </RightSection>
  );
};
