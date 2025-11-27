<div class="user-avatar" aria-label="You">
	<svg
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		class="w-6 h-6"
		stroke="currentColor"
		stroke-width="2"
	>
		<path
			d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<circle cx="12" cy="7" r="4" stroke-linecap="round" stroke-linejoin="round" />
	</svg>
</div>

<style>
	.user-avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: #e5e7eb;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		color: #6b7280;
	}

	@media (max-width: 640px) {
		.user-avatar {
			width: 32px;
			height: 32px;
		}

		.user-avatar svg {
			width: 1.25rem;
			height: 1.25rem;
		}
	}
</style>
