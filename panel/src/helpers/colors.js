import { isObject } from "./object.js";

/**
 * Conversion methods:
 * - math functions to convert from/to RGBA
 * - helper functions for easier conversions between other color spaces
 */

export function hex2rgba(hex) {
	// without alpha (#ff00ff or #f0f)
	if (RE_HEX.test(hex) === true) {
		// remove leading #
		hex = hex.slice(1);

		// expand short-notation to full six-digit
		if (hex.length === 3) {
			hex = hex.split("");
			hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
		}

		const x = parseInt(hex, 16);
		return {
			r: x >> 16,
			g: (x >> 8) & 0xff,
			b: x & 0xff,
			a: 1
		};
	}

	// with alpha (e.g. #ffaa0088)
	if (RE_HEXA.test(hex) === true) {
		// remove leading #
		hex = hex.slice(1);

		// expand short-notation to full eight-digit
		if (hex.length === 4) {
			hex = hex.split("");
			hex =
				hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
		}
		const x = parseInt(hex, 16);

		return {
			r: (x >> 24) & 0xff,
			g: (x >> 16) & 0xff,
			b: (x >> 8) & 0xff,
			a: Math.round(((x & 0xff) / 0xff) * 100) / 100
		};
	}

	throw new Error(`unknown hex color: ${hex}`);
}

export function rgba2hex({ r, g, b, a = 1 }) {
	r = Math.round(r);
	g = Math.round(g);
	b = Math.round(b);
	const x = (r << 16) | (g << 8) | b;
	let hex = "000000" + x.toString(16);
	hex = hex.slice(hex.length - 6);

	if (a === 1) {
		return `#${hex}`;
	}

	a = "0" + Math.round(a * 255).toString(16);
	return `#${hex}${a.slice(a.length - 2)}`;
}

export function rgba2hsva({ r, g, b, a }) {
	r /= 255;
	g /= 255;
	b /= 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	let h,
		s,
		v = max;

	const d = max - min;
	s = max === 0 ? 0 : d / max;

	if (max === min) {
		h = 0;
	} else {
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}
		h /= 6;
	}

	return {
		h: h * 360,
		s,
		v,
		a
	};
}

export function hsva2rgba({ h, s, v, a }) {
	let r, g, b;

	v *= 255;

	if (s === 0) {
		r = g = b = v;
	} else {
		if (h === 360) {
			h = 0;
		}
		if (h > 360) {
			h -= 360;
		}
		if (h < 0) {
			h += 360;
		}
		h /= 60;

		const i = Math.floor(h);
		const f = h - i;
		const p = v * (1 - s);
		const q = v * (1 - s * f);
		const t = v * (1 - s * (1 - f));

		switch (i) {
			case 0:
				[r, g, b] = [v, t, p];
				break;
			case 1:
				[r, g, b] = [q, v, p];
				break;
			case 2:
				[r, g, b] = [p, v, t];
				break;
			case 3:
				[r, g, b] = [p, q, v];
				break;
			case 4:
				[r, g, b] = [t, p, v];
				break;
			case 5:
				[r, g, b] = [v, p, q];
				break;
		}
	}

	return { r, g, b, a };
}

export function hsla2rgba({ h, s, l, a }) {
	let r, g, b;
	if (s === 0) {
		r = g = b = l * 255;
	} else {
		const c = [0, 0, 0];
		const x2 = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const x3 = [0, 0, 0];
		const x1 = 2 * l - x2;
		const h_ = h / 360;
		x3[0] = h_ + 1 / 3;
		x3[1] = h_;
		x3[2] = h_ - 1 / 3;

		for (let i = 0; i < 3; i++) {
			if (x3[i] < 0) x3[i] += 1;
			if (x3[i] > 1) x3[i] -= 1;
			if (6 * x3[i] < 1) c[i] = x1 + (x2 - x1) * 6 * x3[i];
			else if (2 * x3[i] < 1) c[i] = x2;
			else if (3 * x3[i] < 2) c[i] = x1 + (x2 - x1) * (2 / 3 - x3[i]) * 6;
			else c[i] = x1;
		}

		[r, g, b] = [
			Math.round(c[0] * 255),
			Math.round(c[1] * 255),
			Math.round(c[2] * 255)
		];
	}

	return { r, g, b, a };
}

