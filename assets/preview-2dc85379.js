import{s as y}from"./index-d475d2ea.js";import{d as O}from"./index-356e4a49.js";var p="backgrounds",{document:s,window:M}=y,v=()=>M.matchMedia("(prefers-reduced-motion: reduce)").matches,k=(r,e=[],d)=>{if(r==="transparent")return"transparent";if(e.find(a=>a.value===r))return r;let t=e.find(a=>a.name===d);if(t)return t.value;if(d){let a=e.map(i=>i.name).join(", ");__STORYBOOK_MODULE_CLIENT_LOGGER__.logger.warn(O`
        Backgrounds Addon: could not find the default color "${d}".
        These are the available colors for your story based on your configuration:
        ${a}.
      `)}return"transparent"},E=r=>{(Array.isArray(r)?r:[r]).forEach(B)},B=r=>{let e=s.getElementById(r);e&&e.parentElement.removeChild(e)},S=(r,e)=>{let d=s.getElementById(r);if(d)d.innerHTML!==e&&(d.innerHTML=e);else{let t=s.createElement("style");t.setAttribute("id",r),t.innerHTML=e,s.head.appendChild(t)}},I=(r,e,d)=>{let t=s.getElementById(r);if(t)t.innerHTML!==e&&(t.innerHTML=e);else{let a=s.createElement("style");a.setAttribute("id",r),a.innerHTML=e;let i=`addon-backgrounds-grid${d?`-docs-${d}`:""}`,n=s.getElementById(i);n?n.parentElement.insertBefore(a,n):s.head.appendChild(a)}},h=(r,e)=>{var _;let{globals:d,parameters:t}=e,a=(_=d[p])==null?void 0:_.value,i=t[p],n=__STORYBOOK_MODULE_PREVIEW_API__.useMemo(()=>i.disable?"transparent":k(a,i.values,i.default),[i,a]),o=__STORYBOOK_MODULE_PREVIEW_API__.useMemo(()=>n&&n!=="transparent",[n]),g=e.viewMode==="docs"?`#anchor--${e.id} .docs-story`:".sb-show-main",u=__STORYBOOK_MODULE_PREVIEW_API__.useMemo(()=>{let l="transition: background-color 0.3s;";return`
      ${g} {
        background: ${n} !important;
        ${v()?"":l}
      }
    `},[n,g]);return __STORYBOOK_MODULE_PREVIEW_API__.useEffect(()=>{let l=e.viewMode==="docs"?`addon-backgrounds-docs-${e.id}`:"addon-backgrounds-color";if(!o){E(l);return}I(l,u,e.viewMode==="docs"?e.id:null)},[o,u,e]),r()},A=(r,e)=>{var b;let{globals:d,parameters:t}=e,a=t[p].grid,i=((b=d[p])==null?void 0:b.grid)===!0&&a.disable!==!0,{cellAmount:n,cellSize:o,opacity:g}=a,u=e.viewMode==="docs",_=t.layout===void 0||t.layout==="padded"?16:0,l=a.offsetX??(u?20:_),c=a.offsetY??(u?20:_),f=__STORYBOOK_MODULE_PREVIEW_API__.useMemo(()=>{let m=e.viewMode==="docs"?`#anchor--${e.id} .docs-story`:".sb-show-main",$=[`${o*n}px ${o*n}px`,`${o*n}px ${o*n}px`,`${o}px ${o}px`,`${o}px ${o}px`].join(", ");return`
      ${m} {
        background-size: ${$} !important;
        background-position: ${l}px ${c}px, ${l}px ${c}px, ${l}px ${c}px, ${l}px ${c}px !important;
        background-blend-mode: difference !important;
        background-image: linear-gradient(rgba(130, 130, 130, ${g}) 1px, transparent 1px),
         linear-gradient(90deg, rgba(130, 130, 130, ${g}) 1px, transparent 1px),
         linear-gradient(rgba(130, 130, 130, ${g/2}) 1px, transparent 1px),
         linear-gradient(90deg, rgba(130, 130, 130, ${g/2}) 1px, transparent 1px) !important;
      }
    `},[o]);return __STORYBOOK_MODULE_PREVIEW_API__.useEffect(()=>{let m=e.viewMode==="docs"?`addon-backgrounds-grid-docs-${e.id}`:"addon-backgrounds-grid";if(!i){E(m);return}S(m,f)},[i,f,e]),r()},L=[A,h],T={[p]:{grid:{cellSize:20,opacity:.5,cellAmount:5},values:[{name:"light",value:"#F8F8F8"},{name:"dark",value:"#333333"}]}},P={[p]:null};export{L as decorators,P as globals,T as parameters};
//# sourceMappingURL=preview-2dc85379.js.map
