// src/pages/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import {
  Code, Shield, Zap, Lock,
  MessageSquare, BookOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [securityStats, setSecurityStats] = useState({
    vulnerabilitiesFixed: 12,
    simulationsCompleted: 3,
    securePatternsUsed: 27,
    riskLevel: 'Medium'
  });
  const [codeAnalysis, setCodeAnalysis] = useState(null);
  const [simulations, setSimulations] = useState([]);
  const [securityTips, setSecurityTips] = useState([]);
  const [activeTab, setActiveTab] = useState('codeAssistant');

  // Mock data - would come from APIs in a real implementation
  useEffect(() => {
    // Recent code analysis
    setCodeAnalysis({
      lastAnalyzed: "secure_login.py",
      issuesFound: 2,
      criticalIssues: 1,
      suggestions: [
        "Implement rate limiting on login attempts",
        "Upgrade to bcrypt for password hashing"
      ]
    });

    // Threat simulations
    setSimulations([
      {
        id: 1,
        title: "SQL Injection Attack",
        status: "completed",
        success: true,
        skills: ["Input Sanitization", "Parameterized Queries"]
      },
      {
        id: 2,
        title: "XSS Vulnerability",
        status: "in-progress",
        success: null,
        skills: ["Output Encoding", "CSP Implementation"]
      },
      {
        id: 3,
        title: "Session Hijacking",
        status: "not-started",
        success: null,
        skills: ["Secure Cookies", "Session Rotation"]
      }
    ]);

    // Security tips
    setSecurityTips([
      "Always validate and sanitize user inputs on both client and server sides",
      "Implement Content Security Policy (CSP) to prevent XSS attacks",
      "Use parameterized queries to prevent SQL injection",
      "Enable HTTPS with strict transport security headers",
      "Implement proper error handling without exposing stack traces"
    ]);
  }, []);

  // Get a random security tip
  const getRandomTip = () => {
    return securityTips[Math.floor(Math.random() * securityTips.length)];
  };

  return (
    <Dashboard>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user?.username ? `Welcome, ${user.username}` : 'Security Learning Dashboard'}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Develop secure coding skills through AI-powered simulations and analysis
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={() => navigate('/chat')}
                className="flex items-center px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium rounded-lg shadow hover:shadow-md transition-all"
              >
                <Zap className="mr-2 w-5 h-5" />
                AI Security Assistant
              </button>
            </div>
          </div>
        </div>

        {/* Security Resources Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-center mb-4">
              <BookOpen className="text-blue-600 mr-2" size={20} />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Explainability & Resources
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/explainability')}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
              >
                <div className="flex items-center mb-3">
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg">
                    <MessageSquare className="text-indigo-600 dark:text-indigo-400" size={20} />
                  </div>
                  <h3 className="ml-3 font-medium text-gray-900 dark:text-white">
                    AI Explainability
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Understand why the AI makes specific security recommendations
                </p>
              </button>

              <button
                onClick={() => navigate('/resources/owasp')}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
              >
                <div className="flex items-center mb-3">
                  <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg">
                    <Shield className="text-orange-600 dark:text-orange-400" size={20} />
                  </div>
                  <h3 className="ml-3 font-medium text-gray-900 dark:text-white">
                    OWASP Resources
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Access the latest OWASP standards and best practices
                </p>
              </button>

              <button
                onClick={() => navigate('/resources/nist')}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
              >
                <div className="flex items-center mb-3">
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                    <Lock className="text-green-600 dark:text-green-400" size={20} />
                  </div>
                  <h3 className="ml-3 font-medium text-gray-900 dark:text-white">
                    NIST Framework
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Learn about NIST cybersecurity standards and implementation
                </p>
              </button>

              <button
                onClick={() => navigate('/resources/secure-coding')}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
              >
                <div className="flex items-center mb-3">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                    <Code className="text-purple-600 dark:text-purple-400" size={20} />
                  </div>
                  <h3 className="ml-3 font-medium text-gray-900 dark:text-white">
                    Secure Coding Guides
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Language-specific secure coding patterns and examples
                </p>
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl shadow p-6">
            <div className="flex items-center mb-4">
              <div className="bg-white/20 p-2 rounded-lg">
                <Shield className="text-white" size={20} />
              </div>
              <h2 className="ml-3 text-xl font-bold text-white">Security Tip</h2>
            </div>

            <p className="text-indigo-100 mb-6">
              {getRandomTip()}
            </p>

            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg mb-6">
              <h3 className="font-medium text-white mb-2">Did You Know?</h3>
              <p className="text-indigo-200 text-sm">
                Our AI models are secured with Guardrails AI and Rebuff to prevent prompt injection attacks
              </p>
            </div>

            <button
              onClick={() => navigate('/resources')}
              className="w-full py-2.5 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
            >
              Explore Security Resources
            </button>
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default StudentDashboard;