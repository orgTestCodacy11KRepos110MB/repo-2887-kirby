<template>
	<div class="k-color-control k-color-hue">
		<input
			type="range"
			:value="value ?? 0"
			min="0"
			max="360"
			step="0.1"
			@input="onInput"
		/>
	</div>
</template>

<script>
export default {
	props: {
		value: Number
	},
	methods: {
		onInput(event) {
			this.$emit("input", Number(event.target.value));
		}
	}
};
</script>

<style>
.k-color-hue input {
	background: linear-gradient(
		to right,
		#ff0000 0%,
		#ffff00 17%,
		#00ff00 33%,
		#00ffff 50%,
		#0000ff 67%,
		#ff00ff 83%,
		#ff0000 100%
	);
}
</style>
