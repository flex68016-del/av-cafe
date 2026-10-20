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

### Option 1 : Via Neon Console (recommandé)

1. Allez sur [Neon Console](https://console.neon.tech)
2. Sélectionnez votre projet av-cafe
3. Cliquez sur "SQL Editor" dans le menu de gauche
4. Générez des hashes bcrypt pour vos mots de passe :
   - Option A : Utilisez [bcrypt-generator.com](https://bcrypt-generator.com/)
   - Option B : En local : `node -e "console.log(require('bcrypt').hashSync('votre_password', 10))"`
5. Copiez le contenu du fichier `CREATE_ADMIN_USERS.sql`
6. Remplacez `$2b$10$REPLACEZ_PAR_VOTRE_HASH_BCRYPT` par vos hashes
7. Collez-le dans l'éditeur SQL
8. Cliquez sur "Run"

Cela créera :
- Gérant : `manager@avenuecafe.tg` avec votre mot de passe
- Caissier : `cashier@avenuecafe.tg` avec votre mot de passe

### Option 2 : Via l'endpoint API (alternative)

Si vous préférez utiliser l'endpoint temporaire :

#### Créer le gérant

```bash
curl -X POST https://av-cafe-sage.vercel.app/api/auth/init-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "manager@avenuecafe.tg",
    "password": "VOTRE_MOT_DE_PASSE",
    "role": "manager"
  }'
```

#### Créer le caissier

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
