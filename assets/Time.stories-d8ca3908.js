import{w as s,e as m}from"./index-2bc5fc26.js";import{T as c}from"./Time-29850d9a.js";import"./uniq-9b43ae33.js";import"./_getTag-7a3ef05e.js";import"./_commonjsHelpers-87174ba5.js";import"./index-f0ee331e.js";import"./index-356e4a49.js";import"./index-b203b68f.js";const y={title:"Time",component:c,tags:["autodocs"],argTypes:{date:{control:{type:"text"},describe:"日付"}}},t={args:{date:"2021-01-01T00:00:00.000Z"},play:({canvasElement:n})=>{const r=s(n).getByText("2021.01.01");m(r).toHaveAttribute("datetime","2021-01-01T00:00:00.000Z")}};var e,a,o;t.parameters={...t.parameters,docs:{...(e=t.parameters)==null?void 0:e.docs,source:{originalSource:`{
  args: {
    date: '2021-01-01T00:00:00.000Z'
  },
  play: ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const time = canvas.getByText('2021.01.01');
    expect(time).toHaveAttribute('datetime', '2021-01-01T00:00:00.000Z');
  }
}`,...(o=(a=t.parameters)==null?void 0:a.docs)==null?void 0:o.source}}};const f=["Default"];export{t as Default,f as __namedExportsOrder,y as default};
//# sourceMappingURL=Time.stories-d8ca3908.js.map
