<template>
	<input
		:id="id"
		ref="input"
		v-direction
		:autofocus="autofocus"
		:class="`k-text-input k-color-input`"
		:disabled="disabled"
		:placeholder="placeholder"
		:required="required"
		:value="value"
		autocomplete="off"
		spellcheck="false"
		type="text"
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
			this.$refs.input.focus();
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
