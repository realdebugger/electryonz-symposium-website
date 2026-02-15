import React, { useState } from 'react';
import PageWrapper from '../components/pageWrapper';
import { API_BASE } from "../config/api";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("sending");

        if (!formData.name || !formData.email || !formData.message) {
            alert("Please fill all fields");
            setStatus(""); // Reset status if validation fails
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/api/contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: formData.message,
                }),
            });

            const json = await res.json();

            if (json.success) {
                alert("Message sent successfully ✅");
                setFormData({ name: "", email: "", message: "" });
            } else {
                alert("Failed to send message ❌");
            }
        } catch (err) {
            console.error(err);
            alert("Server error. Please try again later.");
        }
    };


    return (
        <PageWrapper>
            <div className="container section">
                <h1 style={{ textAlign: 'center', marginBottom: '3rem' }}>Get in Touch</h1>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '4rem'
                }}>

                    {/* Contact Info */}
                    <div>
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>Contact Details</h2>

                        <div style={{ marginBottom: '2rem' }}>
                            <h4 style={{ color: 'var(--color-primary)' }}>Student Coordinators</h4>
                            <p style={{ color: 'var(--color-text-muted)' }}>Sakthi Selva Kumar M : +91 9344766994</p>
                            <p style={{ color: 'var(--color-text-muted)' }}>Kavya S: +91 8667555796</p>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <h4 style={{ color: 'var(--color-primary)' }}>Queries Related to Payment and Registration</h4>
                            <p style={{ color: 'var(--color-text-muted)' }}>Madhan kumar R : +91 9363324409</p>
                            <p style={{ color: 'var(--color-text-muted)' }}>Kishore p : +91 8807052185</p>
                        </div>
                        <div style={{ marginBottom: '2rem' }}>
                            <h4 style={{ color: 'var(--color-primary)' }}>Queries Related to Technical Events</h4>
                            <p style={{ color: 'var(--color-text-muted)' }}>Mouneshwaran R : +91 9384724485</p>
                            <p style={{ color: 'var(--color-text-muted)' }}>Divya V : +91 9345706368 </p>
                        </div>
                        <div style={{ marginBottom: '2rem' }}>
                            <h4 style={{ color: 'var(--color-primary)' }}>For Other Queries</h4>
                            <p style={{ color: 'var(--color-text-muted)' }}>Balamurugan P : +91 8438110147</p>
                            <p style={{ color: 'var(--color-text-muted)' }}>Sivaramakrishnan B : +91 7305466589</p>
                        </div>
                        <div style={{ marginBottom: '2rem' }}>
                            <h4 style={{ color: 'var(--color-primary)' }}>Email</h4>
                            <p style={{ color: 'var(--color-text-muted)' }}>altranz2026@gmail.com</p>
                        </div>

                        <div>
                            <h4 style={{ color: 'var(--color-primary)' }}>Address</h4>
                            <p style={{ color: 'var(--color-text-muted)' }}>
                                Government College of Engineering, Bargur
                                NH-46, Chennai Bangalore Highway, Krishnagiri<br />

                            </p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div style={{
                        background: 'var(--color-bg-card)',
                        padding: '2rem',
                        border: '1px solid var(--color-border)'
                    }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Send us a message</h3>

                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--color-border)',
                                    color: '#fff',
                                    marginBottom: '1rem'
                                }}
                            />

                            <input
                                type="email"
                                name="email"
                                placeholder="Your Email"
                                value={formData.email}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--color-border)',
                                    color: '#fff',
                                    marginBottom: '1rem'
                                }}
                            />

                            <textarea
                                name="message"
                                placeholder="Message"
                                rows="5"
                                value={formData.message}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--color-border)',
                                    color: '#fff',
                                    marginBottom: '1rem'
                                }}
                            />

                            <button className="btn btn-secondary" type="submit">
                                Send Mail
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </PageWrapper>
    );
};

export default Contact;
