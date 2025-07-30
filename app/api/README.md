# API Documentation

## 1. Add Vehicle

- **Endpoint:** `/api/add-vehicle`
- **Method:** POST
- **Description:** Adds a new vehicle to the system.
- **Request Body (JSON):**
  - `orderNumber` (string, required)
  - `companyName` (string, required)
  - `customerName` (string, required)
  - `orderDate` (string, required, ISO date)
  - `truckNumber` (string, required)
  - `trailerNumber` (string, optional)
  - `driverName` (string, required)
  - `driverPhoneNumber` (string, optional)
  - `numberOfDrums` (number, required)
  - `amountInLiters` (number, required)
  - `tankNumber` (number, required, 1-6)
- **Responses:**
  - `201 Created`: `{ success: true, vehicle: { ... } }`
  - `400 Bad Request`: `{ error: "Missing required fields: ..." }`
  - `400 Bad Request`: `{ error: "Tank number must be between 1 and 6" }`
  - `500 Internal Server Error`: `{ error: "Internal server error" }`

---

## 2. Check Plate

- **Endpoint:** `/api/check-plate?plate=TRUCK_NUMBER`
- **Method:** GET
- **Description:** Checks if a vehicle with the given plate (truck number) exists.
- **Query Parameter:**
  - `plate` (string, required)
- **Responses:**
  - `200 OK`: `{ exists: true, vehicle: { ... } }` or `{ exists: false, vehicle: null }`
  - `400 Bad Request`: `{ error: "Plate number is required" }`
  - `500 Internal Server Error`: `{ error: "Internal server error" }`

---

## 3. Get Recent Vehicles

- **Endpoint:** `/api/vehicles`
- **Method:** GET
- **Description:** Retrieves all registered vehicles (typically the most recent are shown in the UI).
- **Responses:**
  - `200 OK`: `{ vehicles: [ { ... }, ... ] }`
  - `500 Internal Server Error`: `{ error: "Internal server error" }`

---

## 4. Seed Sample Data

- **Endpoint:** `/api/seed-data`
- **Method:** POST
- **Description:** Populates the database with sample vehicle data for testing.
- **Responses:**
  - `201 Created`: `{ success: true, message: "Added X sample vehicles", vehicles: [...] }`
  - `500 Internal Server Error`: `{ error: "Internal server error" }`

## Vehicle Data Structure

```json
{
  "_id": "ObjectId",
  "queueNumber": "Q001", // Auto generated, resets daily
  "orderNumber": "ORD-001",
  "orderDate": "2024-01-15T10:30:00.000Z",
  "companyName": "ABC Logistics",
  "customerName": "Warehouse A",
  "truckNumber": "TRK-001",
  "trailerNumber": "TRL-001",
  "driverName": "John Smith",
  "driverPhoneNumber": "+1234567890",
  "numberOfDrums": 20,
  "amountInLiters": 5000,
  "tankNumber": 1,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```
