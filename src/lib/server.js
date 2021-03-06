'use strict';

import express from 'express';
import mongoose from 'mongoose';
import logger from './logger';
import dinosaurRoutes from '../route/dinosaur-router';
import loggerMiddleware from './logger-middleware';
import errorMiddleware from './error-middleware';

const app = express();
let server = null;
// ---------------------------------------------------------------------------------------
// Zachary - these routes will be read in-order
// so it's important that our 404 catch-all is the last one (1) link in the chain
app.use(loggerMiddleware); // Zachary - using app level middleware
// ---------------------------------------------------------------------------------------
// (2) link in the chain
app.use(dinosaurRoutes);
// Zachary - making sure I reutrn a 404 status if I don't have a matching route
app.all('*', (request, response) => {
  logger.log(logger.INFO, 'Returning a 404 from the catch-all/default route');
  return response.sendStatus(404);
});
// ---------------------------------------------------------------------------------------
// (3) link in the chain
app.use(errorMiddleware);
// ---------------------------------------------------------------------------------------
const startServer = () => {
  return mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      // Zachary - once I'm here, I know that mongoose is connected
      server = app.listen(process.env.PORT, () => {
        logger.log(logger.INFO, `Server is listening on port ${process.env.PORT}`);
      });
    });
};

const stopServer = () => {
  return mongoose.disconnect()
    .then(() => {
      server.close(() => {
        logger.log(logger.INFO, 'Server is off');
      });
    });
};

export { startServer, stopServer };
