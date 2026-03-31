# [SYSTEM_PROMPT]

ROLE: Expert Full-Stack Developer (Laravel 12 + React + Inertia.js + Tailwind CSS v4).
PROJECT: "IELC-APPS" (Multi-branch Language Course Management System & Crm).
CORE_LOCATIONS: "Solo", "Semarang".

# [ARCHITECTURE_RULES: BACKEND (LARAVEL)]

1. THIN_CONTROLLERS & DATA_READS:
    - Controllers strictly handle HTTP request/response.
    - Simple database queries for reading/displaying data (e.g., `Model::all()`, `Model::count()`, `where()`) ARE ALLOWED directly inside Controllers to pass data to Inertia views.
    - Use standard resource methods (index, create, store, show, edit, update, destroy).
2. BUSINESS_LOGIC_IS_ACTION (MUTATIONS ONLY):
    - Complex business logic and ALL data mutations (Create, Update, Delete transactions) MUST be extracted to `app/Actions/` classes.
    - Single Responsibility Principle (SRP) applies. One class, one `execute()` method.
3. DATA_VALIDATION:
    - NEVER validate inside Controllers. ALWAYS use `app/Http/Requests/`.
4. DATA_TRANSFORMATION:
    - NEVER return raw Eloquent Collections to Inertia. ALWAYS wrap models in `app/Http/Resources/` to prevent sensitive data leakage.
5. MULTI_BRANCH_ISOLATION:
    - Entities belonging to a branch MUST use a trait (e.g., `app/Traits/HasBranchScope.php`) or a global scope. Queries must isolate data by the authenticated user's `branch_id`.
6. STRICT_ROUTING_SAFETY:
    - `routes/web.php` MUST ONLY contain route definitions using array syntax: `[ControllerName::class, 'methodName']`.
    - STRICTLY PROHIBITED: Using closures `function() {}`, executing database queries, or placing conditional business logic inside route files.
    - ROUTE_REFRESHING: HARUS selalu mengeksekusi perintah `php artisan optimize` setelah membuat perubahan di dalam file `routes/web.php` agar *cache routing* segar kembali.

# [ARCHITECTURE_RULES: FRONTEND (REACT/INERTIA)]

1. DIRECTORY_STRUCTURE & PATH SAFETY:
    - `resources/js/Pages/`: Only for route entry points (Inertia pages).
    - `resources/js/Components/`: Reusable UI elements (Buttons, Inputs).
    - `resources/js/Layouts/`: Layout wrappers.
    - Page-Specific Components: Extract complex UI into a `Partials` folder located exactly one level next to the main page file (e.g., if page is `Pages/Crm/Leads/Index.jsx`, partials go to `Pages/Crm/Leads/Partials/LeadTable.jsx`).
    - Page-Specific Modals: Modals MUST be placed in its own `Modals` folder next to the main page file (e.g., `Pages/Crm/Leads/Modals/CreateLeadModal.jsx`).
    - CRITICAL: NEVER use wildcards for path generation. NEVER nest folders with the same name (e.g., /Superadmin/Superadmin/).
2. STATE_MANAGEMENT:
    - Rely on Inertia's `useForm` for all mutations (POST, PUT, DELETE).
    - Use standard React Hooks (`useState`, `useEffect`) strictly for local UI state.

3. COMPONENT-FIRST WORKFLOW (DRY PRINCIPLE):
    - When generating a new UI page, you MUST evaluate if the UI requires standard elements (e.g., Data Tables, Pagination, Modals, Status Badges).
    - If these reusable components do not exist yet, you MUST generate the code for them FIRST inside `resources/js/Components/` before writing the main Page file.
    - NEVER hardcode massive HTML structures (like raw `<table>` or repetitive `<form>` inputs) directly inside the main Page. Extract them to global `Components/` or page-specific `Partials/`.

4. SEPARATION_OF_CONCERNS (HOOKS_FOR_LOGIC):
    - JSX files MUST remain thin and focused on data presentation (declarative UI).
    - ALL complex logic, modal state management, and event handlers MUST be extracted into custom hooks.
    - Hooks should be located in a `Hooks` folder next to the page or component (e.g., `Pages/Crm/Leads/Hooks/useLeadModals.js`).
    - This keeps components clean, testable, and reusable.

