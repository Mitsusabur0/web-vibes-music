// Static/js/main.js

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.querySelector('body');
    const navLinks = document.querySelectorAll('.nav-link');

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
     * Set active navigation based on current page
     * This replaces the scroll-based active nav functionality
     */
    function setActiveNavLink() {
        // Get current page filename
        const currentPage = window.location.pathname.split('/').pop();
        
        // Remove active class from all links
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Set active class based on current page
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href');
            
            // Handle index page special case
            if ((currentPage === '' || currentPage === '/' || currentPage === 'index.html') && 
                linkPage === 'index.html') {
                link.classList.add('active');
            } 
            // For other pages - make more robust by removing .html for comparison
            else if (currentPage.replace('.html', '') === linkPage.replace('.html', '')) {
                link.classList.add('active');
            }
        });
    }

    // Set active nav link based on current page
    setActiveNavLink();
});





// EXPERIMENTAL LOGO TRANSITION
// Add this to your main.js file
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the home page
    const isHomePage = window.location.pathname.endsWith('index.html') || 
                       window.location.pathname.endsWith('/');
    
    if (isHomePage) {
        // Get all navigation links except the home link
        const navLinks = document.querySelectorAll('.nav-link:not([href="index.html"])');
        const centerLogo = document.querySelector('.title-img');
        const navLogo = document.querySelector('.logo-img');
        
        // Keep the nav logo hidden on home page
        navLogo.classList.add('hidden');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault(); // Prevent immediate navigation
                
                const destination = this.getAttribute('href');
                
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
                clonedLogo.style.transition = 'all 0.8s ease-in-out';
                clonedLogo.style.zIndex = '2000';
                
                document.body.appendChild(clonedLogo);
                
                // Hide the original logo
                centerLogo.style.opacity = '0';
                
                // Force a reflow before starting the animation
                void clonedLogo.offsetWidth;
                
                // Animate to top left corner with size change
                clonedLogo.style.left = navLogoRect.left + 'px';
                clonedLogo.style.top = navLogoRect.top + 'px';
                clonedLogo.style.width = navLogoRect.width + 'px';
                clonedLogo.style.height = navLogoRect.height + 'px';
                
                // Navigate after animation completes
                setTimeout(() => {
                    window.location.href = destination;
                }, 800); // Match this to the transition duration
            });
        });
    }
});






document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on any page (this animation can work on all pages)
    
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Find the currently active link
    let activeLink = document.querySelector('.nav-link.active');
    
    // Only proceed if we have navigation links
    if (navLinks.length) {
        // If no active link is found, default to the current page
        if (!activeLink) {
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            activeLink = document.querySelector(`.nav-link[href="${currentPage}"]`);
        }
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Only do the animation if this isn't the current page
                if (!this.classList.contains('active')) {
                    e.preventDefault(); // Prevent immediate navigation
                    
                    const destination = this.getAttribute('href');
                    
                    // Create an animated line element
                    const animatedLine = document.createElement('div');
                    animatedLine.style.position = 'absolute';
                    animatedLine.style.height = '3px';
                    animatedLine.style.backgroundColor = 'var(--accent-color)';
                    // animatedLine.style.transition = 'all 0.5s ease-in-out';
                    animatedLine.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
                    animatedLine.style.zIndex = '1000';
                    document.body.appendChild(animatedLine);
                    
                    // Get positions for start (active link) and end (clicked link)
                    const startRect = activeLink.getBoundingClientRect();
                    const endRect = this.getBoundingClientRect();
                    
                    // Position the line initially under the active link
                    animatedLine.style.width = startRect.width + 'px';
                    animatedLine.style.left = startRect.left + 'px';
                    animatedLine.style.top = (startRect.bottom) + 'px';
                    
                    // Force a reflow before starting the animation
                    void animatedLine.offsetWidth;
                    
                    // Animate to the position of the clicked link
                    animatedLine.style.width = endRect.width + 'px';
                    animatedLine.style.left = endRect.left + 'px';
                    
                    // Navigate after animation completes
                    setTimeout(() => {
                        window.location.href = destination;
                    }, 500); // Match this to the transition duration
                }
            });
        });
        
        // For the logo animation, keep it separate
        const isHomePage = window.location.pathname.endsWith('index.html') || 
                          window.location.pathname.endsWith('/');
        
        if (isHomePage) {
            // Insert the logo animation code from previous solution here
            // ...
        }
    }
});