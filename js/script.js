const filterButtons = document.querySelectorAll('#filters button');
const galleryItems = document.querySelectorAll('.gallery-item');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove active from all
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const filter = button.getAttribute('data-filter');
    galleryItems.forEach(item => {
      if (filter === 'all' || item.getAttribute('data-category') === filter) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// Lightbox Modal Logic
const galleryWrappers = document.querySelectorAll('.gallery-img-wrapper');
const lightboxModal = new bootstrap.Modal(document.getElementById('lightboxModal'));
const lightboxImg = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxCategory = document.getElementById('lightboxCategory');
const lightboxDesc = document.querySelector('.modal-desc');

galleryWrappers.forEach(wrapper => {
  wrapper.addEventListener('click', function () {
    const img = this.querySelector('img');
    const overlay = this.querySelector('.gallery-overlay');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxTitle.textContent = overlay.querySelector('h5').textContent;
    const badge = overlay.querySelector('.badge');
    lightboxCategory.textContent = badge.textContent;
    lightboxCategory.className = 'badge ' + badge.className.replace('badge', '').trim();
    // Set description from data-description attribute
    const desc = this.getAttribute('data-description') || '';
    if (lightboxDesc) {
      lightboxDesc.textContent = desc;
    }
    lightboxModal.show();
  });
});

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
  if (window.AOS) {
    AOS.init({
      duration: 800,
      once: true
    });
  }
});

const gallery = document.querySelector('.gallery');
let currentActive = null;
let captionBox = null;

function closeCaption() {
  if (currentActive) {
    currentActive.classList.remove('active');
    if (captionBox) {
      captionBox.classList.remove('active');
      setTimeout(() => {
        if (captionBox) captionBox.remove();
        captionBox = null;
      }, 400);
    }
    currentActive = null;
  }
}

gallery.addEventListener('click', function(e) {
  const item = e.target.closest('.gallery-item');
  if (!item) return;

  // If clicking the already active image, close it
  if (item === currentActive) {
    closeCaption();
    return;
  }

  // Close previous
  closeCaption();

  // Open new
  item.classList.add('active');
  currentActive = item;

  // Create caption box
  captionBox = document.createElement('div');
  captionBox.className = 'caption-box';
  captionBox.innerHTML = `
    <div class="caption-title">${item.dataset.title}</div>
    <div class="caption-desc">${item.dataset.desc}</div>
  `;

  // Insert caption box into gallery-container
  item.parentElement.parentElement.appendChild(captionBox);

  // Position caption box vertically centered relative to the item
  function positionCaption() {
    const itemRect = item.getBoundingClientRect();
    const containerRect = gallery.parentElement.getBoundingClientRect();
    let top = itemRect.top - containerRect.top + itemRect.height / 2;
    captionBox.style.top = `${top}px`;
    // For mobile, left is 50%, otherwise 0
    if (window.innerWidth <= 600) {
      captionBox.style.left = '50%';
    } else {
      captionBox.style.left = '0';
    }
  }
  positionCaption();
  window.addEventListener('resize', positionCaption, { once: true });

  // Animate in
  setTimeout(() => captionBox.classList.add('active'), 10);
});

// Optional: Close caption when clicking outside
document.addEventListener('click', function(e) {
  if (
    currentActive &&
    !e.target.closest('.gallery-item') &&
    !e.target.closest('.caption-box')
  ) {
    closeCaption();
  }
});
