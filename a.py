import requests

url = "https://api.umd.io/v1/map/buildings"

response = requests.get(url)

json_format = response.json()
lst_buildings=[]
for building_json in json_format:
    lst_buildings.append(str(building_json['name']))

    
print(lst_buildings)

