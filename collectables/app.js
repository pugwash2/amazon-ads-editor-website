/* Jeffs Digital Collectables - Storefront Logic */

(function () {
  'use strict';

  var LISTINGS_URL = '/collectables/listings.json';
  var WAX_API_URL = '/api/wax';

  // ---- DOM refs ----
  var gridEl = document.getElementById('collection-grid');
  var stateEl = document.getElementById('collection-state');
  var statAvailable = document.getElementById('stat-available');
  var statCollections = document.getElementById('stat-collections');
  var statTotal = document.getElementById('stat-total');
  var navEl = document.getElementById('site-nav');

  // ---- Nav scroll effect ----
  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) {
      navEl.classList.add('scrolled');
    } else {
      navEl.classList.remove('scrolled');
    }
  });

  // ---- Fetch helpers ----
  function fetchJSON(url) {
    return fetch(url).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    });
  }

  // ---- Render ----
  function showError(message) {
    stateEl.innerHTML =
      '<div class="state-message">' +
      '<h3>Unable to load collection</h3>' +
      '<p>' + escapeHtml(message) + '</p>' +
      '</div>';
    stateEl.style.display = '';
    gridEl.style.display = 'none';
  }

  function showEmpty() {
    stateEl.innerHTML =
      '<div class="state-message">' +
      '<h3>No items currently listed</h3>' +
      '<p>Check back soon. Jeff adds new pieces regularly.</p>' +
      '</div>';
    stateEl.style.display = '';
    gridEl.style.display = 'none';
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function buildCard(item) {
    var name = item.listing.title_override || item.asset.name;
    var imageUrl = item.asset.image_url;
    var collection = item.asset.collection_display || item.asset.collection_name;
    var price = item.listing.price || '';
    var note = item.listing.note || '';
    var assetId = item.asset.asset_id;

    var imageHtml;
    if (imageUrl) {
      imageHtml =
        '<img src="' + escapeHtml(imageUrl) + '" alt="' + escapeHtml(name) + '" loading="lazy" ' +
        'onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';">' +
        '<div class="card-image-placeholder" style="display:none;">Image unavailable</div>';
    } else {
      imageHtml = '<div class="card-image-placeholder">No image available</div>';
    }

    var noteHtml = note ? '<div class="card-note">' + escapeHtml(note) + '</div>' : '';

    var contactMethod = 'Enquire';

    return (
      '<div class="card">' +
      '  <div class="card-image-wrap">' + imageHtml + '</div>' +
      '  <div class="card-body">' +
      (collection ? '    <div class="card-collection">' + escapeHtml(collection) + '</div>' : '') +
      '    <div class="card-name">' + escapeHtml(name) + '</div>' +
      '    <div class="card-asset-id">#' + escapeHtml(assetId) + '</div>' +
      noteHtml +
      '    <div class="card-footer">' +
      (price ? '      <div class="card-price">' + escapeHtml(price) + '</div>' : '<div></div>') +
      '      <a href="#how-to-buy" class="card-cta">' + contactMethod + '</a>' +
      '    </div>' +
      '  </div>' +
      '</div>'
    );
  }

  function renderCards(items) {
    if (!items.length) {
      showEmpty();
      return;
    }

    gridEl.innerHTML = items.map(buildCard).join('');
    stateEl.style.display = 'none';
    gridEl.style.display = '';
  }

  function updateStats(availableCount, walletCount, collectionNames) {
    statAvailable.textContent = availableCount;
    statCollections.textContent = collectionNames.size;
    statTotal.textContent = walletCount;
  }

  // ---- Main ----
  function init() {
    Promise.all([fetchJSON(WAX_API_URL), fetchJSON(LISTINGS_URL)])
      .then(function (results) {
        var waxData = results[0];
        var listingsData = results[1];

        if (!waxData.success || !Array.isArray(waxData.assets)) {
          showError('Could not fetch wallet data. The blockchain API may be temporarily unavailable.');
          return;
        }

        var assets = waxData.assets;
        var listings = (listingsData.listings || []).filter(function (l) {
          return l.status === 'for_sale';
        });

        // Build asset lookup
        var assetMap = {};
        assets.forEach(function (a) {
          assetMap[a.asset_id] = a;
        });

        // Match: only items that are for_sale AND still in wallet
        var matched = [];
        listings.forEach(function (listing) {
          var asset = assetMap[listing.asset_id];
          if (asset) {
            matched.push({ asset: asset, listing: listing });
          }
        });

        // Sort by sort_order
        matched.sort(function (a, b) {
          return (a.listing.sort_order || 999) - (b.listing.sort_order || 999);
        });

        // Collect unique collection names from matched items
        var collectionNames = new Set();
        matched.forEach(function (m) {
          if (m.asset.collection_name) collectionNames.add(m.asset.collection_name);
        });

        // All collection names from wallet for stats
        var allCollections = new Set();
        assets.forEach(function (a) {
          if (a.collection_name) allCollections.add(a.collection_name);
        });

        updateStats(matched.length, assets.length, allCollections);
        renderCards(matched);
      })
      .catch(function (err) {
        console.error('Failed to load collection:', err);
        showError('Something went wrong loading the collection. Please refresh and try again.');
      });
  }

  init();
})();
