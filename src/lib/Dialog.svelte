<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let isOpen = false;

	const dispatch = createEventDispatcher<{ requestclose: undefined }>();

	let dialog: HTMLDialogElement;

	function handleCancel(event: Event) {
		event.preventDefault();
		dispatch('requestclose');
	}
	function handleAnimationEnd() {
		if (!isOpen) {
			dialog.close();
		}
	}

	$: if (isOpen) {
		dialog.showModal();
	}
</script>

<dialog
	bind:this={dialog}
	class:closing={!isOpen}
	on:cancel={handleCancel}
	on:animationend={handleAnimationEnd}
>
	<slot />
</dialog>

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	@keyframes fade-out {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}
	@keyframes slide-in {
		from {
			translate: 0 20%;
			opacity: 0;
		}
		to {
			translate: 0;
			opacity: 1;
		}
	}
	@keyframes slide-out {
		from {
			translate: 0;
			opacity: 1;
		}
		to {
			translate: 0 20%;
			opacity: 0;
		}
	}
	dialog {
		color: var(--theme-colors-fg);
		border: none;
		padding: 1.5rem;
		border-radius: 1em;
		background-color: var(--theme-colors-bg);
	}
	dialog[open] {
		animation: slide-in 0.3s cubic-bezier(0.25, 0, 0.3, 1) normal;
	}
	dialog[open].closing {
		animation: slide-out 0.3s cubic-bezier(0.25, 0, 0.3, 1) normal;
	}

	dialog::backdrop {
		backdrop-filter: blur(5px) saturate(0.5) brightness(0.5);
		background-color: rgba(84, 84, 84, 0.13);
	}
	dialog[open]::backdrop {
		animation: fade-in 0.3s cubic-bezier(0.25, 0, 0.3, 1) normal;
	}
	dialog[open].closing::backdrop {
		animation: fade-out 0.3s cubic-bezier(0.25, 0, 0.3, 1) normal;
	}
</style>
