-- Script pour créer les utilisateurs admin dans la base Neon
-- À exécuter dans le SQL Editor de Neon Console
--
-- IMPORTANT : Remplacez les hashes bcrypt ci-dessous par vos propres hashes
-- Pour générer un hash bcrypt : https://bcrypt-generator.com/
-- Ou en Node.js : require('bcrypt').hashSync('votre_password', 10)

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
