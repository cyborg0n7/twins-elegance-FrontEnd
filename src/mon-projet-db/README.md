# Mon Projet DB

Ce projet est une base de données SQL conçue pour gérer un système de commerce électronique. Il comprend des tables pour les clients, les produits, les catégories, les commandes et les éléments de commande, ainsi que des vues pour faciliter l'analyse des données.

## Structure du projet

- **sql/**: Contient tous les fichiers SQL pour la définition du schéma, les migrations, les données initiales et les vues.
  - **schema.sql**: Définit la structure globale de la base de données.
  - **seed.sql**: Contient des instructions SQL pour peupler la base de données avec des données initiales.
  - **migrations/**: Contient des fichiers de migration pour créer les tables nécessaires.
    - `001_create_customers.sql`: Crée la table `customers`.
    - `002_create_products.sql`: Crée la table `products`.
    - `003_create_categories.sql`: Crée la table `categories`.
    - `004_create_orders.sql`: Crée la table `orders`.
    - `005_create_order_items.sql`: Crée la table `order_items`.
    - `006_create_indexes_constraints.sql`: Ajoute des index et des contraintes pour garantir l'intégrité des données.
  - **views/**: Contient des vues pour résumer et analyser les données.
    - `vw_order_summary.sql`: Vue pour résumer les commandes.
    - `vw_customer_orders.sql`: Vue pour lister toutes les commandes par client.

- **docker/**: Contient les fichiers nécessaires pour exécuter la base de données dans un conteneur Docker.
  - `docker-compose.yml`: Définit les services, réseaux et volumes pour le conteneur.

- **tools/**: Contient des scripts pour automatiser les migrations et le peuplement de la base de données.
  - `migrate.sh`: Script pour appliquer les migrations à la base de données.
  - `seed.sh`: Script pour exécuter le fichier de peuplement.

- **examples/**: Contient des exemples de requêtes SQL pour interagir avec la base de données.
  - `sample_queries.sql`: Exemples de requêtes SQL.

- **.gitignore**: Spécifie les fichiers et répertoires à ignorer par Git.

## Installation

1. Clonez le dépôt:
   ```
   git clone <url-du-dépôt>
   cd mon-projet-db
   ```

2. Configurez Docker et exécutez le conteneur:
   ```
   docker-compose up -d
   ```

3. Appliquez les migrations:
   ```
   ./tools/migrate.sh
   ```

4. (Optionnel) Peupler la base de données avec des données initiales:
   ```
   ./tools/seed.sh
   ```

## Utilisation

Après avoir configuré et peuplé la base de données, vous pouvez utiliser les fichiers d'exemple dans le dossier `examples/` pour tester les requêtes SQL et interagir avec les données.

## Contribuer

Les contributions sont les bienvenues! Veuillez soumettre une demande de tirage pour toute amélioration ou correction.