# Architecture du Projet Pateuf Festival

## Palette de Couleurs du Projet

- **Sunrise Orange (#E67451)** : Actions critiques / Endpoints protégés
- **Sunrise Blue (#2B4C7E)** : Composants principaux / Authentification
- **Dawn Blue (#5B8DBE)** : Composants secondaires / Lecture
- **Sky Light (#E8F1F8)** : Fond / Utilitaires

---

## 1. Architecture Globale du Système

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#E8F1F8','primaryTextColor':'#000','primaryBorderColor':'#5B8DBE','lineColor':'#2B4C7E','secondaryColor':'#E8F1F8','tertiaryColor':'#E8F1F8','background':'#E8F1F8','mainBkg':'#E8F1F8','secondaryBkg':'#E8F1F8','tertiaryBkg':'#E8F1F8','clusterBkg':'#FFFFFF','clusterBorder':'#5B8DBE','edgeLabelBackground':'#FFFFFF'}}}%%
graph LR
    subgraph Frontend["Frontend - Vue 3"]
        VR[Vue Router]

        subgraph Views["Vues"]
            HOME[HomeView]
            AUTH[AdminAuthView]
            GESTION[GestionView]
        end

        subgraph CompPublic["Composants Publics"]
            CONCERT[Concert_comp]
            MAP[Map_comp]
            FAQ[Faq_comp]
            PROGRAM[Program_comp]
        end

        subgraph CompAdmin["Composants Admin"]
            EDIT_SCH[EditSchedule]
            EDIT_FAQ[EditFaq]
            EDIT_INFO[EditInfo]
            EDIT_BORDER[EditBorder]
        end
    end

    subgraph Stores["State - Pinia Stores"]
        AUTH_STORE[authStore]
        SCHEDULE_STORE[scheduleStore]
        FAQ_STORE[faqStore]
        NEWS_STORE[newsStore]
        BORDER_STORE[borderStore]
        BRAND_STORE[brandingStore]
    end

    subgraph Backend["Backend - Netlify Functions"]
        FETCH_DOC[fetchSanityDoc]
        CREATE_DOC[createSanityDoc]
        UPDATE_DOC[updateSanityDoc]
        DELETE_DOC[deleteSanityDoc]
        UPDATE_ORDER[updateOrder]
    end

    subgraph External["Services Externes"]
        SANITY[(Sanity CMS)]
        AUTH0[Auth0]
        MAPBOX[Mapbox]
    end

    VR --> HOME & AUTH & GESTION
    HOME --> CONCERT & MAP & FAQ & PROGRAM
    GESTION --> EDIT_SCH & EDIT_FAQ & EDIT_INFO

    CONCERT & PROGRAM --> SCHEDULE_STORE
    FAQ --> FAQ_STORE
    MAP --> BORDER_STORE

    EDIT_SCH --> SCHEDULE_STORE
    EDIT_FAQ --> FAQ_STORE
    EDIT_INFO --> NEWS_STORE

    AUTH & GESTION --> AUTH_STORE

    SCHEDULE_STORE & FAQ_STORE & NEWS_STORE --> FETCH_DOC & CREATE_DOC & UPDATE_DOC & DELETE_DOC

    FETCH_DOC & CREATE_DOC & UPDATE_DOC & DELETE_DOC & UPDATE_ORDER --> SANITY

    AUTH_STORE --> AUTH0
    MAP --> MAPBOX

    style FETCH_DOC fill:#5B8DBE,stroke:#2B4C7E,color:#fff
    style CREATE_DOC fill:#E67451,stroke:#2B4C7E,color:#fff
    style UPDATE_DOC fill:#E67451,stroke:#2B4C7E,color:#fff
    style DELETE_DOC fill:#E67451,stroke:#2B4C7E,color:#fff
    style UPDATE_ORDER fill:#E67451,stroke:#2B4C7E,color:#fff
    style AUTH_STORE fill:#2B4C7E,stroke:#2B4C7E,color:#fff
```

---

## 2. Flux d'Authentification Auth0

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'actorBkg':'#E8F1F8','actorBorder':'#5B8DBE','actorTextColor':'#000','actorLineColor':'#2B4C7E','signalColor':'#2B4C7E','signalTextColor':'#000','labelBoxBkgColor':'#E8F1F8','labelBoxBorderColor':'#5B8DBE','labelTextColor':'#000','loopTextColor':'#000','noteBorderColor':'#5B8DBE','noteBkgColor':'#FFFFFF','noteTextColor':'#000','activationBorderColor':'#2B4C7E','activationBkgColor':'#5B8DBE','sequenceNumberColor':'#fff'}}}%%
sequenceDiagram
    participant U as Utilisateur
    participant V as Vue App
    participant AS as authStore
    participant A0 as Auth0
    participant NF as Netlify Fn
    participant S as Sanity

    U->>V: Clique "Se connecter"
    V->>AS: login()
    AS->>A0: loginWithRedirect()
    A0->>U: Page login Auth0
    U->>A0: Credentials
    A0->>V: Redirect + code
    V->>A0: handleCallback()
    A0->>AS: JWT + UserInfo

    Note over U,S: Accès Dashboard Admin

    U->>V: Action Admin
    V->>AS: getAccessToken()
    AS->>A0: Request token
    A0->>AS: JWT Token
    AS->>NF: API Call + Bearer token
    NF->>NF: verifyJWT()

    alt Token Valide
        NF->>S: Mutation
        S->>NF: Succès
        NF->>AS: 200 OK
        AS->>V: MAJ UI
    else Token Invalide
        NF->>AS: 401 Unauthorized
        AS->>V: Erreur
    end
```

---

## 3. Architecture des Stores Pinia

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#E8F1F8','primaryTextColor':'#000','primaryBorderColor':'#5B8DBE','lineColor':'#2B4C7E','secondaryColor':'#E8F1F8','tertiaryColor':'#E8F1F8','background':'#E8F1F8','mainBkg':'#E8F1F8','secondaryBkg':'#E8F1F8','tertiaryBkg':'#E8F1F8','clusterBkg':'#FFFFFF','clusterBorder':'#5B8DBE','edgeLabelBackground':'#FFFFFF'}}}%%
graph LR
    subgraph Auth["Authentication Store"]
        AS[authStore]
        AS --> AS_USER[user]
        AS --> AS_AUTH[isAuthenticated]
        AS --> AS_LOGIN[login/logout]
        AS --> AS_TOKEN[getAccessToken]
    end

    subgraph Content["Content Stores"]
        SS[scheduleStore]
        FS[faqStore]
        NS[newsStore]

        SS --> SS_DATA[schedules]
        SS --> SS_CRUD[CRUD ops]

        FS --> FS_DATA[faqs]
        FS --> FS_CRUD[CRUD ops]

        NS --> NS_DATA[news]
        NS --> NS_CRUD[CRUD ops]
    end

    subgraph Config["Configuration Stores"]
        BS[borderStore]
        BRS[brandingStore]
        CS[categoryStore]
        IS[iconStore]
    end

    subgraph Map["Map Stores"]
        MS[mapZoneStore]
        MS --> MS_ZONES[zones]
    end

    AS -.JWT.-> SS
    AS -.JWT.-> FS
    AS -.JWT.-> NS

    style AS fill:#2B4C7E,stroke:#2B4C7E,color:#fff
    style SS fill:#5B8DBE,stroke:#2B4C7E,color:#fff
    style FS fill:#5B8DBE,stroke:#2B4C7E,color:#fff
    style NS fill:#5B8DBE,stroke:#2B4C7E,color:#fff
```

---

## 4. CRUD Operations Flow

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#E8F1F8','primaryTextColor':'#000','primaryBorderColor':'#5B8DBE','lineColor':'#2B4C7E','secondaryColor':'#E8F1F8','tertiaryColor':'#E8F1F8','background':'#E8F1F8','mainBkg':'#E8F1F8','secondaryBkg':'#E8F1F8','tertiaryBkg':'#E8F1F8','clusterBkg':'#FFFFFF','clusterBorder':'#5B8DBE','edgeLabelBackground':'#FFFFFF'}}}%%
flowchart LR
    START([Utilisateur Admin])

    START --> ACTION{Action}

    ACTION -->|Create| C1[Formulaire]
    ACTION -->|Read| R1[Liste]
    ACTION -->|Update| U1[Édition]
    ACTION -->|Delete| D1[Confirmation]

    C1 --> C2[Store: create]
    R1 --> R2[Store: fetch]
    U1 --> U2[Store: update]
    D1 --> D2[Store: delete]

    C2 --> C3{JWT?}
    U2 --> U3{JWT?}
    D2 --> D3{JWT?}

    C3 -->|Oui| C4[API: create]
    C3 -->|Non| ERR1[Erreur Auth]

    U3 -->|Oui| U4[API: update]
    U3 -->|Non| ERR1

    D3 -->|Oui| D4[API: delete]
    D3 -->|Non| ERR1

    R2 --> R4[API: fetch]

    C4 & U4 & D4 --> VERIFY{Verify JWT}

    VERIFY -->|Valide| SANITY_WRITE[Sanity: mutation]
    VERIFY -->|Invalide| ERR2[401 Error]

    R4 --> SANITY_READ[Sanity: query]

    SANITY_WRITE & SANITY_READ --> SUCCESS[MAJ UI]

    ERR1 --> END1[Redirect Login]
    ERR2 --> END2[Erreur]
    SUCCESS --> END3[Terminé]

    style C4 fill:#E67451,stroke:#2B4C7E,color:#fff
    style U4 fill:#E67451,stroke:#2B4C7E,color:#fff
    style D4 fill:#E67451,stroke:#2B4C7E,color:#fff
    style R4 fill:#5B8DBE,stroke:#2B4C7E,color:#fff
    style VERIFY fill:#2B4C7E,stroke:#2B4C7E,color:#fff
    style ERR1 fill:#E67451,stroke:#2B4C7E,color:#000
    style ERR2 fill:#E67451,stroke:#2B4C7E,color:#000
    style SUCCESS fill:#5B8DBE,stroke:#2B4C7E,color:#fff
```

---

## 5. Structure des Netlify Functions

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#E8F1F8','primaryTextColor':'#000','primaryBorderColor':'#5B8DBE','lineColor':'#2B4C7E','secondaryColor':'#E8F1F8','tertiaryColor':'#E8F1F8','background':'#E8F1F8','mainBkg':'#E8F1F8','secondaryBkg':'#E8F1F8','tertiaryBkg':'#E8F1F8','clusterBkg':'#FFFFFF','clusterBorder':'#5B8DBE','edgeLabelBackground':'#FFFFFF'}}}%%
graph LR
    subgraph Public["Functions Publiques"]
        PF1[fetchSanityDoc]
        PF2[fetchMapbox]

        PF1 --> PF1A[Read Token]
        PF1 --> PF1B[GROQ]

        PF2 --> PF2A[Rate Limit]
    end

    subgraph Protected["Functions Protégées"]
        CF[createDoc]
        UF[updateDoc]
        DF[deleteDoc]
        OF[updateOrder]

        CF & UF & DF & OF --> AUTH_MID[verifyJWT]

        AUTH_MID --> AUTH_CHECK{Valid?}

        AUTH_CHECK -->|Yes| EXEC[Execute]
        AUTH_CHECK -->|No| ERR[401]

        EXEC --> OP_CREATE[create]
        EXEC --> OP_UPDATE[patch]
        EXEC --> OP_DELETE[delete]
        EXEC --> OP_TRANS[transaction]
    end

    subgraph Utils["Utilitaires"]
        UTIL[verifyAuth0JWT]
        UTIL --> UTIL1[Fetch JWKS]
        UTIL --> UTIL2[Verify Sig]
        UTIL --> UTIL3[Validate]
    end

    subgraph CMS["Sanity CMS"]
        DB[(Database)]

        PF1B & OP_CREATE & OP_UPDATE & OP_DELETE & OP_TRANS --> DB
    end

    AUTH_MID -.uses.-> UTIL

    style PF1 fill:#5B8DBE,stroke:#2B4C7E,color:#fff
    style PF2 fill:#5B8DBE,stroke:#2B4C7E,color:#fff
    style CF fill:#E67451,stroke:#2B4C7E,color:#fff
    style UF fill:#E67451,stroke:#2B4C7E,color:#fff
    style DF fill:#E67451,stroke:#2B4C7E,color:#fff
    style OF fill:#E67451,stroke:#2B4C7E,color:#fff
    style AUTH_MID fill:#2B4C7E,stroke:#2B4C7E,color:#fff
    style UTIL fill:#E8F1F8,stroke:#5B8DBE,color:#000
    style ERR fill:#E67451,stroke:#2B4C7E,color:#000
```

---

## 6. Schémas de Données Sanity

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#E8F1F8','primaryTextColor':'#000','primaryBorderColor':'#5B8DBE','lineColor':'#2B4C7E','background':'#E8F1F8','mainBkg':'#E8F1F8'}}}%%
erDiagram
    SCHEDULE {
        string _id PK
        string name
        datetime startTime
        datetime endTime
        reference location FK
        reference category FK
        text description
        image image
        number order
    }

    FAQ {
        string _id PK
        string question
        text answer
        string theme
        boolean pinned
        number order
    }

    INFOS {
        string _id PK
        string title
        text description
        number order
    }

    ZONE {
        string _id PK
        string name
        array coordinates
        image image
    }

    CATEGORY {
        string _id PK
        string title
        image logo
    }

    ICON {
        string _id PK
        string name
        image iconImage
    }

    SPONSOR {
        string _id PK
        string name
        image logo
        url website
        number order
    }

    SITE_BRANDING {
        string _id PK
        image logo
        image backgroundImage
        image ticketImage
    }

    FESTIVAL_BORDER {
        string _id PK
        array coordinates
    }

    SCHEDULE ||--o{ ZONE : "located_in"
    SCHEDULE ||--o{ CATEGORY : "belongs_to"
```

---

## 7. Routing et Navigation

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#E8F1F8','primaryTextColor':'#000','primaryBorderColor':'#5B8DBE','lineColor':'#2B4C7E','secondaryColor':'#E8F1F8','tertiaryColor':'#E8F1F8','background':'#E8F1F8','mainBkg':'#E8F1F8','secondaryBkg':'#E8F1F8','tertiaryBkg':'#E8F1F8','clusterBkg':'#FFFFFF','clusterBorder':'#5B8DBE','edgeLabelBackground':'#FFFFFF'}}}%%
graph LR
    ROOT[/] --> ROUTER{Router}

    ROUTER --> HOME[HomeView]
    ROUTER --> AUTH_VIEW[AdminAuthView]
    ROUTER --> GESTION[GestionView]

    HOME --> H_SEC{Sections}
    H_SEC --> H1[Header]
    H_SEC --> H2[Programme]
    H_SEC --> H3[Carte]
    H_SEC --> H4[FAQ]
    H_SEC --> H5[Billeterie]
    H_SEC --> H6[Sponsors]

    AUTH_VIEW --> AUTH_CHECK{Auth?}
    AUTH_CHECK -->|Non| LOGIN[Login Form]
    AUTH_CHECK -->|Oui| REDIR_G[→ /gestion]

    GESTION --> G_CHECK{Auth?}
    G_CHECK -->|Non| REDIR_A[→ /auth]
    G_CHECK -->|Oui| ADMIN[Dashboard]

    ADMIN --> A_COMP{Composants}
    A_COMP --> A1[EditSchedule]
    A_COMP --> A2[EditFaq]
    A_COMP --> A3[EditInfo]
    A_COMP --> A4[EditBorder]

    style HOME fill:#5B8DBE,stroke:#2B4C7E,color:#fff
    style AUTH_VIEW fill:#2B4C7E,stroke:#2B4C7E,color:#fff
    style GESTION fill:#E67451,stroke:#2B4C7E,color:#fff
    style ADMIN fill:#E8F1F8,stroke:#5B8DBE,color:#000
```

---

## 8. Sécurité et Protection des Endpoints

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#E8F1F8','primaryTextColor':'#000','primaryBorderColor':'#5B8DBE','lineColor':'#2B4C7E','secondaryColor':'#E8F1F8','tertiaryColor':'#E8F1F8','background':'#E8F1F8','mainBkg':'#E8F1F8','secondaryBkg':'#E8F1F8','tertiaryBkg':'#E8F1F8','clusterBkg':'#FFFFFF','clusterBorder':'#5B8DBE','edgeLabelBackground':'#FFFFFF'}}}%%
flowchart LR
    subgraph Client["Client"]
        COMP[Component]
        STORE[Store]
        AUTH_S[authStore]

        COMP --> STORE
        STORE --> AUTH_S
    end

    subgraph Request["Préparation"]
        AUTH_S --> NEED{Auth?}

        NEED -->|Oui| GET_T[getToken]
        NEED -->|Non| PUB[Public]

        GET_T --> JWT_T[JWT]
        JWT_T --> REQ1[Fetch + Bearer]
        PUB --> REQ2[Fetch]
    end

    subgraph Functions["Netlify Functions"]
        REQ1 --> PROTECTED[Protected Fn]
        REQ2 --> PUBLIC[Public Fn]

        PROTECTED --> VERIFY[verifyJWT]

        VERIFY --> V1{Signature?}
        V1 -->|Non| E1[401 Signature]
        V1 -->|Oui| V2{Audience?}

        V2 -->|Non| E2[403 Audience]
        V2 -->|Oui| V3{Expiry?}

        V3 -->|Expiré| E3[401 Expired]
        V3 -->|Valide| V4{Issuer?}

        V4 -->|Non| E4[401 Issuer]
        V4 -->|Oui| OK1[Execute]

        PUBLIC --> RATE{Rate Limit?}
        RATE -->|Dépassé| E5[429 Too Many]
        RATE -->|OK| OK2[Execute]
    end

    subgraph CMS["Sanity"]
        OK1 --> ADMIN_T[Admin Token]
        OK2 --> READ_T[Read Token]

        ADMIN_T --> WRITE[Write Ops]
        READ_T --> READ[Read Ops]

        WRITE & READ --> DB[(DB)]
    end

    style VERIFY fill:#2B4C7E,stroke:#2B4C7E,color:#fff
    style E1 fill:#E67451,stroke:#2B4C7E,color:#000
    style E2 fill:#E67451,stroke:#2B4C7E,color:#000
    style E3 fill:#E67451,stroke:#2B4C7E,color:#000
    style E4 fill:#E67451,stroke:#2B4C7E,color:#000
    style E5 fill:#E67451,stroke:#2B4C7E,color:#000
    style OK1 fill:#5B8DBE,stroke:#2B4C7E,color:#fff
    style OK2 fill:#5B8DBE,stroke:#2B4C7E,color:#fff
```

---

## 9. Lifecycle de l'Application

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'actorBkg':'#E8F1F8','actorBorder':'#5B8DBE','actorTextColor':'#000','actorLineColor':'#2B4C7E','signalColor':'#2B4C7E','signalTextColor':'#000','labelBoxBkgColor':'#E8F1F8','labelBoxBorderColor':'#5B8DBE','labelTextColor':'#000','loopTextColor':'#000','noteBorderColor':'#5B8DBE','noteBkgColor':'#FFFFFF','noteTextColor':'#000','activationBorderColor':'#2B4C7E','activationBkgColor':'#5B8DBE','sequenceNumberColor':'#fff'}}}%%
sequenceDiagram
    participant B as Browser
    participant M as main.js
    participant A0 as Auth0
    participant R as Router
    participant S as Stores
    participant C as Components
    participant NF as Netlify Fn
    participant SN as Sanity

    B->>M: Chargement
    M->>A0: createAuth0()
    A0-->>M: Plugin configuré
    M->>S: createPinia()
    M->>R: createRouter()
    M->>M: mount app
    M->>B: Render

    B->>R: Navigate /
    R->>C: HomeView
    C->>S: fetch data
    S->>NF: GET (public)
    NF->>SN: GROQ
    SN-->>NF: Data
    NF-->>S: Response
    S-->>C: Update
    C-->>B: Render UI

    Note over B,SN: Login Flow

    B->>C: Click Login
    C->>S: authStore.login()
    S->>A0: loginWithRedirect()
    A0-->>B: Auth0 Page
    B->>A0: Credentials
    A0-->>B: Redirect
    B->>A0: handleCallback()
    A0-->>S: JWT + User
    S-->>C: isAuth = true
    C->>R: → /gestion

    Note over B,SN: Admin Action

    C->>S: createSchedule()
    S->>A0: getToken()
    A0-->>S: JWT
    S->>NF: POST + JWT
    NF->>NF: verifyJWT()
    NF->>SN: create()
    SN-->>NF: New doc
    NF-->>S: Success
    S->>S: refresh()
    S-->>C: Update
    C-->>B: UI refresh
```

---

## 10. Déploiement et Build Process

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#E8F1F8','primaryTextColor':'#000','primaryBorderColor':'#5B8DBE','lineColor':'#2B4C7E','secondaryColor':'#E8F1F8','tertiaryColor':'#E8F1F8','background':'#E8F1F8','mainBkg':'#E8F1F8','secondaryBkg':'#E8F1F8','tertiaryBkg':'#E8F1F8','clusterBkg':'#FFFFFF','clusterBorder':'#5B8DBE','edgeLabelBackground':'#FFFFFF'}}}%%
graph LR
    subgraph Dev["Développement"]
        DEV1[npm run dev]
        DEV1 --> DEV2[Vite Server]
        DEV2 --> DEV3[HMR]
        DEV3 --> DEV4[localhost]
    end

    subgraph Build["Build"]
        B1[npm run build]
        B1 --> B2[Vite Build]
        B2 --> B3[Vue Compile]
        B3 --> B4[Tailwind]
        B4 --> B5[Optimize]
        B5 --> B6[dist/]
    end

    subgraph Deploy["Netlify Deploy"]
        D1[Git Push]
        D1 --> D2[Detect]
        D2 --> D3[Build]
        D3 --> D4[Deploy dist/]
        D4 --> D5[Deploy fn/]
        D5 --> D6[Config]

        D6 --> D7[Headers]
        D6 --> D8[Redirects]
        D6 --> D9[Env Vars]

        D7 & D8 & D9 --> LIVE[Production]
    end

    subgraph Env["Variables d'Environnement"]
        E1[SANITY_PROJECT_ID]
        E2[SANITY_DATASET]
        E3[SANITY_TOKEN_READ]
        E4[SANITY_TOKEN_ADMIN]
        E5[AUTH0_DOMAIN]
        E6[AUTH0_CLIENT_ID]
        E7[AUTH0_AUDIENCE]
        E8[MAPBOX_TOKEN]

        E1 & E2 & E3 & E4 & E5 & E6 & E7 & E8 --> D9
    end

    subgraph Services["Services Prod"]
        LIVE --> SPA[Vue SPA]
        LIVE --> FN[Functions]
        FN --> SANITY_S[Sanity]
        FN --> AUTH0_S[Auth0]
        SPA --> MAPBOX_S[Mapbox]
    end

    B6 -.-> D4

    style LIVE fill:#5B8DBE,stroke:#2B4C7E,color:#fff
    style B6 fill:#5B8DBE,stroke:#2B4C7E,color:#fff
    style D9 fill:#2B4C7E,stroke:#2B4C7E,color:#fff
```

---

## Légende des Couleurs

| Couleur | Code | Usage |
|---------|------|-------|
| 🔵 **Sunrise Blue** | #2B4C7E | Authentification / Composants principaux |
| 🔷 **Dawn Blue** | #5B8DBE | Lecture / Succès / Composants secondaires |
| 🟠 **Sunrise Orange** | #E67451 | Erreurs / Actions protégées / Critique |
| ☁️ **Sky Light** | #E8F1F8 | Fond / Utilitaires / Configuration |

---

## Notes Techniques

- **Authentification** : Toutes les mutations nécessitent JWT Auth0 valide
- **Sécurité** : Lectures publiques avec token read-only Sanity
- **Performance** : Rate limiting sur endpoints publics
- **Headers** : CSP configuré pour Auth0, Mapbox, Sanity
- **Tokens** : Refresh automatique via Auth0 SDK
