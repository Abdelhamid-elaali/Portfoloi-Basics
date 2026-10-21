# Abdelhamid El Aali — Portfolio Personnel

> **Portfolio professionnel, moderne et bilingue (FR / EN)** pour Développeur Web Full Stack (Laravel & React), optimisé pour **GitHub Pages** (hébergement statique, zéro dépendance serveur, zéro étape de build obligatoire).

[![GitHub Pages Deployment](https://img.shields.io/badge/Deployment-GitHub%20Pages-blue?style=flat&logo=github)](https://elaali.space)
[![Performance](https://img.shields.io/badge/Lighthouse-95%2B-success?style=flat&logo=googlechrome)](https://elaali.space)
[![Vanilla JS](https://img.shields.io/badge/Stack-Vanilla%20HTML5%20%7C%20CSS3%20%7C%20ES6+-orange?style=flat)](https://developer.mozilla.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📑 Table des Matières

1. [Aperçu & Philosophie de Conception](#aperçu--philosophie-de-conception)
2. [Structure du Projet](#structure-du-projet)
3. [Installation & Lancement Local](#installation--lancement-local)
4. [Architecture Technique](#architecture-technique)
   - [Système Multi-Langue (FR / EN)](#système-multi-langue-fr--en)
   - [Ajouter une 3ème Langue (ex. Arabe RTL)](#ajouter-une-3ème-langue-ex-arabe-rtl)
   - [Système d'Animation & Accessibilité](#système-danimation--accessibilité)
   - [Formulaire de Contact Statique](#formulaire-de-contact-statique)
5. [Déploiement sur GitHub Pages](#déploiement-sur-github-pages)
   - [Option A : Déploiement Direct via Branche](#option-a--déploiement-direct-via-branche)
   - [Option B : Déploiement Automatisé via GitHub Actions (Recommandé)](#option-b--déploiement-automatisé-via-github-actions-recommandé)
6. [Configuration du Domaine Personnalisé (`elaali.space`)](#configuration-du-domaine-personnalisé-elaalispace)
7. [Checklist Avant Mise en Production](#checklist-avant-mise-en-production)
8. [Résolution des Problèmes Fréquents (Troubleshooting)](#résolution-des-problèmes-fréquents-troubleshooting)

---

## 🎨 Aperçu & Philosophie de Conception

Le portfolio adopte une esthétique **Dark-First épurée** inspirée des standards visuels de Linear, Vercel et Stripe :
- **Palette :** Fond sombre profond (`#080c14` / `#0e1524`), maillage radial atmosphérique et accents en dégradé électrique (*Indigo vibrant* `#6366f1` vers *Cyan lumineux* `#06b6d4`).
- **Typographie :** Display géométrique fluide avec `clamp()` pour les titres, typographie système moderne et lisible pour le corps de texte, et accents monospace pour les jetons techniques.
- **Glassmorphism Sobre :** Cartes translucides avec bordures subtiles (`rgba(255, 255, 255, 0.08)`), flou d'arrière-plan (`backdrop-filter: blur(16px)`) et surbrillance (*spotlight*) dynamique suivant le curseur.
- **Motion Design Responsable :** Transitions fluides sous `cubic-bezier(0.16, 1, 0.3, 1)`, révélations à l'intersection, compteurs statistiques animés et respect strict des préférences `prefers-reduced-motion: reduce`.

---

## 📂 Structure du Projet

```
/
├─ index.html                     # Page principale accessible & optimisée SEO
├─ 404.html                       # Page 404 stylisée bilingue
├─ .nojekyll                      # Désactive le moteur Jekyll de GitHub Pages
├─ CNAME                          # Configuration du domaine personnalisé (elaali.space)
├─ robots.txt                     # Directives pour moteurs de recherche
├─ sitemap.xml                    # Plan du site avec balises hreflang
├─ site.webmanifest               # Manifest PWA (icônes, couleur de thème)
├─ README.md                      # Documentation exhaustive du projet
├─ .github/
│  └─ workflows/
│     └─ deploy.yml               # Workflow GitHub Actions pour Pages
├─ css/
│  ├─ tokens.css                  # Variables CSS (thèmes, espacements, typographie, easings)
│  ├─ base.css                    # Reset moderne, styles de base, utilitaires
│  ├─ components.css              # Boutons, cartes en verre, timeline, badges, modal, toasts
│  ├─ sections.css                # Disposition et styles spécifiques par section
│  └─ animations.css              # Keyframes, règles data-reveal, prefers-reduced-motion
├─ js/
│  ├─ main.js                     # Point d'entrée ES Modules et orchestration
│  ├─ i18n.js                     # Moteur d'internationalisation (FR / EN)
│  ├─ theme.js                    # Gestionnaire Dark / Light theme avec persistance
│  ├─ animations.js               # Révélations, compteurs, tilt 3D, typewriter, curseur
│  ├─ nav.js                      # Navigation collante, scroll-spy, tiroir mobile
│  ├─ projects.js                 # Rendu dynamique depuis projects.json, filtres et modal
│  └─ form.js                     # Validation du formulaire, honeypot & interactions de copie
├─ locales/
│  ├─ fr.json                     # Textes et traductions en français
│  └─ en.json                     # Textes et traductions en anglais
├─ data/
│  └─ projects.json               # Données structurées des projets et études de cas
└─ assets/
   ├─ img/                        # profile.webp, ocp-connect.webp, portail-laattaouia.webp, etc.
   ├─ icons/                      # favicon.svg, favicon.ico, apple-touch-icon.png, icon-192/512.png
   └─ cv/                         # Abdelhamid-El-Aali-CV-FR.pdf, Abdelhamid-El-Aali-CV-EN.pdf
```

---

## 🚀 Installation & Lancement Local

> [!IMPORTANT]
> **Pourquoi `file://` ne fonctionne pas :**
> Le portfolio charge dynamiquement les fichiers de langue (`./locales/*.json`) et les projets (`./data/projects.json`) via l'API standard `fetch()`. Les navigateurs bloquent les requêtes `fetch()` locales sur le protocole `file://` pour des raisons de sécurité (politique CORS). Vous devez donc servir le dossier via un serveur HTTP local.

### Méthode 1 : Avec Node.js (npx)
Dans le dossier du projet, lancez :
```bash
npx serve .
# ou
npx http-server . -p 3000
```
Ouvrez ensuite l'URL indiquée (ex. `http://localhost:3000`).

### Méthode 2 : Avec l'extension VS Code "Live Server"
1. Ouvrez le dossier dans VS Code.
2. Faites un clic droit sur `index.html` → **"Open with Live Server"**.

### Méthode 3 : Avec Python (intégré sans installation supplémentaire)
```bash
# Python 3
python -m http.server 8000
```
Puis ouvrez `http://localhost:8000`.

---

## 🧠 Architecture Technique

### Système Multi-Langue (FR / EN)

Le module `js/i18n.js` assure une gestion de l'internationalisation sans rechargement de page :
1. **Ordre de détection prioritaire :**
   - Paramètre d'URL `?lang=en` ou `?lang=fr`
   - Préférence enregistrée dans `localStorage.getItem('site_lang')`
   - Langue du navigateur (`navigator.language`)
   - Langue par défaut : `fr`
2. **Attributs HTML déclaratifs :**
   - `data-i18n="cle.sousCle"` : injecte le texte traduit dans l'élément.
   - `data-i18n-attr="placeholder:form.email;aria-label:nav.menu"` : met à jour dynamiquement les attributs.
   - `data-i18n-html="cle"` : pour les chaînes contenant du balisage d'emphase.
3. **Mise à jour SEO et documents :**
   - Modifie automatiquement `<html lang="...">`, `<title>`, `<meta name="description">` et les balises Open Graph.
   - Met à jour le bouton de téléchargement du CV pour cibler le fichier correspondant (`Abdelhamid-El-Aali-CV-FR.pdf` ou `Abdelhamid-El-Aali-CV-EN.pdf`).
4. **Zéro saut d'affichage (FOUC) :**
   - Un script inline léger situé dans le `<head>` applique la langue et le thème avant le premier affichage graphique.

### Ajouter une 3ème Langue (ex. Arabe RTL)

L'architecture est modulaire et extensible :
1. Créez le fichier de traduction `locales/ar.json` contenant la même arborescence de clés.
2. Dans `js/i18n.js`, ajoutez `'ar'` au tableau `SUPPORTED_LANGS` :
   ```javascript
   const SUPPORTED_LANGS = ['fr', 'en', 'ar'];
   ```
   Pour gérer le mode RTL (de droite à gauche), ajoutez dans `setLanguage()` :
   ```javascript
   document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
   ```
3. Dans `index.html`, ajoutez le bouton dans le sélecteur :
   ```html
   <button type="button" class="lang-btn" data-lang="ar" aria-pressed="false" lang="ar">عربي</button>
   ```

### Formulaire de Contact Statique

Le formulaire fonctionne sans aucun serveur applicatif backend :
- **Protection Anti-Spam (Honeypot) :** Le champ invisible `name="_gotcha"` bloque les robots automatisés sans perturber les utilisateurs avec des captchas intrusifs.
- **Fournisseur par défaut :** Configurable dans `js/form.js` (`FORM_ENDPOINT = 'https://api.web3forms.com/submit'` ou Formspree).
- **Repli Automatique (Fallback mailto:) :** Si aucune clé d'API n'est configurée, le formulaire déclenche un message pré-rempli via le protocole standard `mailto:abdelhamidelaali@gmail.com`.
- **Cartes de contact interactives :** Un simple clic sur une carte (email, téléphone) copie la valeur dans le presse-papier avec confirmation visuelle par notification *Toast*.

---

## 🌐 Déploiement sur GitHub Pages

Le dépôt distant est configuré sur :
`https://github.com/Abdelhamid-elaali/Portfoloi-Basics.git`

### Initialisation & Premier Commit Git
```bash
git init
git add .
git commit -m "feat: initial release of Abdelhamid El Aali portfolio"
git branch -M main
git remote add origin https://github.com/Abdelhamid-elaali/Portfoloi-Basics.git
git push -u origin main
```

### Option A : Déploiement Direct depuis la Branche (Simple)
1. Rendez-vous sur votre dépôt GitHub : `Settings` → onglet `Pages`.
2. Sous **Build and deployment** :
   - **Source :** Déployer depuis une branche (*Deploy from a branch*)
   - **Branch :** `main` ou `master` / dossier `/(root)`
3. Cliquez sur **Save**. Votre site sera en ligne en 1 à 2 minutes.

### Option B : Déploiement Automatisé via GitHub Actions (Recommandé)
Le fichier `.github/workflows/deploy.yml` est déjà inclus dans ce dépôt.
1. Rendez-vous dans `Settings` → `Pages`.
2. Sous **Build and deployment**, sélectionnez **Source : GitHub Actions**.
3. À chaque `git push` sur `main`, GitHub Pages compile et déploie automatiquement le site.

---

## 🌍 Configuration du Domaine Personnalisé (`elaali.space`)

1. **Fichier CNAME :** Le fichier `CNAME` à la racine contient déjà :
   ```
   elaali.space
   ```
2. **Configuration DNS chez votre bureau d'enregistrement (Registrar) :**
   Ajoutez les enregistrements suivants dans la zone DNS de votre domaine `elaali.space` :
   - **Enregistrements A (pour le domaine racine `@`) :**
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - **Enregistrement CNAME (pour le sous-domaine `www`) :**
     - Hôte : `www`
     - Cible : `Abdelhamid-elaali.github.io`
3. **Validation GitHub Pages :**
   - Dans `Settings` → `Pages` → **Custom domain**, saisissez `elaali.space` et cliquez sur **Save**.
   - Après vérification DNS par GitHub (peut prendre de quelques minutes à quelques heures), cochez la case **Enforce HTTPS**.

---

## ✅ Checklist Avant Mise en Production

- [x] Tous les chemins de fichiers sont **relatifs** (`./css/...`, `./js/...`, `./assets/...`) pour fonctionner aussi bien sous `https://abdelhamid-elaali.github.io/Portfoloi-Basics/` que sous `https://elaali.space/`.
- [x] Fichier `.nojekyll` présent à la racine pour préserver tous les dossiers et formats.
- [x] Balises Open Graph et Twitter Card avec image d'aperçu dédiée (`og-image.jpg` à 1200×630).
- [x] Fichiers `sitemap.xml` et `robots.txt` valides.
- [x] Fichier `site.webmanifest` et icônes PWA générées.
- [x] CVs bilingues accessibles dans `assets/cv/`.
- [x] Code propre : aucun `console.log` de débogage ou secret en dur.
- [x] Accessibilité : balises sémantiques, contrastes WCAG AA, focus visible, navigation clavier, respect de `prefers-reduced-motion`.

---

## 🛠️ Résolution des Problèmes Fréquents (Troubleshooting)

### 1. La page s'affiche sans style (CSS) ou sans fonctionnalités (JS)
- **Cause :** Utilisation de chemins absolus (`/css/base.css`) sur un sous-dossier GitHub Pages (`/Portfoloi-Basics/`).
- **Solution :** Conservez des chemins relatifs avec `./` (`./css/base.css`, `./js/main.js`).

### 2. Les textes ne se chargent pas ou les projets restent vides en local
- **Cause :** Ouverture directe via double-clic (`file:///C:/...`).
- **Solution :** Lancez un serveur local comme expliqué dans [Installation & Lancement Local](#installation--lancement-local) (`npx serve .` ou Live Server).

### 3. Les modifications ne s'affichent pas sur le site en ligne
- **Cause :** Cache agressif du navigateur ou CDN GitHub Pages.
- **Solution :** Effectuez un rechargement forcé (`Ctrl + Shift + R` ou `Cmd + Shift + R`) ou incrémentez la version dans le HTML (`main.js?v=1.0.1`).

### 4. Erreur "DNS check unsuccessful" sur le domaine personnalisé
- **Cause :** La propagation DNS mondiale peut prendre entre 15 minutes et 24 heures selon votre registrar.
- **Solution :** Vérifiez vos enregistrements A avec `nslookup elaali.space` ou `dig elaali.space` et patientez jusqu'à la fin de la propagation.

---

## 👤 Auteur

**Abdelhamid El Aali**  
Développeur Web Full Stack (Laravel & React)  
- 📍 Ben Guerir, Maroc  
- 🌐 [elaali.space](https://elaali.space)  
- 💼 [LinkedIn](https://linkedin.com/in/abdelhamid-el-aali)  
- 🐙 [GitHub](https://github.com/Abdelhamid-elaali)  
- 📧 [abdelhamidelaali@gmail.com](mailto:abdelhamidelaali@gmail.com)
