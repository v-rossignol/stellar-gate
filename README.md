# StellarGate

```yaml
date: 2026-06-08
author: Roro LeSage
model:
  name: Composer
  version: "2.5"
sources:
  - documentation/stellar-gate-setup.md
  - documentation/needed-enpoint.md
  - documentation/to-be-defined.md
  - package.json
```

Client d'authentification pour **Infinity** (login, inscription, récupération de mot de passe). SPA React qui communique avec le backend NestJS via des sessions cookie (`httpOnly`).

## Stack technique

- **Framework UI** — [React](https://react.dev/) 18.x
- **Langage** — [TypeScript](https://www.typescriptlang.org/) 5.x
- **Bundler** — [Vite](https://vitejs.dev/) 5.x
- **Routing** — [React Router](https://reactrouter.com/) 6.x
- **État global** — [Zustand](https://github.com/pmndrs/zustand) 4.x
- **Formulaires** — [React Hook Form](https://react-hook-form.com/) 7.x + [Zod](https://zod.dev/) 3.x
- **HTTP** — [Axios](https://axios-http.com/) 1.x
- **UI** — [MUI](https://mui.com/) 5.x (Emotion)
- **Animations** — [Framer Motion](https://www.framer.com/motion/) 10.x
- **Qualité de code** — ESLint, Prettier

## Démarrage

```bash
npm install
npm run dev
```

L'application est accessible sur [http://localhost:3001/stellar-gate/](http://localhost:3001/stellar-gate/).

## Scripts

| Commande | Description |
| -------- | ----------- |
| `npm run dev` | Serveur de développement (port 3001) |
| `npm run build` | Vérification TypeScript + build de production |
| `npm run preview` | Prévisualisation du build |
| `npm run lint` | ESLint sur les fichiers `.ts` / `.tsx` |

## Documentation

- `documentation/stellar-gate-setup.md` — Setup et architecture
- `documentation/infinity/stellar-gate-api.md` — Contrat API Infinity (auth)
- `documentation/needed-enpoint.md` — Résumé des endpoints attendus par le client
- `documentation/to-be-defined.md` — Points à préciser
