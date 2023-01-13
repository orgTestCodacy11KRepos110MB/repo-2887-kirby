<template>
	<k-field v-bind="$props" class="k-color-field">
		<!-- Colors switches -->
		<div v-if="format === 'colors'" class="k-color-field-colors">
			<k-button
				v-for="color in colors"
				:key="color.value"
				:current="color.value === value"
				:tooltip="color.text"
				role="switch"
				@click="onInput(color.value)"
			>
				<k-color-preview :color="color.value" />
			</k-button>
		</div>

		<!-- Input with picker -->
		<k-input v-else v-bind="$props" theme="field" type="color" @input="onInput">
			<!-- Preview -->
			<template #before>
				<k-color-preview
					class="k-color-field-preview"
					:color="hsva ? value : 'transparent'"
				/>
			</template>

			<!-- Picker dropdown -->
			<template #icon>
				<k-dropdown>
					<k-button
						icon="pipette"
						class="k-input-icon-button"
						@click="$refs.dropdown.toggle()"
					/>
					<k-dropdown-content ref="dropdown" align="right" theme="dark">
						<k-color-picker :value="hsva" :alpha="alpha" @input="onPicker" />

						<div v-if="colors" class="k-color-field-picker-defaults">
							<k-button
								v-for="color in colors"
								:key="color.value"
								:tooltip="color.text"
								@click="onInput(color.value)"
							>
								<k-color-preview :color="color.value" />
							</k-button>
						</div>
					</k-dropdown-content>
				</k-dropdown>
			</template>
		</k-input>
	</k-field>
</template>

<script>
import { props as ColorInput } from "../Input/ColorInput.vue";
import { props as Field } from "../Field.vue";
import { props as Input } from "../Input.vue";

export default {
	mixins: [Input, Field, ColorInput],
	props: {
		/**
		 * Shows/hide alpha control
		 * in the color picker
		 */
		alpha: {
			type: Boolean,
			default: true
		},
		colors: {
			type: Array
		},
		/**
		 * @values "hex", "rgb", "rgba", "hsl", "hsla", "colors"
		 */
		format: {
			type: String,
			default: "hex",
			validator: (value) =>
				["hex", "rgb", "rgba", "hsl", "hsla", "colors"].includes(value)
		}
	},
	computed: {
		hsva() {
			return this.$helper.colors.parseAs(this.value, "hsva") || null;
		}
	},
	methods: {
		onInput(value) {
			this.$emit("input", value);
		},
		onPicker(hsva) {
			const value = this.$helper.colors.toString(hsva, this.format);
			this.$emit("input", value);
		}
	}
};
</script>

<style>
.k-color-field .k-input[data-theme="field"] .k-input-before {
	padding-inline: 0;
}
.k-color-field-preview {
	width: 36px;
	height: 100%;
}

.k-color-field-colors {
	display: flex;
	gap: 0.5rem;
}
.k-color-field-colors .k-color-preview {
	width: 2rem;
	height: 2rem;
	border-radius: var(--rounded);
}
.k-color-field-colors .k-button-text {
	opacity: 1;
}
.k-color-field-colors .k-button[aria-current="true"] .k-color-preview {
	outline: 2px solid var(--color-focus);
}

.k-color-field .k-dropdown-content {
	padding: 0.75rem;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}
.k-color-field-picker-defaults {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	justify-content: center;
}

.k-color-field-picker-defaults .k-color-preview {
	width: 1.5rem;
	height: 1.5rem;
	border-radius: var(--rounded);
}
.k-color-field-picker-defaults .k-button-text {
	opacity: 1;
}
</style>
