import React from 'react';
import { Link } from 'react-router-dom';
import Auth from '../components/Auth';
import { UserPlus } from 'lucide-react';

const Signup = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <UserPlus className="w-8 h-8 mr-2" />
              Create an Account
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Sign up to start your learning journey
            </p>
          </div>

          <Auth mode="signup" />

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;