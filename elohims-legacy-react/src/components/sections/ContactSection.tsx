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
  color: var(--text-primary);
  text-shadow: var(--heading-shadow);
  transition: color 0.3s ease;

  a {
    color: inherit;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: var(--gold);
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
  background: var(--footer-bg);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-radius: 14px;
  border: 1px solid var(--border-light);
  box-shadow: var(--footer-shadow);
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.8;
  transition:
    background 0.3s ease,
    color 0.3s ease,
    border-color 0.3s ease;

  b {
    display: block;
    color: var(--text-primary);
    font-size: 0.95rem;
    margin-bottom: 8px;
    letter-spacing: 0.04em;
    text-shadow: var(--heading-shadow);
    transition: color 0.3s ease;
  }

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 18px 16px;
  }
`;

export const ContactSection: React.FC<ContactSectionProps> = ({ email }) => {
  return (
    <section id="contact">
      <Mail className="mail rv">
        <a href={`mailto:${email}`}>
          {email.split('@')[0]}@
          <br />
          {email.split('@')[1]}
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
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'block' }}
          >
            Instagram
          </a>
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'block' }}
          >
            TikTok
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'block' }}
          >
            Facebook
          </a>
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
