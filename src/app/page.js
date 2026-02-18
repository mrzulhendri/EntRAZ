'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/contents?limit=10&sort=newest');
        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();
        setLatest(data.contents || []);

        // Mock featured for now until we have real featured content logic
        if (data.contents && data.contents.length > 0) {
          setFeatured([data.contents[0]]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <main>
      {/* Navbar Implementation */}
      <nav className="raz-navbar">
        <div className="raz-nav-logo">EntRAZ</div>
        <div className="raz-nav-links">
          <Link href="/" className="raz-nav-link active">Home</Link>
          <Link href="/browse?type=movie" className="raz-nav-link">Movies</Link>
          <Link href="/browse?type=anime" className="raz-nav-link">Anime</Link>
          <Link href="/browse?type=comic" className="raz-nav-link">Comics</Link>
          <Link href="/browse?type=novel" className="raz-nav-link">Novels</Link>
        </div>
        <div className="raz-nav-actions">
          <Link href="/admin" className="raz-nav-link">Admin</Link> {/* Temp link for access */}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="raz-hero">
        <img src="https://image.tmdb.org/t/p/original/baP5M8KzJjF6z96Zg6hE1y6K4.jpg" alt="Hero Background" className="raz-hero-bg" />

        <div className="raz-hero-content">
          <h1 className="raz-hero-title">Solo Leveling</h1>
          <div className="raz-hero-meta">
            <span>2024</span>
            <span>•</span>
            <span>Anime, Action, Fantasy</span>
            <span>•</span>
            <span>⭐ 9.8</span>
          </div>
          <p className="raz-hero-desc">
            In a world where hunters, humans who possess magical abilities, must battle deadly monsters to protect the human race from certain annihilation, a notoriously weak hunter named Sung Jinwoo finds himself in a seemingly endless struggle for survival.
          </p>
          <div className="raz-hero-actions">
            <button className="raz-btn-hero raz-btn-play">▶ Play Now</button>
            <button className="raz-btn-hero raz-btn-info">ℹ More Info</button>
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <section className="raz-section">
        <div className="raz-section-header">
          <h2 className="raz-section-title">Latest Updates</h2>
          <Link href="/browse" className="raz-nav-link">View All</Link>
        </div>

        <div className="raz-grid">
          {loading ? (
            <p>Loading content...</p>
          ) : latest.length === 0 ? (
            <p>No content available yet.</p>
          ) : (
            latest.map(item => (
              <Link href={`/detail/${item.id}`} key={item.id} className="raz-card">
                <div className="raz-rating-badge">{item.rating || 'N/A'}</div>
                <img
                  src={item.cover_image || 'https://via.placeholder.com/200x300'}
                  alt={item.title}
                  className="raz-card-img"
                />
                <div className="raz-card-overlay">
                  <div className="raz-card-title">{item.title}</div>
                  <div className="raz-card-meta">
                    {item.type} • {item.status}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
