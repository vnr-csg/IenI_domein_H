#!/bin/sh
# Create symlinks to project directory
MAIN_DIR="$PWD/public"
LM_DIR="$PWD/lesmateriaal/public"
sudo rm -rf /var/www/*
sudo ln -sf $MAIN_DIR /var/www/main
sudo ln -sf $LM_DIR /var/www/lesmateriaal
# Start the apache service
sudo service apache2 start
