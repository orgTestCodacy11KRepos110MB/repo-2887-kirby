import { describe, expect, it } from "vitest";
import { toString } from "./colors.js";

describe.concurrent("$helper.css.colors.toString", () => {
	const data = {
		"should create HEX strings": [
			["#ff00ff", "#ff00ff"],
			["#f0f", "#f0f"],
			["#ff00ffaa", "#ff00ffaa"],
			["#f0fa", "#f0fa"]
		],
		"should create RGB(A) strings": [
			[{ r: 255, g: 255, b: 255, a: 1 }, "rgb(255, 255, 255)"],
			[{ r: 255, g: 255, b: 255, a: 0.3 }, "rgba(255, 255, 255, 0.3)"],
			[{ r: 255, g: 255, b: 255, a: 0 }, "rgba(255, 255, 255, 0)"]
		],
		"should create HSL(A) strings": [
			[{ h: 180, s: 0.2, l: 0.7, a: 1 }, "hsl(180, 20%, 70%)"],
			[{ h: 180, s: 0.2, l: 0.7, a: 0.3 }, "hsla(180, 20%, 70%, 0.3)"],
			[{ h: 180, s: 0.2, l: 0.7, a: 0 }, "hsla(180, 20%, 70%, 0)"]
		]
	};

	for (const test in data) {
		it(test, () => {
			for (const exp of data[test]) {
				expect(toString(exp[0])).toEqual(exp[1]);
			}
		});
	}

	it("should throw an error if not a color", () => {
		expect(() => toString({ a: 1, b: 2 })).toThrowError("not a color");
	});
});
