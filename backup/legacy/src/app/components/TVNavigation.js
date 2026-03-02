'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function TVNavigation() {
    const pathname = usePathname();

    useEffect(() => {
        // Add 'raz-focusable' class to interactive elements automatically
        // This is a naive implementation; in a real app, use a proper focus manager library like 'nor-spatial-navigation'

        function handleKeyDown(e) {
            // Detect arrow keys to enable TV mode styles
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                document.body.classList.add('tv-mode');
            }

            // Handle Back button (Backspace or Browser Back) for TV remote "Back"
            if (e.key === 'Backspace' || e.key === 'Escape') {
                // Optional: specialized back handling
                // window.history.back(); // Browser handles this usually
            }
        }

        window.addEventListener('keydown', handleKeyDown);

        // Auto-focus first element on route change
        const firstFocusable = document.querySelector('a, button, input, [tabindex="0"]');
        if (firstFocusable && document.body.classList.contains('tv-mode')) {
            firstFocusable.focus();
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, [pathname]);

    return null; // This component renders nothing
}
