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

Pour créer les utilisateurs admin en production, utilisez Neon Console :

1. Allez sur [Neon Console](https://console.neon.tech)
2. Sélectionnez votre projet av-cafe
3. Cliquez sur "SQL Editor" dans le menu de gauche
4. Générez des hashes bcrypt pour vos mots de passe :
   - Option A : Utilisez [bcrypt-generator.com](https://bcrypt-generator.com/)
   - Option B : En local : `node -e "console.log(require('bcrypt').hashSync('votre_password', 10))"`
5. Exécutez le SQL suivant (remplacez les hashes par les vôtres) :

```sql
-- Insérer le gérant
INSERT INTO "User" (email, password, role, "createdAt", "updatedAt")
VALUES (
  'manager@avenuecafe.tg',
  '$2b$10$REPLACEZ_PAR_VOTRE_HASH_BCRYPT',
  'manager',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  password = EXCLUDED.password,
  role = EXCLUDED.role,
  "updatedAt" = NOW();

-- Insérer le caissier
INSERT INTO "User" (email, password, role, "createdAt", "updatedAt")
VALUES (
  'cashier@avenuecafe.tg',
  '$2b$10$REPLACEZ_PAR_VOTRE_HASH_BCRYPT',
  'cashier',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  password = EXCLUDED.password,
  role = EXCLUDED.role,
  "updatedAt" = NOW();

-- Vérifier les utilisateurs créés
SELECT id, email, role, "createdAt" FROM "User" WHERE role IN ('manager', 'cashier');
```

## Sécurité

- Ne commitez jamais `.env` ou `.env.local`
- Les mots de passe doivent être différents entre gérant et caissier
- Changez les mots de passe régulièrement
- Utilisez des mots de passe générés aléatoirement pour la production
