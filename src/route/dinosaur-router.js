'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import Dinosaur from '../model/dinosaur';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();

const dinosaurRouter = new Router();

dinosaurRouter.post('/api/dinosaurs', jsonParser, (request, response) => {
  logger.log(logger.INFO, 'POST - processing a request');
  if (!request.body.title) {
    logger.log(logger.INFO, 'Responding with a 400 error code');
  }
  return new Dinosaur(request.body).save()
    .then((dinosaur) => {
      logger.log(logger.INFO, 'POST - responding with a 200 status code');
      return response.json(dinosaur);
    })
    .catch((error) => {
      logger.log(logger.ERROR, '__POST_ERROR__');
      logger.log(logger.ERROR, error);
      return response.sendStatus(500);
    });
});

dinosaurRouter.get('/api/dinosaurs/:id', (request, response) => {
  logger.log(logger.INFO, 'GET - processing a request');

  return Dinosaur.findById(request.params.id)
    .then((dinosaur) => { // Zachary - dinosaur found OR dinosaur not found, but the id looks good
      if (!dinosaur) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - (!dinosaur)');
        return response.sendStatus(404);
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      return response.json(dinosaur);
    })
    .catch((error) => { // Zachary - mongodb error or parsing id error
      if (error.message.toLowerCase().indexOf('cast to objectid failed') > -1) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - objectId');
        logger.log(logger.VERBOSE, `Could not parse the specific object id ${request.params.id}`);
        return response.sendStatus(404);
      }
      logger.log(logger.ERROR, '__GET_ERROR__ Returning a 500 status code');
      logger.log(logger.ERROR, error);
      return response.sendStatus(500);
    });
});

export default dinosaurRouter;
