const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// 在生產環境中，您可能只想允許特定的源
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'http://shuyu0714.github.io/ecosprint-clock' 
    : 'http://localhost:5173',
  optionsSuccessStatus: 200
};

app.use(cors());
app.use(bodyParser.json());

const dataFile = path.join(__dirname, 'list.json');


app.post('/api/punch', async (req, res) => {
  try {
    const { type, date, time, location } = req.body;
    
    let data = [];
    try {
      const fileContent = await fs.readFile(dataFile, 'utf-8');
      data = JSON.parse(fileContent);
    } catch (error) {
      // 如果文件不存在或為空，就創建一個新的數組
    }
    
    data.push({ type, date, time, location });
    
    await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving punch data:', error);
    res.status(500).json({ success: false, message: 'Failed to save punch data' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});