# Vue Security Guide 🔒

## Overview

This comprehensive guide covers essential security practices for Vue 3 applications, from basic security measures to advanced protection strategies for production applications.

## Table of Contents

1. [XSS Prevention](#xss-prevention)
2. [CSRF Protection](#csrf-protection)
3. [Secure Authentication](#secure-authentication)
4. [Input Validation](#input-validation)
5. [Environment Variables Security](#environment-variables-security)
6. [HTTPS Implementation](#https-implementation)
7. [Content Security Policy](#content-security-policy)
8. [Dependency Security](#dependency-security)
9. [API Security](#api-security)
10. [Common Vulnerabilities](#common-vulnerabilities)
11. [Security Testing](#security-testing)
12. [Production Security](#production-security)

## XSS Prevention

### Safe HTML Rendering

```vue
<template>
  <div>
    <h2>User Content</h2>

    <!-- Safe rendering of user content -->
    <div v-html="sanitizedContent"></div>

    <!-- Alternative: Use text interpolation for safety -->
    <div>{{ userContent }}</div>

    <!-- Safe attribute binding -->
    <img :src="sanitizedImageUrl" :alt="sanitizedAlt" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import DOMPurify from 'dompurify'

const userContent = ref('')

// Sanitize HTML content
const sanitizedContent = computed(() => {
  if (!userContent.value) return ''
  return DOMPurify.sanitize(userContent.value)
})

// Sanitize URLs
const sanitizedImageUrl = computed(() => {
  const url = userContent.value
  if (!url) return ''

  // Validate URL format
  try {
    const parsedUrl = new URL(url)
    if (parsedUrl.protocol === 'https:' || parsedUrl.protocol === 'http:') {
      return url
    }
  } catch {
    return ''
  }
  return ''
})

const sanitizedAlt = computed(() => {
  return userContent.value.replace(/[<>]/g, '')
})
</script>
```

### Safe Event Handling

```vue
<template>
  <div>
    <h2>Form Security</h2>

    <form @submit.prevent="handleSubmit">
      <div>
        <label for="name">Name</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          maxlength="100"
          pattern="[a-zA-Z\s]+"
          required
        />
        <div v-if="errors.name" class="error">{{ errors.name }}</div>
      </div>

      <div>
        <label for="email">Email</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          maxlength="255"
          required
        />
        <div v-if="errors.email" class="error">{{ errors.email }}</div>
      </div>

      <button type="submit" :disabled="!isFormValid">Submit</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'

interface FormData {
  name: string
  email: string
}

const form = reactive<FormData>({
  name: '',
  email: ''
})

const errors = reactive<Partial<FormData>>({})

// Input sanitization
const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 255) // Limit length
}

// Email validation
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Name validation
const isValidName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z\s]+$/
  return nameRegex.test(name) && name.length >= 2
}

// Form validation
const isFormValid = computed(() => {
  return isValidName(form.name) && isValidEmail(form.email)
})

const handleSubmit = async () => {
  // Clear previous errors
  Object.keys(errors).forEach(key => delete errors[key])

  // Validate inputs
  if (!isValidName(form.name)) {
    errors.name = 'Name must contain only letters and spaces'
    return
  }

  if (!isValidEmail(form.email)) {
    errors.email = 'Please enter a valid email address'
    return
  }

  // Sanitize data before sending
  const sanitizedData = {
    name: sanitizeInput(form.name),
    email: sanitizeInput(form.email)
  }

  try {
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': getCsrfToken()
      },
      body: JSON.stringify(sanitizedData)
    })

    if (response.ok) {
      // Handle success
      console.log('Form submitted successfully')
    }
  } catch (error) {
    console.error('Submission error:', error)
  }
}

const getCsrfToken = (): string => {
  // Get CSRF token from meta tag or cookie
  const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
  return token || ''
}
</script>

<style scoped>
.error {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

input:invalid {
  border-color: #dc3545;
}
</style>
```

## CSRF Protection

### CSRF Token Implementation

```vue
<template>
  <div>
    <h2>CSRF Protected Form</h2>

    <form @submit.prevent="submitForm">
      <input
        type="hidden"
        name="_token"
        :value="csrfToken"
      />

      <div>
        <label for="title">Title</label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          required
        />
      </div>

      <div>
        <label for="content">Content</label>
        <textarea
          id="content"
          v-model="form.content"
          required
        ></textarea>
      </div>

      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const csrfToken = ref('')
const form = ref({
  title: '',
  content: ''
})

// Get CSRF token from server
const getCsrfToken = async () => {
  try {
    const response = await fetch('/api/csrf-token', {
      method: 'GET',
      credentials: 'include'
    })

    if (response.ok) {
      const data = await response.json()
      csrfToken.value = data.token
    }
  } catch (error) {
    console.error('Failed to get CSRF token:', error)
  }
}

const submitForm = async () => {
  try {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken.value,
        'X-Requested-With': 'XMLHttpRequest'
      },
      credentials: 'include',
      body: JSON.stringify(form.value)
    })

    if (response.ok) {
      console.log('Form submitted successfully')
    } else {
      console.error('Submission failed')
    }
  } catch (error) {
    console.error('Network error:', error)
  }
}

onMounted(() => {
  getCsrfToken()
})
</script>
```

### SameSite Cookie Configuration

```typescript
// utils/csrf.ts
export class CSRFProtection {
  private static token: string | null = null

  static async getToken(): Promise<string> {
    if (!this.token) {
      const response = await fetch('/api/csrf-token', {
        credentials: 'include'
      })
      const data = await response.json()
      this.token = data.token
    }
    return this.token
  }

  static async refreshToken(): Promise<string> {
    this.token = null
    return this.getToken()
  }

  static getTokenFromMeta(): string | null {
    const meta = document.querySelector('meta[name="csrf-token"]')
    return meta?.getAttribute('content') || null
  }
}
```

## Secure Authentication

### JWT Token Management

```vue
<template>
  <div>
    <h2>Secure Authentication</h2>

    <div v-if="!isAuthenticated">
      <form @submit.prevent="login">
        <div>
          <label for="email">Email</label>
          <input
            id="email"
            v-model="loginForm.email"
            type="email"
            required
          />
        </div>

        <div>
          <label for="password">Password</label>
          <input
            id="password"
            v-model="loginForm.password"
            type="password"
            required
            minlength="8"
          />
        </div>

        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
    </div>

    <div v-else>
      <p>Welcome, {{ user?.name }}!</p>
      <button @click="logout">Logout</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'

interface User {
  id: number
  name: string
  email: string
}

const user = ref<User | null>(null)
const isLoading = ref(false)
const loginForm = reactive({
  email: '',
  password: ''
})

const isAuthenticated = computed(() => !!user.value)

// Secure token storage
const setToken = (token: string) => {
  // Store in httpOnly cookie (preferred) or secure localStorage
  localStorage.setItem('auth_token', token)
}

const getToken = (): string | null => {
  return localStorage.getItem('auth_token')
}

const removeToken = () => {
  localStorage.removeItem('auth_token')
}

// Login with secure practices
const login = async () => {
  isLoading.value = true

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      credentials: 'include',
      body: JSON.stringify({
        email: loginForm.email.trim().toLowerCase(),
        password: loginForm.password
      })
    })

    if (response.ok) {
      const data = await response.json()

      // Store token securely
      setToken(data.token)
      user.value = data.user

      // Clear form
      loginForm.email = ''
      loginForm.password = ''
    } else {
      const error = await response.json()
      console.error('Login failed:', error.message)
    }
  } catch (error) {
    console.error('Login error:', error)
  } finally {
    isLoading.value = false
  }
}

const logout = async () => {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'X-Requested-With': 'XMLHttpRequest'
      },
      credentials: 'include'
    })
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    removeToken()
    user.value = null
  }
}

// Check authentication status
const checkAuth = async () => {
  const token = getToken()
  if (!token) return

  try {
    const response = await fetch('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Requested-With': 'XMLHttpRequest'
      },
      credentials: 'include'
    })

    if (response.ok) {
      const data = await response.json()
      user.value = data.user
    } else {
      // Token invalid, remove it
      removeToken()
    }
  } catch (error) {
    console.error('Auth check error:', error)
    removeToken()
  }
}

onMounted(() => {
  checkAuth()
})
</script>
```

### Password Security

```typescript
// utils/password.ts
export class PasswordSecurity {
  // Password strength validation
  static validatePassword(password: string): {
    isValid: boolean
    score: number
    feedback: string[]
  } {
    const feedback: string[] = []
    let score = 0

    // Length check
    if (password.length >= 8) {
      score += 1
    } else {
      feedback.push('Password must be at least 8 characters long')
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 1
    } else {
      feedback.push('Password must contain at least one uppercase letter')
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 1
    } else {
      feedback.push('Password must contain at least one lowercase letter')
    }

    // Number check
    if (/\d/.test(password)) {
      score += 1
    } else {
      feedback.push('Password must contain at least one number')
    }

    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1
    } else {
      feedback.push('Password must contain at least one special character')
    }

    return {
      isValid: score >= 4,
      score,
      feedback
    }
  }

  // Hash password (client-side hashing before sending)
  static async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }
}
```

## Input Validation

### Client-side Validation

```vue
<template>
  <div>
    <h2>Secure Form Validation</h2>

    <form @submit.prevent="submitForm">
      <div>
        <label for="username">Username</label>
        <input
          id="username"
          v-model="form.username"
          type="text"
          pattern="[a-zA-Z0-9_]{3,20}"
          maxlength="20"
          required
          @blur="validateUsername"
        />
        <div v-if="errors.username" class="error">{{ errors.username }}</div>
      </div>

      <div>
        <label for="email">Email</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          maxlength="255"
          required
          @blur="validateEmail"
        />
        <div v-if="errors.email" class="error">{{ errors.email }}</div>
      </div>

      <div>
        <label for="age">Age</label>
        <input
          id="age"
          v-model.number="form.age"
          type="number"
          min="13"
          max="120"
          required
          @blur="validateAge"
        />
        <div v-if="errors.age" class="error">{{ errors.age }}</div>
      </div>

      <div>
        <label for="website">Website</label>
        <input
          id="website"
          v-model="form.website"
          type="url"
          pattern="https?://.*"
          @blur="validateWebsite"
        />
        <div v-if="errors.website" class="error">{{ errors.website }}</div>
      </div>

      <button type="submit" :disabled="!isFormValid">Submit</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

interface FormData {
  username: string
  email: string
  age: number | null
  website: string
}

const form = reactive<FormData>({
  username: '',
  email: '',
  age: null,
  website: ''
})

const errors = reactive<Partial<FormData>>({})

// Validation functions
const validateUsername = () => {
  const username = form.username.trim()

  if (!username) {
    errors.username = 'Username is required'
    return
  }

  if (username.length < 3) {
    errors.username = 'Username must be at least 3 characters'
    return
  }

  if (username.length > 20) {
    errors.username = 'Username must be less than 20 characters'
    return
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.username = 'Username can only contain letters, numbers, and underscores'
    return
  }

  delete errors.username
}

const validateEmail = () => {
  const email = form.email.trim().toLowerCase()

  if (!email) {
    errors.email = 'Email is required'
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    errors.email = 'Please enter a valid email address'
    return
  }

  delete errors.email
}

const validateAge = () => {
  const age = form.age

  if (age === null || age === undefined) {
    errors.age = 'Age is required'
    return
  }

  if (age < 13) {
    errors.age = 'You must be at least 13 years old'
    return
  }

  if (age > 120) {
    errors.age = 'Please enter a valid age'
    return
  }

  delete errors.age
}

const validateWebsite = () => {
  const website = form.website.trim()

  if (!website) {
    delete errors.website
    return
  }

  try {
    const url = new URL(website)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      errors.website = 'Website must use HTTP or HTTPS protocol'
      return
    }
  } catch {
    errors.website = 'Please enter a valid website URL'
    return
  }

  delete errors.website
}

const isFormValid = computed(() => {
  return Object.keys(errors).length === 0 &&
         form.username &&
         form.email &&
         form.age !== null
})

const submitForm = async () => {
  // Final validation
  validateUsername()
  validateEmail()
  validateAge()
  validateWebsite()

  if (!isFormValid.value) return

  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': getCsrfToken()
      },
      body: JSON.stringify(form)
    })

    if (response.ok) {
      console.log('Form submitted successfully')
    }
  } catch (error) {
    console.error('Submission error:', error)
  }
}

const getCsrfToken = (): string => {
  const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
  return token || ''
}
</script>

<style scoped>
.error {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

input:invalid {
  border-color: #dc3545;
}
</style>
```

## Environment Variables Security

### Secure Configuration

```typescript
// config/security.ts
interface SecurityConfig {
  apiUrl: string
  wsUrl: string
  enableCors: boolean
  allowedOrigins: string[]
  rateLimit: {
    windowMs: number
    max: number
  }
}

export const securityConfig: SecurityConfig = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  wsUrl: import.meta.env.VITE_WS_URL || 'ws://localhost:3000',
  enableCors: import.meta.env.VITE_ENABLE_CORS === 'true',
  allowedOrigins: (import.meta.env.VITE_ALLOWED_ORIGINS || '').split(','),
  rateLimit: {
    windowMs: parseInt(import.meta.env.VITE_RATE_LIMIT_WINDOW || '900000'), // 15 minutes
    max: parseInt(import.meta.env.VITE_RATE_LIMIT_MAX || '100')
  }
}

// Validate environment variables
export const validateEnvironment = () => {
  const requiredVars = ['VITE_API_URL']
  const missing = requiredVars.filter(varName => !import.meta.env[varName])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}
```

### API Client with Security

```typescript
// utils/apiClient.ts
class SecureApiClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>

  constructor(baseURL: string) {
    this.baseURL = baseURL
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  }

  private async getAuthToken(): Promise<string | null> {
    return localStorage.getItem('auth_token')
  }

  private async getCsrfToken(): Promise<string | null> {
    const meta = document.querySelector('meta[name="csrf-token"]')
    return meta?.getAttribute('content') || null
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    // Add authentication header
    const token = await this.getAuthToken()
    const headers = { ...this.defaultHeaders, ...options.headers }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // Add CSRF token for state-changing requests
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method || 'GET')) {
      const csrfToken = await this.getCsrfToken()
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken
      }
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return response.json()
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

export const apiClient = new SecureApiClient(import.meta.env.VITE_API_URL)
```

## HTTPS Implementation

### Force HTTPS in Production

```typescript
// utils/security.ts
export const forceHttps = () => {
  if (import.meta.env.PROD && location.protocol !== 'https:') {
    location.replace(`https:${location.href.substring(location.protocol.length)}`)
  }
}

// Check for secure context
export const isSecureContext = (): boolean => {
  return window.isSecureContext
}

// Validate HTTPS certificates
export const validateCertificate = async (): Promise<boolean> => {
  if (!isSecureContext()) return false

  try {
    const response = await fetch('/api/health', {
      method: 'HEAD',
      mode: 'cors'
    })
    return response.ok
  } catch {
    return false
  }
}
```

## Content Security Policy

### CSP Implementation

```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
">
```

### CSP Nonce Implementation

```vue
<template>
  <div>
    <h2>CSP Protected Content</h2>

    <!-- Inline script with nonce -->
    <script :nonce="nonce">
      console.log('This script is CSP compliant')
    </script>

    <!-- Inline style with nonce -->
    <style :nonce="nonce">
      .secure-content {
        color: #333;
      }
    </style>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const nonce = ref('')

onMounted(() => {
  // Get nonce from meta tag
  const meta = document.querySelector('meta[name="csp-nonce"]')
  nonce.value = meta?.getAttribute('content') || ''
})
</script>
```

## Dependency Security

### Security Audit

```bash
# Install security audit tools
npm install --save-dev audit-ci

# Run security audit
npm audit

# Fix vulnerabilities
npm audit fix

# Check for outdated packages
npm outdated
```

### Package Security Configuration

```json
{
  "scripts": {
    "audit": "npm audit",
    "audit:fix": "npm audit fix",
    "security:check": "audit-ci --config audit-ci.json"
  },
  "audit-ci": {
    "moderate": true,
    "high": true,
    "critical": true
  }
}
```

## API Security

### Rate Limiting

```typescript
// composables/useRateLimit.ts
import { ref, computed } from 'vue'

interface RateLimitState {
  requests: number[]
  limit: number
  windowMs: number
}

export function useRateLimit(limit: number = 100, windowMs: number = 900000) {
  const state = ref<RateLimitState>({
    requests: [],
    limit,
    windowMs
  })

  const isRateLimited = computed(() => {
    const now = Date.now()
    const windowStart = now - state.value.windowMs

    // Remove old requests
    state.value.requests = state.value.requests.filter(
      timestamp => timestamp > windowStart
    )

    return state.value.requests.length >= state.value.limit
  })

  const makeRequest = async <T>(requestFn: () => Promise<T>): Promise<T> => {
    if (isRateLimited.value) {
      throw new Error('Rate limit exceeded')
    }

    state.value.requests.push(Date.now())
    return requestFn()
  }

  return {
    isRateLimited,
    makeRequest
  }
}
```

### Request Validation

```typescript
// utils/requestValidator.ts
export class RequestValidator {
  static validateRequest(request: Request): boolean {
    // Check Content-Type
    const contentType = request.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      return false
    }

    // Check User-Agent
    const userAgent = request.headers.get('user-agent')
    if (!userAgent || userAgent.length < 10) {
      return false
    }

    // Check Referer
    const referer = request.headers.get('referer')
    if (referer && !this.isValidReferer(referer)) {
      return false
    }

    return true
  }

  private static isValidReferer(referer: string): boolean {
    try {
      const url = new URL(referer)
      const allowedOrigins = [
        'https://yourdomain.com',
        'https://www.yourdomain.com'
      ]
      return allowedOrigins.includes(url.origin)
    } catch {
      return false
    }
  }
}
```

## Common Vulnerabilities

### OWASP Top 10 Prevention

```vue
<template>
  <div>
    <h2>Security Best Practices</h2>

    <!-- 1. Injection Prevention -->
    <div>
      <label for="search">Search</label>
      <input
        id="search"
        v-model="searchQuery"
        type="text"
        @input="sanitizeInput"
      />
    </div>

    <!-- 2. XSS Prevention -->
    <div v-html="sanitizedContent"></div>

    <!-- 3. Broken Authentication Prevention -->
    <div v-if="isAuthenticated">
      <p>Welcome, {{ user.name }}!</p>
      <button @click="logout">Logout</button>
    </div>

    <!-- 4. Sensitive Data Exposure Prevention -->
    <div>
      <input
        v-model="password"
        type="password"
        autocomplete="current-password"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import DOMPurify from 'dompurify'

const searchQuery = ref('')
const user = ref(null)
const password = ref('')

const isAuthenticated = computed(() => !!user.value)

// 1. Injection Prevention
const sanitizeInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  target.value = target.value.replace(/[<>]/g, '')
}

// 2. XSS Prevention
const sanitizedContent = computed(() => {
  const content = searchQuery.value
  return DOMPurify.sanitize(content)
})

// 3. Secure Authentication
const logout = () => {
  // Clear sensitive data
  user.value = null
  password.value = ''

  // Clear tokens
  localStorage.removeItem('auth_token')

  // Redirect to login
  window.location.href = '/login'
}
</script>
```

## Security Testing

### Automated Security Tests

```typescript
// tests/security.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SecureForm from '../components/SecureForm.vue'

describe('Security Tests', () => {
  it('should prevent XSS attacks', async () => {
    const wrapper = mount(SecureForm)

    const maliciousInput = '<script>alert("xss")</script>'
    await wrapper.find('input').setValue(maliciousInput)

    // Check that script tags are sanitized
    expect(wrapper.html()).not.toContain('<script>')
  })

  it('should validate input length', async () => {
    const wrapper = mount(SecureForm)

    const longInput = 'a'.repeat(1000)
    await wrapper.find('input').setValue(longInput)

    // Check that input is truncated
    expect(wrapper.find('input').element.value.length).toBeLessThan(1000)
  })

  it('should prevent CSRF attacks', async () => {
    const wrapper = mount(SecureForm)

    // Check that CSRF token is present
    const csrfToken = wrapper.find('input[name="_token"]')
    expect(csrfToken.exists()).toBe(true)
  })
})
```

## Production Security

### Security Headers

```typescript
// config/security.ts
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
}
```

### Security Monitoring

```typescript
// utils/securityMonitor.ts
export class SecurityMonitor {
  private static instance: SecurityMonitor

  static getInstance() {
    if (!this.instance) {
      this.instance = new SecurityMonitor()
    }
    return this.instance
  }

  logSecurityEvent(event: string, details: any) {
    console.warn(`Security Event: ${event}`, details)

    // Send to security monitoring service
    fetch('/api/security/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event,
        details,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      })
    }).catch(error => {
      console.error('Failed to log security event:', error)
    })
  }

  detectSuspiciousActivity() {
    // Monitor for suspicious patterns
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i
    ]

    // Check form inputs
    document.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement
      const value = target.value

      for (const pattern of suspiciousPatterns) {
        if (pattern.test(value)) {
          this.logSecurityEvent('Suspicious Input Detected', {
            input: value,
            element: target.tagName,
            id: target.id
          })
        }
      }
    })
  }
}
```

## Best Practices Summary

1. **Always sanitize user input**
2. **Use HTTPS in production**
3. **Implement proper authentication**
4. **Validate all inputs**
5. **Use Content Security Policy**
6. **Keep dependencies updated**
7. **Monitor for security events**
8. **Use secure headers**
9. **Implement rate limiting**
10. **Regular security audits**

---

**Remember**: Security is an ongoing process. Regularly update your security measures, monitor for vulnerabilities, and stay informed about new security threats and best practices.
