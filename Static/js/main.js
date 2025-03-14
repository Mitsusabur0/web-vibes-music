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
            src: '/Media/images/desktop/gallery/1.jpg',
            alt: 'Bives performing outdoors',
            category: 'outdoor',
            title: 'Summer Festival 2024'
        },
        {
            id: 2,
            src: '/Media/images/desktop/gallery/2.jpg',
            alt: 'Bives in studio session',
            category: 'studio',
            title: 'Recording Misery and the Mend'
        },
        {
            id: 3,
            src: '/Media/images/desktop/gallery/3.jpg',
            alt: 'Bives outdoor concert',
            category: 'outdoor',
            title: 'LA Music Festival'
        },
        {
            id: 4,
            src: '/Media/images/desktop/gallery/4.jpg',
            alt: 'Bives in the studio',
            category: 'studio',
            title: 'EastWest Studios Session'
        },
        {
            id: 5,
            src: '/Media/images/desktop/gallery/5.jpg',
            alt: 'Bives performing live',
            category: 'outdoor',
            title: 'Venice Beach Concert'
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

    // Active navigation link based on scroll position
    window.addEventListener('scroll', debounce(updateActiveNavLink));

    // Initial call to set active link
    updateActiveNavLink();

    // Initialize gallery
    initGallery();

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
     * Update active navigation link based on scroll position
     */
    function updateActiveNavLink() {
        // Get all sections
        const sections = document.querySelectorAll('section.page');
        
        // Get current scroll position
        const scrollY = window.pageYOffset;
        
        // Loop through sections and get the current section
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to current link
                const currentLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (currentLink) {
                    currentLink.classList.add('active');
                }
            }
        });
    }

    /**
     * Debounce function to limit function calls
     * @param {Function} func - The function to debounce
     * @param {number} wait - The debounce wait time
     * @returns {Function} - Debounced function
     */
    function debounce(func, wait = 20) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }
});