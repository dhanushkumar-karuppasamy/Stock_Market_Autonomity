#!/bin/bash
set -e

echo "Installing dependencies..."
npm install

echo "Starting Vite dev server..."
npm run dev
