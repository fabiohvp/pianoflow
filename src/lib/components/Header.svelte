<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
</script>

<header
	class="z-10 flex w-full items-center border-b border-cyan-500/10 bg-[#080c14]/90 px-8 py-4 backdrop-blur-xl"
>
	<div class="flex items-center gap-3">
		<img src={favicon} alt="Groove Hero" class="h-10 w-10 drop-shadow-[0_0_15px_rgba(0,245,255,0.5)]" />
		<div>
			<h1
				class="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text font-['Orbitron'] text-xl font-black tracking-widest text-transparent"
			>
				GROOVE HERO
			</h1>
			<p class="-mt-1 text-[10px] tracking-[4px] text-slate-500 uppercase">Learn & Play</p>
		</div>
	</div>
</header>
