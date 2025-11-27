<script lang="ts">
	import { fade, fly, scale } from 'svelte/transition';
	import MessageBubble from './ChatInterface/MessageBubble.svelte';

	interface Props {
		onSubmit: () => void;
	}

	let { onSubmit }: Props = $props();

	// Message constants
	const AI_GREETING_MESSAGE = `こんにちは！2025年の振り返りを作成しますか？

AI エージェントがリアルタイムでコードを書きながら、あなたの一年をまとめます。`;

	const IMPLEMENTATION_PLAN_MESSAGE = `かしこまりました！以下の手順で実装を進めます：

1. まず、Data2025.ts でデータ定義を作成します
2. 次に、BlogStats.svelte で統計情報を表示します
3. その後、PopularTags.svelte でタグクラウドを作成します
4. 最後に、PopularPosts.svelte で人気記事をランキング表示します

それでは、コードを書き始めます...`;

	const USER_INPUT_TEXT = 'azukiazusa.dev の 2025 年の振り返りを教えて';

	// State management
	let showAIGreeting = $state(false);
	let showGreetingTyping = $state(false);
	let showGreetingText = $state(false);
	let showInputForm = $state(false);
	let formSubmitted = $state(false);
	let showUserMessage = $state(false);
	let showAIPlan = $state(false);
	let showPlanTyping = $state(false);
	let showPlanText = $state(false);

	// Initial animation timeline (on mount)
	$effect(() => {
		const timers: ReturnType<typeof setTimeout>[] = [];

		// Show AI greeting message bubble with typing indicator immediately
		timers.push(setTimeout(() => {
			showAIGreeting = true;
			showGreetingTyping = true;
		}, 0));

		// Hide typing indicator and start greeting text typing after 1500ms
		timers.push(
			setTimeout(() => {
				showGreetingTyping = false;
				showGreetingText = true;
			}, 1500)
		);

		return () => timers.forEach(clearTimeout);
	});

	// Handle greeting typing complete
	const handleGreetingTypingComplete = () => {
		setTimeout(() => {
			showInputForm = true;
		}, 500);
	};

	// Scroll to bottom utility
	const scrollToBottom = () => {
		const messagesArea = document.querySelector('.messages-area');
		if (messagesArea) {
			messagesArea.scrollTo({
				top: messagesArea.scrollHeight,
				behavior: 'smooth'
			});
		}
	};

	// Handle form submission
	const handleFormSubmit = (e: Event) => {
		e.preventDefault();
		formSubmitted = true;

		// Animation sequence after form submission
		setTimeout(() => {
			showUserMessage = true;
			setTimeout(scrollToBottom, 100);
		}, 300);

		setTimeout(() => {
			showAIPlan = true;
			showPlanTyping = true;
			setTimeout(scrollToBottom, 100);
		}, 800);

		setTimeout(() => {
			showPlanTyping = false;
			showPlanText = true;
		}, 2300);
	};

	// Handle plan typing complete
	const handlePlanTypingComplete = () => {
		setTimeout(() => {
			onSubmit(); // コードエディタへ遷移
		}, 1000);
	};
</script>

<div
	id="chat-interface"
	class="relative flex min-h-screen bg-linear-to-b from-purple-900 to-indigo-900"
>
	<!-- メッセージエリア（上部、スクロール可能） -->
	<div class="messages-area">
		<div class="messages-container" role="log">
			<!-- AI挨拶メッセージ -->
			{#if showAIGreeting}
				<div in:fly={{ y: 50, duration: 500 }}>
					<MessageBubble
						type="ai"
						sender="AI Agent"
						message={AI_GREETING_MESSAGE}
						showTypingIndicator={showGreetingTyping}
						isTyping={showGreetingText}
						onTypingComplete={handleGreetingTypingComplete}
					/>
				</div>
			{/if}

			<!-- ユーザーメッセージ -->
			{#if showUserMessage}
				<div in:fly={{ y: 50, duration: 500 }}>
					<MessageBubble type="user" sender="You" message={USER_INPUT_TEXT} />
				</div>
			{/if}

			<!-- AI実装プランメッセージ -->
			{#if showAIPlan}
				<div in:fly={{ y: 50, duration: 500 }}>
					<MessageBubble
						type="ai"
						sender="AI Agent"
						message={IMPLEMENTATION_PLAN_MESSAGE}
						showTypingIndicator={showPlanTyping}
						isTyping={showPlanText}
						onTypingComplete={handlePlanTypingComplete}
					/>
				</div>
			{/if}
		</div>
	</div>

	<!-- 入力フォームエリア（下部固定） -->
	{#if showInputForm && !formSubmitted}
		<div class="input-form-container" in:fly={{ y: 100, duration: 500 }} out:fade={{ duration: 300 }}>
			<form onsubmit={handleFormSubmit}>
				<input
					type="text"
					value={USER_INPUT_TEXT}
					readonly
					aria-label="メッセージ入力"
					class="input-field"
				/>
				<button type="submit" aria-label="メッセージを送信" class="submit-button">
					送信 →
				</button>
			</form>
		</div>
	{/if}
</div>

<style>
	.messages-area {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-height: calc(100vh - 120px);
		width: 100%;
		padding: 2rem;
		padding-bottom: 140px;
		overflow-y: auto;
	}

	.messages-container {
		width: 100%;
		max-width: 42rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.input-form-container {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: linear-gradient(
			to top,
			rgba(88, 28, 135, 1) 0%,
			rgba(88, 28, 135, 0.95) 50%,
			transparent 100%
		);
		backdrop-filter: blur(8px);
		padding: 1.5rem 2rem 2rem;
		z-index: 10;
	}

	.input-form-container form {
		max-width: 42rem;
		margin: 0 auto;
		display: flex;
		gap: 0.75rem;
		align-items: center;
	}

	.input-field {
		flex: 1;
		padding: 0.875rem 1.25rem;
		border-radius: 0.75rem;
		background: white;
		border: 2px solid transparent;
		font-size: 0.9375rem;
		color: #1f2937;
		transition: all 0.2s;
	}

	.input-field:focus {
		outline: none;
		border-color: #7c3aed;
		box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
	}

	.submit-button {
		padding: 0.875rem 2rem;
		border-radius: 0.75rem;
		background: linear-gradient(to right, #7c3aed, #ec4899);
		color: white;
		font-weight: 600;
		white-space: nowrap;
		transition: all 0.2s;
		border: none;
		cursor: pointer;
	}

	.submit-button:hover {
		transform: scale(1.05);
		box-shadow: 0 10px 25px rgba(124, 58, 237, 0.3);
	}

	.submit-button:focus {
		outline: none;
		box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.3);
	}

	@media (max-width: 640px) {
		.messages-area {
			padding: 1rem;
			padding-bottom: 160px;
		}

		.input-form-container {
			padding: 1rem;
		}

		.input-form-container form {
			flex-direction: column;
			gap: 0.5rem;
		}

		.input-field,
		.submit-button {
			width: 100%;
		}
	}
</style>
