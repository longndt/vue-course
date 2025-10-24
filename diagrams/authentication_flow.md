# Vue Authentication Flow 🔐

## TypeScript Auth System Architecture

This diagram illustrates the complete authentication flow in Vue 3 applications with TypeScript, including JWT token management, route protection, and security best practices.

```mermaid
sequenceDiagram
    participant U as User
    participant V as Vue App
    participant R as Vue Router
    participant A as Auth Store
    participant S as Server
    participant L as LocalStorage

    Note over U,L: Login Flow
    U->>V: Enter credentials
    V->>A: login(email, password)
    A->>S: POST /api/auth/login
    S-->>A: { token, user }
    A->>L: Store token securely
    A->>A: Set user state
    A->>R: Navigate to dashboard
    R->>V: Render protected route

    Note over U,L: Route Protection
    U->>R: Navigate to protected route
    R->>A: Check authentication
    A->>L: Get stored token
    alt Token exists and valid
        A-->>R: Allow navigation
        R->>V: Render component
    else Token missing or invalid
        A-->>R: Redirect to login
        R->>V: Show login form
    end

    Note over U,L: API Request with Auth
    V->>A: Make API request
    A->>L: Get token
    A->>S: Request with Authorization header
    S-->>A: Protected data
    A-->>V: Return data

    Note over U,L: Token Refresh
    A->>S: Request with expired token
    S-->>A: 401 Unauthorized
    A->>S: POST /api/auth/refresh
    S-->>A: New token
    A->>L: Update stored token
    A->>S: Retry original request
    S-->>A: Success response

    Note over U,L: Logout Flow
    U->>V: Click logout
    V->>A: logout()
    A->>L: Remove token
    A->>A: Clear user state
    A->>R: Navigate to login
    R->>V: Show login form
```

## Authentication State Management

```mermaid
stateDiagram-v2
    [*] --> Unauthenticated
    Unauthenticated --> Authenticating : login()
    Authenticating --> Authenticated : success
    Authenticating --> Unauthenticated : failure
    Authenticated --> Refreshing : token expired
    Refreshing --> Authenticated : refresh success
    Refreshing --> Unauthenticated : refresh failure
    Authenticated --> Unauthenticated : logout()
    Unauthenticated --> [*]

    state Authenticated {
        [*] --> UserLoaded
        UserLoaded --> TokenValid
        TokenValid --> TokenExpired
        TokenExpired --> TokenRefreshed
        TokenRefreshed --> TokenValid
    }
```

## JWT Token Lifecycle

```mermaid
graph TD
    A[User Login] --> B[Server Validates Credentials]
    B --> C[Generate JWT Token]
    C --> D[Store Token Securely]
    D --> E[Include in API Requests]
    E --> F{Token Valid?}
    F -->|Yes| G[Process Request]
    F -->|No| H[Return 401 Error]
    H --> I[Attempt Token Refresh]
    I --> J{Refresh Success?}
    J -->|Yes| K[Update Token]
    J -->|No| L[Redirect to Login]
    K --> E
    L --> M[Clear Stored Token]
    M --> A
    G --> N[Continue Normal Flow]
    N --> O{Token Expiring Soon?}
    O -->|Yes| P[Proactive Refresh]
    O -->|No| E
    P --> Q{Refresh Success?}
    Q -->|Yes| K
    Q -->|No| R[Logout User]
    R --> M
```

## Route Protection Architecture

```mermaid
graph TD
    A[User Navigation] --> B[Vue Router Guard]
    B --> C{Route Requires Auth?}
    C -->|No| D[Allow Navigation]
    C -->|Yes| E[Check Auth State]
    E --> F{User Authenticated?}
    F -->|Yes| G{Token Valid?}
    F -->|No| H[Redirect to Login]
    G -->|Yes| I[Allow Navigation]
    G -->|No| J[Attempt Token Refresh]
    J --> K{Refresh Success?}
    K -->|Yes| I
    K -->|No| H
    I --> L[Render Component]
    H --> M[Show Login Form]
    D --> L

    style A fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style B fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style L fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    style M fill:#ffebee,stroke:#c62828,stroke-width:2px
```

