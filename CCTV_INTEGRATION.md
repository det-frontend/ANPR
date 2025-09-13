# CCTV Integration Guide

This document provides comprehensive information about the CCTV integration feature added to the ANPR system.

## Overview

The CCTV integration allows external CCTV systems to automatically detect license plates and trigger gate control actions based on vehicle registration status in the ANPR system. The system supports multiple cameras and multiple gates with intelligent routing between cameras and their target gates.

## Features

- **Multi-Camera Support**: Support for multiple CCTV cameras at different locations
- **Multi-Gate Control**: Control multiple gates with different types (entrance, exit, both)
- **Intelligent Routing**: Automatic mapping between cameras and their target gates
- **Zone Management**: Organize cameras and gates by zones for better management
- **Automatic Plate Recognition**: CCTV systems can send plate numbers to the API
- **Vehicle Validation**: System checks if detected vehicles are registered
- **Gate Control**: Automatic gate opening for registered vehicles, denial for unregistered
- **Real-time Monitoring**: Live dashboard for CCTV events and gate status
- **Event Logging**: Complete audit trail of all CCTV activities
- **Manual Override**: Manual gate control capabilities for each gate

## API Endpoints

### 1. Plate Recognition API

**Endpoint**: `POST /api/cctv/plate-recognition`

**Purpose**: Receive plate number data from CCTV systems and determine gate action

**Request Body**:

```json
{
  "plateNumber": "TRK-001",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "cameraId": "CAM-001",
  "cameraName": "Main Entrance Camera",
  "location": "Main Entrance",
  "zone": "Zone A",
  "confidence": 0.95,
  "imageUrl": "https://example.com/cctv-images/TRK-001-1234567890.jpg"
}
```

**Required Fields**:

- `plateNumber`: The detected license plate number
- `timestamp`: ISO timestamp of the detection
- `cameraId`: Identifier for the camera that detected the plate (must exist in system)

**Optional Fields**:

- `cameraName`: Display name for the camera
- `location`: Physical location of the camera
- `zone`: Zone identifier for the camera
- `confidence`: Confidence score (0-1) of the plate recognition
- `imageUrl`: URL to the captured image

**Response**:

```json
{
  "success": true,
  "plateNumber": "TRK-001",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "gateControl": {
    "action": "open",
    "message": "Vehicle TRK-001 is registered. Opening 2 gate(s).",
    "vehicle": {
      /* vehicle data */
    },
    "targetGates": [
      {
        "gateId": "GATE-001",
        "gateName": "Main Entrance Gate",
        "gateStatus": "opening"
      },
      {
        "gateId": "GATE-002",
        "gateName": "Secondary Gate",
        "gateStatus": "opening"
      }
    ]
  },
  "event": {
    /* CCTV event data */
  }
}
```

**Possible Actions**:

- `open`: Vehicle is registered, gate will open
- `deny`: Vehicle is not registered, access denied
- `close`: Gate is being closed

### 2. Gate Control API

**Endpoint**: `POST /api/cctv/gate-control`

**Purpose**: Manual gate control operations

**Request Body**:

```json
{
  "action": "open",
  "plateNumber": "TRK-001",
  "reason": "Manual override",
  "operatorId": "admin"
}
```

**Actions**:

- `open`: Open the gate
- `close`: Close the gate
- `status`: Get current gate status

**Response**:

```json
{
  "success": true,
  "action": "open",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "message": "Gate opening...",
  "gateStatus": {
    "isOpen": true,
    "lastAction": "opened",
    "lastActionTime": "2024-01-15T10:30:00.000Z",
    "plateNumber": "TRK-001",
    "operatorId": "admin"
  }
}
```

### 3. CCTV Events API

**Endpoint**: `GET /api/cctv/plate-recognition`

**Purpose**: Retrieve recent CCTV events and statistics

**Query Parameters**:

- `limit`: Number of events to retrieve (default: 50)
- `plate`: Filter by specific plate number

**Response**:

```json
{
  "success": true,
  "events": [
    /* array of CCTV events */
  ],
  "stats": {
    "totalEvents": 150,
    "successfulEntries": 120,
    "deniedEntries": 30,
    "todayEvents": 15,
    "uniqueVehicles": 45
  },
  "total": 50
}
```

### 4. Cameras Management API

**Endpoint**: `GET /api/cctv/cameras`

**Purpose**: Get all configured cameras

**Response**:

