# NC News Backend

Welcome to the **NC News Backend**, an API for a news aggregation website. This project provides a backend server to handle requests related to articles, users, comments, topics, and more.

## Project Overview

This API is built using **Node.js** with **Express** and interacts with a PostgreSQL database to provide various endpoints that allow users to:

- View articles.
- Filter articles by topic, author, or date.
- Sort articles by various criteria (e.g., date, comment count).
- Post comments on articles.
- Upvote or downvote articles.
- Manage users and topics.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (version 16.x or above)
- PostgreSQL (version 12.x or above)
- npm (version 7.x or above)

## Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/fekoware/nc-news-be.git
   cd nc-news-be
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create environment variables:**

   Create a `.env` file in the root directory of the project and include the following environment variables:

   ```bash
   PGDATABASE=nc_news
   PGHOST=localhost
   PGUSER=your_postgres_user
   PGPASSWORD=your_postgres_password
   PGPORT=5432
   ```

4. **Setup the database:**

   To create the necessary databases and tables, run:

   ```bash
   npm run setup-dbs
   ```

   Populate the database with seed data:

   ```bash
   npm run seed
   ```

5. **Start the server:**

   To start the server in development mode, run:

   ```bash
   npm run dev
   ```

   The API will now be running at `http://localhost:9090`.

## Endpoints

### Available Routes

- **GET** `/api/articles` - Retrieve a list of all articles.
- **GET** `/api/articles/:article_id` - Retrieve a specific article by ID.
- **GET** `/api/users` - Retrieve a list of all users.
- **POST** `/api/articles/:article_id/comments` - Post a comment on an article.
- **PATCH** `/api/articles/:article_id` - Vote on an article.

### Example Request

To get all articles:

```bash
GET /api/articles
```

Response:

```json
{
  "articles": [
    {
      "article_id": 1,
      "title": "The Rise of Node.js",
      "topic": "coding",
      "author": "johndoe",
      "body": "Lorem ipsum...",
      "created_at": "2024-09-21T10:00:00Z",
      "votes": 100,
      "comment_count": 5
    },
    ...
  ]
}
```

## Testing

This project uses **Jest** for unit testing.

To run tests:

```bash
npm test
```

## Author

This project is developed and maintained by **FekoWare**.

## License

This project is licensed under the MIT License.
