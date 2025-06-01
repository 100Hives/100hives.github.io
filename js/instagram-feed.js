/**
 * Instagram Feed Integration
 * Automatically loads Instagram posts from @release.therapies
 */

class InstagramFeed {
    constructor(options = {}) {
        this.accessToken = options.accessToken || '';
        this.userId = options.userId || '';
        this.containerId = options.containerId || 'instagramFeed';
        this.limit = options.limit || 4;
        this.showVideos = options.showVideos !== false;
        this.showImages = options.showImages !== false;
        this.apiUrl = `https://graph.instagram.com/me/media`;
    }

    async init() {
        if (!this.accessToken) {
            console.warn('Instagram access token not provided. Using placeholder content.');
            this.showPlaceholders();
            return;
        }

        try {
            await this.loadPosts();
        } catch (error) {
            console.error('Error loading Instagram posts:', error);
            this.showPlaceholders();
        }
    }

    async loadPosts() {
        const url = `${this.apiUrl}?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${this.accessToken}&limit=${this.limit}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message);
        }

        this.renderPosts(data.data);
    }

    renderPosts(posts) {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        // Clear existing content
        container.innerHTML = '';

        // Create grid container
        const grid = document.createElement('div');
        grid.className = 'instagram-grid-auto';
        
        posts.forEach(post => {
            if (this.shouldShowPost(post)) {
                const postElement = this.createPostElement(post);
                grid.appendChild(postElement);
            }
        });

        container.appendChild(grid);
    }

    shouldShowPost(post) {
        if (post.media_type === 'IMAGE' && this.showImages) return true;
        if (post.media_type === 'VIDEO' && this.showVideos) return true;
        if (post.media_type === 'CAROUSEL_ALBUM') return true;
        return false;
    }

    createPostElement(post) {
        const postDiv = document.createElement('div');
        postDiv.className = 'instagram-item auto-loaded';
        
        // Create media element
        const mediaElement = this.createMediaElement(post);
        
        // Create overlay with post info
        const overlay = this.createOverlay(post);
        
        postDiv.appendChild(mediaElement);
        postDiv.appendChild(overlay);
        
        // Add click handler to open Instagram post
        postDiv.addEventListener('click', () => {
            window.open(post.permalink, '_blank', 'noopener,noreferrer');
        });

        return postDiv;
    }

    createMediaElement(post) {
        const mediaDiv = document.createElement('div');
        mediaDiv.className = 'instagram-media';

        if (post.media_type === 'VIDEO') {
            const video = document.createElement('video');
            video.src = post.media_url;
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
            
            // Add poster if thumbnail is available
            if (post.thumbnail_url) {
                video.poster = post.thumbnail_url;
            }
            
            // Play video on hover
            video.addEventListener('mouseenter', () => video.play());
            video.addEventListener('mouseleave', () => video.pause());
            
            mediaDiv.appendChild(video);
        } else {
            const img = document.createElement('img');
            img.src = post.media_url;
            img.alt = this.truncateCaption(post.caption) || 'Instagram post';
            img.loading = 'lazy';
            mediaDiv.appendChild(img);
        }

        return mediaDiv;
    }

    createOverlay(post) {
        const overlay = document.createElement('div');
        overlay.className = 'instagram-overlay auto';
        
        const content = document.createElement('div');
        content.className = 'instagram-overlay-content';
        
        // Media type icon
        const icon = document.createElement('i');
        icon.className = post.media_type === 'VIDEO' ? 'fas fa-play' : 'fas fa-camera';
        
        // Caption preview
        const caption = document.createElement('p');
        caption.className = 'instagram-caption';
        caption.textContent = this.truncateCaption(post.caption, 60);
        
        // Date
        const date = document.createElement('span');
        date.className = 'instagram-date';
        date.textContent = this.formatDate(post.timestamp);
        
        // View on Instagram text
        const viewText = document.createElement('span');
        viewText.className = 'view-on-instagram';
        viewText.textContent = 'View on Instagram';
        
        content.appendChild(icon);
        content.appendChild(caption);
        content.appendChild(date);
        content.appendChild(viewText);
        overlay.appendChild(content);
        
        return overlay;
    }

    showPlaceholders() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        // Keep existing placeholder content but add loading indicator
        const existingPlaceholder = container.querySelector('.instagram-placeholder');
        if (existingPlaceholder) {
            const loadingText = document.createElement('p');
            loadingText.className = 'instagram-loading';
            loadingText.innerHTML = '<i class="fas fa-instagram"></i> Loading latest posts...';
            container.insertBefore(loadingText, existingPlaceholder);
        }
    }

    truncateCaption(caption, maxLength = 100) {
        if (!caption) return '';
        return caption.length > maxLength ? caption.substring(0, maxLength) + '...' : caption;
    }

    formatDate(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return '1 day ago';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
        return date.toLocaleDateString();
    }
}

// Configuration object
const instagramConfig = {
    // You'll need to get these from Instagram Developer Console
    accessToken: '', // Your Instagram access token
    userId: '', // Your Instagram user ID
    containerId: 'instagramFeed',
    limit: 4,
    showVideos: true,
    showImages: true
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const instagramFeed = new InstagramFeed(instagramConfig);
    instagramFeed.init();
});

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InstagramFeed;
} 