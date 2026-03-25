<?php
/*
 * Plugin Name: GrootMade
 * Plugin URI: https://grootmade.com
 * Description: Access to 25K+ premium themes and plugins directly from your dashboard.
 * Version: 5.0.0-beta.3.1.0
 * Requires at Least: 6.0
 * Requires PHP: 7.4
 * Author: Grootmade
 * Author URI: https://github.com/GrootMade/connect
 * License: GPLv2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: grootmade
 **/
namespace Grootmade {
	if (file_exists(__DIR__ . '/includes/lib/autoload.php')) {
		require_once __DIR__ . '/includes/lib/autoload.php';
		Plugin::get_instance(__FILE__);
		Upgrade::get_instance(__FILE__);
	}
}
