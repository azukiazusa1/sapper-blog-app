import{w as s,e as m}from"./index-6e68bdcb.js";import{T as i}from"./Time-bd719f21.js";import"./index-3ea3853e.js";import"./index-d475d2ea.js";import"./_commonjsHelpers-87174ba5.js";import"./uniq-96991f69.js";import"./_getTag-4476a341.js";import"./index-356e4a49.js";import"./index-5a36c319.js";const f={title:"Time",component:i,tags:["autodocs"],argTypes:{date:{control:{type:"text"},describe:"日付"}}},t={args:{date:"2021-01-01T00:00:00.000Z"},play:({canvasElement:r})=>{const n=s(r).getByText("2021.01.01");m(n).toHaveAttribute("datetime","2021-01-01T00:00:00.000Z")}};var e,a,o;t.parameters={...t.parameters,docs:{...(e=t.parameters)==null?void 0:e.docs,source:{originalSource:`{
  args: {
    date: "2021-01-01T00:00:00.000Z"
  },
  play: ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const time = canvas.getByText("2021.01.01");
    expect(time).toHaveAttribute("datetime", "2021-01-01T00:00:00.000Z");
  }
}`,...(o=(a=t.parameters)==null?void 0:a.docs)==null?void 0:o.source}}};const Z=["Default"];export{t as Default,Z as __namedExportsOrder,f as default};
//# sourceMappingURL=Time.stories-19c6aaf9.js.map