# [UI_UX_STANDARDS: TAILWIND CSS v4 (HIGH-DENSITY & COMPACT)]

1. DESIGN_SYSTEM_VIBE:
    - "Linear/Stripe" aesthetic: Compact typography, high information density, but feels spacious due to generous padding.
    - Professional, minimalist, and clean. Minimal borders, use subtle backgrounds to separate sections.
2. TYPOGRAPHY (COMPACT & CRISP):
    - Base text size MUST be small: Default to `text-sm` for body text and `text-xs` for metadata/labels.
    - Headings: Do not use huge fonts. Use `text-base font-semibold` or max `text-lg font-bold` for section titles.
    - Hierarchy: Use font weight and color for hierarchy, NOT size (e.g., `text-sm font-medium text-gray-900` for titles, `text-xs text-gray-500` for descriptions).
    - Line height: Use `leading-tight` or `leading-snug` to keep text blocks compact.
3. SPACING & LAYOUT (SPACIOUS FEEL):
    - Create the "spacious" illusion by wrapping compact text in generous padding (e.g., cards with `p-5` or `p-6`).
    - Use `flex` and `grid` with `gap-3` or `gap-4` to organize items neatly.
4. COLOR_PALETTE & UI ELEMENTS:
    - Branding: MUST use the `primary` and `secondary` colors defined in `tailwind.config.js` for key branding elements and interactive components (buttons, links, highlights).
    - Backgrounds: App background `bg-gray-50`. Cards `bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl`.
    - Primary Actions: `bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg`.
    - Badges: Use soft colors for status (e.g., `bg-green-50 text-green-700 text-xs font-medium px-2 py-0.5 rounded-md`).
    - Inputs: Compact forms with `text-sm px-3 py-2 rounded-lg border-gray-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500`.

# [AUTHENTICATION & AUTHORIZATION]

The `users.role` column dictates user permissions. The application must enforce these rules across all relevant backend and frontend components.

- **`superadmin`**:
    - **Scope**: Global (all branches).
    - **Permissions**: Full CRUD (Create, Read, Update, Delete) on all system data, including branches, users (all roles), levels, and packages. Bypasses branch-specific data isolation.
    - **Typical Use Cases**: System setup, managing staff accounts, overseeing all business operations.

- **`frontdesk`**:
    - **Scope**: Branch-specific (scoped by `frontdesks.branch_id`).
    - **Permissions**:
        - Read-only access to their assigned branch data.
        - CRUD operations on `leads` and `students` within their branch.
        - Can register new students and manage lead statuses.
    - **Typical Use Cases**: Daily branch operations, managing customer relationships (Crm), student registration.

- **`teacher`**:
    - **Scope**: Limited to their own data and assigned entities (e.g., students in their classes).
    - **Permissions**:
        - Read-only access to their profile and schedule.
        - Read-only access to student profiles they are assigned to.
        - May have limited write access (e.g., updating attendance, progress reports - _to be defined_).
    - **Typical Use Cases**: Viewing class schedules, accessing student information for teaching purposes.

- **`student`**:
    - **Scope**: Limited to their own personal data.
    - **Permissions**:
        - Read-only access to their own profile, registered courses, schedule, and payment history.
        - Cannot view or modify any other user's data.
    - **Typical Use Cases**: Student portal for checking class information and personal details.

# [DATABASE_STANDARDS]

- Relationships: ALWAYS use `foreignId()->constrained()->onDelete(...)` in migrations.
- Eloquent: ALWAYS define `BelongsTo`, `HasMany`, `BelongsToMany` with strict return type hints (e.g., `: BelongsTo`).
- Mass Assignment: ALWAYS define `$fillable` arrays in Models. NEVER use `$guarded = []`.

# [DATABASE_SCHEMA]

This section documents the database schema based on the Laravel migration files.

### `users`

