@echo off

REM Set environment variables
set NODE_ENV=production
set LOG_FILE=bot.log

REM Dependency Management
echo Installing dependencies...
npm install

REM Task Automation
echo Formatting code...
npx prettier --write "src/**/*.ts"

echo Linting code...
npx eslint "src/**/*.ts"

echo Testing code...
npx jest

REM Database Management
echo Running database migrations...
REM Replace the following line with the command to run database migrations

REM Start Discord Bot
echo Starting Discord Bot...
node dist/main.js > "%LOG_FILE%" 2>&1