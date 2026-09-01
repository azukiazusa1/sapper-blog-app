---
id: VHxs77ey1xzu_mPjsLfLy
title: "Styling video Elements by State with `:playing` and `:muted`"
slug: "style-video-with-media-state-pseudo-classes"
about: "Changing how a video looks by playback or mute state has meant syncing CSS classes from JavaScript events. Media state pseudo-classes let CSS select browser-managed states directly. This article covers all seven, plus :has()."
createdAt: "2026-09-01T20:00+09:00"
updatedAt: "2026-09-01T20:00+09:00"
tags: ["CSS", "HTML"]
thumbnail:
  title: "リュウグウノツカイのイラスト"
  url: "https://images.ctfassets.net/in6v9lxmm5c8/5wVZWwTOMdxu4k3IASoptL/62956f32b247f1b009c8c3b68232b3e4/ryugunotsukai_17496-768x542.png"
audio: null
selfAssessment:
  quizzes:
    - question: "When a video is buffering because it has run out of data, which combination of pseudo-classes matches, according to the article?"
      answers:
        - text: "Only `:buffering` matches; `:playing` does not"
          correct: false
          explanation: "Even while buffering, playback resumes automatically once the cause is resolved, so `:playing` matches as well."
        - text: "Both `:playing` and `:buffering` match"
          correct: true
          explanation: "The article explains that `:buffering` and `:stalled` match at the same time as `:playing`."
        - text: "Both `:paused` and `:buffering` match"
          correct: false
          explanation: "Buffering is not an explicit pause. Because there is still an intent to keep playing, `:playing` matches."
        - text: "Both `:seeking` and `:stalled` always match"
          correct: false
          explanation: "Seeking and stalled loading are separate conditions. Neither necessarily matches while the video is buffering."
    - question: "Which description of the `:muted` pseudo-class matches the article?"
      answers:
        - text: "Setting `video.volume = 0` is enough to make it match"
          correct: false
          explanation: "Setting `volume` to 0 does not change the muted state of a media element."
        - text: "It only matches while the video is paused"
          correct: false
          explanation: "`:paused` is what represents a paused video. `:muted` represents a state where audio is forcibly silenced."
        - text: "It matches when the video is silenced by the `muted` attribute or `video.muted = true`"
          correct: true
          explanation: "The article explains that `:muted` matches according to the muted state defined in the HTML Standard."
        - text: "It only matches in environments where the page cannot change the volume"
          correct: false
          explanation: "`:volume-locked` is what represents a state where the page cannot change the volume."

published: true
---

b> media-pseudos

Sometimes you want the appearance of a video player to change with the playback state of its `<video>` element. YouTube, for example, swaps the play button depending on whether the video is playing, and changes the audio icon when it is muted. The traditional approach has been to listen for events such as `play`, `pause`, and `volumechange`, and use JavaScript to toggle the classes that CSS refers to.

```js
const video = document.querySelector("video");

video.addEventListener("play", () => {
  video.classList.add("is-playing");
  video.classList.remove("is-paused");
});

video.addEventListener("pause", () => {
  video.classList.add("is-paused");
  video.classList.remove("is-playing");
});

video.addEventListener("volumechange", () => {
  video.classList.toggle("is-muted", video.muted);
});
```

This certainly works, but you have to keep the state in sync yourself, and the code grows complicated. Handling states like buffering and seeking means managing even more events and classes.

