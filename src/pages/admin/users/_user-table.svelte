<script lang="ts">
  import type { User } from '@/lib/auth'
  import AddUser from './_add-user.svelte'
  import UserRow from './_user-row.svelte'

  export let users: User[]

  let userList = [...users]
</script>

<section class="bg-white px-6 py-4 border rounded-md">
  <hgroup class="flex">
    <h2 class="font-semibold mr-auto">Users</h2>
    <AddUser on:submit={(e) => (userList = [...userList, e.detail])} />
  </hgroup>

  <div class="mt-4 overflow-x-auto">
    <table class="w-full">
      <thead>
        <tr
          class="text-left text-[0.65rem] tracking-wider
          uppercase text-gray-500/70 bg-gray-100"
        >
          <th class="py-2.5 px-4 rounded-l-lg whitespace-nowrap">Profile</th>
          <th class="py-2.5 px-4 whitespace-nowrap">Role</th>
          <th class="py-2.5 px-4 whitespace-nowrap">Network</th>
          <th class="py-2.5 px-4 whitespace-nowrap">Last login</th>
          <th class="py-2.5 px-4 rounded-r-lg whitespace-nowrap">Last ip</th>
        </tr>
      </thead>
      <tbody>
        {#each userList as user (user.id)}
          <UserRow {user} />
        {/each}
      </tbody>
    </table>
  </div>
</section>
