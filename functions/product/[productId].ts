interface Env {
    ASSETS: { fetch: typeof fetch };
}

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { request, env, params } = context;
    const productId = params.productId as string;

    // 1. Fetch static index.html template from Cloudflare assets
    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) {
        return response;
    }

    try {
        // 2. Fetch product details from Railway backend API
        const apiRes = await fetch(`https://api.tiranlasry.com/api/product/${productId}`);
        if (!apiRes.ok) {
            return response;
        }

        const product = await apiRes.json();
        if (!product) {
            return response;
        }

        // 3. Resolve catalog card photo (C_ photo takes highest priority)
        const rawImgs = Array.isArray(product?.imgsUrl) ? product.imgsUrl : [];
        const cleanUrls = rawImgs.map((url: string) =>
            url.replace(/[\r\n\s]+/g, '').replace(/\.[^/.]+$/, '').replace(/^4G8A/i, '')
        );
        const filtered = cleanUrls.filter((u: string) => u !== 'coming-soon');
        const cPhoto = filtered.find((u: string) => u.toUpperCase().startsWith('C_'));
        const hPhoto = filtered.find((u: string) => u.toUpperCase().startsWith('H_'));
        const otherPhoto = filtered.find((u: string) => 
            !u.toUpperCase().startsWith('C_') && 
            !u.toUpperCase().startsWith('H_') && 
            !u.toUpperCase().startsWith('S_')
        );
        const sPhoto = filtered.find((u: string) => u.toUpperCase().startsWith('S_'));

        const chosenImg = cPhoto || hPhoto || otherPhoto || sPhoto;
        const cloudId = 'dhixlriwm';

        let ogImage = 'https://tiranlasry.com/images/Figma/Tiran_T_Grey_Logo.png';
        if (chosenImg) {
            const nameWithout4G8A = chosenImg.replace(/^4G8A/i, '');
            const upper = nameWithout4G8A.toUpperCase();
            const publicId = (upper.startsWith('C_') || upper.startsWith('H_') || upper.startsWith('S_'))
                ? nameWithout4G8A
                : `4G8A${nameWithout4G8A}`;
            
            // Format to high-compatibility JPEG, 1200x630 padded for social previews
            ogImage = `https://res.cloudinary.com/${cloudId}/image/upload/c_pad,b_white,w_1200,h_630,f_jpg,q_auto/${publicId}`;
        }

        const rawTitle = product.name?.he || product.name?.en || 'גוף תאורה';
        const title = `${rawTitle} | טירן לסרי`;
        const desc = product.description?.he || product.description?.en || 'גוף תאורה מעוצב בעבודת יד מבית טירן לסרי';
        const pageUrl = `https://tiranlasry.com/product/${productId}`;

        // 4. Inject Open Graph and Twitter Card tags into HTML head
        return new HTMLRewriter()
            .on('title', {
                element(e) {
                    e.setInnerContent(escapeHtml(title));
                }
            })
            .on('head', {
                element(e) {
                    e.append(`
    <meta property="og:site_name" content="טירן לסרי - אמנות התאורה" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(desc)}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:image:secure_url" content="${ogImage}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:url" content="${pageUrl}" />
    <meta property="og:type" content="product" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(desc)}" />
    <meta name="twitter:image" content="${ogImage}" />
`, { html: true });
                }
            })
            .transform(response);
    } catch {
        return response;
    }
};

