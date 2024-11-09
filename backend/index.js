import express from 'express';
import cors from 'cors';
import { connect } from 'mongoose';
import dotenv from 'dotenv';

import adminRoutes from './routes/adminRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({ credentials: true, origin: "http://localhost:5173" })
);

app.use('/admin', adminRoutes);
app.use('/employee', employeeRoutes);

app.use(notFound);
app.use(errorHandler);

connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(3000, () => {
      console.log(`Server connected on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((error) => console.log(error));
