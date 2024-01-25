<script lang="ts">
  import { DropdownMenu as Dropdown } from 'bits-ui'
  import { fly } from 'svelte/transition'

  export let menu: { label: string; url: string; isPost: boolean }[]
  export let user: { name?: string; picture?: string }
</script>

<Dropdown.Root>
  <Dropdown.Trigger
    class="ml-auto flex items-center gap-1 px-1.5 py-1 rounded-md"
  >
    <img class="rounded-full size-6" src={user.picture} alt="" />

    <p class="text-xs font-medium tracking-wider ml-1 text-slate-900">
      {user.name}
    </p>
    <i class="icon-[tabler--chevron-down] size-3"></i>
  </Dropdown.Trigger>

  <Dropdown.Content
    transition={(e) => fly(e, { duration: 150, y: 10 })}
    class="p-1 rounded-md w-40 text-sm bg-white shadow mt-1 z-50"
  >
    {#each menu as item, i (i)}
      {#if !item.isPost}
        <Dropdown.Item
          href={item.url}
          class="text-left w-full px-2 py-1 rounded-md hover:bg-slate-100"
        >
          {item.label}
        </Dropdown.Item>
      {/if}

      {#if item.isPost}
        <Dropdown.Item>
          <form action={item.url} method="post">
            <button
              type="submit"
              class="text-left w-full hover:bg-slate-100 px-2 py-1 rounded-md"
            >
              {item.label}
            </button>
          </form>
        </Dropdown.Item>
      {/if}
    {/each}
  </Dropdown.Content>
</Dropdown.Root>