The [media state pseudo-classes](https://drafts.csswg.org/selectors/#resource-pseudos) defined in CSS Selectors Level 4 give CSS direct access to the states the browser already manages.

```css
video:playing {
  outline-color: green;
}

video:paused {
  outline-color: gray;
}

video:muted {
  opacity: 0.8;
}
```

This article goes through the conditions behind all seven media state pseudo-classes, then shows how to combine them with `:has()` to swap what a video player displays.

## What are media state pseudo-classes?

Media state pseudo-classes match a playable element based on its current state. In HTML, that mainly means `<video>` and `<audio>`.

The specification groups the seven pseudo-classes into three categories: playback state, loading state, and audio state.

| Category       | Pseudo-class     | State it matches                                                                                      |
| -------------- | ---------------- | ----------------------------------------------------------------------------------------------------- |
| Playback state | `:playing`       | There is an intent to play, and playback resumes automatically once whatever paused it is resolved     |
| Playback state | `:paused`        | Anything that is not `:playing`: an explicit pause, before the first play, after playback has ended    |
| Playback state | `:seeking`       | The playback position is being changed. Independent of `:playing` / `:paused`                          |
| Loading state  | `:buffering`     | Matches `:playing`, but there is not enough data to continue and the element is waiting for more       |
| Loading state  | `:stalled`       | Matches `:buffering`, and no data has been received for a certain amount of time                       |
| Audio state    | `:muted`         | Audio is forcibly silenced                                                                              |
| Audio state    | `:volume-locked` | The browser or the user prevents the page from changing the volume                                     |

These pseudo-classes were added so that the appearance of custom media controls could follow the element's state without any scripting. The [original proposal](https://github.com/w3c/csswg-drafts/issues/3821) at the CSSWG raised the problem that custom controls for muting, stalled loading, and seeking required browser sniffing and scripting logic.

`:volume-locked` came from a different motivation. In some environments, changing `HTMLMediaElement.volume` has no effect on the volume the user actually hears. Knowing about that state lets you improve the UI, for instance by hiding a volume control that would do nothing.

## `:playing` and the loading states match at the same time

The seven pseudo-classes are not an enum of mutually exclusive states. The relationship between `:playing`, `:buffering`, and `:stalled` deserves particular attention.

[Selectors Level 4](https://drafts.csswg.org/selectors/#video-state) defines `:playing` as matching even when the picture has temporarily stopped due to buffering or stalled loading, as long as playback resumes automatically once the cause is resolved. That means the following combinations match simultaneously.

```css
/* Matches during normal playback */
video:playing {
  outline-color: green;
}

/* While buffering, both :playing and :buffering match */
video:buffering {
  outline-color: orange;
}

/* While loading is stalled, :playing, :buffering, and :stalled all match.
   :stalled is a subset of :buffering, so it must come after :buffering */
video:stalled {
  outline-color: red;
}
```

It helps to think of `:playing` and `:paused` as expressing whether the user or the page intends playback to continue, rather than whether the picture is actually moving on screen. The [HTML Standard](https://html.spec.whatwg.org/multipage/semantics-other.html#pseudo-classes) puts it concretely: `:playing` matches when `HTMLMediaElement.paused` is `false`, and `:paused` matches when it is `true`.

The difference between `:buffering` and `:stalled` is how data retrieval is going. They form a nested relationship: `:stalled` ⊆ `:buffering` ⊆ `:playing`. `video:buffering` matches when there is not enough data to keep playing and the element is waiting to fetch more. `:stalled` matches when the element matches `:buffering` and has not received any data for a certain amount of time.

:::warning
`:buffering` and `:stalled` are narrower conditions within the states that match `:playing`. Their CSS specificity is identical, so writing `:stalled` first means its styles get overwritten by `:buffering`. Put the narrower condition last.
:::

:::note
The `:stalled` pseudo-class and the `stalled` event have different conditions. The pseudo-class exists to describe a player UI that lacks the data it needs to play and whose loading has also stalled. The `stalled` event, on the other hand, fires whenever data reception from the network stalls, regardless of playback state. This distinction was spelled out in the specification in response to [WHATWG Issue #12145](https://github.com/whatwg/html/issues/12145).
:::

## The difference between `:muted` and `:volume-locked`

`:muted` is not a pseudo-class for "`volume` is `0`". Following the [definition of muted in the HTML Standard](https://html.spec.whatwg.org/multipage/media.html#muted), it matches when a media element is forcibly silenced, such as when the `muted` attribute or `HTMLMediaElement.muted` is set.

```html
<video src="movie.mp4" muted></video>
```

```js
video.muted = true;
```

Both of these match `video:muted`. Simply turning the playback volume all the way down, as below, does not put the element in the muted state, so `:muted` does not match.

```js
video.volume = 0;
```

`:volume-locked` is not about whether the volume is zero either, but about whether the playback volume the page sets has any effect. In the HTML Standard, the value of `volume locked` is implementation-defined. It matches in environments where the user or the OS overrides the volume, so changing `video.volume` from the page has no effect on the actual volume.

Safari on iPhone is a concrete example. Apple's "[Safari HTML5 Audio and Video Guide](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/Device-SpecificConsiderations/Device-SpecificConsiderations.html#//apple_ref/doc/uid/TP40009523-CH5-SW10)" explains that volume on iOS is controlled by the user's physical input and cannot be set from JavaScript. The current WebKit implementation likewise [enables `volume locked` on media elements by default on small-screen iOS devices](https://github.com/WebKit/WebKit/blob/00f03c1f906ff25f9536f528e81477c861c0325c/Source/WebCore/html/HTMLMediaElement.cpp#L503-L510). Because the check goes through `currentUserInterfaceIdiomIsSmallScreen()`, iPad is excluded. In other words, a volume slider on an iPhone page cannot adjust the device's output volume no matter what value it holds.

With this pseudo-class you can hide a volume control that would do nothing on an iPhone and tell the user to use the device's volume buttons instead. Note that which environments enable `volume locked` is left to the browser implementation, so developers cannot set this state arbitrarily from JavaScript.

## Styling a `video` element by its state

Let's start by styling the `<video>` element that the pseudo-classes match directly. The CSS below changes the border color for paused, playing, and waiting-for-data.

```css
video {
  outline: 4px solid transparent;
  outline-offset: 4px;
}

video:paused {
  outline-color: gray;
}

video:playing {
  outline-color: green;
}

video:seeking {
  outline-color: blue;
}

video:buffering {
  outline-color: orange;
}

video:stalled {
  outline-color: red;
}
```

Media state pseudo-classes match the `<video>` element itself. In practice, though, what you usually want to change is not the look of the video but the play button and audio controls around it. Since a play button cannot be a child of `<video>`, changing the surrounding elements calls for [`:has()`](https://drafts.csswg.org/selectors/#relational).

The HTML below wraps the video, a set of state labels, and two control buttons in `.player`. The `<video>` carries `controls` so that the browser's own seek bar is available to demonstrate the seeking state.

```html
<div class="player">
  <video src="movie.mp4" preload="auto" controls></video>

  <div class="states">
    <span class="when-paused">Paused</span>
    <span class="when-playing">Playing</span>
    <span class="when-seeking">Seeking</span>
    <span class="when-muted">Muted</span>
  </div>

  <button id="play-toggle" type="button">
    <span class="when-paused">Play</span>
    <span class="when-playing">Pause</span>
  </button>

  <button id="mute-toggle" type="button">
    <span class="when-audible">Mute</span>
    <span class="when-muted">Unmute</span>
  </button>
</div>
```

All of these elements start out hidden, and only the ones matching the current state are shown.

```css
/* Hide every element tied to a state to begin with */
.when-paused,
.when-playing,
.when-seeking,
.when-audible,
.when-muted {
  display: none;
}

/* Among the descendants of .player, show only the ones whose state currently matches */
.player:has(video:paused) .when-paused,
.player:has(video:playing) .when-playing,
.player:has(video:seeking) .when-seeking,
.player:has(video:not(:muted)) .when-audible,
.player:has(video:muted) .when-muted {
  display: inline;
}
```

Trying it out confirms that the display really does switch along with the state of the video.

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/2SA0VyW54IqAwoCaNljqUd/1747a342f698a20bb0395109860d5270/42851bde-fa40-4cf7-ac41-983998b8038d.mov" controls></video>

## Summary

- Media state pseudo-classes let CSS select the state of `<video>` and `<audio>` directly
- Seven of them are defined: `:playing`, `:paused`, `:seeking`, `:buffering`, `:stalled`, `:muted`, and `:volume-locked`
- They form the nested relationship `:stalled` ⊆ `:buffering` ⊆ `:playing`, so the seven states are not mutually exclusive
- `:seeking` sits on a separate axis from playback state and matches alongside either `:playing` or `:paused`
- `:muted` matches a forcibly silenced state, which is different from simply setting `volume = 0`
- `:volume-locked` matches when volume adjustment from the page does not work, Safari on iPhone being the concrete example
- Combining them with `:has()` lets you change the state labels and control buttons around a video based on its state

## References

- [Selectors Level 4 - Resource State Pseudo-classes](https://drafts.csswg.org/selectors/#resource-pseudos)
- [HTML Standard - Pseudo-classes](https://html.spec.whatwg.org/multipage/semantics-other.html#pseudo-classes)
- [HTML Standard - Media elements](https://html.spec.whatwg.org/multipage/media.html)
- [CSSWG Issue #3821: additional resource state pseudo-classes for media elements](https://github.com/w3c/csswg-drafts/issues/3821)
- [CSSWG Issue #3933: effective media volume is mutable pseudo-class for media elements](https://github.com/w3c/csswg-drafts/issues/3933)
- [Safari HTML5 Audio and Video Guide - Volume Control in JavaScript](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/Device-SpecificConsiderations/Device-SpecificConsiderations.html#//apple_ref/doc/uid/TP40009523-CH5-SW10)
- [WebKit - HTMLMediaElement.cpp `defaultVolumeLocked()`](https://github.com/WebKit/WebKit/blob/00f03c1f906ff25f9536f528e81477c861c0325c/Source/WebCore/html/HTMLMediaElement.cpp#L503-L510)
- [Chrome 152 Beta](https://developer.chrome.com/blog/chrome-152-beta)
