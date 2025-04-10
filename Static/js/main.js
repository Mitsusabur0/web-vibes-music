// Static/js/main.js

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.querySelector('body');
    const navLinks = document.querySelectorAll('.nav-link');
    
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

    // Initialize carousels if on videos or music page
    if (document.querySelector('.videos-carousel')) {
        initCarousels();
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

    // Check if we're on the home page
    const currentPage = getCurrentPage();
    const isHomePage = currentPage === 'index';
    
    // Keep the nav logo hidden on home page
    if (isHomePage) {
        const navLogo = document.querySelector('.logo-img');
        if (navLogo) navLogo.classList.add('hidden');
    }

    // Set active nav link based on current page
    setActiveNavLink();
});