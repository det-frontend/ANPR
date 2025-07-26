'use client';

import { useState } from 'react';
import { Search, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PlateInputProps {
  onPlateSubmit: (plate: string) => void;
  isLoading: boolean;
}

export default function PlateInput({ onPlateSubmit, isLoading }: PlateInputProps) {
  const [plate, setPlate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (plate.trim()) {
      onPlateSubmit(plate.trim().toUpperCase());
    }
  };

  const simulateCCTVInput = () => {
    // Simulate CCTV input with random plate numbers
    const samplePlates = ['ABC123', 'XYZ789', 'DEF456', 'GHI012', 'JKL345'];
    const randomPlate = samplePlates[Math.floor(Math.random() * samplePlates.length)];
    setPlate(randomPlate);
    onPlateSubmit(randomPlate);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <Camera className="h-6 w-6 text-blue-400" />
        <h2 className="text-xl font-semibold text-white">ANPR Input</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="plate" className="block text-sm font-medium text-gray-300 mb-2">
            Vehicle Number Plate
          </label>
          <Input
            id="plate"
            type="text"
            placeholder="Enter plate number (e.g., ABC123)"
            value={plate}
            onChange={(e) => setPlate(e.target.value.toUpperCase())}
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
            disabled={isLoading}
          />
        </div>
        
        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={!plate.trim() || isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <Search className="h-4 w-4 mr-2" />
            {isLoading ? 'Checking...' : 'Check Plate'}
          </Button>
          
          <Button
            type="button"
            onClick={simulateCCTVInput}
            disabled={isLoading}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Camera className="h-4 w-4 mr-2" />
            Simulate CCTV
          </Button>
        </div>
      </form>
    </div>
  );
}