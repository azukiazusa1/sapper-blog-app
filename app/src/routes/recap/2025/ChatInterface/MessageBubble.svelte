<script lang="ts">
  import AIAvatar from "./AIAvatar.svelte";
  import UserAvatar from "./UserAvatar.svelte";
  import TypingIndicator from "./TypingIndicator.svelte";
  import TypeWriter from "../CodeEditor/TypeWriter.svelte";

  interface Props {
    type: "ai" | "user";
    sender: string;
    message: string;
    showTypingIndicator?: boolean;
    isTyping?: boolean;
    onTypingComplete?: () => void;
  }

  let {
    type,
    sender,
    message,
    showTypingIndicator = false,
    isTyping = false,
    onTypingComplete,
  }: Props = $props();
</script>

<div class="message-wrapper {type}">
  {#if type === "ai"}
    <AIAvatar />
  {:else}
    <UserAvatar />
  {/if}

  <div class="message-content">
    <div class="sender-label">{sender}</div>
    <div class="message-bubble {type}">
      {#if showTypingIndicator}
        <TypingIndicator />
      {:else if isTyping}
        <TypeWriter
          text={message}
          speed={50}
          onComplete={onTypingComplete}
          showCursor={false}
        />
      {:else}
        <p>{message}</p>
      {/if}
    </div>
  </div>
</div>

<style>
  .message-wrapper {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
    width: 100%;
  }

  .message-wrapper.ai {
    flex-direction: row;
  }

  .message-wrapper.user {
    flex-direction: row-reverse;
  }

  .message-content {
    flex: 1;
    max-width: 600px;
    display: flex;
    flex-direction: column;
  }

  .message-wrapper.user .message-content {
    align-items: flex-end;
  }

  .sender-label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #6b7280;
    margin-bottom: 0.5rem;
  }

  .message-bubble {
    padding: 1rem 1.25rem;
    border-radius: 1rem;
    line-height: 1.6;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .message-bubble p {
    margin: 0;
    white-space: pre-wrap;
  }

  .message-bubble.ai {
    background: white;
    border-top-left-radius: 0.25rem;
    color: #111827;
  }

  .message-bubble.user {
    background: #f3f4f6;
    border-top-right-radius: 0.25rem;
    color: #1f2937;
  }

  @media (max-width: 640px) {
    .message-wrapper {
      gap: 0.5rem;
    }

    .message-content {
      max-width: 100%;
    }

    .message-bubble {
      padding: 0.875rem 1rem;
      font-size: 0.9375rem;
    }

    .sender-label {
      font-size: 0.6875rem;
    }
  }
</style>
