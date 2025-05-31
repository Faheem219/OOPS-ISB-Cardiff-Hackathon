import Dashboard from '../components/Dashboard';
import Chatbot from '../components/Chatbot';

const ChatPage = () => {
  return (
    <Dashboard>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          AI Cybersecurity Tutor
        </h1>
        <Chatbot />
      </div>
    </Dashboard>
  );
};

export default ChatPage;