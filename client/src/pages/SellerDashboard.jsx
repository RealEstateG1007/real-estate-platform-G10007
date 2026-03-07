import { useState, useEffect } from 'react';
import { Building2, Eye, Plus, LayoutGrid } from 'lucide-react';
import '../index.css';
import { Link, useNavigate } from 'react-router-dom';

function SellerDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalListings: 0,
        totalViews: 0,
        properties: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const token = user?.token;

                // Note: In real app, we need to pass token in headers
                // Since we are using fetch, we need to add Authorization header
                // API endpoint: /api/properties/user/stats

                // IMPORTANT: In properties.js we added /user/stats but standard restful might be /api/properties/user/stats 
                // depending on how index.js mounts it. 
                // Assuming index.js mounts properties routes at /api/properties

                const res = await fetch('/api/properties/user/stats', {
                    headers: {
                        'token': `Bearer ${token}` // verifyToken middleware usually expects 'token' header or Authorization
                    }
                });

                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (err) {
                console.error("Failed to fetch seller stats", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="container" style={{ paddingTop: '100px', textAlign: 'center' }}>Loading Dashboard...</div>;

    return (
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
            <div className="section-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2>Seller Dashboard</h2>
                    <p>Overview of your listings and performance.</p>
                </div>
                <Link to="/add">
                    <button className="cta-button" style={{ fontSize: '0.9rem', padding: '0.6rem 1.2rem' }}>
                        <Plus size={18} /> List New Property
                    </button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem',
                marginBottom: '3rem'
            }}>
                <div className="stat-card" style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                        <span>Total Listings</span>
                        <LayoutGrid size={20} style={{ color: 'var(--accent)' }} />
                    </div>
                    <h3 style={{ fontSize: '2rem', margin: 0, color: 'var(--text-primary)' }}>{stats.totalListings}</h3>
                </div>

                <div className="stat-card" style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                        <span>Total Views</span>
                        <Eye size={20} style={{ color: 'var(--accent)' }} />
                    </div>
                    <h3 style={{ fontSize: '2rem', margin: 0, color: 'var(--text-primary)' }}>{stats.totalViews}</h3>
                </div>
            </div>

            <style>{`
                .listing-row {
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                }
                .listing-row:hover {
                    background-color: rgba(255, 255, 255, 0.03);
                }
            `}</style>

            {/* Listings Table */}
            <div className="listings-section">
                <h3 style={{ marginBottom: '1.5rem' }}>My Listings</h3>

                <div className="table-container" style={{ overflowX: 'auto', background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Property</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Price</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Location</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Views</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Date Posted</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.properties.length > 0 ? (
                                stats.properties.map(property => (
                                    <tr
                                        key={property._id}
                                        className="listing-row"
                                        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                                        onClick={() => navigate(`/property/${property._id}`)}
                                    >
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ width: '50px', height: '50px', borderRadius: '6px', overflow: 'hidden', background: '#333' }}>
                                                    {property.image && <img src={property.image.startsWith('http') ? property.image : `http://localhost:5000/uploads/${property.image}`} alt={property.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                                </div>
                                                <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{property.title}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>${property.price.toLocaleString()}</td>
                                        <td style={{ padding: '1rem' }}>{property.location}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Eye size={16} style={{ color: 'var(--text-secondary)' }} />
                                                {property.views || 0}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                                            {new Date(property.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                        You haven't listed any properties yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default SellerDashboard;
