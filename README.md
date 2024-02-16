# Project Documentation: wwtbam-js
## Introduction
This documentation provides an overview of the wwtbam-js project, including its purpose, features, and how to use it.

## Overview
The wwtbam-js project is a web application based on the popular game show "Who Wants to Be a Millionaire?", crossed with the Quiz-based app Kahoot.

## Features
User authentication: Users can create accounts, log in, and update their profiles.
Game participation: Users can join games in real time, answer trivia questions, and progress through multiple rounds.
Real-time updates: Game progress and results are displayed in real-time using WebSockets.
User-friendly interface: The application features a clean and intuitive interface for an optimal user experience.

## Usage
Sign up for an account or log in if you already have one.
Navigate to the game section and join an ongoing game.
Answer trivia questions correctly to progress through the game rounds.
Enjoy the thrill of virtual competition and aim for the top prize!

## File Structure

```
├───docs    <---------------------------------------------------------------- Documentation flow
├───misc    <---------------------------------------------------------------- Temporary data for testing purposes
│   └───questions
└───packages
    ├───bus <---------------------------------------------------------------- Redis configuration
    ├───env <---------------------------------------------------------------- Enviromental variables export config
    ├───game-backend
    │   └───states
    └───web-app <------------------------------------------------------------ Frontend
        ├───auth <----------------------------------------------------------- User Authentication
        ├───DAL <------------------------------------------------------------ Layer for accessing the database
        │   └───question
        ├───models <--------------------------------------------------------- Models, part of the MVC architecture
        │   ├───question
        │   └───user
        ├───public
        ├───routes <--------------------------------------------------------- Controllers, part of the MVC architecture, handle HTTP client requests
        └───views <---------------------------------------------------------- Views, part of the MVC architecture
            ├───auth
            ├───game
            ├───question
            ├───templates <-------------------------------------------------- Reusable view templates
            └───user
```
## Dependencies

    bcrypt
    cookie-parser
    dotenv
    ejs
    express
    express-validator
    immutable
    jsonwebtoken
    morgan
    mysql
    redis
    uuid
    ws

# Frameworks
Alpine JS - https://alpinejs.dev/
