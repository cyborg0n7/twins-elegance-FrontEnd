# Backend Laravel sécurisé pour Twin's Elegance

Ce document explique comment mettre en place une API Laravel (PHP) sécurisée pour votre boutique et la connecter au frontend React.

## 1) Prérequis
- PHP 8.2+
- Composer 2+
- MySQL/MariaDB (ou PostgreSQL)
- Node.js (déjà présent pour le frontend)
- Optionnel: Docker + Docker Compose

## 2) Création du projet Laravel
```bash
composer create-project laravel/laravel twins-elegance-api
cd twins-elegance-api
```

## 3) Configuration de l'environnement
Dupliquez `.env` en `.env.local` (ou modifiez `.env`) et configurez la base de données:
```
APP_NAME="Twins Elegance API"
APP_URL=http://localhost:8000
SESSION_DRIVER=cookie
SESSION_DOMAIN=localhost

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=twins_elegance
DB_USERNAME=your_user
DB_PASSWORD=your_password
```

Installez et configurez Sanctum pour l'authentification:
```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\\Sanctum\\SanctumServiceProvider"
php artisan migrate
```
Dans `app/Http/Kernel.php`, ajoutez `\Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class`.

Activez CORS (par exemple `fruitcake/laravel-cors`) si nécessaire pour autoriser l'origine du frontend (`http://localhost:5173`).

## 4) Migrations basiques
Créez des tables pour produits, clients, commandes:
```bash
php artisan make:migration create_products_table
php artisan make:migration create_customers_table
php artisan make:migration create_orders_table
php artisan make:migration create_order_items_table
```
Exemples de colonnes:
- products: id, name, description, price, category, image_url, in_stock, timestamps
- customers: id, first_name, last_name, email (unique), phone, address, city, zip_code, timestamps
- orders: id, customer_id, total_amount, created_at, updated_at
- order_items: id, order_id, product_id, quantity, unit_price

Puis:
```bash
php artisan migrate
```

## 5) Modèles et relations
- `Product` (hasMany `OrderItem`)
- `Customer` (hasMany `Order`)
- `Order` (belongsTo `Customer`, hasMany `OrderItem`)
- `OrderItem` (belongsTo `Order`, belongsTo `Product`)

## 6) Routes API
Dans `routes/api.php`:
```php
use App\Http\Controllers\Api\\ProductController;
use App\Http\Controllers\Api\\OrderController;
use App\Http\Controllers\Api\\AdminAuthController;

Route::post('/admin/login', [AdminAuthController::class, 'login']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

Route::post('/orders', [OrderController::class, 'store']);

// Routes protégées admin (ex: via Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/admin/orders', [OrderController::class, 'index']);
    Route::get('/admin/customers', [OrderController::class, 'customers']);
});
```

## 7) Contrôleurs (exemples)
- `ProductController@index`: retourne la liste des produits (pagination)
- `ProductController@show`: details produit
- `OrderController@store`: valide la commande (validation Laravel), crée client si nouveau, crée la commande + items, retourne l'ID
- `OrderController@index`: liste des commandes (admin)
- `OrderController@customers`: liste des clients (admin)
- `AdminAuthController@login`: vérifie les identifiants admin et crée un token Sanctum

## 8) Lancer l'API
```bash
php artisan serve --host=127.0.0.1 --port=8000
```

## 9) Connecter le frontend
Dans le frontend React (ce projet), créez un fichier `.env` à la racine:
```
VITE_API_BASE_URL=http://127.0.0.1:8000
```
Puis redémarrez `npm run dev`.

Le checkout tentera d'appeler `POST /api/orders`. Si l'API est indisponible, un fallback local (localStorage) est utilisé.

### Accès administrateur
- Lancez `php artisan db:seed` pour créer un compte admin sécurisé.
- Les identifiants générés sont affichés dans la console et stockés dans
  `storage/app/admin_credentials.txt`.
- Vous pouvez personnaliser l'email / le nom via les variables `.env` :
  ```
  ADMIN_EMAIL=votre-email@domaine.com
  ADMIN_NAME="Nom affiché"
  ```
- Pour régénérer un mot de passe : `php artisan db:seed --class=AdminSeeder`

## 10) Sécurité (recommandations)
- Utilisez Sanctum pour les endpoints admin
- Validez toutes les requêtes (Form Requests)
- Activez CORS précisément (origin, headers, methods)
- Chiffrez les mots de passe avec Bcrypt/Argon
- Limitez les logs de données sensibles
- Ajoutez un audit des actions admin

---
Besoin que je génère les migrations, modèles et contrôleurs d’exemple ? Dites-moi et je vous fournis les fichiers prêts à coller.


