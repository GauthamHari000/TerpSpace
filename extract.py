import requests
import json

# URL to fetch data
url = "https://25live.collegenet.com/25live/data/umd/run/availability/availabilitydata.json?obj_cache_accl=0&start_dt=2024-09-15T00:00:00&comptype=availability_daily&compsubject=location&page_size=100&space_id=3032&include=closed+blackouts+pending+related+empty&caller=pro-AvailService.getData"

# Fetch the JSON data from the URL
response = requests.get(url)
data = response.json()

# Extract and process availability data
availability = []

# Iterate through the 'subjects' key to get each day's data
for subject in data.get('subjects', []):
    item_name = subject.get('itemName')
    item_date = subject.get('item_date')
    items = subject.get('items', [])
    
    for item in items:
        availability.append({
            'date': item_date,
            'name': item_name,
            'event_name': item.get('itemName'),
            'start_time': item.get('start'),
            'end_time': item.get('end'),
            'capacity': item.get('rhc_cap'),
            'event_state': item.get('cur_event_state')
        })

# Print the extracted availability information
for entry in availability:
    print(f"Date: {entry['date']}, Name: {entry['name']}, Event: {entry['event_name']}, Start: {entry['start_time']}, End: {entry['end_time']}, Capacity: {entry['capacity']}, State: {entry['event_state']}")
