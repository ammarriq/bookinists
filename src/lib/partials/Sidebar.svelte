<script lang="ts">
  import { getTranslation, type Locales } from '@/i18n/ui'
  import Link from '@/lib/components/Link.svelte'

  type $$Props = {
    pathname: string
    currentLocale: Locales
  }

  export let pathname: $$Props['pathname']
  export let currentLocale: $$Props['currentLocale']

  let isOpen = false

  const t = getTranslation(currentLocale)
</script>

<button
  class="fixed top-3 left-4 flex items-center lg:hidden"
  on:click={() => (isOpen = !isOpen)}
>
  <i class="icon-[tabler--menu] size-5" />
</button>

<aside
  class="fixed top-11 lg:top-0 bottom-0 -left-full lg:left-0
  bg-white p-4 w-56 duration-500"
  class:!left-0={isOpen}
>
  <a href="/" class="flex items-center gap-2">
    <i class="icon-[tabler--books] size-6 text-violet-600" />
    <h1 class="text-xl font-bold text-center">Bookinists</h1>
  </a>

  <nav class="grid gap-2 mt-6">
    <Link href="/{currentLocale}/admin" isActive={(href) => pathname === href}>
      <i class="icon-[tabler--shield-lock]" />
      <span class="text-xs font-semibold">{t('admin.nav.admin')}</span>
    </Link>
    <Link
      href="/{currentLocale}/admin/users"
      isActive={(href) => pathname === href}
    >
      <i class="icon-[tabler--users]" />
      <span class="text-xs font-semibold">{t('admin.nav.users')}</span>
    </Link>
    <Link
      href="/{currentLocale}/admin/books"
      isActive={(href) => pathname === href}
    >
      <i class="icon-[tabler--book-2]" />
      <span class="text-xs font-semibold">{t('admin.nav.books')}</span>
    </Link>
  </nav>
</aside>
