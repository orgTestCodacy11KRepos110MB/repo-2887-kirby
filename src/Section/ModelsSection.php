<?php

namespace Kirby\Section;

use Kirby\Architect\Inspector;
use Kirby\Architect\InspectorSection;
use Kirby\Blueprint\BlueprintImage;
use Kirby\Blueprint\EmptyState;
use Kirby\Blueprint\Items;
use Kirby\Blueprint\ItemsLayout;
use Kirby\Blueprint\ItemsSize;
use Kirby\Blueprint\NodeModel;
use Kirby\Blueprint\NodeText;
use Kirby\Cms\Collection as Models;
use Kirby\Cms\File;
use Kirby\Cms\ModelWithContent;
use Kirby\Cms\Page;
use Kirby\Cms\Site;
use Kirby\Cms\User;
use Kirby\Field\Fields;
use Kirby\Field\NumberField;
use Kirby\Field\TextField;
use Kirby\Field\ToggleField;
use Kirby\Table\TableColumn;
use Kirby\Table\TableColumns;
use Kirby\Toolkit\A;

class ModelsSection extends DisplaySection
{
	public const ITEMS = Items::class;
	public const TYPE  = 'models';

	public function __construct(
		public string $id,
		public TableColumns|null $columns = null,
		public EmptyState|null $empty = null,
		public bool $flip = false,
		public BlueprintImage|null $image = null,
		public NodeText|null $info = null,
		public ItemsLayout|null $layout = null,
		public int $limit = 20,
		public int|null $max = null,
		public int $min = 0,
		public int $page = 1,
		public NodeModel|null $parent = null,
		public bool $search = false,
		public ItemsSize|null $size = null,
		public bool $sortable = true,
		public string|null $sortBy = null,
		public NodeText|null $text = null,
		...$args
	) {
		parent::__construct($id, ...$args);
	}

	public function add(ModelWithContent $model, Models $models): bool
	{
		if ($this->isFull($models) === true) {
			return false;
		}

		return true;
	}

	public function applyFlip(Models $models): Models
	{
		if ($this->flip === false) {
			return $models;
		}

		return $models->flip();
	}

	public function applyPagination(Models $models, array $query = []): Models
	{
		return $models->paginate([
			'page'   => $query['page'] ?? $this->page,
			'limit'  => $this->limit,
			'method' => 'none'
		]);
	}

	public function applySearch(Models $models, array $query = []): Models
	{
		if ($this->search === false) {
			return $models;
		}

		if (empty($query['searchterm']) === true) {
			return $models;
		}

		return $models->search($query['searchterm']);
	}

	public function applySort(Models $models): Models
	{
		if ($this->sortBy === null) {
			return $models;
		}

		return $models->sort(...$models::sortArgs($this->sortBy));
	}

	public function defaults(): static
	{
		$this->layout ??= new ItemsLayout;
		$this->size   ??= new ItemsSize;

		return parent::defaults();
	}

	public static function inspector(): Inspector
	{
		$inspector = parent::inspector();

		// items
		$inspector->sections->add(static::inspectorItemsSection());

		// image settings
		$inspector->sections->add(BlueprintImage::inspectorSection());

		// sorting
		$inspector->sections->add(static::inspectorSortingSection());

		// pagination
		$inspector->sections->add(static::inspectorPaginationSection());

		// validation
		$inspector->sections->add(static::inspectorValidationSection());

		return $inspector;
	}

	public static function inspectorDescriptionSection(): InspectorSection
	{
		$section = parent::inspectorDescriptionSection();
		$section->fields->empty = EmptyState::field();

		return $section;
	}

	public static function inspectorItemsSection(): InspectorSection
	{
		return new InspectorSection(
			id: 'items',
			fields: new Fields([
				NodeModel::field()->set('id', 'parent')->set('label', 'Parent'),
				ItemsLayout::field(),
				ItemsSize::field(),
				NodeText::field()->set('id', 'text')->set('label', 'Text'),
				NodeText::field()->set('id', 'info')->set('label', 'Info')
			])
		);
	}

