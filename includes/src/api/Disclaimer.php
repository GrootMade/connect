<?php

namespace Grootmade\api;

use Grootmade\Helper;

class Disclaimer extends ApiBase
{
	public function get_disclaimer(\WP_REST_Request $request)
	{
		return Helper::engine_post('disclaimer');
	}

	public function endpoints()
	{
		return [
			'read' => [
				'callback' => [$this, 'get_disclaimer'],
			],
			'get' => [
				'callback' => [$this, 'get_disclaimer'],
			],
		];
	}
}
