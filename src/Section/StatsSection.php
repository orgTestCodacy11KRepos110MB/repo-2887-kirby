<?php

namespace Kirby\Section;

use Kirby\Blueprint\Help;
use Kirby\Blueprint\Label;
use Kirby\Blueprint\Reports;
use Kirby\Blueprint\Promise;
use Kirby\Blueprint\Size;
use Kirby\Cms\ModelWithContent;

/**
 * Stats section
 *
 * @package   Kirby Section
 * @author    Bastian Allgeier <bastian@getkirby.com>
 * @link      https://getkirby.com
 * @copyright Bastian Allgeier
 * @license   https://opensource.org/licenses/MIT
 */
class StatsSection extends Section
{
	public const TYPE = 'stats';

	public function __construct(
		public string $id,
		public Help|null $help = null,
		public Label|null $label = null,
		public Reports|Promise|null $reports = null,
		public Size|null $size = null,
		...$args
	) {
		parent::__construct($id, ...$args);

		$this->label ??= Label::fallback($id);
	}

	public function render(ModelWithContent $model): array
	{
		return [
			'help'  => $this->help?->render($model),
			'label' => $this->label?->render($model)
		];
	}
}