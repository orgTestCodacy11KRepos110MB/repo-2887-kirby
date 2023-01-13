import { describe, expect, it } from "vitest";
import { parse } from "./colors.js";

describe.concurrent("$helper.css.colors.parse", () => {
	const data = {
		"should parse HEX colors": [
			["#ff00ff", "#ff00ff"],
			["#f0f", "#f0f"],
			["#ff00ffaa", "#ff00ffaa"],
			["#f0fa", "#f0fa"]
		],
		"should parse RGB(A) colors": [
			["rgb(255, 255, 255)", { r: 255, g: 255, b: 255, a: 1 }],
			["rgba(10, 5, 3, 0.5)", { r: 10, g: 5, b: 3, a: 0.5 }],
			["rgb(10, 5, 3, .5)", { r: 10, g: 5, b: 3, a: 0.5 }],
			["rgb(10, 5)", false]
		],
		"should parse HSL(A) colors": [
			["hsl(180, 10%, 20%)", { h: 180, s: 0.1, l: 0.2, a: 1 }],
			["hsla(180, 10%, 20%, .3)", { h: 180, s: 0.1, l: 0.2, a: 0.3 }],
			["hsl(180, 20%, .3)", false]
		]
	};

	for (const test in data) {
		it(test, () => {
			for (const exp of data[test]) {
				expect(parse(exp[0])).toEqual(exp[1]);
			}
		});
	}
});
