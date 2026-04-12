<script lang="ts">
	import { gameState, getGuitarPosition } from '$lib/games/guitar/game.svelte';
	import { themes } from '$lib/themes';
	import Guitar from './Guitar.svelte';

	let { lastTs, fallZoneHeight, fallZoneEl = $bindable(), onkeyPress } = $props();

	const BASE_SPEED = 0.22;
	let fretsCount = $derived(Number(gameState.fretsCount) || 24);

	let currentElapsed = $derived(
		gameState.startTime
			? (lastTs - gameState.startTime) * gameState.speed + gameState.elapsedBase
			: gameState.elapsedBase
	);

	const visibleStrums = $derived.by(() => {
		const strums = gameState.strums;
		if (!strums || strums.length === 0) return [];

		const pxPerMs = BASE_SPEED * gameState.speed;
		const fallTimeMs = fallZoneHeight / pxPerMs;

		let start = 0;
		let low = 0;
		let high = strums.length - 1;
		const lookbehindLimit = currentElapsed - 1000 / pxPerMs;

		while (low <= high) {
			let mid = Math.floor((low + high) / 2);
			if (strums[mid].t < lookbehindLimit) {
				low = mid + 1;
				start = mid;
			} else {
				high = mid - 1;
			}
		}

		const result = [];
		const lookaheadLimit = currentElapsed + fallTimeMs + 100;

		for (let i = start; i < strums.length; i++) {
			const strum = strums[i];
			if (strum.t > lookaheadLimit) break;

			const yBottom = fallZoneHeight - (strum.t - currentElapsed) * pxPerMs;
			if (yBottom > -50 && yBottom < fallZoneHeight + 50) {
				result.push(strum);
			}
		}
		return result;
	});

	const visibleNotes = $derived.by(() => {
		const notes = gameState.currentSong?.notes;
		if (!notes || notes.length === 0) return [];

		const pxPerMs = BASE_SPEED * gameState.speed;
		const fallTimeMs = fallZoneHeight / pxPerMs;

		let start = 0;
		let low = 0;
		let high = notes.length - 1;
		const lookbehindLimit = currentElapsed - 1000 / pxPerMs;

		while (low <= high) {
			let mid = Math.floor((low + high) / 2);
			if (notes[mid].t < lookbehindLimit) {
				low = mid + 1;
				start = mid;
			} else {
				high = mid - 1;
			}
		}

		const result = [];
		const lookaheadLimit = currentElapsed + fallTimeMs + 100;

		for (let i = start; i < notes.length; i++) {
			const note = notes[i];
			if (note.t > lookaheadLimit) break;

			const noteStartMs = note.t;
			const noteEndMs = note.t + note.d;
			const yTop = fallZoneHeight - (noteEndMs - currentElapsed) * pxPerMs;
			const yBottom = fallZoneHeight - (noteStartMs - currentElapsed) * pxPerMs;

			if (yBottom > 0 && yTop < fallZoneHeight) {
				result.push(note);
			}
		}
		return result;
	});

	function getFretLeftPercentage(fretIndex: number) {
		return (fretIndex / fretsCount) * 100;
	}
	let canvasEl = $state<HTMLCanvasElement>();

	const currentTheme = $derived(themes[gameState.noteColor] || themes.classic);

	function draw() {
		if (!canvasEl || !fallZoneEl) return;
		const ctx = canvasEl.getContext('2d');
		if (!ctx) return;

		const dpr = window.devicePixelRatio || 1;
		ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

		const containerWidth = fallZoneEl.clientWidth;
		const strumWidth = 64 * dpr;
		const totalContainerWidthDpr = containerWidth * dpr;

		// 1. Draw Strums on the left spacer area
		visibleStrums.forEach((strum) => {
			const yBottom = (fallZoneHeight - (strum.t - currentElapsed) * pxPerMs) * dpr;
			const isHit = strum.notes.some((n: any) => n.hit);
			const isPlaying = currentElapsed >= strum.t - 50 && currentElapsed <= strum.t + 100;

			const boxSize = 32 * dpr;
			let boxX = strumWidth / 2 - boxSize / 2;
			if (gameState.isLeftHanded) {
				boxX = totalContainerWidthDpr - strumWidth + strumWidth / 2 - boxSize / 2;
			}

			const boxY = yBottom - boxSize / 2;

			ctx.beginPath();
			ctx.roundRect(boxX, boxY, boxSize, boxSize, 6 * dpr);

			if (isHit || isPlaying) {
				const color = strum.dir === 'up' ? '#ec4899' : '#06b6d4';
				ctx.fillStyle = color + '66';
				ctx.strokeStyle = color + '80';
				ctx.shadowColor = color;
				ctx.shadowBlur = 10 * dpr;
			} else {
				ctx.fillStyle = '#0d1520cc';
				ctx.strokeStyle = 'rgba(255,255,255,0.1)';
				ctx.shadowBlur = 0;
			}
			ctx.fill();
			ctx.stroke();

			ctx.font = `bold ${18 * dpr}px sans-serif`;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillStyle = isHit || isPlaying ? (strum.dir === 'up' ? '#f472b6' : '#22d3ee') : '#64748b';
			ctx.fillText(strum.dir === 'up' ? '↑' : '↓', boxX + boxSize / 2, boxY + boxSize / 2);
			ctx.shadowBlur = 0;
		});

		// 2. Draw Notes
		const notesAreaX = gameState.isLeftHanded ? 0 : strumWidth;
		const notesAreaWidth = (containerWidth - 64) * dpr;

		visibleNotes.forEach((note) => {
			const pos = note.guitarPos || getGuitarPosition(note.midi, fretsCount);
			const blockH = Math.max(12, note.d * pxPerMs);
			const yBottom = (fallZoneHeight - (note.t - currentElapsed) * pxPerMs) * dpr;
			const yTop = yBottom - blockH * dpr;
			const height = yBottom - yTop;

			const fretWidthPct = 100 / fretsCount;
			const fretWidthPx = (notesAreaWidth * fretWidthPct) / 100;

			let xPct = getFretLeftPercentage(pos.fretIndex);
			if (gameState.isLeftHanded) {
				xPct = 100 - xPct - fretWidthPct;
			}
			const x = notesAreaX + (notesAreaWidth * xPct) / 100;
			const y = yTop;
			const w = fretWidthPx;
			const h = height;

			ctx.beginPath();
			ctx.roundRect(x, y, w, h, 2 * dpr);

			if (note.hit) {
				const gradient = ctx.createLinearGradient(x, y, x, y + h);
				gradient.addColorStop(0, '#fde047');
				gradient.addColorStop(1, '#facc15');
				ctx.fillStyle = gradient;
				ctx.shadowColor = '#facc15cc';
				ctx.shadowBlur = 8 * dpr;
				ctx.strokeStyle = '#eab308';
				ctx.globalAlpha = 0.5;
			} else {
				const g = ctx.createLinearGradient(x, y, x, y + h);
				g.addColorStop(0, currentTheme.white.start);
				g.addColorStop(1, currentTheme.white.end);
				ctx.fillStyle = g;
				ctx.shadowColor = currentTheme.white.shadow;
				ctx.shadowBlur = 5 * dpr;
				ctx.strokeStyle = 'rgba(255,255,255,0.4)';
				ctx.globalAlpha = 0.95;
			}

			ctx.fill();
			ctx.stroke();
			ctx.globalAlpha = 1.0;
			ctx.shadowBlur = 0;
		});
	}

	$effect(() => {
		if (canvasEl && fallZoneEl) {
			const dpr = window.devicePixelRatio || 1;
			canvasEl.width = fallZoneEl.clientWidth * dpr;
			canvasEl.height = fallZoneHeight * dpr;
			canvasEl.style.width = `${fallZoneEl.clientWidth}px`;
			canvasEl.style.height = `${fallZoneHeight}px`;
		}
	});

	$effect(() => {
		if (lastTs || visibleNotes || visibleStrums) {
			draw();
		}
	});

	const pxPerMs = $derived(BASE_SPEED * gameState.speed);
