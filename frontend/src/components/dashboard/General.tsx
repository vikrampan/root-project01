import React, { useState, useEffect } from 'react';
import { Settings2, PlayCircle, FolderOpen, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const General = () => {
  // State management with TypeScript types
  const [projectFolder, setProjectFolder] = useState<string>('C:/Users/admin/Documents');
  const [projectName, setProjectName] = useState<string>('draft');
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [tableFormat, setTableFormat] = useState<string>('Static Row Cell');
  const [reportFileName, setReportFileName] = useState<string>('Report.mob');
  const [reportLocation, setReportLocation] = useState<string>('/reports/2024/');
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Handler functions with TypeScript return types
  const handleFolderSelect = (): void => {
    const newFolder = prompt('Enter folder path:', projectFolder);
    if (newFolder) {
      setProjectFolder(newFolder);
      showNotification('Project folder updated successfully');
    }
  };

  const handleNewProject = (): void => {
    setProjectName('new_project');
    setReportFileName('New_Report.mob');
    showNotification('New project created');
  };

  const handleOpenProject = (): void => {
    const fileName = prompt('Enter project file name:');
    if (fileName) {
      setProjectName(fileName.replace('.saved', ''));
      showNotification('Project opened successfully');
    }
  };

  const showNotification = (message: string): void => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleConnection = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsConnected(!isConnected);
      showNotification(isConnected ? 'Disconnected from Magnifi' : 'Connected to Magnifi');
    } catch (error) {
      showNotification('Connection error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      showNotification('Connection test successful');
    } catch (error) {
      showNotification('Connection test failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="grid grid-cols-1 gap-6 p-8 max-w-7xl mx-auto">
        {/* Alert Component */}
        {showAlert && (
          <Alert className="fixed top-4 right-4 z-50 max-w-md bg-zinc-900 border border-zinc-800 shadow-2xl">
            <AlertDescription className="text-zinc-200">{alertMessage}</AlertDescription>
            <button 
              onClick={() => setShowAlert(false)}
              className="absolute top-2 right-2 text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </Alert>
        )}

        {/* Project Section */}
        <div className="bg-zinc-900 p-8 rounded-xl shadow-2xl border border-zinc-800 transition-all duration-300">
          <h3 className="text-2xl font-semibold text-white mb-8">Project Settings</h3>
          
          {/* Project Folder */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Project Folder:
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={projectFolder}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProjectFolder(e.target.value)}
                className="flex-1 bg-black border border-zinc-800 rounded-lg px-4 py-3 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder-zinc-600"
              />
              <button 
                onClick={handleFolderSelect}
                className="inline-flex items-center px-4 py-3 bg-zinc-800 text-zinc-200 rounded-lg hover:bg-zinc-700 transition-all duration-300"
              >
                <FolderOpen className="w-5 h-5 mr-2" />
                Browse
              </button>
            </div>
          </div>

          {/* Project File */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Project File:
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProjectName(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                  <span className="text-zinc-500">.saved</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleNewProject}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  New Project
                </button>
                <button
                  onClick={handleOpenProject}
                  className="px-6 py-3 bg-zinc-800 text-zinc-200 rounded-lg font-medium hover:bg-zinc-700 transition-all duration-300"
                >
                  Open
                </button>
              </div>
            </div>
          </div>

          {/* Connection Settings */}
          <div className="mt-12 border-t border-zinc-800 pt-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
              <h3 className="text-2xl font-semibold text-white">Magnifi Connection</h3>
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <span className="text-sm text-zinc-400">Status:</span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  isConnected 
                    ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800' 
                    : 'bg-red-900/30 text-red-400 border border-red-800'
                } transition-colors duration-300`}>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Table Format:
                </label>
                <select
                  value={tableFormat}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTableFormat(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                >
                  <option>Static Row Cell</option>
                  <option>Dynamic Row Cell</option>
                  <option>Custom Format</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Report File:
                </label>
                <input
                  type="text"
                  value={reportFileName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReportFileName(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Report Location:
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={reportLocation}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReportLocation(e.target.value)}
                    className="flex-1 bg-black border border-zinc-800 rounded-lg px-4 py-3 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                  <button 
                    onClick={() => {
                      const newLocation = prompt('Enter report location:', reportLocation);
                      if (newLocation) setReportLocation(newLocation);
                    }}
                    className="p-3 bg-zinc-800 text-zinc-200 rounded-lg hover:bg-zinc-700 transition-all duration-300"
                  >
                    <Settings2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={handleConnection}
                disabled={isLoading}
                className={`w-full sm:w-auto px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl ${
                  isConnected
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <PlayCircle className="w-5 h-5" />
                <span>{isConnected ? 'Disconnect' : 'Connect'}</span>
              </button>
              <button
                onClick={handleTestConnection}
                disabled={isLoading}
                className={`w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Test Connection
              </button>
            </div>

            <div className="mt-8 bg-zinc-950 rounded-lg border border-zinc-800">
              <p className="p-4 text-sm text-zinc-400">
                Note: This connection enables automatic synchronization between TubePro and Magnifi, allowing seamless transfer of tubelists and monitoring of report file changes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default General;