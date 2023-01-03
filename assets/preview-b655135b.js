import{s as _}from"./index-d475d2ea.js";var i="storybook/highlight",n="storybookHighlight",s=`${i}/add`,g=`${i}/reset`,{document:l}=_,m=(e="#FF4785",t="dashed")=>`
  outline: 2px ${t} ${e};
  outline-offset: 2px;
  box-shadow: 0 0 0 6px rgba(255,255,255,0.6);
`,O=e=>({outline:`2px dashed ${e}`,outlineOffset:2,boxShadow:"0 0 0 6px rgba(255,255,255,0.6)"});module&&module.hot&&module.hot.decline&&module.hot.decline();var h=__STORYBOOK_MODULE_PREVIEW_API__.addons.getChannel(),E=e=>{let t=n;d();let r=Array.from(new Set(e.elements)),o=l.createElement("style");o.setAttribute("id",t),o.innerHTML=r.map(a=>`${a}{
          ${m(e.color,e.style)}
         }`).join(" "),l.head.appendChild(o)},d=()=>{let e=n,t=l.getElementById(e);t&&t.parentNode.removeChild(t)};h.on(__STORYBOOK_MODULE_CORE_EVENTS__.STORY_CHANGED,d);h.on(g,d);h.on(s,E);export{O as highlightObject,m as highlightStyle};
//# sourceMappingURL=preview-b655135b.js.map
