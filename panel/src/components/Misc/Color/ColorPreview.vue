<template>
	<div class="k-color-preview">
		<div :style="'background: ' + color" />
	</div>
</template>

<script>
export default {
	props: {
		color: String
	}
};
</script>

<style>
.k-color-preview {
	position: relative;
	background: var(--color-white) var(--bg-pattern);
	overflow: hidden;
}
.k-color-preview > div {
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
}
</style>
