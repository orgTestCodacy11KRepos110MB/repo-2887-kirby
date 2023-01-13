/**
 * @vitest-environment node
 */

import { describe, expect, it } from "vitest";
import { isObject } from "./object.js";

describe.concurrent("$helper.object.isObject()", () => {
	it("should identify objects", () => {
		expect(isObject({})).toBe(true);
		expect(isObject({ foo: "bar" })).toBe(true);
		expect(isObject([])).toBe(false);
		expect(isObject(undefined)).toBe(false);
		expect(isObject(null)).toBe(false);
		expect(isObject("")).toBe(false);
		expect(isObject("foo")).toBe(false);
	});
});
