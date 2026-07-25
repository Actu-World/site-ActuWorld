// Types des brouillons de posts rapides (table post_drafts, payload jsonb).
// Le modèle miroir du composer mobile : un post = 1 à 4 cartes image ;
// le titre du post = sujet de la carte 1, l'excerpt = sa description courte,
// le corps = sa description longue (dos de carte).

export type PostDraftImage = {
  image_url: string; // URL publique (bucket post-images)
  subject?: string | null;          // titre de la carte (80) — carte 1 = titre du post
  description?: string | null;      // excerpt court sur la carte (150)
  back_description?: string | null; // description longue, dos de la carte (600)
  source?: { url: string; title?: string | null } | null; // 1 source requise à la publication
};

export type PostDraftPayload = {
  primary_theme?: string | null;
  tags?: string[];
  images: PostDraftImage[];
};

export type PostDraftRow = {
  id: string;
  author_id: string;
  payload: PostDraftPayload;
  origin: 'app' | 'web';
  created_at: string;
  updated_at: string;
};
