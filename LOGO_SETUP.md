# Logo Integration Instructions

## Quick Start

1. **Prepare your logo file:**
   - Format: PNG with transparent background (recommended)
   - Size: At least 200x200 pixels (will display at 50x50 in the header)
   - Filename: `logo.png`

2. **Add the logo:**
   - Copy/move your `logo.png` file to: `frontend/src/assets/logo.png`

3. **Verify:**
   - Run the application: `cd frontend && npm start`
   - The logo should appear in the top-left corner of the header
   - If not found, check the browser console for warnings

## Current Implementation

The header component in `frontend/src/app/app.component.ts` includes:

```html
<img src="assets/logo.png" alt="Logo" class="logo" (error)="onLogoError()">
```

**Features:**
- Displays at 50x50 pixels (height constrained, width auto-scales)
- Error handling if file is not found
- Console warning if logo fails to load
- Application continues to work without the logo

## Logo Styling

The logo is styled in the header with:
```css
.logo {
  height: 50px;
  width: auto;
}
```

To modify:
- Edit `frontend/src/app/app.component.ts` (inline styles in the `@Component` decorator)
- Look for the `.logo` CSS rule

## Supported Formats

- ✅ PNG (recommended)
- ✅ SVG
- ✅ JPG/JPEG
- ✅ WebP

## Troubleshooting

### Logo not appearing?

1. **Check file location:**
   ```bash
   ls frontend/src/assets/logo.png  # Should exist
   ```

2. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or open in incognito mode

3. **Check console for errors:**
   - Open browser DevTools (F12)
   - Look for 404 or error messages about the logo

4. **Verify file permissions:**
   - The file should be readable by the web server

### Want to change logo size?

Edit `frontend/src/app/app.component.ts`:

```typescript
.logo {
  height: 60px;  // Change this value
  width: auto;
}
```

Then refresh the browser.

### Want to change logo position?

The logo is in `.logo-section` which is inside `.header-container`. Modify the styling in `app.component.ts` to adjust positioning.

## Next Steps

Once your logo is added:

1. Test the application: `npm start`
2. Verify the logo displays correctly
3. Check responsiveness on mobile devices
4. Deploy with your logo as part of the build

## More Help

- See `frontend/README.md` for general frontend info
- See `SETUP_GUIDE.md` for general setup help
- Check `frontend/src/assets/README.md` for asset management

---

**Need to use a different logo later?**
Simply replace `frontend/src/assets/logo.png` with your new logo file and refresh the browser.
