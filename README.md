# disaster-resource-management-system
The National Disaster Management System (NDMS) is a centralized web-based platform developed to streamline disaster response, coordination, and resource management across India. 
##  Features

- *Real-time Data Management*: Full CRUD operations with instant updates
- *Weather Monitoring*: Dynamic weather data with AQI, UV index, and sunrise/sunset times
- *Resource Tracking*: Manage personnel, equipment, supplies, and vehicles
- *Incident Management*: Report, track, and manage emergency incidents
- *Team Coordination*: Deploy and manage response teams
- *Communication Center*: Internal messaging system

##  Prerequisites

- Node.js (v18 or higher)
- Python 3.8 or higher
- MongoDB (local or cloud instance)
- OpenWeatherMap API key (optional, for real-time weather data)

##  Installation & Setup

### Frontend Setup

1. Install dependencies:
bash
npm install


2. Start the development server:
bash
npm run dev


The frontend will run on http://localhost:5173 (or the port specified by Vite).

### Backend Setup

1. Navigate to the backend directory:
bash
cd backend


2. Install Python dependencies:
bash
pip install -r requirements.txt


3. Set up environment variables:
   - Create a .env file (optional) or set environment variables:
   - MONGO_URI: MongoDB connection string (default: mongodb://localhost:27017/)
   - OPENWEATHER_API_KEY: OpenWeatherMap API key (optional)

4. Start the backend server:
bash
python seed_data.py
python app.py


The backend will run on http://localhost:5000


##  Environment Variables

Create a .env file in the backend directory :

env
MONGO_URI=mongodb://localhost:27017/
OPENWEATHER_API_KEY=your_api_key_here


## 🤝 Contributing

This is a disaster management system project. Feel free to contribute improvements and new features.