<?php

namespace Kirby\Field;

use Kirby\Blueprint\Nodes;
use Kirby\Cms\ModelWithContent;
use Kirby\Value\Values;

/**
 * Fields
 *
 * @package   Kirby Field
 * @author    Bastian Allgeier <bastian@getkirby.com>
 * @link      https://getkirby.com
 * @copyright Bastian Allgeier
 * @license   https://opensource.org/licenses/MIT
 */
class Fields extends Nodes
{
	public const TYPE = Field::class;

	public function active(): static
	{
		// get all inputs and ignore display fields
		$inputs = $this->inputs();

		// get all values for all fields
		$values = $inputs->export()->toArray();

		// filter disabled fields and fields
		// with conditions that are currently invisible
		return $inputs->filter(fn ($field) => $field->isActive($values));
	}

	/**
	 * @return $this
	 */
	public function disable(bool $disable = true)
	{
		foreach ($this->data as $field) {
			$field->disabled = $disable;
		}

		return $this;
	}

	public function export(): Values
	{
		$values = new Values();

		foreach ($this->inputs() as $field) {
			$values->__set($field->id, $field->value);
		}

		return $values;
	}

	/**
	 * @return $this
	 */
	public function fill(array $values = [], bool $defaults = false): static
	{
		foreach ($this->inputs() as $field) {
			// always fill the field and add the default if necessary
			if ($defaults === true) {
				$field->fill($values[$field->id] ?? null, true);

			// only fill the field if the value is set
			} else if (isset($values[$field->id]) === true) {
				$field->fill($values[$field->id]);
			}
		}

		return $this;
	}

	public function inputs(): static
	{
		return $this->filter(fn ($field) => $field->isInput());
	}

	public static function nodeFactoryById(string|int $id): Field
	{
		return static::nodeFactoryByArray($id, [
			'id'   => $id,
			'type' => $id
		]);
	}

	/**
	 * @return $this
	 */
	public function submit(
		array $values = [],
		ModelWithContent|null $model = null
	): static {
		foreach ($this->inputs() as $field) {
			$field->submit($values[$field->id] ?? null, $model);
		}

		return $this;
	}

	public function untranslated(): static
	{
		return $this->inputs()->filter('translate', false);
	}

	public function validate(): bool
	{
		foreach ($this->inputs() as $input) {
			$input->validate();
		}

		return true;
	}

}
