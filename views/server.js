import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import { NseIndia } from 'stock-nse-india';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 5000;
const nseIndia = new NseIndia();
// const host = "localhost"

let allSymbols = [];

// Fetch all symbols from NSE when the server starts
async function fetchAllSymbols() {
    try {
        allSymbols = await nseIndia.getAllStockSymbols();
        console.log('Symbols fetched successfully');
        console.log(`Total symbols: ${allSymbols.length}`);
    } catch (error) {
        console.error('Error fetching symbols:', error);
    }
}

fetchAllSymbols();

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
  res.render('1-1mentorship.ejs',{});
});

app.get('/search', async (req, res) => {
  const query = req.query.q.trim().toUpperCase();
  console.log(`Search query: ${query}`);
  try {
      if (allSymbols.length === 0) {
          await fetchAllSymbols();
      }
      const filteredSymbols = allSymbols.filter(symbol => symbol.toUpperCase().includes(query));
      console.log(`Filtered symbols: ${filteredSymbols}`);
      res.json(filteredSymbols);
  } catch (error) {
      console.error('Error filtering symbols:', error);
      res.status(500).json({ error: 'Failed to filter symbols' });
  }
});


app.listen(port,"0.0.0.0", () => { 
  console.log(`Listening at port ${port}`);
    });




