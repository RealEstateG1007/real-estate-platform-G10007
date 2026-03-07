import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Star, ArrowRight, Quote, User } from 'lucide-react';
import { motion } from 'framer-motion';
import TiltCard from '../components/TiltCard';
import TypingText from '../components/TypingText';
import PropertyCard from '../components/PropertyCard.jsx';


import Toast from '../components/Toast';

function Home({ openAuth, user }) {
    const [featuredProperties, setFeaturedProperties] = useState([]);
    const [toast, setToast] = useState(null); // { message, type }

    useEffect(() => {
        fetch('/api/properties')
            .then(res => res.json())
            .then(data => {
                // Get top 3 properties (e.g., most expensive or just first 3)
                const sorted = [...data].sort((a, b) => b.price - a.price).slice(0, 3);
                setFeaturedProperties(sorted);
            })
            .catch(err => console.error("Failed to fetch properties:", err));
    }, []);

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div style={{ overflowX: 'hidden' }}>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Hero Section */}
            <header className="hero-section" style={{ position: 'relative', overflow: 'hidden' }}>
                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <motion.h1
                        className="hero-title"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        Find Your <span style={{ color: 'var(--accent)' }}><TypingText text="Dream Space" delay={0.5} /></span>
                    </motion.h1>
                    <motion.p
                        className="hero-subtitle"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Premium properties curated for the modern lifestyle. Discover exclusive listings in prime locations.
                    </motion.p>

                    <motion.div
                        className="stats-row"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <div className="stat">
                            <span className="stat-number">1k+</span>
                            <span className="stat-label">Premium Listings</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat">
                            <span className="stat-number">50+</span>
                            <span className="stat-label">Major Cities</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat">
                            <span className="stat-number">24/7</span>
                            <span className="stat-label">Support</span>
                        </div>
                    </motion.div>

                    <Link to="/properties">
                        <motion.button
                            className="cta-button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            Explore Properties <ArrowRight size={20} />
                        </motion.button>
                    </Link>
                </div>
            </header>

            {/* Featured Listings Section */}
            {featuredProperties.length > 0 && (
                <section className="container" style={{ padding: '6rem 2rem' }}>
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2>Featured Listings</h2>
                        <p>Explore our most exclusive properties.</p>
                    </motion.div>

                    <motion.div
                        className="grid"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, amount: 0.1 }}
                        style={{ margin: '0 0 2rem 0' }}
                    >
                        {featuredProperties.map(property => (
                            <motion.div key={property._id} variants={fadeInUp}>
                                <PropertyCard property={property} />
                            </motion.div>
                        ))}
                    </motion.div>

                    <div style={{ textAlign: 'center' }}>
                        <Link to="/properties">
                            <button style={{
                                background: 'transparent',
                                border: '1px solid var(--border)',
                                fontSize: '0.9rem',
                                color: 'var(--text-primary)',
                                padding: '0.8rem 2rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                                onMouseOver={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.color = 'var(--accent)'; }}
                                onMouseOut={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-primary)'; }}
                            >
                                View All Listings
                            </button>
                        </Link>
                    </div>
                </section>
            )}

            {/* Features Section */}
            <section className="features-section container">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2>Why Choose Us</h2>
                    <p>We redefine the real estate experience with trust and speed.</p>
                </motion.div>

                <motion.div
                    className="features-grid"
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {[
                        { icon: <Shield size={32} />, title: "Trusted Platform", desc: "Verified listings and secure transactions." },
                        { icon: <Zap size={32} />, title: "Fast Process", desc: "Streamlined viewing and purchasing process." },
                        { icon: <Star size={32} />, title: "Premium Quality", desc: "Hand-picked properties meeting high standards." }
                    ].map((feature, index) => (
                        <motion.div key={index} variants={fadeInUp}>
                            <TiltCard className="feature-card">
                                <h3>{feature.title}</h3>
                                <p>{feature.desc}</p>
                            </TiltCard>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Testimonials Section */}
            <section style={{ background: '#000', padding: '6rem 2rem' }}>
                <div className="container">
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2>Succcess Stories</h2>
                        <p>What our clients say about their experience.</p>
                    </motion.div>

                    <motion.div
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, amount: 0.1 }}
                    >
                        {[
                            { name: "Sarah Jenkins", role: "Home Buyer", quote: "Found my dream apartment in less than a week. The sorting features are a lifesaver!" },
                            { name: "Michael Ross", role: "Property Investor", quote: "The most professional platform for high-end listings. Sold my villa within days." },
                            { name: "Elena Rodriguez", role: "First-time Buyer", quote: "Incredible support team and a very smooth process from start to finish." }
                        ].map((testimonial, index) => (
                            <motion.div key={index} variants={fadeInUp}>
                                <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)', position: 'relative' }}>
                                    <Quote size={40} color="var(--accent)" style={{ opacity: 0.2, position: 'absolute', top: '20px', right: '20px' }} />
                                    <p style={{ fontStyle: 'italic', marginBottom: '1.5rem', lineHeight: '1.6' }}>"{testimonial.quote}"</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ fontWeight: 'bold', color: 'var(--accent)' }}>{testimonial.name[0]}</span>
                                        </div>
                                        <div>
                                            <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{testimonial.name}</h4>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{testimonial.role}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>


            {/* CTA Section - Hidden for Buyers */}
            {(!user || user.role !== 'buyer') && (
                <section className="cta-section">
                    <motion.div
                        className="container"
                        style={{ textAlign: 'center' }}
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2>Ready to Sell?</h2>
                        <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>List your property with us and reach thousands of potential buyers today.</p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                if (!user) {
                                    openAuth('register', 'seller');
                                } else if (user.role !== 'seller') {
                                    setToast({ message: "You must be registered as a Seller to list properties.", type: "error" });
                                } else {
                                    window.location.href = '/add';
                                }
                            }}
                            style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}
                        >
                            List Your Property
                        </motion.button>
                    </motion.div>
                </section>
            )}
        </div>
    );
}

export default Home;
