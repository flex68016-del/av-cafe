# Configuration Vercel

## Variables d'environnement

Copiez les variables depuis `.env.production.example` dans les **Environment Variables** de votre projet Vercel :

1. Allez dans Project Settings > Environment Variables
2. Ajoutez les variables suivantes :

### DATABASE_URL
- Votre chaîne de connexion Neon PostgreSQL
- Exemple : `postgresql://user:password@ep-xxx.region.aws.neon.tech/av_cafe?sslmode=require`

### MANAGER_EMAIL
- Email du compte gérant
- Exemple : `manager@avenuecafe.tg`

### MANAGER_PASSWORD
- Mot de passe du compte gérant
- **IMPORTANT** : Utilisez un mot de passe fort et unique (au moins 12 caractères, mélange majuscules/minuscules/chiffres/symboles)

### CASHIER_EMAIL
- Email du compte caissier
- Exemple : `cashier@avenuecafe.tg`

### CASHIER_PASSWORD
- Mot de passe du compte caissier
- **IMPORTANT** : Utilisez un mot de passe fort et unique (au moins 12 caractères, mélange majuscules/minuscules/chiffres/symboles)

## Commande de seed

Après le premier déploiement, vous devrez peut-être exécuter le seed pour créer les utilisateurs admin :

```bash
npx tsx prisma/seed.ts
```

Ou via Vercel CLI :
```bash
vercel env pull .env.local
npx tsx prisma/seed.ts
```

## Sécurité

- Ne commitez jamais `.env` ou `.env.local`
- Les mots de passe doivent être différents entre gérant et caissier
- Changez les mots de passe régulièrement
- Utilisez des mots de passe générés aléatoirement pour la production
