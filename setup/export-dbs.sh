#!/bin/sh
# Exports (dumps) all databases to the database directory in .sql format 
EXPORT_DIR="databases"
DEFAULT_DIR="lesmateriaal/standaard-databases"
mysql_opt="-h 127.0.0.1 -u user --password=password"
mysql $mysql_opt -s -r -e 'show databases' -N 2>/dev/null | while read db_name; do
    if ! echo "mysql information_schema performance_schema sys" | grep -w $db_name > /dev/null; then
	if [ ! -f "$DEFAULT_DIR/$db_name.sql" ]; then
            echo "Export $db_name"
	        mkdir -p $EXPORT_DIR
            mysqldump $mysql_opt --complete-insert --single-transaction --compact "$db_name" 2>/dev/null > "$EXPORT_DIR/$db_name.sql"
	fi
    fi
done
