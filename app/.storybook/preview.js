import '../src/app.css'
import Decorator from './Decorator.svelte'

export const decorators = [() => Decorator]
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  themes: {
    clearable: false,
    list: [
      {
        name: 'Dark',
        // The class dark will be added to the body tag
        class: ['dark', 'text-gray-50'],
        color: '#000',
      },
      {
        name: 'Light',
        class: [],
        color: '#fff',
        default: true,
      },
    ],
  },
}
