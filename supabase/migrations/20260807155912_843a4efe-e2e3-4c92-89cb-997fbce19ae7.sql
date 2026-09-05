DELETE FROM public.services WHERE sort_order >= 6 AND (gender, category, name) IN (
 ('men','Beard','Beard Colour'),
 ('men','Hair','Kids Haircut'),
 ('men','Hair','Hair Colour / Global Tone'),
 ('men','Skin','De-Tan Pack'),
 ('men','Skin','Charcoal Cleanup'),
 ('men','Spa','Head Massage'),
 ('men','Spa','Hair Spa Ritual'),
 ('women','Nails','Nail Art (per hand)'),
 ('women','Nails','Gel Extensions'),
 ('women','Skin','Hydra Glow Facial'),
 ('women','Spa','Hair Spa Ritual')
);

INSERT INTO public.services (gender, category, name, description, price, duration_minutes, sort_order) VALUES
('men','Beard','Beard Line-Up','Sharp edge-up with razor-clean outlines.',250,20,40),
('men','Beard','Beard Straightening','Smoothing treatment for a sleek, tamed beard.',900,45,41),
('men','Hair','Hair Highlights','Global or streak highlights with toner.',2000,120,42),
('men','Hair','Hair Straightening','Smoothing for frizz-free, sleek hair.',3000,150,43),
('men','Skin','Oxygen Facial','Brightening oxygen infusion for tired skin.',1400,60,44),
('men','Skin','Blackhead Removal','Targeted nose and t-zone extraction.',500,30,45),
('men','Spa','Foot Reflexology','Pressure-point therapy for tired feet.',800,45,46),
('men','Spa','Full Body Massage','Deep relaxation with warm aroma oils.',2200,75,47),
('women','Hair','Hair Botox','Protein-rich smoothing for damaged hair.',5000,150,48),
('women','Hair','Hair Rebonding','Permanent straightening with a silky finish.',6000,180,49),
('women','Nails','Nail Extension Refill','Refill and reshape for existing extensions.',1200,60,50),
('women','Nails','French Manicure','Timeless tips with a glossy seal.',900,45,51),
('women','Skin','Gold Facial','Radiance-boost ritual with 24k gold serum.',2500,75,52),
('women','Skin','Diamond Facial','Micro-polish facial for a lit-from-within glow.',2600,75,53),
('women','Spa','Head & Scalp Therapy','Warm oil ritual for scalp health and calm.',1000,45,54),
('women','Spa','Back Detox Ritual','Cleanse, scrub and massage for the back.',1600,60,55);