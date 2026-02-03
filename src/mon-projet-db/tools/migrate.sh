#!/bin/bash

# Script to automate the database migration process

# Database connection details
DB_HOST="localhost"
DB_USER="your_username"
DB_PASS="your_password"
DB_NAME="your_database_name"

# Function to execute SQL files
execute_sql() {
  local sql_file=$1
  echo "Executing $sql_file..."
  mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < "$sql_file"
}

# Apply migrations
for migration in sql/migrations/*.sql; do
  execute_sql "$migration"
done

echo "All migrations applied successfully."