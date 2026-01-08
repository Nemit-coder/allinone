# Complete Authentication Flow Documentation

This document explains the entire authentication system flow from signup to dashboard access.

---

## 📋 Table of Contents

1. [Registration Flow (Form)](#1-registration-flow-form)
2. [Registration Flow (Google OAuth)](#2-registration-flow-google-oauth)
3. [Login Flow (Form)](#3-login-flow-form)
4. [Login Flow (Google OAuth)](#4-login-flow-google-oauth)
5. [Token Management](#5-token-management)
6. [Protected Routes](#6-protected-routes)
7. [Token Refresh Mechanism](#7-token-refresh-mechanism)
8. [Logout Flow](#8-logout-flow)
9. [Dashboard Access](#9-dashboard-access)

---

## 1. Registration Flow (Form)

### Step-by-Step Process:

#### **Frontend: User Fills Registration Form**

**File:** `frontend/src/pages/Register.tsx`

```typescript
// User enters: username, fullname, email, password, avatar (optional)
const [formData, setFormData] = useState({
  username: "",
  fullname: "",
  email: "",
  password: "",
})
```

#### **Frontend: Form Submission**

**File:** `frontend/src/pages/Register.tsx` (lines 42-75)

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)

  const finalData = {
    userName: formData.username,
    fullName: formData.fullname,
    email: formData.email,
    password: formData.password,
    avatar: avatarPreview || undefined,
  }
  
  // Uses centralized API client
  const res = await api.post("/users/register", finalData)
```

**What happens:**
- Form data is collected and formatted
- Request sent to `POST http://localhost:3000/api/v1/users/register`
- Uses `api` client from `frontend/src/lib/api.ts` (includes interceptors)

#### **Backend: Registration Endpoint**

**File:** `backend/src/routes/user.route.ts` (line 9)

```typescript
router.post('/register', registerUser)
```

**File:** `backend/src/controllers/user.controller.ts` (lines 9-82)

```typescript
const registerUser = async (req : Request, res : Response) => {
    // 1. Validate required fields
    if (!email || !password || !userName || !fullName) {
        return res.status(400).json({ success: false, message: '...' })
    }

    // 2. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(!emailRegex.test(email)) { ... }

    // 3. Validate password length
    if (password.length < 6) { ... }

    // 4. Check if user already exists
    const fetchedUser = await User.findOne({email})
    if(fetchedUser) { return res.status(409).json(...) }

    // 5. Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // 6. Create user in database
    const createUser = await User.create({
        userName: userName,
        fullName: fullName,
        email: normalizedEmail,
        password: passwordHash,
        avatar: avatar,
    })

    // 7. Generate tokens (NEW - automatic login after registration)
    const accessToken = generateAccessToken(createUser._id.toString())
    const refreshToken = generateRefreshToken(createUser._id.toString())

    // 8. Save refresh token to user document
    createUser.refreshToken = refreshToken
    await createUser.save()

    // 9. Set refresh token as httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
    })

    // 10. Return access token in response body
    res.status(200).json({ 
        success: true,
        message: 'User Created Successfully',
        accessToken: accessToken,  // Frontend stores this
        user: { id: createUser._id, email: normalizedEmail }
    })
}
```

**What happens:**
- Validates input
- Checks for duplicate email
- Hashes password with bcrypt
- Creates user in MongoDB
- Generates JWT tokens
- Stores refresh token in database and cookie
- Returns access token to frontend

#### **Backend: Token Generation**

**File:** `backend/src/utils/token.ts`

```typescript
export const generateAccessToken = (userId: string) => {
    const options: SignOptions = { expiresIn: env.ACCESS_TOKEN_EXPIRY }
    return jwt.sign(
        {id: userId},  // Payload contains 'id' (not 'userId')
        env.ACCESS_TOKEN_SECRET!,
        options
    )
}

export const generateRefreshToken = (userId: string) => {
  const options: SignOptions = { expiresIn: env.REFRESH_TOKEN_EXPIRY }
  return jwt.sign(
    { id: userId },  // Same payload structure
    env.REFRESH_TOKEN_SECRET!,
    options
  )
}
```

**Important:** Token payload uses `id` field, not `userId`. This matches what the auth middleware expects.

#### **Frontend: Store Access Token**

**File:** `frontend/src/pages/Register.tsx` (lines 67-75)

```typescript
const res = await api.post("/users/register", finalData)
if (res.data?.success === true && res.data?.accessToken) {
    setAccessToken(res.data.accessToken)  // Store token
    toast({ title: "Account created", ... })
    setTimeout(() => {
      navigate("/dashboard")  // Redirect to dashboard
    }, 500)
}
```

**File:** `frontend/src/lib/api.ts`

```typescript
export const setAccessToken = (token: string | null) => {
  accessToken = token  // In-memory variable
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)  // Persist to localStorage
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}
```

**What happens:**
- Access token stored in memory (module variable)
- Access token stored in localStorage (persists across page refreshes)
- Refresh token stored in httpOnly cookie (automatic, handled by browser)

---

## 2. Registration Flow (Google OAuth)

### Step-by-Step Process:

#### **Frontend: User Clicks "Sign up with Google"**

**File:** `frontend/src/pages/Register.tsx` (line 115)

```typescript
const handleGoogleSignUp = () => {
  window.location.href = "http://localhost:3000/api/v1/auth/google"
}
```

**What happens:**
- Browser redirects to backend Google OAuth endpoint
- User leaves frontend application

#### **Backend: Google OAuth Initiation**

**File:** `backend/src/routes/auth.route.ts` (lines 9-15)

```typescript
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false
  })
)
```

**What happens:**
- Passport.js redirects user to Google login page
- User authenticates with Google
- Google redirects back to callback URL

#### **Backend: Google OAuth Callback**

**File:** `backend/src/routes/auth.route.ts` (lines 18-41)

```typescript
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req: any, res) => {
    const user = req.user  // User from Google (created/found by Passport)

    // Generate tokens
    const accessToken = generateAccessToken(user._id.toString())
    const refreshToken = generateRefreshToken(user._id.toString())

    // Save refresh token
    user.refreshToken = refreshToken
    await user.save()

    // Set refresh token cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    // Redirect to frontend with access token in URL
    res.redirect(
      `http://localhost:5173/auth/callback?token=${accessToken}`
    )
  }
)
```

**What happens:**
- Passport middleware authenticates user
- User object is available (either existing or newly created)
- Tokens generated same way as form registration
- Refresh token saved to database and cookie
- User redirected to frontend callback page with access token in URL

#### **Frontend: OAuth Callback Handler**

**File:** `frontend/src/pages/AuthCallback.tsx`

```typescript
export default function AuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    const token = searchParams.get("token")  // Extract token from URL
    
    if (token) {
      setAccessToken(token)  // Store token (same function as form registration)
      toast({ title: "Login successful", ... })
      navigate("/dashboard")  // Redirect to dashboard
    } else {
      toast({ variant: "destructive", title: "Authentication failed", ... })
      navigate("/signin")
    }
  }, [searchParams, navigate, toast])
  
  return <div>Completing sign in...</div>
}
```

**What happens:**
- Extracts access token from URL query parameter
- Stores token using same `setAccessToken` function
- Redirects to dashboard

---

## 3. Login Flow (Form)

### Step-by-Step Process:

#### **Frontend: User Fills Login Form**

**File:** `frontend/src/pages/SignIn.tsx` (lines 21-22)

```typescript
const [email, setEmail] = useState("")
const [password, setPassword] = useState("")
```

#### **Frontend: Form Submission**

**File:** `frontend/src/pages/SignIn.tsx` (lines 24-58)

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)

  const finalData = { email: email, password: password }

  try {
    const res = await api.post("/users/login", finalData)
    if (res.data?.success === true && res.data?.accessToken) {
      setAccessToken(res.data.accessToken)  // Store token
      onSignIn()  // Update App state
      toast({ title: "Login successful", ... })
      setTimeout(() => {
        navigate("/dashboard")
      }, 500)
    }
  } catch (error) {
    // Handle errors
  }
}
```

#### **Backend: Login Endpoint**

**File:** `backend/src/routes/user.route.ts` (line 9)

```typescript
router.post('/login', loginUser)
```

**File:** `backend/src/controllers/user.controller.ts` (lines 108-154)

```typescript
const loginUser = async (req: Request, res: Response) => {
    const {email, password} = req.body
    
    // 1. Find user by email
    const fetchedUser = await User.findOne({email})
    if(!fetchedUser) {
        return res.status(404).json({message: "User not found"})
    }

    // 2. Verify password
    const decodedPassword = await bcrypt.compare(password, fetchedUser.password)
    if(!decodedPassword){
        return res.status(401).json({message: "Invalid Password"})
    }

    // 3. Generate tokens
    const accessToken = generateAccessToken(fetchedUser._id.toString())
    const refreshToken = generateRefreshToken(fetchedUser._id.toString())

    // 4. Save refresh token
    fetchedUser.refreshToken = refreshToken
    await fetchedUser.save()

    // 5. Set refresh token cookie
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    // 6. Return access token
    res.status(200).json({
        success: true,
        message: "Login successful",
        accessToken: accessToken,
        user: fetchedUser
    })
}
```

**What happens:**
- Finds user by email
- Compares password hash with bcrypt
- Generates new tokens
- Updates refresh token in database
- Sets refresh token cookie
- Returns access token

---

## 4. Login Flow (Google OAuth)

**File:** `frontend/src/pages/SignIn.tsx` (line 86)

```typescript
const handleGoogleSignIn = () => {
  window.location.href = "http://localhost:3000/api/v1/auth/google"
}
```

**What happens:**
- Same flow as Google registration
- Uses same backend endpoints (`/auth/google` and `/auth/google/callback`)
- Same callback handler (`AuthCallback.tsx`)

---

## 5. Token Management

### Token Storage Strategy

**File:** `frontend/src/lib/api.ts`

```typescript
const TOKEN_KEY = "accessToken"

// In-memory variable (fast access)
let accessToken: string | null = getStoredToken()

// Get token from localStorage (persists across refreshes)
const getStoredToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY)
  }
  return null
}

export const setAccessToken = (token: string | null) => {
  accessToken = token  // Update in-memory
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)  // Persist to localStorage
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

export const getAccessToken = (): string | null => {
  return accessToken || getStoredToken()  // Check memory first, then localStorage
}
```

**Why two storage locations?**
- **In-memory variable:** Fast access, cleared on page refresh
- **localStorage:** Persists across page refreshes, survives browser restarts
- **httpOnly cookie (refresh token):** Secure, can't be accessed by JavaScript, sent automatically

### Token Types

1. **Access Token:**
   - Short-lived (typically 15 minutes - 1 hour)
   - Stored in localStorage + memory
   - Sent in `Authorization: Bearer <token>` header
   - Used for API authentication

2. **Refresh Token:**
   - Long-lived (typically 7 days)
   - Stored in httpOnly cookie
   - Sent automatically with requests (via `withCredentials: true`)
   - Used to get new access tokens

---

## 6. Protected Routes

### How Routes Are Protected

**File:** `frontend/src/App.tsx` (lines 29-36)

```typescript
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard isAuthenticated={isAuthenticated} />
    </ProtectedRoute>
  }
/>
```

**File:** `frontend/src/components/ProtectedRoute.tsx`

```typescript
import { Navigate } from "react-router-dom"
import { getAccessToken } from "@/src/lib/api"

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const accessToken = getAccessToken()  // Check if token exists
  const isLoggedIn = !!accessToken

  return isLoggedIn ? children : <Navigate to="/signin" />
}
```

**What happens:**
- Before rendering protected component, checks for access token
- If token exists → render component
- If no token → redirect to `/signin`

### Backend Route Protection

**File:** `backend/src/routes/user.route.ts` (line 7)

```typescript
router.get('/me', verifyJwt, getCurrentUser)  // verifyJwt middleware protects route
```

**File:** `backend/src/middlewares/auth.middleware.ts`

```typescript
const verifyJwt = (req: Request, res: Response, next: any) => {
  // 1. Extract token from Authorization header
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token" })
  }

  // 2. Get token string
  const token = authHeader.split(" ")[1]
  if (!token) {
    return res.status(401).json({ message: "Invalid token format" })
  }
  
  // 3. Verify token signature and expiry
  jwt.verify(token, env.ACCESS_TOKEN_SECRET as string, (err: any, decoded: any) => {
    if (err) return res.status(403).json({ message: "Invalid token" })
    
    // 4. Attach decoded payload to request object
    req.user = decoded  // Contains { id: "userId" }
    next()  // Continue to route handler
  })
}
```

**What happens:**
- Extracts token from `Authorization: Bearer <token>` header
- Verifies token signature and expiry
- If valid → attaches `req.user = { id: "userId" }` to request
- If invalid → returns 401/403 error

---

## 7. Token Refresh Mechanism

### Automatic Token Refresh

**File:** `frontend/src/lib/api.ts` (lines 22-40)

```typescript
// Axios response interceptor
api.interceptors.response.use(
  (response) => response,  // Pass through successful responses
  async (error) => {
    const originalRequest = error.config

    // If 401 error and haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true  // Mark as retried (prevent infinite loop)

      // Call refresh endpoint
      const res = await api.post("/auth/refresh")
      
      // Update access token
      setAccessToken(res.data.accessToken)

      // Retry original request with new token
      originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`
      return api(originalRequest)
    }

    return Promise.reject(error)
  }
)
```

**What happens:**
1. API request fails with 401 (token expired)
2. Interceptor catches error
3. Calls `/auth/refresh` endpoint (refresh token sent automatically via cookie)
4. Receives new access token
5. Updates stored access token
6. Retries original request with new token
7. User doesn't notice anything (seamless refresh)

### Backend Refresh Endpoint

**File:** `backend/src/routes/auth.route.ts` (line 8)

```typescript
router.post("/refresh", refreshAccessToken)
```

**File:** `backend/src/controllers/auth.controller.ts` (lines 7-23)

```typescript
export const refreshAccessToken = async (req: Request, res: Response) => {
  // 1. Get refresh token from cookie
  const refreshToken = req.cookies.refreshToken

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token" })
  }

  // 2. Find user with this refresh token
  const user = await User.findOne({ refreshToken })
  if (!user) return res.status(403).json({ message: "Invalid refresh token" })

  // 3. Verify refresh token signature and expiry
  jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET!, (err: any, decoded: any) => {
    if (err) return res.status(403).json({ message: "Token expired" })

    // 4. Generate new access token
    const accessToken = generateAccessToken(decoded.id)
    console.log("access token generated again")
    
    // 5. Return new access token
    res.json({ accessToken })
  })
}
```

**What happens:**
- Extracts refresh token from httpOnly cookie
- Finds user with matching refresh token in database
- Verifies refresh token is valid
- Generates new access token
- Returns new access token (refresh token stays same)

---

## 8. Logout Flow

### Frontend Logout

**File:** `frontend/src/components/AppLayout.tsx` (lines 14-18)

```typescript
const handleLogout = async () => {
  try {
    await api.post("/auth/logout")  // Call backend logout
  } catch (error) {
    console.error("Logout error:", error)
  } finally {
    setAccessToken(null)  // Clear access token from memory and localStorage
    window.location.href = "/signin"  // Redirect to signin
  }
}
```

**What happens:**
- Calls backend logout endpoint
- Clears access token from memory and localStorage
- Redirects to signin page

### Backend Logout Endpoint

**File:** `backend/src/routes/auth.route.ts` (line 11)

```typescript
router.post("/logout", logoutUser)
```

**File:** `backend/src/controllers/auth.controller.ts` (lines 25-42)

```typescript
export const logoutUser = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
  
    // 1. Clear refresh token from database
    if (refreshToken) {
      await User.findOneAndUpdate(
        { refreshToken },
        { refreshToken: null }  // Remove refresh token
      )
    }
  
    // 2. Clear refresh token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict"
    })
  
    // 3. Return success
    res.status(200).json({ success: true })
}
```

**What happens:**
- Removes refresh token from user document in database
- Clears refresh token cookie
- Frontend clears access token
- User is logged out

---

## 9. Dashboard Access

### Frontend Dashboard

**File:** `frontend/src/pages/Dashboard.tsx` (lines 17-23)

```typescript
useEffect(() => {
  api.get("/users/me")  // Fetch current user data
    .then(res => console.log("User:", res.data))
    .catch(() => {
      window.location.href = "/signin"  // Redirect if unauthorized
    })
}, [])
```

**What happens:**
- On component mount, fetches current user data
- Uses `/users/me` endpoint (protected route)
- If successful → displays user data
- If fails (401) → redirects to signin

### Backend Get Current User

**File:** `backend/src/routes/user.route.ts` (line 7)

```typescript
router.get('/me', verifyJwt, getCurrentUser)  // Protected by verifyJwt middleware
```

**File:** `backend/src/controllers/user.controller.ts` (lines 85-105)

```typescript
const getCurrentUser = async (req: Request, res: Response) => {
    // req.user.id is set by verifyJwt middleware
    const userId = req.user!.id
    
    // Find user, exclude password and refreshToken
    const user = await User.findById(userId).select('-password -refreshToken')
    
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        })
    }

    res.status(200).json({
        success: true,
        user
    })
}
```

**What happens:**
1. Request includes `Authorization: Bearer <accessToken>` header
2. `verifyJwt` middleware verifies token and sets `req.user.id`
3. Controller uses `req.user.id` to find user
4. Returns user data (without sensitive fields)

---

## 🔄 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    REGISTRATION FLOW                         │
└─────────────────────────────────────────────────────────────┘

Form Registration:
User → Register.tsx → api.post("/users/register")
                      ↓
                   Backend validates → Creates user → Generates tokens
                      ↓
                   Returns { accessToken, user }
                      ↓
                   setAccessToken(token) → localStorage + memory
                      ↓
                   navigate("/dashboard")

Google Registration:
User → Register.tsx → window.location = "/auth/google"
                      ↓
                   Backend → Google OAuth → User authenticates
                      ↓
                   Google callback → Generate tokens → Save refresh token
                      ↓
                   Redirect to "/auth/callback?token=..."
                      ↓
                   AuthCallback.tsx → setAccessToken(token)
                      ↓
                   navigate("/dashboard")


┌─────────────────────────────────────────────────────────────┐
│                      LOGIN FLOW                              │
└─────────────────────────────────────────────────────────────┘

Form Login:
User → SignIn.tsx → api.post("/users/login")
                    ↓
                 Backend validates credentials → Generates tokens
                    ↓
                 Returns { accessToken, user }
                    ↓
                 setAccessToken(token) → localStorage + memory
                    ↓
                 navigate("/dashboard")

Google Login:
User → SignIn.tsx → window.location = "/auth/google"
                    ↓
                 (Same as Google Registration flow)


┌─────────────────────────────────────────────────────────────┐
│                  PROTECTED ROUTE ACCESS                     │
└─────────────────────────────────────────────────────────────┘

User → Dashboard → ProtectedRoute checks getAccessToken()
                  ↓
               Token exists? → Yes → Render Dashboard
                              ↓
                           Dashboard mounts → api.get("/users/me")
                                              ↓
                                           Request includes Authorization header
                                              ↓
                                           Backend verifyJwt middleware
                                              ↓
                                           Valid? → Yes → Return user data
                                                   → No → 401 error
                                                          ↓
                                                       Interceptor catches 401
                                                          ↓
                                                       Call /auth/refresh
                                                          ↓
                                                       Get new access token
                                                          ↓
                                                       Retry /users/me
                                                          ↓
                                                       Success → Display data


┌─────────────────────────────────────────────────────────────┐
│                    TOKEN REFRESH FLOW                       │
└─────────────────────────────────────────────────────────────┘

API Request → 401 Error (token expired)
              ↓
           Interceptor catches error
              ↓
           api.post("/auth/refresh") → Cookie sent automatically
              ↓
           Backend: Extract refresh token from cookie
              ↓
           Find user with refresh token
              ↓
           Verify refresh token
              ↓
           Generate new access token
              ↓
           Return { accessToken }
              ↓
           setAccessToken(newToken)
              ↓
           Retry original request with new token
              ↓
           Success!


┌─────────────────────────────────────────────────────────────┐
│                      LOGOUT FLOW                             │
└─────────────────────────────────────────────────────────────┘

User clicks logout → handleLogout()
                    ↓
                 api.post("/auth/logout")
                    ↓
                 Backend: Clear refresh token from DB
                    ↓
                 Backend: Clear refresh token cookie
                    ↓
                 setAccessToken(null) → Clear localStorage + memory
                    ↓
                 window.location = "/signin"
```

