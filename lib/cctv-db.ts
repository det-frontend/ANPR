import { MongoClient, Db, Collection } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const MONGODB_DB = process.env.MONGODB_DB || "anpr_system";

export interface CCTVEvent {
  _id?: string;
  plateNumber: string;
  timestamp: Date;
  cameraId: string;
  cameraName: string;
  location: string;
  zone: string;
  confidence: number;
  imageUrl?: string;
  action: "open" | "close" | "deny";
  vehicleFound: boolean;
  vehicleData?: any;
  targetGateId?: string;
  targetGateName?: string;
  gateStatus: "opening" | "closing" | "open" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

export interface GateEvent {
  _id?: string;
  gateId: string;
  gateName: string;
  action: "open" | "close" | "auto-close";
  plateNumber?: string;
  operatorId?: string;
  reason?: string;
  cameraId?: string;
  cameraName?: string;
  timestamp: Date;
  success: boolean;
  errorMessage?: string;
}

export interface Camera {
  _id?: string;
  cameraId: string;
  cameraName: string;
  location: string;
  zone: string;
  ipAddress?: string;
  isActive: boolean;
  targetGateIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Gate {
  _id?: string;
  gateId: string;
  gateName: string;
  location: string;
  zone: string;
  gateType: "entrance" | "exit" | "both";
  isOpen: boolean;
  lastAction: string;
  lastActionTime: Date;
  lastPlateNumber?: string;
  lastOperatorId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

class CCTVEventDB {
  private static instance: CCTVEventDB;
  private client: MongoClient;
  private db: Db;
  private cctvEvents: Collection<CCTVEvent>;
  private gateEvents: Collection<GateEvent>;
  private cameras: Collection<Camera>;
  private gates: Collection<Gate>;

  private constructor() {
    this.client = new MongoClient(MONGODB_URI);
    this.db = this.client.db(MONGODB_DB);
    this.cctvEvents = this.db.collection<CCTVEvent>("cctv_events");
    this.gateEvents = this.db.collection<GateEvent>("gate_events");
    this.cameras = this.db.collection<Camera>("cameras");
    this.gates = this.db.collection<Gate>("gates");
  }

  public static getInstance(): CCTVEventDB {
    if (!CCTVEventDB.instance) {
      CCTVEventDB.instance = new CCTVEventDB();
    }
    return CCTVEventDB.instance;
  }

  public async connect(): Promise<void> {
    try {
      await this.client.connect();
      console.log("Connected to MongoDB for CCTV events");
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.client.close();
      console.log("Disconnected from MongoDB");
    } catch (error) {
      console.error("Error disconnecting from MongoDB:", error);
    }
  }

  // CCTV Events
  public async addCCTVEvent(
    event: Omit<CCTVEvent, "_id" | "createdAt" | "updatedAt">
  ): Promise<CCTVEvent> {
    try {
      const now = new Date();
      const newEvent: Omit<CCTVEvent, "_id"> = {
        ...event,
        createdAt: now,
        updatedAt: now,
      };

      const result = await this.cctvEvents.insertOne(newEvent);
      return { ...newEvent, _id: result.insertedId.toString() };
    } catch (error) {
      console.error("Error adding CCTV event:", error);
      throw error;
    }
  }

  public async getRecentCCTVEvents(
    limit: number = 50,
    plateNumber?: string
  ): Promise<CCTVEvent[]> {
    try {
      const query = plateNumber ? { plateNumber } : {};
      const events = await this.cctvEvents
        .find(query)
        .sort({ timestamp: -1 })
        .limit(limit)
        .toArray();

      return events.map((event) => ({
        ...event,
        _id: event._id?.toString(),
      }));
    } catch (error) {
      console.error("Error getting recent CCTV events:", error);
      throw error;
    }
  }

  public async getCCTVEventsByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<CCTVEvent[]> {
    try {
      const events = await this.cctvEvents
        .find({
          timestamp: {
            $gte: startDate,
            $lte: endDate,
          },
        })
        .sort({ timestamp: -1 })
        .toArray();

      return events.map((event) => ({
        ...event,
        _id: event._id?.toString(),
      }));
    } catch (error) {
      console.error("Error getting CCTV events by date range:", error);
      throw error;
    }
  }

  public async getCCTVStats(): Promise<{
    totalEvents: number;
    successfulEntries: number;
    deniedEntries: number;
    todayEvents: number;
    uniqueVehicles: number;
  }> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const [
        totalEvents,
        successfulEntries,
        deniedEntries,
        todayEvents,
        uniqueVehicles,
      ] = await Promise.all([
        this.cctvEvents.countDocuments(),
        this.cctvEvents.countDocuments({ action: "open" }),
        this.cctvEvents.countDocuments({ action: "deny" }),
        this.cctvEvents.countDocuments({
          timestamp: { $gte: today, $lt: tomorrow },
        }),
        this.cctvEvents.distinct("plateNumber").then((plates) => plates.length),
      ]);

      return {
        totalEvents,
        successfulEntries,
        deniedEntries,
        todayEvents,
        uniqueVehicles,
      };
    } catch (error) {
      console.error("Error getting CCTV stats:", error);
      throw error;
    }
  }

  // Gate Events
  public async addGateEvent(event: Omit<GateEvent, "_id">): Promise<GateEvent> {
    try {
      const result = await this.gateEvents.insertOne(event);
      return { ...event, _id: result.insertedId.toString() };
    } catch (error) {
      console.error("Error adding gate event:", error);
      throw error;
    }
  }