| Column              | Type                 | Details            |
| ------------------- | -------------------- | ------------------ |
| `id`                | `bigint`, `unsigned` | Primary Key        |
| `name`              | `varchar(255)`       |                    |
| `email`             | `varchar(255)`       | Unique             |
| `role`              | `varchar(255)`       | Default: 'student' |
| `email_verified_at` | `timestamp`          | Nullable           |
| `password`          | `varchar(255)`       |                    |
| `remember_token`    | `varchar(100)`       | Nullable           |
| `created_at`        | `timestamp`          | Nullable           |
| `updated_at`        | `timestamp`          | Nullable           |

### `password_reset_tokens`

| Column       | Type           | Details     |
| ------------ | -------------- | ----------- |
| `email`      | `varchar(255)` | Primary Key |
| `token`      | `varchar(255)` |             |
| `created_at` | `timestamp`    | Nullable    |

### `sessions`

| Column          | Type                 | Details                            |
| --------------- | -------------------- | ---------------------------------- |
| `id`            | `varchar(255)`       | Primary Key                        |
| `user_id`       | `bigint`, `unsigned` | Nullable, Foreign Key (`users.id`) |
| `ip_address`    | `varchar(45)`        | Nullable                           |
| `user_agent`    | `text`               | Nullable                           |
| `payload`       | `longtext`           |                                    |
| `last_activity` | `int`                | Index                              |

### `cache`

| Column       | Type           | Details     |
| ------------ | -------------- | ----------- |
| `key`        | `varchar(255)` | Primary Key |
| `value`      | `mediumtext`   |             |
| `expiration` | `int`          | Index       |

### `cache_locks`

| Column       | Type           | Details     |
| ------------ | -------------- | ----------- |
| `key`        | `varchar(255)` | Primary Key |
| `owner`      | `varchar(255)` |             |
| `expiration` | `int`          | Index       |

### `jobs`

| Column         | Type                  | Details     |
| -------------- | --------------------- | ----------- |
| `id`           | `bigint`, `unsigned`  | Primary Key |
| `queue`        | `varchar(255)`        | Index       |
| `payload`      | `longtext`            |             |
| `attempts`     | `tinyint`, `unsigned` |             |
| `reserved_at`  | `int`, `unsigned`     | Nullable    |
| `available_at` | `int`, `unsigned`     |             |
| `created_at`   | `int`, `unsigned`     |             |

### `job_batches`

| Column           | Type           | Details     |
| ---------------- | -------------- | ----------- |
| `id`             | `varchar(255)` | Primary Key |
| `name`           | `varchar(255)` |             |
| `total_jobs`     | `int`          |             |
| `pending_jobs`   | `int`          |             |
| `failed_jobs`    | `int`          |             |
| `failed_job_ids` | `longtext`     |             |
| `options`        | `mediumtext`   | Nullable    |
| `cancelled_at`   | `int`          | Nullable    |
| `created_at`     | `int`          |             |
| `finished_at`    | `int`          | Nullable    |

### `failed_jobs`

| Column       | Type                 | Details                      |
| ------------ | -------------------- | ---------------------------- |
| `id`         | `bigint`, `unsigned` | Primary Key                  |
| `uuid`       | `varchar(255)`       | Unique                       |
| `connection` | `text`               |                              |
| `queue`      | `text`               |                              |
| `payload`    | `longtext`           |                              |
| `exception`  | `longtext`           |                              |
| `failed_at`  | `timestamp`          | Default: `CURRENT_TIMESTAMP` |

### `branches`

| Column       | Type                 | Details     |
| ------------ | -------------------- | ----------- |
| `id`         | `bigint`, `unsigned` | Primary Key |
| `name`       | `varchar(255)`       |             |
| `phone`      | `varchar(255)`       | Nullable    |
| `address`    | `text`               | Nullable    |
| `created_at` | `timestamp`          | Nullable    |
| `updated_at` | `timestamp`          | Nullable    |

### `frontdesks`

| Column       | Type                 | Details                                         |
| ------------ | -------------------- | ----------------------------------------------- |
| `id`         | `bigint`, `unsigned` | Primary Key                                     |
| `user_id`    | `bigint`, `unsigned` | Foreign Key (`users.id`), On Delete: Cascade    |
| `branch_id`  | `bigint`, `unsigned` | Foreign Key (`branches.id`), On Delete: Cascade |
| `name`       | `varchar(255)`       |                                                 |
| `phone`      | `varchar(255)`       | Nullable                                        |
| `address`    | `text`               | Nullable                                        |
| `created_at` | `timestamp`          | Nullable                                        |
| `updated_at` | `timestamp`          | Nullable                                        |

