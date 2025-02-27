
import React from 'react';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';

const Home: React.FC = () => {
  return (
    <Layout>
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <FAQ />
    </Layout>
  );
};

export default Home;
