const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authrouter = require('./router/auth.router');
const heroRouter = require('./router/HomeRouters/hero.routes');
const serviceRouter = require('./router/HomeRouters/service.routes');
const approachCardRouter = require('./router/HomeRouters/approachCard.routes');
const contactCTARouter = require('./router/HomeRouters/contactsCTA.routes');
const contactEnquiryRouter = require('./router/HomeRouters/contactEnquiry.routes');
const aboutRouter = require('./router/AboutRouters/about.routes');

const app = express();

// Allow requests from admin panel and frontend dev servers
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
  ],
  credentials: true, // needed for JWT cookies
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/auth', authrouter);

app.use('/api', heroRouter);
app.use('/api', serviceRouter);
app.use('/api', approachCardRouter);
app.use('/api', contactCTARouter);
app.use('/api', contactEnquiryRouter);
app.use('/api', aboutRouter);

module.exports = app;