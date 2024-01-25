<script lang="ts">
  import type { FormEventHandler } from 'svelte/elements'
  import type { Storage } from '@/pages/api/storage'

  import { fade, fly } from 'svelte/transition'
  import { createEventDispatcher } from 'svelte'
  import { Dialog, Select } from 'bits-ui'
  import { clickParent } from '@/lib/actions'
  import { storage_type } from '@/lib/constants'
  import Field from '@/components/field.svelte'
  import FileDropzone from '@/components/file-dropzone.svelte'

  export let dialogOpen = false

  let imageKey = ''
  let submitting = false
  let errors: Record<keyof Storage, string[]> | null = null

  const dispatch = createEventDispatcher<{ submit: Storage }>()

  const submit: FormEventHandler<HTMLFormElement> = async (e) => {
    submitting = true

    const form = e.currentTarget
    const formData = new FormData(form)

    const res = await fetch(form.action, {
      method: form.method,
      body: formData,
    })

    submitting = false
    const json = (await res.json()) as FetchResponse<Omit<Storage, 'icon'>>
    if (!json.success) return (errors = json.errors)

    dispatch('submit', { ...json.data, image: imageKey })
    dialogOpen = false
  }
</script>

<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Portal>
    <Dialog.Overlay
      transition={(node) => fade(node, { duration: 150 })}
      class="fixed inset-0 bg-black/60 z-50"
    />

    <Dialog.Content
      class="dialog fixed inset-0 grid place-items-center
      py-12 overflow-y-auto bg-transparent z-50"
    >
      <div
        transition:fly={{ y: '10px', duration: 150 }}
        class="relative py-5 px-6 border rounded-md bg-white
        w-[calc(100%-2rem)] max-w-md outline-none"
        use:clickParent={() => (dialogOpen = false)}
      >
        <button
          class="icon-[tabler--x] absolute top-4 right-4"
          on:click={() => (dialogOpen = false)}
        />

        <Dialog.Title class="space-y-1 mb-4">
          <h2 class="text-base font-semibold">Add Storage</h2>
        </Dialog.Title>

        <form
          action="/api/storage?add"
          method="post"
          class="space-y-4"
          on:submit|preventDefault={submit}
        >
          <FileDropzone
            name="image"
            error={errors?.image}
            bind:key={imageKey}
          />

          <Field label="Name" error={errors?.name}>
            <input
              type="text"
              name="name"
              class="border w-full px-3 py-1.5 h-8 rounded-md text-sm
              shadow-sm focus:outline-slate-900"
              class:border-red-500={!!errors?.name}
            />
          </Field>

          <Field label="Storage type" error={errors?.storage_type}>
            <Select.Root portal=".dialog">
              <Select.Trigger
                class="flex items-center justify-between border w-full px-3
                py-1.5 rounded-md text-sm shadow-sm focus:outline-slate-900
                {!!errors?.storage_type ? 'border-red-500' : ''}"
                aria-label="Select a type"
              >
                <Select.Value
                  class="text-sm first-letter:capitalize"
                  placeholder="Select a storage type"
                />
                <Select.Input name="storage_type" />
                <i class="icon-[tabler--selector]" />
              </Select.Trigger>
              <Select.Content
                class="w-full rounded-md p-1 border bg-white shadow-sm z-40"
                transition={(e) => fly(e, { duration: 150, y: -5 })}
                sideOffset={8}
              >
                {#each storage_type as role}
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

          <Field label="Color" error={errors?.color}>
            <input
              type="color"
              name="color"
              class="border w-full px-3 py-1.5 h-8 rounded-md text-sm
              shadow-sm focus:outline-slate-900"
              class:border-red-500={!!errors?.color}
            />
          </Field>

          <fieldset class="grid grid-cols-2 gap-x-4">
            <Field label="Width" error={errors?.width}>
              <input
                type="number"
                name="width"
                class="border w-full px-3 py-1.5 h-8 rounded-md text-sm
                shadow-sm focus:outline-slate-900"
                class:border-red-500={!!errors?.width}
              />
            </Field>

            <Field label="Height" error={errors?.height}>
              <input
                type="number"
                name="height"
                class="border w-full px-3 py-1.5 h-8 rounded-md text-sm
                shadow-sm focus:outline-slate-900"
                class:border-red-500={!!errors?.height}
              />
            </Field>
          </fieldset>

          <Field label="Depth" error={errors?.depth}>
            <input
              type="number"
              name="depth"
              class="border w-full px-3 py-1.5 h-8 rounded-md text-sm
              shadow-sm focus:outline-slate-900"
              class:border-red-500={!!errors?.depth}
            />
          </Field>

          <Field label="Notes" error={errors?.notes}>
            <textarea
              name="notes"
              class="border w-full px-3 py-1.5 rounded-md text-sm
              shadow-sm focus:outline-slate-900 h-20"
              class:border-red-500={!!errors?.notes}
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
        </form>
      </div>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
