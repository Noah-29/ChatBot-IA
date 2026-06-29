# 🤖 ChatBot-IA : Intégration Backend Sécurisée

 http://noah-vosgien-portfolio.duckdns.org:8080/

## 📌 Présentation du Projet
Ce projet personnel a pour objectif de concevoir, déployer et sécuriser une architecture backend Node.js connectée à l'API Google Gemini (modèles Flash). Conçu pour simuler l'intégration d'un agent conversationnel au sein d'une plateforme e-commerce, ce laboratoire met l'accent sur les problématiques de production réelles : pertinence des réponses, étanchéité de l'infrastructure et sécurité des composants critiques (clés d'API, prompts d'origine et budgets de tokens).

---

## 🔒 Focus Sécurité Backend & SecOps

Pour garantir la robustesse de l'intégration face aux risques courants (ex: fuite de secrets, contournement de logique, déni de service), plusieurs mécanismes de protection ont été mis en œuvre au niveau applicatif et système :

* **Confidentialité des Secrets (Zéro Hardcoding) :** La clé d'API Google Gemini n'est jamais exposée dans le code source. Elle est stockée de manière stricte dans des variables d'environnement (`.env`) lues exclusivement côté serveur et exclues du versioning Git.
* **Étanchéité du System Prompt (Instructions) :** Les consignes de comportement de l'IA (le "Prompt Engineering") sont entièrement encapsulées dans le backend Node.js/Express. Le client (frontend) n'a jamais accès à la logique interne de l'agent, bloquant ainsi l'ingénierie inverse directe.
* **Contrôle et Protection des Ressources (Token Management) :** 
  * Surveillance et limitation stricte du volume de tokens par requête.
  * Mise en place d'un mécanisme de bridage (Rate Limiting) sur le backend Express pour prévenir les attaques de type DoS (Déni de Service) visant à saturer les quotas d'API ou à gonfler artificiellement les coûts de consommation.
* **Sécurisation Périmétrique :** L'application s'appuie sur une politique réseau restrictive (via pare-feu applicatif ou système comme UFW), n'exposant que les flux indispensables au transit des requêtes web légitimes.

---

## 🛠️ Architecture Technique

L'infrastructure applicative est découpée de manière à assurer à la fois modularité et résilience :

* **Backend :** Node.js avec le framework Express pour la gestion des routes API et l'interfaçage avec le SDK officiel Google AI.
* **Modèle LLM :** API Google Gemini (Modèles Flash), choisis pour leur excellent ratio performance/latence en environnement de production.
* **Gestion des Processus :** Utilisation d'un gestionnaire de processus (comme PM2) pour assurer la haute disponibilité de l'API 24h/24, avec redémarrage automatique en cas de défaillance ou de requête malformée.

---

## 🚀 Fonctionnalités Clés
1. **Traitement Asynchrone :** Réception et traitement fluide des requêtes clients.
2. **Contextualisation :** Capacité de l'IA à respecter scrupuleusement un rôle défini à l'avance sans dévier de sa fonction commerciale initiale.
3. **Journalisation (Logging) :** Suivi des interactions pour analyser le comportement de l'agent et détecter d'éventuelles tentatives de *Prompt Injection* (soumissions malveillantes visant à détourner l'IA).