```json
{
  "success": true,
  "cameras": [
    {
      "_id": "...",
      "cameraId": "CAM-001",
      "cameraName": "Main Entrance Camera",
      "location": "Main Entrance",
      "zone": "Zone A",
      "ipAddress": "192.168.1.101",
      "isActive": true,
      "targetGateIds": ["GATE-001", "GATE-002"]
    }
  ]
}
```

**Endpoint**: `POST /api/cctv/cameras`

**Purpose**: Add a new camera

**Request Body**:

```json
{
  "cameraId": "CAM-001",
  "cameraName": "Main Entrance Camera",
  "location": "Main Entrance",
  "zone": "Zone A",
  "ipAddress": "192.168.1.101",
  "targetGateIds": ["GATE-001"]
}
```

### 5. Gates Management API

**Endpoint**: `GET /api/cctv/gates`

**Purpose**: Get all configured gates

**Response**:

```json
{
  "success": true,
  "gates": [
    {
      "_id": "...",
      "gateId": "GATE-001",
      "gateName": "Main Entrance Gate",
      "location": "Main Entrance",
      "zone": "Zone A",
      "gateType": "entrance",
      "isOpen": false,
      "lastAction": "closed",
      "lastActionTime": "2024-01-15T10:30:00.000Z",
      "isActive": true
    }
  ]
}
```

**Endpoint**: `POST /api/cctv/gates`

**Purpose**: Add a new gate

**Request Body**:

```json
{
  "gateId": "GATE-001",
  "gateName": "Main Entrance Gate",
  "location": "Main Entrance",
  "zone": "Zone A",
  "gateType": "entrance"
}
```

### 6. Individual Gate Control API

**Endpoint**: `PUT /api/cctv/gates/{gateId}`

**Purpose**: Control a specific gate

**Request Body**:

```json
{
  "action": "open",
  "plateNumber": "TRK-001",
  "reason": "Manual override",
  "operatorId": "admin"
}
```

### 7. Test API

**Endpoint**: `POST /api/cctv/test`

**Purpose**: Test the CCTV integration with simulated data

**Request Body**:

```json
{
  "plateNumber": "TRK-001"
}
```

### 8. Seed Data API

**Endpoint**: `POST /api/cctv/seed`

**Purpose**: Populate the system with sample cameras and gates for testing

## Database Schema

### CCTV Events Collection

```typescript
interface CCTVEvent {
  _id: string;
  plateNumber: string;
  timestamp: Date;
  cameraId: string;
  location: string;
  confidence: number;
  imageUrl?: string;
  action: "open" | "close" | "deny";
  vehicleFound: boolean;
  vehicleData?: any;
  gateStatus: "opening" | "closing" | "open" | "closed";
  createdAt: Date;
  updatedAt: Date;
}
```

### Gate Events Collection

```typescript
interface GateEvent {
  _id: string;
  action: "open" | "close" | "auto-close";
  plateNumber?: string;
  operatorId?: string;
  reason?: string;
  timestamp: Date;
  success: boolean;
  errorMessage?: string;
}
```

## User Interface

### CCTV Monitoring Dashboard (`/cctv`)

- **Real-time Gate Status**: Shows current gate state and last action
- **Manual Gate Control**: Buttons to manually open/close gate
- **Statistics Cards**: Total events, successful entries, denied entries, today's events
- **Event Table**: Recent CCTV events with filtering and search
- **Auto-refresh**: Updates every 30 seconds

### CCTV Test Page (`/cctv-test`)

- **Custom Plate Testing**: Test with any plate number
- **Predefined Tests**: Quick tests with common scenarios
- **Test Results**: Detailed results with gate actions
- **Integration Instructions**: Step-by-step setup guide

## Integration Steps

### 1. CCTV System Configuration

1. Configure your CCTV system to send HTTP POST requests
2. Set the endpoint URL to: `https://your-domain.com/api/cctv/plate-recognition`
3. Configure the request format according to the API specification
4. Set up error handling and retry logic

### 2. Gate Hardware Integration

1. Replace the mock gate control functions with actual hardware integration
2. Update the gate control API to interface with your gate hardware
3. Implement proper error handling for hardware failures
4. Add safety mechanisms (timeouts, emergency stops)

### 3. Security Considerations

1. Implement API authentication for CCTV endpoints
2. Use HTTPS for all communications
3. Validate and sanitize all input data
4. Implement rate limiting to prevent abuse
5. Log all access attempts for security auditing

