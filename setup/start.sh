#!/bin/bash
./setup/start-apache.sh
./setup/start-mysql.sh

mkdir -p databases

LOCKFILE=".imported.lock"
if ! test -f "$LOCKFILE"; then
    echo "Databases worden geïmporteerd.."
    ./setup/restore-default-dbs.sh
    ./setup/import-dbs.sh
    touch $LOCKFILE
fi

bold=$(tput bold)
normal=$(tput sgr0)
echo "Open ${bold}http://localhost:80${normal} om lesmateriaal/websites te bekijken"
