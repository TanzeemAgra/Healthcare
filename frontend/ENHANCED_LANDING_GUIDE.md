# 🎨 Enhanced Landing Page Customization Guide

## 🚀 Quick Setup

1. **Enable Enhanced Landing Page:**
   ```bash
   # Add to your .env file
   VITE_USE_ENHANCED_LANDING=true
   ```

2. **Choose Your Theme:**
   ```bash
   # Available themes:
   VITE_THEME=dark_healthcare     # Default - Professional dark theme
   VITE_THEME=light_modern        # Clean light theme
   VITE_THEME=medical_green       # Medical green theme
   VITE_THEME=purple_tech         # Modern purple theme
   ```

3. **Access Enhanced Landing Page:**
   - Main route: `http://localhost:5173/` (if VITE_USE_ENHANCED_LANDING=true)
   - Direct route: `http://localhost:5173/enhanced`

## 🎯 Customization Options

### **Visual Themes**
Change the entire look with one variable:

```bash
# Professional Healthcare (Default)
VITE_THEME=dark_healthcare
```

```bash
# Modern Light Theme
VITE_THEME=light_modern
```

```bash
# Medical Green Theme  
VITE_THEME=medical_green
```

```bash
# Purple Tech Theme
VITE_THEME=purple_tech
```

### **Content Variants**
Customize content for different audiences:

```bash
# General Healthcare (Default)
VITE_CONTENT_VARIANT=default

# Enterprise Focus
VITE_CONTENT_VARIANT=enterprise

# Startup Focus  
VITE_CONTENT_VARIANT=startup
```

### **Visual Effects**
Control animations and effects:

```bash
# Floating particles background
VITE_ENABLE_PARTICLES=true

# Animation levels
VITE_ANIMATION_PRESET=enhanced    # Full animations
VITE_ANIMATION_PRESET=normal      # Standard animations  
VITE_ANIMATION_PRESET=reduced     # Minimal animations (accessibility)

# Glassmorphism effects
VITE_ENABLE_GLASSMORPHISM=true
```

### **Branding Customization**
Personalize for your brand:

```bash
# Company details
VITE_COMPANY_NAME="Your Healthcare Company"
VITE_COMPANY_TAGLINE="Your Custom Tagline"
VITE_CONTACT_URL="https://your-website.com/contact"
VITE_LOGO_PATH="/your-logo.png"
```

## 🛠️ Advanced Configuration

### **Performance Optimization**
```bash
# Enable for better performance
VITE_ENABLE_LAZY_LOADING=true
VITE_ENABLE_CODE_SPLITTING=true
```

### **Accessibility Features**
```bash
# Accessibility enhancements
VITE_RESPECT_MOTION_PREFERENCES=true
VITE_ENABLE_HIGH_CONTRAST=true
VITE_ENHANCE_KEYBOARD_NAV=true
```

### **Feature Toggles**
```bash
# Control sections visibility
VITE_SHOW_TESTIMONIALS=true
VITE_SHOW_BLOG=false
VITE_ENABLE_LIVE_CHAT=false
```

## 📱 Theme Previews

### Dark Healthcare Theme (Default)
- **Colors:** Deep blue primary, dark background
- **Feel:** Professional, medical, trustworthy  
- **Best for:** Hospitals, clinics, medical practices

### Light Modern Theme
- **Colors:** Bright blue primary, light background
- **Feel:** Clean, modern, approachable
- **Best for:** Startups, modern practices, tech-forward

### Medical Green Theme  
- **Colors:** Medical green primary, forest background
- **Feel:** Natural, healing, calm
- **Best for:** Wellness centers, holistic care, rehabilitation

### Purple Tech Theme
- **Colors:** Purple primary with pink accents
- **Feel:** Innovative, cutting-edge, tech-forward
- **Best for:** AI companies, research, innovation labs

## 🎨 Creating Custom Themes

To create your own theme, edit `src/config/themeConfig.js`:

```javascript
export const YOUR_CUSTOM_THEME = {
  name: "Your Theme Name",
  colors: {
    primary: {
      main: "#your-color",
      light: "#lighter-variant", 
      dark: "#darker-variant",
      gradient: "linear-gradient(135deg, #color1 0%, #color2 100%)",
    },
    background: {
      main: "your-background-gradient",
      overlay: "rgba(0, 0, 0, 0.7)",
      card: "rgba(255, 255, 255, 0.05)",
      glass: "rgba(255, 255, 255, 0.1)",
    },
    text: {
      primary: "#your-text-color",
      secondary: "rgba(255, 255, 255, 0.8)",
      muted: "rgba(255, 255, 255, 0.6)",
    }
  }
};
```

## 🚦 Environment-Based Configuration

### Development
```bash
NODE_ENV=development
VITE_DEBUG_MODE=true
VITE_ENABLE_PARTICLES=false  # Better performance
VITE_ANIMATION_PRESET=normal
```

### Production  
```bash
NODE_ENV=production
VITE_DEBUG_MODE=false
VITE_ENABLE_PARTICLES=true
VITE_ANIMATION_PRESET=enhanced
VITE_ENABLE_ANALYTICS=true
```

## 🔧 Quick Commands

```bash
# Copy environment template
cp .env.enhanced.template .env

# Start with enhanced landing page
echo "VITE_USE_ENHANCED_LANDING=true" >> .env
npm run dev

# Switch themes quickly
echo "VITE_THEME=medical_green" >> .env
```

## 📊 Performance Considerations

- **Particles:** Disable on mobile/low-end devices
- **Animations:** Use 'reduced' preset for better accessibility
- **Lazy Loading:** Always enable for production
- **Code Splitting:** Enable for larger applications

## 🎭 A/B Testing

Test different configurations:

```bash
# Variant A - Conservative
VITE_THEME=dark_healthcare
VITE_ANIMATION_PRESET=normal
VITE_CONTENT_VARIANT=default

# Variant B - Modern  
VITE_THEME=purple_tech
VITE_ANIMATION_PRESET=enhanced
VITE_CONTENT_VARIANT=startup
```

## 💡 Best Practices

1. **Start with default theme** and customize gradually
2. **Test on different devices** and screen sizes  
3. **Consider accessibility** - respect motion preferences
4. **Optimize for performance** - disable heavy effects on mobile
5. **Keep branding consistent** across all touchpoints

## 🆘 Troubleshooting

**Landing page not showing enhanced version?**
- Check `VITE_USE_ENHANCED_LANDING=true` in .env
- Restart development server after .env changes

**Theme not applying?**
- Verify theme name spelling in `VITE_THEME`
- Check browser console for errors

**Animations not working?**  
- Check `VITE_ANIMATION_PRESET` setting
- Verify user doesn't have reduced motion preference

**Performance issues?**
- Set `VITE_ENABLE_PARTICLES=false`
- Use `VITE_ANIMATION_PRESET=reduced`
- Enable `VITE_ENABLE_LAZY_LOADING=true`

---

💡 **Need help?** Check the configuration files in `src/config/` for more advanced customization options!