### 4. Monitoring and Maintenance

1. Set up monitoring for API endpoint health
2. Implement alerting for gate control failures
3. Regular database cleanup for old events
4. Performance monitoring for high-traffic scenarios

## Example CCTV System Integration

### Python Example

```python
import requests
import json
from datetime import datetime

def send_plate_detection(plate_number, camera_id, location, confidence=0.95):
    url = "https://your-anpr-system.com/api/cctv/plate-recognition"

    data = {
        "plateNumber": plate_number,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "cameraId": camera_id,
        "location": location,
        "confidence": confidence,
        "imageUrl": f"https://your-cctv-system.com/images/{plate_number}-{int(datetime.now().timestamp())}.jpg"
    }

    try:
        response = requests.post(url, json=data, timeout=10)
        result = response.json()

        if result.get("success"):
            gate_action = result["gateControl"]["action"]
            if gate_action == "open":
                print(f"Gate opened for {plate_number}")
            elif gate_action == "deny":
                print(f"Access denied for {plate_number}")
        else:
            print(f"Error: {result.get('error')}")

    except requests.exceptions.RequestException as e:
        print(f"Failed to send plate detection: {e}")

# Usage
send_plate_detection("TRK-001", "CAM-001", "Main Entrance", 0.98)
```

### Node.js Example

```javascript
const axios = require("axios");

async function sendPlateDetection(
  plateNumber,
  cameraId,
  location,
  confidence = 0.95
) {
  const url = "https://your-anpr-system.com/api/cctv/plate-recognition";

  const data = {
    plateNumber,
    timestamp: new Date().toISOString(),
    cameraId,
    location,
    confidence,
    imageUrl: `https://your-cctv-system.com/images/${plateNumber}-${Date.now()}.jpg`,
  };

  try {
    const response = await axios.post(url, data, { timeout: 10000 });
    const result = response.data;

    if (result.success) {
      const gateAction = result.gateControl.action;
      if (gateAction === "open") {
        console.log(`Gate opened for ${plateNumber}`);
      } else if (gateAction === "deny") {
        console.log(`Access denied for ${plateNumber}`);
      }
    } else {
      console.error(`Error: ${result.error}`);
    }
  } catch (error) {
    console.error(`Failed to send plate detection: ${error.message}`);
  }
}

// Usage
sendPlateDetection("TRK-001", "CAM-001", "Main Entrance", 0.98);
```

## Testing

### Manual Testing

1. Use the CCTV Test page (`/cctv-test`) to simulate plate detections
2. Test with both registered and unregistered vehicles
3. Verify gate control responses
4. Check event logging in the dashboard

### Automated Testing

1. Use the test API endpoint for automated testing
2. Implement integration tests for your CCTV system
3. Test error scenarios (network failures, invalid data)
4. Performance testing for high-volume scenarios

## Troubleshooting

### Common Issues

1. **Gate not responding**: Check gate hardware connections and API responses
2. **Events not logging**: Verify database connection and CCTV event API
3. **False positives/negatives**: Review vehicle registration data and plate recognition accuracy
4. **Performance issues**: Monitor database performance and implement indexing

### Debug Mode

Enable debug logging by setting environment variables:

```bash
DEBUG=cctv:*
NODE_ENV=development
```

## Security Best Practices

1. **API Authentication**: Implement JWT or API key authentication
2. **Input Validation**: Validate all incoming data
3. **Rate Limiting**: Prevent abuse with rate limiting
4. **Audit Logging**: Log all gate control actions
5. **Network Security**: Use VPN or secure network connections
6. **Regular Updates**: Keep the system updated with security patches

## Performance Considerations

1. **Database Indexing**: Index frequently queried fields
2. **Connection Pooling**: Use database connection pooling
3. **Caching**: Cache frequently accessed data
4. **Load Balancing**: Use load balancers for high availability
5. **Monitoring**: Implement comprehensive monitoring and alerting

## Future Enhancements

1. **Machine Learning**: Improve plate recognition accuracy
2. **Multi-camera Support**: Support for multiple camera locations
3. **Advanced Analytics**: Detailed reporting and analytics
4. **Mobile App**: Mobile application for gate control
5. **Integration APIs**: Additional third-party integrations
6. **Real-time Notifications**: Push notifications for events
7. **Video Streaming**: Live video feed integration
8. **Advanced Security**: Facial recognition and biometric access
