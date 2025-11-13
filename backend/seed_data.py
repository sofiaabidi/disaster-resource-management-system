from pymongo import MongoClient
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB Configuration
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
client = MongoClient(MONGO_URI)
db = client['disaster_management']

# Clear existing data
print("Clearing existing data...")
db.alerts.delete_many({})
db.resources.delete_many({})
db.incidents.delete_many({})
db.teams.delete_many({})
db.evacuation_plans.delete_many({})
db.messages.delete_many({})
db.users.delete_many({})
db.weather.delete_many({})

print("Seeding database with initial data...")

# Helper function to get ISO timestamp
def get_timestamp(days_ago=0, hours_ago=0):
    return (datetime.utcnow() - timedelta(days=days_ago, hours=hours_ago)).isoformat() + 'Z'

# Seed Alerts
alerts = [
    {
        'title': 'Cyclone Biparjoy Approaching Gujarat Coast',
        'severity': 'critical',
        'type': 'natural',
        'location': 'Gujarat Coast',
        'description': 'Severe cyclonic storm with wind speeds up to 140 km/h expected to make landfall in 12 hours.',
        'status': 'active',
        'createdAt': get_timestamp(days_ago=0, hours_ago=2),
        'updatedAt': get_timestamp(hours_ago=0)
    },
    {
        'title': 'Flash Flood Warning - Mumbai',
        'severity': 'high',
        'type': 'natural',
        'location': 'Mumbai, Maharashtra',
        'description': 'Heavy rainfall expected in next 6 hours. Low-lying areas at risk of flooding.',
        'status': 'active',
        'createdAt': get_timestamp(hours_ago=1),
        'updatedAt': get_timestamp(hours_ago=1)
    },
    {
        'title': 'Forest Fire Contained - Uttarakhand',
        'severity': 'medium',
        'type': 'natural',
        'location': 'Nainital, Uttarakhand',
        'description': 'Forest fire in Nainital district has been successfully contained. Monitoring continues.',
        'status': 'resolved',
        'createdAt': get_timestamp(days_ago=1),
        'updatedAt': get_timestamp(hours_ago=6)
    },
    {
        'title': 'Earthquake Alert - Delhi NCR',
        'severity': 'medium',
        'type': 'natural',
        'location': 'Delhi NCR',
        'description': 'Mild tremors felt in Delhi NCR region. No major damage reported.',
        'status': 'monitoring',
        'createdAt': get_timestamp(hours_ago=4),
        'updatedAt': get_timestamp(hours_ago=3)
    }
]
result = db.alerts.insert_many(alerts)
print(f"✓ Seeded {len(result.inserted_ids)} alerts")

# Seed Resources
resources = [
    {
        'name': 'NDRF Teams',
        'type': 'personnel',
        'quantity': 45,
        'available': 32,
        'location': 'Multiple Locations',
        'status': 'available'
    },
    {
        'name': 'Rescue Helicopters',
        'type': 'vehicle',
        'quantity': 8,
        'available': 5,
        'location': 'Delhi, Mumbai, Chennai',
        'status': 'available'
    },
    {
        'name': 'Emergency Medical Kits',
        'type': 'supplies',
        'quantity': 500,
        'available': 350,
        'location': 'State Warehouses',
        'status': 'available'
    },
    {
        'name': 'Inflatable Boats',
        'type': 'equipment',
        'quantity': 25,
        'available': 18,
        'location': 'Coastal States',
        'status': 'available'
    },
    {
        'name': 'Ambulances',
        'type': 'vehicle',
        'quantity': 30,
        'available': 22,
        'location': 'Multiple Cities',
        'status': 'available'
    },
    {
        'name': 'Fire Trucks',
        'type': 'vehicle',
        'quantity': 15,
        'available': 10,
        'location': 'Fire Stations',
        'status': 'available'
    },
    {
        'name': 'Tents',
        'type': 'supplies',
        'quantity': 200,
        'available': 180,
        'location': 'Emergency Warehouses',
        'status': 'available'
    },
    {
        'name': 'Water Purification Units',
        'type': 'equipment',
        'quantity': 50,
        'available': 45,
        'location': 'Regional Centers',
        'status': 'available'
    }
]
result = db.resources.insert_many(resources)
print(f"✓ Seeded {len(result.inserted_ids)} resources")

