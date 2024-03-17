import { expect } from "@storybook/jest";
import type { Meta, StoryObj } from "@storybook/svelte";
import { within } from "@storybook/testing-library";
import SelfAssessment from "./SelfAssessment.svelte";

const meta: Meta<SelfAssessment> = {
  title: "SelfAssessment",
  component: SelfAssessment,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<SelfAssessment>;

export const Default: Story = {
  args: {
    quizzes: [
      {
        question:
          "フォームにアクセシブルな名前つける際に、最も適した方法はどれですか？",
        answers: [
          {
            text: "label 要素を使用する",
            correct: true,
            explanation:
              "label 要素は、視覚的に表示されるテキストとフォーム部品を関連付けるために使用されます。また、ラベルをクリックした場合にもフォームにフォーカスが移動するため、クリック領域が広がり、運動障害のあるユーザーにも優しいです。",
          },
          {
            text: "aria-label 属性を使用する",
            correct: false,
            explanation:
              "aria-label 属性は、視覚的に表示されるラベルがない場合に使用します。そのような場合にアクセシブルな名前を提供する有効な手段ですが、視覚的に表示されるテキストに基づいてアクセシブルな名前を提供するのがよりよい方法です。",
          },
          {
            text: "aria-labelledby 属性を使用する",
            correct: false,
            explanation:
              "aria-labelledby 属性は、他の要素を参照するために使用されます。しかし、視覚的に表示されるラベルと紐づけるのであれば、label 要素を使用するべきです。",
          },
          {
            text: "aria-describedby 属性を使用する",
            correct: false,
            explanation:
              "aria-describedby 属性は、フォーム部品に関連する補足情報を提供するために使用されます。",
          },
        ],
      },
      {
        question:
          "スクリーンリーダーにフォームの検証に失敗していることを伝えるために使われる属性はどれですか？",
        answers: [
          {
            text: "aria-invalid 属性",
            correct: true,
            explanation:
              "aria-invalid 属性はフォームの検証に失敗していることを伝えるために使用されます。この属性を使用してユーザーにエラーを伝える場合には、適切なエラーメッセージの内容を aria-describedby 属性で提供し、ユーザーがエラーを修正するための手順を提供することが重要です。",
          },
          {
            text: "aria-disabled 属性",
            correct: false,
            explanation:
              "aria-disabled 属性はフォームが無効であり、編集やその他の操作ができないことを伝えるために使用されます。",
          },
          {
            text: "aria-live 属性",
            correct: false,
            explanation:
              "aria-live 属性は要素が動的に更新されることをスクリーンリーダーに伝えるために使用されます。",
          },
          {
            text: "aria-readonly 属性",
            correct: false,
            explanation:
              "aria-readonly 属性は、フォームが読み取り専用であることを伝えるために使用されます。",
          },
        ],
      },
    ],
  },
};
