<script lang="ts">
  import type { Contact } from '@/pages/api/contact'

  import Pagination from '@/components/pagination.svelte'
  import AddContact from './add-contact.svelte'
  import ContactRow from './contact-row.svelte'

  export let contacts: Contact[]
  export let count: number
  export let currentPage: number
  export let perPage: number

  let contactList = [...contacts]
  let dialogOpen = false
</script>

<section class="bg-white px-6 py-4 rounded-md">
  <header class="grid md:grid-cols-[auto_1fr] items-center">
    <h2 class="font-semibold">Contacts</h2>

    <aside
      class="grid grid-cols-2 sm:grid-cols-[1fr_auto_auto] gap-2 md:ml-auto mt-2 md:mt-0"
    >
      <form class="relative grow min-w-full md:min-w-72 col-span-2 sm:col-auto">
        <i
          class="icon-[tabler--search] absolute top-1/2 -translate-y-1/2 left-2.5"
        />
        <input
          type="email"
          id="email"
          name="email"
          class="border w-full px-3 py-1.5 rounded-md text-sm
          shadow-sm focus:outline-slate-900 pl-8"
          placeholder="Search..."
        />
      </form>

      <button
        class="flex items-center gap-1 text-sm font-medium
        whitespace-nowrap bg-white hover:bg-slate-50
        px-4 py-1.5 border shadow-sm rounded-md"
      >
        <i class="icon-[tabler--adjustments-alt]" />
        <span>Filters</span>
      </button>

      <button
        on:click={() => (dialogOpen = true)}
        class="flex items-center gap-1 text-sm text-white font-medium
        whitespace-nowrap bg-slate-900 hover:bg-slate-900/90
        px-4 py-1.5 border shadow-sm rounded-md"
      >
        <span>Add contact</span>
      </button>
    </aside>
  </header>

  <div class="mt-4 overflow-x-auto">
    <table class="w-full">
      <thead>
        <tr
          class="text-left text-xxs tracking-wider
          uppercase text-slate-500/70 bg-slate-100"
        >
          <th class="py-2.5 px-4 rounded-l-lg whitespace-nowrap">Name</th>
          <th class="py-2.5 px-4 whitespace-nowrap">Currency</th>
          <th class="py-2.5 px-4 whitespace-nowrap">Paypal Email</th>
          <th class="py-2.5 px-4 whitespace-nowrap">Email</th>
          <th class="py-2.5 px-4 whitespace-nowrap">Phone</th>
          <th class="py-2.5 px-4 whitespace-nowrap">Rating</th>
          <th class="py-2.5 px-4 rounded-r-lg whitespace-nowrap">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each contactList as contact (contact.id)}
          <ContactRow
            {contact}
            on:edit={(e) => {
              const idx = contactList.findIndex((o) => o.id === e.detail.id)
              const contact = { ...contactList[idx], ...e.detail }
              contactList[idx] = contact
            }}
            on:delete={(e) => {
              contactList = contactList.filter((o) => o.id !== e.detail)
            }}
          />
        {:else}
          <tr>
            <td
              colspan="6"
              class="text-sm text-center text-slate-500 italic py-2"
            >
              No contact found
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  {#if !!contactList.length}
    <div class="my-4 sm:col-span-2 md:col-span-3">
      <Pagination {count} {perPage} {currentPage} />
    </div>
  {/if}
</section>

<AddContact
  bind:dialogOpen
  on:submit={(e) => (contactList = [...contactList, e.detail])}
/>
