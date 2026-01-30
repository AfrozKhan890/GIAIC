import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import type {ReactNode} from 'react';

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  
  return (
    <Layout
      title={`${siteConfig.title} - Textbook`}
      description="Complete textbook for learning Physical AI and Humanoid Robotics">
      
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '4rem 0',
        textAlign: 'center' as const
      }}>
        <div className="container">
          <h1 style={{
            fontSize: '3rem',
            color: 'white',
            marginBottom: '1rem',
            fontWeight: 'bold'
          }}>
            {siteConfig.title}
          </h1>
          
          <p style={{
            fontSize: '1.5rem',
            color: 'rgba(255, 255, 255, 0.9)',
            maxWidth: '800px',
            margin: '0 auto 2rem'
          }}>
            {siteConfig.tagline}
          </p>
          
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap' as const
          }}>
            <Link
              className="button button--primary button--lg"
              to="/chapter1">
              Start Reading Chapter 1 →
            </Link>
            
            <Link
              className="button button--secondary button--lg"
              href="https://github.com/panaversity/spec-kit-plus">
              GitHub Repository
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container" style={{padding: '3rem 0'}}>
        <div className="row">
          <div className="col col--8 col--offset-2">
            
            <h2>About This Textbook</h2>
            <p>
              This textbook provides comprehensive coverage of Physical AI and Humanoid Robotics, 
              designed for students, researchers, and professionals interested in embodied intelligence.
            </p>
            
            <h2>Course Modules</h2>
            
            {/* Module Cards */}
            {[
              {
                title: 'Module 1: The Robotic Nervous System (ROS 2)',
                description: 'Middleware for robot control, ROS 2 nodes, topics, services, and URDF for humanoids.'
              },
              {
                title: 'Module 2: The Digital Twin (Gazebo & Unity)',
                description: 'Physics simulation, environment building, and sensor simulation (LiDAR, cameras, IMUs).'
              },
              {
                title: 'Module 3: The AI-Robot Brain (NVIDIA Isaac™)',
                description: 'Advanced perception, photorealistic simulation, and hardware-accelerated VSLAM.'
              },
              {
                title: 'Module 4: Vision-Language-Action (VLA)',
                description: 'Convergence of LLMs and robotics, voice commands, and cognitive planning.'
              }
            ].map((module, index) => (
              <div 
                key={index}
                style={{
                  border: '1px solid var(--ifm-color-emphasis-200)',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  marginBottom: '1.5rem',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <h3 style={{
                  color: 'var(--ifm-color-primary)',
                  marginBottom: '0.5rem'
                }}>
                  {module.title}
                </h3>
                <p>{module.description}</p>
              </div>
            ))}
            
            <h2>Hardware Requirements</h2>
            <p>This course requires specialized hardware. Minimum requirements include:</p>
            <ul>
              <li>NVIDIA RTX GPU (4070 Ti or higher recommended)</li>
              <li>64GB RAM minimum</li>
              <li>Ubuntu 22.04 LTS</li>
              <li>NVIDIA Jetson Orin for edge computing</li>
            </ul>
            
            {/* Hackathon Note */}
            <div style={{
              background: '#e3f2fd',
              borderLeft: '4px solid #2196f3',
              padding: '1rem',
              margin: '1rem 0',
              borderRadius: '0 4px 4px 0'
            }}>
              <h4 style={{
                color: '#1565c0',
                marginTop: '0'
              }}>
                Hackathon Note
              </h4>
              <p>
                This textbook is created as part of the Panaversity Hackathon. 
                The project includes a RAG chatbot, user authentication, content personalization, 
                and Urdu translation features.
              </p>
            </div>
            
          </div>
        </div>
      </main>
    </Layout>
  );
}