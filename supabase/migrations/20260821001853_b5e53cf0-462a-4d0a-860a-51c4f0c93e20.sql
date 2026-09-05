CREATE TABLE public.menu_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  kind text not null default 'pdf',
  file_path text,
  link_url text,
  body text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

GRANT SELECT ON public.menu_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.menu_items TO authenticated;
GRANT ALL ON public.menu_items TO service_role;

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public reads active menu items" ON public.menu_items
  FOR SELECT TO anon, authenticated USING (is_active);

CREATE POLICY "admins manage menu items" ON public.menu_items
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$
LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON public.menu_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS about_image_1_path text,
  ADD COLUMN IF NOT EXISTS about_image_2_path text,
  ADD COLUMN IF NOT EXISTS about_title text,
  ADD COLUMN IF NOT EXISTS about_subtitle text;

INSERT INTO public.menu_items (title, description, kind, sort_order) VALUES
  ('Price List', 'Full service menu with prices', 'pdf', 1),
  ('Hair Color', 'Colour shade card and packages', 'pdf', 2),
  ('Bridal Packages', 'Bridal and party looks', 'pdf', 3);