<template>
	<div
		class="k-color-box k-color-control"
		tabindex="0"
		@click="onClick"
		@keydown.down.stop.prevent="onArrowDown"
		@keydown.up.stop.prevent="onArrowUp"
		@keydown.left.stop.prevent="onArrowLeft"
		@keydown.right.stop.prevent="onArrowRight"
	>
		<div
			v-if="value"
			class="k-color-box-handle"
			:style="'top: ' + posY + 'px; left: ' + posX + 'px;'"
		/>
	</div>
</template>

<script>
export default {
	props: {
		/**
		 * Object with `s` saturation and `v` value keys
		 */
		value: {
			type: Object
		}
	},
	data() {
		return {
			bounds: {}
		};
	},
	computed: {
		posX() {
			return this.width * this.value?.s;
		},
		posY() {
			return this.height - this.height * this.value?.v;
		},
		width() {
			return this.bounds.width;
		},
		height() {
			return this.bounds.height;
		}
	},
	mounted() {
		this.measure();
	},
	methods: {
		coords(event) {
			return {
				x: this.$helper.clamp(event.clientX - this.bounds.left, 0, this.width),
				y: this.$helper.clamp(event.clientY - this.bounds.top, 0, this.height)
			};
		},
		measure() {
			this.bounds = this.$el.getBoundingClientRect();
		},
		onArrowUp() {
			const v = this.$helper.clamp(this.value.v + 0.01, 0, 1);
			this.$emit("input", { ...this.value, v });
		},
		onArrowDown() {
			const v = this.$helper.clamp(this.value.v - 0.01, 0, 1);
			this.$emit("input", { ...this.value, v });
		},
		onArrowLeft() {
			const s = this.$helper.clamp(this.value.s - 0.01, 0, 1);
			this.$emit("input", { ...this.value, s });
		},
		onArrowRight() {
			const s = this.$helper.clamp(this.value.s + 0.01, 0, 1);
			this.$emit("input", { ...this.value, s });
		},
		onClick(event) {
			this.measure();
			const { x, y } = this.coords(event);
			this.set(x, y);
		},
		set(x, y) {
			this.$emit("input", {
				s: x / this.width,
				v: 1 - y / this.height
			});
		}
	}
};
</script>

<style>
.k-color-box {
	position: relative;
	padding-bottom: calc(100% * 2 / 3);
	background: linear-gradient(rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 100%),
		linear-gradient(to right, rgb(255, 255, 255) 0%, var(--hue) 100%);
	cursor: pointer;
}
.k-color-box-handle {
	position: absolute;
	transform: translate(-50%, -50%);
	z-index: var(--z-loader);
}
</style>
