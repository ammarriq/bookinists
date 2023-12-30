<script lang="ts">
  import type { User } from '@/lib/auth'
  import Dropdown from '@/lib/components/Dropdown.svelte'

  type $$Props = {
    user: Pick<User, 'id' | 'email' | 'name' | 'picture'>
  }

  export let user: $$Props['user']
</script>

<header
  class="fixed top-0 left-0 lg:left-56 right-0
  bg-white flex items-center px-4 h-11"
>
  <Dropdown class="ml-auto">
    <div class="rounded-full size-8 bg-red-500" slot="trigger">
      <img src={user?.picture} alt="" />
    </div>

    <nav
      slot="content"
      class="p-1 rounded-md w-40 text-sm bg-white shadow mt-1"
    >
      <form action="/api/logout" method="post">
        <button
          type="submit"
          class="text-left w-full hover:bg-gray-100 px-2 py-1 rounded-md"
        >
          Logout
        </button>
      </form>
    </nav>
  </Dropdown>
</header>
