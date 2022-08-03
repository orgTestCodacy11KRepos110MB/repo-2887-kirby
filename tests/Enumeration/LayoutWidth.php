<?php

namespace Kirby\Enumeration;

/**
 * @covers \Kirby\Enumeration\LayoutWidth
 */
class LayoutWidthTest extends EnumerationTestCase
{
	public const CLASSNAME = LayoutWidth::class;

	protected $allowed = [
		'1/1', '1/2', '1/3', '1/4', '1/6', '1/12',
		'2/2', '2/3', '2/4', '2/6', '2/12',
		'3/3', '3/4', '3/6', '3/12',
		'4/4', '4/6', '4/12',
		'5/6', '5/12',
		'6/6', '6/12',
		'7/12',
		'8/12',
		'9/12',
		'10/12',
		'11/12',
		'12/12'
	];

	protected $default = '1/1';
}
