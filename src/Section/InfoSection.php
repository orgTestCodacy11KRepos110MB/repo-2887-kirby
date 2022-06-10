<?php

namespace Kirby\Section;

/**
 * @package   Kirby Section
 * @author    Bastian Allgeier <bastian@getkirby.com>
 * @link      https://getkirby.com
 * @copyright Bastian Allgeier
 * @license   https://opensource.org/licenses/MIT
 */
class InfoSection extends Section
{
    /**
     * @return array
     */
    public static function schema(): array
    {
        return array_merge(parent::schema(), [
            'text' => [
                'type' => 'i18n'
            ],
            'theme' => [
                'type' => 'string'
            ]
        ]);
    }

    /**
     * @return array
     */
    public function props(): array
    {
        return [
            'label' => $this->label(),
            'help'  => $this->help(),
            'text'  => $this->text(),
            'theme' => $this->options['theme']
        ];
    }

    /**
     * @return string|null
     */
    public function text(): ?string
    {
        $text = $this->stringTemplate($this->options['text']);
        $text = $this->stringToKirbytext($text);

        return $text;
    }

    /**
     * @return string|null
     */
    public function theme(): ?string
    {
        return $this->options['theme'];
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'info';
    }
}
