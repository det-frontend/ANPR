import { getDatabase } from "./mongodb";
import { ObjectId } from "mongodb";

export interface Vehicle {
  _id?: ObjectId;
  queueNumber: string; // Auto generated, reset by day
  orderNumber: string;
  orderDate: Date;
  companyName: string; // Changed from customerLevel1
  customerName: string; // Changed from customerLevel2
  truckNumber: string;
  trailerNumber: string;
  driverName: string;
  driverPhoneNumber: string;
  numberOfDrums: number; // Changed from dam_capacity
  amountInLiters: number; // New field
  tankNumber: number; // New field (1-6)
  createdAt: Date;
  updatedAt: Date;
}

export class VehicleDB {
  private static collectionName = "vehicles";

  // Generate queue number based on current date
  static async generateQueueNumber(): Promise<string> {
    try {
      const db = await getDatabase();
      const collection = db.collection<Vehicle>(this.collectionName);

      const today = new Date();
      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
      );

      const todayCount = await collection.countDocuments({
        createdAt: { $gte: startOfDay, $lt: endOfDay },
      });

      const queueNumber = `Q${String(todayCount + 1).padStart(3, "0")}`;
      return queueNumber;
    } catch (error) {
      console.error("Error generating queue number:", error);
      throw error;
    }
  }

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
    vehicleData: Omit<
      Vehicle,
      "_id" | "createdAt" | "updatedAt" | "queueNumber"
    >
  ): Promise<Vehicle> {
    try {
      const db = await getDatabase();
      const collection = db.collection<Vehicle>(this.collectionName);

      // Generate queue number
      const queueNumber = await this.generateQueueNumber();

      const vehicle: Omit<Vehicle, "_id"> = {
        ...vehicleData,
        queueNumber,
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
      console.log("VehicleDB.getAllVehicles() called");
      const db = await getDatabase();
      console.log("Database connection established");
      const collection = db.collection<Vehicle>(this.collectionName);
      console.log("Collection accessed:", this.collectionName);

      const vehicles = await collection
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      console.log("Found vehicles:", vehicles.length);
      return vehicles;
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
