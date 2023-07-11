import express from 'express';
import { TTScraper } from "tiktok-scraper-ts";
import { getUserRegion } from './src/tiktok-scrapper-region.js';

const app = express();
const port = 3000;

const TikTokScraper = new TTScraper();

app.get('/user/:username', async (req, res) => {
  const user = req.params.username;

  try {
    const fetchUser = await TikTokScraper.user(user);
    const region = await getUserRegion(user);
    
    if (region) {
      fetchUser.region = region;
    } else {
      throw new Error(`Failed to get user region ${user}`);
    }
    
    const userWithRegion = { ...fetchUser };
    userWithRegion.region = fetchUser.region;
    
    res.json(userWithRegion);
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    res.status(400).json({ error: errorMessage });
  }
});

app.listen(port, () => {
  console.log(`API server is running on port ${port}`);
});
