// Static/js/gallery.js

document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const galleryConfig = {
        jsonPath: '/Media/data/gallery.json', // Path to the JSON file
        carouselWrapper: document.querySelector('.gallery-carousel .carousel-wrapper'),
        carouselContainer: document.querySelector('.gallery-carousel'),
        thumbnailStrip: document.querySelector('.thumbnail-strip'),
        prevButton: document.querySelector('.gallery-carousel .carousel-nav.prev'),
        nextButton: document.querySelector('.gallery-carousel .carousel-nav.next'),
        lightbox: document.getElementById('image-lightbox'),
        lightboxImg: document.getElementById('lightbox-img'),
        lightboxTitle: document.getElementById('lightbox-title'),
        lightboxClose: document.querySelector('.lightbox-close'),
        lightboxPrev: document.querySelector('.lightbox-nav.prev'),
        lightboxNext: document.querySelector('.lightbox-nav.next')
    };

    // State variables
    let galleryData = []; // Will hold the image data from JSON
    let currentIndex = 0; // Current position in the gallery carousel
    let currentLightboxIndex = 0; // Current image index in lightbox
    let isMobile = window.innerWidth <= 768; // Check if we're on mobile

    // Initialize the gallery
    initGallery();

    function initGallery() {
        // Fetch gallery data from JSON file
        fetch(galleryConfig.jsonPath)
            .then(response => response.json())
            .then(data => {
                galleryData = data; // Direct array, not nested under 'images'
                renderGallery();
                setupEventListeners();
                // Set up mobile navigation if needed
                if (isMobile) {
                    setupMobileNavigation();
                }
            })
            .catch(error => {
                console.error('Error loading gallery data:', error);
                // For demonstration purposes, use placeholder images if JSON fails to load
                useDefaultImages();
            });
    }

    // Fallback function to use default images if JSON loading fails
    function useDefaultImages() {
        galleryData = [
            {
                id: 1,
                alt: "Bives Live Performance",
                src: "/Media/images/gallery/1.jpg",
                category: "outdoor"
            },
            {
                id: 2,
                alt: "Studio Session",
                src: "/Media/images/gallery/2.jpg",
                category: "studio"
            },
            {
                id: 3,
                alt: "Backstage Moments",
                src: "/Media/images/gallery/3.jpg",
                category: "outdoor"
            },
            {
                id: 4,
                alt: "Album Cover Shoot",
                src: "/Media/images/gallery/4.jpg",
                category: "studio"
            },
            {
                id: 5,
                alt: "Music Video Behind the Scenes",
                src: "/Media/images/gallery/5.jpg",
                category: "outdoor"
            }
        ];
        renderGallery();
        setupEventListeners();
        // Set up mobile navigation if needed
        if (isMobile) {
            setupMobileNavigation();
        }
    }

    // Set up mobile-specific navigation
    function setupMobileNavigation() {
        // Create mobile navigation container
        const mobileNavContainer = document.createElement('div');
        mobileNavContainer.className = 'mobile-nav-container';
        
        // Clone the navigation buttons
        const mobilePrevBtn = galleryConfig.prevButton.cloneNode(true);
        const mobileNextBtn = galleryConfig.nextButton.cloneNode(true);
        
        // Add the buttons to the container
        mobileNavContainer.appendChild(mobilePrevBtn);
        mobileNavContainer.appendChild(mobileNextBtn);
        
        // Insert container after the carousel wrapper but before the thumbnail container
        galleryConfig.carouselWrapper.after(mobileNavContainer);
        
        // Add event listeners to these new buttons
        mobilePrevBtn.addEventListener('click', function() {
            let index = (currentIndex - 1 + galleryData.length) % galleryData.length;
            showItem(index);
        });
        
        mobileNextBtn.addEventListener('click', function() {
            let index = (currentIndex + 1) % galleryData.length;
            showItem(index);
        });
    }

    // Render the gallery images and thumbnails
    function renderGallery() {
        // Clear existing content
        galleryConfig.carouselWrapper.innerHTML = '';
        galleryConfig.thumbnailStrip.innerHTML = '';
        
        // Add gallery items
        galleryData.forEach((image, index) => {
            // Create gallery item
            const galleryItem = document.createElement('div');
            galleryItem.className = 'carousel-item gallery-item';
            if (index === 0) galleryItem.classList.add('active'); // First item is active
            
            galleryItem.innerHTML = `
                <div class="gallery-image-container">
                    <img src="${image.src}" alt="${image.alt}" class="gallery-img">
                </div>
            `;
            
            galleryConfig.carouselWrapper.appendChild(galleryItem);
            
            // Create thumbnail
            const thumbnail = document.createElement('div');
            thumbnail.className = 'thumbnail';
            if (index === 0) thumbnail.classList.add('active');
            thumbnail.setAttribute('data-index', index);
            
            thumbnail.innerHTML = `
                <img src="${image.src}" alt="Thumbnail ${index + 1}" class="thumbnail-img">
            `;
            
            galleryConfig.thumbnailStrip.appendChild(thumbnail);
        });
    }

    // Show a specific gallery item
    function showItem(index) {
        // Get all items and thumbnails
        const items = galleryConfig.carouselWrapper.querySelectorAll('.carousel-item');
        const thumbnails = galleryConfig.thumbnailStrip.querySelectorAll('.thumbnail');
        
        // Hide all items and deactivate thumbnails
        items.forEach(item => item.classList.remove('active'));
        thumbnails.forEach(thumbnail => thumbnail.classList.remove('active'));
        
        // Show selected item and activate thumbnail
        items[index].classList.add('active');
        thumbnails[index].classList.add('active');
        
        // Scroll the thumbnail into view (center it)
        const thumbnailStrip = galleryConfig.thumbnailStrip;
        const thumbnail = thumbnails[index];
        const thumbnailRect = thumbnail.getBoundingClientRect();
        const stripRect = thumbnailStrip.getBoundingClientRect();
        
        const scrollLeft = thumbnail.offsetLeft - (stripRect.width / 2) + (thumbnailRect.width / 2);
        thumbnailStrip.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
        });
        
        // Update current index
        currentIndex = index;
    }

    // Open lightbox with specific image
    function openLightbox(index) {
        currentLightboxIndex = index;
        const image = galleryData[index];
        
        galleryConfig.lightboxImg.src = image.src;
        galleryConfig.lightboxTitle.textContent = image.alt;
        galleryConfig.lightbox.style.display = 'block';
        
        // Prevent scrolling on the body when lightbox is open
        document.body.classList.add('no-scroll');
    }

    // Close the lightbox
    function closeLightbox() {
        galleryConfig.lightbox.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }

    // Navigate to previous image in lightbox
    function lightboxPrev() {
        if (currentLightboxIndex > 0) {
            openLightbox(currentLightboxIndex - 1);
        }
    }

    // Navigate to next image in lightbox
    function lightboxNext() {
        if (currentLightboxIndex < galleryData.length - 1) {
            openLightbox(currentLightboxIndex + 1);
        }
    }

    // Handle window resize to switch between mobile and desktop layouts
    window.addEventListener('resize', function() {
        const wasMobile = isMobile;
        isMobile = window.innerWidth <= 768;
        
        // If changed from desktop to mobile
        if (!wasMobile && isMobile) {
            setupMobileNavigation();
        }
        // If changed from mobile to desktop
        else if (wasMobile && !isMobile) {
            const mobileNav = document.querySelector('.mobile-nav-container');
            if (mobileNav) {
                mobileNav.remove();
            }
        }
    });

    // Setup all event listeners
    function setupEventListeners() {
        // Carousel navigation
        galleryConfig.prevButton.addEventListener('click', function() {
            let index = (currentIndex - 1 + galleryData.length) % galleryData.length;
            showItem(index);
        });
        
        galleryConfig.nextButton.addEventListener('click', function() {
            let index = (currentIndex + 1) % galleryData.length;
            showItem(index);
        });
        
        // Thumbnail clicks to navigate
        const thumbnails = galleryConfig.thumbnailStrip.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', function() {
                showItem(index);
            });
        });
        
        // Gallery item clicks to open lightbox
        const galleryItems = galleryConfig.carouselWrapper.querySelectorAll('.gallery-item');
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', function() {
                openLightbox(index);
            });
        });
        
        // Lightbox controls
        galleryConfig.lightboxClose.addEventListener('click', closeLightbox);
        galleryConfig.lightboxPrev.addEventListener('click', lightboxPrev);
        galleryConfig.lightboxNext.addEventListener('click', lightboxNext);
        
        // Close lightbox when clicking outside the image
        galleryConfig.lightbox.addEventListener('click', function(e) {
            if (e.target === galleryConfig.lightbox) {
                closeLightbox();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            // Only process keyboard events if lightbox is open
            if (galleryConfig.lightbox.style.display === 'block') {
                if (e.key === 'Escape') {
                    closeLightbox();
                } else if (e.key === 'ArrowLeft') {
                    lightboxPrev();
                } else if (e.key === 'ArrowRight') {
                    lightboxNext();
                }
            } else {
                // Otherwise use arrows for gallery navigation
                if (e.key === 'ArrowLeft') {
                    galleryConfig.prevButton.click();
                } else if (e.key === 'ArrowRight') {
                    galleryConfig.nextButton.click();
                }
            }
        });
    }
});