# EduCI — Apprendre. Progresser. Réussir.
React Native + Expo (SDK 52) + TypeScript + Supabase.

## 1. Supabase
1. Créez un projet sur supabase.com.
2. SQL Editor : exécutez dans l'ordre `supabase/migrations/001_base.sql`, `002_owner_admin.sql`, `003_student_features.sql`.
3. Créez votre compte dans l'app, puis dans le SQL Editor :
   `insert into public.app_owner (user_id) select id from auth.users where email = 'VOTRE_EMAIL';`
   → vous seul avez l'espace administrateur (contrôlé par la RLS).
4. Authentication > Providers > Email : désactivez « Confirm email » pendant les tests si besoin.
5. IA (optionnel) : `supabase functions deploy ai-tutor` puis `supabase secrets set ANTHROPIC_API_KEY=sk-ant-...`
   La clé n'est jamais dans l'application.

## 2. Lancer
```bash
npm install
npx expo install --fix        # aligne les versions avec votre SDK Expo
cp .env.example .env          # renseignez URL + clé anon Supabase
npx expo start                # scannez le QR avec Expo Go, ou touche "a" pour Android
```

## 3. APK de test (Android)
```bash
npm i -g eas-cli && eas login
eas build:configure
eas build -p android --profile preview      # génère un .apk installable
```
Ajoutez vos variables : `eas secret:create --name EXPO_PUBLIC_SUPABASE_URL --value ...` (idem pour ANON_KEY).

## 4. AAB pour Google Play
```bash
eas build -p android --profile production   # génère un .aab
eas submit -p android                       # ou envoi manuel dans Play Console
```
Play Console : créez l'app « EduCI », package `ci.educi.app`, fiche, politique de confidentialité, puis publiez en test interne.

## 5. iOS
Nécessite un compte Apple Developer : `eas build -p ios --profile production` puis `eas submit -p ios` (TestFlight).

## Sécurité
- Rôle propriétaire : table `app_owner` inaccessible au client + fonction `is_owner()` utilisée par toutes les policies.
- Les élèves ne peuvent pas lire les bonnes réponses (colonnes non exposées) : correction via `submit_answer`.
- Premium vérifié en base (`has_premium()`), pas en local.
- HTML des leçons affiché dans une WebView sans JavaScript + CSP stricte.
