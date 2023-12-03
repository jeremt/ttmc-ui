<script lang="ts">
	import { onMount } from 'svelte';

	import Board from './Board.svelte';
	import Dialog from '$lib/Dialog.svelte';
	import { makeConfetti } from '$lib/makeConfetti';
	import { board, categoryToColor, type Card, type Team } from '$lib/data';

	let teams: Team[] = [
		{ name: 'A', position: 0, color: '#4f70e4' },
		{ name: 'B', position: 0, color: '#ffae73' }
	];
	let currentTeam = 0;

	let cards: Card[];
	let decks: {
		'dev-front': Card[];
		'dev-back': Card[];
		'algo-paradigms': Card[];
		'dev-tools': Card[];
	} | null = null;

	let contributors: { login: string }[] = [];

	onMount(async () => {
		const res = await fetch(
			'https://raw.githubusercontent.com/jeremt/ttmc-for-dev/main/src/cards.json'
		);
		cards = (await res.json()).cards;
		const contributorsRes = await fetch(
			`https://api.github.com/repos/jeremt/ttmc-for-dev/contributors`
		);
		contributors = await contributorsRes.json();
	});

	let isCardOpen = false;
	let cardState: 'level' | 'question' | 'answer' | 'gameover' = 'level';
	let selectedCard: Card | undefined = undefined;
	let selectedQuestionIndex = 0;

	// Fisher-Yates powered by ChatGPT 😅
	function shuffleArray(array: Card[]) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}

	function pickCard() {
		if (decks === null) {
			return;
		}
		const theme = board[teams[currentTeam].position];
		selectedCard = decks[theme].splice(Math.floor(Math.random() * decks[theme].length), 1)[0];
		if (selectedCard === undefined) {
			decks[theme] = shuffleArray(cards.filter((card) => card.theme === theme));
		}
		cardState = 'level';
		isCardOpen = true;
	}

	function pickQuestion(index: number) {
		selectedQuestionIndex = index;
		cardState = 'question';
	}

	function showAnswer() {
		cardState = 'answer';
	}

	function handleFail() {
		currentTeam = (currentTeam + 1) % teams.length;
		isCardOpen = false;
		setTimeout(pickCard, 2000);
	}

	let canvas: HTMLCanvasElement | null = null;
	function handleSuccess() {
		const teamName = teams[currentTeam].name;
		const oldPawn = document.querySelector<HTMLDivElement>(`[data-team="${teamName}"]`)!;
		const { x: oldX, y: oldY } = oldPawn.getBoundingClientRect();
		teams[currentTeam].position += selectedQuestionIndex + 1;
		teams = teams; // re-render
		requestAnimationFrame(() => {
			const newPawn = document.querySelector<HTMLDivElement>(`[data-team="${teamName}"]`);
			if (newPawn) {
				const { x: newX, y: newY } = newPawn.getBoundingClientRect();
				newPawn.style.translate = `${oldX - newX}px ${oldY - newY}px`;
			}
		});
		if (teams[currentTeam].position >= board.length) {
			cardState = 'gameover';
			canvas && makeConfetti(canvas)();
		} else {
			handleFail();
		}
	}

	function handleRestart() {
		handleReset();
		pickCard();
	}

	function handleReset() {
		decks = shuffleArray(cards).reduce(
			(result, card) => ({ ...result, [card.category]: [...result[card.category], card] }),
			{
				'dev-front': [] as Card[],
				'dev-back': [] as Card[],
				'algo-paradigms': [] as Card[],
				'dev-tools': [] as Card[]
			}
		);
		selectedCard = undefined;
		teams = teams.map((team) => ({ ...team, position: 0 }));
		currentTeam = 0;
		isCardOpen = false;
	}
</script>

{#if cards === undefined}
	<div class="start">
		<h1>/* Loading cards... */</h1>
	</div>
{:else if selectedCard === undefined}
	<div class="start">
		<h1>/* TTMC for dev (WIP) */</h1>
		<button class="primary" on:click={handleRestart}>startGame();</button>
		<h2>/* Règles */</h2>
		<p>
			Les équipes jouent chacune leur tour. L'équipe choisi une difficulté en fonction du thème de
			la question. Si elle trouve la réponse, elle avance, sinon elle reste sur place 😬
		</p>
		<p>La première équipe à l'arrivée a gagné !</p>
		<h2>/* Contributeurs */</h2>
		<footer>
			{#each contributors as { login }}
				<a target="_blank" href="https://github.com/{login}">{login}</a>
			{/each}
		</footer>
	</div>
{:else}
	<Board {teams} />
{/if}

<Dialog bind:isOpen={isCardOpen}>
	<div
		class="card"
		style:background-color={cardState === 'gameover'
			? teams[currentTeam].color
			: categoryToColor[selectedCard?.category ?? 'dev-back']}
	>
		{#if cardState === 'level'}
			<header>
				<img
					width="64"
					height="64"
					src="/{selectedCard?.category ?? 'dev-back'}.png"
					alt={selectedCard?.category ?? 'dev-back'}
				/>
				<div class="ttmc">Tu te mets combien en...</div>
				<div class="theme">{selectedCard?.theme}</div>
			</header>
			<footer>
				<button on:click={() => pickQuestion(0)}>1</button>
				<button on:click={() => pickQuestion(1)}>2</button>
				<button on:click={() => pickQuestion(2)}>3</button>
				<button on:click={() => pickQuestion(3)}>4</button>
				<button on:click={() => pickQuestion(4)}>5</button>
			</footer>
		{:else if cardState === 'question'}
			<div class="question">
				{selectedQuestionIndex + 1}) {selectedCard?.questions[selectedQuestionIndex]}
			</div>
			<button on:click={showAnswer}>Voir la réponse</button>
		{:else if cardState === 'answer'}
			<div class="answer">
				{selectedQuestionIndex + 1}) {selectedCard?.answers[selectedQuestionIndex]}
			</div>
			<footer>
				<button class="success" on:click={handleSuccess}>response == true</button>
				<button class="fail" on:click={handleFail}>response == false</button>
			</footer>
		{:else}
			<div class="question">C'est fini, l'équipe {teams[currentTeam].name} gagne !</div>
			<footer>
				<button class="primary" on:click={handleRestart}>newGame();</button>
				<button on:click={handleReset}>return to_home;</button>
			</footer>
		{/if}
	</div>
	<canvas bind:this={canvas} />
</Dialog>

<style>
	.start {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100svh;
	}
	.start button {
		margin-bottom: 1rem;
	}
	.start footer {
		display: flex;
		gap: 1rem;
	}
	.start footer a {
		color: #ce9178;
	}
	h1,
	h2 {
		color: #74985d;
		text-align: center;
	}
	p {
		color: #cccccc;
		margin: 0;
		max-width: 25rem;
		padding: 0.5rem 1rem;
		line-height: 1.7;
		text-align: center;
	}
	.card {
		display: grid;
		gap: 1rem;
		padding: 2rem;
		border-radius: 1rem;
		text-align: center;
		max-width: 30rem;
		border: 2px solid black;
	}
	.card .ttmc {
		font-size: 1.2rem;
	}
	.card .theme {
		font-size: 2.5rem;
		font-weight: bold;
		margin-bottom: 0.5rem;
	}
	.card footer button {
		margin-top: 0.5rem;
	}
	.card .question,
	.card .answer {
		font-size: 1.4rem;
		margin-bottom: 1rem;
	}
	canvas {
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		position: fixed;
		pointer-events: none;
	}
</style>