<script>
  import Section from "../Section.svelte";
  import Tag from "../../../components/Tag/Tag.svelte";
  import Badge from "../../../components/Badge/Badge.svelte";
</script>

<Section>
  <div>
    <h2 class="mb-16 text-center text-2xl font-bold md:text-7xl">
      2023 年には以下のタグがよく使われました。
    </h2>
    <div class="fade-in-right container my-8 md:mx-auto md:px-12">
      <Tag name="React" slug="react"><Badge>13</Badge></Tag>
      <Tag name="アクセシビリティ" slug="accessibility"><Badge>10</Badge></Tag>
      <Tag name="HTML" slug="html"><Badge>10</Badge></Tag>
      <Tag name="Next.js" slug="nextjs"><Badge>8</Badge></Tag>
      <Tag name="テスト" slug="test"><Badge>6</Badge></Tag>
    </div>
  </div>
</Section>

<style>
  .fade-in-right {
    mix-blend-mode: plus-lighter;
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
