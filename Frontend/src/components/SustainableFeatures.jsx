import React from 'react';
import { Sun, Moon, Wifi, WifiOff } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const SustainableFeatures = () => {
  const { darkMode, setDarkMode, lowBandwidth, setLowBandwidth } = useTheme();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Sustainable Learning Features</h2>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {darkMode ? (
              <Moon className="w-6 h-6 text-indigo-600" />
            ) : (
              <Sun className="w-6 h-6 text-yellow-500" />
            )}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Dark Mode</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Reduce eye strain and save energy
              </p>
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              darkMode ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                darkMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {lowBandwidth ? (
              <WifiOff className="w-6 h-6 text-indigo-600" />
            ) : (
              <Wifi className="w-6 h-6 text-green-500" />
            )}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Low Bandwidth Mode</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Optimize for slower internet connections
              </p>
            </div>
          </div>
          <button
            onClick={() => setLowBandwidth(!lowBandwidth)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              lowBandwidth ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                lowBandwidth ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Current Settings Impact</h4>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li className="flex items-center">
              <span className="w-4 h-4 mr-2 rounded-full bg-green-500"></span>
              {darkMode ? 'Reduced eye strain mode active' : 'Standard display mode'}
            </li>
            <li className="flex items-center">
              <span className="w-4 h-4 mr-2 rounded-full bg-blue-500"></span>
              {lowBandwidth ? 'Data-saving mode active' : 'Full-feature mode active'}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SustainableFeatures;