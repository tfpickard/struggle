# Security

This document outlines the security measures implemented in Chaotic Unity.

## Authentication

### Password Storage

Passwords are hashed using **bcrypt** with 12 rounds:

```typescript
const hash = await bcrypt.hash(password, 12);
```

**Why bcrypt?**
- Adaptive: Can increase cost factor as hardware improves
- Salt included: Each password gets unique salt
- Battle-tested: Industry standard for password hashing

**Cost factor (12 rounds)**:
- ~150-200ms to hash on modern hardware
- Slow enough to deter brute force
- Fast enough for good UX

### Password Requirements

Enforced on both client and server:

- Minimum 8 characters
- Maximum 128 characters
- At least one lowercase letter
- At least one uppercase letter
- At least one number

These requirements balance security and usability.

### Session Management

Sessions use cryptographically random tokens:

```typescript
const token = randomBytes(32).toString('hex'); // 256 bits of entropy
```

**Session storage**:
- Token stored in database with user reference
- Expiry timestamp (30 days default)
- User agent and IP address logged for security

**Session cookies**:
- `HttpOnly`: Prevents JavaScript access (XSS protection)
- `Secure`: Only transmitted over HTTPS
- `SameSite=Lax`: CSRF protection (allows navigation, blocks cross-site POST)
- Expiry matches session expiry

**Session lifecycle**:
1. User signs in → Session created
2. Token stored in cookie
3. Every request → Token validated
4. Session expires → User must re-authenticate
5. User signs out → Session deleted

### Session Invalidation

Sessions are invalidated on:
- Explicit sign out
- Session expiration (30 days)
- Password change (TODO: implement)

Periodic cleanup removes expired sessions:

```typescript
await prisma.session.deleteMany({
  where: { expiresAt: { lt: new Date() } }
});
```

## Authorization

### Role-Based Access Control (RBAC)

Two roles: `USER` and `ADMIN`

**USER** can:
- Create, read, update, delete own simulations
- View public simulations
- Update own profile

**ADMIN** can:
- All USER permissions
- View all simulations (including private)
- Moderate public content
- Manage users

**Implementation**:

```typescript
export async function requireRole(role: Role): Promise<AuthUser> {
  const user = await requireAuth();
  if (user.role !== role) {
    throw new Error("Forbidden");
  }
  return user;
}
```

### Resource Authorization

Simulations have visibility levels:
- `PRIVATE`: Only owner can see
- `UNLISTED`: Anyone with link can see
- `PUBLIC`: Listed in gallery

**Enforcement**:
- Server functions check `ownerId === user.id` for mutations
- Public endpoints filter by `visibility: PUBLIC`
- Unlisted endpoints check token validity but don't require ownership

## Input Validation

### Server-Side Validation

All user inputs are validated on the server:

**Email validation**:
- Regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Max length: 254 characters (RFC 5321)

**Username validation**:
- Alphanumeric, hyphens, underscores only
- Length: 3-32 characters
- Checked for uniqueness

**Password validation**:
- See password requirements above

**Simulation data**:
- Name: 1-100 characters
- Description: Max 1000 characters
- Tags: Array of strings, max 10 tags
- Parameters: JSON validated against schema

### Client-Side Validation

Client-side validation provides immediate feedback but **is not trusted** for security.

All validation is repeated server-side.

## CSRF Protection

SolidStart server actions are CSRF-safe by design:

1. POST requests require valid origin header
2. Actions are bound to specific routes
3. Tokens are validated on every request

No additional CSRF tokens needed.

## SQL Injection Protection

Prisma provides parameterized queries that prevent SQL injection:

```typescript
// Safe - parameterized
await prisma.user.findFirst({
  where: { email: userInput }
});

// Would be unsafe with raw SQL:
// SELECT * FROM users WHERE email = '${userInput}'
```

We **never use raw SQL** except for migrations.

## XSS Protection

### Output Encoding

Solid automatically escapes JSX content:

```tsx
<div>{userInput}</div>  // Safe - escaped
<div innerHTML={userInput}></div>  // Unsafe - raw HTML
```

We **never use `innerHTML`** with user-provided content.

### Content Security Policy (CSP)

TODO: Implement CSP headers:

```http
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'
```

This prevents execution of injected scripts.

## Rate Limiting

TODO: Implement rate limiting for:
- Sign up: 5 per hour per IP
- Sign in: 10 per hour per IP
- Password reset: 3 per hour per email
- Simulation creation: 100 per day per user

## Secrets Management

### Environment Variables

Sensitive data stored in environment variables:
- `DATABASE_URL`: PostgreSQL connection string

**Never committed to git** (in `.gitignore`).

### Production Secrets

In production (Vercel):
- Set via Vercel dashboard
- Encrypted at rest
- Only accessible to serverless functions

## Logging and Monitoring

### Activity Logs

Security-relevant events are logged:
- User registration
- Sign in / sign out
- Failed authentication attempts (TODO)
- Role changes (TODO)
- Simulation visibility changes (TODO)

**Log data**:
- User ID
- Event type
- Timestamp
- IP address
- User agent

**Privacy**: IP addresses are hashed for privacy.

### Monitoring

TODO: Implement alerts for:
- Unusual number of failed login attempts
- Rapid account creation from same IP
- Mass data exports

## Known Limitations

### Password Reset

Not yet implemented. Users who forget passwords must contact admin.

**TODO**: Implement secure password reset:
1. Request reset via email
2. Generate time-limited token
3. Email token to user
4. User sets new password
5. Invalidate all sessions

### Two-Factor Authentication (2FA)

Not yet implemented.

**TODO**: Add TOTP-based 2FA:
- QR code enrollment
- Backup codes
- Recovery process

### Email Verification

Email addresses are not verified. Users can sign up with any email.

**TODO**: Require email verification:
1. Send verification email on signup
2. User clicks link to verify
3. Account activated

### Brute Force Protection

No protection against brute force login attempts.

**TODO**: Implement rate limiting and account lockout:
- After 5 failed attempts, lock for 15 minutes
- After 10 failed attempts, lock for 1 hour
- Notify user via email

## Security Checklist

- [x] Passwords hashed with bcrypt
- [x] Secure session cookies
- [x] Input validation (server-side)
- [x] RBAC for authorization
- [x] SQL injection prevention (Prisma)
- [x] XSS prevention (Solid escaping)
- [x] CSRF protection (SolidStart)
- [ ] CSP headers
- [ ] Rate limiting
- [ ] Password reset
- [ ] Email verification
- [ ] 2FA
- [ ] Brute force protection
- [ ] Security headers (HSTS, X-Frame-Options, etc.)

## Reporting Security Issues

If you discover a security vulnerability, please email tom@pickard.dev with:

- Description of the issue
- Steps to reproduce
- Potential impact

Do not open public GitHub issues for security vulnerabilities.

## Security Audit History

- 2025-11-23: Initial security design and implementation
