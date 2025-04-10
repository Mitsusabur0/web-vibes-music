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

        // Create gallery items - removed title/info div
        galleryItems.forEach(item => {
            const galleryItem = document.createElement('div');
            galleryItem.className = `gallery-item ${item.category}`;
            galleryItem.innerHTML = `
                <img src="${item.src}" alt="${item.alt}">
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
                    visibleItems.push({
                        index: index,
                        element: item,
                        img: item.querySelector('img').src,
                        alt: item.querySelector('img').alt
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

        // Open lightbox with current image (removed title setting)
        function openLightbox() {
            if (visibleItems.length === 0) return;
            
            const current = visibleItems[currentIndex];
            lightboxImg.src = current.img;
            lightboxImg.alt = current.alt;
            
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
});