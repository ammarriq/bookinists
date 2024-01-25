<script lang="ts">
  import type { Room } from '@/pages/api/room'

  import { Avatar } from 'bits-ui'
  import RoomActions from './room-actions.svelte'

  export let room: Room
</script>

<tr class="text-sm border-b">
  <td class="py-2.5 px-4 whitespace-nowrap capitalize">
    {room.name}
  </td>

  <td class="py-2.5 px-4 whitespace-nowrap">
    {room.floor}
  </td>

  <td class="py-2.5 px-4 text-right whitespace-nowrap">
    <RoomActions {room} on:delete on:edit />
  </td>
</tr>
