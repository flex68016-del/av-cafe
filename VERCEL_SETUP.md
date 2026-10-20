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

## Initialisation des utilisateurs admin

Après le premier déploiement, vous devez créer les utilisateurs admin dans la base de production. Utilisez l'endpoint temporaire `/api/auth/init-admin` :

### Créer le gérant

```bash
curl -X POST https://av-cafe-sage.vercel.app/api/auth/init-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "manager@avenuecafe.tg",
    "password": "VOTRE_MOT_DE_PASSE",
    "role": "manager"
  }'
```

### Créer le caissier

```bash
curl -X POST https://av-cafe-sage.vercel.app/api/auth/init-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "cashier@avenuecafe.tg",
    "password": "VOTRE_MOT_DE_PASSE",
    "role": "cashier"
  }'
```

**⚠️ IMPORTANT :** Après avoir créé les utilisateurs, supprimez le fichier `src/app/api/auth/init-admin/route.ts` et redéployez.

## Sécurité

- Ne commitez jamais `.env` ou `.env.local`
- Les mots de passe doivent être différents entre gérant et caissier
- Changez les mots de passe régulièrement
- Utilisez des mots de passe générés aléatoirement pour la production
- Supprimez l'endpoint `init-admin` après initialisation
