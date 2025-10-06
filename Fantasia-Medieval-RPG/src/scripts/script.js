const audio = document.getElementById("hover-sound");

		if (audio) {
			audio.volume = 0.45;
			let lastPlay = 0;
			const COOLDOWN_MS = 120;

			function playHoverSound() {
				const now = performance.now();
				if (now - lastPlay < COOLDOWN_MS) return;
				lastPlay = now;

				try {
					audio.pause();
					audio.currentTime = 0;
					audio.play().catch(() => {});
				} catch (e) {
					console.warn("No se pudo reproducir el sonido hover:", e);
				}
			}
		}