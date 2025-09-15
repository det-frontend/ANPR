# CCTV API Integration Guide for Recognition Developers

## Overview

This document provides technical specifications for integrating CCTV plate recognition systems with the ANPR Vehicle Management System. It covers API endpoints, data formats, authentication, and streaming requirements.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [API Endpoints](#api-endpoints)
3. [Data Formats](#data-formats)
4. [Authentication](#authentication)
5. [Error Handling](#error-handling)
6. [Streaming Integration](#streaming-integration)
7. [Testing](#testing)
8. [Code Examples](#code-examples)
9. [Troubleshooting](#troubleshooting)

## System Architecture

```
CCTV System → Plate Recognition → API Call → ANPR System → Gate Control
     ↓              ↓                ↓           ↓            ↓
  Camera      Recognition      HTTP POST    Database    Hardware
  Stream      Algorithm        Request      Storage     Control
```

### Key Components:

- **CCTV Cameras**: Multiple cameras at different locations
- **Recognition Engine**: Your plate recognition system
- **ANPR API**: Our REST API endpoints
- **Gate Control**: Automated gate opening/closing
- **Database**: Event logging and vehicle validation

## API Endpoints

### Base URL

```
Production: https://your-domain.com/api/cctv
Development: http://localhost:3000/api/cctv
```

### 1. Plate Recognition Endpoint

**Endpoint:** `POST /api/cctv/plate-recognition`

**Purpose:** Send detected plate data to trigger gate control actions

**Headers:**

```http
Content-Type: application/json
```

**Request Body:**

```json
{
  "plateNumber": "TRK-001",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "ipAddress": "192.168.1.101",
  "cameraName": "Main Entrance Camera",
  "location": "Main Entrance",
  "zone": "Zone A",
  "confidence": 0.95,
  "imageUrl": "https://your-cctv-system.com/images/TRK-001-1234567890.jpg"
}
```

**Required Fields:**

- `plateNumber` (string): Detected license plate number
- `timestamp` (string): ISO 8601 timestamp of detection
- `ipAddress` (string): Camera IP address (must exist in our system)

**Optional Fields:**

- `cameraName` (string): Human-readable camera name
- `location` (string): Physical location description
- `zone` (string): Zone identifier for the camera
- `confidence` (number): Recognition confidence score (0-1)
- `imageUrl` (string): URL to captured image

**Success Response (200):**

```json
{
  "success": true,
  "plateNumber": "TRK-001",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "gateControl": {
    "action": "open",
    "message": "Vehicle TRK-001 is registered. Opening 2 gate(s).",
    "vehicle": {
      "truckNumber": "TRK-001",
      "driverName": "John Doe",
      "company": "ABC Logistics"
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
    "_id": "65a1b2c3d4e5f6789abcdef0",
    "plateNumber": "TRK-001",
    "ipAddress": "192.168.1.101",
    "action": "open",
    "vehicleFound": true
  }
}
```

**Error Responses:**

**400 Bad Request:**

```json
{
  "error": "Missing required fields: plateNumber, timestamp, and ipAddress are required"
}
```

**404 Not Found:**

```json
{
  "error": "Camera 192.168.1.101 not found in system"
}
```

**500 Internal Server Error:**

```json
{
  "error": "Failed to process CCTV plate recognition"
}
```

### 2. Camera Management Endpoints

**Get All Cameras:** `GET /api/cctv/cameras`

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

**Add New Camera:** `POST /api/cctv/cameras`

```json
{
  "cameraId": "CAM-006",
  "cameraName": "New Camera",
  "location": "New Location",
  "zone": "Zone C",
  "ipAddress": "192.168.1.106",
  "targetGateIds": ["GATE-003"]
}
```

### 3. Gate Management Endpoints

**Get All Gates:** `GET /api/cctv/gates`

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

**Control Specific Gate:** `PUT /api/cctv/gates/{gateId}`

```json
{
  "action": "open",
  "plateNumber": "TRK-001",
  "operatorId": "cctv-system",
  "reason": "Automatic gate opening"
}
```

## Data Formats

### Plate Number Format

- **Standard Format:** Alphanumeric (e.g., "TRK-001", "ABC123", "XYZ-999")
- **Case Sensitivity:** Case-insensitive matching
- **Special Characters:** Hyphens and spaces allowed
- **Length:** 3-15 characters recommended

### Timestamp Format

- **Format:** ISO 8601 (RFC 3339)
- **Example:** `2024-01-15T10:30:00.000Z`
- **Timezone:** UTC recommended
- **Precision:** Millisecond precision

### Camera IP Format

- **Format:** IPv4 address (xxx.xxx.xxx.xxx)
- **Examples:** `192.168.1.101`, `10.0.0.50`, `172.16.1.25`
- **Uniqueness:** Must be unique across the system
- **Registration:** Must be registered before use
- **Network:** Should be accessible from the ANPR system

### Confidence Score

- **Range:** 0.0 to 1.0
- **0.0:** No confidence (should not be sent)
- **1.0:** Maximum confidence
- **Recommended:** Only send scores above 0.7

## Authentication

### Current Implementation

- **Status:** No authentication required (development phase)
- **Access:** Open API endpoints
- **Security:** Implement IP whitelisting in production

### Future Authentication (Recommended)

```http
Authorization: Bearer <jwt-token>
```

or

```http
X-API-Key: <api-key>
```

## Error Handling

### HTTP Status Codes

- **200:** Success
- **400:** Bad Request (invalid data)
- **404:** Not Found (camera/gate not found)
- **500:** Internal Server Error

### Retry Logic

```python
import time
import requests

def send_plate_detection_with_retry(data, max_retries=3):
    for attempt in range(max_retries):
        try:
            response = requests.post(
                "http://localhost:3000/api/cctv/plate-recognition",
                json=data,
                timeout=10
            )
            if response.status_code == 200:
                return response.json()
            elif response.status_code >= 500:
                # Server error, retry
                time.sleep(2 ** attempt)  # Exponential backoff
                continue
            else:
                # Client error, don't retry
                return response.json()
        except requests.exceptions.RequestException as e:
            if attempt == max_retries - 1:
                raise e
            time.sleep(2 ** attempt)
    return None
```

## Streaming Integration

### Video Stream Requirements

**Stream Format:**

- **Protocol:** RTSP, HTTP, or WebRTC
- **Resolution:** Minimum 720p, recommended 1080p
- **Frame Rate:** 15-30 FPS
- **Codec:** H.264 or H.265

**Stream URLs:**

```
RTSP: rtsp://camera-ip:554/stream1
HTTP: http://camera-ip:8080/video
WebRTC: wss://camera-ip:8443/webrtc
```

### Integration Points

**1. Camera Registration:**

```json
{
  "cameraId": "CAM-001",
  "cameraName": "Main Entrance Camera",
  "location": "Main Entrance",
  "zone": "Zone A",
  "ipAddress": "192.168.1.101",
  "streamUrl": "rtsp://192.168.1.101:554/stream1",
  "isActive": true,
  "targetGateIds": ["GATE-001"]
}
```

**2. Stream Processing:**

```python
import cv2
import requests

def process_camera_stream(camera_id, stream_url):
    cap = cv2.VideoCapture(stream_url)

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Your plate recognition logic here
        plate_number, confidence = recognize_plate(frame)

        if plate_number and confidence > 0.7:
            send_plate_detection({
                "plateNumber": plate_number,
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "cameraId": camera_id,
                "confidence": confidence,
                "imageUrl": f"http://your-system.com/images/{plate_number}-{int(time.time())}.jpg"
            })

        time.sleep(0.1)  # 10 FPS processing
```

## Testing

### Test Environment Setup

**1. Seed Sample Data:**

```bash
curl -X POST http://localhost:3000/api/cctv/seed
```

**2. Verify Cameras:**

```bash
curl http://localhost:3000/api/cctv/cameras
```

**3. Test Plate Recognition:**

```bash
curl -X POST http://localhost:3000/api/cctv/plate-recognition \
  -H "Content-Type: application/json" \
  -d '{
    "plateNumber": "TRK-001",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "ipAddress": "192.168.1.101",
    "confidence": 0.95
  }'
```

### Test Scenarios

**1. Valid Registered Vehicle:**

- Plate: "TRK-001"
- Expected: Gate opens, success response

**2. Unregistered Vehicle:**

- Plate: "UNKNOWN-123"
- Expected: Access denied, gate remains closed

**3. Invalid Camera ID:**

- Camera: "INVALID-CAM"
- Expected: 404 error

**4. Missing Required Fields:**

- Missing timestamp or cameraId
- Expected: 400 error

## Code Examples

### Python Integration

```python
import requests
import json
from datetime import datetime
import cv2
import numpy as np

class CCTVIntegration:
    def __init__(self, base_url="http://localhost:3000"):
        self.base_url = base_url
        self.api_endpoint = f"{base_url}/api/cctv/plate-recognition"

    def send_plate_detection(self, plate_number, camera_ip, confidence=0.95, image_url=None):
        """Send plate detection to ANPR system"""
        data = {
            "plateNumber": plate_number,
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "ipAddress": camera_ip,
            "confidence": confidence
        }

        if image_url:
            data["imageUrl"] = image_url

        try:
            response = requests.post(
                self.api_endpoint,
                json=data,
                timeout=10
            )

            if response.status_code == 200:
                result = response.json()
                print(f"✅ Gate action: {result['gateControl']['action']}")
                return result
            else:
                print(f"❌ Error: {response.status_code} - {response.text}")
                return None

        except requests.exceptions.RequestException as e:
            print(f"❌ Network error: {e}")
            return None

    def get_cameras(self):
        """Get all registered cameras"""
        try:
            response = requests.get(f"{self.base_url}/api/cctv/cameras")
            if response.status_code == 200:
                return response.json()["cameras"]
            return []
        except:
            return []

    def process_video_stream(self, camera_ip, stream_url):
        """Process video stream and send plate detections"""
        cap = cv2.VideoCapture(stream_url)

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            # Your plate recognition logic here
            plate_number, confidence = self.recognize_plate(frame)

            if plate_number and confidence > 0.7:
                self.send_plate_detection(plate_number, camera_ip, confidence)

            # Display frame (optional)
            cv2.imshow('CCTV Stream', frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        cap.release()
        cv2.destroyAllWindows()

    def recognize_plate(self, frame):
        """Your plate recognition implementation"""
        # Replace with your actual recognition logic
        # Return (plate_number, confidence)
        return None, 0.0

# Usage example
cctv = CCTVIntegration()

# Send a test detection
result = cctv.send_plate_detection("TRK-001", "192.168.1.101", 0.95)
if result:
    print(f"Gate action: {result['gateControl']['action']}")
    print(f"Message: {result['gateControl']['message']}")
```

### Node.js Integration

```javascript
const axios = require("axios");
const cv = require("opencv4nodejs");

class CCTVIntegration {
  constructor(baseUrl = "http://localhost:3000") {
    this.baseUrl = baseUrl;
    this.apiEndpoint = `${baseUrl}/api/cctv/plate-recognition`;
  }

  async sendPlateDetection(
    plateNumber,
    ipAddress,
    confidence = 0.95,
    imageUrl = null
  ) {
    const data = {
      plateNumber,
      timestamp: new Date().toISOString(),
      ipAddress,
      confidence,
    };

    if (imageUrl) {
      data.imageUrl = imageUrl;
    }

    try {
      const response = await axios.post(this.apiEndpoint, data, {
        timeout: 10000,
      });

      if (response.status === 200) {
        console.log(`✅ Gate action: ${response.data.gateControl.action}`);
        return response.data;
      }
    } catch (error) {
      if (error.response) {
        console.log(
          `❌ Error: ${error.response.status} - ${error.response.data.error}`
        );
      } else {
        console.log(`❌ Network error: ${error.message}`);
      }
      return null;
    }
  }

  async getCameras() {
    try {
      const response = await axios.get(`${this.baseUrl}/api/cctv/cameras`);
      return response.data.cameras;
    } catch (error) {
      console.log(`❌ Error getting cameras: ${error.message}`);
      return [];
    }
  }

  async processVideoStream(ipAddress, streamUrl) {
    const cap = new cv.VideoCapture(streamUrl);

    while (true) {
      const frame = cap.read();
      if (frame.empty) break;

      // Your plate recognition logic here
      const { plateNumber, confidence } = await this.recognizePlate(frame);

      if (plateNumber && confidence > 0.7) {
        await this.sendPlateDetection(plateNumber, ipAddress, confidence);
      }

      // Display frame (optional)
      cv.imshow("CCTV Stream", frame);
      if (cv.waitKey(1) === 27) break; // ESC key
    }

    cap.release();
    cv.destroyAllWindows();
  }

  async recognizePlate(frame) {
    // Replace with your actual recognition logic
    // Return { plateNumber, confidence }
    return { plateNumber: null, confidence: 0.0 };
  }
}

// Usage example
const cctv = new CCTVIntegration();

// Send a test detection
cctv.sendPlateDetection("TRK-001", "192.168.1.101", 0.95).then((result) => {
  if (result) {
    console.log(`Gate action: ${result.gateControl.action}`);
    console.log(`Message: ${result.gateControl.message}`);
  }
});
```

## Troubleshooting

### Common Issues

**1. Camera Not Found (404 Error)**

- **Cause:** Camera ID not registered in system
- **Solution:** Register camera using POST /api/cctv/cameras
- **Check:** Verify camera ID format (CAM-XXX)

**2. Network Timeout**

- **Cause:** Slow network or server overload
- **Solution:** Implement retry logic with exponential backoff
- **Timeout:** Set to 10-30 seconds

**3. Invalid JSON Response**

- **Cause:** Server error or malformed request
- **Solution:** Validate request data before sending
- **Check:** Ensure all required fields are present

**4. Gate Not Opening**

- **Cause:** Vehicle not registered or gate hardware issue
- **Solution:** Check vehicle registration in ANPR system
- **Verify:** Gate hardware connections

### Debug Mode

Enable debug logging by setting environment variables:

```bash
DEBUG=cctv:*
NODE_ENV=development
```

### Monitoring

**API Health Check:**

```bash
curl http://localhost:3000/api/cctv/cameras
```

**Event Logs:**

- Check browser console for client-side errors
- Check server logs for API errors
- Monitor database for event storage

## Production Considerations

### Security

- Implement API authentication
- Use HTTPS for all communications
- Implement IP whitelisting
- Validate and sanitize all input data

### Performance

- Implement connection pooling
- Use async/await for API calls
- Implement proper error handling
- Monitor API response times

### Scalability

- Implement rate limiting
- Use load balancers for high traffic
- Monitor database performance
- Implement caching where appropriate

## Support

For technical support or questions:

- **Documentation:** This guide and CCTV_INTEGRATION.md
- **API Testing:** Use the test endpoints provided
- **Debugging:** Check server logs and browser console
- **Integration Issues:** Verify camera registration and data formats

---

**Last Updated:** January 2024
**Version:** 1.0
**Compatibility:** ANPR System v1.0+
