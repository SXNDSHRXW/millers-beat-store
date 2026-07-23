# MILLERS — Beat Store

An exclusive hip hop and grime beat store built with Next.js, featuring 3D comic-book style UI, beat battles, and Stripe checkout.

## Features
..
- 3D Comic Book Aesthetic — Fighter-select style beat cards with mouse-tracking tilt
- Beat Battle Mode — Pit beats against each other, vote for winners
- Boss Card — Producer profile as a Final Boss character card
- Custom Cursor — 6 cursor types with trail ghosts
- Stripe Checkout — .WAV and .WAV + Stems license options
- Auto Email Delivery — Resend-powered fulfillment emails
- SEO Optimized — Dynamic meta tags, structured data, sitemap-ready
- Dark Theme — Void black + ink white + neon blue/green accents

## Tech Stack

- Next.js 15 (App Router)
- React Three Fiber (3D hero scene)
- GSAP (animations)
- Tailwind CSS
- Supabase (database)
- Stripe (payments)
- Resend (email)
- Howler.js (audio)
- Zustand (state management)

## Database Setup (Supabase)

Create the following tables:

### beats
```sql
create table beats (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  bpm integer not null,
  musical_key text not null,
  genre text not null,
  mood text[] default '{}',
  tags text[] default '{}',
  description text,
  preview_url text,
  artwork_url text,
  stripe_wav_id text,
  stripe_stems_id text,
  price_wav integer not null,
  price_stems integer not null,
  is_sold boolean default false,
  sold_at timestamp,
  battle_wins integer default 0,
  battle_losses integer default 0,
  created_at timestamp default now()
);
```

### purchases
```sql
create table purchases (
  id uuid primary key default gen_random_uuid(),
  beat_id uuid references beats(id),
  stripe_session_id text not null,
  customer_email text not null,
  license_type text not null,
  fulfilled boolean default false,
  created_at timestamp default now()
);
```

### battles
```sql
create table battles (
  id uuid primary key default gen_random_uuid(),
  beat_a_id uuid references beats(id),
  beat_b_id uuid references beats(id),
  winner_id uuid references beats(id),
  voter_ip text,
  created_at timestamp default now()
);
```

## License

All beats are sold under exclusive license. See `/terms` for full details.

---

NO AI. NO SAMPLES. ALL GAS.
