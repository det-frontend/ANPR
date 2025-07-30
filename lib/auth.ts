import { getDatabase } from "./mongodb";
import { hash, compare } from "bcryptjs";

export interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: "client" | "manager";
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: "client" | "manager";
  name: string;
}

export class AuthService {
  private static collectionName = "users";

  static async createUser(userData: RegisterData): Promise<User> {
    const db = await getDatabase();
    const collection = db.collection<User>(this.collectionName);

    // Check if user already exists
    const existingUser = await collection.findOne({
      $or: [{ username: userData.username }, { email: userData.email }],
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    // Hash password
    const hashedPassword = await hash(userData.password, 12);

    const newUser: Omit<User, "_id"> = {
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      role: userData.role,
      name: userData.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await collection.insertOne(newUser as any);
    const createdUser = await collection.findOne({ _id: result.insertedId });

    if (!createdUser) {
      throw new Error("Failed to create user");
    }

    return createdUser;
  }

  static async login(
    credentials: LoginCredentials
  ): Promise<Omit<User, "password">> {
    const db = await getDatabase();
    const collection = db.collection<User>(this.collectionName);

    const user = await collection.findOne({ username: credentials.username });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await compare(credentials.password, user.password);

    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async getUserById(
    userId: string
  ): Promise<Omit<User, "password"> | null> {
    const db = await getDatabase();
    const collection = db.collection<User>(this.collectionName);

    let queryId: any = userId;
    // Try to convert to ObjectId if possible
    try {
      const { ObjectId } = await import("mongodb");
      if (ObjectId.isValid(userId)) {
        queryId = new ObjectId(userId);
      }
    } catch (e) {
      // fallback: use string id
    }

    const user = await collection.findOne({ _id: queryId });

    if (!user) {
      return null;
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async getUserByUsername(
    username: string
  ): Promise<Omit<User, "password"> | null> {
    const db = await getDatabase();
    const collection = db.collection<User>(this.collectionName);

    const user = await collection.findOne({ username });

    if (!user) {
      return null;
    }

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async updateUser(
    userId: string,
    updates: Partial<Omit<User, "_id" | "password">>
  ): Promise<void> {
    const db = await getDatabase();
    const collection = db.collection<User>(this.collectionName);

    let queryId: any = userId;
    // Try to convert to ObjectId if possible
    try {
      const { ObjectId } = await import("mongodb");
      if (ObjectId.isValid(userId)) {
        queryId = new ObjectId(userId);
      }
    } catch (error) {
      // If ObjectId import fails, use the string as is
    }

    await collection.updateOne(
      { _id: queryId },
      {
        $set: {
          ...updates,
          updatedAt: new Date().toISOString(),
        },
      }
    );
  }

  static async changePassword(
    userId: string,
    newPassword: string
  ): Promise<void> {
    const db = await getDatabase();
    const collection = db.collection<User>(this.collectionName);

    const hashedPassword = await hash(newPassword, 12);

    let queryId: any = userId;
    // Try to convert to ObjectId if possible
    try {
      const { ObjectId } = await import("mongodb");
      if (ObjectId.isValid(userId)) {
        queryId = new ObjectId(userId);
      }
    } catch (error) {
      // If ObjectId import fails, use the string as is
    }

    await collection.updateOne(
      { _id: queryId },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date().toISOString(),
        },
      }
    );
  }

  static async deleteUser(userId: string): Promise<void> {
    const db = await getDatabase();
    const collection = db.collection<User>(this.collectionName);

    let queryId: any = userId;
    // Try to convert to ObjectId if possible
    try {
      const { ObjectId } = await import("mongodb");
      if (ObjectId.isValid(userId)) {
        queryId = new ObjectId(userId);
      }
    } catch (error) {
      // If ObjectId import fails, use the string as is
    }

    await collection.deleteOne({ _id: queryId });
  }

  static async getAllUsers(): Promise<Omit<User, "password">[]> {
    const db = await getDatabase();
    const collection = db.collection<User>(this.collectionName);

    const users = await collection.find({}).toArray();

    // Return users without passwords
    return users.map(
      ({ password, ...userWithoutPassword }) => userWithoutPassword
    );
  }

  static async seedDefaultUsers(): Promise<void> {
    const db = await getDatabase();
    const collection = db.collection<User>(this.collectionName);

    // Check if users already exist
    const existingUsers = await collection.countDocuments();
    if (existingUsers > 0) {
      return; // Users already exist
    }

    const defaultUsers: Omit<User, "_id">[] = [
      {
        username: "manager",
        email: "manager@anpr.com",
        password: await hash("manager123", 12),
        role: "manager",
        name: "System Manager",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        username: "client",
        email: "client@anpr.com",
        password: await hash("client123", 12),
        role: "client",
        name: "System Client",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    await collection.insertMany(defaultUsers as any);
  }
}
