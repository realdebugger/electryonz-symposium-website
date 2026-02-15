import React from 'react';
import PageWrapper from '../components/pageWrapper';

const About = () => {
  return (
    <PageWrapper>        <div className="container section">
      <div className="about-section">
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>About ALTRANZ</h1>
        <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
          ALTRANZ is a vibrant and dynamic platform that brings together creativity, innovation, and collaboration under one roof. It serves as a hub for students to showcase their skills, share ideas, and explore new possibilities beyond the classroom. With a focus on learning through experience, ALTRANZ encourages participants to challenge themselves, think critically, and engage in meaningful discussions. The symposium organized under ALTRANZ creates an environment where innovation meets fun, and curiosity is always rewarded. From interactive sessions to every event is designed to inspire and ignite passion. ALTRANZ not only celebrates talent but also fosters a sense of community and teamwork among students. By participating, students gain exposure, build networks, and create memories that last a lifetime. It’s more than an event—it’s a movement to empower the next generation of thinkers and innovators.
        </p>

        <h2 style={{ color: 'var(--color-secondary)', marginTop: '3rem' }}>Our Vision</h2>
        <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: 'var(--color-text-muted)' }}>
          To create excellent engineers with entrepreneurship skills by providing quality theoretical and practical knowledge.
        </p>

        <div style={{ marginTop: '4rem', padding: '2rem', border: '1px solid var(--color-border)', background: 'var(--color-bg-card)' }}>
          <h3>Venue & Date</h3>
          <p style={{ fontSize: '1.2rem', color: '#fff' }}>📅 FEB 26 & 27 2026</p>
          <p style={{ fontSize: '1.2rem', color: '#fff' }}>📍 EEE DEPARTMENT, GCEB</p>
        </div>
        <section className="about-department-section">
          <h2 className="section-title accent-orange">
            ABOUT THE DEPARTMENT
          </h2>

          <p className="about-department-text">
            Department of Electrical and Electronics Engineering is empowering the indolent gizmos onto spirited lines. The department offers sound theoretical as well as practical training with the state of art equipments. The department envisages in equipping the students with advanced technology to cater to the requirements of industries and research establishments.

            To improve the efficiency of the students the department provides well equipped laboratories with latest version of software. The Department also supplements with high speed Internet facilities of 2 Mbps. The department serves as a cradle of eminent software engineers of the world. The Experienced members of staff of the department act as base in which talent of the student is built.
          </p>

          <a
            href="https://gcebargur.ac.in/22/about-us"
            target="_blank"
            rel="noopener noreferrer"
            className="about-department-btn"

          >
            KNOW MORE ABOUT THE DEPARTMENT →
          </a>
        </section>

      </div>
    </div>
    </PageWrapper>

  );
};

export default About;
