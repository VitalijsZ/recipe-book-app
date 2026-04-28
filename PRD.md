# 📄 Product Requirements Document (PRD)

## 🧾 Product Name

**Recipe Book Web Application**

---

## 1. 📌 Overview

The Recipe Book Web Application is a web-based system designed for personal and family use. It allows users to store, manage, and access cooking recipes in a structured and convenient way.

The application supports viewing, searching, filtering, and managing recipes, with different access levels for administrators and guests.

**Goal:**
Provide a simple and efficient way to organize and access recipes.

---

## 2. 👥 Users

### 👤 Admin (Owner + Family)

* Authenticated via login/password
* Full access:

  * Create recipes
  * Edit recipes
  * Delete recipes
  * Mark recipes as favorites
  * View all recipes

### 👁️ Guest

* No authentication required
* Permissions:

  * View recipes
  * Search and filter recipes
* Cannot modify any data

---

## 3. 🎯 Features

### MVP Features

* View list of recipes
* View recipe details
* Search recipes by title
* Filter recipes by categories (multi-select)
* Create recipe (Admin only)
* Edit recipe (Admin only)
* Delete recipe (Admin only)
* Admin authentication (login)
* Mark/unmark recipes as favorites (Admin only, shared across all users)
* Favorites filter (show only favorite recipes)

---

## 4. 🧱 System Architecture

### Frontend

* **Technology:** React
* Responsibilities:

  * UI rendering
  * Managing state (filters, search, auth)
  * Sending API requests

### Backend

* **Technology:** Django + Django REST Framework
* Responsibilities:

  * Business logic
  * API implementation
  * Authentication handling
  * Database interaction

### Database

* **Technology:** PostgreSQL
* Responsibilities:

  * Store recipes, categories, ingredients, steps

### API

* RESTful API for communication between frontend and backend

---

## 5. 🔄 User Flow

### Add Recipe Flow

1. Admin navigates to “Add Recipe” page
2. Fills in recipe form
3. Frontend sends POST request to API
4. Backend validates input
5. Data is saved to database
6. Backend returns success response
7. Frontend updates UI

**Flow:**
Frontend → API → Backend → Database → Backend → Frontend

---

## 6. 🖥️ UI / UX Structure

### Home Page (`/`)

* Sidebar:

  * Search input
  * Category filters (checkboxes)
  * Favorites filter
* Main area:

  * Recipe cards:

    * Title
    * Image
    * Categories
    * Cooking time
    * Difficulty
    * Favorite indicator (⭐)

---

### Recipe Page (`/recipes/{id}`)

* Full recipe details:

  * Title
  * Image
  * Categories
  * Cooking time
  * Difficulty
  * Servings
  * Ingredients (structured list)
  * Steps (ordered list)

* Admin controls:

  * Edit button
  * Delete button

---

### Add / Edit Recipe Page (`/add-recipe`)

* Form fields:

  * Title
  * Description
  * Cooking time
  * Difficulty
  * Servings
  * Categories (multi-select)
  * Image URL

* Dynamic lists:

  * Ingredients (add/remove)
  * Steps (add/remove)

---

### Login Page (`/login`)

* Username
* Password
* Login button

---

## 7. 🗄️ Data Model

### recipes

* id (PK)
* title
* description
* cooking_time
* difficulty
* image_url
* servings
* is_favorite (boolean)
* created_at
* updated_at

---

### categories

* id (PK)
* name

---

### recipe_categories

* recipe_id (FK)
* category_id (FK)

*(Many-to-many relationship)*

---

### ingredients

* id (PK)
* recipe_id (FK)
* name
* unit (required)
* quantity (nullable)

Note:
If unit = "to_taste", quantity can be null.

---

### steps

* id (PK)
* recipe_id (FK)
* step_number
* text

---

## 8. 🔌 API Endpoints

### Recipes

* `GET /api/recipes`

  * Query parameters:
    * `search` (string) — search by title
    * `category_ids` (comma-separated list, e.g. `1,2`)
    * `favorites` (boolean)

  * Category filtering uses OR logic:
    recipes matching at least one selected category are returned

  * Supports search and filtering
* `GET /api/recipes/{id}`
* `POST /api/recipes` 🔒
* `PUT /api/recipes/{id}` 🔒
* `DELETE /api/recipes/{id}` 🔒

---

### Categories

* `GET /api/categories`

---

### Favorites

* `PATCH /api/recipes/{id}/favorite` 🔒
* Request body:
  {
    "is_favorite": true | false
  }

---

### Authentication

* `POST /api/auth/login`

  * Returns authentication token

---

## 9. 🔐 Authentication

* Only Admin users can log in
* Backend returns a token upon successful login
* Token must be included in protected requests via Authorization header.
* Guest users do not authenticate

⚠️ Note:
Authentication is simplified and not intended for production use.

---

## 10. 🛠️ Tech Stack

* Frontend: React
* Backend: Django + Django REST Framework
* Database: PostgreSQL
* API: REST

---

## 11. 🚀 Future Improvements

* Drag & drop for step reordering
* Image upload (instead of URL)
* Multiple admin users
* Comments on recipes
* Advanced filtering
* Mobile optimization

---

## 12. 📏 Ingredient Units (MVP)

Supported units:

* g (grams)
* ml (milliliters)
* pcs (pieces)
* tbsp (tablespoon)
* tsp (teaspoon)
* to_taste (optional quantity)

Rules:

* `name` is required
* `unit` is required
* `quantity` is optional
* If unit = `to_taste`, quantity can be null

---
