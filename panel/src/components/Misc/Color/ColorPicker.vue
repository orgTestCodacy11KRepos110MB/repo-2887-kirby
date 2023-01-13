<template>
	<div class="k-color-picker" :style="'--hue: ' + hue + '; --color: ' + color">
		<box :value="current" @input="onInput($event)" />
		<hue :value="current?.h" @input="onInput({ h: $event })" />
		<alpha v-if="alpha" :value="current?.a" @input="onInput({ a: $event })" />
	</div>
</template>

<script>
import Alpha from "./ColorAlpha.vue";
import Box from "./ColorBox.vue";
import Hue from "./ColorHue.vue";

export default {
	components: {
		Alpha,
		Box,
		Hue
	},
	props: {
		alpha: {
			type: Boolean,
			default: true
		},
		/**
		 * HSVA object
		 */
		value: {
			type: Object
		}
	},
	data() {
		return {
			current: this.value
		};
	},
	computed: {
		color() {
			return this.$helper.colors.toString(
				{ ...(this.current ?? { h: 0, s: 1, v: 1 }), a: 1 },
				"rgba"
			);
		},
		hue() {
			return this.$helper.colors.toString({
				h: this.current?.h ?? 0,
				s: 1,
				l: 0.5
			});
		}
	},
	watch: {
		value(value) {
			this.current = value;
		}
	},
	methods: {
		onInput(value) {
			this.current = {
				h: 0,
				s: 1,
				v: 1,
				a: 1,
				...this.current,
				...value
			};
			this.$emit("input", this.current);
		}
	}
};
</script>

<style>
.k-color-picker {
	display: flex;
	width: 100%;
	flex-direction: column;
	gap: 0.75rem;
}

.k-color-picker input[type="range"] {
	width: 100%;
	height: 100%;
	outline: 0;
	appearance: none;
}

.k-color-box-handle,
.k-color-picker input[type="range"]::-webkit-slider-thumb {
	-webkit-appearance: none;
	border: 1px solid var(--color-white);
	height: 0.75rem;
	width: 0.75rem;
	border-radius: 50%;
	background: var(--color-white);
	box-shadow: var(--shadow);
}

.k-color-picker input[type="range"]::-webkit-slider-thumb {
	cursor: grab;
}

.k-color-control,
.k-color-picker input[type="range"] {
	border-radius: var(--rounded-md);
}
</style>
