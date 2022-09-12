<template>
	<k-inside class="k-live-view">
		<div class="k-live-layout">
			<div class="k-live-layout-sidebar">
				<k-sections
					:blueprint="blueprint"
					:empty="$t('page.blueprint', { blueprint: $esc(blueprint) })"
					:lock="lock"
					:model="model"
					:parent="id"
					:tab="tabEditor"
					@input="onInput"
				/>
			</div>
			<div class="k-live-layout-frame">
				<iframe ref="preview" :src="model.url + '/revision'"></iframe>
			</div>
		</div>
	</k-inside>
</template>

<script>
export default {
	props: {
		blueprint: String,
		lock: {
			type: [Boolean, Object]
		},
		model: {
			type: Object,
			default() {
				return {};
			}
		},
		tab: {
			type: Object,
			default() {
				return {
					columns: []
				};
			}
		},
		tabs: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	data() {
		return {
			values: this.model.content
		};
	},
	computed: {
		id() {
			return this.model.link;
		},
		tabEditor() {
			const tab = this.tab;

			tab.columns.map((column) => {
				column.width = "1/1";
				return column;
			});

			return tab;
		}
	},
	watch: {
		"model.content": {
			handler() {
				this.values = this.model.content;
				this.refresh();
			},
			deep: true
		}
	},
	created() {
		this.autosave = this.$helper.debounce(this.autosave, 250);
		this.refresh = this.$helper.debounce(this.refresh, 250);
	},
	methods: {
		async autosave() {
			await this.$api.patch(this.id, this.values, true);
			this.refresh();
		},
		async refresh() {
			const response = await fetch(this.model.url + "/revision");
			const html = await response.text();

			let doc = this.$refs.preview.contentWindow.document;

			doc.open();
			doc.write(html);
			doc.close();
		},
		onInput(values) {
			this.values = values;
			this.autosave();
		}
	}
};
</script>

<style>
.k-live-view .k-topbar .k-view {
	max-width: 100%;
	padding: 0 0.75rem;
}
.k-live-view .k-panel-view {
	position: relative;
	height: calc(100vh - 2.5rem);
	overflow: hidden;
}
.k-live-layout {
	position: absolute;
	inset: 0;
	display: grid;
	grid-template-columns: minmax(0, 30rem) 1fr;
}
.k-live-layout-sidebar {
	padding: 1.5rem;
	overflow-x: hidden;
	overflow-y: scroll;
}

.k-live-layout-sidebar .k-sections.k-grid,
.k-live-layout-sidebar .k-fieldset > .k-grid {
	display: block;
}
.k-live-layout-sidebar .k-sections.k-grid > *,
.k-live-layout-sidebar .k-fieldset > .k-grid > * {
	margin-bottom: 1.5rem;
}

.k-live-layout-frame {
	position: relative;
}
.k-live-layout-frame iframe {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	background: #fff;
	border: 0;
}
</style>
