<script lang="ts">
  import type { FormEventHandler } from 'svelte/elements'
  import type { Edition } from '@/pages/api/edition'

  import { createEventDispatcher } from 'svelte'
  import { fly } from 'svelte/transition'
  import { Select } from 'bits-ui'
  import Field from '@/components/field.svelte'

  export let dialogOpen: boolean
  export let book_id = ''

  let submitting = false
  let errors: Record<keyof Edition, string[]> | null = null

  const dispatch = createEventDispatcher<{ submit: Edition }>()

  const submit: FormEventHandler<HTMLFormElement> = async (e) => {
    submitting = true

    const form = e.currentTarget
    const formData = new FormData(form)

    const res = await fetch(form.action, {
      method: form.method,
      body: formData,
    })

    submitting = false
    const json = (await res.json()) as FetchResponse<Edition>
    if (!json.success) return (errors = json.errors)

    dispatch('submit', json.data)
    dialogOpen = false
  }
</script>

<!-- <form
  action="/api/book?add"
  method="post"
  class="space-y-4"
  on:submit|preventDefault={submit}
>
  <input name="book_id" value={book_id} />
  <Field label="Title" error={errors?.title}>
    <input
      type="text"
      name="title"
      class="border w-full px-3 py-1.5 rounded-md text-sm
      shadow-sm focus:outline-slate-900"
      class:border-red-500={!!errors?.title}
    />
  </Field>

  <Field label="URL" error={errors?.url}>
    <input
      type="text"
      name="url"
      class="border w-full px-3 py-1.5 rounded-md text-sm
      shadow-sm focus:outline-slate-900"
      class:border-red-500={!!errors?.url}
    />
  </Field>

  <Field label="Excerpt" error={errors?.excerpt}>
    <input
      type="text"
      name="excerpt"
      class="border w-full px-3 py-1.5 rounded-md text-sm
      shadow-sm focus:outline-slate-900"
      class:border-red-500={!!errors?.excerpt}
    />
  </Field>

  <Field label="Read status" error={errors?.read_status}>
    <Select.Root portal=".dialog">
      <Select.Trigger
        class="flex items-center justify-between border w-full px-3
        py-1.5 rounded-md text-sm  shadow-sm focus:outline-slate-900
        {!!errors?.read_status ? 'border-red-500' : ''}"
        aria-label="Select a status"
      >
        <Select.Value
          class="text-sm first-letter:capitalize"
          placeholder="Select a status"
        />
        <Select.Input name="read_status" />
        <i class="icon-[tabler--selector]" />
      </Select.Trigger>
      <Select.Content
        class="w-full rounded-md p-1 border bg-white  shadow-sm z-40"
        transition={(e) => fly(e, { duration: 150, y: -5 })}
        sideOffset={8}
      >
        {#each read_status as role}
          <Select.Item
            class="px-2 py-1 text-sm capitalize rounded-md cursor-default hover:bg-slate-100"
            value={role}
            label={role}
          >
            {role}
          </Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>
  </Field>

  <Field label="Rating" error={errors?.rating}>
    <input
      type="number"
      name="rating"
      class="border w-full px-3 py-1.5 rounded-md text-sm
      shadow-sm focus:outline-slate-900"
      class:border-red-500={!!errors?.rating}
    />
  </Field>

  <Field label="Review" error={errors?.review}>
    <input
      type="text"
      name="review"
      class="border w-full px-3 py-1.5 rounded-md text-sm
      shadow-sm focus:outline-slate-900"
      class:border-red-500={!!errors?.review}
    />
  </Field>

  <button
    class="flex items-center justify-center text-sm text-white font-medium
    px-4 py-1.5 rounded-md ml-auto mt-4 bg-slate-900
    hover:bg-slate-900/90 disabled:bg-slate-900/50"
    disabled={submitting}
  >
    {#if submitting}
      <i class="icon-[tabler--loader-2] shrink-0 animate-spin mr-1.5" />
    {/if}
    Submit
  </button>
</form> -->
