import{w as r,e as n}from"./index-8dfd2a0d.js";import{T as s}from"./Time-fcc3e4ac.js";import"./uniq-71bf65be.js";import"./_getTag-bd9e0d27.js";import"./_commonjsHelpers-48992372.js";import"./index-3c5bded6.js";import"./window-975e1a61.js";import"./index-356e4a49.js";import"./index-7100be2d.js";const x={title:"Time",component:s,tags:["autodocs"],argTypes:{date:{control:{type:"text"},describe:"日付"}}},t={args:{date:"2021-01-01T00:00:00.000Z"},play:({canvasElement:a})=>{const o=r(a).getByText("2021.01.01");n(o).toHaveAttribute("datetime","2021-01-01T00:00:00.000Z")}};var e;t.parameters={...t.parameters,storySource:{source:`{
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
}`,...(e=t.parameters)==null?void 0:e.storySource}};const g=["Default"];export{t as Default,g as __namedExportsOrder,x as default};
//# sourceMappingURL=Time.stories-7647b2c9.js.map
