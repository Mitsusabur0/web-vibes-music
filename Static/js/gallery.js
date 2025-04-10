// Static/js/gallery.js

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize gallery if on gallery page
    if (document.querySelector('.gallery-scroller')) {
        // Fetch gallery data from JSON file
        fetch('/Media/gallery-data.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(galleryItems => {
                initGallery(galleryItems);
                
                // Initialize lightbox if on gallery page
                if (document.getElementById('image-lightbox')) {
                    initLightbox();
                }
                
                // Set up category filtering if buttons exist
                setupCategoryFiltering();
            })
            .catch(error => {
                console.error('Error loading gallery data:', error);
                // You could display a fallback message or images here
            });
    }

    /**
     * Set up category filtering buttons
     */
    function setupCategoryFiltering() {
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
    }

    /**
     * Initialize gallery with items
     * @param {Array} galleryItems - Array of gallery item objects
     */
    function initGallery(galleryItems) {
        const galleryScroller = document.querySelector('.gallery-scroller');
        if (!galleryScroller) return;

        // Clear existing content
        galleryScroller.innerHTML = '';

        // Create Intersection Observer for lazy loading
        const observer = createLazyLoadingObserver();

        // Create gallery items with placeholder images
        galleryItems.forEach(item => {
            const galleryItem = document.createElement('div');
            galleryItem.className = `gallery-item ${item.category}`;
            
            // Create image with placeholder initially
            galleryItem.innerHTML = `
                <img 
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400' %3E%3Crect width='300' height='400' fill='%23cccccc'/%3E%3C/svg%3E" 
                    data-src="${item.src}" 
                    alt="${item.alt}"
                    class="lazy-image"
                >
            `;
            
            galleryScroller.appendChild(galleryItem);
            
            // Observe each gallery item for lazy loading
            observer.observe(galleryItem);
        });
    }

    /**
     * Create an Intersection Observer for lazy loading images
     */
    function createLazyLoadingObserver() {
        const options = {
            root: document.querySelector('.gallery-scroller'),
            rootMargin: '0px 200px 0px 200px', // 200px buffer on left and right
            threshold: 0.1 // Trigger when at least 10% of the item is visible
        };

        return new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target.querySelector('.lazy-image');
                    if (img && img.dataset.src) {
                        // Set actual image source
                        img.src = img.dataset.src;
                        
                        // Remove data-src to avoid loading again
                        img.removeAttribute('data-src');
                        
                        // Remove lazy-image class
                        img.classList.remove('lazy-image');
                        
                        // Stop observing this item
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, options);
    }

    /**
     * Initialize lightbox functionality
     */
    function initLightbox() {
        const lightbox = document.getElementById('image-lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxClose = document.querySelector('.lightbox-close');
        const prevButton = document.querySelector('.lightbox-nav.prev');
        const nextButton = document.querySelector('.lightbox-nav.next');
        const body = document.querySelector('body');
        
        let currentIndex = 0;
        let visibleItems = [];

        // Update the visible items based on current filtering
        function updateVisibleItems() {
            visibleItems = [];
            const items = document.querySelectorAll('.gallery-item');
            items.forEach((item, index) => {
                if (item.style.display !== 'none') {
                    // For lazy-loaded images, use data-src if the src hasn't been loaded yet
                    const img = item.querySelector('img');
                    const imgSrc = img.classList.contains('lazy-image') ? 
                                  img.dataset.src : img.src;
                    
                    visibleItems.push({
                        index: index,
                        element: item,
                        img: imgSrc,
                        alt: img.alt
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
                    
                    // Also trigger loading of the image if it hasn't been loaded yet
                    const img = galleryItem.querySelector('img');
                    if (img.classList.contains('lazy-image') && img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.remove('lazy-image');
                    }
                }
            }
        });

        // Open lightbox with current image
        function openLightbox() {
            if (visibleItems.length === 0) return;
            
            const current = visibleItems[currentIndex];
            lightboxImg.src = current.img;
            lightboxImg.alt = current.alt;
            
            lightbox.style.display = 'block';
            body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
            
            // Preload adjacent images when in lightbox
            preloadAdjacentImages();
        }
        
        // Preload adjacent images when in lightbox to ensure smooth navigation
        function preloadAdjacentImages() {
            if (visibleItems.length <= 1) return;
            
            const prevIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
            const nextIndex = (currentIndex + 1) % visibleItems.length;
            
            // Preload previous image
            const prevImg = visibleItems[prevIndex].element.querySelector('img');
            if (prevImg.classList.contains('lazy-image') && prevImg.dataset.src) {
                const preloadPrev = new Image();
                preloadPrev.src = prevImg.dataset.src;
            }
            
            // Preload next image
            const nextImg = visibleItems[nextIndex].element.querySelector('img');
            if (nextImg.classList.contains('lazy-image') && nextImg.dataset.src) {
                const preloadNext = new Image();
                preloadNext.src = nextImg.dataset.src;
            }
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
     * Fallback for browsers that don't support IntersectionObserver
     */
    function loadImagesIfIntersectionNotSupported() {
        if (!('IntersectionObserver' in window)) {
            console.log('IntersectionObserver not supported, loading all images');
            document.querySelectorAll('.lazy-image').forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.remove('lazy-image');
                }
            });
        }
    }
    
    // Call the fallback function if needed
    loadImagesIfIntersectionNotSupported();
});