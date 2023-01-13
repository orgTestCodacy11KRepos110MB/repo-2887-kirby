<?php

return [
	'props' => [

		/**
		 * Unset inherited props
		 */
		'after'       => null,
		'before'      => null,

		'alpha' => function (bool $alpha = true) {
			return $alpha;
		},
		'colors' => function (array $colors = []) {
			return $colors;
		},
		'format' => function (string $format = 'hex') {
			return $format;
		},
	],
	'computed' => [
		'colors' => function () {
			$colors = [];

			foreach ($this->colors as $key => $value) {
				$color = ['value' => $value];

				if (is_string($key) === true) {
					$color['text'] = $key;
				}

				$colors[] = $color;
			}

			return $colors;
		},
		'placeholder' => function () {
			if ($this->placeholder) {
				return $this->placeholder;
			}

			if ($this->format === "rgb" || $this->format === "rgba") {
				return "rgb(0, 0, 0)";
			}

			if ($this->format === "hsl" || $this->format === "hsla") {
				return "hsl(0, 0, 0)";
			}

			return "#000000";
		}
	]
];
