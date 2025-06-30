#!/bin/bash
set -e

echo "Running migrations..."
python manage.py migrate --noinput

echo "Starting application..."
exec gunicorn my_project.wsgi:application 