# Seed Incidents
incidents = [
    {
        'title': 'Building Collapse in Mumbai',
        'type': 'Structural Failure',
        'severity': 'critical',
        'location': 'Dharavi, Mumbai',
        'coordinates': {'lat': 19.0433, 'lng': 72.8654},
        'description': 'Four-story residential building collapsed. Rescue operations in progress.',
        'reportedBy': 'Mumbai Fire Brigade',
        'status': 'responding',
        'assignedTeam': 'NDRF Battalion 1',
        'createdAt': get_timestamp(hours_ago=3),
        'updatedAt': get_timestamp(hours_ago=2)
    },
    {
        'title': 'Landslide on NH-44',
        'type': 'Natural Disaster',
        'severity': 'high',
        'location': 'Jammu & Kashmir',
        'coordinates': {'lat': 33.7782, 'lng': 76.5762},
        'description': 'Highway blocked due to landslide. Traffic diverted to alternate routes.',
        'reportedBy': 'NHAI Control Room',
        'status': 'investigating',
        'createdAt': get_timestamp(hours_ago=8),
        'updatedAt': get_timestamp(hours_ago=7)
    },
    {
        'title': 'Chemical Leak - Industrial Area',
        'type': 'Industrial Accident',
        'severity': 'high',
        'location': 'Pune Industrial Area',
        'coordinates': {'lat': 18.5204, 'lng': 73.8567},
        'description': 'Chemical leak detected in manufacturing unit. Area being evacuated.',
        'reportedBy': 'Industrial Safety Officer',
        'status': 'responding',
        'assignedTeam': 'Fire Response Team Alpha',
        'createdAt': get_timestamp(hours_ago=5),
        'updatedAt': get_timestamp(hours_ago=4)
    },
    {
        'title': 'Traffic Accident - Highway',
        'type': 'Accident',
        'severity': 'medium',
        'location': 'Delhi-Jaipur Highway',
        'coordinates': {'lat': 28.4595, 'lng': 77.0266},
        'description': 'Multi-vehicle collision on highway. Emergency services on site.',
        'reportedBy': 'Highway Patrol',
        'status': 'resolved',
        'createdAt': get_timestamp(days_ago=1),
        'updatedAt': get_timestamp(hours_ago=12)
    }
]
result = db.incidents.insert_many(incidents)
print(f"✓ Seeded {len(result.inserted_ids)} incidents")

# Seed Teams
teams = [
    {
        'name': 'NDRF Battalion 1',
        'type': 'rescue',
        'leader': 'Commandant Rajesh Kumar',
        'members': ['Inspector A. Sharma', 'Inspector B. Singh', 'Head Constable C. Verma', 'Constable D. Patel', 'Constable E. Yadav'],
        'status': 'deployed',
        'location': 'Mumbai',
        'equipment': ['Rescue Equipment', 'Medical Supplies', 'Communication Devices'],
        'contact': '+91-9876543210'
    },
    {
        'name': 'Fire Response Team Alpha',
        'type': 'fire',
        'leader': 'Chief Fire Officer M. Patel',
        'members': ['Fire Officer D. Kumar', 'Fire Officer E. Yadav', 'Driver F. Shah'],
        'status': 'deployed',
        'location': 'Pune',
        'equipment': ['Fire Trucks', 'Ladders', 'Breathing Apparatus'],
        'contact': '+91-9876543211'
    },
    {
        'name': 'Medical Emergency Team Beta',
        'type': 'medical',
        'leader': 'Dr. Sarah Johnson',
        'members': ['Dr. K. Reddy', 'Nurse L. Singh', 'Paramedic M. Khan'],
        'status': 'available',
        'location': 'Delhi',
        'equipment': ['Ambulances', 'Medical Kits', 'Defibrillators'],
        'contact': '+91-9876543212'
    },
    {
        'name': 'Police Rapid Response Unit',
        'type': 'police',
        'leader': 'Inspector General N. Mishra',
        'members': ['Inspector O. Gupta', 'Sub-Inspector P. Joshi', 'Constable Q. Rao'],
        'status': 'available',
        'location': 'Bangalore',
        'equipment': ['Patrol Vehicles', 'Communication Equipment', 'First Aid Kits'],
        'contact': '+91-9876543213'
    }
]
result = db.teams.insert_many(teams)
print(f"✓ Seeded {len(result.inserted_ids)} teams")

