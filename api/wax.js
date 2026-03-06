const API_BASE = 'https://wax.api.atomicassets.io/atomicassets/v1';
const OWNER = '1.prg.wam';
const PAGE_SIZE = 100;

function normalizeImageUrl(raw) {
  if (!raw) return null;
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
  if (raw.startsWith('Qm') || raw.startsWith('bafy')) return `https://ipfs.io/ipfs/${raw}`;
  return null;
}

function normalizeAsset(asset) {
  const data = asset.data || {};
  const template = asset.template || {};
  const templateData = template.immutable_data || {};
  const collection = asset.collection || {};

  const imageRaw = data.img || data.image || data.video || templateData.img || templateData.image || null;

  return {
    asset_id: asset.asset_id,
    name: asset.name || data.name || templateData.name || 'Unnamed',
    collection_name: collection.collection_name || '',
    collection_display: collection.name || collection.collection_name || '',
    template_id: template.template_id || null,
    image_url: normalizeImageUrl(imageRaw),
    schema_name: asset.schema ? asset.schema.schema_name : '',
    mint_number: asset.template_mint || null,
    backed_tokens: asset.backed_tokens || [],
    is_transferable: asset.is_transferable,
    is_burnable: asset.is_burnable,
  };
}

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const allAssets = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const url = `${API_BASE}/assets?owner=${OWNER}&limit=${PAGE_SIZE}&page=${page}&order=desc&sort=asset_id`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`AtomicAssets API returned ${response.status}`);
      }

      const json = await response.json();

      if (!json.success || !Array.isArray(json.data)) {
        throw new Error('Unexpected API response format');
      }

      allAssets.push(...json.data);
      hasMore = json.data.length === PAGE_SIZE;
      page++;

      if (page > 20) break;
    }

    const normalized = allAssets.map(normalizeAsset);

    return res.status(200).json({
      success: true,
      owner: OWNER,
      count: normalized.length,
      assets: normalized,
    });
  } catch (err) {
    console.error('WAX API error:', err.message);
    return res.status(502).json({
      success: false,
      error: 'Unable to fetch wallet data. Please try again later.',
      detail: err.message,
    });
  }
};
