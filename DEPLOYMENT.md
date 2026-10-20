# Guide de Déploiement - Avenue Café

## 📋 Prérequis

- Compte Vercel (vercel.com)
- Compte Neon (neon.tech)
- Git et Node.js installés localement
- Accès au dépôt GitHub

## 🔐 Variables d'Environnement

### Variables requises

Configurez ces variables dans Vercel Settings > Environment Variables:

```
DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
MANAGER_EMAIL=manager@avenuecafe.tg
MANAGER_PASSWORD=votre_mot_de_passe_fort
CASHIER_EMAIL=cashier@avenuecafe.tg
CASHIER_PASSWORD=votre_mot_de_passe_fort
```

### Génération des mots de passe

Générez des mots de passe forts avec bcrypt:
```bash
node -e "console.log(require('bcrypt').hashSync('votre_mot_de_passe', 10))"
```

## 🗄️ Configuration Neon

### 1. Créer le projet Neon

1. Allez sur [console.neon.tech](https://console.neon.tech)
2. Cliquez sur "Create a project"
3. Choisissez "PostgreSQL"
4. Sélectionnez la région la plus proche (Paris pour l'Afrique de l'Ouest)
5. Copiez la chaîne de connexion

### 2. Exécuter les migrations

```bash
npx prisma migrate deploy
```

### 3. Créer les utilisateurs admin

Exécutez ce SQL dans Neon Console > SQL Editor:

```sql
-- Créer le gérant
INSERT INTO "User" (id, email, password, role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'manager@avenuecafe.tg',
  '$2b$10$w6HxanQuRaDcFoN10Bv9C.QZbbTOJqBkEw7IXjb39Ajylx/OHYL8y',
  'manager',
  NOW(),
  NOW()
);

-- Créer le caissier
INSERT INTO "User" (id, email, password, role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'cashier@avenuecafe.tg',
  '$2b$10$EQaazSr/0v7wqyk1.ymwGebuSAQU0qlFRuOPcHMes8q9lasr0Er8O',
  'cashier',
  NOW(),
  NOW()
);
```

Remplacez les hashes bcrypt par vos propres mots de passe hachés.

### 4. Peupler la base avec les produits

```bash
npx prisma db seed
```

## 🚀 Déploiement sur Vercel

### 1. Connecter Vercel à GitHub

1. Connectez-vous sur [vercel.com](https://vercel.com)
2. Cliquez sur "Add New Project"
3. Importez depuis GitHub
4. Sélectionnez le dépôt `flex68016-del/av-cafe`

### 2. Configurer les variables d'environnement

Dans Vercel > Settings > Environment Variables:

Ajoutez toutes les variables de la section "Variables requises".

### 3. Configurer le build

Vercel détectera automatiquement Next.js. Assurez-vous que:

- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### 4. Déployer

Cliquez sur "Deploy". Vercel exécutera:
1. `npm install`
2. `prisma generate` (via build script)
3. `next build`

Le déploiement prend environ 2-3 minutes.

## 🔒 Sauvegarde Quotidienne

### Configuration Neon

1. Allez dans Neon Console > Votre projet
2. Cliquez sur "Branches"
3. Activez "Point-in-Time Recovery" (PITR)
4. Configurez une rétention de 7-30 jours

### Configuration Vercel

Vercel ne stocke pas les données, donc la sauvegarde Neon est suffisante.

## 📊 Surveillance

### Monitoring Neon

- Dashboard Neon: Latence, connexions, stockage
- Alertes email sur erreurs de base

### Monitoring Vercel

- Dashboard Vercel: Logs, erreurs, performance
- Alertes sur échecs de build

## 🧪 Tests Post-Déploiement

### 1. Test de base

```bash
curl https://av-cafe-sage.vercel.app
```

Devrait retourner la page d'accueil.

### 2. Test API produits

```bash
curl https://av-cafe-sage.vercel.app/api/products
```

Devrait retourner la liste des produits.

### 3. Test login admin

```bash
curl -X POST https://av-cafe-sage.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"manager@avenuecafe.tg","password":"votre_mot_de_passe"}'
```

Devrait retourner le token utilisateur.

### 4. Test PWA

- Ouvrez le site sur mobile
- Vérifiez "Ajouter à l'écran d'accueil"
- Testez hors ligne (coupez le réseau)

## 🔧 Maintenance

### Mise à jour des produits

1. Modifiez `prisma/seed.ts`
2. Exécutez localement: `npx prisma db seed`
3. Appliquez en production via Neon Console

### Mise à jour du code

1. Push sur GitHub
2. Vercel déploie automatiquement
3. Vérifiez les logs en cas d'erreur

### Rotation des mots de passe

1. Générez un nouveau hash bcrypt
2. Exécutez l'UPDATE SQL dans Neon:
```sql
UPDATE "User"
SET password = 'nouveau_hash',
    "updatedAt" = NOW()
WHERE email = 'manager@avenuecafe.tg';
```

## ⚠️ Sécurité

### Checklist

- [ ] Variables d'environnement configurées (jamais commitées)
- [ ] Mots de passe forts (12+ caractères, mixte)
- [ ] HTTPS activé (Vercel par défaut)
- [ ] Rate limiting activé (middleware)
- [ ] CSP configuré (middleware)
- [ ] Aucun secret dans l'historique Git
- [ ] Rotation régulière des mots de passe (90 jours)

### Audit

Exécutez régulièrement:
```bash
git log --all --source -- "*env*" "*secret*" "*password*"
```

## 📞 Support

En cas de problème:

1. Vérifiez les logs Vercel
2. Vérifiez les logs Neon
3. Testez localement avec `npm run dev`
4. Consultez [Next.js docs](https://nextjs.org/docs)
5. Consultez [Neon docs](https://neon.tech/docs)

## 🔄 Rollback

Si un déploiement échoue:

1. Allez dans Vercel > Deployments
2. Cliquez sur le déploiement précédent
3. Cliquez "Promote to Production"

## 📈 Performance

### Optimisations

- Images: WebP, lazy loading
- Bundle: Code splitting automatique (Next.js)
- Base: Connection pooling (Neon)
- Cache: CDN Vercel edge

### Monitoring

Utilisez Vercel Analytics pour:
- Core Web Vitals
- Requêtes lentes
- Erreurs JavaScript
