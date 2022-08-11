<?php

namespace Kirby\Section;

use Kirby\Architect\Inspector;
use Kirby\Architect\InspectorSection;
use Kirby\Cms\ModelWithContent;
use Kirby\Field\Fields;
use Kirby\Field\TextField;

/**
 * Display section
 *
 * @package   Kirby Section
 * @author    Bastian Allgeier <bastian@getkirby.com>
 * @link      https://getkirby.com
 * @copyright Bastian Allgeier
 * @license   https://opensource.org/licenses/MIT
 */
class DisplaySection extends Section
{
	public const TYPE = 'display';

	public function __construct(
		public string $id,
		public SectionHelp|null $help = null,
		public SectionLabel|null $label = null,
		...$args
	) {
		parent::__construct($id, ...$args);
	}

	public function defaults(): void
	{
		$this->label ??= SectionLabel::fallback($this->id);
	}

	public static function inspector(): Inspector
	{
		$inspector = parent::inspector();
		$inspector->sections->add(
			new InspectorSection(
				id: 'description',
				fields: new Fields([
					SectionLabel::field(),
					SectionHelp::field()
				])
			)
		);

		return $inspector;
	}

	public function render(ModelWithContent $model): array
	{
		return parent::render($model) + [
			'help'  => $this->help?->render($model),
			'label' => $this->label?->render($model),
		];
	}
}
