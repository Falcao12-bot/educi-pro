import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase'; // adaptez le chemin à votre client

/** Vérifie côté serveur (RPC is_owner) — jamais une simple variable locale. */
export function useIsOwner() {
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    supabase.rpc('is_owner').then(({ data }) => {
      if (!alive) return;
      setIsOwner(data === true);
      setLoading(false);
    });
    return () => { alive = false; };
  }, []);

  return { isOwner, loading };
}