export function rgba2hsla({ r, g, b, a }) {
	r /= 255;
	g /= 255;
	b /= 255;

	const min = Math.min(r, g, b);
	const max = Math.max(r, g, b);

	const l = (max + min) / 2;
	let s, h;

	if (max === min) {
		s = 0;
		h = Number.NaN;
	} else {
		s = l < 0.5 ? (max - min) / (max + min) : (max - min) / (2 - max - min);
	}

	if (r == max) {
		h = (g - b) / (max - min);
	} else if (g == max) {
		h = 2 + (b - r) / (max - min);
	} else if (b == max) {
		h = 4 + (r - g) / (max - min);
	}

	h *= 60;
	if (h < 0) {
		h += 360;
	}

	return { h, s, l, a };
}

export function hsva2hsla(hsva) {
	return rgba2hsla(hsva2rgba(hsva));
}

export function hsla2hsva(hsla) {
	return rgba2hsva(hsla2rgba(hsla));
}

export function hsva2hex(hsva) {
	return rgba2hex(hsva2rgba(hsva));
}

export function hex2hsva(hex) {
	return rgba2hsva(hex2rgba(hex));
}

export function hsla2hex(hsla) {
	return rgba2hex(hsla2rgba(hsla));
}

export function hex2hsla(hex) {
	return rgba2hsla(hex2rgba(hex));
}

/**
 * @param {string|object} color
 * @returns {boolean}
 */
export function isHex(color) {
	return (
		typeof color === "string" && (RE_HEX.test(color) || RE_HEXA.test(color))
	);
}

/**
 * @param {string|object} color
 * @returns {boolean}
 */
export function isRgba(color) {
	return isObject(color) && "r" in color && "g" in color && "b" in color;
}

/**
 * @param {string|object} color
 * @returns {boolean}
 */
export function isHsla(color) {
	return isObject(color) && "h" in color && "s" in color && "l" in color;
}

/**
 * @param {string|object} color
 * @returns {boolean}
 */
export function isHsva(color) {
	return isObject(color) && "h" in color && "s" in color && "v" in color;
}

/**
 * Regular expressions for matching color strings
 */
const RE_HEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
const RE_HEXA = /^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{4})$/;
const RE_RGBA =
	/rgba?\((\d{1,3}%?),\s*(\d{1,3}%?),\s*(\d{1,3}%?),?\s*(\d*(?:\.\d+)?)\)/;
const RE_HSLA = /hsla?\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,?\s*(\d*(?:\.\d+)?)\)?/;

/**
 * Tries to parse a string as HEX, RGB(A) or HSL(A)
 * color and returns an object with type, string and values
 *
 * @param {string} string
 * @returns {object|false}
 */
export function parse(string) {
	let values;

	if (!string) {
		return false;
	}

	if (isHex(colorNames[string])) {
		return colorNames[string];
	}

	// HEX
	if (isHex(string)) {
		return string;
	}

	// RGB(A)
	if ((values = string.match(RE_RGBA))) {
		const [r, g, b, a] = values.slice(1);
		return {
			r: Number(r),
			g: Number(g),
			b: Number(b),
			a: Number(a || 1)
		};
	}

	// HSL(A)
	if ((values = string.match(RE_HSLA))) {
		const [h, s, l, a] = values.slice(1);
		return {
			h: Number(h),
			s: Number(s) / 100,
			l: Number(l) / 100,
			a: Number(a || 1)
		};
	}

	return false;
}

/**
 * Parses the input string and coverts it
 * (if necessary) to the target color space
 *
 * @param {string} string
 * @param {string} format hex, rgba, hsla or hsva
 * @returns {string|object|false}
 */
export function parseAs(string, format) {
	const color = parse(string);

	if (!color || !format) {
		return color;
	}

	return convert(color, format);
}

/**
 * Converts a color into another color space
 * @param {string|object} color
 * @param {string} format hex, rgba, hsla or hsva
 * @returns {string|object}
 */
