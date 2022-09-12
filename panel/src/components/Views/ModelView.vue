<script>
export default {
	props: {
		blueprint: String,
		next: Object,
		prev: Object,
		permissions: {
			type: Object,
			default() {
				return {};
			}
		},
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
		isLocked() {
			return this.lock?.state === "lock";
		},
		protectedFields() {
			return [];
		}
	},
	watch: {
		"model.content"() {
			this.values = this.model.content;
		}
	},
	created() {
		this.autosave = this.$helper.debounce(this.autosave, 250);

		this.$events.$on("model.reload", this.$reload);
		this.$events.$on("keydown.left", this.toPrev);
		this.$events.$on("keydown.right", this.toNext);
	},
	destroyed() {
		this.$events.$off("model.reload", this.$reload);
		this.$events.$off("keydown.left", this.toPrev);
		this.$events.$off("keydown.right", this.toNext);
	},
	methods: {
		async autosave() {
			this.$api.patch(this.id, this.values, true);
		},
		onInput(values) {
			this.values = values;
			this.autosave();
		},
		toPrev(e) {
			if (this.prev && e.target.localName === "body") {
				this.$go(this.prev.link);
			}
		},
		toNext(e) {
			if (this.next && e.target.localName === "body") {
				this.$go(this.next.link);
			}
		}
	}
};
</script>
