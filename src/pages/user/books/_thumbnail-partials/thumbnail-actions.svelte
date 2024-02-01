<script lang="ts">
  import type { User } from '@/lib/auth'

  import { fly } from 'svelte/transition'
  import { createEventDispatcher } from 'svelte'
  import { DropdownMenu as Dropdown } from 'bits-ui'
  import { toast } from 'svelte-sonner'
  import { createFormData } from '@/lib/utils'
  import { DEFAULT_ERROR } from '@/lib/constants'

  export let id: string

  let submitting = false

  const dispatch = createEventDispatcher<{ delete: string }>()

  const deleteThumbnail = async () => {
    if (!confirm('Are you sure you wanna delete the thumbnail?')) return
    submitting = true

    try {
      const res = await fetch('/api/thumbnail?delete', {
        method: 'post',
        body: createFormData({ id }),
      })

      const json = (await res.json()) as FetchResponse<User>
      if (!json.success) throw new Error(Object.values(json.errors).join(', '))

      dispatch('delete', id)
    } catch (err) {
      const error = err instanceof Error ? err.message : DEFAULT_ERROR
      toast.error(error)
    } finally {
      submitting = false
    }
  }
</script>

<Dropdown.Root>
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
      on:click={deleteThumbnail}
      disabled={submitting}
    >
      Delete
    </Dropdown.Item>
  </Dropdown.Content>
</Dropdown.Root>
