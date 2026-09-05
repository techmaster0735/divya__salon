-- ROLES
create type public.app_role as enum ('admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "own roles readable" on public.user_roles for select to authenticated using (auth.uid() = user_id);
create policy "admins manage roles" on public.user_roles for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create or replace function public.bootstrap_first_admin()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end; $$;
create trigger on_auth_user_created_bootstrap_admin
after insert on auth.users for each row execute function public.bootstrap_first_admin();

revoke all on function public.bootstrap_first_admin() from public, anon, authenticated;
revoke all on function public.has_role(uuid, public.app_role) from public, anon;
grant execute on function public.has_role(uuid, public.app_role) to authenticated;

-- SERVICES
create table public.services (
  id uuid primary key default gen_random_uuid(),
  gender text not null default 'men' check (gender in ('men','women','unisex')),
  category text not null default 'Hair',
  name text not null,
  description text,
  price numeric(10,2) not null default 0,
  offer_price numeric(10,2),
  duration_minutes int not null default 30,
  image_path text,
  badge text,
  is_package boolean not null default false,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.services to anon;
grant select, insert, update, delete on public.services to authenticated;
grant all on public.services to service_role;
alter table public.services enable row level security;
create policy "public reads active services" on public.services for select to anon, authenticated using (is_active);
create policy "admins manage services" on public.services for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- GALLERY
create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null default 'Trending',
  gender text not null default 'men' check (gender in ('men','women','unisex')),
  image_path text not null,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.gallery_items to anon;
grant select, insert, update, delete on public.gallery_items to authenticated;
grant all on public.gallery_items to service_role;
alter table public.gallery_items enable row level security;
create policy "public reads active gallery" on public.gallery_items for select to anon, authenticated using (is_active);
create policy "admins manage gallery" on public.gallery_items for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- OFFERS
create table public.offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  price numeric(10,2),
  offer_price numeric(10,2),
  discount_percent int,
  image_path text,
  gender text not null default 'unisex' check (gender in ('men','women','unisex')),
  starts_at date,
  ends_at date,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.offers to anon;
grant select, insert, update, delete on public.offers to authenticated;
grant all on public.offers to service_role;
alter table public.offers enable row level security;
create policy "public reads live offers" on public.offers for select to anon, authenticated
  using (is_active and (starts_at is null or starts_at <= current_date) and (ends_at is null or ends_at >= current_date));
create policy "admins manage offers" on public.offers for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- ANNOUNCEMENTS
create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
grant select on public.announcements to anon;
grant select, insert, update, delete on public.announcements to authenticated;
grant all on public.announcements to service_role;
alter table public.announcements enable row level security;
create policy "public reads active announcements" on public.announcements for select to anon, authenticated using (is_active);
create policy "admins manage announcements" on public.announcements for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- ACADEMY MEDIA
create table public.academy_media (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  kind text not null default 'image' check (kind in ('image','video','file')),
  file_path text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.academy_media to anon;
grant select, insert, update, delete on public.academy_media to authenticated;
grant all on public.academy_media to service_role;
alter table public.academy_media enable row level security;
create policy "public reads active academy media" on public.academy_media for select to anon, authenticated using (is_active);
create policy "admins manage academy media" on public.academy_media for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- SITE SETTINGS
create table public.site_settings (
  id boolean primary key default true check (id),
  salon_name text not null default 'Divya Luxe Salon',
  tagline text not null default 'Premium Grooming & Beauty Studio',
  about text,
  logo_path text,
  hero_image_path text,
  men_image_path text,
  women_image_path text,
  hero_title text not null default 'Where Style Meets Craft',
  hero_subtitle text,
  address text,
  phone text,
  whatsapp text,
  email text,
  opening_hours text,
  instagram_url text,
  facebook_url text,
  maps_embed_url text,
  updated_at timestamptz not null default now()
);
grant select on public.site_settings to anon;
grant select, insert, update on public.site_settings to authenticated;
grant all on public.site_settings to service_role;
alter table public.site_settings enable row level security;
create policy "public reads settings" on public.site_settings for select to anon, authenticated using (true);
create policy "admins manage settings" on public.site_settings for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- STORAGE POLICIES
create policy "anyone can read media" on storage.objects for select to anon, authenticated using (bucket_id = 'media');
create policy "admins upload media" on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.has_role(auth.uid(),'admin'));
create policy "admins update media" on storage.objects for update to authenticated using (bucket_id = 'media' and public.has_role(auth.uid(),'admin'));
create policy "admins delete media" on storage.objects for delete to authenticated using (bucket_id = 'media' and public.has_role(auth.uid(),'admin'));

-- SEED SETTINGS
insert into public.site_settings (id, salon_name, tagline, about, hero_title, hero_subtitle, address, phone, whatsapp, email, opening_hours)
values (
  true,
  'Divya Luxe Salon',
  'Premium Grooming & Beauty Studio',
  'A calm, gold-lit studio where senior stylists craft hair, skin and bridal looks with unhurried attention.',
  'Where Style Meets Craft',
  'Hair, skin, nails and bridal artistry for men and women — by appointment.',
  '2nd Floor, Luxe Arcade, MG Road, Bengaluru 560001',
  '+91 98765 43210',
  '+91 98765 43210',
  'hello@divyaluxe.salon',
  'Tue – Sun, 10:00 AM – 8:30 PM'
);

-- SEED SERVICES (MEN)
insert into public.services (gender, category, name, description, price, duration_minutes, sort_order) values
  ('men','Hair','Signature Haircut','Consultation, precision cut and styling.',600,45,1),
  ('men','Hair','Fade & Taper','Sharp skin fades and clean tapers.',700,45,2),
  ('men','Hair','Kids Haircut','Gentle cuts for under-12s.',400,30,3),
  ('men','Hair','Hair Colour','Global colour or grey coverage.',1500,90,4),
  ('men','Beard','Beard Sculpt','Shape, line-up and hot towel finish.',400,30,11),
  ('men','Beard','Royal Shave','Hot towel, lather and straight razor shave.',500,40,12),
  ('men','Beard','Beard Colour','Natural-looking beard tint.',600,40,13),
  ('men','Skin','Detan Cleanup','Quick brightening cleanup for face and neck.',700,30,21),
  ('men','Skin','Men''s Facial','Deep cleanse, exfoliation and massage.',1200,60,22),
  ('men','Spa','Head Massage','Relaxing oil massage with steam.',600,30,31),
  ('men','Spa','Hair Spa','Nourishing spa ritual for scalp and lengths.',1100,60,32);

-- SEED SERVICES (WOMEN)
insert into public.services (gender, category, name, description, price, duration_minutes, sort_order) values
  ('women','Hair','Haircut & Style','Cut, blow-dry and finish.',900,60,41),
  ('women','Hair','Global Colour','Full-head colour with gloss.',3500,120,42),
  ('women','Hair','Balayage','Hand-painted, sun-kissed dimension.',5500,180,43),
  ('women','Hair','Keratin Treatment','Frizz control with lasting shine.',6500,180,44),
  ('women','Skin','Luxury Facial','Advanced facial tailored to your skin.',2200,75,45),
  ('women','Skin','Cleanup','Express cleanse, steam and pack.',900,40,46),
  ('women','Spa','Hair Spa Ritual','Deep conditioning ritual with scalp massage.',1500,60,47),
  ('women','Spa','Hair Treatment','Targeted repair for damaged hair.',2000,75,48),
  ('women','Nails','Manicure & Pedicure','Classic duo with massage and polish.',1400,80,49),
  ('women','Nails','Classic Manicure','Shaping, cuticle care and a glossy finish.',700,40,61),
  ('women','Nails','Spa Pedicure','Soak, scrub and massage with a polished finish.',900,50,62),
  ('women','Nails','Gel Polish','Long-lasting high-shine gel colour.',1000,45,63),
  ('women','Nails','Nail Extensions','Acrylic or gel extensions shaped to your style.',2200,90,64),
  ('women','Nails','Nail Art','Hand-painted art, chrome and stone detailing.',600,40,65),
  ('women','Bridal','Bridal Glow Package','Pre-wedding skin, hair and makeup plan.',15000,240,71),
  ('women','Bridal','Party Makeup','Event-ready makeup with hair styling.',3500,90,72),
  ('women','Beauty','Full Body Waxing','Rica or chocolate wax, head to toe.',2500,90,81),
  ('women','Beauty','Threading','Brows, upper lip and face.',150,15,82);

-- SEED OFFERS
insert into public.offers (title, description, price, offer_price, discount_percent, gender, sort_order) values
  ('Weekday Grooming Combo','Haircut + beard sculpt, Tue to Thu.',1000,799,20,'men',1),
  ('Glow Duo','Luxury facial + cleanup for a lit-from-within finish.',3100,2499,19,'women',2),
  ('Bridal Trial Special','Book a bridal package and get the trial on us.',null,null,null,'women',3);

-- SEED ANNOUNCEMENT
insert into public.announcements (title, body) values
  ('Now open Sundays','Weekend slots fill fast — book ahead on WhatsApp.');