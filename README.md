# Release Therapies Website

This is the complete website for Release Therapies, a professional therapy services business.

## ✨ New Feature: Dark Mode

The website now includes a beautiful dark mode feature with the following capabilities:

### 🎨 **Three Theme System:**
1. **Light Mode** - Original professional navy and gold design
2. **Dark Mode** - Elegant dark theme with gold accents on black backgrounds  
3. **High Contrast** - Premium sports brand style with black and white design and vibrant orange accenting

### 🏋️ **Premium Sports Brand Features (High Contrast Mode):**
- **Athletic Typography**: Bold, uppercase headings with dramatic letter spacing
- **Sharp Design Elements**: Zero border-radius for modern, geometric aesthetics
- **Premium Hover Effects**: Sophisticated animations with enhanced shadows and transforms
- **Gradient Text Effects**: Dynamic gradient backgrounds on hero text
- **Sports Brand Feel**: Inspired by high-end athletic brands like Gymshark
- **Enhanced Button Styling**: Shimmer effects and premium hover animations
- **Professional Color Palette**: Pure black/white with strategic orange accenting

### 🌙 Dark Mode Features
- **Toggle Button**: Floating toggle button on all pages (moon/sun icon)
- **Three Themes**: Light Mode, Dark Mode, and High Contrast (Black & White with Orange accents)
- **Orange Accenting**: Vibrant orange (#FF6B35) trimming on the high contrast theme for visual appeal
- **Smart Color Inversion**: Gold/navy color scheme inverts intelligently in dark mode
- **Automatic Persistence**: Theme preference saved in browser localStorage
- **System Preference Detection**: Respects user's OS dark mode setting
- **Smooth Transitions**: All elements transition smoothly between themes
- **Full Coverage**: All website pages support all three themes
- **Mobile Optimized**: Works perfectly on all devices
- **Accessibility**: Proper ARIA labels and keyboard navigation support

### 🎨 Color Scheme
- **Light Mode**: Navy blue primary with gold accents
- **Dark Mode**: Gold primary with pure black backgrounds and navy accents
- **Intelligent Contrast**: Text and elements automatically adjust for optimal readability

### 🔧 Technical Implementation
- CSS custom properties (variables) for seamless theme switching
- JavaScript localStorage for preference persistence  
- System theme detection via `prefers-color-scheme` media query
- Event-driven architecture for theme change notifications

### 📝 Testing
Visit `dark-mode-demo.html` to see all the dark mode features in action and test the implementation.

## Logo Implementation Instructions

To implement the provided logo image:

1. Replace the following files with the appropriate versions of your logo:

   - `images/logo.png` - The full logo with text (as shown in the provided image)
   - `images/logo-circle.png` - Just the circular part of the logo without the text

2. The logo is used in the following locations:
   - Header navigation on all pages
   - Services section title on the homepage (circular version)
   - Client logos in the About page (circular version)

3. Recommended dimensions:
   - `logo.png`: 180px width (height will adjust proportionally)
   - `logo-circle.png`: 60px × 60px

## Image Requirements

The website requires the following images:

1. **Logo Images** (as described above)

2. **Hero Background**:
   - File: `images/hero-bg.jpeg` (JPEG format)
   - Used as the background for the hero section on the homepage
   - Shows a professional massage table in a therapy room setting
   - The image has been updated to use the provided massage table photo

3. **Service Images**:
   - Files: `images/service-1.jpg`, `images/service-2.jpg`, `images/service-3.jpg`
   - Used in the services section on the homepage
   - Recommended dimensions: 600px × 400px

4. **Therapy Table Image**:
   - File: `images/therapy-table.jpg`
   - Used in the booking preview section
   - Recommended dimensions: 500px × 300px

## Website Structure

The website consists of the following pages:

- Homepage (index.html)
- Services page (services.html)
- About Us page (about.html)
- Contact page (contact.html)
- Booking page (booking.html)
- Thank You page (thank-you.html)

## File Organization

- `css/` - Contains all stylesheet files
- `js/` - Contains all JavaScript files
- `images/` - Contains all image files
- `php/` - Contains PHP form handlers

## Form Handling

The website includes two forms:

- Contact form (processed by `php/contact-handler.php`)
- Booking form (processed by `php/booking-handler.php`)

Note: To use the forms, you'll need to host the website on a server with PHP support.
