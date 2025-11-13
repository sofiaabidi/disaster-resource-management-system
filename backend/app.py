import requests
import os
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime, timedelta
import copy

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# MongoDB Configuration
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
client = MongoClient(MONGO_URI)
db = client['disaster_management']

# Collections
alerts_collection = db['alerts']
resources_collection = db['resources']
incidents_collection = db['incidents']
teams_collection = db['teams']
evacuation_plans_collection = db['evacuation_plans']
messages_collection = db['messages']
users_collection = db['users']
weather_collection = db['weather']

# Helper function to convert ObjectId to string
def serialize_doc(doc):
    if doc and '_id' in doc:
        doc['id'] = str(doc['_id'])
        del doc['_id']
    return doc

# ============= ALERTS ENDPOINTS =============
@app.route('/api/alerts', methods=['GET'])
def get_alerts():
    try:
        alerts = list(alerts_collection.find())
        return jsonify([serialize_doc(alert) for alert in alerts]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/alerts/<alert_id>', methods=['GET'])
def get_alert(alert_id):
    try:
        alert = alerts_collection.find_one({'_id': ObjectId(alert_id)})
        if alert:
            return jsonify(serialize_doc(alert)), 200
        return jsonify({'error': 'Alert not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/alerts', methods=['POST'])
def create_alert():
    try:
        data = copy.deepcopy(request.json)
        data['createdAt'] = datetime.utcnow().isoformat() + 'Z'
        data['updatedAt'] = datetime.utcnow().isoformat() + 'Z'
        result = alerts_collection.insert_one(data)
        # Fetch the created document to ensure proper serialization
        created_alert = alerts_collection.find_one({'_id': result.inserted_id})
        return jsonify(serialize_doc(created_alert)), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/alerts/<alert_id>', methods=['PUT'])
def update_alert(alert_id):
    try:
        data = request.json
        data['updatedAt'] = datetime.utcnow().isoformat() + 'Z'
        result = alerts_collection.update_one(
            {'_id': ObjectId(alert_id)},
            {'$set': data}
        )
        if result.matched_count:
            return jsonify({'message': 'Alert updated successfully'}), 200
        return jsonify({'error': 'Alert not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/alerts/<alert_id>', methods=['DELETE'])
def delete_alert(alert_id):
    try:
        result = alerts_collection.delete_one({'_id': ObjectId(alert_id)})
        if result.deleted_count:
            return jsonify({'message': 'Alert deleted successfully'}), 200
        return jsonify({'error': 'Alert not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============= RESOURCES ENDPOINTS =============
@app.route('/api/resources', methods=['GET'])
def get_resources():
    try:
        resources = list(resources_collection.find())
        return jsonify([serialize_doc(resource) for resource in resources]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/resources', methods=['POST'])
def create_resource():
    try:
        data = copy.deepcopy(request.json)
        result = resources_collection.insert_one(data)
        # Fetch the created document to ensure proper serialization
        created_resource = resources_collection.find_one({'_id': result.inserted_id})
        return jsonify(serialize_doc(created_resource)), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/resources/<resource_id>', methods=['PUT'])
def update_resource(resource_id):
    try:
        data = request.json
        result = resources_collection.update_one(
            {'_id': ObjectId(resource_id)},
            {'$set': data}
        )
        if result.matched_count:
            return jsonify({'message': 'Resource updated successfully'}), 200
        return jsonify({'error': 'Resource not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/resources/<resource_id>', methods=['DELETE'])
def delete_resource(resource_id):
    try:
        result = resources_collection.delete_one({'_id': ObjectId(resource_id)})
        if result.deleted_count:
            return jsonify({'message': 'Resource deleted successfully'}), 200
        return jsonify({'error': 'Resource not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============= INCIDENTS ENDPOINTS =============
@app.route('/api/incidents', methods=['GET'])
def get_incidents():
    try:
        incidents = list(incidents_collection.find())
        return jsonify([serialize_doc(incident) for incident in incidents]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/incidents', methods=['POST'])
def create_incident():
    try:
        data = copy.deepcopy(request.json)
        data['createdAt'] = datetime.utcnow().isoformat() + 'Z'
        data['updatedAt'] = datetime.utcnow().isoformat() + 'Z'
        result = incidents_collection.insert_one(data)
        # Fetch the created document to ensure proper serialization
        created_incident = incidents_collection.find_one({'_id': result.inserted_id})
        return jsonify(serialize_doc(created_incident)), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/incidents/<incident_id>', methods=['PUT'])
def update_incident(incident_id):
    try:
        data = request.json
        data['updatedAt'] = datetime.utcnow().isoformat() + 'Z'
        result = incidents_collection.update_one(
            {'_id': ObjectId(incident_id)},
            {'$set': data}
        )
        if result.matched_count:
            return jsonify({'message': 'Incident updated successfully'}), 200
        return jsonify({'error': 'Incident not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/incidents/<incident_id>', methods=['DELETE'])
def delete_incident(incident_id):
    try:
        result = incidents_collection.delete_one({'_id': ObjectId(incident_id)})
        if result.deleted_count:
            return jsonify({'message': 'Incident deleted successfully'}), 200
        return jsonify({'error': 'Incident not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============= TEAMS ENDPOINTS =============
@app.route('/api/teams', methods=['GET'])
def get_teams():
    try:
        teams = list(teams_collection.find())
        return jsonify([serialize_doc(team) for team in teams]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/teams', methods=['POST'])
def create_team():
    try:
        data = copy.deepcopy(request.json)
        result = teams_collection.insert_one(data)
        # Fetch the created document to ensure proper serialization
        created_team = teams_collection.find_one({'_id': result.inserted_id})
        return jsonify(serialize_doc(created_team)), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/teams/<team_id>', methods=['PUT'])
def update_team(team_id):
    try:
        data = request.json
        result = teams_collection.update_one(
            {'_id': ObjectId(team_id)},
            {'$set': data}
        )
        if result.matched_count:
            return jsonify({'message': 'Team updated successfully'}), 200
        return jsonify({'error': 'Team not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/teams/<team_id>', methods=['DELETE'])
def delete_team(team_id):
    try:
        result = teams_collection.delete_one({'_id': ObjectId(team_id)})
        if result.deleted_count:
            return jsonify({'message': 'Team deleted successfully'}), 200
        return jsonify({'error': 'Team not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============= EVACUATION PLANS ENDPOINTS =============
@app.route('/api/evacuation-plans', methods=['GET'])
def get_evacuation_plans():
    try:
        plans = list(evacuation_plans_collection.find())
        return jsonify([serialize_doc(plan) for plan in plans]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/evacuation-plans', methods=['POST'])
def create_evacuation_plan():
    try:
        data = copy.deepcopy(request.json)
        data['lastUpdated'] = datetime.utcnow().isoformat() + 'Z'
        result = evacuation_plans_collection.insert_one(data)
        # Fetch the created document to ensure proper serialization
        created_plan = evacuation_plans_collection.find_one({'_id': result.inserted_id})
        return jsonify(serialize_doc(created_plan)), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/evacuation-plans/<plan_id>', methods=['PUT'])
def update_evacuation_plan(plan_id):
    try:
        data = request.json
        data['lastUpdated'] = datetime.utcnow().isoformat() + 'Z'
        result = evacuation_plans_collection.update_one(
            {'_id': ObjectId(plan_id)},
            {'$set': data}
        )
        if result.matched_count:
            return jsonify({'message': 'Evacuation plan updated successfully'}), 200
        return jsonify({'error': 'Evacuation plan not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/evacuation-plans/<plan_id>', methods=['DELETE'])
def delete_evacuation_plan(plan_id):
    try:
        result = evacuation_plans_collection.delete_one({'_id': ObjectId(plan_id)})
        if result.deleted_count:
            return jsonify({'message': 'Evacuation plan deleted successfully'}), 200
        return jsonify({'error': 'Evacuation plan not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============= MESSAGES ENDPOINTS =============
@app.route('/api/messages', methods=['GET'])
def get_messages():
    try:
        messages = list(messages_collection.find().sort('timestamp', -1))
        return jsonify([serialize_doc(message) for message in messages]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/messages', methods=['POST'])
def create_message():
    try:
        data = copy.deepcopy(request.json)
        data['timestamp'] = datetime.utcnow().isoformat() + 'Z'
        result = messages_collection.insert_one(data)
        # Fetch the created document to ensure proper serialization
        created_message = messages_collection.find_one({'_id': result.inserted_id})
        return jsonify(serialize_doc(created_message)), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============= WEATHER ENDPOINTS =============
# Fallback data for cities (average values per city)
CITY_FALLBACK_DATA = {
    'Delhi': {
        'aqi': {'overall': 185, 'pm25': 95, 'pm10': 165, 'level': 'Unhealthy'},
        'uvIndex': {'value': 8, 'level': 'Very High'},
        'sunTimes': {'sunrise': '06:42', 'sunset': '18:15'}
    },
    'Mumbai': {
        'aqi': {'overall': 142, 'pm25': 68, 'pm10': 125, 'level': 'Unhealthy for Sensitive'},
        'uvIndex': {'value': 7, 'level': 'High'},
        'sunTimes': {'sunrise': '06:45', 'sunset': '18:30'}
    },
    'Chennai': {
        'aqi': {'overall': 128, 'pm25': 58, 'pm10': 112, 'level': 'Moderate'},
        'uvIndex': {'value': 9, 'level': 'Very High'},
        'sunTimes': {'sunrise': '06:20', 'sunset': '18:20'}
    },
    'Kolkata': {
        'aqi': {'overall': 165, 'pm25': 82, 'pm10': 148, 'level': 'Unhealthy'},
        'uvIndex': {'value': 7, 'level': 'High'},
        'sunTimes': {'sunrise': '05:45', 'sunset': '17:50'}
    },
    'Bangalore': {
        'aqi': {'overall': 95, 'pm25': 42, 'pm10': 88, 'level': 'Moderate'},
        'uvIndex': {'value': 8, 'level': 'Very High'},
        'sunTimes': {'sunrise': '06:30', 'sunset': '18:25'}
    },
    'Hyderabad': {
        'aqi': {'overall': 112, 'pm25': 52, 'pm10': 98, 'level': 'Moderate'},
        'uvIndex': {'value': 8, 'level': 'Very High'},
        'sunTimes': {'sunrise': '06:25', 'sunset': '18:20'}
    },
    'Ahmedabad': {
        'aqi': {'overall': 155, 'pm25': 75, 'pm10': 138, 'level': 'Unhealthy'},
        'uvIndex': {'value': 8, 'level': 'Very High'},
        'sunTimes': {'sunrise': '06:50', 'sunset': '18:35'}
    },
    'Pune': {
        'aqi': {'overall': 108, 'pm25': 48, 'pm10': 95, 'level': 'Moderate'},
        'uvIndex': {'value': 7, 'level': 'High'},
        'sunTimes': {'sunrise': '06:40', 'sunset': '18:30'}
    },
    'Jaipur': {
        'aqi': {'overall': 145, 'pm25': 70, 'pm10': 128, 'level': 'Unhealthy for Sensitive'},
        'uvIndex': {'value': 8, 'level': 'Very High'},
        'sunTimes': {'sunrise': '06:35', 'sunset': '18:20'}
    },
    'Lucknow': {
        'aqi': {'overall': 172, 'pm25': 88, 'pm10': 155, 'level': 'Unhealthy'},
        'uvIndex': {'value': 7, 'level': 'High'},
        'sunTimes': {'sunrise': '06:25', 'sunset': '18:10'}
    }
}

def get_uv_level(uv_index):
    """Convert UV index value to level"""
    if uv_index <= 2:
        return 'Low'
    elif uv_index <= 5:
        return 'Moderate'
    elif uv_index <= 7:
        return 'High'
    elif uv_index <= 10:
        return 'Very High'
    else:
        return 'Extreme'

def get_aqi_level(aqi):
    """Convert AQI value to level"""
    if aqi <= 50:
        return 'Good'
    elif aqi <= 100:
        return 'Moderate'
    elif aqi <= 150:
        return 'Unhealthy for Sensitive'
    elif aqi <= 200:
        return 'Unhealthy'
    elif aqi <= 300:
        return 'Very Unhealthy'
    else:
        return 'Hazardous'

def format_time_from_timestamp(timestamp, timezone_offset=0):
    """Convert Unix timestamp to HH:MM format"""
    dt = datetime.utcfromtimestamp(timestamp) + timedelta(seconds=timezone_offset)
    # Format as HH:MM AM/PM
    time_str = dt.strftime('%I:%M %p')
    # Remove leading zero from hour
    if time_str[0] == '0':
        time_str = time_str[1:]
    return time_str

def get_fallback_data(city_name):
    """Get fallback data for a city"""
    # Try exact match first
    city_key = city_name.title()
    if city_key in CITY_FALLBACK_DATA:
        return CITY_FALLBACK_DATA[city_key]
    
    # Try partial match
    for key, value in CITY_FALLBACK_DATA.items():
        if key.lower() in city_name.lower() or city_name.lower() in key.lower():
            return value
    
    # Default fallback
    return {
        'aqi': {'overall': 120, 'pm25': 55, 'pm10': 105, 'level': 'Moderate'},
        'uvIndex': {'value': 7, 'level': 'High'},
        'sunTimes': {'sunrise': '06:30', 'sunset': '18:15'}
    }

@app.route('/api/weather/<location>', methods=['GET'])
def get_weather(location):
    try:
        api_key = os.getenv('OPENWEATHER_API_KEY')
        use_api = bool(api_key)
        weather_data = None
        forecast_data = None
        air_pollution_data = None
        
        if use_api:
            try:
                # Get current weather
                weather_url = f'https://api.openweathermap.org/data/2.5/weather?q={location}&appid={api_key}&units=metric'
                weather_response = requests.get(weather_url, timeout=5)
                
                if weather_response.status_code == 200:
                    weather_data = weather_response.json()
                    
                    # Get forecast
                    forecast_url = f'https://api.openweathermap.org/data/2.5/forecast?q={location}&appid={api_key}&units=metric'
                    forecast_response = requests.get(forecast_url, timeout=5)
                    if forecast_response.status_code == 200:
                        forecast_data = forecast_response.json()
                    
                    # Get air pollution data (if coordinates available)
                    if 'coord' in weather_data:
                        lat = weather_data['coord']['lat']
                        lon = weather_data['coord']['lon']
                        air_url = f'http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={api_key}'
                        air_response = requests.get(air_url, timeout=5)
                        if air_response.status_code == 200:
                            air_pollution_data = air_response.json()
            except Exception as api_error:
                print(f"API Error: {api_error}")
                use_api = False
        
        # Process forecast data
        daily_forecast = []
        if forecast_data and 'list' in forecast_data:
            seen_dates = set()
            for item in forecast_data.get('list', [])[:24]:
                date = item['dt_txt'].split(' ')[0]
                if date not in seen_dates and len(daily_forecast) < 3:
                    seen_dates.add(date)
                    daily_forecast.append({
                        'date': date,
                        'high': int(item['main']['temp_max']),
                        'low': int(item['main']['temp_min']),
                        'condition': item['weather'][0]['main'],
                        'precipitation': int(item.get('pop', 0) * 100)
                    })
        
        # Format response with real or fallback data
        # Store original location for fallback lookup
        original_location = location
        
        if weather_data:
            # Real API data
            result = {
                'location': weather_data['name'],
                'temperature': int(weather_data['main']['temp']),
                'humidity': weather_data['main']['humidity'],
                'windSpeed': int(weather_data['wind']['speed'] * 3.6),
                'visibility': int(weather_data.get('visibility', 10000) / 1000),
                'condition': weather_data['weather'][0]['main'],
                'alerts': [],
                'forecast': daily_forecast
            }
            
            # Get sunrise/sunset from API
            if 'sys' in weather_data:
                timezone_offset = weather_data.get('timezone', 0)
                sunrise_ts = weather_data['sys'].get('sunrise', 0)
                sunset_ts = weather_data['sys'].get('sunset', 0)
                if sunrise_ts and sunset_ts:
                    result['sunTimes'] = {
                        'sunrise': format_time_from_timestamp(sunrise_ts, timezone_offset),
                        'sunset': format_time_from_timestamp(sunset_ts, timezone_offset)
                    }
            
            # Get AQI from API
            if air_pollution_data and 'list' in air_pollution_data and len(air_pollution_data['list']) > 0:
                air = air_pollution_data['list'][0]['main']
                components = air_pollution_data['list'][0]['components']
                pm25 = components.get('pm2_5', 0)
                pm10 = components.get('pm10', 0)
                
                # Calculate AQI from PM2.5 and PM10 (using the higher of the two)
                # AQI calculation based on US EPA standards
                # For PM2.5: AQI = ((I_high - I_low) / (C_high - C_low)) * (C - C_low) + I_low
                # Simplified: use max of PM2.5 and PM10 based AQI
                aqi_from_pm25 = pm25 * 2  # Rough conversion (PM2.5 in µg/m³ to AQI)
                aqi_from_pm10 = pm10  # Rough conversion (PM10 in µg/m³ to AQI)
                aqi_value = max(aqi_from_pm25, aqi_from_pm10)
                
                # Cap at reasonable maximum
                aqi_value = min(int(aqi_value), 300)
                
                result['aqi'] = {
                    'overall': aqi_value,
                    'pm25': int(pm25),
                    'pm10': int(pm10),
                    'level': get_aqi_level(aqi_value)
                }
            
            # Calculate UV index (estimate based on time and location)
            # In real implementation, you'd use One Call API, but for free tier we estimate
            # Use city-specific fallback data as baseline, adjusted by time of day
            # Try original location first, then API location name
            fallback_uv_data = get_fallback_data(original_location)
            if not fallback_uv_data.get('uvIndex'):
                fallback_uv_data = get_fallback_data(result['location'])
            fallback_uv = fallback_uv_data.get('uvIndex', {}).get('value', 7)
            current_hour = datetime.utcnow().hour
            
            # Adjust UV based on time of day (peak around noon, lowest at night)
            if 10 <= current_hour <= 14:
                # Peak hours: use full UV value
                uv_estimate = fallback_uv
            elif 8 <= current_hour <= 16:
                # Near peak: slightly lower
                uv_estimate = max(5, fallback_uv - 1)
            elif 6 <= current_hour <= 18:
                # Early morning/late afternoon: moderate
                uv_estimate = max(3, fallback_uv - 3)
            else:
                # Night time: very low
                uv_estimate = 1
            
            result['uvIndex'] = {
                'value': uv_estimate,
                'level': get_uv_level(uv_estimate)
            }
        else:
            # Fallback data
            fallback = get_fallback_data(location)
            result = {
                'location': location,
                'temperature': 28,
                'humidity': 65,
                'windSpeed': 15,
                'visibility': 8,
                'condition': 'Partly Cloudy',
                'alerts': [],
                'forecast': daily_forecast if daily_forecast else [
                    {'date': datetime.now().strftime('%Y-%m-%d'), 'high': 30, 'low': 22, 'condition': 'Partly Cloudy', 'precipitation': 20}
                ],
                'aqi': fallback['aqi'],
                'uvIndex': fallback['uvIndex'],
                'sunTimes': fallback['sunTimes']
            }
        
        # Add fallback for missing fields (use original location for lookup)
        if 'aqi' not in result:
            fallback = get_fallback_data(original_location)
            result['aqi'] = fallback['aqi']
        
        if 'uvIndex' not in result:
            fallback = get_fallback_data(original_location)
            result['uvIndex'] = fallback['uvIndex']
        
        if 'sunTimes' not in result:
            fallback = get_fallback_data(original_location)
            result['sunTimes'] = fallback['sunTimes']
        
        # Add weather alerts if temperature is extreme
        if result['temperature'] > 35:
            result['alerts'].append('Heat Wave Warning')
        elif result['temperature'] < 5:
            result['alerts'].append('Cold Wave Warning')
        
        if result.get('condition') == 'Rain':
            result['alerts'].append('Heavy Rainfall Expected')
        
        # Add AQI alerts
        if result.get('aqi', {}).get('overall', 0) > 150:
            result['alerts'].append('Poor Air Quality Warning')
        
        # Add UV alerts
        if result.get('uvIndex', {}).get('value', 0) >= 8:
            result['alerts'].append('High UV Index - Protective Measures Recommended')
        
        return jsonify(result), 200
        
    except Exception as e:
        # Return fallback data on error
        fallback = get_fallback_data(location)
        result = {
            'location': location,
            'temperature': 28,
            'humidity': 65,
            'windSpeed': 15,
            'visibility': 8,
            'condition': 'Partly Cloudy',
            'alerts': [],
            'forecast': [],
            'aqi': fallback['aqi'],
            'uvIndex': fallback['uvIndex'],
            'sunTimes': fallback['sunTimes']
        }
        return jsonify(result), 200

# ============= ANALYTICS ENDPOINT =============
@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    try:
        total_incidents = incidents_collection.count_documents({})
        resolved_incidents = incidents_collection.count_documents({'status': 'resolved'})
        active_incidents = incidents_collection.count_documents({'status': {'$ne': 'resolved'}})
        
        analytics = {
            'totalIncidents': total_incidents,
            'resolvedIncidents': resolved_incidents,
            'activeIncidents': active_incidents,
            'averageResponseTime': '18 minutes',
            'resourceUtilization': 78,
            'monthlyIncidents': [
                {'month': 'Jan', 'incidents': 12},
                {'month': 'Feb', 'incidents': 8},
                {'month': 'Mar', 'incidents': 15},
                {'month': 'Apr', 'incidents': 22},
                {'month': 'May', 'incidents': 18},
                {'month': 'Jun', 'incidents': 25}
            ],
            'incidentsByType': [
                {'type': 'Natural Disaster', 'count': 45},
                {'type': 'Fire', 'count': 32},
                {'type': 'Medical Emergency', 'count': 28},
                {'type': 'Accident', 'count': 25},
                {'type': 'Other', 'count': 26}
            ]
        }
        return jsonify(analytics), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============= USERS ENDPOINTS =============
@app.route('/api/users', methods=['GET'])
def get_users():
    try:
        users = list(users_collection.find())
        return jsonify([serialize_doc(user) for user in users]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'Server is running'}), 200

# ============= AUTH ENDPOINTS =============
def validate_password_rules(password):
    """
    Checks if the password follows standard security rules:
    - At least 8 characters
    - At least one uppercase
    - At least one lowercase
    - At least one digit
    - At least one special character
    """
    rules = []
    if len(password) < 8:
        rules.append("Password must be at least 8 characters long.")
    if not re.search(r"[A-Z]", password):
        rules.append("Password must contain at least one uppercase letter.")
    if not re.search(r"[a-z]", password):
        rules.append("Password must contain at least one lowercase letter.")
    if not re.search(r"\d", password):
        rules.append("Password must contain at least one number.")
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        rules.append("Password must contain at least one special character.")
    
    if rules:
        print("\n⚠️ PASSWORD VALIDATION FAILED:")
        for rule in rules:
            print(f" - {rule}")
        return False
    return True


@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Username and password required'}), 400
        
        # Check if user exists
        user = users_collection.find_one({'username': username})
        
        if not user:
            #  Password validation before user creation
            if not validate_password_rules(password):
                return jsonify({'error': 'Password does not meet security requirements. Check console for details.'}), 400

            user_data = {
                'username': username,
                'password': password,  # No hashing, as per your request
                'name': username.title(),
                'role': 'Operator',
                'department': 'Emergency Services',
                'contact': '+91-0000000000',
                'lastActive': datetime.utcnow().isoformat() + 'Z'
            }
            result = users_collection.insert_one(user_data)
            user_data['id'] = str(result.inserted_id)
            del user_data['_id']
            return jsonify({'success': True, 'user': user_data}), 201
        
        # Verify password
        if user.get('password') != password:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Update last active
        users_collection.update_one(
            {'_id': user['_id']},
            {'$set': {'lastActive': datetime.utcnow().isoformat() + 'Z'}}
        )
        
        user_data = serialize_doc(user)
        del user_data['password']  # Don't send password back
        
        return jsonify({'success': True, 'user': user_data}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)