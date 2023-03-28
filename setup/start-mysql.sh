#!/bin/bash
sudo service mysql start
while ! nc -z localhost 3306; do
  sleep 0.1
done

## Create 'user' and 'readonly' database users
sudo mysql -u root -e "\
CREATE USER IF NOT EXISTS 'user'@'localhost' IDENTIFIED BY 'password';\
CREATE USER IF NOT EXISTS 'readonly'@'localhost' IDENTIFIED BY 'password';\
GRANT ALL PRIVILEGES ON *.* TO 'user'@'localhost';\
GRANT SELECT ON *.* TO 'readonly'@'localhost';\
";
