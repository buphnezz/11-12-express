'use strict';

import faker from 'faker';
import superagent from 'superagent';
import Note from '/src/libe/model/note';
import { startServer, stopServer } from '/src/lib/server.js';

const apiURL = 'http://localhost:${process.env.PORT}/api/notes';

const createNoteMock = () => {
  return new Note({
    title: faker.lorem.words(10),
    content: faker.lorem.words(25),
  }).save();
};

describe('/api/notes', () => {
  // I know I'll have a POST ROUTE
  // The post route will be able to insert a new note
  // To my application
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(() => Note.remove({}));
  test('POST - It should respond with a 200 status ', () => {
    const noteToPost = {
      title: faker.lorem.words(10),
      content: faker.lorem.words(50),
    };
    return superagent.post(apiURL)
      .send(noteToPost)
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.title).toEqual(noteToPost.title);
        expect(response.body.content).toEqual(noteToPost.content);
        expect(response.body._id).toBeTruthy();
        expect(response.body.timestamp).toBeTruthy();
      });
  });
  test('POST - It should respond with a 400 status', () => {
    const noteToPost = {
      content: faker.lorem.words(50),
    };
    return superagent.post(apiURL)
      .send(noteToPost)
      .then(Promise.reject)  // Zachary this is needed because we are testing failures
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });
  describe('GET /api/notes', () => {
    test('should respond with 200 if there are no errors', () => {
      let noteToTest = null;  // Zachary - preserving the note because of scope rules
      return createNoteMock() // Zachary - test only a GET request 
        .then((note) => {
          noteToTest = note;
          return superagent.get(`${apiURL}/${note._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.title).toEqual(noteToTest.title);
          expect(response.body.content).toEqual(noteToTest.content);
        });
      test('should respond with 404 if there is no note to be found', () => {
        return superagent.get(`${apiURL}/ThisIsAnInvalidId`)
          .then(Promise.reject) // Zachary - testing for a failure
          .catch((response) => {
            expect(response.status).toEqual(404);
          });
      });
    });
  });
});