# Seed Evacuation Plans
evacuation_plans = [
    {
        'name': 'Mumbai Coastal Evacuation Plan',
        'area': 'Mumbai Coastal Areas',
        'capacity': 50000,
        'shelters': [
            {
                'id': 'shelter-1',
                'name': 'Nehru Stadium',
                'location': 'Mumbai',
                'capacity': 10000,
                'currentOccupancy': 0,
                'facilities': ['Food', 'Water', 'Medical Aid', 'Restrooms'],
                'contact': '+91-9876543212',
                'status': 'operational'
            },
            {
                'id': 'shelter-2',
                'name': 'Community Hall Complex',
                'location': 'Bandra, Mumbai',
                'capacity': 5000,
                'currentOccupancy': 0,
                'facilities': ['Food', 'Water', 'Restrooms'],
                'contact': '+91-9876543213',
                'status': 'operational'
            }
        ],
        'routes': [
            {
                'id': 'route-1',
                'name': 'Coastal Route A',
                'from': 'Juhu Beach',
                'to': 'Nehru Stadium',
                'distance': '8.5 km',
                'estimatedTime': '25 minutes',
                'status': 'clear'
            },
            {
                'id': 'route-2',
                'name': 'Coastal Route B',
                'from': 'Marine Drive',
                'to': 'Community Hall Complex',
                'distance': '5.2 km',
                'estimatedTime': '15 minutes',
                'status': 'clear'
            }
        ],
        'status': 'active',
        'lastUpdated': get_timestamp()
    },
    {
        'name': 'Delhi Flood Evacuation Plan',
        'area': 'Yamuna River Basin',
        'capacity': 30000,
        'shelters': [
            {
                'id': 'shelter-3',
                'name': 'Delhi University Campus',
                'location': 'North Delhi',
                'capacity': 15000,
                'currentOccupancy': 0,
                'facilities': ['Food', 'Water', 'Medical Aid', 'Restrooms', 'Power Backup'],
                'contact': '+91-9876543214',
                'status': 'operational'
            }
        ],
        'routes': [
            {
                'id': 'route-3',
                'name': 'River Route A',
                'from': 'Yamuna Bank',
                'to': 'Delhi University Campus',
                'distance': '6.8 km',
                'estimatedTime': '20 minutes',
                'status': 'clear'
            }
        ],
        'status': 'active',
        'lastUpdated': get_timestamp()
    }
]
result = db.evacuation_plans.insert_many(evacuation_plans)
print(f"✓ Seeded {len(result.inserted_ids)} evacuation plans")

