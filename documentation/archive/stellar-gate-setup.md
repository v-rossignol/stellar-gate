# Infinity - StellarGate (Client Login) - Setup Projet

```yaml
date: 2026-06-07
author: Roro LeSage
model:
  name: Composer
  version: "2.5"
type: Documentation Technique - Setup Projet
sources:
  - discussion-projet-infinity-stellar-gate
  - documentation/needed-enpoint.md
  - documentation/to-be-defined.md
  - https://react.dev/
  - https://mui.com/
  - https://reactrouter.com/
  - https://github.com/pmndrs/zustand
  - https://react-hook-form.com/
  - https://zod.dev/
  - https://axios-http.com/
  - https://www.framer.com/motion/
  - https://vitejs.dev/
```

---

## **1. Introduction**

**StellarGate** est le client dédié à l'**authentification** (login, création de compte, récupération de mot de passe) pour le jeu **Infinity**. Ce client est une **application web légère** qui communique avec le serveur pour gérer les comptes joueurs.

**Objectifs** :

- Permettre aux joueurs de **se connecter** à leur compte.
- Permettre la **création de compte** (inscription).
- Gérer la **récupération de mot de passe** (optionnel).
- Rediriger vers le **Client Galaxie** après une authentification réussie.

### **A. Architecture des URLs**

StellarGate et le Client Galaxie sont deux applications **distinctes**, hébergées sur le **même domaine** :


| **Client**      | **URL (production)**        | **Rôle**         |
| --------------- | --------------------------- | ---------------- |
| **StellarGate** | `infinity.com/stellar-gate` | Authentification |
| **Galaxie**     | `infinity.com/galaxy`       | Jeu principal    |


La navigation **interne** (login, register, forgot-password) passe par **React Router**.  
La navigation vers Galaxie utilise `window.location.assign('/galaxy')` (SPA séparée).

### **B. Comportements**

| **Situation**                         | **Comportement**                                                        |
| ------------------------------------- | ----------------------------------------------------------------------- |
| Login réussi                          | Redirection automatique vers `/galaxy`                                  |
| Inscription réussie                   | Auto-login, puis affichage d'un bouton **Aller vers Galaxie**           |
| Joueur déjà connecté sur StellarGate  | Affichage d'un bouton **Aller vers Galaxie** + bouton **Déconnexion**   |

**Session** : cookie `httpOnly` posé par le serveur (voir `needed-enpoint.md`). Points encore ouverts : `to-be-defined.md`.

---

## **2. Stack Technologique**

### **A. Core Technologies**


