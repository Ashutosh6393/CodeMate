
# CodeMate: Codespace collaboration with built in compiler

CodeMate is a real-time code collaboration app built with React, Node.js, and Socket.io. It allows users to share their code with others in real-time, view each other's code, see changes as they happen, and compile on the fly.


## Features

- Real-time Code Sharing: Collaborate with others in real-time.
- View Changes Instantly: See code changes as they happen.
- On-the-fly Compilation: Compile code instantly during collaboration.
- User-friendly Interface: Easy to use with a clean interface powered by the Monaco Editor.


## Tech Stack

**Client:** React, Redux, TailwindCSS, Monaco Editor

**Server:** Node, Express

**Realtime communication:** Socket.io

**Contarization:** Docker

**Serverless Function:** AWS Lambda



## Demo

https://codemate-1-2ri2.onrender.com/

(Note: backend is deployed on the free instance so it may take a while to spin up backend servers.)

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file in the frontend folder

`VITE_APP_BACKEND_URL` = `http://localhost:3000`




## Run Locally

Clone the project

```bash
  git clone git@github.com:Ashutosh6393/CodeMate.git
```

Go to the project directory

```bash
  cd CodeMate
```
Run Backend server

```bash
  cd ./Backend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

Run frontend server

```bash
  cd ./Frontend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```


## Screenshots

![Room join page](/Frontend/screenshots/1.png?raw=true)

![App UI](/Frontend/screenshots/2.png?raw=true)

![Viewing other user](/Frontend/screenshots/4.png?raw=true)


## Deployed on

This project is deployed on https://render.com/