/* eslint-disable @typescript-eslint/ban-ts-comment */
import { beforeNavigate } from '$app/navigation'
import { navigating } from '$app/stores'
import { onDestroy } from 'svelte'

function getNavigationStore() {
  /** @type {((val?: any) => void)[]} */
  const callbacks = []

  const navigation = {
    ...navigating,
    complete: async () => {
      await new Promise((res) => {
        callbacks.push(res)
      })
    },
  }

  const unsub = navigating.subscribe((n) => {
    if (n === null) {
      while (callbacks.length > 0) {
        const res = callbacks.pop()
        res?.()
      }
    }
  })

  onDestroy(() => {
    unsub()
  })

  return navigation
}

export const preparePageTransition = () => {
  const navigation = getNavigationStore()

  beforeNavigate(() => {
    // ブラウザが ViewTransition API をサポートしていない場合は何もしない
    // @ts-ignore
    if (!document.startViewTransition) {
      return
    }
    const navigationComplete = navigation.complete()

    // @ts-ignore
    document.startViewTransition(async () => {
      await navigationComplete
    })
  })
}