export function convert(color, format) {
	if (isHex(color) === true) {
		switch (format) {
			case "hex":
				return color;
			case "rgb":
			case "rgba":
				return hex2rgba(color);
			case "hsl":
			case "hsla":
				return hex2hsla(color);
			case "hsv":
			case "hsva":
				return hex2hsva(color);
		}
	}

	if (isRgba(color) === true) {
		switch (format) {
			case "hex":
				return rgba2hex(color);
			case "rgb":
			case "rgba":
				return color;
			case "hsl":
			case "hsla":
				return rgba2hsla(color);
			case "hsv":
			case "hsva":
				return rgba2hsva(color);
		}
	}

	if (isHsla(color) === true) {
		switch (format) {
			case "hex":
				return hsla2hex(color);
			case "rgb":
			case "rgba":
				return hsla2rgba(color);
			case "hsl":
			case "hsla":
				return color;
			case "hsv":
			case "hsva":
				return hsla2hsva(color);
		}
	}

	if (isHsva(color) === true) {
		switch (format) {
			case "hex":
				return hsva2hex(color);
			case "rgb":
			case "rgba":
				return hsva2rgba(color);
			case "hsl":
			case "hsla":
				return hsva2hsla(color);
			case "hsv":
			case "hsva":
				return color;
		}
	}

	throw new Error(`unknown format: ${JSON.stringify(color)} -> ${format}`);
}

/**
 * Formats color as CSS string
 * @param {object|string} color
 * @param {string} format hex, rgba, hsla or hsva
 * @returns {string}
 */
export function toString(color, format) {
	// convert color if necessary
	if (format) {
		color = convert(color, format);
	}

	if (typeof color === "string") {
		return color;
	}

	if (isRgba(color) === true) {
		const r = color.r.toFixed();
		const g = color.g.toFixed();
		const b = color.b.toFixed();
		const a = color.a?.toFixed(2);

		if (a && a < 1) {
			return `rgba(${Number(r)}, ${Number(g)}, ${Number(b)}, ${Number(a)})`;
		}

		return `rgb(${Number(r)}, ${Number(g)}, ${Number(b)})`;
	}

	if (isHsla(color) === true) {
		const h = color.h.toFixed();
		const s = (color.s * 100).toFixed();
		const l = (color.l * 100).toFixed();
		const a = color.a?.toFixed(2);

		if (a && a < 1) {
			return `hsla(${Number(h)}, ${Number(s)}%, ${Number(l)}%, ${Number(a)})`;
		}

		return `hsl(${Number(h)}, ${Number(s)}%, ${Number(l)}%)`;
	}

	throw new Error(`not a color: ${JSON.stringify(color)}`);
}

