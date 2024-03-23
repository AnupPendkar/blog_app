#!/bin/bash

# ~/.nvm/nvm.sh && nvm use 18

cd ../frontend

npm install
npm run build

cd ../backend

npm install
npm run start