  public async getRecentGateEvents(limit: number = 50): Promise<GateEvent[]> {
    try {
      const events = await this.gateEvents
        .find({})
        .sort({ timestamp: -1 })
        .limit(limit)
        .toArray();

      return events.map((event) => ({
        ...event,
        _id: event._id?.toString(),
      }));
    } catch (error) {
      console.error("Error getting recent gate events:", error);
      throw error;
    }
  }

  // Camera Management
  public async addCamera(
    camera: Omit<Camera, "_id" | "createdAt" | "updatedAt">
  ): Promise<Camera> {
    try {
      const now = new Date();
      const newCamera: Omit<Camera, "_id"> = {
        ...camera,
        createdAt: now,
        updatedAt: now,
      };

      const result = await this.cameras.insertOne(newCamera);
      return { ...newCamera, _id: result.insertedId.toString() };
    } catch (error) {
      console.error("Error adding camera:", error);
      throw error;
    }
  }

  public async getAllCameras(): Promise<Camera[]> {
    try {
      const cameras = await this.cameras.find({}).toArray();
      return cameras.map((camera) => ({
        ...camera,
        _id: camera._id?.toString(),
      }));
    } catch (error) {
      console.error("Error getting cameras:", error);
      throw error;
    }
  }

  public async getCameraById(cameraId: string): Promise<Camera | null> {
    try {
      const camera = await this.cameras.findOne({ cameraId });
      return camera ? { ...camera, _id: camera._id?.toString() } : null;
    } catch (error) {
      console.error("Error getting camera by ID:", error);
      throw error;
    }
  }

  public async getCameraByIp(ipAddress: string): Promise<Camera | null> {
    try {
      const camera = await this.cameras.findOne({ ipAddress });
      return camera ? { ...camera, _id: camera._id?.toString() } : null;
    } catch (error) {
      console.error("Error getting camera by IP:", error);
      throw error;
    }
  }

  public async updateCamera(
    cameraId: string,
    updates: Partial<Camera>
  ): Promise<Camera | null> {
    try {
      const result = await this.cameras.findOneAndUpdate(
        { cameraId },
        { $set: { ...updates, updatedAt: new Date() } },
        { returnDocument: "after" }
      );
      return result ? { ...result, _id: result._id?.toString() } : null;
    } catch (error) {
      console.error("Error updating camera:", error);
      throw error;
    }
  }

  // Gate Management
  public async addGate(
    gate: Omit<Gate, "_id" | "createdAt" | "updatedAt">
  ): Promise<Gate> {
    try {
      const now = new Date();
      const newGate: Omit<Gate, "_id"> = {
        ...gate,
        createdAt: now,
        updatedAt: now,
      };

      const result = await this.gates.insertOne(newGate);
      return { ...newGate, _id: result.insertedId.toString() };
    } catch (error) {
      console.error("Error adding gate:", error);
      throw error;
    }
  }

  public async getAllGates(): Promise<Gate[]> {
    try {
      const gates = await this.gates.find({}).toArray();
      return gates.map((gate) => ({
        ...gate,
        _id: gate._id?.toString(),
      }));
    } catch (error) {
      console.error("Error getting gates:", error);
      throw error;
    }
  }

  public async getGateById(gateId: string): Promise<Gate | null> {
    try {
      const gate = await this.gates.findOne({ gateId });
      return gate ? { ...gate, _id: gate._id?.toString() } : null;
    } catch (error) {
      console.error("Error getting gate by ID:", error);
      throw error;
    }
  }

  public async updateGateStatus(
    gateId: string,
    isOpen: boolean,
    lastAction: string,
    plateNumber?: string,
    operatorId?: string
  ): Promise<Gate | null> {
    try {
      const result = await this.gates.findOneAndUpdate(
        { gateId },
        {
          $set: {
            isOpen,
            lastAction,
            lastActionTime: new Date(),
            lastPlateNumber: plateNumber,
            lastOperatorId: operatorId,
            updatedAt: new Date(),
          },
        },
        { returnDocument: "after" }
      );
      return result ? { ...result, _id: result._id?.toString() } : null;
    } catch (error) {
      console.error("Error updating gate status:", error);
      throw error;
    }
  }

  // Get target gates for a camera
  public async getTargetGatesForCamera(cameraId: string): Promise<Gate[]> {
    try {
      const camera = await this.getCameraById(cameraId);
      if (!camera || !camera.targetGateIds.length) {
        return [];
      }

      const gates = await this.gates
        .find({
          gateId: { $in: camera.targetGateIds },
          isActive: true,
        })
        .toArray();

      return gates.map((gate) => ({
        ...gate,
        _id: gate._id?.toString(),
      }));
    } catch (error) {
      console.error("Error getting target gates for camera:", error);
      throw error;
    }
  }

  // Cleanup old events (run periodically)
  public async cleanupOldEvents(daysToKeep: number = 30): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const [cctvDeleted, gateDeleted] = await Promise.all([
        this.cctvEvents.deleteMany({ timestamp: { $lt: cutoffDate } }),
        this.gateEvents.deleteMany({ timestamp: { $lt: cutoffDate } }),
      ]);

      const totalDeleted = cctvDeleted.deletedCount + gateDeleted.deletedCount;
      console.log(
        `Cleaned up ${totalDeleted} old events (${cctvDeleted.deletedCount} CCTV, ${gateDeleted.deletedCount} gate)`
      );

      return totalDeleted;
    } catch (error) {
      console.error("Error cleaning up old events:", error);
      throw error;
    }
  }
}

export const CCTVEventDBInstance = CCTVEventDB.getInstance();
