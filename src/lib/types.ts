export type ISBNBook = {
  authors: string[]
  averageRating?: number
  categories: string[]
  description?: string | undefined
  imageLinks?:
    | {
        smallThumbnail: string
        thumbnail: string
      }
    | undefined
  industryIdentifiers: string[]
  infoLink: string
  language: string
  pageCount?: number | undefined
  previewLink: string
  printType: 'BOOK'
  publishedDate: string
  publisher: string
  title: string
  subtitle?: string
}
