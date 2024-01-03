<script lang="ts">
  import type { User } from '@/lib/auth'

  import AddUser from './_add-user.svelte'
  import UserRow from './_user-row.svelte'

  export let users: User[]

  let userList = [...users]
  let dialogOpen = false
</script>

<section class="bg-white px-6 py-4 border rounded-md">
  <header class="grid md:grid-cols-[auto_1fr] items-center">
    <h2 class="font-semibold">Users</h2>

    <aside class="grid grid-cols-[1fr_auto_auto] gap-2 md:ml-auto mt-2 md:mt-0">
      <form class="relative grow min-w-full md:min-w-72">
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
        px-4 py-1.5 border shadow-sm rounded-md
        whitespace-nowrap bg-white hover:bg-slate-50"
      >
        <i class="icon-[tabler--adjustments-alt]" />
        <span>Filters</span>
      </button>

      <button
        on:click={() => (dialogOpen = true)}
        class="flex items-center gap-1 text-sm text-white font-medium
        px-4 py-1.5 border shadow-sm rounded-md
        whitespace-nowrap bg-slate-900 hover:bg-slate-900/90"
      >
        <span>Add user</span>
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
          <th class="py-2.5 px-4 rounded-l-lg whitespace-nowrap">Profile</th>
          <th class="py-2.5 px-4 whitespace-nowrap">Role</th>
          <th class="py-2.5 px-4 whitespace-nowrap">Network</th>
          <th class="py-2.5 px-4 whitespace-nowrap">Last login</th>
          <th class="py-2.5 px-4 whitespace-nowrap">Last ip</th>
          <th class="py-2.5 px-4 rounded-r-lg whitespace-nowrap">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each userList as user (user.id)}
          <UserRow
            {user}
            on:edit={(e) => {
              const userIdx = userList.findIndex((o) => o.id === e.detail.id)
              const user = { ...userList[userIdx], ...e.detail }
              userList[userIdx] = user
            }}
            on:delete={(e) => {
              userList = userList.filter((o) => o.id !== e.detail)
            }}
          />
        {/each}
      </tbody>
    </table>
  </div>
</section>

<AddUser on:submit={(e) => (userList = [...userList, e.detail])} {dialogOpen} />
