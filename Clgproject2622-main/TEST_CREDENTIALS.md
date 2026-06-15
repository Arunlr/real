# Test Credentials & Quick Fixes

## 🔐 Authentication Error Fix

### Error: "Invalid login credentials"

This happens because you need to either:
1. **Create a new account first**, OR
2. **Disable email confirmation in Supabase**

---

## ✅ Solution 1: Create New Account (Recommended)

### Step 1: Sign Up
1. Go to `/local/signup` or `/signup`
2. Fill in the form:
   - **Name**: Test User
   - **Email**: test@example.com
   - **Phone**: 9876543210
   - **Password**: Test1234!
   - **Confirm Password**: Test1234!
3. Check "I agree to terms"
4. Click "Sign Up"

### Step 2: Check Email Confirmation Setting

If you see "Check Your Email" message:
- **Option A**: Check your email and click confirmation link
- **Option B**: Disable email confirmation (see below)

### Step 3: Login
1. Go to `/` or `/login`
2. Use credentials:
   - **Email**: test@example.com
   - **Password**: Test1234!
3. Click "Sign In"

---

## ✅ Solution 2: Disable Email Confirmation (Fastest)

This allows immediate signup without email verification.

### Steps:
1. Open Supabase Dashboard:
   ```
   https://supabase.com/dashboard/project/zbefuotnmdvbqietdhhf/auth/providers
   ```

2. Scroll to **Email Auth** section

3. Find **"Confirm email"** toggle

4. **Turn it OFF** (disable)

5. Click **Save**

6. Now try signing up again - should work immediately!

---

## 📸 Camera Error Fix

### Error: "Camera error: NotAllowedError: Permission denied"

**This is normal!** Most browsers block camera access by default.

### Solution: Use Demo Mode (No Camera Needed!)

When you see the camera error:

1. Look for the **PURPLE box** that says:
   ```
   ✨ RECOMMENDED: Use Demo Mode
   
   [Use Demo Mode (No Camera Needed)]
   
   Creates test photo with GPS
   ```

2. Click the **purple button**

3. Done! Photo uploaded without camera ✅

### Why Demo Mode?
- ✅ No camera permissions needed
- ✅ Works instantly
- ✅ Perfect for testing
- ✅ Simulates real GPS data

---

## 🎯 Complete Test Flow

### 1. Disable Email Confirmation
```
Dashboard → Auth → Providers → Email → Confirm email → OFF → Save
```

### 2. Sign Up New User
```
URL: /local/signup
Name: Test User
Email: test@example.com
Password: Test1234!
```

### 3. Login
```
URL: /local/login
Email: test@example.com
Password: Test1234!
```

### 4. Add Review
```
URL: /add-review
1. Fill place details
2. Click stars for rating
3. Write 50+ character review
4. Click "Use Demo Mode" for photo (purple button!)
5. Submit
```

---

## 🔧 Alternative: Create Test User via SQL

If you want a pre-made user, run this in Supabase SQL Editor:

```sql
-- This will be available after you apply database migrations
-- For now, just sign up normally via the UI
```

---

## 📋 Test Credentials Summary

After signup, use these credentials:

| Field | Value |
|-------|-------|
| Email | test@example.com |
| Password | Test1234! |
| Login URL | `/` or `/login` or `/local/login` |
| Signup URL | `/local/signup` |

---

## 🐛 Troubleshooting

### "Invalid login credentials" - Still failing?

**Check 1**: Did you sign up first?
- You need to create account before logging in
- Go to `/local/signup` first

**Check 2**: Email confirmation enabled?
- If yes, check your email inbox
- Or disable it (see Solution 2 above)

**Check 3**: Typing correct password?
- Password is case-sensitive: `Test1234!`
- Make sure no extra spaces

**Check 4**: Using correct login page?
- Main login: `/` or `/login`
- Local verifier login: `/local/login`
- Both should work with same credentials

### Camera still asking for permission?

**Don't grant it!** Just use Demo Mode:
1. When camera error appears
2. Look for PURPLE box
3. Click "Use Demo Mode (No Camera Needed)"
4. Done!

### "Check Your Email" message appears?

You have two options:
1. Check email and click confirmation link
2. Disable email confirmation in Supabase dashboard

---

## ✅ Quick Test Checklist

- [ ] Disable email confirmation in Supabase
- [ ] Sign up at `/local/signup`
- [ ] Login at `/local/login`
- [ ] Navigate to `/add-review`
- [ ] Use Demo Mode for photo (purple button)
- [ ] Submit review successfully

---

## 🆘 Still Having Issues?

1. **Open Browser Console** (F12)
2. Go to **Console tab**
3. Look for error messages
4. Check what the actual error says
5. Share the exact error message

Common console errors:
- "Email not confirmed" → Disable email confirmation
- "User already registered" → Just login instead
- "Network error" → Check internet connection

---

**Remember**: 
- ✅ Sign up BEFORE login
- ✅ Disable email confirmation for testing
- ✅ Use Demo Mode for photos (no camera needed!)
