/**
 * PWA Checker
 * Author: alirezasaddeghi
 * Website: alirezasaddeghi.ir/bio
 */

document.addEventListener('DOMContentLoaded', async () => {
    const statusElement = document.getElementById('status');
    
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        // Inject content script to check for PWA
        const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: checkForPWA,
        });

        const pwaDetails = results[0].result;
        
        if (pwaDetails.isPWA) {
            statusElement.textContent = 'This website is a PWA! 🎉';
            statusElement.className = 'status is-pwa';
        } else {
            let message = 'This website is not a PWA\n';
            if (!pwaDetails.hasManifest) {
                message += '❌ No Web App Manifest found\n';
            }
            if (!pwaDetails.hasServiceWorker) {
                message += '❌ No Service Worker support';
            }
            statusElement.textContent = message;
            statusElement.className = 'status not-pwa';
            statusElement.style.whiteSpace = 'pre-line';
        }
    } catch (error) {
        console.error('Error:', error);
        statusElement.textContent = 'Unable to check PWA status. Please try reloading the page.';
        statusElement.className = 'status not-pwa';
    }
});

function checkForPWA() {
    const hasManifest = !!document.querySelector('link[rel="manifest"]');
    const hasServiceWorker = 'serviceWorker' in navigator;
    
    return {
        isPWA: hasManifest && hasServiceWorker,
        hasManifest: hasManifest,
        hasServiceWorker: hasServiceWorker
    };
} 