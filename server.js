const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');
const redis = require('redis'); 

const app = express();
const port = 3000;

app.use(bodyParser.json());

const redisClient = redis.createClient({
  url: 'redis://:xpDvnMrrnJ95wgI57loi7xK7C9rQCSYA@redis-10274.c322.us-east-1-2.ec2.redns.redis-cloud.com:10274', // Render-provided Redis URL
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});
redisClient.connect().catch(console.error);

async function checkCache(cacheKey) {
  if (!redisClient.isOpen) {
    await redisClient.connect(); 
  }
  try {
    const data = await redisClient.get(cacheKey);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error('Error fetching cache:', err);
    return null;
  }
}

async function setCache(cacheKey, data) {
  try {
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(data)); 
    console.log('Cache set');
  } catch (err) {
    console.error('Error setting cache:', err);
  }
}

// API Endpoint
app.get('/api/availability', async (req, res) => {
  const { id, start_time, end_time } = req.query;

  if (!id || !start_time || !end_time) {
    return res.status(400).json({ error: 'Missing required query parameters' });
  }
  const startDate = start_time.split('T')[0]; 
  const cacheKey = `${id}:${startDate}`; 

  let response = null;
  try {
    const cachedTimes = await checkCache(cacheKey);
    if (cachedTimes) {
      console.log('Cache hit for', cacheKey);
      response = cachedTimes; 
    } else {
      const url = `https://25live.collegenet.com/25live/data/umd/run/availability/availabilitydata.json?obj_cache_accl=0&start_dt=${startDate}&comptype=availability_daily&compsubject=location&page_size=100&space_id=${id}&include=closed+blackouts+pending+related+empty&caller=pro-AvailService.getData`;

      const api_response = await axios.get(url);
      response = api_response.data;
      await setCache(cacheKey, response); 
    }

    const tempFilePath = path.join(os.tmpdir(), 'data.json');
    fs.writeFileSync(tempFilePath, JSON.stringify(response));

    const pythonScriptPath = path.join(__dirname, 'preprocess.py');
    const pythonCommand = `python ${pythonScriptPath} ${tempFilePath} ${start_time} ${end_time}`;

    exec(pythonCommand, (error, stdout, stderr) => {
      fs.unlinkSync(tempFilePath); 
      if (error) {
        console.error(`exec error: ${error}`);
        return res.status(500).send('Internal Server Error');
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return res.status(500).send('Internal Server Error');
      }

      try {
        const result = JSON.parse(stdout);
        res.json(result);
      } catch (parseError) {
        console.error('Error parsing Python script output:', parseError);
        res.status(500).send('Internal Server Error');
      }
    });

  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
