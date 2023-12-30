<script lang="ts">
  import Card from "../Card.svelte";
  import Section from "../Section.svelte";

  export let isTestBuild: boolean;
</script>

<Section>
  <div>
    <h2 class="mb-16 text-center text-2xl font-bold md:text-7xl">
      2023 年によく読まれた記事は...
    </h2>

    <ol class="grid gap-4">
      <li class="fade-in-bottom">
        <Card
          title="最小限のコードで動く最も汚いコードから始める"
          slug="start-with-the-ugliest-code-that-works"
          views="18,357"
          {isTestBuild}
        />
      </li>
      <li class="fade-in-bottom">
        <Card
          title="Web フロントエンドの実装において本来の機能を損なってはいけない"
          slug="do-not-compromise-html-functionality-in-your-web-front-end-implementation"
          views="12,050"
          {isTestBuild}
        />
      </li>
      <li class="fade-in-bottom">
        <Card
          title="Next.js の Server Actions について"
          slug="nextjs-server-action"
          views="11,544"
          {isTestBuild}
        />
      </li>
    </ol>
  </div>
</Section>

<style>
  .fade-in-bottom {
    animation: fade-in linear both;
    animation-timeline: view();
    animation-range: cover 30% cover 50%;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  h2 {
    word-break: auto-phrase;
  }
</style>
