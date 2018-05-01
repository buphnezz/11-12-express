'use strict';

import faker from 'faker';
import superagent from 'superagent';
import Dinosaur from '../model/dinosaur';
import { startServer, stopServer } from '../lib/server';

const apiURL = `http://localhost:${process.env.PORT}/api/dinosaurs`;

// Vinicio - the main reason to use mocks is the fact that we don't want to
// write a test that relies on both a POST and a GET request
const createDinosaurMock = () => {
  return new Dinosaur({
    title: faker.lorem.words(10),
    content: faker.lorem.words(25),
  }).save();
};

describe('/api/dinosaurs', () => {
  // I know I'll have a POST ROUTE
  // The post route will be able to insert a new note to my application
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(() => Dinosaur.remove({}));
  test('POST - It should respond with a 200 status ', () => {
    const dinosaurToPost = {
      title: faker.lorem.words(10),
      content: faker.lorem.words(50),
    };
    return superagent.post(apiURL)
      .send(dinosaurToPost)
      .then((response) => {
        // Zachary - testing status code
        expect(response.status).toEqual(200);
        // Zachary - Testing for specific values
        expect(response.body.title).toEqual(dinosaurToPost.title);
        expect(response.body.content).toEqual(dinosaurToPost.content);
        // Zachary - Testing that properties are present
        expect(response.body._id).toBeTruthy();
        expect(response.body.timestamp).toBeTruthy();
      });
  });
  test('POST - It should respond with a 400 status', () => {
    const dinosaurToPost = {
      content: faker.lorem.words(50),
    };
    return superagent.post(apiURL)
      .send(dinosaurToPost)
      .then(Promise.reject) // Zachary this is needed because we are testing failures
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });
  describe('GET /api/dinosaurs', () => {
    test('should respond with 200 if there are no errors', () => {
      let dinosaurToTest = null; // Zachary - preserving the note because of scope rules
      return createDinosaurMock() // Zachary - test only a GET request 
        .then((note) => {
          dinosaurToTest = note;
          return superagent.get(`${apiURL}/${note._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.title).toEqual(dinosaurToTest.title);
          expect(response.body.content).toEqual(dinosaurToTest.content);
        });
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
