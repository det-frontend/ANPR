import { getDatabase } from "./mongodb";
import { ObjectId } from "mongodb";

export interface VehicleInfo {
  _id?: ObjectId;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  trailerNumber: string;
  customerName: string;
  companyName: string;
  createdAt: Date;
  updatedAt: Date;
}

export class VehicleInfoDB {
  private static collectionName = "vehicle_info";

  static async findByVehicleNumber(
    vehicleNumber: string
  ): Promise<VehicleInfo | null> {
    try {
      const db = await getDatabase();
      const collection = db.collection<VehicleInfo>(this.collectionName);

      const vehicle = await collection.findOne({
        vehicleNumber: { $regex: new RegExp(`^${vehicleNumber}$`, "i") },
      });

      return vehicle;
    } catch (error) {
      console.error("Error finding vehicle by vehicle number:", error);
      throw error;
    }
  }

  static async addVehicleInfo(
    vehicleData: Omit<VehicleInfo, "_id" | "createdAt" | "updatedAt">
  ): Promise<VehicleInfo> {
    try {
      const db = await getDatabase();
      const collection = db.collection<VehicleInfo>(this.collectionName);

      // Check if vehicle already exists
      const existingVehicle = await this.findByVehicleNumber(
        vehicleData.vehicleNumber
      );
      if (existingVehicle) {
        throw new Error("Vehicle with this number already exists");
      }

      const vehicle: Omit<VehicleInfo, "_id"> = {
        ...vehicleData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await collection.insertOne(vehicle as VehicleInfo);

      return {
        ...vehicle,
        _id: result.insertedId,
      } as VehicleInfo;
    } catch (error) {
      console.error("Error adding vehicle info:", error);
      throw error;
    }
  }

  static async getAllVehicleInfo(): Promise<VehicleInfo[]> {
    try {
      const db = await getDatabase();
      const collection = db.collection<VehicleInfo>(this.collectionName);

      const vehicles = await collection
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

      return vehicles;
    } catch (error) {
      console.error("Error getting all vehicle info:", error);
      throw error;
    }
  }

  static async updateVehicleInfo(
    id: string,
    updateData: Partial<VehicleInfo>
  ): Promise<VehicleInfo | null> {
    try {
      const db = await getDatabase();
      const collection = db.collection<VehicleInfo>(this.collectionName);

      const { ObjectId } = await import("mongodb");
      const objectId = new ObjectId(id);

      const result = await collection.findOneAndUpdate(
        { _id: objectId },
        {
          $set: {
            ...updateData,
            updatedAt: new Date(),
          },
        },
        { returnDocument: "after" }
      );

      return result as VehicleInfo | null;
    } catch (error) {
      console.error("Error updating vehicle info:", error);
      throw error;
    }
  }

  static async deleteVehicleInfo(id: string): Promise<void> {
    try {
      const db = await getDatabase();
      const collection = db.collection<VehicleInfo>(this.collectionName);

      const { ObjectId } = await import("mongodb");
      const objectId = new ObjectId(id);

      await collection.deleteOne({ _id: objectId });
    } catch (error) {
      console.error("Error deleting vehicle info:", error);
      throw error;
    }
  }

  static async searchVehicleInfo(searchTerm: string): Promise<VehicleInfo[]> {
    try {
      const db = await getDatabase();
      const collection = db.collection<VehicleInfo>(this.collectionName);

      const vehicles = await collection
        .find({
          $or: [
            { vehicleNumber: { $regex: searchTerm, $options: "i" } },
            { driverName: { $regex: searchTerm, $options: "i" } },
            { driverPhone: { $regex: searchTerm, $options: "i" } },
            { customerName: { $regex: searchTerm, $options: "i" } },
            { companyName: { $regex: searchTerm, $options: "i" } },
          ],
        })
        .sort({ createdAt: -1 })
        .toArray();

      return vehicles;
    } catch (error) {
      console.error("Error searching vehicle info:", error);
      throw error;
    }
  }

  static async seedSampleData(): Promise<void> {
    try {
      const db = await getDatabase();
      const collection = db.collection<VehicleInfo>(this.collectionName);

      // Check if data already exists
      const existingCount = await collection.countDocuments();
      if (existingCount > 0) {
        console.log("Vehicle info collection already has data, skipping seed");
        return;
      }

      const sampleVehicles: Omit<VehicleInfo, "_id">[] = [
        {
          vehicleNumber: "TRK-001",
          driverName: "John Smith",
          driverPhone: "+1-555-0101",
          trailerNumber: "TRL-001",
          customerName: "ABC Logistics",
          companyName: "FastTrack Transport",
          createdAt: new Date("2024-01-15T08:00:00Z"),
          updatedAt: new Date("2024-01-15T08:00:00Z"),
        },
        {
          vehicleNumber: "TRK-002",
          driverName: "Sarah Johnson",
          driverPhone: "+1-555-0102",
          trailerNumber: "TRL-002",
          customerName: "XYZ Corporation",
          companyName: "Reliable Haulers",
          createdAt: new Date("2024-01-16T09:30:00Z"),
          updatedAt: new Date("2024-01-16T09:30:00Z"),
        },
        {
          vehicleNumber: "TRK-003",
          driverName: "Michael Brown",
          driverPhone: "+1-555-0103",
          trailerNumber: "TRL-003",
          customerName: "Global Industries",
          companyName: "Premium Transport",
          createdAt: new Date("2024-01-17T10:15:00Z"),
          updatedAt: new Date("2024-01-17T10:15:00Z"),
        },
        {
          vehicleNumber: "TRK-004",
          driverName: "Emily Davis",
          driverPhone: "+1-555-0104",
          trailerNumber: "TRL-004",
          customerName: "Metro Solutions",
          companyName: "Express Logistics",
          createdAt: new Date("2024-01-18T11:45:00Z"),
          updatedAt: new Date("2024-01-18T11:45:00Z"),
        },
        {
          vehicleNumber: "TRK-005",
          driverName: "David Wilson",
          driverPhone: "+1-555-0105",
          trailerNumber: "TRL-005",
          customerName: "Tech Innovations",
          companyName: "Swift Delivery",
          createdAt: new Date("2024-01-19T12:20:00Z"),
          updatedAt: new Date("2024-01-19T12:20:00Z"),
        },
        {
          vehicleNumber: "TRK-006",
          driverName: "Lisa Anderson",
          driverPhone: "+1-555-0106",
          trailerNumber: "TRL-006",
          customerName: "Green Energy Co",
          companyName: "Eco Transport",
          createdAt: new Date("2024-01-20T13:10:00Z"),
          updatedAt: new Date("2024-01-20T13:10:00Z"),
        },
        {
          vehicleNumber: "TRK-007",
          driverName: "Robert Taylor",
          driverPhone: "+1-555-0107",
          trailerNumber: "TRL-007",
          customerName: "Construction Plus",
          companyName: "Heavy Haulers",
          createdAt: new Date("2024-01-21T14:30:00Z"),
          updatedAt: new Date("2024-01-21T14:30:00Z"),
        },
        {
          vehicleNumber: "TRK-008",
          driverName: "Jennifer Martinez",
          driverPhone: "+1-555-0108",
          trailerNumber: "TRL-008",
          customerName: "Food Distribution",
          companyName: "Fresh Logistics",
          createdAt: new Date("2024-01-22T15:45:00Z"),
          updatedAt: new Date("2024-01-22T15:45:00Z"),
        },
        {
          vehicleNumber: "TRK-009",
          driverName: "Christopher Lee",
          driverPhone: "+1-555-0109",
          trailerNumber: "TRL-009",
          customerName: "Automotive Parts",
          companyName: "Precision Transport",
          createdAt: new Date("2024-01-23T16:20:00Z"),
          updatedAt: new Date("2024-01-23T16:20:00Z"),
        },
        {
          vehicleNumber: "TRK-010",
          driverName: "Amanda Garcia",
          driverPhone: "+1-555-0110",
          trailerNumber: "TRL-010",
          customerName: "Pharmaceutical Corp",
          companyName: "Safe Transport",
          createdAt: new Date("2024-01-24T17:00:00Z"),
          updatedAt: new Date("2024-01-24T17:00:00Z"),
        },
      ];

      const result = await collection.insertMany(
        sampleVehicles as VehicleInfo[]
      );
      console.log(`✅ Seeded ${result.insertedCount} vehicle info records`);
    } catch (error) {
      console.error("Error seeding vehicle info data:", error);
      throw error;
    }
  }

  static async clearAllData(): Promise<void> {
    try {
      const db = await getDatabase();
      const collection = db.collection<VehicleInfo>(this.collectionName);

      await collection.deleteMany({});
      console.log("✅ Cleared all vehicle info data");
    } catch (error) {
      console.error("Error clearing vehicle info data:", error);
      throw error;
    }
  }
}
