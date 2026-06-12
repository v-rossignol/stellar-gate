# StellarGate — Endpoints requis

```yaml
date: 2026-06-07
author: Roro LeSage
model:
  name: Composer
  version: "2.5"
sources:
  - documentation/stellar-gate-setup.md
  - documentation/infinity/stellar-gate-api.md
  - src/services/authService.ts
  - src/services/api.ts
```

Liste des endpoints HTTP attendus par le client StellarGate.  
Le backend Infinity (NestJS) les expose sous le préfixe global `/infinity` — auth : `/infinity/auth/*`.

Contrat détaillé (cookies, erreurs, écarts serveur) : [`documentation/infinity/stellar-gate-api.md`](infinity/stellar-gate-api.md).

**Authentification** : cookies `httpOnly` — toutes les requêtes authentifiées utilisent `withCredentials: true`. Le client ne stocke pas le token en JavaScript.

---

## Endpoints

| Méthode | Route | Auth requise | Description |
| ------- | ----- | ------------ | ----------- |
| `POST` | `/infinity/auth/register` | Non | Créer un compte et établir une session (cookie) |
| `POST` | `/infinity/auth/login` | Non | Authentifier un joueur et établir une session (cookie) |
| `POST` | `/infinity/auth/logout` | Oui | Invalider la session et supprimer le cookie |
| `GET` | `/infinity/auth/me` | Oui | Retourner l'utilisateur connecté (restauration de session) |
| `POST` | `/infinity/auth/forgot-password` | Non | Demander une réinitialisation de mot de passe (optionnel) |

---

## Détail par endpoint

### `POST /infinity/auth/register`

**Body**

```json
{
  "username": "string",
  "password": "string",
  "email": "string"
}
```

**Réponse `201`**

```json
{
  "user": {
    "id": "string",
    "username": "string",
    "email": "string"
  }
}
```

**Cookie** : le serveur pose un cookie de session `httpOnly` dans la réponse.

**Erreurs attendues** : `400` (validation), `409` (username ou email déjà pris)

---

### `POST /infinity/auth/login`

**Body**

```json
{
  "username": "string",
  "password": "string"
}
```

**Réponse `200`**

```json
{
  "user": {
    "id": "string",
    "username": "string",
    "email": "string"
  }
}
```

**Cookie** : le serveur pose un cookie de session `httpOnly` dans la réponse.

**Erreurs attendues** : `400` (validation), `401` (identifiants invalides)

---

### `POST /infinity/auth/logout`

**Body** : vide

**Réponse `200`**

```json
{
  "success": true
}
```

**Cookie** : le serveur supprime ou invalide le cookie de session.

**Erreurs attendues** : `401` (non authentifié)

---

### `GET /infinity/auth/me`

**Réponse `200`**

```json
{
  "id": "string",
  "username": "string",
  "email": "string"
}
```

**Erreurs attendues** : `401` (session absente ou expirée)

---

### `POST /infinity/auth/forgot-password` (optionnel)

**Body**

```json
{
  "email": "string"
}
```

**Réponse `200`**

```json
{
  "success": true
}
```

**Erreurs attendues** : `400` (email invalide)

---

## Notes

- Détails du cookie (`infinity_token`, durée, `SameSite`, etc.) : voir [`infinity/stellar-gate-api.md`](infinity/stellar-gate-api.md).
- Les payloads et codes d'erreur précis sont alignés avec l'implémentation cible NestJS (voir écarts documentés dans le même fichier).
