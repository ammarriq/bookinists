<script lang="ts">
  import type { User } from '@/lib/auth'
  import dayjs from 'dayjs'

  type $$Props = {
    users: User[]
  }

  export let users: $$Props['users']

  const networks: Record<string, string> = {
    google: '/icons/google.svg',
  }
</script>

<div class="mt-4 overflow-x-auto">
  <table class="w-full">
    <thead>
      <tr
        class="text-left text-[0.65rem] tracking-wider
        uppercase text-gray-500/70 bg-gray-100"
      >
        <th class="py-2.5 px-4 rounded-l-lg whitespace-nowrap">Profile</th>
        <th class="py-2.5 px-4 whitespace-nowrap">Network</th>
        <th class="py-2.5 px-4 whitespace-nowrap">Last login</th>
        <th class="py-2.5 px-4 rounded-r-lg whitespace-nowrap">Last ip</th>
      </tr>
    </thead>
    <tbody>
      {#each users as user (user.id)}
        <tr class="text-xs border-b">
          <td class="py-2.5 px-4 whitespace-nowrap">
            <div class="flex gap-2 items-center min-w-max">
              <img class="size-8" src={user.picture} alt="" />
              <div>
                <p class="font-semibold text-violet-600">{user.name}</p>
                <p class="text-gray-500/70">{user.email}</p>
              </div>
            </div>
          </td>
          <td class="py-2.5 px-4 whitespace-nowrap capitalize">
            <img
              class="size-5"
              src={networks[user.network]}
              alt={user.network}
            />
          </td>
          <td class="py-2.5 px-4 whitespace-nowrap">
            {dayjs(user.last_login).format('MM/DD/YYYY hh:mm A')}
          </td>
          <td class="py-2.5 px-4 whitespace-nowrap">
            {user.last_ip}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
