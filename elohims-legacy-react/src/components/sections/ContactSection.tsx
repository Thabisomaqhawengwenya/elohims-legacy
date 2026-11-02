import React from 'react';
import styled from 'styled-components';

interface ContactSectionProps {
  email: string;
}

const Mail = styled.div`
  font-weight: 200;
  font-size: clamp(1.7rem, 6.4vw, 6rem);
  margin-left: auto;
  text-align: right;
  letter-spacing: -0.02em;

  a {
    color: inherit;
    text-decoration: none;
  }

  @media (max-width: 800px) {
    margin-left: 0;
    text-align: left;
  }
`;

const Foot = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 8vh;
  padding-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.borderDivider};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.7;

  b {
    display: block;
    color: #ffffff;
    margin-bottom: 6px;
  }

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

export const ContactSection: React.FC<ContactSectionProps> = ({ email }) => {
  return (
    <section id="contact">
      <Mail className="mail rv">
        <a href={`mailto:${email}`}>
          hello@
          <br />
          elohimslegacy.com
        </a>
      </Mail>
      <Foot className="foot rv">
        <div>
          <b>Orders</b>
          Order via WhatsApp
          <br />
          Delivery across Zimbabwe
        </div>
        <div>
          <b>Social</b>
          Instagram
          <br />
          TikTok
          <br />
          Facebook
        </div>
        <div>
          <b>Elohim's Legacy</b>
          Forged in Purpose,
          <br />
          Worn in Legacy
        </div>
      </Foot>
    </section>
  );
};
