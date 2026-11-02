import React from 'react';

interface HeroSectionProps {
  headline: string;
  headlineAccent: string;
  description: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  headlineAccent,
}) => {
  return (
    <section>
      <h1 className="d rv">
        Directed
        <br />
        by <span className="o">{headlineAccent}</span>
      </h1>
      <p className="l rv">
        Forged in purpose, worn in legacy. Our oversized <b>heavyweight tee</b>,
        soft-washed black, with the print that says it all.
      </p>
    </section>
  );
};
