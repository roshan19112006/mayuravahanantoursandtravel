import { vehicles } from './data/vehicles.js';
import { destinationsData, whyChooseUsData } from './data/destinations.js';

const WHATSAPP_NUMBER = '919894414171';

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  renderDestinations();
  renderVehicles();
  renderWhyChooseUs();
  initMasterBookingForm();
  initScrollAnimations();
});

/* =========================================
   1. NAVBAR & SLIDE DRAWER
   ========================================= */
function initNavbar() {
  const glassNav = document.getElementById('glassNav');
  const drawerBtn = document.getElementById('mobileNavBtn');
  const drawer = document.getElementById('sideDrawer');
  const overlay = document.getElementById('drawerOverlay');
  const closeBtn = document.getElementById('drawerCloseBtn');
  const links = document.querySelectorAll('.drawer-menu-a');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      glassNav?.classList.add('scrolled');
    } else {
      glassNav?.classList.remove('scrolled');
    }
  }, { passive: true });

  const openDrawer = () => {
    drawer?.classList.add('active');
    overlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer?.classList.remove('active');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
  };

  drawerBtn?.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  overlay?.addEventListener('click', closeDrawer);

  links.forEach(l => l.addEventListener('click', closeDrawer));
}

/* =========================================
   2. LUXURY VEHICLE SHOWROOM
   ========================================= */
