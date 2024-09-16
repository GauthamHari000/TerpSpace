[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://god.gw.postman.com/run-collection/38362388-70a7bd52-f8d7-459a-9aab-6f36555df169?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D38362388-70a7bd52-f8d7-459a-9aab-6f36555df169%26entityType%3Dcollection%26workspaceId%3D788b4915-d531-40b0-aff7-e90479d89977)
Overview
TerpSpace is a real-time API designed to provide classroom availability information at the University of Maryland (UMD). The API scrapes data from UMD’s 25Live platform and enables users to query classroom availability by building name and time.

Key Features:
Real-time data scraping from UMD’s 25Live platform.
GET requests to check room availability for a specific building and time.
Publicly accessible and hosted on Render.
Tested using Postman for consistent, reliable results.
How It Works
The TerpSpace API scrapes availability data from the 25Live website and processes it to return relevant availability information for requested classrooms. Here's a breakdown of how it functions:

Data Scraping: The API uses a scraping tool to fetch the current availability for UMD classrooms.
Querying Availability: It allows users to specify a building and time range, then checks which rooms are available within that period.
GET Requests: The API is designed around GET requests, allowing for easy interaction with endpoints to retrieve classroom availability data.
