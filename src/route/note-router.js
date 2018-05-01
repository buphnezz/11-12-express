'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import Note from '../lib/logger';

const jsonParser = bodyParser.json();

const noteRouter = new Router();

noteRouter.post('/api/notes', jsonParser, (request, response) => {
  logger.log(logger.INFO, 'POST - processing a request');
  if (!request.body.title) {
    logger.log(logger.INFO, 'Responding with a 400 error code');
  }
  return new Note(request.body).save()
    .then((note) => {
      logger.log(logger.INFO, 'POST - responding with a 200 status code');
      return response.json(note);
    })
    .catch((error) => {
      logger.log(logger.ERROR, '__POST_ERROR__');
      logger.log(logger.ERROR, error);
      return response.sendStatus(500);
    });
});

noteRouter.get('/api/notes/:id', (request, response) => {
  logger.log(logger.INFO, 'GET - processing a request');

  return Note.findById(request.params.id)
    .then((note) => { // Zachary - note found OR note not found, but the id looks good
      if (!note) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - (!note)');
        return response.sendStatus(404);
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      return response.json(note);
    }
    logger.log(logger.ERROR, '__GET_ERROR__ Returning a 500 status code');
    logger.log(logger.ERROR, error);
    return response.sendStatus(500);
    });
});

export default noteRouter;