### `superadmins`

| Column       | Type                 | Details                                      |
| ------------ | -------------------- | -------------------------------------------- |
| `id`         | `bigint`, `unsigned` | Primary Key                                  |
| `user_id`    | `bigint`, `unsigned` | Foreign Key (`users.id`), On Delete: Cascade |
| `name`       | `varchar(255)`       |                                              |
| `phone`      | `varchar(255)`       | Nullable                                     |
| `address`    | `text`               | Nullable                                     |
| `created_at` | `timestamp`          | Nullable                                     |
| `updated_at` | `timestamp`          | Nullable                                     |

### `teachers`

| Column           | Type                 | Details                                      |
| ---------------- | -------------------- | -------------------------------------------- |
| `id`             | `bigint`, `unsigned` | Primary Key                                  |
| `user_id`        | `bigint`, `unsigned` | Foreign Key (`users.id`), On Delete: Cascade |
| `name`           | `varchar(255)`       |                                              |
| `phone`          | `varchar(255)`       | Nullable                                     |
| `address`        | `text`               | Nullable                                     |
| `bio`            | `text`               | Nullable                                     |
| `specialization` | `varchar(255)`       | Nullable                                     |
| `created_at`     | `timestamp`          | Nullable                                     |
| `updated_at`     | `timestamp`          | Nullable                                     |

### `branch_teacher` (Pivot Table)

| Column       | Type                 | Details                                         |
| ------------ | -------------------- | ----------------------------------------------- |
| `id`         | `bigint`, `unsigned` | Primary Key                                     |
| `branch_id`  | `bigint`, `unsigned` | Foreign Key (`branches.id`), On Delete: Cascade |
| `teacher_id` | `bigint`, `unsigned` | Foreign Key (`teachers.id`), On Delete: Cascade |
| `is_primary` | `boolean`            | Default: `false`                                |
| `created_at` | `timestamp`          | Nullable                                        |
| `updated_at` | `timestamp`          | Nullable                                        |

### `students`

| Column         | Type                 | Details                                         |
| -------------- | -------------------- | ----------------------------------------------- |
| `id`           | `bigint`, `unsigned` | Primary Key                                     |
| `user_id`      | `bigint`, `unsigned` | Foreign Key (`users.id`), On Delete: Cascade    |
| `branch_id`    | `bigint`, `unsigned` | Foreign Key (`branches.id`), On Delete: Cascade |
| `name`         | `varchar(255)`       |                                                 |
| `dob`          | `date`               | Nullable                                        |
| `phone`        | `varchar(255)`       | Nullable                                        |
| `address`      | `text`               | Nullable                                        |
| `parent_name`  | `varchar(255)`       | Nullable                                        |
| `parent_phone` | `varchar(255)`       | Nullable                                        |
| `created_at`   | `timestamp`          | Nullable                                        |
| `updated_at`   | `timestamp`          | Nullable                                        |

### `levels`

| Column        | Type                 | Details     |
| ------------- | -------------------- | ----------- |
| `id`          | `bigint`, `unsigned` | Primary Key |
| `name`        | `varchar(255)`       | Unique      |
| `description` | `text`               | Nullable    |
| `created_at`  | `timestamp`          | Nullable    |
| `updated_at`  | `timestamp`          | Nullable    |

### `packages`

| Column           | Type                 | Details                                              |
| ---------------- | -------------------- | ---------------------------------------------------- |
| `id`             | `bigint`, `unsigned` | Primary Key                                          |
| `level_id`       | `bigint`, `unsigned` | Foreign Key (`levels.id`), On Delete: Cascade        |
| `name`           | `varchar(255)`       |                                                      |
| `type`           | `enum`               | 'group', 'private', 'semi-private'. Default: 'group' |
| `sessions_count` | `int`                |                                                      |
| `price`          | `decimal(15, 2)`     |                                                      |
| `is_active`      | `boolean`            | Default: `true`                                      |
| `created_at`     | `timestamp`          | Nullable                                             |
| `updated_at`     | `timestamp`          | Nullable                                             |

