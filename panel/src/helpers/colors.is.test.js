import { describe, expect, it } from "vitest";
import { isHex, isHsla, isHsva, isRgba } from "./colors.js";

describe.concurrent("$helper.css.colors checks", () => {
	it("isHex", () => {
		expect(isHex("#fff")).toBe(true);
		expect(isHex("#fff0")).toBe(true);
		expect(isHex("#ff00aa")).toBe(true);
		expect(isHex("#ff00ff0a")).toBe(true);
		expect(isHex("#ff00yy")).toBe(false);
		expect(isHex("foo")).toBe(false);
		expect(isHex({ r: 12, g: 0, b: 100, a: 0.5 })).toBe(false);
		expect(isHex({})).toBe(false);
	});

	it("isRgba", () => {
		expect(isRgba({ r: 12, g: 0, b: 100, a: 0.5 })).toBe(true);
		expect(isRgba({ r: 12, g: 0, b: 100 })).toBe(true);
		expect(isRgba({ h: 12, s: 23, l: 1 })).toBe(false);
		expect(isRgba({ r: 1, g: 2 })).toBe(false);
		expect(isRgba({})).toBe(false);
		expect(isRgba("foo")).toBe(false);
	});

	it("isHsla", () => {
		expect(isHsla({ h: 12, s: 0, l: 100, a: 0.5 })).toBe(true);
		expect(isHsla({ h: 12, s: 0, l: 100 })).toBe(true);
		expect(isHsla({ r: 12, g: 23, b: 1 })).toBe(false);
		expect(isHsla({ r: 1, g: 2 })).toBe(false);
		expect(isHsla({})).toBe(false);
		expect(isHsla("foo")).toBe(false);
	});

	it("isHsva", () => {
		expect(isHsva({ h: 12, s: 0, v: 100, a: 0.5 })).toBe(true);
		expect(isHsva({ h: 12, s: 0, v: 100 })).toBe(true);
		expect(isHsva({ r: 12, g: 23, b: 1 })).toBe(false);
		expect(isHsva({ r: 1, g: 2 })).toBe(false);
		expect(isHsva({})).toBe(false);
		expect(isHsva("foo")).toBe(false);
	});
});
