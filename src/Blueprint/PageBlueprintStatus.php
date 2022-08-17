<?php

namespace Kirby\Blueprint;

use Kirby\Architect\InspectorSection;
use Kirby\Cms\ModelWithContent;
use Kirby\Field\Fields;
use Kirby\Field\TextField;

/**
 * Page Blueprint Status
 *
 * @package   Kirby Blueprint
 * @author    Bastian Allgeier <bastian@getkirby.com>
 * @link      https://getkirby.com
 * @copyright Bastian Allgeier
 * @license   https://opensource.org/licenses/MIT
 */
class PageBlueprintStatus
{
	public function __construct(
		public PageBlueprintStatusOption|null $draft    = null,
		public PageBlueprintStatusOption|null $unlisted = null,
		public PageBlueprintStatusOption|null $listed   = null
	) {
	}

	public function defaults(): static
	{
		$this->draft    ??= new PageBlueprintStatusOption('draft');
		$this->unlisted ??= new PageBlueprintStatusOption('unlisted');
		$this->listed   ??= new PageBlueprintStatusOption('listed');

		return $this;
	}

	public static function factory(array $props): static
	{
		foreach ($props as $id => $option) {
			$props[$id] = PageBlueprintStatusOption::prefab($id, $option);
		}

		return new static(...$props);
	}

	public static function inspectorSection(): InspectorSection
	{
		$section = new InspectorSection(id: 'status', fields: new Fields());

		// @TODO implement status option fields
		$section->fields->draft    = new TextField(id: 'draft');
		$section->fields->unlisted = new TextField(id: 'unlisted');
		$section->fields->listed   = new TextField(id: 'listed');

		return $section;
	}

	public function render(ModelWithContent $model): array|false
	{
		$this->defaults();

		return array_filter([
			'draft'    => $this->draft->render($model),
			'unlisted' => $this->unlisted->render($model),
			'listed'   => $this->listed->render($model),
		]);
	}

}
