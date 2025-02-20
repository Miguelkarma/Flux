# IT Equipment Asset Management

## Project Overview
### A lightweight IT equipment asset management system for tracking devices, assignments, and statuses. The system is built using:


# Core Features

## 1. Asset Management

Add, update, and delete IT equipment (laptops, phones, etc.).

Store asset details (name, serial number, status).

## 2. Assignment Tracking

Assign equipment to employees.

 View which employee has which device.

## 3. Status Monitoring

 Track asset status: Available, Assigned, Under Repair.

## 4. Basic Reporting

 Show total assets, assigned assets, and available assets.

# Tech Stack

## Frontend

 React + Vite (for fast and efficient development)

 Tailwind CSS (for modern styling)

 TypeScript (for maintainability and type safety)

## Backend

 Node.js & Express (or Firebase/Supabase as an alternative backend)

 Firestore or Supabase DB (for cloud storage)

# APIs for Additional Features

 Market Price API (fetch asset value)

 Currency API (convert purchase prices)

# Installation & Setup

## 1. Clone the Repository

`git clone https://bitbucket.org/your-repo/it-asset-management.git
cd it-asset-management`

## 2. Install Dependencies

`npm install`

## 3. Run the Development Server

`npm run dev`

### API Endpoints (If using Node.js & Express)


| Method | Endpoint          | Description               |
|--------|-------------------|---------------------------|
| GET    | `/api/assets`     | Get all assets            |
| POST   | `/api/assets`     | Add a new asset           |
| PUT    | `/api/assets/:id` | Update asset information  |
| DELETE | `/api/assets/:id` | Remove an asset           |


Contributing

Fork the repository

Create a new branch (`git checkout -b feature-branch`)

Commit your changes (`git commit -m "Added new feature"`)

Push to the branch (`git push origin feature-branch`)

Open a Pull Request

License

This project is licensed under the MIT License.

Developed by `Paul Miguel Santos` | Contact: toro.paulmiguel.santos@gmail.com

