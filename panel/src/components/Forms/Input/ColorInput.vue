<template>
	<div v-if="label && color?.text" class="k-text-input k-color-input">
		<span>
			{{ color.text }}
		</span>
	</div>
	<input
		v-else
		:id="id"
		ref="input"
		v-direction
		:autofocus="autofocus"
		:disabled="disabled"
		:placeholder="placeholder"
		:required="required"
		:value="value"
		autocomplete="off"
		spellcheck="false"
		type="text"
		class="k-text-input k-color-input"
		@blur="label = true"
		@focus="$emit('focus')"
		@input="onInput($event.target.value)"
		@paste.prevent="onPaste"
	/>
</template>

<script>
import { autofocus, disabled, id, required } from "@/mixins/props.js";
import { required as validateRequired } from "vuelidate/lib/validators";

export const props = {
	mixins: [autofocus, disabled, id, required],
	props: {
		colors: {
			type: Array
		},
		/**
		 * @values "hex", "rgb", "rgba", "hsl", "hsla"
		 */
		format: {
			type: String,
			default: "hex",
			validator: (value) =>
				["hex", "rgb", "rgba", "hsl", "hsla"].includes(value)
		},
		placeholder: {
			type: String
		},
		value: {
			type: String
		}
	}
};

/**
 */
export default {
	mixins: [props],
	inheritAttrs: false,
	data() {
		return {
			label: true
		};
	},
	computed: {
		color() {
			return this.colors.find((color) => color.value === this.value);
		}
	},
	watch: {
		value() {
			this.onInvalid();
		}
	},
	mounted() {
		this.onInvalid();
	},
	methods: {
		/**
		 * Focuses the input element
		 * @public
		 */
		focus() {
			this.label = false;
			this.$nextTick(() => this.$refs.input.focus());
		},
		onInput(value) {
			this.$emit("input", value);
		},
		onInvalid() {
			this.$emit("invalid", this.$v.$invalid, this.$v);
		},
		onPaste(event) {
			const value = this.$helper.clipboard.read(event);
			const color = this.$helper.colors.parseAs(value, this.format);
			this.$emit("input", color ? this.$helper.colors.toString(color) : value);
		}
	},
	validations() {
		return {
			value: {
				color: (value) =>
					value ? this.$helper.colors.parse(value) !== false : true,
				required: this.required ? validateRequired : true
			}
		};
	}
};
</script>

<style>
.k-color-input > span {
	font-size: var(--text-sm);
	line-height: 1;
	border-radius: var(--rounded);
	background-color: var(--color-gray-200);
	user-select: none;
	padding: 0.2rem 0.5rem;
	cursor: pointer;
}
</style>
