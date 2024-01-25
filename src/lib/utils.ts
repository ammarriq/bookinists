import type { APIContext, APIRoute } from 'astro'
import { flatten, type Issues } from 'valibot'
import { toast } from 'svelte-sonner'

export const getValiErrors = (issues: Issues) => {
  const errors = flatten(issues).nested

  return Object.keys(errors).reduce((acc, curr) => {
    return { ...acc, [curr]: errors[curr]?.at(-1) }
  }, {})
}

export const get = async <Data>(
  url: string,
  opts: { onstart?: () => any; onfinish?: () => any }
) => {
  opts.onstart?.()

  const res = await fetch(url)
  const json = (await res.json()) as FetchResponse<Data>

  opts.onfinish?.()

  if (!json.success) {
    toast.error('Something went wrong. Try again later.')
    return
  }

  return json.data
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export const debounce = <T extends (...args: any[]) => ReturnType<T>>(
  callback: T,
  timeout: number
) => {
  let timer: ReturnType<typeof setTimeout>

  return (...args: Parameters<T>) => {
    clearTimeout(timer)

    timer = setTimeout(() => callback(...args), timeout)
  }
}

export const createFormData = (obj: Record<string, string | Blob>) => {
  const formData = new FormData()

  for (const [key, value] of Object.entries(obj)) {
    formData.append(key, value)
  }

  return formData
}

export const createActions = (actions: Record<string, APIRoute>) => {
  return async (context: APIContext) => {
    const searchParams = [...context.url.searchParams.keys()]
    const actionname = searchParams[0] ?? 'default'

    const action = actions[actionname]
    if (!action) throw new Error('no action found')

    return await action(context)
  }
}

export const stars = (avg: number) =>
  Array.from({ length: 5 }, (_, i) => {
    if (avg >= i + 1) return 'full'
    if (avg > i) return 'half'

    return 'empty'
  })
