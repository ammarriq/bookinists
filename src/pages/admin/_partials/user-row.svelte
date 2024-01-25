<script lang="ts">
  import type { User } from '@/lib/auth'

  import { Avatar } from 'bits-ui'
  import dayjs from 'dayjs'
  import UserActions from './user-actions.svelte'

  export let user: User

  const networks: Record<string, string> = {
    google: '/icons/google.svg',
  }
</script>

<tr class="text-sm border-b">
  <td class="py-2.5 px-4 whitespace-nowrap">
    <div class="flex gap-2 items-center min-w-max">
      <Avatar.Root class="flex size-8 items-center justify-center rounded-full">
        <Avatar.Image src={user.picture} alt={user.name} />
        <Avatar.Fallback
          class="flex items-center justify-center
          bg-red-600 rounded-full size-8"
        >
          <i class="icon-[tabler--user-filled] size-6 text-white" />
        </Avatar.Fallback>
      </Avatar.Root>
      <div>
        <p class="font-semibold text-slate-900">{user.name ?? ''}</p>
        <p class="text-slate-500/70">{user.email}</p>
      </div>
    </div>
  </td>
  <td class="py-2.5 px-4 whitespace-nowrap capitalize">
    {user.role}
  </td>
  <td class="py-2.5 px-4 whitespace-nowrap capitalize">
    {#if user.network}
      <img class="size-5" src={networks[user.network]} alt={user.network} />
    {/if}
  </td>
  <td class="py-2.5 px-4 whitespace-nowrap">
    {#if user.last_login}
      {dayjs(new Date(user.last_login)).format('MM/DD/YYYY hh:mm A')}
    {/if}
  </td>
  <td class="py-2.5 px-4 whitespace-nowrap">
    {user.last_ip ?? ''}
  </td>
  <td class="py-2.5 px-4 text-right whitespace-nowrap">
    <UserActions
      id={user.id}
      email={user.email}
      role={user.role}
      on:delete
      on:edit
    />
  </td>
</tr>
