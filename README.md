# Avenue Café

Site de commande en ligne et caisse hors ligne pour Avenue Café (Avenou, Lomé, Togo).

## Stack

- **Next.js** (App Router, TypeScript, dossier src)
- **PostgreSQL** avec Prisma ORM
- **Dexie** pour le stockage local (IndexedDB)
- **Zod** pour la validation des données
- **Tailwind CSS** pour le styling

## Configuration

1. Copier `env.example` en `.env` et configurer `DATABASE_URL`
2. Installer les dépendances : `npm install`
3. Appliquer les migrations Prisma : `npx prisma migrate dev`
4. Lancer le serveur de développement : `npm run dev`

## API

### POST /api/sync

Synchronise une commande hors ligne avec le serveur.

**Corps de la requête :**
```json
{
  "items": [
    {
      "productId": "abc123",
      "name": "Café",
      "price": 500,
      "quantity": 2
    }
  ],
  "total": 1000
}
```

**Réponses :**
- `201` : Commande synchronisée avec succès
- `400` : Données invalides ou total incorrect
- `409` : Commande déjà synchronisée (doublon détecté)
- `500` : Erreur serveur

## Développement

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run start    # Serveur de production
npm run lint     # ESLint
```

## Base de données

- **Product** : Catalogue des produits
- **Order** : Commandes en ligne
- **OrderItem** : Articles des commandes

## Stockage local (Dexie)

- **cart** : Panier d'achat
- **offlineOrders** : Commandes hors ligne en attente de synchronisation
