/**
 * Scroll to Top Button Functionality
 * Displays a button that appears when user scrolls down
 * Clicking the button smoothly scrolls to the top of the page
 */

(function () {
    'use strict';

    // Initialize scroll to top button on page load
    document.addEventListener('DOMContentLoaded', function () {
        initScrollToTop();
    });

    /**
     * Initialize the scroll to top functionality
     */
    function initScrollToTop() {
        const scrollButton = document.querySelector('.scroll-to-top');

        if (!scrollButton) {
            console.warn('Scroll to top button not found in DOM');
            return;
        }

        // Show/hide button based on scroll position
        window.addEventListener('scroll', function () {
            toggleScrollButton(scrollButton);
        });

        // Scroll to top when button is clicked
        scrollButton.addEventListener('click', function (e) {
            e.preventDefault();
            scrollToTop();
        });

        // Initial check on page load
        toggleScrollButton(scrollButton);
    }

    /**
     * Toggle button visibility based on scroll position
     * @param {HTMLElement} button - The scroll to top button element
     */
    function toggleScrollButton(button) {
        const scrollThreshold = 300; // Show button after scrolling 300px

        if (window.pageYOffset > scrollThreshold) {
            button.classList.add('show');
        } else {
            button.classList.remove('show');
        }
    }

    /**
     * Smooth scroll to top of page
     */
    function scrollToTop() {
        // Use smooth scrolling if supported
        if ('scrollBehavior' in document.documentElement.style) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            // Fallback for older browsers
            smoothScrollFallback();
        }
    }

    /**
     * Fallback smooth scroll for older browsers
     */
    function smoothScrollFallback() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 0) {
            window.requestAnimationFrame(smoothScrollFallback);
            window.scrollTo(0, currentScroll - currentScroll / 8);
        }
    }

})();

