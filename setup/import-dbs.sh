#!/bin/bash
# Imports all databases from the database directory
mysql="mysql -h 127.0.0.1 -u user --password=password"
import() {
    db_name=$(basename $1 .sql)
    echo "Import $1 $db_name"
    $mysql -e "DROP DATABASE IF EXISTS $db_name; CREATE DATABASE $db_name;" 2>/dev/null
    $mysql --init-command="SET SESSION FOREIGN_KEY_CHECKS=0;" $db_name < $1 2>/dev/null
}
find ./databases -maxdepth 1 -type f -name '*.sql' | while read file; do import "$file"; done
