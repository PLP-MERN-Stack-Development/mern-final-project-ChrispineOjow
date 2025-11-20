# Water Tracking App

A community-driven water tracking application that enables local populations to report and track water availability and quality in their areas. This MERN stack application helps collect valuable data about water resources, making it easier to identify areas with water access issues and monitor water cleanliness.


## Link

This is the link to the website: [Water Tracker](https://water-tracker-gules.vercel.app/)

## 🌊 Overview

The Water Tracking App is designed to empower communities by allowing residents to:
- **Report water availability** in their location
- **Track water cleanliness** status
- **Share location-based data** to help identify water access patterns
- **Enable data-driven decisions** for water resource management

This application serves as a platform for crowdsourcing water data, which can be used by local authorities, NGOs, and community organizations to better understand and address water-related challenges.

## 🚀 Features

- **Location-Based Reporting**: Users can submit water reports with precise geographic coordinates
- **Water Status Tracking**: Reports include information about:
  - Water availability (present or not)
  - Water cleanliness (clean or not)
  - Optional descriptions for additional context
- **User Authentication**: Secure user management using Clerk authentication
- **Role-Based Access**: Support for regular users and admin roles
- **Report Verification**: Admin users can verify reports for accuracy
- **Geospatial Queries**: Built-in support for location-based searches and queries
- **RESTful API**: Complete CRUD operations for water reports

## 🛠️ Tech Stack

### Backend
- **Node.js** with **Express.js** - Server framework
- **MongoDB** with **Mongoose** - Database and ODM
- **Clerk** - Authentication and user management
- **CORS** - Cross-origin resource sharing

### Database
- **MongoDB** - NoSQL database with geospatial indexing for location queries

## 📁 Project Structure

```
Water-Tracking-Project/
├── backend/
│   ├── config/
│   │   └── db.js              # Database connection configuration
│   ├── controllers/
│   │   └── Report.controller.js  # Water report business logic
│   ├── middleware/            # Custom middleware functions
│   ├── models/
│   │   ├── User.model.js      # User schema and model
│   │   └── WaterReport.model.js  # Water report schema and model
│   ├── routes/
│   │   └── report.routes.js   # API route definitions
│   ├── server.js              # Express server entry point
│   └── package.json           # Backend dependencies
└── README.md
```

## 📊 Data Models

### User Model
- `clerkId`: Unique identifier from Clerk authentication
- `name`: User's full name
- `email`: User's email address (unique)
- `location`: Geographic coordinates (Point type with longitude/latitude)
- `role`: User role ('user' or 'admin')

### Water Report Model
- `userId`: Reference to the user who created the report
- `location`: Geographic coordinates (Point type with longitude/latitude)
- `waterAvailable`: Boolean indicating if water is available
- `waterClean`: Boolean indicating if water is clean
- `description`: Optional text description
- `verified`: Boolean indicating if report has been verified by admin
- `timestamp`: Date and time when the report was created

## 🔌 API Endpoints

### Water Reports
- `POST /api/reports` - Create a new water report
- `GET /api/reports` - Get all water reports
- `GET /api/reports/:_id` - Get a specific report by ID
- `PUT /api/reports/:_id` - Update a water report
- `DELETE /api/reports/:_id` - Delete a water report

### Example Request (Create Report)
```json
POST /api/reports
{
  "userId": "user_id_here",
  "coordinates": [longitude, latitude],
  "waterAvailable": true,
  "waterClean": false,
  "description": "Water is available but appears contaminated"
}
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Clerk account (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ChrispineOjow/Water-Tracking-App.git
   cd Water-Tracking-Project
   ```

2. **Navigate to the backend directory**
   ```bash
   cd backend
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up environment variables**
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```
   Or for production:
   ```bash
   npm start
   ```

6. **Verify the server is running**
   Visit `http://localhost:5000` to see the server status message.

## 🔐 Authentication

This application uses Clerk for user authentication. Users are identified by their `clerkId` in the system, and the application supports role-based access control with 'user' and 'admin' roles.

## 📍 Geospatial Features

The application uses MongoDB's geospatial indexing to enable location-based queries. Reports and users are stored with geographic coordinates, allowing for:
- Finding reports near a specific location
- Location-based filtering and searches
- Geographic data visualization (when integrated with mapping services)

## 🎯 Use Cases

- **Community Water Monitoring**: Local residents can report water status in their neighborhoods
- **NGO Data Collection**: Organizations can gather water access data for research and planning
- **Government Water Management**: Authorities can track water availability and quality across regions
- **Crisis Response**: Quick reporting during water emergencies or contamination events
- **Resource Planning**: Data-driven decisions for water infrastructure development

## 🔮 Future Enhancements

- Frontend application (React/Next.js)
- Real-time notifications for new reports
- Map visualization of water reports
- Report analytics and statistics dashboard
- Mobile application support
- Photo uploads for water reports
- Advanced filtering and search capabilities
- Report aggregation and trend analysis

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [ISC License](https://opensource.org/licenses/ISC).

## 👥 Authors

- Chrispine Ojow

## 🙏 Acknowledgments

This project aims to help communities better understand and manage their water resources through collaborative data collection.

---

**Note**: This application is designed to help communities track water resources. For critical water safety issues, please contact local authorities or water management organizations.

