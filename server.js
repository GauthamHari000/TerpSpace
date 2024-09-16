const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// API Endpoint
app.get('/api/availability', async (req, res) => {
  const { id, start_time, end_time } = req.query;

  if (!id || !start_time || !end_time) {
    return res.status(400).json({ error: 'Missing required query parameters' });
  }

  try {
    // Build URL with dynamic space_id
    const url = `https://25live.collegenet.com/25live/data/umd/run/availability/availabilitydata.json?obj_cache_accl=0&start_dt=2024-09-15T00:00:00&comptype=availability_daily&compsubject=location&page_size=100&space_id=${id}&include=closed+blackouts+pending+related+empty&caller=pro-AvailService.getData`;
    
    // Fetch data from the URL
    const response = await axios.get(url);
    
  // Write data to a temporary file
  const tempFilePath = path.join(os.tmpdir(), 'data.json');
  fs.writeFileSync(tempFilePath, JSON.stringify(response.data));

  // Execute the Python script
  const pythonScriptPath = path.join(__dirname, 'preprocess.py');
  const pythonCommand = `python ${pythonScriptPath} ${tempFilePath} ${start_time} ${end_time}`;

  exec(pythonCommand, (error, stdout, stderr) => {
    fs.unlinkSync(tempFilePath); // Clean up temporary file
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

// Start the server
app.listen(port, () => {
console.log(`Server running at http://localhost:${port}`);
});