// Static/js/main.js

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.querySelector('body');
    const navLinks = document.querySelectorAll('.nav-link');
    // Set up logo click to simulate home link click for consistent animations
    const logoLink = document.querySelector('.logo a');
    if (logoLink) {
        logoLink.addEventListener('click', function(e) {
            // Only intercept if we're not already on home page
            if (!isHomePage) {
                e.preventDefault();
                
                // Find the home nav link
                const homeLink = document.querySelector('.nav-link[href="index.html"]');
                
                if (homeLink) {
                    // Simulate a click on the home link to trigger the animation
                    homeLink.click();
                } else {
                    // Fallback if home link not found
                    window.location.href = this.getAttribute('href');
                }
            }
        });
    }

    // Gallery items data
    // In a real project, this could be loaded from a JSON file or API
    const galleryItems = [
        {
            id: 1,
            src: '/Media/images/gallery/1.jpg',
            alt: 'Bives performing outdoors',
            category: 'outdoor',
            title: 'Studio Session'
        },
        {
            id: 2,
            src: '../Media/images/gallery/2.jpg',
            alt: 'Bives in studio session',
            category: 'studio',
            title: 'Studio Session'
        },
        {
            id: 3,
            src: '/Media/images/gallery/3.jpg',
            alt: 'Bives outdoor concert',
            category: 'outdoor',
            title: 'Studio Session'
        },
        {
            id: 4,
            src: '/Media/images/gallery/4.jpg',
            alt: 'Bives in the studio',
            category: 'studio',
            title: 'Studio Session'
        },
        {
            id: 5,
            src: '/Media/images/gallery/5.jpg',
            alt: 'Bives performing live',
            category: 'outdoor',
            title: 'Studio Session'
        }
    ];

    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            body.classList.toggle('no-scroll');
            
            // Create and append social links to mobile menu if they don't exist
            if (hamburger.classList.contains('active')) {
                const socialLinksDesktop = document.querySelector('.social-links');
                if (socialLinksDesktop && !document.querySelector('.social-links.mobile')) {
                    const socialLinksMobile = socialLinksDesktop.cloneNode(true);
                    socialLinksMobile.classList.add('mobile');
                    navMenu.appendChild(socialLinksMobile);
                }
            }
        });
    }

    // Close mobile menu when a nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.classList.remove('no-scroll');
        });
    });

    // Initialize gallery if on gallery page
    if (document.querySelector('.gallery-scroller')) {
        initGallery();
    }

    // Initialize lightbox if on gallery page
    if (document.getElementById('image-lightbox')) {
        initLightbox();
    }

    // Initialize carousels if on videos or music page
    if (document.querySelector('.videos-carousel') || document.querySelector('.music-carousel')) {
        initCarousels();
    }

    // Gallery category filtering
    const categoryButtons = document.querySelectorAll('.category-btn');
    if (categoryButtons.length > 0) {
        categoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Filter gallery items
                const category = this.getAttribute('data-category');
                filterGallery(category);
            });
        });
    }

    /**
     * Initialize gallery with items
     */
    function initGallery() {
        const galleryScroller = document.querySelector('.gallery-scroller');
        if (!galleryScroller) return;

        // Clear existing content
        galleryScroller.innerHTML = '';

        // Create gallery items
        galleryItems.forEach(item => {
            const galleryItem = document.createElement('div');
            galleryItem.className = `gallery-item ${item.category}`;
            galleryItem.innerHTML = `
                <img src="${item.src}" alt="${item.alt}">
                <div class="gallery-item-info">
                    <h3>${item.title}</h3>
                </div>
            `;
            galleryScroller.appendChild(galleryItem);
        });
    }

    /**
     * Initialize lightbox functionality
     */
    function initLightbox() {
        const lightbox = document.getElementById('image-lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxTitle = document.getElementById('lightbox-title');
        const lightboxClose = document.querySelector('.lightbox-close');
        const prevButton = document.querySelector('.lightbox-nav.prev');
        const nextButton = document.querySelector('.lightbox-nav.next');
        
        let currentIndex = 0;
        let visibleItems = [];

        // Update the visible items based on current filtering
        function updateVisibleItems() {
            visibleItems = [];
            const items = document.querySelectorAll('.gallery-item');
            items.forEach((item, index) => {
                if (item.style.display !== 'none') {
                    visibleItems.push({
                        index: index,
                        element: item,
                        img: item.querySelector('img').src,
                        title: item.querySelector('h3').textContent
                    });
                }
            });
        }

        // Add click event to each gallery item
        document.addEventListener('click', function(e) {
            const galleryItem = e.target.closest('.gallery-item');
            if (galleryItem) {
                // Update visible items first
                updateVisibleItems();
                
                // Find the clicked item in the visible items
                const itemIndex = Array.from(document.querySelectorAll('.gallery-item')).indexOf(galleryItem);
                
                // Find its position in the visibleItems array
                const visibleIndex = visibleItems.findIndex(item => item.index === itemIndex);
                
                if (visibleIndex !== -1) {
                    currentIndex = visibleIndex;
                    openLightbox();
                }
            }
        });

        // Open lightbox with current image
        function openLightbox() {
            if (visibleItems.length === 0) return;
            
            const current = visibleItems[currentIndex];
            lightboxImg.src = current.img;
            lightboxImg.alt = current.title;
            lightboxTitle.textContent = current.title;
            
            lightbox.style.display = 'block';
            body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
        }

        // Close lightbox
        if (lightboxClose) {
            lightboxClose.addEventListener('click', function() {
                lightbox.style.display = 'none';
                body.style.overflow = ''; // Re-enable scrolling
            });
        }

        // Close lightbox with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lightbox && lightbox.style.display === 'block') {
                lightbox.style.display = 'none';
                body.style.overflow = '';
            }
        });

        // Navigate to previous image
        if (prevButton) {
            prevButton.addEventListener('click', function() {
                if (visibleItems.length <= 1) return;
                
                currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
                openLightbox();
            });
        }

        // Navigate to next image
        if (nextButton) {
            nextButton.addEventListener('click', function() {
                if (visibleItems.length <= 1) return;
                
                currentIndex = (currentIndex + 1) % visibleItems.length;
                openLightbox();
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (!lightbox || lightbox.style.display !== 'block') return;
            
            if (e.key === 'ArrowLeft' && prevButton) {
                prevButton.click();
            } else if (e.key === 'ArrowRight' && nextButton) {
                nextButton.click();
            }
        });
    }

    /**
     * Initialize carousel functionality for videos and music pages
     */
    function initCarousels() {
        const carousels = document.querySelectorAll('.carousel-container');
        
        carousels.forEach(carousel => {
            const items = carousel.querySelectorAll('.carousel-item');
            const prevBtn = carousel.querySelector('.carousel-nav.prev');
            const nextBtn = carousel.querySelector('.carousel-nav.next');
            const indicators = carousel.querySelectorAll('.indicator');
            let currentIndex = 0;
            
            // Function to show item at specific index
            function showItem(index) {
                // Hide all items
                items.forEach(item => {
                    item.classList.remove('active');
                });
                
                // Update indicators
                if (indicators.length > 0) {
                    indicators.forEach(indicator => {
                        indicator.classList.remove('active');
                    });
                    indicators[index].classList.add('active');
                }
                
                // Show selected item
                items[index].classList.add('active');
                currentIndex = index;
            }
            
            // Initialize: show first item
            showItem(0);
            
            // Previous button click
            if (prevBtn) {
                prevBtn.addEventListener('click', function() {
                    let index = (currentIndex - 1 + items.length) % items.length;
                    showItem(index);
                });
            }
            
            // Next button click
            if (nextBtn) {
                nextBtn.addEventListener('click', function() {
                    let index = (currentIndex + 1) % items.length;
                    showItem(index);
                });
            }
            
            // Indicator clicks
            indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', function() {
                    showItem(index);
                });
            });
            
            // Keyboard navigation
            document.addEventListener('keydown', function(e) {
                // Only process keyboard events if we're on a page with carousels
                // and not inside the lightbox (to prevent conflicts)
                const lightbox = document.getElementById('image-lightbox');
                if ((lightbox && lightbox.style.display === 'block')) return;
                
                if (e.key === 'ArrowLeft' && prevBtn) {
                    prevBtn.click();
                } else if (e.key === 'ArrowRight' && nextBtn) {
                    nextBtn.click();
                }
            });
        });
    }

    /**
     * Filter gallery items by category
     * @param {string} category - The category to filter by
     */
    function filterGallery(category) {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            if (category === 'all' || item.classList.contains(category)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    /**
     * Get the current page name from the URL
     * Works with both /page and /page.html formats
     */
    function getCurrentPage() {
        // Get current page from URL path
        let currentPath = window.location.pathname;
        
        // Handle trailing slash
        if (currentPath.endsWith('/') && currentPath !== '/') {
            currentPath = currentPath.slice(0, -1);
        }
        
        // Get the last part of the path (the page name)
        let currentPage = currentPath.split('/').pop() || 'index';
        
        // Remove .html extension if it exists
        currentPage = currentPage.replace('.html', '');
        
        // Handle root path special case
        if (currentPage === '' || currentPath === '/') {
            currentPage = 'index';
        }
        
        return currentPage;
    }

    /**
     * Normalize href to remove .html for comparison
     */
    function normalizeHref(href) {
        if (!href) return '';
        return href.replace('.html', '');
    }

    /**
     * Set active navigation based on current page
     */
    function setActiveNavLink() {
        const currentPage = getCurrentPage();
        
        // Remove active class from all links
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Set active class based on current page
        navLinks.forEach(link => {
            const linkPage = normalizeHref(link.getAttribute('href'));
            
            if (linkPage === currentPage || 
                (currentPage === 'index' && (linkPage === 'index' || linkPage === ''))) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Animate logo from center to top-left
     * @param {string} destination - The URL to navigate to after animation
     * @param {Function} callback - Function to call after animation completes
     */
    function animateLogo(destination, callback) {
        const centerLogo = document.querySelector('.title-img');
        const navLogo = document.querySelector('.logo-img');
        
        // Temporarily remove hidden class to get correct dimensions, but keep it invisible
        navLogo.classList.remove('hidden');
        navLogo.style.opacity = '0';
        
        // Get positions and dimensions
        const logoRect = centerLogo.getBoundingClientRect();
        const navLogoRect = navLogo.getBoundingClientRect();
        
        // Put the hidden class back
        navLogo.classList.add('hidden');
        navLogo.style.opacity = '';
        
        // Create a clone of the center logo at its current position
        const clonedLogo = centerLogo.cloneNode(true);
        clonedLogo.style.position = 'fixed';
        clonedLogo.style.left = logoRect.left + 'px';
        clonedLogo.style.top = logoRect.top + 'px';
        clonedLogo.style.width = logoRect.width + 'px';
        clonedLogo.style.height = logoRect.height + 'px';
        clonedLogo.style.transition = 'all 0.5s ease-in-out';
        clonedLogo.style.zIndex = '2000';
        clonedLogo.style.backgroundColor = 'transparent'; // Ensure no background
        clonedLogo.style.boxShadow = 'none'; // Remove any shadows
        
        document.body.appendChild(clonedLogo);
        
        // Completely hide the original logo (not just opacity)
        centerLogo.style.opacity = '0';
        centerLogo.style.visibility = 'hidden';
        centerLogo.style.display = 'none';
        
        // Force a reflow before starting the animation
        void clonedLogo.offsetWidth;
        
        // Animate to top left corner with size change
        clonedLogo.style.left = navLogoRect.left + 'px';
        clonedLogo.style.top = navLogoRect.top + 'px';
        clonedLogo.style.width = navLogoRect.width + 'px';
        clonedLogo.style.height = navLogoRect.height + 'px';
        
        // Call callback after animation completes and clean up
        setTimeout(() => {
            // Make the navigation logo visible
            navLogo.classList.remove('hidden');
            navLogo.style.opacity = '1'; 
            navLogo.style.transition = 'opacity 0.2s ease';
            
            // Remove the cloned element
            document.body.removeChild(clonedLogo);
            
            // Small delay to ensure the nav logo is visible before navigating
            setTimeout(() => {
                if (callback) callback();
                else window.location.href = destination;
            }, 50); 
        }, 800); // Match this to the transition duration
    }
   



  /**
 * Animate navigation underline from active to target link
 * @param {Element} activeLink - The currently active link
 * @param {Element} targetLink - The link being navigated to
 * @param {string} destination - The URL to navigate to after animation
 */
function animateNavLine(activeLink, targetLink, destination) {
    // If no active link is found, just navigate directly
    if (!activeLink) {
        window.location.href = destination;
        return;
    }
    
    // Temporarily hide the existing underline on the active link
    // Create a style element to override the ::after pseudo-element
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `.nav-link.active::after { width: 0 !important; }`;
    document.head.appendChild(styleEl);
    
    // Create an animated line element
    const animatedLine = document.createElement('div');
    animatedLine.style.position = 'absolute';
    animatedLine.style.height = '3px';
    animatedLine.style.backgroundColor = 'var(--accent-color)';
    // animatedLine.style.transition = 'all 0.5s ease-in-out';
    animatedLine.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
    animatedLine.style.zIndex = '1000';
    document.body.appendChild(animatedLine);
    
    try {
        // Get positions for start (active link) and end (clicked link)
        const startRect = activeLink.getBoundingClientRect();
        const endRect = targetLink.getBoundingClientRect();
        
        // Position the line initially under the active link
        animatedLine.style.width = startRect.width + 'px';
        animatedLine.style.left = startRect.left + 'px';
        animatedLine.style.top = (startRect.bottom - 3) + 'px'; // Position at the bottom edge minus line height
        
        // Force a reflow before starting the animation
        void animatedLine.offsetWidth;
        
        // Animate to the position of the clicked link
        animatedLine.style.width = endRect.width + 'px';
        animatedLine.style.left = endRect.left + 'px';
        animatedLine.style.top = (endRect.bottom - 3) + 'px'; // Position at the bottom edge minus line height
        
        // Navigate after animation completes
        setTimeout(() => {
            window.location.href = destination;
        }, 500); // Match this to the transition duration
    } catch (e) {
        // If anything goes wrong, just navigate normally
        console.error("Navigation animation error:", e);
        window.location.href = destination;
    }
}

    // Check if we're on the home page (checking multiple possible formats)
    const currentPage = getCurrentPage();
    const isHomePage = currentPage === 'index';
    
// Find the currently active link
let activeLink = document.querySelector('.nav-link.active');
if (!activeLink) {
    const currentPage = getCurrentPage();
    
    // Try to find the link both with and without .html
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        const linkPage = normalizeHref(href);
        
        if (linkPage === currentPage || 
            (linkPage === currentPage + '.html') ||
            (currentPage === 'index' && (linkPage === 'index' || linkPage === ''))) {
            activeLink = link;
            link.classList.add('active');
        }
    });
    
    // If we still don't have an active link and we're not on home page,
    // just use the first nav link as a fallback for animation purposes
    if (!activeLink && !isHomePage && navLinks.length > 0) {
        activeLink = navLinks[0]; // Use first link as fallback
    }
}
    
    // Set up page transition animations
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only do the animation if this isn't the current page
            if (!this.classList.contains('active')) {
                e.preventDefault(); // Prevent immediate navigation
                
                const destination = this.getAttribute('href');
                const targetLink = this;
                
                if (isHomePage) {
                    // First animate the logo from center to top-left
                    animateLogo(destination, function() {
                        // Then animate the navigation line
                        animateNavLine(activeLink, targetLink, destination);
                    });
                } else {
                    // Just animate the navigation line
                    animateNavLine(activeLink, targetLink, destination);
                }
            }
        });
    });

    // Keep the nav logo hidden on home page
    if (isHomePage) {
        const navLogo = document.querySelector('.logo-img');
        if (navLogo) navLogo.classList.add('hidden');
    }

    // Set active nav link based on current page
    setActiveNavLink();
});