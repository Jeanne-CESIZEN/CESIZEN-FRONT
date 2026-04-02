# CESIZEN-FRONT

Interface web d'administration de l'application CESIZen.

## Stack technique

| Technologie         | Version | Rôle                       |
| ------------------- | ------- | -------------------------- |
| React               | 19.2.4  | Framework UI               |
| TypeScript          | 5.9.3   | Langage                    |
| Vite                | 8.0.1   | Bundler / Dev server       |
| Tailwind CSS        | 4.2.2   | Styles                     |
| shadcn/ui + Base UI | —       | Composants UI              |
| React Router DOM    | 7.13.1  | Routing                    |
| React Hook Form     | 7.72.0  | Gestion des formulaires    |
| Zod                 | —       | Validation des formulaires |
| Axios               | 1.13.6  | Client HTTP                |
| TipTap              | 3.20.5  | Éditeur de texte riche     |
| Lucide React        | 0.577.0 | Icônes                     |
| Sonner              | 2.0.7   | Notifications toast        |

## Prérequis

- Node.js >= 20.x
- npm >= 10.x
- **CESIZEN-API en cours d'exécution** sur `http://localhost:3000`

## Installation

### 1. Se placer dans le dossier

```bash
cd CESIZEN-FRONT
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Copier le fichier d'exemple :

```bash
cp .env.example .env
```

Éditer `.env` :

```env
VITE_API_URL=http://localhost:3000/api
```

> **Note** : si vous accédez à l'API depuis une autre machine sur le réseau local, remplacez `localhost` par l'adresse IP de la machine hébergeant l'API (ex: `http://192.168.1.10:3000/api`).

### 4. Démarrer le serveur de développement

```bash
npm run dev
```

L'application est accessible sur `http://localhost:5173`.

---

## Scripts disponibles

| Commande          | Description                                            |
| ----------------- | ------------------------------------------------------ |
| `npm run dev`     | Démarre le serveur de développement avec hot reload    |
| `npm run build`   | Compile le projet pour la production (dossier `dist/`) |
| `npm run preview` | Prévisualise le build de production localement         |
| `npm run lint`    | Analyse le code avec ESLint                            |

---

## Structure du projet

```
CESIZEN-FRONT/
├── public/                    # Fichiers statiques
├── src/
│   ├── main.tsx               # Point d'entrée React
│   ├── App.tsx                # Router principal + AuthProvider
│   ├── index.css              # Styles globaux
│   ├── pages/                 # Composants de pages (routes)
│   │   ├── LoginPage.tsx      # Connexion
│   │   ├── HomePage.tsx       # Tableau de bord
│   │   ├── UsersPage.tsx      # Gestion des utilisateurs (admin)
│   │   ├── ContentsPage.tsx   # Gestion articles & catégories (admin)
│   │   └── EmotionsPage.tsx   # Gestion des émotions (admin)
│   ├── components/
│   │   ├── ui/                # Composants shadcn/ui génériques
│   │   ├── layout/            # Composants de mise en page
│   │   ├── contents/          # Composants articles / catégories
│   │   ├── users/             # Composants gestion utilisateurs
│   │   └── emotions/          # Composants gestion émotions
│   ├── contexts/
│   │   └── AuthContext.tsx    # Contexte d'authentification global
│   ├── hooks/
│   │   └── useAuth.ts         # Hook d'accès au contexte auth
│   ├── api/                   # Configuration Axios + appels API
│   ├── lib/                   # Utilitaires et helpers
│   └── schemas/               # Schémas de validation Zod
├── components.json            # Configuration shadcn/ui
├── vite.config.ts             # Configuration Vite
├── tsconfig.json              # Configuration TypeScript
├── eslint.config.js           # Configuration ESLint
├── .env.example               # Modèle de variables d'environnement
└── package.json
```
