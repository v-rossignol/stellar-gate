# StellarGate — À définir

```yaml
date: 2026-06-07
author: Roro LeSage
model:
  name: Composer
  version: "2.5"
sources:
  - documentation/stellar-gate-setup.md
  - discussion-projet-infinity-stellar-gate
```

Points volontairement reportés pendant la rédaction de `stellar-gate-setup.md`.

---

## 1. Contrat du token entre StellarGate et Galaxie

- Format du token (JWT, durée de vie, refresh)
- Nom et options du cookie (`httpOnly`, `Secure`, `SameSite`, `Path`, `Domain`)
- Comment Galaxie valide la session au chargement (`GET /infinity/auth/me` ou mécanisme dédié)
- Comportement en cas de token expiré ou invalide

---

## 2. Environnement de développement local

- Simulation du reverse proxy (`/stellar-gate`, `/galaxy` sur le même domaine)
- Ports des clients en dev (StellarGate, Galaxie, serveur API)
- Configuration proxy Vite vs nginx/Caddy en production
- Accès à l'app via `localhost:3001/stellar-gate/` avec `base` Vite

---

## 3. Client Planète

- Rôle du Client Planète dans l'écosystème Infinity
- URL et port de développement (mentionné : port 3000)
- Relation avec StellarGate et Galaxie

---

## 4. Fichiers et composants à documenter

- `services/api.ts` — instance Axios centralisée avec `withCredentials`
- `ForgotPasswordForm.tsx` — formulaire de récupération de mot de passe
- Exemples de pages (`LoginPage`, `RegisterPage`, `ForgotPasswordPage`)
