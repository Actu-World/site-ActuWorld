# 📊 Google Analytics Setup - Guide Rapide

## ✅ Installation (5 minutes)

### **Étape 1 : Créer un compte Google Analytics**

1. Allez sur [Google Analytics](https://analytics.google.com/)
2. **Créez un nouveau compte** (ou utilisez un compte existant)
3. **Créez une nouvelle propriété** :
   - Nom : "ActuWorld"
   - URL : votre domaine (ex: actuworld.com)
4. **Acceptez les termes**

### **Étape 2 : Obtenir votre GA ID**

1. Dans Analytics, allez dans **Admin** → **Property** → **Data Streams**
2. Sélectionnez votre site web
3. Copiez l'ID de suivi (format : `G-XXXXXXXXXX`)

### **Étape 3 : Ajouter au site**

1. **Fichier** : `actuworld-site/.env.local`

```env
VITE_GA_ID=G-1NKQLRNC6C
```

2. **Remplacez** `G-VOTRE_ID_ICI` par votre GA ID réel

### **C'est tout !** 🚀

Le tracking fonctionne automatiquement. Aucun autre code à ajouter.

---

## 📊 Voir les données

1. Ouvrez Google Analytics
2. Attendez 24-48h pour les premières données (c'est normal)
3. **Dashboard** → Voyez :
   - Utilisateurs
   - Sessions
   - Pages populaires
   - Sources de trafic
   - Et bien plus !

---

## 💡 Ce qui est tracké automatiquement

✅ Chaque page visitée  
✅ Durée de visite  
✅ Device (mobile/desktop)  
✅ Localisation (pays)  
✅ Navigateur utilisé  
✅ Source du trafic (Google, Facebook, etc)

---

## 🔧 Intégration technique

Le hook `useGoogleAnalytics` :
- ✅ S'initialise automatiquement au chargement du site
- ✅ Envoie les données à chaque changement de page
- ✅ Respecte la confidentialité (anonymize_ip)
- ✅ Ne ralentit pas le site

**Aucune configuration supplémentaire n'est nécessaire** 🎯

---

## 🌍 Déploiement en production

Une fois testé localement :

### **Sur Vercel**

1. Allez dans **Vercel Dashboard** → Votre projet
2. **Settings** → **Environment Variables**
3. Ajoutez :
   ```
   VITE_GA_ID = G-1NKQLRNC6C
   ```
4. **Re-deploy** (ou attendre les changements auto)

### **Committer le code**

```bash
cd SITE-Actuworld
git add .
git commit -m "feat: add Google Analytics tracking"
git push
```

---

## ✨ Next steps

**Futur : Ajouter des événements personnalisés** ?

Exemple : tracker les clics CTA, les formulaires, les téléchargements

```typescript
// Exemple futur
window.gtag?.('event', 'cta_click', {
  'button_name': 'Download App'
});
```

Je peux ajouter ça si tu veux ! 🎯

---

## 📞 Aide

**Q: Pourquoi pas de données ?**  
R: Analytics prend 24-48h pour afficher les premières stats. C'est normal !

**Q: Confidentialité ?**  
R: Google Analytics respecte le RGPD. IP anonymisée par défaut.

**Q: Alternatives ?**  
R: Plausible, Fathom, Simple Analytics (mais GA gratuit + plus puissant)

