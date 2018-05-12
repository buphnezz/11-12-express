The following npm install should occur before attempting to run this application:

[npm install -D babel-register babel-preset-env babel-eslint eslint eslint-config-airbnb-base eslint-plugin-import eslint-plugin-jest jest]

Also, install these packages before running the application:

[npm i winston@next dotenv faker]

Install Mongodb and start your mongodb server before running the application.

How to start server:
start the server via the startServer() function from the server.js file.  This will allow us to connect to our mongodb (process.env.MONGODB_URI).  Mongoose acts as the middleware that connects us from our computer to the mongodb. 

how to make requests to each endpoint:

dinosaurRouter.post() is how we send new data to mongodb.  If there is no database available to receive the new data we've attempted to send, the server will display a 400 error and error message will read 'Responding with a 400 error code.'   If the new data is posted successfully to mongodb the server will display a 200 message and the message will read 'POST - responding with a 200 status code'.

dinosaurRouter.get() is how we retrieve data from mongodb. If the new data is retrieved successfully from mongodb the server will display a 200 message and the message will read 'GET - responding with a 200 status code'.

dinosaurRouter.delete() is how we delete data from mongodb.  If there is no data/id available to delete the server will display a 404 error and error message will read 'DELETE - responding with a 404 status code.'  If the data has been deleted successfully, the server will display a 204 message that will act as a confirmation, it will read "no content" whic means the data no longer exists and it was successfully deleted. 

