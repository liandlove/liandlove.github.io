// Blur functionality
document.addEventListener('DOMContentLoaded', function() {
  const blurOverlay = document.getElementById('blurOverlay');
  const blurInput = document.getElementById('blurInput');
  const body = document.body;

  // Check if blur overlay exists
  if (!blurOverlay || !blurInput) return;

  // Show blur overlay on page load
  blurOverlay.classList.remove('hidden');
  body.classList.add('blur-active');

  // Listen for input changes
  blurInput.addEventListener('input', function(e) {
    const value = e.target.value.trim();
    
    // Check if user typed '67li'
    if (value === '67li') {
      // Remove blur overlay
      blurOverlay.classList.add('hidden');
      body.classList.remove('blur-active');
      
      // Clear input
      blurInput.value = '';
    }
  });

  // Prevent escape key from closing
  blurInput.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
    }
  });
});