</script>

<main class="z-5 flex flex-1 flex-col self-stretch overflow-hidden">
	<div
		bind:this={fallZoneEl}
		class="relative flex flex-1 {gameState.isLeftHanded ? 'flex-row-reverse' : 'flex-row'} mb-48"
	>
		<!-- Left Spacer (Grid-only) -->
		<div
			class="relative z-20 w-16 flex-shrink-0 {gameState.isLeftHanded
				? 'border-l-2'
				: 'border-r-2'} flex-[0_0_64px] overflow-hidden bg-transparent"
			style="border-color: {currentTheme.accent}88;"
		></div>

		<!-- Falling zone -->
		<div
			class="relative flex-1 {gameState.backgroundMode === 'light'
				? 'bg-slate-100'
				: 'bg-transparent'} transition-colors duration-500"
			style="background-image: linear-gradient(to bottom, transparent, {currentTheme.accent}11)"
		>
			{#each Array.from({ length: fretsCount + 1 }) as _, i}
				<div
					class="absolute top-0 bottom-0 w-px"
					style="{gameState.isLeftHanded ? 'right' : 'left'}: {getFretLeftPercentage(
						i
					)}%; background-color: {currentTheme.accent}55;"
				></div>
			{/each}
			<div
				class="absolute bottom-0 h-[3px] w-full"
				style="background-image: linear-gradient(to right, transparent, {currentTheme.accent}, transparent); box-shadow: 0 0 15px {currentTheme.accent};"
			></div>
		</div>

		<canvas bind:this={canvasEl} class="pointer-events-none absolute inset-0 z-30"></canvas>
	</div>

	<Guitar {onkeyPress} {fretsCount} />
</main>
