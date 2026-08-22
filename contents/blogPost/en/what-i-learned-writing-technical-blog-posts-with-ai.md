---
id: 15kIN1m4q7zy8h7alQq91
title: "What I Learned From Having AI Write My Technical Blog Posts"
slug: "what-i-learned-writing-technical-blog-posts-with-ai"
about: "I thought AI-written articles were too generic and too wordy, so I only used AI to catch typos. Trying a workflow that hands drafting to AI, I found that reading the draft critically and adding my own experience preserves most of the learning."
createdAt: "2026-08-22T14:59+09:00"
updatedAt: "2026-08-22T14:59+09:00"
tags: ["AI"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/3yVLYkKtSAGZIXY3LSI1Fc/e70c1d96ea164142386837d9a7dee472/yuzu_illust_4489-768x730.png"
  title: "カットした柚子のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "According to the article, why did the author build code sample implementation and verification into the writing skill?"
      answers:
        - text: "So that the author does not stop at reading the generated article, but also runs the code and checks the results personally"
          correct: true
          explanation: "The article explains that after having the AI create and verify the samples, the author runs the same code and confirms the results as well."
        - text: "So that the article can be completed from the official documentation alone, without running any code"
          correct: false
          explanation: "The skill covers not only researching official documentation but also running code in a real environment to verify it."
        - text: "So that publishing can be fully automated and no human review is needed"
          correct: false
          explanation: "The article states that the generated first draft is not published as is, and that a human has to understand the content and edit it."
        - text: "So that the effort goes entirely into reproducing the style of past articles"
          correct: false
          explanation: "Style analysis is only one part. Researching primary sources, understanding design rationale, and verifying samples are also built into the skill."
    - question: "How does the article describe the shift in the center of the author's learning after having AI write the articles?"
      answers:
        - text: "From understanding the technology to publishing text as quickly as possible"
          correct: false
          explanation: "The article never says that fast publishing became the center of learning. Understanding and verification still take time."
        - text: "From thinking independently to agreeing with whatever the AI answers"
          correct: false
          explanation: "The article explains that simply agreeing with every AI answer is not learning, and that you have to think in your own words."
        - text: "From writing code to memorizing the style of past articles"
          correct: false
          explanation: "The emphasis is not on memorizing style, but on questioning the draft and checking the evidence behind it."
        - text: "From writing to asking, verifying, and editing"
          correct: true
          explanation: "The article says that learning did not disappear; its center moved from writing to asking, verifying, and editing."
published: true
---
Until recently, I did not have a good impression of letting AI write articles. AI-generated text leans too heavily on generalities and tends to be wordy. It looks polished, yet there is no particular reason to read that person's article over anyone else's. I had seen writing like that many times.

My main reason for writing a technical blog is to learn new technology myself. I also worried that letting AI write the articles would let me skip the process of researching, thinking, and putting things into words. So I kept writing articles by hand and limited AI to pointing out typos.

Recently, however, cases of AI-written articles drawing a big response have started to appear. In [one such case](https://x.com/maxmatsuuratwit/status/2090215320921460852) from Masato Matsuura, an AI automatically created a note account and posted an article that drew a large readership within a week. The AI was fed 60 years' worth of Matsuura's data, and reportedly [also drew on past blog posts, a ten-year column, and YouTube live streams](https://x.com/maxmatsuuratwit/status/2090425641342730302).

Seeing this made me think that what people criticize is not AI as a writing tool, but low-quality content that carries none of the writer's own experience or distinctive material. Looked at from the other side, it is a case showing that even with AI, having years of experience as raw material lets you produce writing that is not just generalities.

The other thing that stuck with me was the [feedback on term papers](https://x.com/D_N_1975/status/2089984243497877633) published by Daisuke Nakajima of Otaru University of Commerce. It described how they, as an instructor, faced students who had let AI write their reports, weaving in their own failures as a student and things that happened during lectures. At the end, it is revealed that the feedback itself was also written by AI — and while reading it normally, it had not crossed my mind for a second that AI had written it.

The aversion I had been holding toward letting AI write articles may simply have come from not knowing how to use AI. Feeling that it was not fair to hold that aversion without having actually tried anything, I spent the past few weeks experimenting with writing technical blog posts using AI.

In this article, I introduce the methods I tried for having AI write technical blog posts.

## Having AI write a technical blog post

To avoid the writing style that is characteristic of AI, I started by having the AI analyze the structure and style shared across my past articles. Fortunately, I manage my past articles on GitHub, so I was able to feed it five years' worth of blog posts, which made for good material. It extracted structural commonalities — starting the introduction from a concrete problem the reader has, explaining the necessary concepts before moving on to code, and closing with a summary and references — and analyzed the characteristics of my style as well.

https://github.com/azukiazusa1/sapper-blog-app/blob/main/contents/BLOG_WRITING_GUIDE.md

Based on the analysis, I created a [skill](https://github.com/azukiazusa1/skills/blob/a7f996f1cd700a4a56827f6cf2a130ff5a9ceedf/skills/writing/write-blog-article/SKILL.md) for writing technical blog posts. Rather than just imitating the style of past articles, it builds in the following steps that I normally go through when writing:

- Research primary sources such as official documentation, specifications, and the specification discussions found in issues and pull requests
- Check the design rationale behind the API's current shape and the alternatives that were considered
- Create runnable code samples and verify that they work in a real environment
- Review both the writing and the technical accuracy

This skill packs in the essence of how I write an article: researching primary sources, understanding the design rationale, and getting a sample running. Because it is instructed to create and verify code samples, I do not just read the generated article — I can run the same code myself and check the results.

With the skill, the first draft it produces looks, at a glance, not that different from my existing articles. Read it through, though, and there are still plenty of places that need polishing. Everything from here on is the work a human does to finish the article. Instead of publishing the AI-generated text as is, I go through it myself, organize the places that raised questions for me, and add the information that is missing.

For example, in "[Virtualizing and rendering large numbers of elements with TanStack Virtual](https://azukiazusa.dev/blog/virtualize-large-list-with-tanstack-virtual/)", the introduction was kept brief and the article jumped straight into how to use the library. What virtualization even is, under what conditions a large number of DOM nodes affects performance, and why virtualization is needed — all of that was underexplained.

So I had it add an explanation of virtualization itself, and do additional research on what conditions beyond raw DOM node count affect performance. Drawing on my own experience, I also added my personal decision criteria: consider paging first because it is simpler to implement, and choose virtualization when users need to browse continuously without being aware of page boundaries.

Elsewhere, when unexplained code suddenly appears, I split it into a separate section. In general, I organize the places that raised questions for me as a reader and reorder them so that they are easier to follow.

Where I feel I cannot explain something myself, I question the AI thoroughly. Why is this explanation necessary, what source backs it up, and how does it differ from the alternatives — I keep asking until I can explain it in my own words. That barrage of questions often surfaces parts the AI itself had produced without a solid basis. AI writing also tends to be wordy overall, so how much text you can cut matters just as much. As the saying goes, subtraction does more for a piece of writing than addition.

What actually happened when you ran the code, and where you got stuck, are things the AI cannot know from researching primary sources alone. Where the interaction or the visual result matters, you have to add what you saw yourself as text or images along the way. For "[The `<usermedia>` element for declaratively requesting camera and microphone permissions](https://azukiazusa.dev/blog/usermedia-html-element/)", I tried the feature in Chrome and, for clarity, added screenshots of the permission dialog shown to the user, the browser settings screen, and the element in a state where its styles violate the constraints.

## Having AI write did not cost me much of the learning

What I worried about most before letting AI write was losing the learning that is my main reason for blogging. After a few weeks of trying it, though, I feel that surprisingly little was lost on that front.

First, for a topic I know nothing about, I can get an overview in the article structure I am already used to reading. When something raises a question, I can ask again and again without worrying about taking up someone's time. It will also produce comparison code and small experiments on the spot, and I can ask for the source behind anything that makes me think "is that really true?" — so research and trial and error have both gotten more efficient.

On the other hand, simply agreeing with every AI answer is not learning. For the structure and explanations it generates, you have to work out what you do not understand, what order would make it easier to follow, and what to add from your own experience. In the end, unless you think it through in your own words first and then pass that on as a question or a revision instruction, the article does not get better.

Of course, not every form of learning stays the same. The time spent assembling text from nothing and typing code character by character went down. In its place, the time spent reading the draft critically, checking the evidence behind its claims, and thinking about the order of explanations went up. For me, it feels less like learning disappeared and more like the center of that learning moved from "writing" to "asking, verifying, and editing."

## Maybe what people dislike is not AI but low-quality articles

Looking at negative reactions to AI-written articles, I think what draws criticism is less the fact that AI was used and more articles that were published with barely any review of the output. Text that just restates generalities you have read somewhere at greater length, with no experience or judgment from the writer and no fact-checking, fits that description. Such articles are hard to find value in whether or not AI was involved.

Because AI makes it easy to mass-produce low-quality articles, we now run into them more often. Meanwhile, writing that was given enough material and edited by a writer who takes responsibility for the content may never be recognized as AI-generated in the first place. If you only count "articles you noticed were written by AI," it is easy to end up concluding that AI articles are all low quality.

Matsuura's 60 years of experience and Nakajima's lectures and memories of their student days are not things AI conjured out of nothing. The AI organizes the material it is handed and turns it into text, but what makes that text something other than generalities is the experience the writer has accumulated. Using AI does not make the writer's own experience unnecessary — if anything, how much experience and independent judgment you can hand over as material becomes the thing that matters.

I suspect I was able to hold a certain standard precisely because of the "form" I picked up over five years of writing technical blog posts.

## Writing time did not shrink as much as expected

Before I actually tried it, I thought letting AI write the articles might cut my writing time significantly. So far, though, the time I spend on an article is not much different from when I wrote everything by hand.

AI moves quickly through research, comparison code, and the first draft, but understanding what it produced and rereading the primary sources takes a fair amount of time. Running the code myself and adding my own experience are steps I cannot skip either. And because I can question anything I do not understand as thoroughly as I like, with a lower cost for running experiments, I sometimes dig too deep into a tangent that caught my interest and spend even more time than before.

## Summary

- I was resistant to writing articles with AI, but decided it was not fair to dismiss it without trying, so I experimented with a workflow that hands the drafting to AI
- Beyond the structure and style of past articles, I built research into primary sources, understanding design rationale, and running and verifying samples into the skill
- If you read the AI-generated draft as study material, ask about the parts you question, and edit in your own experience and judgment, the center of the learning shifts but I did not feel much of it was lost
- What draws criticism is not AI as a writing tool but low-quality articles that lack experience and verification — that is my conclusion
- AI speeds up research and drafting, but understanding, verifying, adding experience, and polishing all take time, so articles do not come together instantly
- This approach depends heavily on having five years of past articles to extract structure from, and the grounding to judge what a generated draft is missing

By the way — was this article written by a human? Or was it generated by AI?
