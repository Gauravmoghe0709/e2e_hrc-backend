const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authrouter = require('./router/auth.router');
const heroRouter = require('./router/HomeRouters/hero.routes');
const serviceRouter = require('./router/HomeRouters/service.routes');
const employerCardRouter = require('./router/HomeRouters/employeeCard.router');
const approachCardRouter = require('./router/HomeRouters/approachCard.routes');
const contactCTARouter = require('./router/HomeRouters/contactsCTA.routes');
const contactEnquiryRouter = require('./router/HomeRouters/contactEnquiry.routes');
const aboutRouter = require('./router/AboutRouters/about.routes');
const howWeWorkRouter = require('./router/HomeRouters/howWeWork.routes');
const locationCardRouter = require('./router/HomeRouters/locationCard.router');
const whyChooseRouter = require('./router/AboutRouters/whyChoose.routes');
const employerRouter = require('./router/EmployerRoutes/Employer.routes');
const footerRouter = require('./router/footer.routes');
const workforceSolutionRouter = require('./router/WorkforceSolution/workforceSolution.routes');
const seoRouter = require('./router/SEO/seo.routes');
const employeeHeroRouter = require('./router/EmployeeRoutes/EmployeeHero.router');

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
app.use('/api', employerCardRouter);
app.use('/api', employerRouter);
app.use('/api', howWeWorkRouter);
app.use('/api', locationCardRouter);
app.use('/api', whyChooseRouter);
app.use('/api', footerRouter);
app.use('/api', workforceSolutionRouter);
app.use('/api', seoRouter);
app.use('/api', employeeHeroRouter);
// Multer file size error handler (for image uploads > 5MB)
app.use((err, req, res, next) => {
  if (err && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'Image size must be less than 5MB' });
  }
  next(err);
});
module.exports = app;