const colorNames = {
	aliceblue: "#f0f8ff",
	antiquewhite: "#faebd7",
	aqua: "#00ffff",
	aquamarine: "#7fffd4",
	azure: "#f0ffff",
	beige: "#f5f5dc",
	bisque: "#ffe4c4",
	black: "#000000",
	blanchedalmond: "#ffebcd",
	blue: "#0000ff",
	blueviolet: "#8a2be2",
	brown: "#a52a2a",
	burlywood: "#deb887",
	cadetblue: "#5f9ea0",
	chartreuse: "#7fff00",
	chocolate: "#d2691e",
	coral: "#ff7f50",
	cornflowerblue: "#6495ed",
	cornsilk: "#fff8dc",
	crimson: "#dc143c",
	cyan: "#00ffff",
	darkblue: "#00008b",
	darkcyan: "#008b8b",
	darkgoldenrod: "#b8860b",
	darkgray: "#a9a9a9",
	darkgreen: "#006400",
	darkgrey: "#a9a9a9",
	darkkhaki: "#bdb76b",
	darkmagenta: "#8b008b",
	darkolivegreen: "#556b2f",
	darkorange: "#ff8c00",
	darkorchid: "#9932cc",
	darkred: "#8b0000",
	darksalmon: "#e9967a",
	darkseagreen: "#8fbc8f",
	darkslateblue: "#483d8b",
	darkslategray: "#2f4f4f",
	darkslategrey: "#2f4f4f",
	darkturquoise: "#00ced1",
	darkviolet: "#9400d3",
	deeppink: "#ff1493",
	deepskyblue: "#00bfff",
	dimgray: "#696969",
	dimgrey: "#696969",
	dodgerblue: "#1e90ff",
	firebrick: "#b22222",
	floralwhite: "#fffaf0",
	forestgreen: "#228b22",
	fuchsia: "#ff00ff",
	gainsboro: "#dcdcdc",
	ghostwhite: "#f8f8ff",
	goldenrod: "#daa520",
	gold: "#ffd700",
	gray: "#808080",
	green: "#008000",
	greenyellow: "#adff2f",
	grey: "#808080",
	honeydew: "#f0fff0",
	hotpink: "#ff69b4",
	indianred: "#cd5c5c",
	indigo: "#4b0082",
	ivory: "#fffff0",
	khaki: "#f0e68c",
	lavenderblush: "#fff0f5",
	lavender: "#e6e6fa",
	lawngreen: "#7cfc00",
	lemonchiffon: "#fffacd",
	lightblue: "#add8e6",
	lightcoral: "#f08080",
	lightcyan: "#e0ffff",
	lightgoldenrodyellow: "#fafad2",
	lightgray: "#d3d3d3",
	lightgreen: "#90ee90",
	lightgrey: "#d3d3d3",
	lightpink: "#ffb6c1",
	lightsalmon: "#ffa07a",
	lightseagreen: "#20b2aa",
	lightskyblue: "#87cefa",
	lightslategray: "#778899",
	lightslategrey: "#778899",
	lightsteelblue: "#b0c4de",
	lightyellow: "#ffffe0",
	lime: "#00ff00",
	limegreen: "#32cd32",
	linen: "#faf0e6",
	magenta: "#ff00ff",
	maroon: "#800000",
	mediumaquamarine: "#66cdaa",
	mediumblue: "#0000cd",
	mediumorchid: "#ba55d3",
	mediumpurple: "#9370db",
	mediumseagreen: "#3cb371",
	mediumslateblue: "#7b68ee",
	mediumspringgreen: "#00fa9a",
	mediumturquoise: "#48d1cc",
	mediumvioletred: "#c71585",
	midnightblue: "#191970",
	mintcream: "#f5fffa",
	mistyrose: "#ffe4e1",
	moccasin: "#ffe4b5",
	navajowhite: "#ffdead",
	navy: "#000080",
	oldlace: "#fdf5e6",
	olive: "#808000",
	olivedrab: "#6b8e23",
	orange: "#ffa500",
	orangered: "#ff4500",
	orchid: "#da70d6",
	palegoldenrod: "#eee8aa",
	palegreen: "#98fb98",
	paleturquoise: "#afeeee",
	palevioletred: "#db7093",
	papayawhip: "#ffefd5",
	peachpuff: "#ffdab9",
	peru: "#cd853f",
	pink: "#ffc0cb",
	plum: "#dda0dd",
	powderblue: "#b0e0e6",
	purple: "#800080",
	rebeccapurple: "#663399",
	red: "#ff0000",
	rosybrown: "#bc8f8f",
	royalblue: "#4169e1",
	saddlebrown: "#8b4513",
	salmon: "#fa8072",
	sandybrown: "#f4a460",
	seagreen: "#2e8b57",
	seashell: "#fff5ee",
	sienna: "#a0522d",
	silver: "#c0c0c0",
	skyblue: "#87ceeb",
	slateblue: "#6a5acd",
	slategray: "#708090",
	slategrey: "#708090",
	snow: "#fffafa",
	springgreen: "#00ff7f",
	steelblue: "#4682b4",
	tan: "#d2b48c",
	teal: "#008080",
	thistle: "#d8bfd8",
	tomato: "#ff6347",
	turquoise: "#40e0d0",
	violet: "#ee82ee",
	wheat: "#f5deb3",
	white: "#ffffff",
	whitesmoke: "#f5f5f5",
	yellow: "#ffff00",
	yellowgreen: "#9acd32"
};

export default {
	convert,
	parse,
	parseAs,
	toString
};
