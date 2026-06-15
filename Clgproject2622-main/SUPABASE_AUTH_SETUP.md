# Supabase Authentication Setup Guide

## Current Status
✅ Supabase Auth is enabled and working
✅ LoginPage and SignUpPage integrated with Supabase Auth
⚠️ Email confirmation may be required (default setting)

## Quick Fix: Disable Email Confirmation (For Testing)

If you're getting "Failed to fetch" errors when signing up, it's likely because Supabase requires email confirmation by default.

### Steps to Disable Email Confirmation:

1. Go to your Supabase Dashboard:
   ```
   https://supabase.com/dashboard/project/zbefuotnmdvbqietdhhf
   ```

2. Navigate to: **Authentication** → **Settings** (or **Providers**)

3. Scroll to **Email Auth** section

4. Find the setting: **"Confirm email"**

5. **Toggle it OFF** (disable email confirmation)

6. Click **Save**

7. Try signing up again in your app

## Alternative: Configure Email Service

If you want to keep email confirmation enabled (more secure):

1. In Supabase Dashboard → **Project Settings** → **Authentication**

2. Configure an email provider:
   - **SMTP** (custom email server)
   - **SendGrid**
   - **AWS SES**
   - Or use Supabase's built-in email (limited to 4 emails/hour in free tier)

3. Test email delivery

4. Users will receive a confirmation email after signup

## Testing Authentication

### Sign Up Flow:
```typescript
// When email confirmation is DISABLED:
1. User fills signup form
2. Calls signUp()
3. User is immediately created and logged in
4. Redirects to /home

// When email confirmation is ENABLED:
1. User fills signup form
2. Calls signUp()
3. Supabase creates user but marks as "unconfirmed"
4. Email sent with confirmation link
5. User must click link to confirm
6. Then user can sign in
```

### Sign In Flow:
```typescript
1. User enters email/password
2. Calls signIn()
3. If credentials valid → logged in
4. Redirects to /home
```

## Current Configuration

**Supabase Project:**
- URL: `https://zbefuotnmdvbqietdhhf.supabase.co`
- Project ID: `zbefuotnmdvbqietdhhf`

**Auth Implementation:**
- Context: `/src/contexts/AuthContext.tsx`
- Login Page: `/src/app/pages/LoginPage.tsx`
- Signup Page: `/src/app/pages/SignUpPage.tsx`

## Common Errors

### "Failed to fetch"
- **Cause**: Network error or CORS issue
- **Fix**: Check browser console for detailed error

### "Email not confirmed"
- **Cause**: Email confirmation required but user hasn't clicked link
- **Fix**: Disable email confirmation (see above) OR configure email service

### "Invalid login credentials"
- **Cause**: Wrong email/password
- **Fix**: Check credentials or reset password

### "User already registered"
- **Cause**: Email already exists in database
- **Fix**: Use sign in instead of sign up

## Testing Users

After disabling email confirmation, you can create test users:

1. Go to `/local/signup`
2. Fill form:
   - Name: Test User
   - Email: test@example.com
   - Password: Test1234!
3. Click Sign Up
4. Should redirect to `/home` immediately

Then test sign in:
1. Go to `/local/login`
2. Enter: test@example.com / Test1234!
3. Click Sign In
4. Should redirect to `/home`

## Production Setup

For production:
1. ✅ Enable email confirmation
2. ✅ Configure proper email provider (not Supabase free tier)
3. ✅ Set up password reset flow
4. ✅ Add social auth providers (Google, GitHub, etc.) - optional
5. ✅ Configure redirect URLs in Supabase dashboard
6. ✅ Set up row-level security (RLS) policies
7. ✅ Add rate limiting

## Next Steps

1. **Disable email confirmation** (fastest fix for testing)
2. Create a test user via signup page
3. Test login with that user
4. Once working, optionally enable email confirmation + configure email provider

## Need Help?

- Supabase Auth Docs: https://supabase.com/docs/guides/auth
- Your Dashboard: https://supabase.com/dashboard/project/zbefuotnmdvbqietdhhf
- Auth Settings: https://supabase.com/dashboard/project/zbefuotnmdvbqietdhhf/auth/providers
