<script lang="ts">
	import { categoryToColor, type Team, board, categoryToText } from '$lib/data';

	export let teams: Team[];

	let tileSize = window.innerWidth < 600 ? 100 : 150;
	let cols = Math.floor(window.innerWidth / tileSize) - 1;
	let boardData = generate();

	function resize() {
		tileSize = window.innerWidth < 600 ? 100 : 150;
		cols = Math.floor(window.innerWidth / tileSize) - 1;
		boardData = generate();
	}

	function generate() {
		type TileKind =
			| 'start'
			| 'end-left'
			| 'end-right'
			| 'end-bottom'
			| 'top-left'
			| 'bottom-left'
			| 'top-right'
			| 'bottom-right'
			| 'default';
		const positions: { x: number; y: number; kind: TileKind }[] = [];
		let y = 0;
		// TODO: handle ends
		while (positions.length < board.length) {
			for (let x = 0; x < cols; x++) {
				let kind: TileKind = 'default';
				if (x === 0 && y === 0) {
					kind = 'start';
				} else if (positions.length + 1 === board.length) {
					kind = 'end-right';
				} else if (x === 0) {
					kind = 'bottom-left';
				} else if (x === cols - 1) {
					kind = 'top-right';
				}
				positions.push({ x, y, kind });
				if (positions.length === board.length) {
					return { positions, rows: y };
				}
			}
			positions.push({
				x: cols - 1,
				y: y + 1,
				kind: positions.length + 1 === board.length ? 'end-bottom' : 'default'
			});
			if (positions.length === board.length) {
				return { positions, rows: y + 1 };
			}
			y += 2;
			for (let x = cols - 1; x >= 0; x--) {
				let kind: TileKind = 'default';
				if (positions.length + 1 === board.length) {
					kind = 'end-left';
				} else if (x === 0) {
					kind = 'top-left';
				} else if (x === cols - 1) {
					kind = 'bottom-right';
				}
				positions.push({ x, y, kind });
				if (positions.length === board.length) {
					return { positions, rows: y };
				}
			}
			positions.push({
				x: 0,
				y: y + 1,
				kind: positions.length + 1 === board.length ? 'end-bottom' : 'default'
			});
			if (positions.length === board.length) {
				return { positions, rows: y + 1 };
			}
			y += 2;
		}
		return { positions, rows: y };
	}
</script>

<svelte:window on:resize={resize} />

<div class="board" style:--cols={cols} style:--rows={boardData.rows} style:--tileSize={tileSize}>
	{#each board as tile, i}
		<div
			class="tile {boardData.positions[i].kind}"
			style:left="{boardData.positions[i].x * tileSize}px"
			style:top="{boardData.positions[i].y * tileSize}px"
			style:background-color={categoryToColor[tile]}
			style:font-size={tileSize === 150 ? '1.4rem' : '1rem'}
		>
			<img
				width={tileSize * 0.5}
				height={tileSize * 0.5}
				style:pointer-events="none"
				src="/{tile}.png"
				alt={tile}
			/>
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
		position: relative;
		width: calc(var(--tileSize) * var(--cols) * 1px);
		height: calc(var(--tileSize) * var(--rows) * 1px + var(--tileSize) * 1px + 90px);
		margin: 2rem auto;
		font-family: var(--font-title);
		font-weight: var(--font-title-weight);
		text-align: center;
		text-transform: uppercase;
	}
	.tile {
		user-select: none;
		border: 1px solid black;
		position: absolute;
		box-sizing: border-box;
		width: calc(var(--tileSize) * 1px);
		height: calc(var(--tileSize) * 1px);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}
	.tile.start {
		border-radius: 1rem 0 0 1rem;
	}
	.tile.top-left {
		border-radius: 1rem 0 0 0;
	}
	.tile.bottom-left {
		border-radius: 0 0 0 1rem;
	}
	.tile.top-right {
		border-radius: 0 1rem 0 0;
	}
	.tile.bottom-right {
		border-radius: 0 0 1rem 0;
	}
	.tile.end-bottom {
		border-radius: 0 0 1rem 1rem;
	}
	.tile.end-right {
		border-radius: 0 1rem 1rem 0;
	}
	.tile.end-left {
		border-radius: 1rem 0 0 1rem;
	}
	.pawn {
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		top: 0.5rem;
		font-size: 1.5rem;
		width: 2.5rem;
		height: 2.5rem;
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
