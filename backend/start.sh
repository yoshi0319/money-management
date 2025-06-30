#!/bin/bash
set -e

echo "=== Starting application ==="
echo "Current directory: $(pwd)"
echo "FORCE_MIGRATE: $FORCE_MIGRATE"
echo "DATABASE_URL: $DATABASE_URL"

echo "Waiting for database to be ready..."
sleep 5

# FORCE_MIGRATE環境変数が設定されている場合、マイグレーションを強制実行
if [ "$FORCE_MIGRATE" = "True" ]; then
    echo "Force migrating database..."
    python manage.py migrate --noinput
    # マイグレーション完了後、環境変数を削除（一度だけ実行するため）
    unset FORCE_MIGRATE
else
    echo "Running migrations..."
    python manage.py migrate --noinput || {
        echo "Migration failed, retrying..."
        sleep 10
        python manage.py migrate --noinput
    }
fi

echo "Creating superuser if not exists..."
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print('Superuser created')
else:
    print('Superuser already exists')
" || echo "Superuser creation skipped"

echo "Starting gunicorn..."
exec gunicorn my_project.wsgi:application --bind 0.0.0.0:$PORT 