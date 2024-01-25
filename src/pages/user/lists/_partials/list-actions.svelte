<script lang="ts">
  import type { FormEventHandler } from 'svelte/elements'
  import type { List } from '@/pages/api/list'

  import { fade, fly } from 'svelte/transition'
  import { createEventDispatcher } from 'svelte'
  import { Dialog, DropdownMenu as Dropdown, Select } from 'bits-ui'
  import { list_type } from '@/lib/constants'
  import { clickParent } from '@/lib/actions'
  import Field from '@/components/field.svelte'
  import FileDropzone from '@/components/file-dropzone.svelte'

  export let list: List

  let imageKey = list.image
  let submitting = false
  let dialogOpen = false

  let deleteForm: HTMLFormElement
  let errors: Record<keyof List, string[]> | null = null

  const dispatch = createEventDispatcher<{
    edit: List
    delete: string
  }>()

  const editList: FormEventHandler<HTMLFormElement> = async (e) => {
    submitting = true

    const form = e.currentTarget
    const formData = new FormData(form)

    const res = await fetch(form.action, {
      method: form.method,
      body: formData,
    })

    submitting = false
    const json = (await res.json()) as FetchResponse<Omit<List, 'image'>>

    if (!json.success) return (errors = json.errors)

    dialogOpen = false
    dispatch('edit', { ...json.data, image: imageKey })
  }

  const deleteList = async () => {
    if (!confirm('Are you sure you wanna delete the list?')) return
    submitting = true

    const form = deleteForm
    const formData = new FormData(form)

    const res = await fetch(form.action, {
      method: form.method,
      body: formData,
    })

    submitting = false
    const json = (await res.json()) as FetchResponse<List>
    if (!json.success) return (errors = json.errors)

    dispatch('delete', list.id)
  }
</script>

<Dropdown.Root disableFocusFirstItem>
  <Dropdown.Trigger class="size-5">
    <i class="icon-[tabler--dots-vertical] text-slate-900 size-5" />
  </Dropdown.Trigger>

  <Dropdown.Content
    transition={(e) => fly(e, { duration: 150, y: 10 })}
    align="end"
    class="p-1 rounded-md w-40 text-sm bg-white shadow mt-1"
  >
    <Dropdown.Item
      class="text-left w-full px-3 py-1.5 rounded-md hover:bg-slate-100"
      on:click={() => (dialogOpen = true)}
    >
      Edit
    </Dropdown.Item>
    <Dropdown.Item
      class="text-left w-full px-3 py-1.5 rounded-md hover:bg-slate-100"
      on:click={deleteList}
      disabled={submitting}
    >
      <form
        action="/api/list?delete"
        method="post"
        bind:this={deleteForm}
        on:submit|preventDefault
      >
        <input type="hidden" name="id" value={list.id} />
        <button type="submit" disabled={submitting}>Delete</button>
      </form>
    </Dropdown.Item>
  </Dropdown.Content>
</Dropdown.Root>

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
          <h2 class="text-base font-semibold">Edit List</h2>
        </Dialog.Title>

        <form
          action="/api/list?edit"
          method="post"
          class="space-y-4"
          on:submit|preventDefault={editList}
        >
          <input type="hidden" name="id" value={list.id} />

          <FileDropzone
            name="image"
            error={errors?.image}
            status={imageKey ? 'resolved' : 'idle'}
            bind:key={imageKey}
          />

          <Field label="Name" error={errors?.name}>
            <input
              type="text"
              name="name"
              class="border w-full px-3 py-1.5 h-8 rounded-md text-sm
              shadow-sm focus:outline-slate-900"
              class:border-red-500={!!errors?.name}
              value={list.name}
            />
          </Field>

          <Field label="List type" error={errors?.list_type}>
            <Select.Root
              portal=".dialog"
              selected={list_type
                .map((o) => ({ value: o, label: o }))
                .find((o) => o.value === list.list_type)}
            >
              <Select.Trigger
                class="flex items-center justify-between border w-full px-3
                py-1.5 rounded-md text-sm shadow-sm focus:outline-slate-900
                {!!errors?.list_type ? 'border-red-500' : ''}"
                aria-label="Select a type"
              >
                <Select.Value
                  class="text-sm first-letter:capitalize"
                  placeholder="Select a list type"
                />
                <Select.Input name="list_type" />
                <i class="icon-[tabler--selector]" />
              </Select.Trigger>
              <Select.Content
                class="w-full rounded-md p-1 border bg-white shadow-sm z-40"
                transition={(e) => fly(e, { duration: 150, y: -5 })}
                sideOffset={8}
              >
                {#each list_type as role}
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

          <Field label="URL" error={errors?.url}>
            <input
              type="text"
              name="url"
              class="border w-full px-3 py-1.5 h-8 rounded-md text-sm
              shadow-sm focus:outline-slate-900"
              class:border-red-500={!!errors?.url}
              value={list.url}
            />
          </Field>

          <Field label="Description" error={errors?.description}>
            <textarea
              name="description"
              class="border w-full px-3 py-1.5 rounded-md text-sm
              shadow-sm focus:outline-slate-900 h-20"
              class:border-red-500={!!errors?.description}
              value={list.description}
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
