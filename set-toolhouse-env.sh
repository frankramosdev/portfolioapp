#!/bin/bash

# Script to set Toolhouse API key as environment variable
echo "Setting Toolhouse API key from .env.local..."

# Extract the API key from .env.local
TOOLHOUSE_API_KEY=$(grep "TOOLHOUSE_API_KEY" .env.local | cut -d '=' -f2)

# Check if the key was found
if [ -z "$TOOLHOUSE_API_KEY" ]; then
  echo "Error: TOOLHOUSE_API_KEY not found in .env.local file"
  exit 1
fi

# Export the key
export TOOLHOUSE_API_KEY
echo "Toolhouse API key set successfully!"
echo "Now you can run your development server with: npm run dev" 