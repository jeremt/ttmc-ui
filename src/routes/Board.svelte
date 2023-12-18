<script lang="ts">
	import { categoryToColor, type Team, board, categoryToText } from '$lib/data';

	export let teams: Team[];
</script>

<div class="board">
	{#each board as tile, i}
		<div class="tile" style:background-color={categoryToColor[tile]}>
			<img width="64" height="64" src="/{tile}.png" alt={tile} />
			{categoryToText[tile]}
			{#if i === teams[0].position}
				<div
					style:left=".5rem"
					style:background-color={teams[0].color}
					class="pawn"
					data-team={teams[0].name}
				>
					{teams[0].name}
				</div>
			{/if}
			{#if i === teams[1].position}
				<div
					style:left="2.5rem"
					style:background-color={teams[1].color}
					class="pawn"
					data-team={teams[1].name}
				>
					{teams[1].name}
				</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	.board {
		margin-bottom: 5rem;
		padding: 1rem;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1rem;
		font-size: 1.5rem;
		font-family: var(--font-title);
		font-weight: var(--font-title-weight);
		text-align: center;
		text-transform: uppercase;
	}
	.tile {
		position: relative;
		width: 10rem;
		height: 10rem;
		border-radius: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		gap: 0.5rem;
	}
	.pawn {
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		top: 0.5rem;
		width: 1.5rem;
		height: 1.5rem;
		border: 2px solid black;
		border-radius: 50%;
		animation: 2s translate-back forwards;
	}
	@keyframes translate-back {
		to {
			translate: 0 0;
		}
	}
</style>
