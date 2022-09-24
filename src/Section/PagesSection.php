<?php

namespace Kirby\Section;

use Kirby\Blueprint\PagesItems;
use Kirby\Cms\Collection as Models;
use Kirby\Cms\ModelWithContent;
use Kirby\Cms\Page;
use Kirby\Cms\Pages;
use Kirby\Cms\Site;
use Kirby\Table\TableColumn;
use Kirby\Table\TableColumns;
use Kirby\Toolkit\A;

/**
 * Pages section
 *
 * @package   Kirby Section
 * @author    Bastian Allgeier <bastian@getkirby.com>
 * @link      https://getkirby.com
 * @copyright Bastian Allgeier
 * @license   https://opensource.org/licenses/MIT
 */
class PagesSection extends ModelsSection
{
	public const ITEMS = PagesItems::class;
	public const TYPE  = 'pages';

	public function __construct(
		public string $id,
		public PagesSectionStatus|null $status = null,
		public array $templates = [],
		...$args
	) {
		parent::__construct($id, ...$args);
	}

	public function add(ModelWithContent $model, Models $models, array $query = []): bool
	{
		if ($this->status?->hasAddButton() !== true) {
			return false;
		}

		return parent::add($model, $models, $query);
	}

	/**
	 * Filters pages that are protected and not in the templates list
	 */
	public function applyFilters(Pages $pages): Pages
	{
		// internal `filter()` method used instead of foreach loop that previously included `unset()`
		// because `unset()` is updating the original data, `filter()` is just filtering
		// also it has been tested that there is no performance difference
		// even in 0.1 seconds on 100k virtual pages
		return $pages->filter(function ($page) {
			// remove all protected pages
			if ($page->isReadable() === false) {
				return false;
			}

			// filter by all set templates
			if ($this->templates && in_array($page->intendedTemplate()->name(), $this->templates) === false) {
				return false;
			}

			return true;
		});
	}

	/**
	 * Load, filter, sort and paginate all pages
	 * to show in the section
	 */
	public function models(ModelWithContent $model, array $query = []): Pages
	{
		$parent = $this->parent($model);

		// get pages by status
		$pages = match ($this->status?->value) {
			'draft'     => $parent->drafts(),
			'listed'    => $parent->children()->listed(),
			'published' => $parent->children(),
			'unlisted'  => $parent->children()->unlisted(),
			default     => $parent->childrenAndDrafts(),
		};

		$pages = $this->applyFilters($pages);
		$pages = $this->applySearch($pages, $query);
		$pages = $this->applySort($pages);
		$pages = $this->applyFlip($pages);
		$pages = $this->applyPagination($pages, $query);

		return $pages;
	}

	/**
	 * Page sections can only have a page or the site
	 * as parent. Users and files don't have subpages.
	 */
	public function parent(ModelWithContent $model): Page|Site
	{
		return parent::parent($model);
	}

	/**
	 * Support single template option
	 */
	public static function polyfill(array $props): array
	{
		if (isset($props['template']) === true) {
			$props['templates'] = A::wrap($props['template']);
			unset($props['template']);
		}

		return parent::polyfill($props);
	}

	public function sortable(ModelWithContent $model, Models $models, array $query = []): bool
	{
		if ($this->status?->isSortable() !== true) {
			return false;
		}

		return parent::sortable($model, $models, $query);
	}
}