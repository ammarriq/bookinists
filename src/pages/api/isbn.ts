import type { APIRoute } from 'astro'
import type { ISBNBook } from '@/lib/types'

// @ts-ignore
import nodeIsbn from 'node-isbn'

export const GET = (async ({ url }) => {
  const isbn = url.searchParams.get('value')

  if (!isbn || (isbn.length !== 10 && isbn.length !== 13)) {
    const errors = { message: ['Invalid ISBN'] }

    return Response.json(
      { data: null, success: false, errors }, //
      { status: 400 }
    )
  }

  const book = (await nodeIsbn.resolve(isbn)) as ISBNBook

  const identifier = {
    type: isbn.length === 13 ? 'ISBN_13' : 'ISBN_10',
    identifier: isbn,
  }

  if (!book.industryIdentifiers.length) {
    book.industryIdentifiers = [identifier]
  }

  return Response.json(
    { data: book, success: true, errors: null },
    { status: 200 }
  )
}) satisfies APIRoute