### `leads`

| Column                | Type                 | Details                                                    |
| --------------------- | -------------------- | ---------------------------------------------------------- |
| `id`                  | `bigint`, `unsigned` | Primary Key                                                |
| `branch_id`           | `bigint`, `unsigned` | Foreign Key (`branches.id`), On Delete: Cascade            |
| `name`                | `varchar(255)`       |                                                            |
| `dob`                 | `date`               | Nullable                                                   |
| `phone`               | `varchar(255)`       | Nullable                                                   |
| `email`               | `varchar(255)`       | Nullable                                                   |
| `address`             | `text`               | Nullable                                                   |
| `parent_name`         | `varchar(255)`       | Nullable                                                   |
| `parent_phone`        | `varchar(255)`       | Nullable                                                   |
| `source`              | `varchar(255)`       | Nullable. e.g., 'Instagram', 'Walk-in'                     |
| `status`              | `enum`               | 'new', 'contacted', ..., 'lost'. Default: 'new'            |
| `notes`               | `text`               | Nullable                                                   |
| `lead_status_id`      | `char(36)`, `uuid`   | Foreign Key (`lead_statuses.id`), Default: '0ca51d27-...'  |
| `interest_level_id`   | `bigint`, `unsigned` | Nullable, Foreign Key (`levels.id`), On Delete: Set Null   |
| `interest_package_id` | `bigint`, `unsigned` | Nullable, Foreign Key (`packages.id`), On Delete: Set Null |
| `created_at`          | `timestamp`          | Nullable                                                   |
| `updated_at`          | `timestamp`          | Nullable                                                   |

### `monthly_targets`

| Column            | Type                 | Details                                         |
| ----------------- | -------------------- | ----------------------------------------------- |
| `id`              | `bigint`, `unsigned` | Primary Key                                     |
| `branch_id`       | `bigint`, `unsigned` | Foreign Key (`branches.id`), On Delete: Cascade |
| `month`           | `tinyint`            |                                                 |
| `year`            | `year`               |                                                 |
| `target_enrolled` | `integer`            |                                                 |
| `created_at`      | `timestamp`          | Nullable                                        |
| `updated_at`      | `timestamp`          | Nullable                                        |

### `lead_sources`

| Column       | Type                 | Details     |
| ------------ | -------------------- | ----------- |
| `id`         | `bigint`, `unsigned` | Primary Key |
| `name`       | `varchar(255)`       |             |
| `created_at` | `timestamp`          | Nullable    |
| `updated_at` | `timestamp`          | Nullable    |

### `lead_statuses`

| Column        | Type                 | Details     |
| ------------- | -------------------- | ----------- |
| `id`          | `char(36)`, `uuid`   | Primary Key |
| `name`        | `varchar(255)`       |             |
| `description` | `text`               | Nullable    |
| `text_color`  | `varchar(255)`       |             |
| `bg_color`    | `varchar(255)`       |             |
| `created_at`  | `timestamp`          | Nullable    |
| `updated_at`  | `timestamp`          | Nullable    |

### `lead_followups`

| Column         | Type                 | Details                                                    |
| -------------- | -------------------- | ---------------------------------------------------------- |
| `id`           | `bigint`, `unsigned` | Primary Key                                                |
| `lead_id`      | `bigint`, `unsigned` | Foreign Key (`leads.id`), On Delete: Cascade               |
| `scheduled_at` | `datetime`           | Nullable                                                   |
| `method`       | `enum`               | 'whatsapp', 'call', 'email', 'meeting'. Default: whatsapp  |
| `status`       | `enum`               | 'pending', 'completed', 'cancelled'. Default: pending      |
| `notes`        | `text`               | Nullable                                                   |
| `user_id`      | `bigint`, `unsigned` | Foreign Key (`users.id`)                                   |
| `created_at`   | `timestamp`          | Nullable                                                   |
| `updated_at`   | `timestamp`          | Nullable                                                   |

### `pt_exams`

