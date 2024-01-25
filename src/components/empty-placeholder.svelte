<script lang="ts">
  export let label: string
  export let icon: string
</script>

<div
  class="sm:col-span-2 md:col-span-3 grid place-items-center rounded-md
  p-5 sm:px-10 sm:py-6 md:px-20 md:py-12 text-sm border border-dashed"
>
  <div class="size-16 bg-slate-100 grid place-items-center rounded-full">
    <i class="{icon} size-10 text-slate-900" />
  </div>

  <hgroup class="text-center my-5 space-y-2.5">
    <h3 class="text-xl font-semibold text-slate-900 tracking-wide">
      No {label} created
    </h3>
    <p class="text-slate-500/80">
      You don't have any {label} yet. Start creating by using the below button.
    </p>
  </hgroup>

  <button
    on:click
    class="flex items-center gap-2 text-sm text-slate-900 font-medium px-4 py-1.5
    border shadow-sm rounded-md whitespace-nowrap bg-white hover:bg-slate-50"
  >
    <i class="icon-[tabler--plus]" />
    <span>Add {label}</span>
  </button>
</div>
