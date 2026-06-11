# NITH Backend Diagrams

## Route Tree

```mermaid
flowchart TD
  A[Express app\nindex.js] --> B[/ /]
  A --> C[/v1]
  A --> D[/auth]
  A --> E[/hero]
  A --> F[/event]
  A --> G[/downloads]
  A --> H[/history]
  A --> I[/api/upload]

  C --> C1[/about-nith]
  C --> C2[/academics]
  C --> C3[/administration]
  C --> C4[/alumni]
  C --> C5[/authorities]
  C --> C6[/departments]
  C --> C7[/downloads]
  C --> C8[/faculty]
  C --> C9[/students]

  C1 --> C1a[GET /]
  C1 --> C1b[GET /:id]
  C1 --> C1c[POST /]
  C1 --> C1d[PUT /:id]
  C1 --> C1e[DELETE /:id]

  C3 --> C3a[/accounts]
  C3a --> C3a1[category CRUD]
  C3a --> C3a2[role-position CRUD]
  C3a --> C3a3[faculty CRUD]
  C3a --> C3a4[faculty-role CRUD]

  E --> E1[/homepage GET PUT]
  E --> E2[/hero-image GET POST DELETE]
  G --> G1[Downloads CRUD]
  H --> H1[GET PUT main history]
  H --> H2[/timeline GET POST PUT DELETE]
  I --> I1[Multer upload to MinIO bucket images]
```

## Architecture

```mermaid
flowchart LR
  Client[Client / Frontend] -->|HTTP requests| App[Express app\nindex.js]
  App --> Cors[CORS middleware]
  App --> Json[express.json()]
  App --> V1[/v1 router]
  App --> AuthMount[/auth router\nauthetication.js]
  App --> Hero[/hero router]
  App --> Event[/event router]
  App --> Downloads[/downloads router]
  App --> History[/history router]
  App --> Upload[/api/upload\nMinIO upload middleware]

  V1 --> AboutNith[/about-nith]
  V1 --> Academics[/academics]
  V1 --> Administration[/administration]
  V1 --> Alumni[/alumni]
  V1 --> Authorities[/authorities]
  V1 --> Departments[/departments]
  V1 --> V1Downloads[/downloads]
  V1 --> Faculty[/faculty]
  V1 --> Students[/students]

  AboutNith --> AboutCtrl[aboutNithController]
  AboutCtrl --> DB[(Postgres)]
  DB --> AboutTable[(aboutnith)]

  Hero --> HeroDB[(Postgres)]
  Hero --> MinIO[(MinIO / S3-compatible storage)]
  HeroDB --> HomeTables[(homepage, hero_image)]
  Hero --> HomeTables

  Downloads --> DownloadDB[(Postgres)]
  Downloads --> MinIO
  DownloadDB --> UgTables[(ug_tables)]

  History --> HistoryDB[(Postgres)]
  HistoryDB --> HistTables[(aboutnith_history, aboutnith_history_timeline)]

  Upload --> MinIO

  AuthMiddleware[JWT auth middleware] --> JWT[(jsonwebtoken)]
  JWT --> FacultyAuth[auth.js faculty login flow]
  FacultyAuth --> DB
  FacultyAuth --> FacultyTable[(faculty)]

  Administration --> AccountsCtrl[accountsController]
  AccountsCtrl --> DB
  AccountsCtrl --> AdminTables[(category, role_position, faculty, faculty_role_assignment)]

  Note1[Real mounted feature paths today: about-nith, hero, downloads, history, /api/upload, auth mount file is empty]:::note
  Note2[Some code exists but is not mounted by index.js: auth.js, faculty.js, authorities/links.js]:::note

  classDef note fill:#fef3c7,stroke:#d97706,color:#111827;
```

## Plain English Flow

- The frontend sends a request to Express in `index.js`.
- Express applies CORS and JSON parsing.
- The request goes to either a top-level route like `/hero`, `/downloads`, `/history`, or into `/v1`.
- The route module calls a controller or performs the query directly.
- The controller talks to Postgres through `src/db/db.js` or uploads files through MinIO through `src/db/minio.js`.
- The response is sent back as JSON.

## Important Note

- Some files are real business logic.
- Some are placeholders.
- Some are not mounted at all from `index.js`.
- The most useful live feature files are `src/aboutnith/history.js`, `src/homepage/hero.js`, `src/downloads/download.js`, and `src/authorities/links.js`.
