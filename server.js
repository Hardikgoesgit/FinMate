import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import { auth } from "express-openid-connect";
import { NseIndia } from 'stock-nse-india';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;
const nseIndia = new NseIndia();

let allSymbols = [];

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

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'f3403015fb773cc52470a445e274c000160ea5fe4ef05088f0c79310fce39b15',
  baseURL: 'http://localhost:3000',
  clientID: 'KnBzK4fGvgvWi81u3yDw9n9yxxSUcAfH',
  issuerBaseURL: 'https://amitrajeet.us.auth0.com'
};

app.use(express.static(path.join(__dirname, 'public')));
app.use(auth(config));

app.get("/", (req, res) => {
  const logOut = '/logout';
  res.render('index.ejs', {logOut:logOut, req });
});

app.get('/edu-cont', (req, res) => {
  res.render('edu-cont.ejs', { });
});

app.get('/trading-sim', (req, res) => {
  res.render('trading.ejs', { });
});

app.get('/get-started', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    // If the user is authenticated, redirect to /edu-cont
    res.redirect('/edu-cont');
  } else {
    // If not authenticated, redirect to login with the returnTo option
    res.oidc.login({ returnTo: '/edu-cont' });
  }
});
app.get('/get-edu', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    // If the user is authenticated, redirect to /edu-cont
    res.redirect('/edu-cont');
  } else {
    // If not authenticated, redirect to login with the returnTo option
    res.oidc.login({ returnTo: '/edu-cont' });
  }
});

app.get('/get-mentor', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    // If the user is authenticated, redirect to /edu-cont
    res.redirect('/mentorship.ejs');
  } else {
    // If not authenticated, redirect to login with the returnTo option
    res.oidc.login({ returnTo: '/edu-cont' });
  }
});

app.get('/get-trading', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    // If the user is authenticated, redirect to /edu-cont
    res.redirect('/trading-sim');
  } else {
    // If not authenticated, redirect to login with the returnTo option
    res.oidc.login({ returnTo: '/trading-sim' });
  }
});

app.get('/search', async (req, res) => {
  const query = req.query.q.trim().toUpperCase();
  // console.log(`Search query: ${query}`);
  try {
      if (allSymbols.length === 0) {
          await fetchAllSymbols();
      }
      const filteredSymbols = allSymbols.filter(symbol => symbol.toUpperCase().includes(query));
      // console.log(`Filtered symbols: ${filteredSymbols}`);
      res.json(filteredSymbols);
  } catch (error) {
      console.error('Error filtering symbols:', error);
      res.status(500).json({ error: 'Failed to filter symbols' });
  }
});


app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});
