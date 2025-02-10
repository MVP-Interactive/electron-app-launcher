import React, { useState, useEffect } from 'react';
import { executableLauncher } from './utils/executableLauncher';
import { motion } from 'framer-motion';

interface AppState {
  selectedApp: string;
  output: string;
  error: string;
  isLoading: boolean;
  availableApps: string[];
}

const AppLauncher: React.FC = () => {
  const [state, setState] = useState<AppState>({
    selectedApp: '',
    output: '',
    error: '',
    isLoading: false,
    availableApps: []
  });

  useEffect(() => {
    const apps = executableLauncher.getAvailableExecutables();
    setState(prev => ({ ...prev, availableApps: apps }));
  }, []);

  const handleLaunch = async (app: string) => {
    if (!app) {
      setState(prev => ({ ...prev, error: 'Please select an application' }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: '', output: '' }));

    try {
      const result = await executableLauncher.launchExecutable(app);
      setState(prev => ({
        ...prev,
        output: result.stdout,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        isLoading: false
      }));
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-center text-white mb-8 select-none">App Launcher</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 min-h-[100px]">
        {state.availableApps.map((app) => (
          <motion.div
            key={app}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setState(prev => ({ ...prev, selectedApp: app }));
              handleLaunch(app);
            }}
            className={`rounded-lg p-4 cursor-pointer transition-shadow duration-300 ease-in-out hover:shadow-lg 
              ${state.selectedApp === app && state.isLoading ? 'bg-gray-600' : 'bg-gray-700'}`}
          >
            <div className="flex flex-col items-center justify-center h-full">
              <span className="text-white text-sm font-medium select-none mb-2">{app}</span>
              {state.selectedApp === app && state.isLoading && (
                <span className="text-white text-xs">Launching...</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {state.error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          {state.error}
        </div>
      )}

      {state.output && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h2 className="font-bold mb-2">Output:</h2>
          <pre className="whitespace-pre-wrap">{state.output}</pre>
        </div>
      )}

      {state.selectedApp && state.isLoading && (
        <div className="mt-8 text-center text-white text-lg font-semibold">
          Launching: {state.selectedApp}
        </div>
      )}
    </div>
  );
};

export default AppLauncher;