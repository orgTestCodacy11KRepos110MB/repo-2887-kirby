<?php

namespace Kirby\Blueprint;

use Kirby\Architect\Inspector;
use Kirby\Architect\InspectorSection;
use Kirby\Architect\InspectorSections;
use Kirby\Cms\ModelWithContent;
use Kirby\Exception\NotFoundException;
use Kirby\Field\Fields;
use Kirby\Field\TextField;
use Kirby\Section\Sections;

/**
 * Tab
 *
 * @package   Kirby Blueprint
 * @author    Bastian Allgeier <bastian@getkirby.com>
 * @link      https://getkirby.com
 * @copyright Bastian Allgeier
 * @license   https://opensource.org/licenses/MIT
 */
class Tab extends NodeLabelled
{
	public function __construct(
		public string $id,
		public NodeIcon|null $icon = null,
		public Columns|null $columns = null,
		...$args,
	) {
		parent::__construct($id, ...$args);
	}

	/**
	 * Finds a column by id
	 */
	public function column(string $id): ?Column
	{
		return $this->columns()->$id;
	}

	public function columns(): Columns
	{
		return $this->columns ?? new Columns();
	}

	/**
	 * Collects all fields from all columns
	 */
	public function fields(): Fields
	{
		return $this->sections()->fields();
	}

	public static function find(Blueprint|string $blueprintPath, Tab|string $tabId): static
	{
		if (is_a($tabId, Tab::class) === true) {
			return $tabId;
		}

		if ($tab = Blueprint::find($blueprintPath)->tabs()->$tabId) {
			return $tab;
		}

		throw new NotFoundException('The tab "' . $tabId . '" could not be found');
	}

	public static function inspector(): Inspector
	{
		$inspector = parent::inspector();
		$inspector->id = 'tab';

		$settings = $inspector->sections->settings;

		$settings->fields->label = NodeLabel::field();
		$settings->fields->icon  = NodeIcon::field();

		return $inspector;
	}

	public function render(ModelWithContent $model, bool $active = false): array
	{
		if ($active === true) {
			return [
				'columns' => $this->columns()->render($model),
				'id'      => $this->id,
			];
		}

		return [
			'icon'  => $this->icon?->render($model),
			'id'    => $this->id,
			'label' => $this->label()->render($model),
			'link'  => $model->panel()->url(true) . '?tab=' . $this->id,
		];
	}

	/**
	 * Tabs can use shortcuts for fields and sections
	 * without properly wrapping them in a fields section
	 * or columns. The polyfill will wrap them properly.
	 */
	public static function polyfill(array $props): array
	{
		$props = Polyfill::fields($props);
		$props = Polyfill::sections($props);

		return parent::polyfill($props);
	}

	/**
	 * Collects all sections from all columns
	 */
	public function sections(): Sections
	{
		return $this->columns()->sections();
	}
}