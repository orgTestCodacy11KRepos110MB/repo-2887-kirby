<?php

namespace Kirby\Foundation;

use Kirby\Blueprint\Blueprint;

/**
 * @covers \Kirby\Foundation\Collection
 */
class CollectionTest extends TestCase
{
	/**
	 * @covers ::__construct
	 */
	public function testConstruct()
	{
		$collection = new Collection([
			$a = new Blueprint('a'),
			$b = new Blueprint('b'),
		]);

		$this->assertCount(2, $collection);
		$this->assertSame($a, $collection->first());
		$this->assertSame($b, $collection->last());
	}

	/**
	 * @covers ::__construct
	 */
	public function testConstructWithInvalidObject()
	{
		$this->expectException('TypeError');
		$this->expectExceptionMessage('Each value in the collection must be an instance of Kirby\Foundation\Component');

		$object = new \stdClass;
		$object->id = 'foo';

		new Collection([
			$object,
		]);
	}
}