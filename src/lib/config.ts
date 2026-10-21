export const ORDER_CONFIG = {
  // Seuil en minutes après lequel une commande reçue passe en rouge
  OLD_ORDER_THRESHOLD_MINUTES: 10,
  // Intervalle de rafraîchissement en ms
  REFRESH_INTERVAL_MS: 5000,
  // Durée du halo pour nouvelle commande en ms
  NEW_ORDER_HALO_DURATION_MS: 200,
} as const;
