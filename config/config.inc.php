<?php

if (!function_exists('check_file_access')) {
    function check_file_access($path)
    {
        if (is_readable($path)) {
            return true;
        } else {
            error_log(
                'phpmyadmin: Failed to load ' . $path
                . ' Check group www-data has read access and open_basedir restrictions.'
            );
            return false;
        }
    }
}

// Load secret generated on postinst
if (check_file_access('/var/lib/phpmyadmin/blowfish_secret.inc.php')) {
    require('/var/lib/phpmyadmin/blowfish_secret.inc.php');
}

$cfg['Servers'][1]['host'] = '0.0.0.0';
$cfg['Servers'][1]['auth_type'] = 'config';
$cfg['Servers'][1]['user'] = 'user';
$cfg['Servers'][1]['password'] = 'password';


$cfg['NavigationTreeEnableGrouping'] = false;

$cfg['UploadDir'] = '';
$cfg['SaveDir'] = '';
