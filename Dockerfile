# Latest Ubuntu LTS
FROM ubuntu:jammy 

# Install packages
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y \
    git \
    git-lfs \
    sudo \
    locales \
    nano \
    vim \
    netcat \
    htop \
    php php-mysql php-zip php-json php-mbstring \
    mysql-server \
    phpmyadmin \
    && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/*
    
# Setup locale
RUN locale-gen en_US.UTF-8
ENV LANG=en_US.UTF-8

# Create user and allow sudo access without password
ARG USERNAME=gitpod
RUN useradd -l -u 33333 -G sudo -md /home/$USERNAME -s /bin/bash -p $USERNAME $USERNAME
RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

# Setup MySQL user
RUN usermod -d /var/lib/mysql/ mysql

# Configure phpMyAdmin
COPY config/config.inc.php /etc/phpmyadmin/config.inc.php
RUN chmod 444 /etc/phpmyadmin/config.inc.php && cp /etc/phpmyadmin/apache.conf /etc/apache2/conf-available/phpmyadmin.conf && a2enconf phpmyadmin

# Configure Apache
COPY config/devsite.conf /etc/apache2/sites-available 
RUN rm /etc/apache2/sites-enabled/000-default.conf && a2ensite devsite 
RUN echo "export APACHE_RUN_USER=$USERNAME\nexport APACHE_RUN_GROUP=$USERNAME" >> /etc/apache2/envvars

# Switch to user
USER $USERNAME
WORKDIR /home/$USERNAME
