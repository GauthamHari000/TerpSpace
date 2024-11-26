# TerpSpace

![Recording 2024-09-16 at 1 02 22 PM](https://github.com/user-attachments/assets/b3acde5e-443b-4b6c-8f5d-fe898c785375)

## Use Case
Students and faculty at UMD often struggle to find available classrooms for studying, meetings, or other activities when they need space on campus. With TerpSpace, students can quickly check room availability in any building, reducing the hassle of physically checking room schedules or making assumptions about room availability.

## Functionality/Development

- Designed an API with GET requests to retrieve real-time UMD classroom availability
- Scrapes UMD's 25Live platform for meeting data based on user's specified room and date
- Utilized a Python preprocessing script to check if there is an opening between a specified ***start_time*** and ***end_time***
- Implemented Redis caching to reduce external API calls (ie. if a user makes a subsequent call to the same building at a different time, why make an API call when we can keep a cache of recently requested items? We know that meeting times are not constantly changing in a given day)
- Utilized Postman for testing and debugging the API
- Deployed on Render for public access

## Test It Out
[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://god.gw.postman.com/run-collection/38362388-70a7bd52-f8d7-459a-9aab-6f36555df169?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D38362388-70a7bd52-f8d7-459a-9aab-6f36555df169%26entityType%3Dcollection%26workspaceId%3D788b4915-d531-40b0-aff7-e90479d89977)

Enter this link in your browser: ```https://terpspace.onrender.com/api/availability/?id=3032&start_time=2024-11-25T18:30:00&end_time=2024-11-25T21:30:00```

Change the ```start_time``` and ```end_time``` as you wish

Some examples for building ID's are:
- IRB 0318 --> ID is 3032
- MMH 0108 --> ID is 1844
- ESJ 0215 --> ID is 2950
