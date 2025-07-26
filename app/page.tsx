'use client';

import { useState, useEffect } from 'react';
import { Shield, Database, Activity } from 'lucide-react';
import PlateInput from '@/components/PlateInput';
import VehicleInfo from '@/components/VehicleInfo';
import AddVehicleForm from '@/components/AddVehicleForm';
import RecentVehicles from '@/components/RecentVehicles';

interface Vehicle {
  _id: string;
  plateNumber: string;
  ownerName: string;
  vehicleType: 'truck' | 'car' | 'motorcycle' | 'van';
  entryTime: string;
  remarks: string;
  createdAt: string;
}

export default function Home() {
  const [currentPlate, setCurrentPlate] = useState('');
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handlePlateSubmit = async (plate: string) => {
    setCurrentPlate(plate);
    setVehicle(null);
    setShowAddForm(false);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/check-plate?plate=${encodeURIComponent(plate)}`);
      const data = await response.json();

      if (data.exists) {
        setVehicle(data.vehicle);
      } else {
        setShowAddForm(true);
      }
    } catch (error) {
      console.error('Error checking plate:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVehicleAdded = (newVehicle: Vehicle) => {
    setVehicle(newVehicle);
    setShowAddForm(false);
  };

  const resetView = () => {
    setCurrentPlate('');
    setVehicle(null);
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">CCTV ANPR System</h1>
                <p className="text-gray-400 text-sm">Automatic Number Plate Recognition</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-green-400" />
                <span className="text-sm text-gray-300">MongoDB Connected</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Activity className={`h-4 w-4 ${isOnline ? 'text-green-400' : 'text-red-400'}`} />
                <span className="text-sm text-gray-300">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Input and Results */}
          <div className="lg:col-span-2 space-y-6">
            <PlateInput onPlateSubmit={handlePlateSubmit} isLoading={isLoading} />
            
            {isLoading && (
              <div className="bg-gray-800 p-8 rounded-lg text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                <p className="text-gray-300">Checking plate: {currentPlate}</p>
              </div>
            )}
            
            {vehicle && (
              <div className="space-y-4">
                <VehicleInfo vehicle={vehicle} />
                <button
                  onClick={resetView}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Check Another Plate
                </button>
              </div>
            )}
            
            {showAddForm && (
              <div className="space-y-4">
                <AddVehicleForm
                  plateNumber={currentPlate}
                  onVehicleAdded={handleVehicleAdded}
                />
                <button
                  onClick={resetView}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          
          {/* Right Column - Recent Vehicles */}
          <div className="space-y-6">
            <RecentVehicles />
            
            {/* System Status */}
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <h3 className="text-white font-semibold mb-3">System Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Database:</span>
                  <span className="text-green-400">Connected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">API Status:</span>
                  <span className="text-green-400">Online</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Update:</span>
                  <span className="text-gray-300">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}