# Save Your Images Here

## Required Images:

### 1. Logo Image
- **Your image**: picture1 (the logo you provided)
- **Save as**: `logo.png` (in this folder)
- **Path**: `client/public/assets/logo.png`

### 2. Background Image
- **Your image**: portal-background (the background you provided)
- **Save as**: `portal-bg.jpg` (in this folder)
- **Path**: `client/public/assets/portal-bg.jpg`

## How to Save (Windows):

### Option 1: Using File Explorer
1. Open the folder: `C:\Users\afroz\CodeBuddy\20251125214834\client\public\assets`
2. Right-click your "picture1" image → Copy
3. Paste it in the assets folder
4. Rename it to: `logo.png`
5. Right-click your "portal-background" image → Copy
6. Paste it in the assets folder
7. Rename it to: `portal-bg.jpg`

### Option 2: Using PowerShell
If your images are in Downloads folder:

```powershell
# Replace "Downloads" with actual location if different
Copy-Item "$env:USERPROFILE\Downloads\picture1.png" "C:\Users\afroz\CodeBuddy\20251125214834\client\public\assets\logo.png"
Copy-Item "$env:USERPROFILE\Downloads\portal-background.jpg" "C:\Users\afroz\CodeBuddy\20251125214834\client\public\assets\portal-bg.jpg"
```

## After Saving:

1. Refresh your browser (Ctrl + F5)
2. Images should now appear on the login page

## File Structure Should Look Like:
```
assets/
├── logo.png          ← Your university logo
├── portal-bg.jpg     ← Your background image
└── README.md         ← This file
```
