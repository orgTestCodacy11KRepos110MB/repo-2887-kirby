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
			hex = hex.split("").reduce((x, y) => x + y + y, "");
		}

		const num = parseInt(hex, 16);

		return {
			r: num >> 16,
			g: (num >> 8) & 0xff,
			b: num & 0xff,
			a: 1
		};
	}

	// with alpha (e.g. #ffaa0088)
	if (RE_HEXA.test(hex) === true) {
		// remove leading #
		hex = hex.slice(1);

		// expand short-notation to full eight-digit
		if (hex.length === 4) {
			hex = hex.split("").reduce((x, y) => x + y + y, "");
		}

		const num = parseInt(hex, 16);

		return {
			r: (num >> 24) & 0xff,
			g: (num >> 16) & 0xff,
			b: (num >> 8) & 0xff,
			a: Math.round(((num & 0xff) / 0xff) * 100) / 100
		};
	}

	throw new Error(`unknown hex color: ${hex}`);
}

export function rgba2hex({ r, g, b, a = 1 }) {
	r = Math.round(r);
	g = Math.round(g);
	b = Math.round(b);

	const num = (r << 16) | (g << 8) | b;
	const hex = ("000000" + num.toString(16)).slice(hex.length - 6);

	if (a < 1) {
		a = "0" + Math.round(a * 255).toString(16);
		return `#${hex}${a.slice(a.length - 2)}`;
	}

	return "#" + hex;
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

	const num = max - min;
	s = max === 0 ? 0 : num / max;

	if (max === min) {
		return { h: 0, s, v, a };
	}

	switch (max) {
		case r:
			h = (g - b) / num + (g < b ? 6 : 0);
			break;
		case g:
			h = (b - r) / num + 2;
			break;
		case b:
			h = (r - g) / num + 4;
			break;
	}

	return { h: h * 60, s, v, a };
}

export function hsva2rgba({ h, s, v, a }) {
	v *= 255;

	if (s === 0) {
		return { r: v, g: v, b: v, a };
	}

	if (h === 360) {
		h = 0;
	} else if (h > 360) {
		h -= 360;
	} else if (h < 0) {
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
			return { r: v, g: t, b: p, a };
		case 1:
			return { r: q, g: v, b: p, a };
		case 2:
			return { r: p, g: v, b: t, a };
		case 3:
			return { r: p, g: q, b: t, a };
		case 4:
			return { r: t, g: p, b: v, a };
		case 5:
			return { r: v, g: p, b: q, a };
	}
}

export function hsla2rgba({ h, s, l, a }) {
	if (s === 0) {
		l *= 255;
		return { r: l, g: l, b: l, a };
	}

	const num = [0, 0, 0];
	const x2 = l < 0.5 ? l * (1 + s) : l + s - l * s;
	const x3 = [0, 0, 0];
	const x1 = 2 * l - x2;
	const hh = h / 360;

	x3[0] = hh + 1 / 3;
	x3[1] = hh;
	x3[2] = hh - 1 / 3;

	for (let i = 0; i < 3; i++) {
		if (x3[i] < 0) {
			x3[i] += 1;
		} else if (x3[i] > 1) {
			x3[i] -= 1;
		}
		if (6 * x3[i] < 1) {
			num[i] = x1 + (x2 - x1) * 6 * x3[i];
		} else if (2 * x3[i] < 1) {
			num[i] = x2;
		} else if (3 * x3[i] < 2) {
			num[i] = x1 + (x2 - x1) * (2 / 3 - x3[i]) * 6;
		} else {
			num[i] = x1;
		}
	}

	return {
		r: Math.round(num[0] * 255),
		g: Math.round(num[1] * 255),
		b: Math.round(num[2] * 255),
		a
	};
}

export function rgba2hsla({ r, g, b, a }) {
	r /= 255;
	g /= 255;
	b /= 255;

	const min = Math.min(r, g, b);
	const max = Math.max(r, g, b);

	let h, s;
	const l = (max + min) / 2;

	if (max === min) {
		h = Number.NaN;
		s = 0;
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

export default {
	convert,
	parse,
	parseAs,
	toString
};
