// src/pages/LandingPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import {
  Zap,
  Ticket,
  Clock,
  MapPin,
  Wand2,
  ShieldCheck,
  LayoutDashboard,
  CheckCircle,
  Quote,
} from 'lucide-react';
import NavBar from '../layouts/NavBar';
import Footer from '../layouts/Footer';


// --- Reusable Helper Components (defined outside) ---

/**
 * Feature Card Component
 * We'll pass the color in to make it vibrant
 */
const FeatureCard = ({ icon: Icon, title, color, children }) => {
  const colorClasses = {
    amber: 'bg-amber-100 text-amber-600',
    rose: 'bg-rose-100 text-rose-600',
    lime: 'bg-lime-100 text-lime-600',
  };
  return (
    <motion.div
      className="rounded-lg bg-white p-6 shadow-lg"
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full ${
          colorClasses[color] || colorClasses.amber
        }`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-6 text-xl font-semibold text-stone-800">{title}</h3>
      <p className="mt-2 text-base text-stone-600">{children}</p>
    </motion.div>
  );
};

/**
 * Testimonial Card Component
 */
const TestimonialCard = ({ quote, name, role }) => (
  <div className="flex h-full flex-col justify-between rounded-lg bg-white p-6 shadow-lg">
    <div>
      <Quote className="h-8 w-8 text-rose-500" />
      <p className="mt-4 text-lg italic text-stone-700">"{quote}"</p>
    </div>
    <div className="mt-6">
      <p className="font-semibold text-stone-800">{name}</p>
      <p className="text-sm text-stone-500">{role}</p>
    </div>
  </div>
);

// --- Main Landing Page Component ---
const LandingPage = () => {
  // Animation variants for sections
  const sectionFadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        duration: 0.8,
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  // Fake telecom logos for the "Our Customers" section
  const logos = [
    { 
    name: 'Airtel', 
    src: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Airtel_logo.svg' 
  },
  { 
    name: 'Jio', 
    src: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Jio_logo.svg' 
  },
  { 
    name: 'Vi', 
    src: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Vi_Logo.svg' 
  },
  { 
    name: 'AT&T', 
    src: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/At%26t_logo_2016.svg' 
  },
  { 
    name: 'Verizon', 
    src: 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Verizon_2020_logo.svg' 
  },
  { 
    name: 'BT (British Telecom)', 
    src: 'https://upload.wikimedia.org/wikipedia/commons/5/53/BT_logo_2019.svg' 
  },
  { 
    name: 'T-Mobile', 
    src: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/T-Mobile_logo_2022.svg' 
  },
  { 
    name: 'Comcast Xfinity', 
    src: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Xfinity_logo.svg' 
  },
  { 
    name: 'Orange', 
    src: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Orange_logo.svg' 
  },
  { 
    name: 'ACT Fibernet', 
    src: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/ACT_Fibernet_logo.svg' 
  },
  ];

  return (
    <div>
    <NavBar/>
    <div className="w-full overflow-x-hidden bg-stone-50">
    
      {/* 1. Hero Section */}
      <motion.section
        className="flex min-h-[80vh] items-center py-24"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto max-w-5xl px-6 text-center">
          <motion.div variants={sectionFadeIn}>
            <Zap className="mx-auto h-20 w-20 text-amber-500" />
          </motion.div>
          <motion.h1
            className="mt-6 text-5xl font-bold tracking-tight text-stone-800 sm:text-7xl"
            variants={sectionFadeIn}
          >
            Stop the Run-Around.
            <br />
            <span className="text-black">Get LumaDesk.</span>
          </motion.h1>
          <motion.p
            className="mt-6 text-xl text-stone-600"
            variants={sectionFadeIn}
          >
            The all-in-one ticketing platform built for modern broadband. We turn
            customer chaos into clear, fast, and simple resolutions.
          </motion.p>
          <motion.div
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            variants={sectionFadeIn}
          >
            <Button asChild size="lg" variant="primary">
              <Link to="/register">Get Started Free</Link>
            </Button>
            <Button asChild size="lg" variant="accent">
              <Link to="/#">Book a Demo</Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* 2. Our Customers (Logo Cloud) */}
      <motion.section
        className="bg-stone-100 py-20"
        variants={sectionFadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container mx-auto max-w-5xl px-6">
          <h3 className="text-center text-base font-semibold uppercase text-stone-500">
            Trusted by the networks that connect you
          </h3>
          <div className="mt-8 grid grid-cols-2 place-items-center gap-8 text-stone-500 sm:grid-cols-4 lg:grid-cols-8">
            {/* --- THIS IS THE UPDATED RENDER LOGIC --- */}
            {logos.map((logo) => (
              <div key={logo.name} className="flex h-12 justify-center">
                <motion.img
                  className="h-full w-auto"
                  src={logo.src}
                  alt={logo.name}
                  whileHover={{ scale: 1.1 }}
                />
              </div>
            ))}
            {/* --- END UPDATED LOGIC --- */}
          </div>
        </div>
      </motion.section>

      {/* 3. Features Section */}
      <motion.section
        className="bg-white py-24"
        variants={sectionFadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-stone-800">
              Clarity. Control. Crazy-Fast Resolution.
            </h2>
            <p className="mt-4 text-lg text-stone-600">
              LumaDesk is more than a ticketing system. It's your command center.
            </p>
          </div>

          <motion.div
            className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <FeatureCard
              icon={Wand2}
              title="AI-Powered Triage"
              color="amber"
            >
              Our smart AI reads, categorizes, and routes new tickets in
              milliseconds. Simple issue? It suggests a fix. Complex? It finds
              the right engineer.
            </FeatureCard>
            <FeatureCard icon={Ticket} title="Unified Customer View" color="rose">
              No more "let me transfer you." Any agent sees the full history.
              Every ticket, every chat, every past issue, all in one clean view.
            </FeatureCard>
            <FeatureCard
              icon={Clock}
              title="Real-Time SLA Tracking"
              color="lime"
            >
              Stop guessing. Visible SLA timers on every ticket keep agents and
              managers accountable. Get alerted *before* a breach happens.
            </FeatureCard>
            <FeatureCard
              icon={MapPin}
              title="Field Engineer Dispatch"
              color="rose"
            >
              Link tickets to your field team. Customers get live technician
              tracking links, and you get proof of work.
            </FeatureCard>
            <FeatureCard
              icon={LayoutDashboard}
              title="Role-Based Dashboards"
              color="lime"
            >
              CXOs see network health. Managers see team performance. Agents see
              their queue. Everyone gets the data they need, and nothing they
            </FeatureCard>
            <FeatureCard
              icon={ShieldCheck}
              title="Customer Self-Service"
              color="amber"
            >
              A beautiful, simple portal for customers to create tickets, check
              status, and find answers in your knowledge base.
            </FeatureCard>
          </motion.div>
        </div>
      </motion.section>

      {/* 4. Why Choose Us Section */}
      <motion.section
        className="bg-stone-50 py-24"
        variants={sectionFadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 lg:grid-cols-2">
          <div>
            <h2 className="text-4xl font-bold text-stone-800">
              Designed for Support Agents.
              <br />
              <span className="text-lime-500">Loved by Customers.</span>
            </h2>
            <p className="mt-6 text-lg text-stone-600">
              We built LumaDesk by shadowing NOC engineers and support agents. We
              cut the 5-click tasks down to 1 click. We automated the repetitive
              junk. The result?
            </p>
            <ul className="mt-8 space-y-4">
              <li className="flex items-start">
                <CheckCircle className="mr-3 h-6 w-6 flex-shrink-0 text-lime-400" />
                <span className="text-lg text-stone-700">
                  <strong>Reduce repetitive ticket volume by 30%</strong> with
                  our AI and self-service portals.
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-3 h-6 w-6 flex-shrink-0 text-lime-400" />
                <span className="text-lg text-stone-700">
                  <strong>Improve First-Call Resolution</strong> by giving
                  agents the *right* info, instantly.
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-3 h-6 w-6 flex-shrink-0 text-lime-400" />
                <span className="text-lg text-stone-700">
                  <strong>Slash resolution time</strong> and watch your CSAT
                  scores climb.
                </span>
              </li>
            </ul>
          </div>
          <div className="flex items-center justify-center">
            {/* You could put a real image here */}
            
            <div className="rounded-lg bg-white p-8 shadow-2xl">
              <LayoutDashboard className="h-24 w-24 text-amber-500" />
              <h3 className="mt-4 text-2xl font-bold">A Better Dashboard.</h3>
              <p className="mt-2 text-stone-600">
                This is a placeholder, but imagine your beautiful, animated
                dashboard UI shown off right here.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 5. Testimonials Section */}
      <motion.section
        className="bg-white py-24"
        variants={sectionFadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-stone-800">
              Don't just take our word for it
            </h2>
            <p className="mt-4 text-lg text-stone-600">
              See what team leads and managers are saying.
            </p>
          </div>
          <motion.div
            className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <TestimonialCard
              quote="LumaDesk cut our resolution time in half. It's the first tool our support agents and customers actually agree on. The AI triage is not a gimmick—it actually works."
              name="Sarah Chen"
              role="Director of Operations, SkyNet"
            />
            <TestimonialCard
              quote="I can finally track my team's performance without pulling three different reports. The SLA dashboard is a game-changer for our weekly reviews."
              name="David Lee"
              role="Support Team Lead, TerraLink"
            />
            <TestimonialCard
              quote="Our field engineers love it. They get all the ticket info on their phone, and the customer gets a tracking link. It's simple, and it's brilliant."
              name="Maria Gonzalez"
              role="Field Services Manager, AstraCom"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* 6. Final CTA Section */}
      <motion.section
        className="bg-amber-500 py-24"
        variants={sectionFadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-4xl font-bold text-white">
            Get Back to Full Speed.
          </h2>
          <p className="mt-4 text-xl text-amber-100">
            Stop firefighting, start resolving. Create your LumaDesk account
            today and experience the future of broadband support.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="text-white hover:bg-amber-600"
            >
              <Link to="/register">Sign Up Now (It's Free)</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="text-white hover:bg-amber-600"
            >
              <Link to="/contact-sales">Talk to Sales</Link>
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
    <Footer/>
    </div>
  );
};

export default LandingPage;