// src/pages/LandingPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('features');
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Thank you! We'll send updates to ${email}`);
        setEmail('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
            {/* Navigation */}
            <nav className="fixed w-full bg-white shadow-sm z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center">
                        <div className="flex items-center">
                            <div className="flex items-center">
                                <div className="bg-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white rounded-sm"></div>
                                </div>
                                <span className="ml-3 text-2xl font-bold text-indigo-800">CyberLearn</span>
                            </div>
                        </div>

                        <div className="hidden md:flex space-x-8">
                            <button
                                onClick={() => setActiveTab('features')}
                                className={`font-medium px-3 py-2 rounded-md ${activeTab === 'features' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-indigo-500'}`}
                            >
                                Features
                            </button>
                            <button
                                onClick={() => setActiveTab('how-it-works')}
                                className={`font-medium px-3 py-2 rounded-md ${activeTab === 'how-it-works' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-indigo-500'}`}
                            >
                                How It Works
                            </button>
                            <button
                                onClick={() => setActiveTab('resources')}
                                className={`font-medium px-3 py-2 rounded-md ${activeTab === 'resources' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-indigo-500'}`}
                            >
                                Resources
                            </button>
                            <button
                                onClick={() => setActiveTab('pricing')}
                                className={`font-medium px-3 py-2 rounded-md ${activeTab === 'pricing' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-indigo-500'}`}
                            >
                                Pricing
                            </button>
                        </div>

                        <div className="flex items-center">
                            <button onClick={() => navigate('/Login')} className="mr-4 text-indigo-600 font-medium hover:text-indigo-800">Sign In</button>
                            <button onClick={() => navigate('/Signup')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300 transform hover:-translate-y-1">
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center">
                        <div className="lg:w-1/2 lg:pr-12">
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                                Master Cybersecurity with <span className="text-indigo-600">AI-Powered</span> Learning
                            </h1>
                            <p className="text-xl text-gray-600 mb-8 max-w-xl">
                                Transform how you learn secure coding and cybersecurity concepts through interactive, intelligent training powered by Large Language Models.
                            </p>
                            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-lg shadow-lg transition duration-300 transform hover:-translate-y-1">
                                    Start Learning Free
                                </button>
                                <button className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-medium py-3 px-8 rounded-lg transition duration-300">
                                    View Demo
                                </button>
                            </div>
                        </div>

                        <div className="lg:w-1/2 mt-16 lg:mt-0">
                            <div className="relative">
                                <div className="absolute -top-8 -right-8 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                                <div className="absolute top-0 -left-8 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                                <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
                                    <div className="bg-gray-100 py-3 px-4 flex items-center">
                                        <div className="flex space-x-2">
                                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                        </div>
                                    </div>
                                    <div className="p-6 bg-gray-900">
                                        <div className="text-gray-400 font-mono text-sm">
                                            <div className="mb-2"><span className="text-purple-400">#</span> AI-powered secure code assistant</div>
                                            <div className="mb-2"><span className="text-purple-400">def</span> <span className="text-indigo-400">sanitize_input</span>(user_input):</div>
                                            <div className="mb-2 ml-4"><span className="text-purple-400">#</span> Prevent SQL injection attacks</div>
                                            <div className="mb-2 ml-4">sanitized = user_input.<span className="text-indigo-400">replace</span>(<span className="text-green-400">"'"</span>, <span className="text-green-400">"''"</span>)</div>
                                            <div className="mb-2 ml-4"><span className="text-purple-400">return</span> sanitized</div>
                                            <div className="mb-2">&nbsp;</div>
                                            <div className="mb-2"><span className="text-purple-400">#</span> AI explains security principles</div>
                                            <div><span className="text-indigo-400">print</span>(<span className="text-green-400">"OWASP Top 10: Injection Prevention"</span>)</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className={`py-20 px-4 ${activeTab === 'features' ? 'block' : 'hidden'}`}>
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Powerful Learning Tools</h2>
                        <p className="text-xl text-gray-600">
                            Our AI-powered platform combines cutting-edge technology with cybersecurity expertise
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                            <div className="w-16 h-16 rounded-xl bg-indigo-100 flex items-center justify-center mb-6">
                                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">AI Code Assistant</h3>
                            <p className="text-gray-600 mb-4">
                                Get real-time guidance on writing secure code, with explanations of vulnerabilities and best practices.
                            </p>
                            <button className="text-indigo-600 font-medium hover:text-indigo-800 flex items-center">
                                Learn more
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                            <div className="w-16 h-16 rounded-xl bg-indigo-100 flex items-center justify-center mb-6">
                                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Threat Simulations</h3>
                            <p className="text-gray-600 mb-4">
                                Experience realistic attack scenarios in a safe environment and learn how to defend against them.
                            </p>
                            <button className="text-indigo-600 font-medium hover:text-indigo-800 flex items-center">
                                Learn more
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                            <div className="w-16 h-16 rounded-xl bg-indigo-100 flex items-center justify-center mb-6">
                                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Assessments</h3>
                            <p className="text-gray-600 mb-4">
                                Benchmark your skills with AI-generated tests aligned with OWASP Top 10 and NIST standards.
                            </p>
                            <button className="text-indigo-600 font-medium hover:text-indigo-800 flex items-center">
                                Learn more
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                            <div className="w-16 h-16 rounded-xl bg-indigo-100 flex items-center justify-center mb-6">
                                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Explainability Module</h3>
                            <p className="text-gray-600 mb-4">
                                Understand why the AI makes security recommendations with clear references and rationale.
                            </p>
                            <button className="text-indigo-600 font-medium hover:text-indigo-800 flex items-center">
                                Learn more
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className={`py-20 px-4 bg-gray-50 ${activeTab === 'how-it-works' ? 'block' : 'hidden'}`}>
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How CyberLearn Works</h2>
                        <p className="text-xl text-gray-600">
                            Transform your cybersecurity skills in just a few steps
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Step 1 */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 relative overflow-hidden">
                            <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-100 rounded-full"></div>
                            <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                1
                            </div>
                            <div className="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Create Account</h3>
                            <p className="text-gray-600">
                                Sign up and set your learning goals based on your current skill level and interests.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 relative overflow-hidden">
                            <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-100 rounded-full"></div>
                            <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                2
                            </div>
                            <div className="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Interactive Learning</h3>
                            <p className="text-gray-600">
                                Engage with AI-guided lessons, coding challenges, and real-world simulations.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 relative overflow-hidden">
                            <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-100 rounded-full"></div>
                            <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                3
                            </div>
                            <div className="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Practice Securely</h3>
                            <p className="text-gray-600">
                                Apply concepts in our protected sandbox environment with AI monitoring.
                            </p>
                        </div>

                        {/* Step 4 */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 relative overflow-hidden">
                            <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-100 rounded-full"></div>
                            <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                4
                            </div>
                            <div className="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Track Progress</h3>
                            <p className="text-gray-600">
                                Receive personalized feedback and see your skills improve with our analytics dashboard.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Start Your Cybersecurity Journey Today</h2>
                    <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
                        Join thousands of developers and security professionals enhancing their skills with AI-powered education.
                    </p>

                    <form onSubmit={handleSubmit} className="max-w-xl mx-auto flex flex-col sm:flex-row gap-4">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="flex-grow px-6 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-white text-indigo-600 font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-indigo-50 transition duration-300"
                        >
                            Get Started
                        </button>
                    </form>

                    <div className="mt-10 flex flex-wrap justify-center gap-4">
                        <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white font-medium">OWASP Standards</div>
                        <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white font-medium">NIST Compliance</div>
                        <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white font-medium">Guardrails AI</div>
                        <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white font-medium">Garak Security</div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        <div>
                            <div className="flex items-center mb-6">
                                <div className="bg-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white rounded-sm"></div>
                                </div>
                                <span className="ml-3 text-2xl font-bold text-white">CyberLearn</span>
                            </div>
                            <p className="text-gray-400 mb-6 max-w-xs">
                                Transforming cybersecurity education through AI-powered learning experiences.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-white">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold mb-6">Platform</h3>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Integrations</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Roadmap</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Security</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold mb-6">Resources</h3>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Tutorials</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Security Standards</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Case Studies</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold mb-6">Company</h3>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Partners</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Legal</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-16 pt-8 border-t border-gray-800 text-gray-400 text-sm">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <p>© 2023 CyberLearn. All rights reserved.</p>
                            <div className="mt-4 md:mt-0 flex space-x-8">
                                <a href="#" className="hover:text-white">Privacy Policy</a>
                                <a href="#" className="hover:text-white">Terms of Service</a>
                                <a href="#" className="hover:text-white">Cookie Policy</a>
                            </div>
                        </div>
                        <p className="mt-4 text-center md:text-left">
                            Built with Guardrails AI, Garak, and Rebuff for secure LLM integration.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;