---

## 🔑 Key Concepts

### Why Two Tokens?

1. **Access Token (Short-lived):**
   - Used for API authentication
   - If stolen, damage is limited (expires quickly)
   - Stored in localStorage (accessible to JavaScript)

2. **Refresh Token (Long-lived):**
   - Used to get new access tokens
   - Stored in httpOnly cookie (not accessible to JavaScript - more secure)
   - If access token expires, use refresh token to get new one

### Security Features

1. **httpOnly Cookies:** Refresh token can't be accessed by JavaScript (XSS protection)
2. **Token Expiry:** Access tokens expire, limiting damage if stolen
3. **Token Verification:** Backend verifies token signature on every request
4. **Password Hashing:** Passwords never stored in plain text (bcrypt)

### Token Storage Locations

- **Access Token:** localStorage + in-memory variable
- **Refresh Token:** httpOnly cookie (automatic)
- **User ID in Token:** JWT payload contains `{ id: "userId" }`

---

## 📝 Summary

1. **Registration/Login:** User authenticates → Receives tokens → Tokens stored
2. **Protected Routes:** Check for token → If exists, allow access → If not, redirect to signin
3. **API Requests:** Include access token in header → Backend verifies → Returns data
4. **Token Expiry:** Access token expires → Interceptor catches 401 → Refresh token used → New access token obtained → Request retried
5. **Logout:** Clear tokens from storage → Clear refresh token from database → Redirect to signin

This system provides secure, persistent authentication with automatic token refresh!

