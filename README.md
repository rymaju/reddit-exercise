# 🚀 Reddit Exercise

This application is a backend API to simplify requests to the Reddit API as well as a front-end interface to view top posts from any subreddit.

## 🛠️ Setup

```sh

git clone https://github.com/rymaju/reddit-exercise.git

cd reddit-exercise

npm install

npm start

```

### `npm start`
To build the frontend and start the backend to host files statically. **Use this command to build and host the project locally.**

### `npm run test`
To run JEST unit tests.

### `npm run react`
To build and start only the frontend. Only for development purposes.

### `npm run server` 
To run only the backend using `nodemon` to watch for changes. Only for development purposes.

## Project Overview

### Frontend

I created a Reddit interface that allows users to enter any subreddit and fetch the top posts from a set of valid timeranges. I also implemented infinite scroll, allowing users to continue to scroll down for more posts. The posts are sorted by top posts (highest overall scores). The site was designed mobile-first with Material UI components, and also includes a light/dark theme.

For the frontend I used React.js with Material UI and styled-components. I first sketched out the site on Figma [(see designs here)](https://www.figma.com/file/pmZM7R8AJZW4vxhComzxKA/Reddit-Stack-Sketches-and-Ideas?node-id=2%3A5814), then implemented the designs using React components. I used axios to make API requests and the ReactInfiniteScroll component to implement infinite scrolling.

There are a lot of improvements I can make to the site. I could have used a React fetching/caching library such as react-query or swr to cache API requests so that subsequent load times to the same subreddit would be faster. I could have also implemented a search feature. From a technology standpoint the application might scale better if I had used Typescript instead of plain Javascript for my React components.

### Backend

I created a very simple REST API (only one endpoint). The goal of this API is to serve as a simpler interface for the actual Reddit API for the purpose of providing information about top posts of a subreddit.

The backend was created with Node and Express. Usual express middleware was included for security although some were disabled for simplicity (CORS, CSP).

Robust JEST unit tests were created to verify post utility functions work correctly.

## 📜 API Documentation

### `GET /api/posts/:subreddit`

`GET /api/posts/:subreddit?limit=<limit>&timerange=<timerange>&after=<after>`

Gets the top posts of r/`subreddit`.

Optional params allows more specific searches.

- `limit` determines the number of posts to return.
- `timerange` determines the period of time in which top posts are filtered (top posts of **today**, this **month**, **all** time, etc.)
- `after` will ignore posts ordered before it. Useful for pagination or fetching more data. For example if a reddit had 10 top posts: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]. { after=5, limit=5 } will yield [5, 6, 7, 8, 9, 10]. (Note that numbers are used instead of proper reddit fullnames for brevity).

| Param     | Required? | Default Value | Type    | Requirements                                                    |
|-----------|-----------|---------------|---------|-----------------------------------------------------------------|
| subreddit | Required  | N/A           | String  | Must be a valid subreddit name ("news", "anime", "pics" etc.)   |
| limit     | Optional  | 20            | Integer | Must be in the range [1, 100]                                   |
| timerange | Optional  | "all"         | String  | Must be one of ["hour", "today", "now", "week", "month", "all"] |
| after     | Optional  | N/A           | String  | Must be a valid fullname of a reddit post ("t3_l289v9")         |

#### Response Schema

```json
{
  "data": [
    {
      "title": STRING,
      "score": INTEGER,
      "created": INTEGER,
      "author": STRING,
      "permalink": STRING,
      "thumbnail": STRING | NULL
    },
    ...
  ],
  "after": STRING
}
```

#### Example usage

Request:
`GET /api/posts/aww?timerange=now&limit=2`

Response:

```json
{
  "data": [
    {
      "title": "Retired Nasa Astronaut, Leland Melvin’s official portrait",
      "score": 91487,
      "created": 1611555611,
      "author": "Greenthund3r",
      "permalink": "/r/aww/comments/l495gr/retired_nasa_astronaut_leland_melvins_official/",
      "thumbnail": "https://b.thumbs.redditmedia.com/ai-0-UXDUSfMx3vygJLRSyh29RaHhzjEpT8SpJoPCvA.jpg"
    },
    {
      "title": "Baby kitty learning to trust its human 🥰",
      "score": 72478,
      "created": 1611600814,
      "author": "natbrat69",
      "permalink": "/r/aww/comments/l4llcv/baby_kitty_learning_to_trust_its_human/",
      "thumbnail": "https://a.thumbs.redditmedia.com/h2ogGFVxG7V0roO3_aFXu8TcFIZUTGayedQx6i9Qdz4.jpg"
    }
  ],
  "after": "t3_l4llcv"
}
```
