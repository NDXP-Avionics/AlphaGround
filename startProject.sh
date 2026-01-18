#!/bin/bash

# 1. Define Paths
ELECTRON_DIR="/mnt/c/Users/sebas/OneDrive/Documents/VSCode/AlphaGround"
PYTHON_DIR="/mnt/c/Users/sebas/OneDrive/Documents/VSCode/PySerial"
PYTHON_EXE="$PYTHON_DIR/.alpha/Scripts/python.exe"
PYTHON_SCRIPT="$PYTHON_DIR/logger.py"

# Convert WSL path to Windows path for the Python Executable
PYTHON_SCRIPT_WIN=$(wslpath -w "$PYTHON_SCRIPT")

# 2. Cleanup Setup
# This function kills the background python process when you Ctrl+C the script
cleanup() {
    echo "Stopping Logger..."
    taskkill.exe /F /IM python.exe > /dev/null 2>&1
    exit
}
trap cleanup SIGINT SIGTERM

# 3. Start Python Backend
echo "Starting Virtual Environment & Logger..."
cd "$ELECTRON_DIR" || exit

# Run python in background
"$PYTHON_EXE" "$PYTHON_SCRIPT_WIN" &
PYTHON_PID=$!

# 4. Start Electron Frontend
echo "Starting Electron Application..."
# Using 'cmd.exe /c' is fine, but ensure npm is in your Windows PATH
cmd.exe /c "npm run dev"

# Cleanup after Electron closes
cleanup

#cd /mnt/c/Users/sebas/OneDrive/Documents/VSCode/AlphaGround/
#./startProject.sh