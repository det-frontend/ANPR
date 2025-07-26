# API Documentation

## 1. Add Vehicle

- **Endpoint:** `/api/add-vehicle`
- **Method:** POST
- **Description:** Adds a new vehicle to the system.
- **Request Body (JSON):**
  - `orderNumber` (string, required)
  - `customerLevel1` (string, required)
  - `customerLevel2` (string, required)
  - `orderDate` (string, required, ISO date)
  - `queueNumber` (string, optional)
  - `truckNumber` (string, required)
  - `trailerNumber` (string, optional)
  - `driverName` (string, required)
  - `driverPhoneNumber` (string, optional)
  - `dam_capacity` (string, optional)
- **Responses:**
  - `201 Created`: `{ success: true, vehicle: { ... } }`
  - `400 Bad Request`: `{ error: "Missing required fields: ..." }`
  - `409 Conflict`: `{ error: "Vehicle with this truck number already exists" }`
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
