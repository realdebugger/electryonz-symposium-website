import React from 'react';
import PageWrapper from '../components/pageWrapper';

const About = () => {
    return (
        <PageWrapper>        <div className="container section">
            <div className="about-section">
                <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>About SYNERIX</h1>
                <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: 'var(--color-text-muted)', lineHeight: '1.8'}}>
                    SYNERIX is a national-level technical symposium organized by the Department of Mechanical Engineering, designed to bring together innovation, engineering excellence, and creative problem-solving under one platform.

Rooted in the core principles of Mechanical Engineering, 
Synerix serves as a convergence point for students, academicians, and industry enthusiasts to explore real-world engineering challenges. The symposium encourages participants to apply theoretical knowledge to practical scenarios through a diverse range of technical events, workshops, design challenges, and hands-on competitions.
                </p>

                <h2 style={{ color: 'var(--color-secondary)', marginTop: '3rem' }}>Our Vision</h2>
                <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: 'var(--color-text-muted)' }}>
                    To inspire a generation of Engineers who innovate responsibly, think critically, and lead confidently in shaping the future of technology and industry.
                </p>

                <div style={{ marginTop: '4rem', padding: '2rem', border: '1px solid var(--color-border)', background: 'var(--color-bg-card)' }}>
                    <h3>Venue & Date</h3>
                    <p style={{ fontSize: '1.2rem', color: '#fff' }}>📅 FEB 17 2026</p>
                    <p style={{ fontSize: '1.2rem', color: '#fff' }}>📍 MECHANICAL DEPARTMENT, GCEB</p>
                </div>
                <section className="about-department-section">
  <h2 className="section-title accent-orange">
    ABOUT THE DEPARTMENT
  </h2>

  <p className="about-department-text">
    The department of Mechanical Engineering was established in the year 2009.
    This department offers B.E. (Mechanical Engineering) from the academic year
    2009 – 2010. It has well equipped, state-of-the-art laboratories that cater
    to the needs of the students. Principle study topics include fluid mechanics,
    thermodynamics, heat transfer, solid mechanics, materials engineering,
    manufacturing engineering, energy systems, dynamics & control systems,
    Computer Aided Design (CAD), Computer Integrated Manufacturing (CIM) and
    other related topics.
    <br /><br />
    This broad and flexible program allows students to customize their program
    to meet their objectives and particular career goals. The department also
    organises several training programmes, workshops, seminars for staff and
    students every year. Our faculty members explore research in various fields
    such as Micro Machining, IC Engines, Alternative Fuels, Nano Coatings,
    Composite materials, Coatings technology, Surface Engineering, Corrosion,
    Optimization, Nano Materials, Refrigeration and Air conditioning.
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
