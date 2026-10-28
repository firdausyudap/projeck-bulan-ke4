# API Documentation — Pajajaran Digital

Base URL: `/api/v1`

## Authentication

### POST /api/v1/auth/register
Register a new user.
Body: `{ email, password, name }`
Response: `{ success, data: { user, token } }`

### POST /api/v1/auth/login
Login with email and password.
Body: `{ email, password }`
Response: `{ success, data: { user, token } }`

### POST /api/v1/auth/logout
Logout (clears cookie).
Response: `{ success, message }`

### GET /api/v1/auth/me
Get current authenticated user. Requires authentication.
Response: `{ success, data: { user } }`

## Articles

### GET /api/v1/articles
List articles with pagination and search.
Query: `page, limit, search, category, status, tag`
Response: `{ success, data: Article[], meta: { page, limit, total, totalPages } }`

### GET /api/v1/articles/:id
Get article by ID or slug.

### POST /api/v1/articles
Create article (admin only).
Body: `{ title, slug?, excerpt?, content, coverImage?, status?, categoryId?, tagIds? }`

### PATCH /api/v1/articles/:id
Update article (admin only).

### DELETE /api/v1/articles/:id
Delete article (admin only).

## Kings

### GET /api/v1/kings
List kings with pagination and search.
Query: `page, limit, search`

### GET /api/v1/kings/:id
Get king by ID or slug.

### POST /api/v1/kings
Create king (admin only).

### PATCH /api/v1/kings/:id
Update king (admin only).

### DELETE /api/v1/kings/:id
Delete king (admin only).

## Inscriptions

### GET /api/v1/inscriptions
List inscriptions with pagination and search.
Query: `page, limit, search, category`

### GET /api/v1/inscriptions/:id
Get inscription by ID or slug.

### POST /api/v1/inscriptions
Create inscription (admin only).

### PATCH /api/v1/inscriptions/:id
Update inscription (admin only).

### DELETE /api/v1/inscriptions/:id
Delete inscription (admin only).

## Family Relations

### GET /api/v1/family-relations
List family relations.
Query: `page, limit, kingId`

### POST /api/v1/family-relations
Create family relation (admin only).

### PATCH /api/v1/family-relations/:id
Update family relation (admin only).

### DELETE /api/v1/family-relations/:id
Delete family relation (admin only).

## Categories

### GET /api/v1/categories
List all categories.

### GET /api/v1/categories/:id
Get category by ID or slug.

### POST /api/v1/categories
Create category (admin only).

### PATCH /api/v1/categories/:id
Update category (admin only).

### DELETE /api/v1/categories/:id
Delete category (admin only).

## Tags

### GET /api/v1/tags
List all tags.

### POST /api/v1/tags
Create tag (admin only).

### DELETE /api/v1/tags/:id
Delete tag (admin only).

## Media

### GET /api/v1/media
List media with pagination and filter.
Query: `page, limit, type, search`

### GET /api/v1/media/:id
Get media by ID.

### POST /api/v1/media
Create media (admin only).

### PATCH /api/v1/media/:id
Update media (admin only).

### DELETE /api/v1/media/:id
Delete media (admin only).
