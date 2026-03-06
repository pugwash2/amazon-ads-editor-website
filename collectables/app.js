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
      '<h3>No items currently in the vault</h3>' +
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
    var listing = item.listing || {};
    var asset = item.asset;
    var name = listing.title_override || asset.name;
    var imageUrl = asset.image_url;
    var collection = asset.collection_display || asset.collection_name;
    var price = listing.price || '';
    var note = listing.note || '';
    var assetId = asset.asset_id;
    var hidden = listing.status === 'hidden';

    if (hidden) return '';

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
      '      <a href="#how-to-buy" class="card-cta">Enquire</a>' +
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
    // Fetch wallet data first, listings.json is optional (for price/note overrides)
    var waxPromise = fetchJSON(WAX_API_URL);
    var listingsPromise = fetchJSON(LISTINGS_URL).catch(function () {
      return { listings: [] };
    });

    Promise.all([waxPromise, listingsPromise])
      .then(function (results) {
        var waxData = results[0];
        var listingsData = results[1];

        if (!waxData.success || !Array.isArray(waxData.assets)) {
          showError('Could not fetch wallet data. The blockchain API may be temporarily unavailable.');
          return;
        }

        var assets = waxData.assets;

        // Build listing overrides lookup by asset_id
        var listingMap = {};
        (listingsData.listings || []).forEach(function (l) {
          listingMap[l.asset_id] = l;
        });

        // Show ALL wallet assets. Merge with listing overrides if they exist.
        var items = assets.map(function (asset) {
          return {
            asset: asset,
            listing: listingMap[asset.asset_id] || {}
          };
        });

        // Filter out items explicitly marked as hidden
        items = items.filter(function (item) {
          return item.listing.status !== 'hidden';
        });

        // Sort: items with sort_order come first, then by asset_id descending
        items.sort(function (a, b) {
          var aOrder = a.listing.sort_order;
          var bOrder = b.listing.sort_order;
          var aHas = typeof aOrder === 'number';
          var bHas = typeof bOrder === 'number';
          if (aHas && bHas) return aOrder - bOrder;
          if (aHas) return -1;
          if (bHas) return 1;
          return b.asset.asset_id.localeCompare(a.asset.asset_id);
        });

        // Stats
        var allCollections = new Set();
        items.forEach(function (item) {
          if (item.asset.collection_name) allCollections.add(item.asset.collection_name);
        });

        updateStats(items.length, assets.length, allCollections);
        renderCards(items);
      })
      .catch(function (err) {
        console.error('Failed to load collection:', err);
        showError('Something went wrong loading the collection. Please refresh and try again.');
      });
  }

  init();
})();
