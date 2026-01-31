import React, { useEffect } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function Home(){
  const { siteConfig } = useDocusaurusContext();

  // Neural network background effect
  useEffect(() => {
    const createNeuralNetwork = () => {
      const container = document.querySelector('.neural-connections');
      if (!container) return;

      // Clear existing
      container.innerHTML = '';

      // Create nodes
      for (let i = 0; i < 20; i++) {
        const node = document.createElement('div');
        node.className = 'neural-node';
        node.style.left = `${Math.random() * 100}%`;
        node.style.top = `${Math.random() * 100}%`;
        node.style.animationDelay = `${Math.random() * 2}s`;
        container.appendChild(node);
      }

      // Create connections
      for (let i = 0; i < 15; i++) {
        const connection = document.createElement('div');
        connection.className = 'neural-connection';
        connection.style.left = `${Math.random() * 100}%`;
        connection.style.top = `${Math.random() * 100}%`;
        connection.style.width = `${50 + Math.random() * 150}px`;
        connection.style.transform = `rotate(${Math.random() * 360}deg)`;
        connection.style.animationDelay = `${Math.random() * 3}s`;
        container.appendChild(connection);
      }
    };

    createNeuralNetwork();
    const interval = setInterval(createNeuralNetwork, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Layout
      title={`${siteConfig.title} - Neural AI Textbook`}
      description="Advanced Physical AI & Humanoid Robotics textbook with neural network theme">
      
      {/* Neural Network Background */}
      <div className="neural-bg">
        <div className="neural-grid"></div>
        <div className="neural-connections"></div>
      </div>

      {/* Hero Section */}
      <div className="hero">
        <div className="container">
          <h1 className="hero__title">
            {siteConfig.title}
          </h1>
          <p className="hero__subtitle">
            {siteConfig.tagline}
          </p>
          
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '3rem'
          }}>
            <Link
              className="button button--primary button--lg"
              to="/intro"
              style={{
                background: 'linear-gradient(135deg, var(--neural-primary), var(--neural-secondary))',
                border: 'none',
                borderRadius: '12px',
                padding: '1rem 2rem',
                fontWeight: '600'
              }}>
              🚀 Start Learning
            </Link>
            <Link
              className="button button--outline button--lg"
              to="/projects"
              style={{
                borderColor: 'var(--neural-primary)',
                color: 'var(--neural-primary)',
                borderRadius: '12px',
                padding: '1rem 2rem',
                fontWeight: '600'
              }}>
              ⚡ View Projects
            </Link>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '3rem',
            flexWrap: 'wrap',
            marginTop: '2rem'
          }}>
            {[
              { number: '10', label: 'Chapters' },
              { number: '50+', label: 'Code Examples' },
              { number: '100+', label: 'Exercises' },
              { number: '∞', label: 'Possibilities' }
            ].map((stat, idx) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, var(--neural-primary), var(--neural-accent))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '0.5rem'
                }}>
                  {stat.number}
                </div>
                <div style={{ color: 'var(--neural-text)', opacity: '0.8' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container" style={{ padding: '4rem 0', position: 'relative', zIndex: 1 }}>
        
        {/* Featured Chapters */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ 
            textAlign: 'center', 
            marginBottom: '3rem',
            fontSize: '2.5rem',
            background: 'linear-gradient(135deg, var(--neural-primary), var(--neural-accent))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Featured Chapters
          </h2>
          
          <div className="row">
            {[
              {
                number: '01',
                title: 'Introduction to Physical AI',
                description: 'Embodied intelligence, neural-symbolic integration, and the future of robotics.',
                link: '/intro'
              },
              {
                number: '04',
                title: 'Neural Motion Planning',
                description: 'Deep reinforcement learning for humanoid locomotion and manipulation.',
                link: '/chapter4'
              },
              {
                number: '07',
                title: 'Vision-Language-Action',
                description: 'Transformer models for multi-modal robot understanding and control.',
                link: '/chapter7'
              },
              {
                number: '10',
                title: 'Future Frontiers',
                description: 'Neuromorphic computing, quantum robotics, and AGI pathways.',
                link: '/chapter10'
              }
            ].map((chapter, idx) => (
              <div key={idx} className="col col--3">
                <Link to={chapter.link} style={{ textDecoration: 'none' }}>
                  <div className="chapter-card" style={{ height: '100%' }}>
                    <div className="chapter-number">{chapter.number}</div>
                    <h3 style={{ margin: '1rem 0' }}>{chapter.title}</h3>
                    <p style={{ color: 'var(--ifm-color-emphasis-700)' }}>
                      {chapter.description}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Start Guide */}
        <section className="neural-exercise" style={{ margin: '4rem 0' }}>
          <h3>⚡ Quick Start Guide</h3>
          <p>Begin your Physical AI journey in 4 steps:</p>
          <ol>
            <li>Set up Python environment with PyTorch and ROS 2</li>
            <li>Complete Chapter 1-3 fundamentals</li>
            <li>Build your first neural controller in simulation</li>
            <li>Deploy to hardware (real or simulated)</li>
          </ol>
          <Link to="/resources" className="button button--primary">
            Get Started with Resources →
          </Link>
        </section>

        {/* Interactive Demo Preview */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>🧪 Interactive Learning</h2>
          <div className="neural-diagram">
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h3>Live Neural Network Simulator</h3>
              <p>Visualize how neural networks control robotic movements</p>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center',
              alignItems: 'center',
              gap: '2rem',
              flexWrap: 'wrap'
            }}>
              <div style={{ 
                width: '200px', 
                height: '200px',
                background: 'rgba(99, 102, 241, 0.1)',
                border: '2px solid var(--neural-primary)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem'
              }}>
                🤖
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>➡️</div>
                <div style={{ color: 'var(--neural-accent)' }}>Neural Processing</div>
              </div>
              
              <div style={{ 
                width: '200px', 
                height: '200px',
                background: 'rgba(139, 92, 246, 0.1)',
                border: '2px solid var(--neural-secondary)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem'
              }}>
                🧠
              </div>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link to="/projects#simulator" className="button button--secondary">
                Launch Simulator →
              </Link>
            </div>
          </div>
        </section>

        {/* Hackathon Notice */}
        <section style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(6, 182, 212, 0.1))',
          padding: '2rem',
          borderRadius: '16px',
          textAlign: 'center',
          border: '1px solid var(--neural-primary)'
        }}>
          <h2 style={{ color: 'var(--neural-primary)' }}>🚀 Panaversity Hackathon 2025</h2>
          <p>This textbook is created as part of the Panaversity Hackathon. Features include:</p>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '2rem',
            flexWrap: 'wrap',
            margin: '2rem 0'
          }}>
            <div>🤖 RAG Chatbot</div>
            <div>🔐 User Authentication</div>
            <div>🎯 Personalized Content</div>
            <div>🌐 Urdu Translation</div>
            <div>🧠 Neural Network Theme</div>
          </div>
          <Link 
            to="https://forms.gle/CQsSEGM3GeCrL43c8" 
            className="button button--primary"
            style={{ marginRight: '1rem' }}>
            Submit Your Project
          </Link>
          <Link 
            to="https://us06web.zoom.us/j/84976847088" 
            className="button button--outline">
            Join Live Presentation
          </Link>
        </section>

      </main>

      {/* Scroll to Top Button */}
      <button 
        className="scroll-top-btn"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top">
        ↑
      </button>

      {/* Reading Progress Bar */}
      <div className="reading-progress">
        <div className="progress-bar" id="progressBar"></div>
      </div>

      {/* Progress Bar Script */}
      <script dangerouslySetInnerHTML={{
        __html: `
          window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            document.getElementById('progressBar').style.width = scrolled + '%';
          });
        `
      }} />
    </Layout>
  );
}