function renderVehicles() {
  const container = document.getElementById('showroomGrid');
  if (!container) return;

  container.innerHTML = vehicles.map((v, idx) => `
    <article class="showroom-card reveal delay-${idx + 1}">
      <div class="showroom-img-frame">
        <img src="${v.image}" alt="${v.alt}" class="showroom-img" loading="lazy" />
        <span class="showroom-category-tag">${v.category}</span>
      </div>
      <div class="showroom-body">
        <h3 class="showroom-name">${v.name}</h3>
        <p class="showroom-subtitle">${v.subtitle}</p>

        <div class="showroom-specs-box">
          <div class="spec-row">
            <svg class="spec-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
            <span><strong>Seating:</strong> ${v.capacity}</span>
          </div>
          <div class="spec-row">
            <svg class="spec-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
            <span><strong>Luggage:</strong> ${v.luggage}</span>
          </div>
          <div class="spec-row">
            <svg class="spec-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            <span><strong>Climate:</strong> ${v.acType}</span>
          </div>
        </div>

        <ul class="showroom-feature-list">
          ${v.features.slice(0, 3).map(f => `<li class="showroom-feature-item">${f}</li>`).join('')}
        </ul>

        <div style="margin-top: auto; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.1);">
          <button class="btn btn-outline-gold btn-sm select-vehicle-action" style="width: 100%;" data-veh-type="${v.name}">
            Select this Vehicle
          </button>
        </div>
      </div>
    </article>
  `).join('');

  document.querySelectorAll('.select-vehicle-action').forEach(btn => {
    btn.addEventListener('click', () => {
      const vType = btn.getAttribute('data-veh-type');
      const select = document.getElementById('formVehicle');
      const booking = document.getElementById('booking');

      if (select && vType) {
        if (vType.includes('5 Seater')) select.value = '5 Seater Car';
        else if (vType.includes('7 Seater')) select.value = '7 Seater Car';
        else if (vType.includes('Tempo')) select.value = 'Tempo Traveller';
        else if (vType.includes('Bus')) select.value = 'Bus';
      }

      booking?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  observeReveals();
}

/* =========================================
   3. POPULAR DESTINATIONS (DIRECT WHATSAPP)
   ========================================= */
function renderDestinations() {
  const container = document.getElementById('destinationsHorizonGrid');
  if (!container) return;

  container.innerHTML = destinationsData.map((d, idx) => `
    <article class="horizon-dest-card reveal delay-${idx + 1}" data-dest-name="${d.name}" data-dest-subtitle="${d.subtitle}" data-dest-spots="${d.attractions.join(', ')}">
      <div class="dest-card-img-wrap">
        <img src="${d.image}" alt="${d.badge}" class="horizon-dest-img" loading="lazy" />
        <span class="dest-badge-pill">${d.badge}</span>
      </div>
      <div class="dest-card-body">
        <h3 class="dest-card-name">${d.name}</h3>
        <p class="dest-card-subtitle">${d.subtitle}</p>
        <p class="dest-card-description">${d.description}</p>
        
        <div class="dest-attractions-list">
          ${d.attractions.map(spot => `
            <div class="dest-spot-tag">
              <svg class="dest-spot-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>${spot}</span>
            </div>
          `).join('')}
        </div>

        <div class="dest-card-footer">
          <button class="btn btn-whatsapp btn-sm dest-whatsapp-cta-btn" data-dest-name="${d.name}" data-dest-subtitle="${d.subtitle}" data-dest-spots="${d.attractions.join(', ')}">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.316 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.818-.981z"/></svg>
            ${d.ctaText}
          </button>
        </div>
      </div>
    </article>
  `).join('');

  // Attach direct WhatsApp Enquiry click listeners to cards and buttons
  const sendDestInquiry = (name, subtitle, spots) => {
    const rawMsg = `*Holiday Destination Inquiry - Mayura Vahanan Travels* 🚖
----------------------------------------
📍 *Destination:* ${name} (${subtitle})
✨ *Sightseeing Spots:* ${spots}
----------------------------------------
_Hello Srithar G, I would like to inquire about tour packages, sightseeing itinerary, and taxi cab booking for ${name}._`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(rawMsg)}`;
    window.open(url, '_blank');
  };

  document.querySelectorAll('.dest-whatsapp-cta-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const name = btn.getAttribute('data-dest-name') || 'Kodaikanal';
      const subtitle = btn.getAttribute('data-dest-subtitle') || '';
      const spots = btn.getAttribute('data-dest-spots') || '';
      sendDestInquiry(name, subtitle, spots);
    });
  });

  document.querySelectorAll('.horizon-dest-card').forEach(card => {
    card.addEventListener('click', () => {
      const name = card.getAttribute('data-dest-name') || 'Kodaikanal';
      const subtitle = card.getAttribute('data-dest-subtitle') || '';
      const spots = card.getAttribute('data-dest-spots') || '';
      sendDestInquiry(name, subtitle, spots);
    });
  });

  observeReveals();
}

/* =========================================
   5. WHY CHOOSE US PILLARS
   ========================================= */
function renderWhyChooseUs() {
  const container = document.getElementById('whyPillarsGrid');
  if (!container) return;

  const icons = {
    'award': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>`,
    'shield-check': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>`,
    'car': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="9" rx="2"></rect><path d="M5 11l2-6h10l2 6"></path><circle cx="7.5" cy="16.5" r="1.5"></circle><circle cx="16.5" cy="16.5" r="1.5"></circle></svg>`,
    'wallet': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>`,
    'compass': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>`,
    'phone-call': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`
  };

  container.innerHTML = whyChooseUsData.map((item, idx) => `
    <div class="why-pillar-card reveal delay-${(idx % 3) + 1}">
      <div class="why-pillar-icon">
        ${icons[item.icon] || icons['award']}
      </div>
      <h3 class="why-pillar-title">${item.title}</h3>
      <p class="why-pillar-desc">${item.description}</p>
    </div>
  `).join('');

  observeReveals();
}

/* =========================================
   6. MASTER BOOKING FORM & WHATSAPP
   ========================================= */
function initMasterBookingForm() {
  const form = document.getElementById('masterBookingForm');
  const modal = document.getElementById('bookingConfirmationModal');
  const closeBtn = document.getElementById('modalDismissBtn');
  const okBtn = document.getElementById('modalOkBtn');
  const dateInput = document.getElementById('formDate');

  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('formName')?.value.trim() || '';
    const phone = document.getElementById('formPhone')?.value.trim() || '';
    const email = document.getElementById('formEmail')?.value.trim() || 'Not Provided';
    const destination = document.getElementById('formDest')?.value || 'Kodaikanal';
    const travelDate = document.getElementById('formDate')?.value || 'Not fixed yet';
    const passengers = document.getElementById('formPassengers')?.value || '3-4';
    const vehicle = document.getElementById('formVehicle')?.value || '5 Seater Car';
    const notes = document.getElementById('formNotes')?.value.trim() || 'No special requests';

    if (!name || !phone) {
      alert('Please provide your name and phone number.');
      return;
    }

    const rawMsg = `*Tour Booking Reservation - Mayura Vahanan Travels* 🚖
----------------------------------------
👤 *Customer Name:* ${name}
📞 *Phone:* ${phone}
📧 *Email:* ${email}
📍 *Destination:* ${destination}
📅 *Travel Date:* ${travelDate}
👥 *Number of Passengers:* ${passengers}
🚗 *Vehicle Selected:* ${vehicle}
📝 *Notes & Pickup:* ${notes}
----------------------------------------
_Booking via Mayura Vahanan Travels Official Website_`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(rawMsg)}`;
    window.open(whatsappUrl, '_blank');

    const summaryEl = document.getElementById('modalTripSummary');
    if (summaryEl) {
      summaryEl.innerHTML = `
        <div style="background: var(--light-100); padding: 14px; border-radius: var(--radius-md); font-size: 0.9rem; line-height: 1.6; margin: 16px 0; border: 1px solid var(--light-300);">
          <p><strong>Destination:</strong> ${destination}</p>
          <p><strong>Vehicle:</strong> ${vehicle}</p>
          <p><strong>Date:</strong> ${travelDate} (${passengers} Guests)</p>
          <p><strong>Contact:</strong> ${name} (${phone})</p>
        </div>
      `;
    }

    modal?.classList.add('active');
  });

  const closeModal = () => modal?.classList.remove('active');
  closeBtn?.addEventListener('click', closeModal);
  okBtn?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

/* =========================================
   7. SCROLL REVEAL ANIMATIONS
   ========================================= */
let revealObserver;

function initScrollAnimations() {
  const options = {
    root: null,
    rootMargin: '0px 0px -30px 0px',
    threshold: 0.08
  };

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, options);

  observeReveals();
}

function observeReveals() {
  const elements = document.querySelectorAll('.reveal');
  elements.forEach(el => {
    if (revealObserver) {
      revealObserver.observe(el);
    } else {
      el.classList.add('active');
    }
  });
}
