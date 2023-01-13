import { describe, expect, it } from "vitest";
import { convert } from "./colors.js";

describe.concurrent("$helper.css.colors.convert", () => {
	it("hex2rgba", () => {
		expect(convert("#fff", "rgba")).toEqual({ r: 255, g: 255, b: 255, a: 1 });
	});
});
