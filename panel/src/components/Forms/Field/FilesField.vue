<template>
	<k-field v-bind="$props" class="k-files-field">
		<template v-if="!isLoading && !disabled && more" #options>
			<k-button-group class="k-field-options">
				<k-options-dropdown ref="options" v-bind="options" @action="action" />
			</k-button-group>
		</template>

		<template v-if="isLoading">
			<k-empty icon="loader">Loading …</k-empty>
		</template>

		<template v-else>
			<k-dropzone :disabled="!moreUpload" @drop="drop">
				<k-collection
					v-bind="collection"
					@empty="prompt"
					@sort="sort"
					@sortChange="$emit('change', $event)"
				>
					<template #options="{ item }">
						<k-button
							v-if="!disabled"
							:tooltip="$t('remove')"
							icon="remove"
							@click="remove(item)"
						/>
					</template>
				</k-collection>
			</k-dropzone>

			<k-upload ref="fileUpload" @success="upload" />
		</template>
	</k-field>
</template>

<script>
import picker from "@/mixins/forms/picker.js";

/**
 * @example <k-files-field v-model="files" name="files" label="Files" />
 */
export default {
	mixins: [picker],
	inheritAttrs: false,
	props: {
		uploads: [Boolean, Object, Array]
	},
	computed: {
		moreUpload() {
			return true;
		},
		options() {
			if (this.uploads) {
				return {
					icon: "add",
					text: "Add",
					options: [
						{ icon: "check", text: this.$t("select"), click: "open" },
						{ icon: "upload", text: this.$t("upload"), click: "upload" }
					]
				};
			}

			return {
				options: [
					{ icon: "check", text: this.$t("select"), click: () => this.open() }
				]
			};
		}
	},
	methods: {
		drop(files) {
			if (this.uploads === false) {
				return false;
			}

			return this.$refs.fileUpload.drop(files, this.uploadParams);
		},
		prompt() {
			if (this.disabled) {
				return false;
			}

			if (this.moreUpload) {
				this.$refs.options.toggle();
			} else {
				this.open();
			}
		},
		action(action) {
			// no need for `action` modifier
			// as native button `click` prop requires
			// inline function when only one option available
			if (!this.moreUpload) {
				return;
			}

			switch (action) {
				case "open":
					return this.open();
				case "upload":
					return this.$refs.fileUpload.open(this.uploadParams);
			}
		},
		upload(upload, files) {
			if (this.multiple === false) {
				this.selected = [];
			}

			// files.forEach((file) => {
			// 	if (!this.isSelected(file)) {
			// 		this.selected.push(file);
			// 	}
			// });
		}
	}
};
</script>

<style>
.k-files-field[data-disabled="true"] * {
	pointer-events: all !important;
}
</style>
