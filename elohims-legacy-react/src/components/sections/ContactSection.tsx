import React from 'react';
import styled from 'styled-components';

interface ContactSectionProps {
  email: string;
}

const Mail = styled.div`
  font-weight: 200;
  font-size: clamp(1.8rem, 6.5vw, 6.2rem);
  margin-left: auto;
  text-align: right;
  letter-spacing: -0.02em;
  color: #ffffff;
  text-shadow:
    0 4px 30px rgba(0, 0, 0, 0.95),
    0 2px 10px rgba(0, 0, 0, 0.9);

  a {
    color: inherit;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: ${({ theme }) => theme.colors.gold};
    }
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
  padding: 24px 22px;
  background: rgba(12, 15, 22, 0.75);
  backdrop-filter: blur(14px);
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
  font-size: 0.8rem;
  color: #cbd5e1;
  line-height: 1.8;

  b {
    display: block;
    color: #ffffff;
    font-size: 0.95rem;
    margin-bottom: 8px;
    letter-spacing: 0.04em;
    text-shadow: 0 1px 6px rgba(0, 0, 0, 0.8);
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
