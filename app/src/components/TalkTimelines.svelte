<script lang="ts">
  import { m } from "$paraglide/messages";
  import Timeline from "./Timeline/Timeline.svelte";

  interface Props {
    limit?: number;
  }

  interface SlideBase {
    eventDate: string;
    presentationLink: string;
    eventTitle: string;
    presentationTitle: string;
    description: string;
  }

  let { limit }: Props = $props();

  const slides = $derived<SlideBase[]>([
    {
      eventDate: "2026-05-09",
      presentationLink:
        "https://speakerdeck.com/azukiazusa1/hurontoendonoxiang-shou-gabian-watuta-aigajia-watutawebnoxin-siiintahuesushe-ji",
      eventTitle: m.talkTimeline00EventTitle(),
      presentationTitle: m.talkTimeline00PresentationTitle(),
      description: m.talkTimeline00Description(),
    },
    {
      eventDate: "2026-02-28",
      presentationLink:
        "https://azukiazusa.dev/slides/react-tokyo-fes-2025.pdf",
      eventTitle: m.talkTimeline01EventTitle(),
      presentationTitle: m.talkTimeline01PresentationTitle(),
      description: m.talkTimeline01Description(),
    },
    {
      eventDate: "2026-02-26",
      presentationLink:
        "https://speakerdeck.com/azukiazusa1/xue-sheng-shi-dai-nire-zhong-sitakotoga-she-hui-ren-nojin-mosheng-kiteiruhua",
      eventTitle: m.talkTimeline02EventTitle(),
      presentationTitle: m.talkTimeline02PresentationTitle(),
      description: m.talkTimeline02Description(),
    },
    {
      eventDate: "2026-02-12",
      presentationLink: "https://speakerdeck.com/azukiazusa1/tan-qiu-noji-shu",
      eventTitle: m.talkTimeline03EventTitle(),
      presentationTitle: m.talkTimeline03PresentationTitle(),
      description: m.talkTimeline03Description(),
    },
    {
      eventDate: "2026-01-22",
      presentationLink:
        "https://speakerdeck.com/azukiazusa1/ai-niyoruinsidentochu-dong-diao-cha-nozi-dong-hua-woxing-u-ai-insidentokomandawozuo-tutahua",
      eventTitle: m.talkTimeline04EventTitle(),
      presentationTitle: m.talkTimeline04PresentationTitle(),
      description: m.talkTimeline04Description(),
    },
    {
      eventDate: "2026-01-18",
      presentationLink:
        "https://speakerdeck.com/azukiazusa1/xi-guan-toaitohuan-jing-ji-shu-tan-qiu-wosok-keru3tunojian",
      eventTitle: m.talkTimeline05EventTitle(),
      presentationTitle: m.talkTimeline05PresentationTitle(),
      description: m.talkTimeline05Description(),
    },
    {
      eventDate: "2025-11-19",
      presentationLink:
        "https://speakerdeck.com/azukiazusa1/chi-sok-ke-neng-naakusesibiriteikai-fa",
      eventTitle: m.talkTimeline06EventTitle(),
      presentationTitle: m.talkTimeline06PresentationTitle(),
      description: m.talkTimeline06Description(),
    },
    {
      eventDate: "2025-11-15",
      presentationLink: "https://speakerdeck.com/azukiazusa1/tan-qiu-noji-shu",
      eventTitle: m.talkTimeline07EventTitle(),
      presentationTitle: m.talkTimeline07PresentationTitle(),
      description: m.talkTimeline07Description(),
    },
    {
      eventDate: "2025-11-06",
      presentationLink:
        "https://speakerdeck.com/azukiazusa1/mcp-sabanoji-chu-karashi-jian-reberunozhi-shi-made",
      eventTitle: m.talkTimeline08EventTitle(),
      presentationTitle: m.talkTimeline08PresentationTitle(),
      description: m.talkTimeline08Description(),
    },
    {
      eventDate: "2025-09-11",
      presentationLink:
        "https://speakerdeck.com/azukiazusa1/aitosi-tatinoxue-xi-nobian-hua-wokao-eru-claude-codenoxue-xi-modowoli-ni",
      eventTitle: m.talkTimeline09EventTitle(),
      presentationTitle: m.talkTimeline09PresentationTitle(),
      description: m.talkTimeline09Description(),
    },
    {
      eventDate: "2025-09-06",
      presentationLink:
        "https://speakerdeck.com/azukiazusa1/2025-nian-nokodeinguezientonoxian-zai-di-toenzinianoshi-shi-nobian-hua-nituite",
      eventTitle: m.talkTimeline10EventTitle(),
      presentationTitle: m.talkTimeline10PresentationTitle(),
      description: m.talkTimeline10Description(),
    },
    {
      eventDate: "2025-08-19",
      presentationLink:
        "https://speakerdeck.com/hatena/internship-2025-ai-agent",
      eventTitle: m.talkTimeline11EventTitle(),
      presentationTitle: m.talkTimeline11PresentationTitle(),
      description: m.talkTimeline11Description(),
    },
    {
      eventDate: "2025-07-18",
      presentationLink:
        "https://speakerdeck.com/azukiazusa1/baibukodeinguchao-etebaibudepuroi-cloudflaremcpdeshi-xian-suru-wei-lai-noapurikesiyonderibari",
      eventTitle: m.talkTimeline12EventTitle(),
      presentationTitle: m.talkTimeline12PresentationTitle(),
      description: m.talkTimeline12Description(),
    },
    {
      eventDate: "2025-06-25",
      presentationLink:
        "https://speakerdeck.com/azukiazusa1/a2a-purotokoruwoshi-sitemiru",
      eventTitle: m.talkTimeline13EventTitle(),
      presentationTitle: m.talkTimeline13PresentationTitle(),
      description: m.talkTimeline13Description(),
    },
    {
      eventDate: "2025-02-07",
      presentationLink:
        "https://speakerdeck.com/azukiazusa1/yi-cun-guan-xi-gaarukonponentoha-barrel-huairudematomeyou",
      eventTitle: m.talkTimeline14EventTitle(),
      presentationTitle: m.talkTimeline14PresentationTitle(),
      description: m.talkTimeline14Description(),
    },
    {
      eventDate: "2024-11-23",
      presentationLink:
        "https://speakerdeck.com/azukiazusa1/ui-kai-fa-niokeru-hetudoresu-ui-raiburarinozhong-yao-xing-todezainsisutemuhenoqu-riru-refang",
      eventTitle: m.talkTimeline15EventTitle(),
      presentationTitle: m.talkTimeline15PresentationTitle(),
      description: m.talkTimeline15Description(),
    },
    {
      eventDate: "2024-08-23",
      presentationLink:
        "https://speakerdeck.com/azukiazusa1/timudekai-fa-suruji-niakusesibiriteiwobao-tushi-ce",
      eventTitle: m.talkTimeline16EventTitle(),
      presentationTitle: m.talkTimeline16PresentationTitle(),
      description: m.talkTimeline16Description(),
    },
    {
      eventDate: "2024-05-24",
      presentationLink:
        "https://speakerdeck.com/azukiazusa1/yorisinpuruninaru-svelte-noshi-jie",
      eventTitle: m.talkTimeline17EventTitle(),
      presentationTitle: m.talkTimeline17PresentationTitle(),
      description: m.talkTimeline17Description(),
    },
    {
      eventDate: "2024-04-01",
      presentationLink:
        "https://speakerdeck.com/azukiazusa1/react-huremuwakuno-dong-xiang-toxuan-ding-ji-zhun",
      eventTitle: m.talkTimeline18EventTitle(),
      presentationTitle: m.talkTimeline18PresentationTitle(),
      description: m.talkTimeline18Description(),
    },
    {
      eventDate: "2024-03-25",
      presentationLink:
        "https://speakerdeck.com/azukiazusa1/opentelemetry-nosabisutoiugai-nian-nituite",
      eventTitle: m.talkTimeline19EventTitle(),
      presentationTitle: m.talkTimeline19PresentationTitle(),
      description: m.talkTimeline19Description(),
    },
    {
      eventDate: "2023-11-18",
      presentationLink:
        "https://speakerdeck.com/azukiazusa1/javascript-nasitedong-zuo-surumotannakotonoshu-kifang",
      eventTitle: m.talkTimeline20EventTitle(),
      presentationTitle: m.talkTimeline20PresentationTitle(),
      description: m.talkTimeline20Description(),
    },
    {
      eventDate: "2023-06-06",
      presentationLink:
        "https://speakerdeck.com/azukiazusa1/mackerel-noakusesibiriteigai-shan-shi-li",
      eventTitle: m.talkTimeline21EventTitle(),
      presentationTitle: m.talkTimeline21PresentationTitle(),
      description: m.talkTimeline21Description(),
    },
  ]);

  const displaySlides = $derived(limit ? slides.slice(0, limit) : slides);

  // Pre-process slides to determine which ones should show year headers
  const slidesWithYearHeaders = $derived(
    displaySlides.map((slide, index) => {
      const year = new Date(slide.eventDate).getFullYear();
      const prevYear =
        index > 0
          ? new Date(displaySlides[index - 1].eventDate).getFullYear()
          : null;
      const showYearHeader = year !== prevYear;

      return {
        ...slide,
        year,
        showYearHeader,
      };
    }),
  );
</script>

<ol
  class="relative border-s border-stone-200 dark:border-stone-700 ml-6 md:ml-32"
>
  {#each slidesWithYearHeaders as slide}
    {#if slide.showYearHeader}
      <li class="mb-6 mt-10 -ml-6 md:-ml-32">
        <h2 class="text-3xl font-bold text-stone-800 dark:text-stone-200">
          {slide.year}
        </h2>
      </li>
    {/if}
    <Timeline
      eventTitle={slide.eventTitle}
      eventDate={slide.eventDate}
      presentationTitle={slide.presentationTitle}
      presentationLink={slide.presentationLink}
      description={slide.description}
    />
  {/each}
</ol>
