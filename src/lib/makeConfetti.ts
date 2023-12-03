import confetti from 'canvas-confetti';
import { categoryToColor } from './data';

export function makeConfetti(canvas?: HTMLCanvasElement) {
	const count = 200;
	const defaults = {
		origin: { y: 0.45 },
		gravity: 0.7,
		zIndex: 20
	};
	const customConfetti = canvas ? confetti.create(canvas, { resize: true }) : null;
	const fire = (particleRatio: number, opts: confetti.Options) => {
		(customConfetti || confetti)({
			...defaults,
			...opts,
			particleCount: Math.floor(count * particleRatio),
			// all from greeninvoice's pie chart colors
			colors: Object.values(categoryToColor)
		});
	};

	return () => {
		fire(0.25, {
			spread: 26,
			startVelocity: 55
		});
		fire(0.2, {
			spread: 60
		});
		fire(0.35, {
			spread: 100,
			decay: 0.91,
			scalar: 0.8
		});
		fire(0.1, {
			spread: 120,
			startVelocity: 25,
			decay: 0.92,
			scalar: 1.2
		});
		fire(0.1, {
			spread: 120,
			startVelocity: 45
		});
	};
}