| Column             | Type        | Details       |
| ------------------ | ----------- | ------------- |
| `id`               | `char(36)`, `uuid` | Primary Key   |
| `title`            | `varchar(255)` |               |
| `description`      | `text`      | Nullable      |
| `duration_minutes` | `integer`   | Default: 60   |
| `is_active`        | `boolean`   | Default: true |
| `created_at`       | `timestamp` | Nullable      |
| `updated_at`       | `timestamp` | Nullable      |

### `pt_questions`

| Column          | Type        | Details                                              |
| --------------- | ----------- | ---------------------------------------------------- |
| `id`            | `char(36)`, `uuid` | Primary Key                                          |
| `pt_exam_id`    | `char(36)`, `uuid` | Foreign Key (`pt_exams.id`), On Delete: Cascade      |
| `pt_question_group_id` | `char(36)`, `uuid` | Nullable, Foreign Key (`pt_question_groups.id`), On Delete: Set Null |
| `question_text` | `text`      |                                                      |
| `audio_path`    | `varchar(255)` | Nullable                                             |
| `points`        | `integer`   | Default: 1                                           |
| `created_at`    | `timestamp` | Nullable                                             |
| `updated_at`    | `timestamp` | Nullable                                             |

### `pt_question_options`

| Column           | Type        | Details                                                 |
| ---------------- | ----------- | ------------------------------------------------------- |
| `id`             | `char(36)`, `uuid` | Primary Key                                             |
| `pt_question_id` | `char(36)`, `uuid` | Foreign Key (`pt_questions.id`), On Delete: Cascade     |
| `option_text`    | `varchar(255)` |                                                         |
| `is_correct`     | `boolean`   | Default: false                                          |
| `created_at`     | `timestamp` | Nullable                                                |
| `updated_at`     | `timestamp` | Nullable                                                |

### `pt_sessions`

| Column              | Type        | Details                                              |
| ------------------- | ----------- | ---------------------------------------------------- |
| `id`                | `char(36)`, `uuid` | Primary Key                                          |
| `lead_id`           | `bigint`, `unsigned` | Foreign Key (`leads.id`), On Delete: Cascade    |
| `pt_exam_id`        | `char(36)`, `uuid` | Foreign Key (`pt_exams.id`), On Delete: Cascade      |
| `token`             | `varchar(255)` | Unique                                               |
| `status`            | `enum`      | 'pending', 'in_progress', 'completed'                |
| `started_at`        | `timestamp` | Nullable                                             |
| `finished_at`       | `timestamp` | Nullable                                             |
| `final_score`       | `integer`   | Nullable                                             |
| `recommended_level` | `varchar(255)` | Nullable                                             |
| `created_at`        | `timestamp` | Nullable                                             |
| `updated_at`        | `timestamp` | Nullable                                             |

### `pt_answers`

| Column                  | Type        | Details                                                    |
| ----------------------- | ----------- | ---------------------------------------------------------- |
| `id`                    | `char(36)`, `uuid` | Primary Key                                                |
| `pt_session_id`         | `char(36)`, `uuid` | Foreign Key (`pt_sessions.id`), On Delete: Cascade         |
| `pt_question_id`        | `char(36)`, `uuid` | Foreign Key (`pt_questions.id`), On Delete: Cascade        |
| `pt_question_option_id` | `char(36)`, `uuid` | Nullable, Foreign Key (`pt_question_options.id`)           |
| `is_correct`            | `boolean`   | Default: false                                             |
| `created_at`            | `timestamp` | Nullable                                                   |
| `updated_at`            | `timestamp` | Nullable                                                   |

### `pt_question_groups`

| Column         | Type        | Details                                              |
| -------------- | ----------- | ---------------------------------------------------- |
| `id`           | `char(36)`, `uuid` | Primary Key                                          |
| `pt_exam_id`   | `char(36)`, `uuid` | Foreign Key (`pt_exams.id`), On Delete: Cascade      |
| `instruction`  | `varchar(255)` |                                                      |
| `audio_path`   | `varchar(255)` | Nullable                                             |
| `reading_text` | `text`      | Nullable                                             |
| `created_at`   | `timestamp` | Nullable                                             |
| `updated_at`   | `timestamp` | Nullable                                             |

### `invoices`

