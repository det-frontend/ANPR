---
marp: true
theme: default
paginate: true
---

# ANPR Vehicle Management System

## Client Presentation

---

## 1. Introduction

- **Project:** Automatic Number Plate Recognition (ANPR) Vehicle Management System
- **Purpose:** Streamline vehicle entry, tracking, and analytics for logistics/industrial sites
- **Tech Stack:** Next.js, TypeScript, MongoDB, Tailwind CSS

---

## 2. Key Features

- **Automatic Number Plate Recognition (ANPR)**
- **Vehicle Registration & Lookup**
- **Real-time Dashboard & Analytics**
- **Data Export (CSV)**
- **Sample Data Seeding**
- **Modern, Responsive UI**

---

## 3. Vehicle Registration

- **Plate Recognition:**
  - Enter or scan truck number
  - System checks if vehicle exists
- **New Registration Form:**
  - Auto-generated Queue Number (resets daily)
  - Order Number, Order Date (date/time)
  - Company Name, Customer Name
  - Truck & Trailer Number
  - Driver Name & Phone
  - No. Drum, Amount (liters), Tank No (dropdown 1-6)
- **Validation:**
  - Required fields, duplicate checks

---

## 4. Dashboard & Analytics

- **Full-Width, Modern Dashboard**
- **Statistics Cards:**
  - Total Vehicles, Unique Drivers, Companies, Today's Entries
- **Advanced Filters:**
  - Date range, search, company filter, sorting
- **Analytics Chart:**
  - Vehicle entries over time
- **Summary Stats:**
  - Top companies, top drivers, recent activity

---

## 5. Vehicle Entries Table

- **Comprehensive Data Table**
- **Columns:**
  - Queue #, Order #, Company, Customer, Order Date, Truck #, Driver, Trailer #, Drums, Amount (L), Tank, Created
- **No Horizontal Scrolling**
  - Responsive, fits full screen width

---

## 6. API Endpoints

- **/api/add-vehicle** (POST): Add new vehicle
- **/api/check-plate** (GET): Check if vehicle exists
- **/api/vehicles** (GET): List all vehicles
- **/api/seed-data** (POST): Load sample data

---

## 7. Technology Stack

- **Frontend:** Next.js (React), TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Node.js, MongoDB
- **Other:** date-fns, Lucide icons

---

## 8. Benefits

- **Faster vehicle entry & reduced manual errors**
- **Real-time analytics for better decision making**
- **Easy data export for reporting**
- **Modern, user-friendly interface**
- **Scalable and maintainable architecture**

---

## 9. Demo & Q&A

- **Live demonstration of key features**
- **Questions and feedback**

---

# Thank You!
