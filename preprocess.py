# preprocess.py

import sys
import json
from collections import defaultdict
from datetime import datetime, timedelta

def convert_to_timedelta(time):
    hours = int(time)
    minutes = (time - hours) * 60
    return timedelta(hours=hours, minutes=minutes)
def preprocess_data(response_json, start_time, end_time):
    TRUE_RET= {"available": "True"}
    FALSE_RET= {"available": "False"}
    result=defaultdict(list)
    for event in response_json['subjects']:
        date = str(event['item_date']).split('T')[0]  # Extract the date
        event_times = [(float(item['start']),float(item['end'])) for item in event['items'] if ('start' in item) and ('end' in item) and ('Closed' not in item['itemName'])]
        
        if event_times:
            result[str(date)] = event_times

    start = datetime.strptime(start_time, "%Y-%m-%dT%H:%M:%S")
    end = datetime.strptime(end_time, "%Y-%m-%dT%H:%M:%S")
    start_date = start.strftime("%Y-%m-%d")  
    start_timedelta = timedelta(hours=start.hour, minutes=start.minute, seconds=start.second)
    end_timedelta = timedelta(hours=end.hour, minutes=end.minute, seconds=end.second)

    prev_start=None
    prev_end=timedelta(hours=0,minutes=0,seconds=0)
    return_result=None
    flag=False
    for index in range(len(result[start_date])):
        curr_start,curr_end=result[start_date][index]
        curr_start=convert_to_timedelta(curr_start)
        curr_end=convert_to_timedelta(curr_end)
        if end_timedelta<=curr_start:
            if start_timedelta>=prev_end:
                return_result=TRUE_RET
                flag=True
                break
        prev_start=curr_start
        prev_end=curr_end

    if not flag:
        if start_timedelta>=prev_end:
            return_result=TRUE_RET
        else:
            return_result=FALSE_RET
               
    return return_result
 

if __name__ == "__main__":
    # Read arguments
    data_file_path = sys.argv[1]
    start_time = sys.argv[2]
    end_time = sys.argv[3]

    # Read JSON data from file
    with open(data_file_path, 'r') as file:
        data = json.load(file)

    # Process data
    result = preprocess_data(data, start_time, end_time)
    # Print result as JSON
    print(json.dumps(result))