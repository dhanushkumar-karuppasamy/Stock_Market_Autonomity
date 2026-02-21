#!/usr/bin/env python3
import subprocess
import os
import sys

# Get the directory where this script is located
script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(script_dir)  # Go up one level from scripts/
frontend_dir = os.path.join(project_root, 'frontend')

print(f"[v0] Script directory: {script_dir}")
print(f"[v0] Project root: {project_root}")
print(f"[v0] Frontend directory: {frontend_dir}")
print(f"[v0] Frontend exists: {os.path.exists(frontend_dir)}")

# Install dependencies
print("[v0] Installing dependencies with npm...")
result = subprocess.run(['npm', 'install'], cwd=frontend_dir, capture_output=False)
if result.returncode != 0:
    print("[v0] Installation failed")
    sys.exit(1)

print("\n[v0] Starting Vite dev server on port 5173...")
print("[v0] Preview will be available at http://localhost:5173")

# Start dev server
subprocess.run(['npm', 'run', 'dev'], cwd=frontend_dir)
