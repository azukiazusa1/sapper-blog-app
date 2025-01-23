<script lang="ts">
  import AllowDown from "../../../components/Icons/AllowDown.svelte";
  import PrevIcon from "../../../components/Icons/Prev.svelte";
  const handleClick = () => {
    document.getElementById("article-info").scrollIntoView({
      block: "center",
      behavior: "smooth",
    });
  };
</script>

<div class="relative flex h-screen items-center justify-center overflow-hidden">
  <div class="absolute left-0 top-0 z-10 p-4">
    <a href="/recap">
      <div class="sr-only">戻る</div>
      <PrevIcon className="h-6 w-6" />
    </a>
  </div>

  <div
    class="absolute inset-0 bg-linear-to-br from-purple-700 via-pink-500 to-orange-500 opacity-90"
  ></div>
  <div class="animate-rotate absolute inset-0">
    <div
      class="animate-blob fiter absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-violet-300 opacity-50 mix-blend-multiply blur-xl"
    ></div>
    <div
      class="animate-blob animation-delay-2000 absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-yellow-300 opacity-50 mix-blend-multiply blur-xl filter"
    ></div>
    <div
      class="animate-blob animation-delay-4000 absolute bottom-1/4 left-1/3 h-64 w-64 rounded-full bg-pink-300 opacity-50 mix-blend-multiply blur-xl filter"
    ></div>
  </div>

  <div class="relative z-10 px-4 text-center sm:px-6 lg:px-8">
    <h1
      class="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl"
    >
      azukiazusa.dev 2024 Recap
    </h1>
    <p
      class="mx-auto mb-8 mt-3 max-w-lg text-base text-white opacity-90 sm:text-lg md:text-xl"
    >
      2024年、<a class="underline" href="https://azukiazusa.dev"
        >azukiazusa.dev</a
      >は新たなステージへ。Web開発の最前線で、日々進化する技術と向き合い、挑戦し続けた1年。そんな成長の軌跡を振り返ります。
    </p>
    <button
      type="button"
      on:click={handleClick}
      class="focus:ring-purple-30 mr-3 inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-center text-base font-medium text-purple-700 transition-transform duration-200 hover:scale-110 hover:bg-purple-100 focus:scale-110 focus:ring-4"
    >
      Getting Started
      <AllowDown className="h-4 w-4" />
    </button>
  </div>
</div>

<style>
  /* 斜めに直線を描くアニメーション */
  @keyframes blob {
    0% {
      transform: translate(0px, 0px);
    }
    25% {
      transform: translate(180px, 180px);
    }
    50% {
      transform: translate(360px, 360px);
    }
    75% {
      transform: translate(180px, 180px);
    }
    100% {
      transform: translate(0px, 0px);
    }
  }

  .animate-blob {
    animation: blob 20s linear infinite;
  }

  @keyframes blob {
    0% {
      transform: translate(0px, 0px) scale(1);
    }
    33% {
      transform: translate(30px, -50px) scale(1.1);
    }
    66% {
      transform: translate(-20px, 20px) scale(0.9);
    }
    100% {
      transform: translate(0px, 0px) scale(1);
    }
  }

  .animate-blob {
    animation: blob 7s linear infinite;
  }

  .animation-delay-2000 {
    animation-delay: 2s;
  }

  .animation-delay-4000 {
    animation-delay: 4s;
  }
</style>
