import { getDatabase } from "./mongodb";
import { ObjectId } from "mongodb";

export interface Vehicle {
  _id?: ObjectId;
  orderNumber: string;
  customerLevel1: string;
  customerLevel2: string;
  orderDate: Date;
  queueNumber: string;
  truckNumber: string;
  trailerNumber: string;
  driverName: string;
  driverPhoneNumber: string;
  dam_capacity: string;
  createdAt: Date;
  updatedAt: Date;
}

export class VehicleDB {
  private static collectionName = "vehicles";

  static async findByPlate(truckNumber: string): Promise<Vehicle | null> {
    try {
      const db = await getDatabase();
      const collection = db.collection<Vehicle>(this.collectionName);

      const vehicle = await collection.findOne({
        truckNumber: { $regex: new RegExp(`^${truckNumber}$`, "i") },
      });

      return vehicle;
    } catch (error) {
      console.error("Error finding vehicle by truck number:", error);
      throw error;
    }
  }

  static async addVehicle(
    vehicleData: Omit<Vehicle, "_id" | "createdAt" | "updatedAt">
  ): Promise<Vehicle> {
    try {
      const db = await getDatabase();
      const collection = db.collection<Vehicle>(this.collectionName);

      const vehicle: Omit<Vehicle, "_id"> = {
        ...vehicleData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await collection.insertOne(vehicle as Vehicle);

      return {
        ...vehicle,
        _id: result.insertedId,
      } as Vehicle;
    } catch (error) {
      console.error("Error adding vehicle:", error);
      throw error;
    }
  }

  static async getAllVehicles(): Promise<Vehicle[]> {
    try {
      const db = await getDatabase();
      const collection = db.collection<Vehicle>(this.collectionName);

      return await collection.find({}).sort({ createdAt: -1 }).toArray();
    } catch (error) {
      console.error("Error getting all vehicles:", error);
      throw error;
    }
  }

  static async updateVehicle(
    id: string,
    updateData: Partial<Vehicle>
  ): Promise<Vehicle | null> {
    try {
      const db = await getDatabase();
      const collection = db.collection<Vehicle>(this.collectionName);

      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
          $set: {
            ...updateData,
            updatedAt: new Date(),
          },
        },
        { returnDocument: "after" }
      );

      return result;
    } catch (error) {
      console.error("Error updating vehicle:", error);
      throw error;
    }
  }
}
