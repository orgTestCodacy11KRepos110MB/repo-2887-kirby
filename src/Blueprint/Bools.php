<?php

namespace Kirby\Blueprint;

use Kirby\Cms\ModelWithContent;

/**
 * Bools
 *
 * @package   Kirby Blueprint
 * @author    Bastian Allgeier <bastian@getkirby.com>
 * @link      https://getkirby.com
 * @copyright Bastian Allgeier
 * @license   https://opensource.org/licenses/MIT
 */
class Bools
{
	public static function factory(bool|array $props): static
	{
		if (is_bool($props) === true) {
			$instance = new static();

			foreach (get_object_vars($instance) as $key => $value) {
				$instance->$key = $props;
			}

			return $instance;
		}

		return new static(...$props);
	}

	public function render(ModelWithContent $model): mixed
	{
		$props = (array)$this;
		$props = array_filter($props, fn ($value) => $value === true);

		return array_keys($props);
	}
}