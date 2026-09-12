Technical Design Document (TDD)
A. Tech Stack

Frontend: React (Vite), Tailwind CSS

Backend: Node.js with Express.js

Database: PostgreSQL with Prisma ORM

Authentication: JWT (JSON Web Tokens)


| **Method** | **Endpoint**         | **Description**                                       |
| ---------- | -------------------- | ----------------------------------------------------- |
| POST       | `/api/auth/register` | Register a new user account.                          |
| POST       | `/api/auth/login`    | Authenticate the user and return a JWT token.         |
| GET        | `/api/recipes`       | Retrieve all recipes created by the logged-in user.   |
| POST       | `/api/recipes`       | Add a new recipe.                                     |
| PUT        | `/api/recipes/:id`   | Update an existing recipe.                            |
| DELETE     | `/api/recipes/:id`   | Delete a specific recipe.                             |
| GET        | `/api/categories`    | Retrieve all available recipe categories.             |
| POST       | `/api/mealplan`      | Create or update a weekly meal plan.                  |
| GET        | `/api/mealplan`      | Retrieve the user's weekly meal plan.                 |
| GET        | `/api/shopping-list` | Generate a shopping list from the selected meal plan. |



D. Implementation Strategy

Phase 1 (Database): Set up PostgreSQL and define the Prisma schema for Users, Recipes, and Meal Plans.

Phase 2 (Backend): Develop REST APIs for authentication, recipe management, meal planning, and shopping list generation. Implement JWT authentication to secure user data.

Phase 3 (Frontend): Build user-friendly interfaces for recipe management, category filtering, weekly meal planning, and shopping list generation using React and Tailwind CSS.

Phase 4 (Deployment): Deploy the frontend on Vercel and the backend on Render or Railway, with PostgreSQL hosted on Neon or Supabase.
