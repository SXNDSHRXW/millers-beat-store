import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { Beat, Purchase, Battle } from '@/types';

let _supabase: SupabaseClient | null = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return _supabase;
}

export async function getBeats(filters?: {
  genre?: string;
  mood?: string;
  search?: string;
}): Promise<Beat[]> {
  let query = getSupabase().from('beats').select('*').order('created_at', { ascending: false });

  if (filters?.genre && filters.genre !== 'all') {
    query = query.eq('genre', filters.genre);
  }

  if (filters?.mood && filters.mood !== 'all') {
    query = query.contains('mood', [filters.mood]);
  }

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,tags.cs.{${filters.search}}`);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).map(row => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    bpm: row.bpm,
    musicalKey: row.musical_key,
    genre: row.genre,
    mood: row.mood || [],
    tags: row.tags || [],
    description: row.description,
    previewUrl: row.preview_url,
    artworkUrl: row.artwork_url,
    stripeWavId: row.stripe_wav_id,
    stripeStemsId: row.stripe_stems_id,
    priceWav: row.price_wav,
    priceStems: row.price_stems,
    isSold: row.is_sold,
    soldAt: row.sold_at,
    battleWins: row.battle_wins || 0,
    battleLosses: row.battle_losses || 0,
    createdAt: row.created_at,
  }));
}

export async function getBeatBySlug(slug: string): Promise<Beat | null> {
  const { data, error } = await getSupabase()
    .from('beats')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    bpm: data.bpm,
    musicalKey: data.musical_key,
    genre: data.genre,
    mood: data.mood || [],
    tags: data.tags || [],
    description: data.description,
    previewUrl: data.preview_url,
    artworkUrl: data.artwork_url,
    stripeWavId: data.stripe_wav_id,
    stripeStemsId: data.stripe_stems_id,
    priceWav: data.price_wav,
    priceStems: data.price_stems,
    isSold: data.is_sold,
    soldAt: data.sold_at,
    battleWins: data.battle_wins || 0,
    battleLosses: data.battle_losses || 0,
    createdAt: data.created_at,
  };
}

export async function markBeatAsSold(beatId: string): Promise<void> {
  await getSupabase()
    .from('beats')
    .update({ is_sold: true, sold_at: new Date().toISOString() })
    .eq('id', beatId);
}

export async function recordPurchase(purchase: Omit<Purchase, 'id' | 'createdAt'>): Promise<void> {
  await getSupabase().from('purchases').insert({
    beat_id: purchase.beatId,
    stripe_session_id: purchase.stripeSessionId,
    customer_email: purchase.customerEmail,
    license_type: purchase.licenseType,
    fulfilled: purchase.fulfilled,
  });
}

export async function recordBattle(battle: Omit<Battle, 'id' | 'createdAt'>): Promise<void> {
  await getSupabase().from('battles').insert({
    beat_a_id: battle.beatAId,
    beat_b_id: battle.beatBId,
    winner_id: battle.winnerId,
    voter_ip: battle.voterIp,
  });
}

export async function incrementBattleWins(beatId: string): Promise<void> {
  await getSupabase().rpc('increment_battle_wins', { beat_id: beatId });
}
