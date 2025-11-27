<div class="typing-indicator" aria-live="polite" aria-label="AI is typing">
	<span class="dot"></span>
	<span class="dot"></span>
	<span class="dot"></span>
</div>

<style>
	.typing-indicator {
		display: flex;
		gap: 4px;
		align-items: center;
		padding: 0.5rem 0;
	}

	.dot {
		width: 8px;
		height: 8px;
		background: #9ca3af;
		border-radius: 50%;
		animation: bounce 1.4s infinite;
	}

	.dot:nth-child(2) {
		animation-delay: 0.15s;
	}

	.dot:nth-child(3) {
		animation-delay: 0.3s;
	}

	@keyframes bounce {
		0%,
		60%,
		100% {
			transform: translateY(0);
		}
		30% {
			transform: translateY(-8px);
		}
	}
</style>
