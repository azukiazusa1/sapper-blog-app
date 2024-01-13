import{w as s,e as m}from"./index-ZhVja-tM.js";import{T as i}from"./Time-L9ipg3tD.js";import"./_commonjsHelpers-4gQjN7DL.js";import"./uniq-SLQHnMKi.js";import"./_getTag-BP-6b2b5.js";import"./index-oRJpL3FP.js";import"./index-AKtXjuxE.js";import"./index-PPLHz8o0.js";import"./lifecycle-098PJsN4.js";import"./index-2YXsB2F8.js";const Z={title:"Time",component:i,tags:["autodocs"],argTypes:{date:{control:{type:"text"},describe:"日付"}}},t={args:{date:"2021-01-01T00:00:00.000Z"},play:({canvasElement:r})=>{const n=s(r).getByText("2021.01.01");m(n).toHaveAttribute("datetime","2021-01-01T00:00:00.000Z")}};var e,a,o;t.parameters={...t.parameters,docs:{...(e=t.parameters)==null?void 0:e.docs,source:{originalSource:`{
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
}`,...(o=(a=t.parameters)==null?void 0:a.docs)==null?void 0:o.source}}};const b=["Default"];export{t as Default,b as __namedExportsOrder,Z as default};
