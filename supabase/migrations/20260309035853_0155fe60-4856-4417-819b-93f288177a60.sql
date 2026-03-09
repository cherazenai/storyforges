ALTER TABLE public.generations ADD COLUMN is_favorite BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX idx_generations_is_favorite ON public.generations(user_id, is_favorite);