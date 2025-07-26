import { NextResponse } from 'next/server';
import { VehicleDB } from '@/lib/db-helper';

export async function GET() {
  try {
    const vehicles = await VehicleDB.getAllVehicles();
    
    return NextResponse.json({
      vehicles: vehicles.map(vehicle => ({
        ...vehicle,
        _id: vehicle._id?.toString()
      }))
    });
  } catch (error) {
    console.error('Error getting vehicles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}