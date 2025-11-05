// src/components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Twitter, Linkedin, Github } from 'lucide-react';

const Footer = () => {
    const socialLinks = [
        { icon: Twitter, href: '#', name: 'Twitter' },
        { icon: Linkedin, href: '#', name: 'LinkedIn' },
        { icon: Github, href: '#', name: 'GitHub' },
    ];

    const QuickLink = ({ href, children }) => (
        <li>
            <Link
                to={href}
                className="text-stone-400 hover:text-stone-200 hover:underline"
            >
                {children}
            </Link>
        </li>
    );

    return (
        <footer className="bg-stone-800 text-stone-300">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                {/* Top section: Logo and Social */}
                <div className="flex flex-col items-center justify-between space-y-2 md:flex-row">
                    <div className="bg-white rounded-2xl shadow-md p-4 inline-block text-center">
                        <img
                            src="/assets/lumadesk-logo.png"
                            alt="LumaDesk Logo"
                            className="mx-auto mb-4 h-14 w-auto"
                        />
                    </div>
                    <div className="flex space-x-6">
                        {socialLinks.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="text-stone-400 hover:text-white"
                            >
                                <span className="sr-only">{item.name}</span>
                                <item.icon className="h-6 w-6" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Middle section: Link columns */}
                <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                            Platform
                        </h3>
                        <ul className="mt-4 space-y-4">
                            <QuickLink href="/#">Features</QuickLink>
                            <QuickLink href="/#">SLA Management</QuickLink>
                            <QuickLink href="/#">AI Triage</QuickLink>
                            <QuickLink href="/#">Integrations</QuickLink>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                            Support
                        </h3>
                        <ul className="mt-4 space-y-4">
                            <QuickLink href="/#">Contact Support</QuickLink>
                            <QuickLink href="/#">Knowledge Base</QuickLink>
                            <QuickLink href="/#">FAQ</QuickLink>
                            <QuickLink href="/#">System Status</QuickLink>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                            Company
                        </h3>
                        <ul className="mt-4 space-y-4">
                            <QuickLink href="/#">About Us</QuickLink>
                            <QuickLink href="/#">Careers</QuickLink>
                            <QuickLink href="/#">Blog</QuickLink>
                            <QuickLink href="/#">Contact Sales</QuickLink>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                            Legal
                        </h3>
                        <ul className="mt-4 space-y-4">
                            <QuickLink href="/#">Privacy Policy</QuickLink>
                            <QuickLink href="/#">Terms of Service</QuickLink>
                            <QuickLink href="/#">Acceptable Use</QuickLink>
                        </ul>
                    </div>
                </div>

                {/* Bottom section: Copyright */}
                <div className="mt-12 border-t border-stone-700 pt-8">
                    <p className="text-base text-stone-400 xl:text-center">
                        &copy; {new Date().getFullYear()} LumaDesk Inc. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;