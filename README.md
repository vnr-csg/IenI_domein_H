# Databases Omgeving

[![Codespaces Prebuilds](https://github.com/rijkvp/databases-omgeving/actions/workflows/codespaces/create_codespaces_prebuilds/badge.svg)](https://github.com/rijkvp/databases-omgeving/actions/workflows/codespaces/create_codespaces_prebuilds)

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/rijkvp/databases-omgeving)

## Omgeving openen

### Gitpod

Open deze omgeving in Gitpod door naar `https://gitpod.io/#<url van repository>` te gaan.

### GitHub Codespaces

Maak een nieuwe codespace aan door op de 'Code' knop te drukken.

## Bestandsindeling

### Leerling

Leerlingen hebben toegang tot de standaarddatabases en kunnen zelf databases importeren en exporteren via de `databases` map.
Nieuwe websites kunnen worden gemaakt door een map onder `public` aan te maken.
Verder is er toegang tot het lesmateriaal dat door de docent wordt voorbereid.

### Docent

Docenten kunnen lesmateriaal voorbereiden door het in de `lesmateriaal/public` map te plaatsen. Ook kunnen standaard databases worden toevoegd door ze in de `lesmateriaal/standaard-databases` map te plaatsen.

## MySQL

De MySQL database is toegankelijk via het serveraddres `127.0.0.1`.
Er zijn twee standaard database gebruikers beschikbaar onder het standaardwachtwoord `password`:
- `user` met alle permissies
- `readonly` met readonly (alleen-lezen) premissies

Voorbeeld van PHP-code om verbinding te maken met MySQL:
```php
$mysqli = new mysqli("127.0.0.1", "user", "password", "databasenaam");
```

De databases kunnen beheerd worden met phpMyAdmin die is geconfigueerd om automatisch in te loggen.

## Versies

De Docker image is gebaseerd op Ubuntu LTS 20.04 LTS met PHP 8.1 en MySQL 8.0.


