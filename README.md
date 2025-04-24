# IT Equipment Asset Management System

A modern, lightweight system for tracking IT equipment and employee assignments—complete with QR code integration, real-time dashboards, product search, market value tools, and a polished UI.

---

## Core Features

### Asset Management

- Add, edit, or delete IT assets.
- Track fields like: serial tag, asset tag, model, location, and status (Available, Assigned, Under Maintenance).

### Employee Directory

- Add, edit, or delete employee records.
- Manage employee ID, name, department, position, hire date, and status (Active, On Leave).

### QR Code System

- Generate QR codes for assets.
- Scan assets using your device's camera.
- View a searchable history of recent scans.

### Dashboard & Reporting

- Real-time reports for:
  - Total Assets
  - Active Assets
  - Assets in Maintenance
  - Active Employees
  - Employees on Leave

### Product Search via API

- Search for IT equipment using an external product API.
- Click on a result to view detailed information:
  - Description
  - Model
  - Status

### Market Price & Currency Tools

- Integrated Market Price API to fetch current asset valuations.
- Currency Converter for global price comparison and tracking.

---

## Tech Stack

### Frontend

- **React + Vite** – Fast and responsive UI.
- **Tailwind CSS** – Utility-first CSS for design.
- **TypeScript** – Type-safe and scalable frontend.
- **shadcn/ui** – Beautifully styled UI components.

### Backend & Database

- **Firebase Firestore** – Real-time NoSQL cloud database.
- **Firebase Authentication** – Required for user management.

### APIs & Integrations

- **Market Price API** – Fetch current hardware market values.
- **Currency API** – Convert purchase prices into different currencies.
- **Product Search API** – Lookup devices and fetch live product info.

---

## Deployment

- Deployed via **Vercel** for optimal performance and ease of use.

---

## Installation & Setup

1. **Clone the Repository**

   ```bash
   git clone https://bitbucket.org/your-repo/it-asset-management.git
   cd it-asset-management
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Run the Development Server**

   ```bash
   npm run dev
   ```

4. **Environment Variables**
   Create a `.env` file in the root and add:
   ```
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_MARKET_API_KEY=your_market_api_key
   VITE_CURRENCY_API_KEY=your_currency_api_key
   ```

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m "Add: YourFeature"`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Developed by

Paul Miguel Santos  
toro.paulmiguel.santos@gmail.com
