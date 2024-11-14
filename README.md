<br>
<p align="center">
  <a href="https://rudi.rennesmetropole.fr/">
  <img src="https://blog.rudi.bzh/wp-content/uploads/2020/11/logo_bleu_orange.svg" width=100px alt="Rudi logo" />  </a>
</p>

<h2 align="center" >RUDI Node Catalog</h3>
<p align="center">Interface RESTful permettant d'accéder aux métadonnées des ressources exposées publiquement sur le nœud producteur de RUDI</p>

<p align="center"><a href="https://rudi.rennesmetropole.fr/">🌐 Instance de Rennes Métropole</a> · <a href="doc.rudi.bzh">📚 Documentation</a> ·  <a href="https://blog.rudi.bzh/">📰 Blog</a><p>

## 🎯 Fonctionnalités

- API publique pour la consultation des métadonnées open-data
- API interne pour la gestion complète des métadonnées (CRUD)
- Compatibilité avec [la spécification RUDI](https://app.swaggerhub.com/apis/OlivierMartineau/RUDI-PRODUCER)

## 🚀 Environnements

- **release** : environnement de pré-production compatible avec le portail Rennes Métropole
- **shared** : environnement de développement pour tests d'intégration
- **test** : environnement de test pour déploiement distant

## 🛣 Routes API

### Redirections
```
GET /api              → GET /api/v1/resources
GET /api/v1           → GET /api/v1/resources
GET /resources        → GET /api/v1/resources
GET /resources/*      → GET /api/v1/resources/*
```

### Sans authentification requise
- `GET /api/version`
- `GET /api/admin/hash`
- `GET /api/admin/apphash`
- `GET /api/admin/env`
- `GET /api/v1/resources`
- `GET /api/v1/resources/:id`

### Authentification portail requise
- `PUT /api/v1/resources/*`
- `PUT /api/v1/resources/:id/report`
- `GET /api/v1/resources/:id/report`
- `GET /api/v1/resources/:id/report/:irid`

### Authentification RUDI prod requise

#### Gestion des objets
- `POST /api/admin/:object`
- `PUT /api/admin/:object`
- `GET /api/admin/:object`
- `GET /api/admin/:object/:id`
- `DELETE /api/admin/:object/:id`
- `DELETE /api/admin/:object`

#### Gestion des rapports
- `POST /api/admin/:object/:id/reports`
- `PUT /api/admin/:object/:id/reports`
- `GET /api/admin/:object/:id/reports`
- `GET /api/admin/:object/reports`
- `DELETE /api/admin/:object/:id/reports`

#### Actions système
- `GET /api/admin/nv`
- `GET /api/admin/enum`
- `GET /api/admin/licences`
- `GET /api/admin/id_generation`
- `GET /api/admin/logs`
- `GET /api/admin/db`

#### Vérifications
- `GET /api/admin/check/node/url`
- `GET /api/admin/check/portal/url`
- `GET /api/admin/check/portal/resources`
- `GET /api/admin/check/portal/ids`

## ⚙️ Configuration

### Fichiers de configuration
```ini
# 0-ini/conf_default.ini : Configuration par défaut
# 0-ini/conf_custom.ini : Configuration personnalisée
```

### Sécurité
```ini
[security]
should_control_private_requests = true
profiles = chemin/vers/profiles.ini
```

## 🔒 Authentification JWT

### En-têtes requis
- `alg` : Algorithme JWT (EdDSA recommandé)

### Payload requis
- `exp` : Date d'expiration (epoch)
- `sub` : Profil reconnu
- `req_mtd` : Méthode HTTP
- `req_url` : URL de la requête

### Payload optionnels
- `jti` : Identifiant unique du token (UUID v4)
- `iat` : Date de génération du token (epoch)
- `client_id` : Identifiant de l'utilisateur

### Exemple d'utilisation cURL
```bash
# Création du token
JWT=`curl -X POST --user $USR:$PWD \
  -H 'Content-Type: application/json' \
  -d "{
    \"exp\":$DATE,
    \"sub\":\"$SUB\",
    \"req_mtd\":\"$MTD\",
    \"req_url\":\"$URL\",
    \"client_id\":\"$CID\"
  }" \
  $NODE/crypto/jwt/forge`

# Vérification du token
curl -X POST --user $USR:$PWD \
  -H 'Content-Type: application/json' \
  -d "\"$JWT\"" \
  $NODE/crypto/jwt/check

# Envoi de la requête
curl -X $MTD -H "Authorization: Bearer $JWT" ${NODE}${URL}
```

## 📁 Processus de validation

### Fichiers média
1. Upload vers le module Media
2. Statut mis à jour selon le résultat
   - `available_formats[i].file_storage_status` → `available`
   - Mise à jour de `available_formats[i].file_status_update`
3. Vérification périodique de disponibilité

### Métadonnées
1. Envoi au portail si tous les médias sont disponibles
2. Statut `pending` si succès
3. Statut `unavailable` si échec

## 🧪 Tests

Les fichiers de test sont disponibles dans `tests/`:
- Environnements Postman (`tests/env-rudi-*.postman_environment.json`)
- Documentation détaillée dans `tests/Tests_documentation.md`
- Pour les tests, remplacer `cryptoJwtUrl` par l'adresse valide du module client/crypto

## 👥 Contact

Pour toute question : community@rudi-univ-rennes1.fr

## 📚 Documentation

- [API Publique](https://app.swaggerhub.com/apis/OlivierMartineau/RUDI-PRODUCER/)
- [API Interne](https://app.swaggerhub.com/apis/OlivierMartineau/RudiProducer-InternalAPI)

## Contribuer à Rudi

Nous accueillons et encourageons les contributions de la communauté. Voici comment vous pouvez participer :
- 🛣️ [Feuille de route](https://github.com/orgs/rudi-platform/projects/2)
- 🐞 [Signaler un bug du portail](https://github.com/rudi-platform/rudi-node-catalog/issues)
- ✨ [Contribuer](https://github.com/rudi-platform/.github/blob/main/CONTRIBUTING.md)
- 🗣️ [Participer aux discussions](https://github.com/orgs/rudi-platform/discussions)
