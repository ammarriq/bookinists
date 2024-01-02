<script lang="ts">
  import type { User } from '@/lib/auth'
  import { Avatar } from 'bits-ui'
  import dayjs from 'dayjs'

  export let user: User

  const networks: Record<string, string> = {
    google: '/icons/google.svg',
  }
</script>

<tr class="text-xs border-b">
  <td class="py-2.5 px-4 whitespace-nowrap">
    <div class="flex gap-2 items-center min-w-max">
      <Avatar.Root class="flex size-8 items-center justify-center rounded-full">
        <Avatar.Image src={user.picture} alt="@huntabyte" />
        <Avatar.Fallback
          class="flex items-center justify-center
          bg-red-600 rounded-full size-8"
        >
          <i class="icon-[tabler--user-filled] size-6 text-white" />
        </Avatar.Fallback>
      </Avatar.Root>
      <div>
        <p class="font-semibold text-violet-600">{user.name ?? ''}</p>
        <p class="text-gray-500/70">{user.email}</p>
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
    {dayjs(new Date(user.last_login)).format('MM/DD/YYYY hh:mm A')}
  </td>
  <td class="py-2.5 px-4 whitespace-nowrap">
    {user.last_ip ?? ''}
  </td>
</tr>