| **Catégorie**        | **Technologie**                                                                                       | **Version Recommandée** | **Rôle**                                                                |
| -------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------- | ----------------------------------------------------------------------- |
| **Framework UI**     | [React](https://react.dev/)                                                                           | v18.x                   | Construction de l'interface utilisateur (formulaires, boutons, etc.).   |
| **State Management** | [Zustand](https://github.com/pmndrs/zustand)                                                          | v4.x                    | Gestion d'état légère pour les formulaires et l'état de connexion.      |
| **Routing**          | [React Router](https://reactrouter.com/)                                                              | v6.x                    | Navigation entre les pages (login, inscription, etc.).                  |
| **Formulaires**      | [React Hook Form](https://react-hook-form.com/)                                                       | v7.x                    | Gestion des formulaires avec validation.                                |
| **Validation**       | [Zod](https://zod.dev/)                                                                               | v3.x                    | Validation des données des formulaires (alternative à Yup).             |
| **Communication**    | [Axios](https://axios-http.com/)                                                                      | v1.x                    | Requêtes HTTP vers le serveur pour l'authentification.                  |
| **UI Components**    | [MUI](https://mui.com/)                                                                               | v5.x                    | Composants UI et système de thème (sx, ThemeProvider).                  |
| **Animations**       | [Framer Motion](https://www.framer.com/motion/)                                                       | v10.x                   | Animations fluides pour les transitions et effets visuels.              |
| **Bundler**          | [Vite](https://vitejs.dev/)                                                                           | v5.x                    | Build rapide et optimisé pour le développement web moderne.             |
| **Langage**          | TypeScript                                                                                            | v5.x                    | Typage statique pour une meilleure maintenabilité.                      |


---

## **3. Structure du Projet**

```
stellargate/
├── public/                  # Assets statiques
│   ├── images/              # Logos, icônes, etc.
│   │   ├── logo.svg
│   │   └── background.jpg
│   └── index.html           # Point d'entrée HTML
│
├── src/
│   ├── assets/              # Assets dynamiques
│   │   ├── styles/
│   │   │   └── global.css   # Reset CSS minimal
│   │   └── theme.ts         # Thème MUI personnalisé
│   │
│   ├── components/          # Composants React réutilisables
│   │   └── auth/            # Composants spécifiques à l'authentification
│   │       ├── LoginForm.tsx
│   │       ├── RegisterForm.tsx
│   │       ├── ForgotPasswordForm.tsx
│   │       └── AuthLayout.tsx
│   │
│   ├── pages/               # Pages principales
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── ForgotPasswordPage.tsx
│   │
│   ├── stores/              # Stores Zustand
│   │   ├── authStore.ts       # État global de l'authentification
│   │   └── uiStore.ts         # État de l'UI (ex: modales ouvertes)
│   │
│   ├── services/            # Services pour les appels API
│   │   ├── api.ts             # Instance Axios (à documenter — voir to-be-defined.md)
│   │   └── authService.ts     # Appels API pour l'authentification
│   │
│   ├── types/               # Types TypeScript
│   │   ├── auth.ts            # Types pour l'authentification
│   │   └── api.ts             # Types pour les réponses API
│   │
│   ├── utils/               # Utilitaires
│   │   └── helpers.ts         # Fonctions utilitaires
│   │
│   ├── App.tsx              # Point d'entrée de l'application React
│   ├── main.tsx             # Initialisation de React
│   └── vite-env.d.ts         # Déclarations de types pour Vite
│
├── .env                     # Variables d'environnement
├── .gitignore
├── package.json
├── tsconfig.json            # Configuration TypeScript
├── vite.config.ts           # Configuration Vite
└── README.md
```

---

## **4. Dépendances du Projet**

### **A. `package.json`**

```json
{
  "name": "stellargate",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .ts,.tsx"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.0",
    "zustand": "^4.4.7",
    "@hookform/resolvers": "^3.3.4",
    "react-hook-form": "^7.49.2",
    "zod": "^3.22.4",
    "axios": "^1.6.2",
    "@mui/material": "^5.15.0",
    "@emotion/react": "^11.11.1",
    "@emotion/styled": "^11.11.0",
    "framer-motion": "^10.16.16"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.3.3",
    "vite": "^5.0.8",
    "eslint": "^8.55.0",
    "@typescript-eslint/eslint-plugin": "^6.13.2",
    "@typescript-eslint/parser": "^6.13.2",
    "prettier": "^3.1.1"
  }
}
```

---

## **5. Configuration de Base**

### **A. `vite.config.ts`**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/stellar-gate/', // Chemin de déploiement sur infinity.com/stellar-gate
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@pages': '/src/pages',
      '@stores': '/src/stores',
      '@services': '/src/services',
      '@types': '/src/types',
      '@utils': '/src/utils',
    },
  },
  server: {
    port: 3001,
    proxy: {
      '/infinity': {
        target: 'http://localhost:4000', // Adresse du serveur Infinity
        changeOrigin: true,
      },
    },
  },
});
```

---

### **B. `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@pages/*": ["src/pages/*"],
      "@stores/*": ["src/stores/*"],
      "@services/*": ["src/services/*"],
      "@types/*": ["src/types/*"],
      "@utils/*": ["src/utils/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## **6. Points d'Entrée et Initialisation**

### **A. `main.tsx`**

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import theme from './assets/theme';
import './assets/styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter basename="/stellar-gate">
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
```

---

### **B. `App.tsx`**

```typescript
import { Routes, Route } from 'react-router-dom';
import { AuthLayout } from '@components/auth/AuthLayout';
import { LoginPage } from '@pages/LoginPage';
import { RegisterPage } from '@pages/RegisterPage';
import { ForgotPasswordPage } from '@pages/ForgotPasswordPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthLayout />}>
        <Route index element={<LoginPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
      </Route>
    </Routes>
  );
}

export default App;
```

---

### **C. `theme.ts` (MUI)**

```typescript
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
  },
});

export default theme;
```

---

## **7. Exemples de Composants**

### **A. `AuthLayout.tsx`**

```typescript
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, Container } from '@mui/material';

export const AuthLayout = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url(${import.meta.env.BASE_URL}images/background.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              padding: 4,
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <Outlet />
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};
```

---

### **B. `LoginForm.tsx`**

```typescript
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link as RouterLink } from 'react-router-dom';
import { useAuthStore } from '@stores/authStore';
import { Button, TextField, Box, Typography, Link } from '@mui/material';

const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const { login, logout, restoreSession, isAuthenticated, user, error } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.username, data.password);
      window.location.assign('/galaxy');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  if (isAuthenticated && user) {
    return (
      <Box sx={{ mt: 1, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          StellarGate
        </Typography>
        <Typography sx={{ mb: 3 }}>
          Welcome back, {user.username}
        </Typography>
        <Button
          fullWidth
          variant="contained"
          sx={{ mb: 2 }}
          onClick={() => window.location.assign('/galaxy')}
        >
          Go to Galaxy
        </Button>
        <Button fullWidth variant="outlined" onClick={logout}>
          Logout
        </Button>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        StellarGate
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <TextField
        label="Username"
        fullWidth
        margin="normal"
        {...register('username')}
        error={!!errors.username}
        helperText={errors.username?.message}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Logging in...' : 'Login'}
      </Button>
      <Box sx={{ textAlign: 'center' }}>
        <Link component={RouterLink} to="/register" color="inherit">
          Don&apos;t have an account? Register
        </Link>
      </Box>
    </Box>
  );
};
```

---

### **C. `RegisterForm.tsx`**

```typescript
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link as RouterLink } from 'react-router-dom';
import { useAuthStore } from '@stores/authStore';
import { Button, TextField, Box, Typography, Link } from '@mui/material';

const registerSchema = z
  .object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    email: z.string().email('Invalid email address'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const { register: registerUser, error } = useAuthStore();
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data.username, data.password, data.email);
      setIsSuccess(true);
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  if (isSuccess) {
    return (
      <Box sx={{ mt: 1, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Account Created
        </Typography>
        <Typography sx={{ mb: 3 }}>
          You are now logged in. Continue to Galaxy when you are ready.
        </Typography>
        <Button
          fullWidth
          variant="contained"
          onClick={() => window.location.assign('/galaxy')}
        >
          Go to Galaxy
        </Button>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create Account
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <TextField
        label="Username"
        fullWidth
        margin="normal"
        {...register('username')}
        error={!!errors.username}
        helperText={errors.username?.message}
      />
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <TextField
        label="Confirm Password"
        type="password"
        fullWidth
        margin="normal"
        {...register('confirmPassword')}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Registering...' : 'Register'}
      </Button>
      <Box sx={{ textAlign: 'center' }}>
        <Link component={RouterLink} to="/login" color="inherit">
          Already have an account? Login
        </Link>
      </Box>
    </Box>
  );
};
```

---

## **8. Exemples de Stores et Services**

### **A. `authStore.ts` (Zustand)**

```typescript
import { create } from 'zustand';
import { authService } from '@services/authService';

interface AuthState {
  user: { id: string; username: string; email?: string } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, email?: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  clearError: () => void;
}

const getErrorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error ? error.message : fallback;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.login(username, password);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: getErrorMessage(error, 'Login failed'), isLoading: false });
      throw error;
    }
  },

  register: async (username, password, email) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.register(username, password, email);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: getErrorMessage(error, 'Registration failed'), isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    await authService.logout();
    set({ user: null, isAuthenticated: false, error: null });
  },

  restoreSession: async () => {
    set({ isLoading: true });
    try {
      const user = await authService.getCurrentUser();
      set({
        user,
        isAuthenticated: !!user,
        isLoading: false,
      });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
```

---

### **B. `authService.ts`**

```typescript
import axios from 'axios';

const API_BASE_URL = '/infinity/auth';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Envoie le cookie httpOnly à chaque requête
});

interface User {
  id: string;
  username: string;
  email?: string;
}

interface AuthResponse {
  user: User;
}

export const authService = {
  async login(username: string, password: string): Promise<User> {
    const response = await api.post<AuthResponse>('/login', { username, password });
    return response.data.user;
  },

  async register(username: string, password: string, email?: string): Promise<User> {
    const response = await api.post<AuthResponse>('/register', { username, password, email });
    return response.data.user;
  },

  async logout(): Promise<void> {
    await api.post('/logout');
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post('/forgot-password', { email });
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get<User>('/me');
      return response.data;
    } catch {
      return null;
    }
  },
};
```

> Le serveur pose et gère le cookie de session. Voir `needed-enpoint.md` pour le contrat API.

---

## **9. Types TypeScript**

### **A. `types/auth.ts`**

```typescript
export interface User {
  id: string;
  username: string;
  email?: string;
  createdAt?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  email?: string;
}

export interface AuthResponse {
  user: User;
}

export interface AuthError {
  message: string;
  code?: string;
}
```

---

## **10. Étapes pour Démarrer le Projet**

1. **Initialiser le projet** :
  ```bash
   npm create vite@latest stellargate -- --template react-ts
   cd stellargate
  ```
2. **Installer les dépendances** :
  ```bash
   npm install react-router-dom zustand @hookform/resolvers react-hook-form zod axios @mui/material @emotion/react @emotion/styled framer-motion
   npm install --save-dev @types/react @types/react-dom @vitejs/plugin-react typescript vite eslint prettier
  ```
3. **Configurer Vite et TypeScript** :
  - Copier les fichiers `vite.config.ts` et `tsconfig.json` depuis ce document.
4. **Créer la structure de dossiers** :
  - Suivre la structure décrite dans la section **3. Structure du Projet**.
5. **Configurer le thème MUI** :
  - Créer `src/assets/theme.ts` et envelopper l'app avec `ThemeProvider` et `CssBaseline` dans `main.tsx`.
6. **Ajouter les assets** :
  - Placer les images (logo, fond d’écran) dans `public/images/`.
7. **Démarrer le développement** :
  ```bash
   npm run dev
  ```

---

## **11. Prochaines Étapes**

- **Finaliser les formulaires** : Ajouter la validation côté client et serveur.
- **Configurer le reverse proxy** : Router `/stellar-gate` et `/galaxy` vers leurs SPA respectives sur le même domaine.
- **Implémenter les endpoints** : Suivre `needed-enpoint.md` côté backend NestJS.
- **Ajouter des animations** : Utiliser Framer Motion pour des transitions fluides.
- **Gérer les erreurs** : Afficher des messages d’erreur clairs pour l’utilisateur.
- **Ajouter un thème sombre/clair** : Utiliser le mode `palette.mode` de MUI.
- **Compléter la doc** : Voir `to-be-defined.md` pour les points reportés.

---

## **12. Liens Utiles**

### Documentation projet

- `needed-enpoint.md` — Endpoints API requis
- `to-be-defined.md` — Points à préciser ultérieurement

### Références externes

- [React Documentation](https://react.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [MUI Documentation](https://mui.com/)
- [Framer Motion Documentation](https://www.framer.com/motion/)

---

## **13. Notes**

- Ce document est une **base de départ** : adapte-le selon tes besoins spécifiques.
- Pour une **meilleure organisation**, utilise des **branches Git** pour chaque fonctionnalité majeure.
- Pense à **documenter** chaque composant et service pour faciliter la maintenance.
- StellarGate est un client **HTTP uniquement** : l'authentification passe par Axios avec cookies `httpOnly`, sans connexion temps réel.
- **Documents liés** : `needed-enpoint.md` (API), `to-be-defined.md` (points à préciser).