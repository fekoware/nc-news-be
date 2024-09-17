# Northcoders News API

# About
The Northcoders News API is a RESTful API that provides endpoints for news articles, topics, and user interactions, including functionality to retrieve, add, update, and delete articles, comments, and users.

# View Project Online
[Click here.
](https://nc-news-bxej.onrender.com/api)

# Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

# Prerequisites
Node.js v21.7.3 or later.
Postgres v14 or later.

# Installation

Clone the repository: git clone https://github.com/fekoware/be-nc-news.git

Install dependencies:
This API relies on dotenv, express and pg. There are several extra developer dependencies for testing.

# Running the Application

This API uses private .env files that contain the environment variables for the databases. 

To connect to the databases locally you will need to create two .env files called .env.test and .env.development, each for the test and development databases. 

In the testing .env file, declare PGDATABASE=nc_news_test
In the development .env file, declare PGDATABASE=nc_news

Setup the local database: npm run setup-dbs

Seed the development database: npm run seed

Start the server: npm start

Running the Tests:
To run the tests, use: npm test

Endpoints:
For detailed information about the available endpoints, refer to the endpoints.json file in the repository.

# Acknowledgements

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
