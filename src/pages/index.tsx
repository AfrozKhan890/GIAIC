import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function Home() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={`${siteConfig.title} - Neural AI Textbook`}
      description="Advanced Physical AI & Humanoid Robotics textbook with neural network theme">
      
      {/* Neural Background */}
      <div className="neural-bg"></div>

      {/* Hero Section */}
      <div className="hero">
        <div className="container">
          <h1 className="hero__title">
            {siteConfig.title}
          </h1>
          <p className="hero__subtitle">
            {siteConfig.tagline}
          </p>
          
          <div className="hero-buttons">
            <Link
              className="button button--primary button--lg"
              to="/intro">
              🚀 Start Learning
            </Link>
            <Link
              className="button button--outline button--lg"
              to="/projects">
              ⚡ View Projects
            </Link>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            {[
              { number: '10', label: 'Chapters' },
              { number: '50+', label: 'Code Examples' },
              { number: '100+', label: 'Exercises' },
              { number: '∞', label: 'Possibilities' }
            ].map((stat, idx) => (
              <div key={idx} className="stat-item">
                <div className="stat-number">
                  {stat.number}
                </div>
                <div className="stat-label">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container main-content">
        
        {/* Featured Chapters - All 4 in one line */}
        <section className="featured-chapters">
          <h2 className="section-title">
            Featured Chapters
          </h2>
          
          <div className="featured-chapters-grid">
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
              <Link key={idx} to={chapter.link} className="chapter-link">
                <div className="chapter-card">
                  <div className="chapter-number">{chapter.number}</div>
                  <h3 className="chapter-title">{chapter.title}</h3>
                  <p className="chapter-description">
                    {chapter.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Start Guide */}
        <section className="neural-exercise quick-start">
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
        <section className="interactive-demo">
          <h2 className="section-title">🧪 Interactive Learning</h2>
          <div className="neural-diagram">
            <div className="demo-header">
              <h3>Live Neural Network Simulator</h3>
              <p>Visualize how neural networks control robotic movements</p>
            </div>
            
            <div className="demo-visualization">
              <div className="demo-node robot-node">
                🤖
              </div>
              
              <div className="demo-arrow">
                <div className="arrow-icon">➡️</div>
                <div className="arrow-label">Neural Processing</div>
              </div>
              
              <div className="demo-node brain-node">
                🧠
              </div>
            </div>
            
            <div className="demo-action">
              <Link to="/projects" className="button button--secondary">
                Launch Simulator →
              </Link>
            </div>
          </div>
        </section>

      </main>
    </Layout>
  );
}