## Security Layers

```mermaid
graph TB
    subgraph "Client Side Security"
        A[Input Validation]
        B[XSS Prevention]
        C[CSRF Protection]
        D[Secure Storage]
    end

    subgraph "Network Security"
        E[HTTPS Only]
        F[CORS Configuration]
        G[Request Headers]
        H[Rate Limiting]
    end

    subgraph "Server Side Security"
        I[JWT Validation]
        J[Password Hashing]
        K[Session Management]
        L[Audit Logging]
    end

    A --> E
    B --> F
    C --> G
    D --> H
    E --> I
    F --> J
    G --> K
    H --> L

    style A fill:#4caf50,stroke:#2e7d32,stroke-width:2px,color:#fff
    style E fill:#2196f3,stroke:#1976d2,stroke-width:2px,color:#fff
    style I fill:#ff9800,stroke:#f57c00,stroke-width:2px,color:#fff
```

## Pinia Store Structure

```mermaid
classDiagram
    class AuthStore {
        +user: User | null
        +token: string | null
        +loading: boolean
        +error: string | null
        +isAuthenticated: boolean
        +login(credentials): Promise~void~
        +logout(): void
        +refreshToken(): Promise~void~
        +checkAuth(): Promise~void~
        +setUser(user): void
        +clearError(): void
    }

    class User {
        +id: number
        +email: string
        +name: string
        +role: string
        +permissions: string[]
    }

    class AuthService {
        +login(credentials): Promise~AuthResponse~
        +logout(): Promise~void~
        +refreshToken(): Promise~TokenResponse~
        +validateToken(): Promise~boolean~
    }

    AuthStore --> User
    AuthStore --> AuthService
    AuthService --> User

    style AuthStore fill:#42b883,stroke:#35495e,stroke-width:2px,color:#fff
    style User fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style AuthService fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
```

## Error Handling Flow

```mermaid
graph TD
    A[Authentication Error] --> B{Error Type}
    B -->|Network Error| C[Show Network Message]
    B -->|Invalid Credentials| D[Show Login Error]
    B -->|Token Expired| E[Attempt Refresh]
    B -->|Server Error| F[Show Server Error]
    B -->|Validation Error| G[Show Field Errors]

    E --> H{Refresh Success?}
    H -->|Yes| I[Continue Operation]
    H -->|No| J[Redirect to Login]

    C --> K[Retry Option]
    D --> L[Clear Form]
    F --> M[Contact Support]
    G --> N[Highlight Fields]

    K --> A
    L --> O[Focus Email Field]
    M --> P[Log Error]
    N --> Q[Show Validation Help]

    style A fill:#f44336,stroke:#d32f2f,stroke-width:2px,color:#fff
    style I fill:#4caf50,stroke:#2e7d32,stroke-width:2px,color:#fff
    style J fill:#ff9800,stroke:#f57c00,stroke-width:2px,color:#fff
```

## Implementation Checklist

### Client Side
- [ ] Input validation and sanitization
- [ ] Secure token storage (httpOnly cookies preferred)
- [ ] XSS prevention in user content
- [ ] CSRF token implementation
- [ ] Route guards for protected pages
- [ ] Automatic token refresh
- [ ] Proper error handling and user feedback

### Server Side
- [ ] JWT token generation and validation
- [ ] Password hashing (bcrypt/Argon2)
- [ ] Rate limiting on auth endpoints
- [ ] CORS configuration
- [ ] HTTPS enforcement
- [ ] Audit logging
- [ ] Session management

### Security Best Practices
- [ ] Use secure, random JWT secrets
- [ ] Implement token expiration
- [ ] Use refresh tokens for long sessions
- [ ] Validate all inputs server-side
- [ ] Implement proper CORS policies
- [ ] Use Content Security Policy (CSP)
- [ ] Regular security audits

---

**Related Resources**:
- [Security Guide](../extras/security_guide.md) - Complete security practices
- [State Management](../extras/state_management.md) - Pinia patterns
- [Vue Router Navigation](./vue_router_navigation.md) - Route protection
