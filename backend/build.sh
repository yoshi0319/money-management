#!/bin/bash
set -e

echo "=== Starting build process ==="

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Making migrations..."
python manage.py makemigrations --noinput || echo "No new migrations to make"

echo "Running migrations..."
python manage.py migrate --noinput || {
    echo "Migration failed during build, will retry at startup"
}

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "=== Build completed successfully! ===" 