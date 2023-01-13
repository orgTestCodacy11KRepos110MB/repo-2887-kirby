<template>
	<div class="k-color-alpha">
		<input
			type="range"
			min="0"
			max="1"
			step="0.01"
			:value="value ?? 1"
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
.k-color-alpha {
	height: 1rem;
	background: var(--color-white) var(--bg-pattern);
	border-radius: var(--rounded-md);
}

.k-color-alpha input {
	background: linear-gradient(to right, transparent 0%, var(--color) 100%);
}
</style>
