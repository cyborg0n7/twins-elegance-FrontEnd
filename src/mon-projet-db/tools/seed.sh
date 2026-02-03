#!/bin/bash

# This script seeds the database with initial data.

# Load the seed SQL file
DATABASE_NAME="your_database_name"
USER="your_username"
PASSWORD="your_password"

# Execute the seed.sql file
mysql -u $USER -p$PASSWORD $DATABASE_NAME < ../sql/seed.sql

echo "Database seeded successfully."