| Column           | Type                 | Details                                                    |
| ---------------- | -------------------- | ---------------------------------------------------------- |
| `id`             | `bigint`, `unsigned` | Primary Key                                                |
| `lead_id`        | `bigint`, `unsigned` | Foreign Key (`leads.id`), On Delete: Cascade               |
| `invoice_number` | `varchar(255)`       | Unique                                                     |
| `total_amount`   | `decimal(12, 2)`     | Default: 0                                                 |
| `status`         | `enum`               | 'unpaid', 'partial', 'waiting_verification', ...           |
| `due_date`       | `date`               | Nullable                                                   |
| `paid_at`        | `timestamp`          | Nullable                                                   |
| `created_at`     | `timestamp`          | Nullable                                                   |
| `updated_at`     | `timestamp`          | Nullable                                                   |

### `invoice_items`

| Column         | Type                 | Details                                            |
| -------------- | -------------------- | -------------------------------------------------- |
| `id`           | `bigint`, `unsigned` | Primary Key                                        |
| `invoice_id`   | `bigint`, `unsigned` | Foreign Key (`invoices.id`), On Delete: Cascade    |
| `description`  | `varchar(255)`       |                                                    |
| `quantity`     | `integer`            | Default: 1                                         |
| `unit_price`   | `decimal(12, 2)`     | Default: 0                                         |
| `subtotal`     | `decimal(12, 2)`     | Default: 0                                         |
| `created_at`   | `timestamp`          | Nullable                                           |
| `updated_at`   | `timestamp`          | Nullable                                           |

### `payments`

| Column           | Type                 | Details                                            |
| ---------------- | -------------------- | -------------------------------------------------- |
| `id`             | `bigint`, `unsigned` | Primary Key                                        |
| `invoice_id`     | `bigint`, `unsigned` | Foreign Key (`invoices.id`), On Delete: Cascade    |
| `amount_paid`    | `decimal(12, 2)`     | Default: 0                                         |
| `payment_method` | `varchar(255)`       | Nullable                                           |
| `payment_date`   | `timestamp`          | Default: CURRENT_TIMESTAMP                         |
| `receipt_path`   | `varchar(255)`       | Nullable                                           |
| `created_at`     | `timestamp`          | Nullable                                           |
| `updated_at`     | `timestamp`          | Nullable                                           |

### `study_classes`

| Column       | Type                 | Details                                            |
| ------------ | -------------------- | -------------------------------------------------- |
| `id`         | `bigint`, `unsigned` | Primary Key                                        |
| `name`       | `varchar(255)`       |                                                    |
| `package_id` | `bigint`, `unsigned` | Foreign Key (`packages.id`), On Delete: Cascade    |
| `created_at` | `timestamp`          | Nullable                                           |
| `updated_at` | `timestamp`          | Nullable                                           |

### `study_class_teacher` (Pivot Table)

| Column           | Type                 | Details                                                |
| ---------------- | -------------------- | ------------------------------------------------------ |
| `id`             | `bigint`, `unsigned` | Primary Key                                            |
| `study_class_id` | `bigint`, `unsigned` | Foreign Key (`study_classes.id`), On Delete: Cascade   |
| `teacher_id`     | `bigint`, `unsigned` | Foreign Key (`users.id`), On Delete: Cascade           |
| `created_at`     | `timestamp`          | Nullable                                               |
| `updated_at`     | `timestamp`          | Nullable                                               |

### `student_study_class` (Pivot Table)

| Column           | Type                 | Details                                                |
| ---------------- | -------------------- | ------------------------------------------------------ |
| `id`             | `bigint`, `unsigned` | Primary Key                                            |
| `student_id`     | `bigint`, `unsigned` | Foreign Key (`students.id`), On Delete: Cascade        |
| `study_class_id` | `bigint`, `unsigned` | Foreign Key (`study_classes.id`), On Delete: Cascade   |
| `created_at`     | `timestamp`          | Nullable                                               |
| `updated_at`     | `timestamp`          | Nullable                                               |

# [EXECUTION_DIRECTIVE]

When generating code, output ONLY the code blocks and minimal required explanation.
Adhere STRICTLY to the rules above. If a prompt violates these rules, automatically correct the structure and explain the refactoring briefly.
