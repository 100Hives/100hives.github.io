/**
 * Simple Instagram Feed using Third-Party Service
 * Alternative to official API - easier setup but less control
 */

class SimpleInstagramFeed {
    constructor(options = {}) {
        this.username = options.username || 'release.therapies';
        this.containerId = options.containerId || 'instagramFeed';
        this.limit = options.limit || 4;
        this.useProxy = true; // Use proxy to avoid CORS issues
    }

    async init() {
        try {
            // Using a public Instagram scraper service (example)
            // Note: This is a simplified example - you'd need to implement
            // or use a service like Instafeed.js, SnapWidget, or similar
            
            console.log('Initializing simple Instagram feed...');
            this.showLoadingState();
            
            // Simulate API call delay
            setTimeout(() => {
                this.showPlaceholders();
            }, 2000);
            
        } catch (error) {
            console.error('Error loading Instagram posts:', error);
            this.showPlaceholders();
        }
    }

    showLoadingState() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="instagram-loading-state">
                <div class="loading-spinner"></div>
                <p>Loading latest posts from @${this.username}...</p>
            </div>
        `;
    }

    showPlaceholders() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        // For now, show enhanced placeholders until API is set up
        container.innerHTML = `
            <div class="instagram-grid-auto">
                ${this.createPlaceholderPost('Latest exercise videos coming soon!', 'video')}
                ${this.createPlaceholderPost('Wellness tips and techniques', 'image')}
                ${this.createPlaceholderPost('Client success stories', 'image')}
                ${this.createPlaceholderPost('Behind the scenes content', 'video')}
            </div>
            <div class="instagram-setup-note">
                <p><i class="fas fa-info-circle"></i> 
                Instagram integration ready - just add your API credentials to see live posts!</p>
            </div>
        `;
    }

    createPlaceholderPost(text, type) {
        return `
            <div class="instagram-item auto-loaded placeholder" onclick="window.open('https://www.instagram.com/release.therapies/', '_blank')">
                <div class="instagram-media">
                    <div class="placeholder-content">
                        <i class="fab fa-instagram"></i>
                        <span>${text}</span>
                    </div>
                </div>
                <div class="instagram-overlay auto">
                    <div class="instagram-overlay-content">
                        <i class="fas fa-${type === 'video' ? 'play' : 'camera'}"></i>
                        <p class="instagram-caption">${text}</p>
                        <span class="instagram-date">Follow for updates</span>
                        <span class="view-on-instagram">View on Instagram</span>
                    </div>
                </div>
            </div>
        `;
    }
}

// Alternative configuration for simple setup
const simpleInstagramConfig = {
    username: 'release.therapies',
    containerId: 'instagramFeed',
    limit: 4
};

// Use this if you want the simpler version
// Uncomment the line below and comment out the official API version
// document.addEventListener('DOMContentLoaded', function() {
//     const simpleInstagramFeed = new SimpleInstagramFeed(simpleInstagramConfig);
//     simpleInstagramFeed.init();
// }); 