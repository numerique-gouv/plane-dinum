
# Documentation Plane Self-Hosted pour la DINUM

## Modifications Apportées
### Version Forkée
- Version utilisée : `0.13.2`

Documentation officiel : https://docs.plane.so/self-hosting

***tl;dr : il y a 4 .env, faites les modifications nécéssaires***

### Configuration de Stockage OVH S3
- Remplacement de MinIO par OVH S3 dans les fichiers .env
- `AWS_S3_ENDPOINT_URL` configuré comme `"https://ovhs3url"` (sans `/` à la fin).

### Changements dans la Configuration
- Désactivation de MinIO : `USE_MINIO=0`.
- Dans `apiserver/plane/settings/production.py` :
  ```python
  AWS_S3_ADDRESSING_STYLE = "virtual"
  AWS_S3_BUCKET_AUTH = True
  AWS_S3_MAX_AGE_SECONDS = 604800 # 1 semaine
  ```

### Modifications du fichier nginx
- Dans `nginx/nginx.conf.template` :
  ```nginx
  location /${BUCKET_NAME}/ {
      proxy_pass https://ovhse3url/bucketname/;
  }
  ```

### Modifications dans les Modèles de Base de Données
- Dans `apiserver/plane/db/models/user.py` :
  ```python
  avatar = models.TextField(max_length=800, blank=True)
  ```
- Dans `apiserver/plane/db/models/workspace.py` :
  ```python
  logo = models.URLField(verbose_name="Logo", blank=True, null=True, max_length=800)
  ```

### Configuration Web
- Dans `web/next.config.js`, ajout de l'URL OVH S3 autorisée :
  ```javascript
  "ovhs3url",
  ```
  
- Dans `web/.env` ajouter NEXT_PUBLIC_API_URL et modifier l'URL par celle que vous utilisez.
  ```shell
  NEXT_PUBLIC_DEPLOY_URL="https://urlduprojet/spaces"
  NEXT_PUBLIC_API_BASE_URL="https://urlduprojet"
  ```

### Lancement de l'application : 

  ```docker compose -f docker-compose.yml up```

### Attention pour les Utilisateurs Windows
- Assurez-vous que les fichiers soient au format Linux pour éviter les problèmes lors de la création des images.

### Mise à jour à venir : 
- Création d'un helm chart pour le deploiement sous kubernetes.
