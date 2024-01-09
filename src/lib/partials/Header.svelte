<script lang="ts">
  import { DropdownMenu as Dropdown } from 'bits-ui'
  import { fly } from 'svelte/transition'

  export let menu: { label: string; url: string; isPost: boolean }[]
  export let picture = ''
</script>

<Dropdown.Root>
  <Dropdown.Trigger class="rounded-full size-8 bg-red-500 ml-auto">
    <img src={picture} alt="" />
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
