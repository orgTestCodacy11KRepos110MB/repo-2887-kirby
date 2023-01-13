/**
 * Clone provided object or array
 *
 * @param {Object|array} array
 * @returns  {Object|array}
 */
export function clone(array) {
	if (array === undefined) {
		return undefined;
	}

	return JSON.parse(JSON.stringify(array));
}

/**
 * Checks if value is empty
 *
 * @param {mixed} value
 * @returns {bool}
 */
export function isEmpty(value) {
	if (value === undefined || value === null || value === "") {
		return true;
	}

	if (
		typeof value === "object" &&
		Object.keys(value).length === 0 &&
		value.constructor === Object
	) {
		return true;
	}

	if (value.length !== undefined && value.length === 0) {
		return true;
	}

	return false;
}

/**
 * Checks if is an object
 *
 * @param {mixed} object
 * @returns {boolean}
 */
export function isObject(object) {
	return typeof object === "object" && object?.constructor === Object;
}

/**
 * Merges two objects
 *
 * @param {Object} target
 * @param {Object} source
 * @returns {Object}
 */
export function merge(target, source) {
	// Iterate through `source` properties and if an `Object` set property to merge of `target` and `source` properties
	for (const key of Object.keys(source)) {
		if (source[key] instanceof Object) {
			Object.assign(source[key], merge(target[key] || {}, source[key]));
		}
	}

	// Join `target` and modified `source`
	Object.assign(target || {}, source);
	return target;
}

/**
 * Converts to lowercase all keys in an object
 *
 * @param {Object} obj
 * @returns {Object}
 */
export function toLowerKeys(obj) {
	return Object.keys(obj).reduce((item, key) => {
		item[key.toLowerCase()] = obj[key];
		return item;
	}, {});
}

export default {
	clone,
	isEmpty,
	isObject,
	merge,
	toLowerKeys
};
