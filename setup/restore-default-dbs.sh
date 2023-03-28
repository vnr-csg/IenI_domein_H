#!/bin/bash
mysql="mysql -h 127.0.0.1 -u user --password=password"
for db_path in ./lesmateriaal/standaard-databases/*.sql;
do
    db_name=$(basename $db_path .sql)
    echo "Restore $db_name"
    $mysql -e "DROP DATABASE IF EXISTS $db_name; CREATE DATABASE $db_name;" 2>/dev/null
    $mysql --init-command="SET SESSION FOREIGN_KEY_CHECKS=0;" $db_name < $db_path 2>/dev/null
done
