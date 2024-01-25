<script lang="ts">
  import type { Contact } from '@/pages/api/contact'

  import { Avatar } from 'bits-ui'
  import ContactActions from './contact-actions.svelte'

  export let contact: Contact

  let image = ''

  const getFile = async (key: string) => {
    const res = await fetch(`/api/file?key=${key}`)

    const blob = new Blob([await res.arrayBuffer()])
    const url = URL.createObjectURL(blob)

    image = url
  }

  $: if (typeof window !== 'undefined') {
    getFile(contact.avatar)
  }
</script>

<tr class="text-sm border-b">
  <td class="py-2.5 px-4 whitespace-nowrap">
    <div class="flex gap-2 items-center min-w-max">
      <Avatar.Root class="flex size-8 items-center justify-center rounded-full">
        <Avatar.Image src={image} alt={contact.name} />
        <Avatar.Fallback
          class="flex items-center justify-center
          bg-red-600 rounded-full size-8"
        >
          <i class="icon-[tabler--file] size-6 text-white" />
        </Avatar.Fallback>
      </Avatar.Root>
      <div>
        <p class="font-semibold text-slate-900">{contact.name ?? ''}</p>
      </div>
    </div>
  </td>
  <td class="py-2.5 px-4 whitespace-nowrap capitalize">
    {contact.currency}
  </td>
  <td class="py-2.5 px-4 whitespace-nowrap capitalize">
    {contact.paypal_email}
  </td>
  <td class="py-2.5 px-4 whitespace-nowrap">
    {contact.email}
  </td>
  <td class="py-2.5 px-4 whitespace-nowrap">
    {contact.phone}
  </td>
  <td class="py-2.5 px-4 whitespace-nowrap">
    {contact.rating}
  </td>
  <td class="py-2.5 px-4 text-right whitespace-nowrap">
    <ContactActions {contact} on:delete on:edit />
  </td>
</tr>
