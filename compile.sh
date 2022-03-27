#!/usr/bin/env bash
if [ -z $1 ]; then
    tput setaf 1; echo "Usage: $0 <appId>"
    exit 1
fi

npm run compile $1
