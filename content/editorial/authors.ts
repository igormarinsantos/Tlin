import type { AuthorId, EditorialAuthor } from "@/lib/editorial/types";

export const editorialAuthors = {
  "author:igor-marin": {
    id: "author:igor-marin",
    name: "Igor Marin",
    role: "Fundador da Tlin",
    profileUrl: "/como-funciona",
    approved: true,
    image: {
      src: "/team/igor-avatar.avif",
      alt: "Igor Marin, fundador da Tlin",
      approved: true,
    },
  },
} satisfies Record<AuthorId, EditorialAuthor>;
