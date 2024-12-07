<script lang="ts">
  const scrollToThankYou = () => {
    const thankYou = document.getElementById("thank-you");
    thankYou?.scrollIntoView({ behavior: "smooth" });
  };
</script>

<div>
  最後に感謝のメッセージを送ります。

  <button
    class="mt-4 rounded-md bg-blue-500 p-2 text-white"
    on:click={() => scrollToThankYou()}
  >
    ありがとう！
  </button>
</div>