	public static function inspectorPaginationSection(): InspectorSection
	{
		return new InspectorSection(
			id: 'pagination',
			fields: new Fields([
				new NumberField(id: 'page'),
				new NumberField(id: 'limit'),
			])
		);
	}

	public static function inspectorSettingsSection(): InspectorSection
	{
		$section = parent::inspectorSettingsSection();
		$section->fields->search = new ToggleField(id: 'search');

		return $section;
	}

	public static function inspectorSortingSection(): InspectorSection
	{
		return new InspectorSection(
			id: 'sorting',
			fields: new Fields([
				new ToggleField(id: 'sortable'),
				new ToggleField(id: 'flip'),
				new TextField(id: 'sortBy')
			])
		);
	}

	public static function inspectorValidationSection(): InspectorSection
	{
		return new InspectorSection(
			id: 'validation',
			fields: new Fields([
				new NumberField(id: 'min'),
				new NumberField(id: 'max')
			])
		);
	}

	/**
	 * Checks if the maximum number of models
	 * has already been added to the section
	 */
	public function isFull(Models $models): bool
	{
		if ($this->max === null) {
			return false;
		}

		return $models->pagination()->total() >= $this->max;
	}

	public function items(Models $models): Items
	{
		return new (static::ITEMS)(
			columns: $this->columns,
			empty: $this->empty,
			image: $this->image,
			info: $this->info,
			layout: $this->layout,
			models: $models,
			size: $this->size,
			text: $this->text
		);
	}

	/**
	 * Returns the correct link for the section label.
	 * If the model is the parent, the link will be empty,
	 * because the section is in the model panel view and
	 * the label should not be linked.
	 */
	public function link(ModelWithContent $model, File|Page|Site|User $parent): ?string
	{
		$modelLink  = $model->panel()->url(true);
		$parentLink = $parent->panel()->url(true);

		return $modelLink !== $parentLink ? $parentLink : null;
	}

	public function models(ModelWithContent $model, array $query = []): Models
	{
		return new Models();
	}

	public function options(ModelWithContent $model, Models $models, array $query): array
	{
		return [
			'add'      => $this->add($model, $models, $query),
			'search'   => $this->search,
			'sortable' => $this->sortable($model, $models, $query)
		];
	}

	/**
	 * Get the parent model. If a parent query
	 * has been set, the model is queried. Otherwise
	 * the passed model is being used
	 */
	public function parent(ModelWithContent $model): File|Page|Site|User
	{
		if ($this->parent === null) {
			return $model;
		}

		// get the related model
		return $this->parent->model($model);
	}

	/**
	 * The basic section is only rendered with the label,
	 * a loading state for items and the help text.
	 * The rest will be loaded lazily.
	 */
	public function render(ModelWithContent $model): array
	{
		$this->defaults();

		return parent::render($model) + [
			'link' => $this->link($model, $this->parent($model)),
		];
	}

	public function routes(ModelWithContent $model): array
	{
		return [
			[
				'pattern' => '/',
				'action'  => function (array $query = []) use ($model) {
					// rendering the items needs the defaults
					$this->defaults();

					$models = $this->models($model, $query);
					$items  = $this->items($models);

					return [
						'data'       => $items->render($model),
						'options'    => $items->options($model) + $this->options($model, $models, $query),
						'pagination' => $items->pagination(),
					];
				}
			]
		];
	}

	public function sortable(ModelWithContent $model, Models $models, array $query = []): bool
	{
		if ($this->sortable === false) {
			return false;
		}

		if ($this->sortBy !== null) {
			return false;
		}

		// don't allow sorting while search filter is active
		if ($this->search === true && empty($query['searchterm']) === false) {
			return false;
		}

		if ($this->flip === true) {
			return false;
		}

		return true;
	}
}