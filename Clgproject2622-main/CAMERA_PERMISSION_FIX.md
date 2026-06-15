# 🚫 Camera Permission Denied - How to Fix

## You're seeing: "NotAllowedError: Permission denied"

This means your browser is blocking camera access. Here's how to fix it:

---

## ✅ FASTEST FIX (2 minutes)

### Step 1: Find the Permission Icon
Look at the **TOP** of your browser window, in the address bar.

You'll see one of these icons:
- 🔒 **Lock icon** (most common)
- 🎥 **Camera icon** (some browsers)
- ⚠️ **Warning icon** (if permissions are blocked)

### Step 2: Click the Icon
Click on the lock/camera icon to open the permissions dropdown.

### Step 3: Change Camera Permission
In the dropdown, find **"Camera"** and change it to **"Allow"**

### Step 4: Done!
The page should reload automatically. If not, press F5 to refresh.

---

## 📱 Browser-Specific Instructions

### Chrome / Edge / Brave
1. Look for 🔒 or 🎥 icon on **LEFT side** of address bar
2. Click it
3. Find "Camera" in the list
4. Click and select **"Allow"**
5. Page refreshes automatically ✅

**Alternative:**
1. Click the three dots ⋮ in top-right corner
2. Go to: **Settings** > **Privacy and security** > **Site settings** > **Camera**
3. Remove this site from "Blocked" list
4. Add to "Allowed" list
5. Refresh page (F5)

### Firefox
1. Click 🔒 icon on **LEFT side** of address bar
2. Click **">"** arrow next to "Connection"
3. Find **"Use the Camera"**
4. Select **"Allow"**
5. Click **"X"** to close
6. Refresh page (F5) ✅

**Alternative:**
1. Click hamburger menu ☰ in top-right
2. Go to: **Settings** > **Privacy & Security** > **Permissions** > **Camera** > **Settings...**
3. Find this website and remove from blocked list
4. Refresh page

### Safari (Mac)
1. In top menu bar: **Safari** > **Settings** (or **Preferences**)
2. Click **"Websites"** tab
3. Click **"Camera"** in left sidebar
4. Find this website in the list
5. Change dropdown to **"Allow"**
6. Close settings ✅
7. Refresh page (Cmd+R)

**Alternative:**
1. Safari will show a popup asking for permission when you try to use camera
2. Click **"Allow"** when prompted
3. If you clicked "Don't Allow" by mistake, follow steps above to change it

---

## 🔧 Advanced Troubleshooting

### If camera STILL doesn't work after allowing permission:

#### 1. Hard Refresh the Page
- **Windows:** `Ctrl + Shift + R`
- **Mac:** `Cmd + Shift + R`

This clears the cache and reloads everything fresh.

#### 2. Close ALL Browser Tabs
Sometimes permission changes don't apply until you close all tabs:
1. Close ALL tabs and windows of your browser
2. Completely quit the browser
3. Reopen browser
4. Go back to the website
5. Try camera again

#### 3. Check if Camera is Being Used
Your camera can only be used by ONE app at a time. Close these:
- Zoom, Teams, Skype, Google Meet
- Other browser tabs using camera/video
- Photo apps, camera apps
- Any video recording software

#### 4. Check Camera Hardware
Test if your camera works:
- **Windows:** Open "Camera" app from Start menu
- **Mac:** Open "Photo Booth" app
- Does the camera work? 
  - ✅ YES → It's a browser permission issue
  - ❌ NO → Camera hardware problem

#### 5. Try a Different Browser
Test if camera works in a different browser:
- Chrome
- Firefox
- Edge
- Safari (Mac)

If it works in one browser but not another, the problem is browser-specific permissions.

#### 6. Check Site Security (HTTPS)
Cameras ONLY work on secure sites:
- ✅ `https://...` → Works
- ❌ `http://...` → BLOCKED

Look at the address bar - it should start with `https://`

---

## 🧪 Use the Diagnostic Tool

We have a **Camera Diagnostics Tool** that checks everything:

### Go to: `/diagnostics-full`

Or click this link if you see it: [Camera Diagnostics](/diagnostics-full)

**What it checks:**
- ✅ Is site secure (HTTPS)?
- ✅ Does browser support camera?
- ✅ What's the permission state?
- ✅ How many cameras are detected?
- ✅ Can camera access actually work?

**What it does:**
- Shows exact error messages
- Tests camera in real-time
- Gives specific fix instructions
- Shows live video if camera works

---

## 📁 Alternative: Use File Upload

Don't want to fix camera permissions? No problem!

Just click **"Upload File"** instead of "Open Camera":
1. Selects a photo from your device
2. Gets GPS location
3. Works exactly the same
4. No camera permissions needed!

---

## 🆘 Still Not Working?

### Check Console Logs
1. Press **F12** to open Developer Tools
2. Click **"Console"** tab
3. Try to open camera
4. Look for error messages
5. Take a screenshot and report the error

### Common Error Messages:

**"NotAllowedError: Permission denied"**
→ Browser is blocking camera. Follow steps above to allow it.

**"NotFoundError: No camera detected"**
→ No camera found. Check if camera is connected/enabled.

**"NotReadableError: Could not start video source"**
→ Camera is being used by another app. Close other apps.

**"NotSupportedError: HTTPS required"**
→ Site must use HTTPS (not HTTP) for camera access.

**"OverconstrainedError"**
→ Camera doesn't support requested settings. Try reloading page.

---

## ✅ Quick Checklist

Before asking for help, make sure you've tried:

- [ ] Clicked lock icon 🔒 in address bar
- [ ] Changed Camera to "Allow"
- [ ] Refreshed page (F5)
- [ ] Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- [ ] Closed all browser tabs and reopened
- [ ] Checked if camera works in other apps
- [ ] Tried a different browser
- [ ] Checked that site uses HTTPS
- [ ] Closed other apps using camera
- [ ] Visited `/diagnostics-full` page
- [ ] Checked browser console (F12) for errors

---

## Summary

**The fix is simple:**
1. Click 🔒 icon in browser address bar
2. Change Camera to "Allow"
3. Refresh page

**99% of the time, that's all you need to do!** ✅

**If not:**
- Use the [Diagnostics Tool](/diagnostics-full)
- Or just use "Upload File" instead
