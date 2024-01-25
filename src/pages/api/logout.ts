import { initLucia } from '@/lib/auth'
import { createActions } from '@/lib/utils'

export const POST = createActions({
  default: async (context) => {
    const { locals, cookies, redirect } = context
    const lucia = initLucia(locals.runtime.env.SITE_DB)

    if (!locals.session) {
      return new Response(null, { status: 401 })
    }

    await lucia.invalidateSession(locals.session.id)

    const { name, value, attributes } = lucia.createBlankSessionCookie()
    cookies.set(name, value, attributes)

    return redirect(`/login`)
  },
})
