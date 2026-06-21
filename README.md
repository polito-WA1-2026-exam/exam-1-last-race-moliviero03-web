# Exam #1: "Last Race"
## Student: s361264 OLIVIERO MARCO 

## React Client Application Routes

- Route `/`: it contains the main layout, which is the header.
- Route `index`: this page is dedicated only to rules. This is the only page visible for anonymous users .
- Route `/login`: page for the login.
- Route `/logout`: simple page for showing the logout.
- Route `/home`: in this page the users can still read the rules, but also start a game or go to the ranking page.
- Route `/setup`: this page is dedicated for the first step of the game, so the player will see the network map and the list of lines, and can click a button to go to the next stage.
- Route `/planning`: in this page the player sees the map but without the connections, a list of connections, a timer expiring and the submit button, Here the list of connections is interactable, the user can click on one of them to add it to the route, click it again to remove it. Depending on a connection inserted or not, it is displayed or not in the map.
- Route `/execution`: in this page the player sees the network map with only the route submitted, iteratively the description of each connection, the event generated and the coins after that event. For each step, the connection took into consideration is showed with a different color on the map.
- Route `/result`: in this page the player sees the result of his game and two buttons, one for starting a new game and one for going back to home page.
- Route `/ranking`: in this page the user sees the ranking board with the players' best scores.
- Route `/error`: this page is dedicated on showing any internal error.

## API Server

- POST `/api/sessions`
  - Request body:
  ```json
  {
    "username": "some.username",
    "password": "some_password"
  }
  ```
  - Response body:
  ```json
  {
    "id": 1,
    "name": "Mario",
    "surname": "Rossi",
    "username": "mario.rossi",
    "bestScore": 25
  }
  ```
  - Status codes: `201 Created`, `401 Unauthorized`

- GET `/api/sessions/current`
  - Is authenticated
  - Response body:
  ```json
  {
    "id": 1,
    "name": "Mario",
    "surname": "Rossi",
    "username": "mario.rossi",
    "bestScore": 25
  }
  ```
  - Status codes: `200 OK`, `401 Unauthorized`

- GET `/api/players`
  - Is authenticated
  - Response body:
  ```
  [
    {
      "username": "mario.rossi",
      "best_score": 25
    },
    {
      "username": "luca.verdi",
      "best_score": 23
    },
    ...
  ]
  ```
  - Status codes: `200 OK`, `401 Unauthorized`, `500 Internal Server Error`

- GET `/api/stations`
  - Is authenticated
  - Response body:
  ```
  [
    "Centrale", "Porta Velaria, ...
  ]
  ```
  - Status codes: `200 OK`, `401 Unauthorized`, `500 Internal Server Error`

- GET `/api/segments`
  - Is authenticated
  - Response body:
  ```
  [
    {
      "station1": "Centrale",
      "station2": "Porta Velaria",
      "color": "teal",
      "active": 0
    },
    ...
  ]
  ```
  - Status codes: `200 OK`, `401 Unauthorized`, `500 Internal Server Error`

- GET `/api/lines`
  - Is authenticated
  - Response body:
  ```
  [
    {
      "lineNumber": 1,
      "segments": [...]
    },
    ...
  ]
  ```
  - Status codes: `200 OK`, `401 Unauthorized`, `500 Internal Server Error`

- GET `/api/events`
  - Is authenticated
  - Response body:
  ```
  [
    {
      "description": "Wrong platform",
      "effect": -2
    },
    ...
  ]
  ```
  - Status codes: `200 OK`, `401 Unauthorized`, `500 Internal Server Error`

- PATCH `/api/score`
  - Is authenticated
  - userId retrieved by passport session
  - Request body:
  ```json
  {
      "score": 19
  }
  ```
  - Response body:
  ```json
  {
    "message": "Score updated succesfully"
  }
  ```
  - Status codes: `200 OK`, `401 Unauthorized`, `422 Unprocessable Entity`, `500 Internal Server Error`

- DELETE `/api/sessions/current`
  - Status codes: `200 OK`

## Database Tables

- Table `user` - contains userId, name, surname, username, bestScore, hashedPassword, salt
- Table `line` - contains lineNumber, station1, station2, segIndex, color
- Table `event` - contains id, description, effect

## Main React Components

- `Header.jsx`: it contains the header for every page, with the game title, login button, user information and logout button.
- `RulesDisplay.jsx`: it displays the game rules.
- `LoginForm.jsx`: it displays the form for logging in.
- `SetupView.jsx`: it displays the map with lines and connection, a list of lines and the button for going on to the next stage.
- `PlanningView.jsx`: it displays the map without lines and connections, list of connections, which are clickable, timer and submit button.
- `ExecutionView.jsx`: it displays the map with the valid submitted route, showing each segment step by step with a different color and the associated event and the coins after the event effect.
- `ResultView.jsx`: it displays the result of the game, a button for starting a new game and another one for going back to the home page.
- `RankingDisplay.jsx`: it displays the ranking board and a button for going back to the home page.

(only _main_ components, minor ones may be skipped)


## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- username: mario.rossi, password: password_di_mario
- username: luca.verdi, password: password_di_luca
- username: andrea.bianchi, password: password_di_andrea
- username: giorgio.neri, password: password_di_giorgio

## Use of AI Tools
I used Gemini to help me understand if the logic I created for some functions was right or not. I also used it for filling some css fields I didn't know for designing the front-end. And for last, I used it to understand some unknown errors in the system.
