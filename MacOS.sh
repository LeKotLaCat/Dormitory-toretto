#!/bin/bash

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)

kill $(lsof -ti :3000) 2>/dev/null
kill $(lsof -ti :8000) 2>/dev/null

osascript -e "tell application \"Terminal\" to do script \"cd $SCRIPT_DIR/blackend && npm install && node app.js\""

osascript -e "tell application \"Terminal\" to do script \"cd $SCRIPT_DIR/frontend && npm install && npm run dev\""

while true; do
    status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000)
    if [ "$status" = "200" ]; then
        echo "Server is up! Opening browser..."
        open "http://localhost:8000"
        exit 0
    else
        echo "Server not available, retrying..."
        sleep 2
    fi
done
