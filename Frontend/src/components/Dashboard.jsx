import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Wifi, WifiOff, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useAPI';

const Dashboard = ({ children }) => {
  const { user, logout } = useAuth();
  const { darkMode, setDarkMode, lowBandwidth, setLowBandwidth, darkModeHours, lowBandwidthHours } = useTheme();
  const navigate = useNavigate();
  const { fetchData } = useApi();

  const handleLogout = async () => {
    try {
      // Update sustainable usage metrics on backend before logging out
      await fetchData('http://127.0.0.1:8000/api/sustainable/update', {
        method: 'POST',
        body: JSON.stringify({
          user_id: user.id,
          dark_mode_hours: darkModeHours,
          low_bandwidth_hours: lowBandwidthHours,
        }),
      });
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <nav className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                  EdTech Platform
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setLowBandwidth(!lowBandwidth)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {lowBandwidth ? <WifiOff className="w-5 h-5" /> : <Wifi className="w-5 h-5" />}
              </button>
              <div className="flex items-center space-x-2">
                <span className="text-gray-700 dark:text-gray-300">
                  {user?.username || 'User'} ({user?.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Dashboard;