# Seed Messages
messages = [
    {
        'from': 'Control Room Delhi',
        'to': 'All Teams',
        'subject': 'Alert Status Update',
        'content': 'All teams please confirm your current status and location for the evening briefing.',
        'priority': 'high',
        'status': 'sent',
        'timestamp': get_timestamp(hours_ago=2)
    },
    {
        'from': 'NDRF HQ',
        'to': 'Team Leaders',
        'subject': 'Equipment Maintenance Schedule',
        'content': 'Monthly equipment maintenance is scheduled for next week. Please prepare your inventories.',
        'priority': 'normal',
        'status': 'sent',
        'timestamp': get_timestamp(hours_ago=5)
    },
    {
        'from': 'Emergency Command',
        'to': 'NDRF Battalion 1',
        'subject': 'Urgent Deployment Request',
        'content': 'Immediate deployment required for building collapse incident in Mumbai. Proceed with full rescue gear.',
        'priority': 'urgent',
        'status': 'sent',
        'timestamp': get_timestamp(hours_ago=3)
    },
    {
        'from': 'Weather Monitoring',
        'to': 'All Teams',
        'subject': 'Cyclone Warning',
        'content': 'Cyclone expected to make landfall in 12 hours. All coastal teams on high alert.',
        'priority': 'urgent',
        'status': 'sent',
        'timestamp': get_timestamp(hours_ago=1)
    }
]
result = db.messages.insert_many(messages)
print(f"✓ Seeded {len(result.inserted_ids)} messages")

# Seed Users
# Seed Users
users = [
    {
        'username': 'admin',
        'password': 'Admin123##',  # In production, HASH THIS!
        'name': 'Dr. Arvind Kumar',
        'role': 'Disaster Management Coordinator',
        'department': 'NDMA',
        'contact': '+91-9876543213',
        'lastActive': get_timestamp()
    },
    {
        'username': 'operator1',
        'password': 'Password123@',
        'name': 'Priya Sharma',
        'role': 'Emergency Response Officer',
        'department': 'State Emergency',
        'contact': '+91-9876543214',
        'lastActive': get_timestamp(hours_ago=1)
    },
    {
        'username': 'operator2',
        'password': 'TommyTheDOg@781',
        'name': 'Rajesh Patel',
        'role': 'Communication Specialist',
        'department': 'Emergency Services',
        'contact': '+91-9876543215',
        'lastActive': get_timestamp(hours_ago=2)
    },
    {
        'username': 'operator3',
        'password': 'OpsDisasMan67$',
        'name': 'Meera Singh',
        'role': 'Resource Manager',
        'department': 'NDMA',
        'contact': '+91-9876543216',
        'lastActive': get_timestamp()
    }
]
result = db.users.insert_many(users)
print(f"✓ Seeded {len(result.inserted_ids)} users")

# Seed Weather Data
weather_data = {
    'location': 'Delhi',
    'temperature': 28,
    'humidity': 65,
    'windSpeed': 15,
    'visibility': 8,
    'condition': 'Partly Cloudy',
    'alerts': ['Heat Wave Warning'],
    'forecast': [
        {'date': (datetime.utcnow() + timedelta(days=1)).strftime('%Y-%m-%d'), 'high': 32, 'low': 22, 'condition': 'Sunny', 'precipitation': 0},
        {'date': (datetime.utcnow() + timedelta(days=2)).strftime('%Y-%m-%d'), 'high': 30, 'low': 20, 'condition': 'Cloudy', 'precipitation': 10},
        {'date': (datetime.utcnow() + timedelta(days=3)).strftime('%Y-%m-%d'), 'high': 28, 'low': 18, 'condition': 'Rainy', 'precipitation': 80}
    ]
}
db.weather.insert_one(weather_data)
print("✓ Seeded weather data")

print("\n✅ Database seeding completed successfully!")
print(f"\nDatabase Statistics:")
print(f"  - Alerts: {db.alerts.count_documents({})}")
print(f"  - Resources: {db.resources.count_documents({})}")
print(f"  - Incidents: {db.incidents.count_documents({})}")
print(f"  - Teams: {db.teams.count_documents({})}")
print(f"  - Evacuation Plans: {db.evacuation_plans.count_documents({})}")
print(f"  - Messages: {db.messages.count_documents({})}")
print(f"  - Users: {db.users.count_documents({})}")
print(f"  - Weather: {db.weather.count_documents({})}")

# Close connection
client.close()