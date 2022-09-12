<?php

use Kirby\Cms\App;
use Kirby\Cms\Find;

return [
	'page' => [
		'pattern' => 'pages/(:any)',
		'action'  => fn (string $path) => Find::page($path)->panel()->view()
	],
	'page.preview' => [
		'pattern' => 'pages/(:any)/preview',
		'action'  => function (string $path) {
			$view = Find::page($path)->panel()->view();
			$view['component'] = 'k-live-view';
			$view['breadcrumb'][] = [
				'label' => 'Preview',
				'link'  => '/pages/' . $path . '/preview'
			];

			return $view;
		}
	],
	'page.file' => [
		'pattern' => 'pages/(:any)/files/(:any)',
		'action'  => function (string $id, string $filename) {
			return Find::file('pages/' . $id, $filename)->panel()->view();
		}
	],
	'site' => [
		'pattern' => 'site',
		'action'  => fn () => App::instance()->site()->panel()->view()
	],
	'site.file' => [
		'pattern' => 'site/files/(:any)',
		'action'  => function (string $filename) {
			return Find::file('site', $filename)->panel()->view();
		}
	],
];
