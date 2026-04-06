// ===================================
// GLOBAL FUNCTIONS
// ===================================

function openModal(modal) {
    if (modal) {
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';
    }
}

function closeModal(modal) {
    if (modal) {
        modal.style.visibility = 'hidden';
        modal.style.opacity = '0';
    }
}

function showCustomAlert(title, message) {
    const customAlertModal = document.getElementById('customAlertModal');
    const titleEl = document.getElementById('customAlertTitle');
    const messageEl = document.getElementById('customAlertMessage');
    if (titleEl && messageEl && customAlertModal) {
        titleEl.textContent = title;
        messageEl.textContent = message;
        openModal(customAlertModal);
    } else {
        alert(`${title}: ${message}`);
    }
}

// ===================================
// DOMContentLoaded
// ===================================
document.addEventListener('DOMContentLoaded', () => {

    // ── DOM Variables ──
    const audio             = document.getElementById('bgm-audio');
    const toggleBtn         = document.getElementById('bgm-toggle-button');
    const controls          = document.getElementById('bgm-controls');
    const playPauseBtn      = document.getElementById('bgm-play-pause-btn');
    const volumeSlider      = document.getElementById('bgm-volume');
    const nextBtn           = document.getElementById('bgm-next-btn');
    const songTitle         = document.getElementById('bgm-song-title');
    const currentTimeDisplay = document.getElementById('bgm-current-time');
    const durationDisplay   = document.getElementById('bgm-duration');
    const playerContainer   = document.getElementById('bgm-player-container');
    const muteBtn           = document.getElementById('bgm-mute-btn');

    const loginModal            = document.getElementById('loginModal');
    const customAlertModal      = document.getElementById('customAlertModal');
    const manageCookiesModal    = document.getElementById('manageCookiesModal');
    const customAlertCloseBtn   = document.getElementById('customAlertCloseBtn');
    const openManageCookiesFooter = document.getElementById('openManageCookiesFooter');

    const promptInput       = document.getElementById('promptInput');
    const examplePromptText = document.getElementById('examplePromptText');
    const generateBtn       = document.getElementById('generateBtn');
    const loadingIndicator  = document.getElementById('loadingIndicator');
    const imageResult       = document.getElementById('imageResult');
    const dynamicWord       = document.getElementById('dynamicWord');

    const imageStyleSelect   = document.getElementById('imageStyleSelect');
    const imageQualitySelect = document.getElementById('imageQualitySelect');
    const aspectRatioSelect  = document.getElementById('aspectRatioSelect');

    const tabButtons  = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    const openLoginBtn  = document.getElementById('openLoginBtn');
    const openPremiumBtn = document.getElementById('openPremiumBtn');

    const cookiesPopup        = document.getElementById('cookiesPopup');
    const acceptCookiesBtn    = document.getElementById('acceptCookiesBtn');
    const manageCookiesBtn    = document.getElementById('manageCookiesBtn');
    const cookiePreferencesForm = document.getElementById('cookiePreferencesForm');

    // ── Custom Alert (local scope) ──
    function showCustomAlert(title, message) {
        const titleEl   = document.getElementById('customAlertTitle');
        const messageEl = document.getElementById('customAlertMessage');
        if (titleEl && messageEl) {
            titleEl.textContent   = title;
            messageEl.textContent = message;
            openModal(customAlertModal);
        } else {
            alert(`${title}: ${message}`);
        }
    }

    // ── 1. H1 Animation ──
    const animatedH1Span = document.getElementById('animated-h1-word');
    const h1Words = ["Illustration", "Vision", "Art", "Graphic", "Masterpiece"];
    let h1Index = 0;

    function animateH1WordChange() {
        if (!animatedH1Span) return;
        animatedH1Span.classList.remove('is-visible');
        setTimeout(() => {
            animatedH1Span.textContent = h1Words[h1Index];
            animatedH1Span.classList.add('is-visible');
            h1Index = (h1Index + 1) % h1Words.length;
            setTimeout(animateH1WordChange, 2500);
        }, 500);
    }

    if (animatedH1Span) {
        animatedH1Span.textContent = h1Words[0];
        animatedH1Span.classList.add('is-visible');
        h1Index = 1;
        setTimeout(animateH1WordChange, 2500);
    }

    // ── 2. Prompt Placeholder Animation ──
    const promptExamples = [
        "A neon-lit cyberpunk street with a flying taxi, hyper-realistic, volumetric light",
        "A watercolor landscape of a misty mountain range at sunrise, soft hues",
        "An 8-bit pixel art hero standing on a mushroom in a dark forest, isometric view",
        "A complex clockwork gadget with intricate gold gears, steampunk style, macro shot"
    ];
    let promptIndex = 0;
    let isInputActive = false;

    if (promptInput) {
        promptInput.addEventListener('focus', () => {
            isInputActive = true;
            if (examplePromptText) examplePromptText.style.opacity = '0';
        });
        promptInput.addEventListener('blur', () => {
            isInputActive = false;
            if (promptInput.value.trim() === '' && examplePromptText) examplePromptText.style.opacity = '1';
        });
        promptInput.addEventListener('input', () => {
            if (examplePromptText) examplePromptText.style.opacity = promptInput.value.trim() !== '' ? '0' : '1';
        });
    }

    function animatePromptText() {
        if (!examplePromptText || !promptInput) return;
        if (promptInput.value.trim() === '' && !isInputActive) {
            examplePromptText.textContent = promptExamples[promptIndex];
            examplePromptText.style.opacity = '1';
            promptIndex = (promptIndex + 1) % promptExamples.length;
            setTimeout(animatePromptText, 5000);
        } else {
            setTimeout(animatePromptText, 500);
        }
    }

    if (examplePromptText) {
        examplePromptText.textContent = promptExamples[0];
        promptIndex = 1;
        setTimeout(animatePromptText, 5000);
    }

    // ── 3. Premium Lock & Select ──
    function setupSelect(select) {
        if (!select) return;
        if (!select.closest('.styled-select-wrapper')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'styled-select-wrapper';
            select.parentNode.insertBefore(wrapper, select);
            wrapper.appendChild(select);
        }
        updateSelectLock(select);
        select.addEventListener('change', () => updateSelectLock(select));
    }

    function updateSelectLock(selectElement) {
        if (selectElement.selectedIndex === -1) return;
        const selectedOption = selectElement.options[selectElement.selectedIndex];
        const isPremium = selectedOption.hasAttribute('data-plan-required');
        const wrapper = selectElement.closest('.styled-select-wrapper');
        if (wrapper) wrapper.setAttribute('data-is-premium', isPremium.toString());
    }

    if (imageStyleSelect)   setupSelect(imageStyleSelect);
    if (imageQualitySelect) setupSelect(imageQualitySelect);
    if (aspectRatioSelect)  setupSelect(aspectRatioSelect);

    // ── 4. Gallery Tabs ──
// ── 4. Gallery Tabs ──
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        tabContents.forEach(content => content.classList.remove('active'));
        const targetContent = document.getElementById(button.getAttribute('data-tab'));
        if (targetContent) {
            targetContent.classList.add('active');
            // Load gallery when tab is clicked
            if (button.getAttribute('data-tab') === 'user-gallery') {
                renderGalleryTab();
            }
        }
    });
});

// ── Gallery renderer ──
function renderGalleryTab() {
    const galleryContent = document.getElementById('user-gallery');
    if (!galleryContent) return;

    const images = JSON.parse(localStorage.getItem('lv_generated') || '[]');

    if (images.length === 0) {
        galleryContent.innerHTML = `
            <p class="gallery-placeholder-text">Your past creations will be saved here.</p>
            <div class="gallery-grid-placeholder">
                <div class="gallery-item-placeholder"></div>
                <div class="gallery-item-placeholder"></div>
                <div class="gallery-item-placeholder"></div>
                <div class="gallery-item-placeholder"></div>
                <div class="gallery-item-placeholder"></div>
            </div>
        `;
        return;
    }

    galleryContent.innerHTML = `
        <p class="gallery-placeholder-text" style="margin-bottom:16px;">${images.length} image${images.length !== 1 ? 's' : ''} generated</p>
        <div class="gallery-grid" id="gallery-grid-live" style="grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));">
            ${images.map((img, i) => `
                <div class="gallery-live-item" data-index="${i}" style="position:relative;border-radius:10px;overflow:hidden;border:1px solid var(--color-border);background:var(--color-card-bg);cursor:pointer;">
                    <button class="gallery-remove-btn" data-index="${i}" title="Remove" style="position:absolute;top:6px;right:6px;z-index:10;width:22px;height:22px;border-radius:50%;background:rgba(0,0,0,0.65);border:none;color:#fff;font-size:0.75em;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1;transition:background 0.2s;" onmouseover="this.style.background='var(--color-secondary)'" onmouseout="this.style.background='rgba(0,0,0,0.65)'">✕</button>
                    <img src="${img.url}" alt="${img.prompt}"
                        style="width:100%;height:160px;object-fit:cover;display:block;"
                        onerror="this.parentElement.style.display='none'"
                        onclick="
                            const modal = document.getElementById('imageLightboxModal');
                            const lbImg = document.getElementById('lightboxImage');
                            if(modal && lbImg){ lbImg.src='${img.url}'; modal.style.visibility='visible'; modal.style.opacity='1'; }
                        "
                    >
                    <div style="padding:8px;">
                        <div style="font-size:0.75em;color:var(--color-text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${img.prompt}">${img.prompt}</div>
                        <div style="font-size:0.7em;color:var(--color-subtle-text);margin-top:3px;">${img.date}</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    // Remove button listeners
    galleryContent.querySelectorAll('.gallery-remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(btn.dataset.index);
            const images = JSON.parse(localStorage.getItem('lv_generated') || '[]');
            images.splice(index, 1);
            localStorage.setItem('lv_generated', JSON.stringify(images));
            renderGalleryTab(); // re-render
        });
    });
}

    // ── 5. Modal Handlers ──
    if (openLoginBtn) {
        openLoginBtn.addEventListener('click', () => openModal(loginModal));
    }

if (openPremiumBtn) {
    openPremiumBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'pricing.html';
    });
}

    document.querySelectorAll('.close-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const modalElement = e.target.closest('.modal');
            if (modalElement) closeModal(modalElement);
        });
    });

    if (customAlertCloseBtn) {
        customAlertCloseBtn.addEventListener('click', () => closeModal(customAlertModal));
    }

    if (openManageCookiesFooter) {
        openManageCookiesFooter.addEventListener('click', (e) => {
            e.preventDefault();
            if (loginModal) closeModal(loginModal);
            openModal(manageCookiesModal);
        });
    }

// ── 6. Image Generation (Pollinations.ai) ──
const loadingWords = ["Your Image"];
let loadingIndex = 0;

function updateLoadingWord() {
    if (loadingIndicator && loadingIndicator.style.display !== 'none') {
        if (dynamicWord) dynamicWord.textContent = loadingWords[loadingIndex];
        loadingIndex = (loadingIndex + 1) % loadingWords.length;
        setTimeout(updateLoadingWord, 500);
    }
}

// ── Generation limit helpers ──
function getGenerationCount() {
    const today = new Date().toDateString();
    const stored = JSON.parse(localStorage.getItem('lv_gen_count') || '{}');
    if (stored.date !== today) return 0;
    return stored.count || 0;
}

function incrementGenerationCount() {
    const today = new Date().toDateString();
    const stored = JSON.parse(localStorage.getItem('lv_gen_count') || '{}');
    const count = stored.date === today ? (stored.count || 0) + 1 : 1;
    localStorage.setItem('lv_gen_count', JSON.stringify({ date: today, count }));
}

function getUserPlan() {
    const user = typeof getLoggedInUser === 'function' ? getLoggedInUser() : null;
    if (!user) return 'free';
    const account = typeof getAccount === 'function' ? getAccount(user) : null;
    return (account && account.plan) ? account.plan : 'free';
}

if (generateBtn) {
    generateBtn.addEventListener('click', async () => {

        const prompt = promptInput ? promptInput.value.trim() : '';
        if (prompt === '') {
            showCustomAlert("Error", "Please enter your prompt first.");
            return;
        }

        // ── Check generation limit ──
        const plan = getUserPlan();
        const FREE_LIMIT = 5;

        if (plan === 'free') {
            const usedToday = getGenerationCount();
            if (usedToday >= FREE_LIMIT) {
                showCustomAlert(
                    "Daily Limit Reached",
                    `You've used all ${FREE_LIMIT} free generations for today. Upgrade to Pro or Ultimate for unlimited generations!`
                );
                return;
            }
        }

            // ── Generation limit check ──

            const style   = imageStyleSelect   ? imageStyleSelect.value   : 'photorealistic';
            const quality = imageQualitySelect ? imageQualitySelect.value : 'standard';
            const ratio   = aspectRatioSelect  ? aspectRatioSelect.value  : '1:1';

            const isStylePremium   = imageStyleSelect   && imageStyleSelect.options[imageStyleSelect.selectedIndex].hasAttribute('data-plan-required');
            const isQualityPremium = imageQualitySelect && imageQualitySelect.options[imageQualitySelect.selectedIndex].hasAttribute('data-plan-required');

            if (isStylePremium || isQualityPremium) {
                showCustomAlert("Premium Feature Locked", "This quality/style requires a Pro or Ultimate plan.");
            }

            if (imageResult) imageResult.innerHTML = '';
            const resultTabButton = document.querySelector('.tab-button[data-tab="result-output"]');
            if (resultTabButton) resultTabButton.click();
            if (loadingIndicator) loadingIndicator.style.display = 'block';
            generateBtn.disabled = true;
            updateLoadingWord();

            try {
                // Dimensions
                const ratioDimensions = {
                    '1:1':  { width: 512, height: 512  },
                    '3:4':  { width: 512, height: 682  },
                    '9:16': { width: 512, height: 910  },
                    '16:9': { width: 910, height: 512  },
                };
                const dims = ratioDimensions[ratio] || { width: 512, height: 512 };

                // Model
                const styleModels = {
                    'photorealistic': 'flux-realism',
                    'cinematic':      'flux-cinematic',
                    'pixel_art':      'flux',
                    'watercolor':     'flux',
                    'oil_painting':   'flux',
                    'cyberpunk':      'flux-cyberpunk',
                    'steampunk':      'flux',
                    'anime':          'flux-anime',
                    'low_poly':       'flux',
                    'synthwave':      'flux',
                };
                const model = styleModels[style] || 'flux';

                // Style hints
                const styleHints = {
                    'pixel_art':   'pixel art style, 8-bit',
                    'watercolor':  'watercolor painting style, soft brush strokes',
                    'oil_painting':'classical oil painting style',
                    'steampunk':   'steampunk style, brass gears, Victorian era',
                    'anime':       'anime illustration style',
                    'low_poly':    'low poly 3D abstract art style',
                    'synthwave':   '80s synthwave aesthetic, neon, retro',
                    'cinematic':   'cinematic 4K, dramatic lighting',
                };
                const styledPrompt = styleHints[style] ? `${prompt}, ${styleHints[style]}` : prompt;

                // Quality scale
                const qualityScale = { 'standard': 1, 'high': 1.5, 'ultra_4k': 2 };
                const scale = qualityScale[quality] || 1;
                const finalWidth  = Math.round(dims.width  * scale);
                const finalHeight = Math.round(dims.height * scale);

                // Build URL
                const seed = Math.floor(Math.random() * 1000000);
                const encodedPrompt = encodeURIComponent(styledPrompt);
                const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${finalWidth}&height=${finalHeight}&model=${model}&seed=${seed}&nologo=true`;

                if (!imageResult) throw new Error("Image result container not found.");

// ── Single or Batch generation ──
const currentBatchCount = (typeof batchCount !== 'undefined') ? batchCount : 1;

if (currentBatchCount === 1) {
    // Single image (existing code)
    imageResult.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;gap:12px;width:100%;">
            <img src="${imageUrl}" alt="Generated: ${prompt}"
                style="max-width:100%;height:auto;border-radius:12px;object-fit:contain;cursor:zoom-in;display:block;"
                onclick="openLightbox('${imageUrl}')"
                onload="document.getElementById('loadingIndicator').style.display='none';document.getElementById('generateBtn').disabled=false;"
                onerror="this.parentElement.innerHTML='<p style=color:var(--color-secondary)>Generation failed. Please try again.</p>';document.getElementById('loadingIndicator').style.display='none';document.getElementById('generateBtn').disabled=false;"
            >
            <button id="lv-download-btn" style="font-size:0.85em;padding:8px 20px;display:inline-flex;align-items:center;gap:8px;background:transparent;border:2px solid var(--color-primary);color:var(--color-primary);border-radius:6px;cursor:pointer;font-weight:bold;letter-spacing:0.05em;transition:all 0.2s;" onmouseover="this.style.background='rgba(76,201,240,0.1)'" onmouseout="this.style.background='transparent'">
                <i class="fas fa-download"></i> Download
            </button>
        </div>
    `;

    document.getElementById('lv-download-btn').addEventListener('click', async () => {
        const btn = document.getElementById('lv-download-btn');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
        btn.disabled = true;
        try {
            const res = await fetch(imageUrl);
            const blob = await res.blob();
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl; a.download = `lumivision-${Date.now()}.png`;
            document.body.appendChild(a); a.click();
            document.body.removeChild(a); URL.revokeObjectURL(blobUrl);
            btn.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
            setTimeout(() => { btn.innerHTML = '<i class="fas fa-download"></i> Download'; btn.disabled = false; }, 2000);
        } catch { btn.innerHTML = '<i class="fas fa-download"></i> Download'; btn.disabled = false; }
    });

} else {
    // Batch generation
    imageResult.innerHTML = `<div id="batch-result-grid"></div>`;
    const grid = document.getElementById('batch-result-grid');
    if (loadingIndicator) loadingIndicator.style.display = 'none';
    generateBtn.disabled = false;

    const batchUrls = Array.from({ length: currentBatchCount }, (_, i) => {
        const batchSeed = Math.floor(Math.random() * 1000000);
        return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${finalWidth}&height=${finalHeight}&model=${model}&seed=${batchSeed}&nologo=true`;
    });

    batchUrls.forEach((url, i) => {
            const wrap = document.createElement('div');
            wrap.className = 'batch-img-wrap';
            wrap.innerHTML = `
                <img src="${url}" alt="Batch ${i+1}" loading="lazy"
                    onclick="openLightbox('${url}')"
                    onerror="this.parentElement.style.opacity='0.4'">
                <button class="batch-dl-btn" data-url="${url}"><i class="fas fa-download"></i></button>
            `;
            grid.appendChild(wrap);

            wrap.querySelector('.batch-dl-btn').addEventListener('click', async (e) => {
                e.stopPropagation();
                const btn = e.currentTarget;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                try {
                    const res = await fetch(url);
                    const blob = await res.blob();
                    const blobUrl = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = blobUrl; a.download = `lumivision-batch${i+1}-${Date.now()}.png`;
                    document.body.appendChild(a); a.click();
                    document.body.removeChild(a); URL.revokeObjectURL(blobUrl);
                    btn.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => btn.innerHTML = '<i class="fas fa-download"></i>', 2000);
                } catch { btn.innerHTML = '<i class="fas fa-download"></i>'; }
            });

            // Save each batch image to history
            const images = JSON.parse(localStorage.getItem('lv_generated') || '[]');
            images.unshift({ url, prompt: styledPrompt, date: new Date().toLocaleDateString() });
            if (images.length > 50) images.pop();
            localStorage.setItem('lv_generated', JSON.stringify(images));
        });

        incrementGenerationCount();
        renderGalleryTab();
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        generateBtn.disabled = false;
        return; // end batch path

        } // ← closes if (currentBatchCount === 1) else { ... }

        // ── Save to history (single image) ──
        function saveToHistory(url, prompt) {
            const images = JSON.parse(localStorage.getItem('lv_generated') || '[]');
            images.unshift({ url, prompt, date: new Date().toLocaleDateString() });
            if (images.length > 50) images.pop();
            localStorage.setItem('lv_generated', JSON.stringify(images));
            renderGalleryTab();
        }

        const currentUser = typeof getLoggedInUser === 'function' ? getLoggedInUser() : null;
        if (currentUser) {
            const account = typeof getAccount === 'function' ? getAccount(currentUser) : null;
            const shouldSave = !account || !account.prefs || account.prefs.saveImages !== false;
            if (shouldSave) saveToHistory(imageUrl, styledPrompt);
        } else {
            saveToHistory(imageUrl, styledPrompt);
        }
        incrementGenerationCount();
        // onload on the img handles hiding spinner and re-enabling button
        return;

    } catch (error) {
        showCustomAlert("Generation Failed", error.message);
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        generateBtn.disabled = false;
    }

    }); // END generateBtn click listener
} // END if (generateBtn)

    // ── Prompt Enhancer ──
const enhanceBtn = document.getElementById('enhancePromptBtn');
if (enhanceBtn) {
    enhanceBtn.addEventListener('click', async () => {
        const rough = promptInput ? promptInput.value.trim() : '';
        if (!rough) { showCustomAlert("Empty Prompt", "Type a rough idea first, then click Enhance."); return; }

        enhanceBtn.disabled = true;
        enhanceBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enhancing...';

        try {
            const systemMsg = "You are a creative AI art prompt engineer. Take the user's rough idea and expand it into a vivid, detailed image generation prompt. Add lighting, mood, style, camera angle, color palette details. Keep it under 120 words. Return ONLY the enhanced prompt, no explanations.";
            const res = await fetch('https://text.pollinations.ai/openai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'openai',
                    messages: [
                        { role: 'system', content: systemMsg },
                        { role: 'user', content: rough }
                    ]
                })
            });
            const data = await res.json();
            const enhanced = data.choices?.[0]?.message?.content?.trim();
            if (enhanced && promptInput) {
                promptInput.value = enhanced;
                promptInput.dispatchEvent(new Event('input'));
                // Flash effect
                promptInput.style.borderColor = 'var(--color-secondary)';
                promptInput.style.boxShadow = '0 0 12px rgba(247,37,133,0.4)';
                setTimeout(() => {
                    promptInput.style.borderColor = '';
                    promptInput.style.boxShadow = '';
                }, 1500);
            }
        } catch (err) {
            showCustomAlert("Enhance Failed", "Could not enhance prompt. Please try again.");
        }

        enhanceBtn.disabled = false;
        enhanceBtn.innerHTML = '<i class="fas fa-magic"></i> Enhance';
    });
}

// ── Batch Generation ──
let batchCount = 1;
const batchSection = document.getElementById('batchSection');
const batchBtns = document.querySelectorAll('.batch-btn');

// Show batch section only for ultimate plan
function updateBatchVisibility() {
    const plan = getUserPlan();
    if (batchSection) batchSection.style.display = plan === 'ultimate' ? 'block' : 'none';
}
updateBatchVisibility();

batchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        batchBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        batchCount = parseInt(btn.dataset.count);
    });
});

// ── Lightbox with Zoom & Pan ──
const lightboxModal  = document.getElementById('imageLightboxModal');
const lightboxImg    = document.getElementById('lightboxImage');
const lightboxClose  = document.getElementById('lightboxClose');
const lightboxCont   = document.getElementById('lightboxContainer');
const zoomInBtn      = document.getElementById('lightboxZoomIn');
const zoomOutBtn     = document.getElementById('lightboxZoomOut');
const zoomResetBtn   = document.getElementById('lightboxZoomReset');

let lbScale = 1, lbDragging = false, lbStartX = 0, lbStartY = 0, lbTransX = 0, lbTransY = 0;

function openLightbox(src) {
    if (!lightboxModal || !lightboxImg) return;
    lightboxImg.src = src;
    lbScale = 1; lbTransX = 0; lbTransY = 0;
    lightboxImg.style.transform = 'scale(1) translate(0px, 0px)';
    lightboxModal.style.visibility = 'visible';
    lightboxModal.style.opacity = '1';
}

function closeLightbox() {
    if (lightboxModal) { lightboxModal.style.visibility = 'hidden'; lightboxModal.style.opacity = '0'; }
}

function applyLightboxTransform() {
    if (lightboxImg) lightboxImg.style.transform = `scale(${lbScale}) translate(${lbTransX / lbScale}px, ${lbTransY / lbScale}px)`;
}

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal || e.target.classList.contains('image-lightbox-content')) closeLightbox();
    });
}
if (zoomInBtn)    zoomInBtn.addEventListener('click',    () => { lbScale = Math.min(lbScale + 0.3, 5); applyLightboxTransform(); });
if (zoomOutBtn)   zoomOutBtn.addEventListener('click',   () => { lbScale = Math.max(lbScale - 0.3, 0.5); applyLightboxTransform(); });
if (zoomResetBtn) zoomResetBtn.addEventListener('click', () => { lbScale = 1; lbTransX = 0; lbTransY = 0; applyLightboxTransform(); });

// Mouse wheel zoom
if (lightboxModal) {
    lightboxModal.addEventListener('wheel', (e) => {
        e.preventDefault();
        lbScale = e.deltaY < 0 ? Math.min(lbScale + 0.15, 5) : Math.max(lbScale - 0.15, 0.5);
        applyLightboxTransform();
    }, { passive: false });
}

// Drag to pan
if (lightboxCont) {
    lightboxCont.addEventListener('mousedown', (e) => {
        lbDragging = true; lbStartX = e.clientX - lbTransX; lbStartY = e.clientY - lbTransY;
        lightboxCont.style.cursor = 'grabbing';
    });
    lightboxCont.addEventListener('mousemove', (e) => {
        if (!lbDragging) return;
        lbTransX = e.clientX - lbStartX; lbTransY = e.clientY - lbStartY;
        applyLightboxTransform();
    });
    lightboxCont.addEventListener('mouseup',   () => { lbDragging = false; lightboxCont.style.cursor = 'grab'; });
    lightboxCont.addEventListener('mouseleave',() => { lbDragging = false; lightboxCont.style.cursor = 'grab'; });

    // Touch pinch zoom
    let lastDist = 0;
    lightboxCont.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            lastDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        }
    });
    lightboxCont.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
            const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
            lbScale = Math.min(Math.max(lbScale * (dist / lastDist), 0.5), 5);
            lastDist = dist;
            applyLightboxTransform();
            e.preventDefault();
        }
    }, { passive: false });
}

// Make openLightbox global
window.openLightbox = openLightbox;

// ── Discount / Event System ──
const LV_EVENTS = [
    { name: "Christmas",       emoji: "🎄", discount: 30, month: 11, day: 25, previewDays: 2, validDays: 5  },
    { name: "Summer Vacation", emoji: "☀️", discount: 20, month: 4,  day: 1,  previewDays: 2, validDays: 10 },
    { name: "Diwali",          emoji: "🪔", discount: 25, month: 9,  day: 20, previewDays: 2, validDays: 4  },
    { name: "Holi",            emoji: "🌈", discount: 15, month: 2,  day: 14, previewDays: 2, validDays: 1  },
    { name: "Navratri",        emoji: "🙏", discount: 20, month: 9,  day: 3,  previewDays: 2, validDays: 2  },
    { name: "Dussehra",        emoji: "🏹", discount: 15, month: 9,  day: 12, previewDays: 2, validDays: 1  },
    { name: "Maha Shivratri",  emoji: "🔱", discount: 15, month: 1,  day: 26, previewDays: 2, validDays: 1  },
];

function checkDiscountEvents() {
    const now = new Date();
    const month = now.getMonth();  // 0-indexed
    const day   = now.getDate();

    for (const event of LV_EVENTS) {
        const eventStart = new Date(now.getFullYear(), event.month, event.day);
        const eventEnd   = new Date(now.getFullYear(), event.month, event.day + event.validDays);
        const previewStart = new Date(now.getFullYear(), event.month, event.day - event.previewDays);

        if (now >= previewStart && now < eventEnd) {
            const isLive = now >= eventStart;
            showDiscountBanner(event, eventEnd, isLive);
            return;
        }
    }
    // No active event
    removeDiscountBanner();
}

function showDiscountBanner(event, endDate, isLive) {
    const existing = document.getElementById('lv-discount-banner');
    if (existing) existing.remove();

    const banner = document.createElement('div');
    banner.id = 'lv-discount-banner';

    const updateTimer = () => {
        const now = new Date();
        const diff = endDate - now;
        if (diff <= 0) { removeDiscountBanner(); return; }
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        const timerEl = document.getElementById('lv-banner-countdown');
        if (timerEl) timerEl.textContent = `${d}d ${h}h ${m}m ${s}s`;
    };

    banner.innerHTML = `
        ${event.emoji}
        <span>
            ${isLive
                ? `<strong>${event.name} Sale is LIVE!</strong> Get <strong>${event.discount}% OFF</strong> on Pro & Ultimate plans!`
                : `<strong>${event.name} Sale</strong> starts soon! <strong>${event.discount}% OFF</strong> coming up!`
            }
        </span>
        <span class="lv-countdown">⏳ <span id="lv-banner-countdown">--</span> left</span>
        <button class="lv-banner-close" onclick="removeDiscountBanner()" title="Close">✕</button>
    `;

    document.body.prepend(banner);
    document.body.classList.add('has-discount-banner');

    updateTimer();
    const timerInterval = setInterval(() => {
        const el = document.getElementById('lv-banner-countdown');
        if (!el) { clearInterval(timerInterval); return; }
        updateTimer();
    }, 1000);

    // Apply discount to pricing page if live
    if (isLive) applyDiscountToPricing(event.discount);
}

function removeDiscountBanner() {
    const banner = document.getElementById('lv-discount-banner');
    if (banner) banner.remove();
    document.body.classList.remove('has-discount-banner');
}
window.removeDiscountBanner = removeDiscountBanner;

function applyDiscountToPricing(pct) {
    // Update plan prices on pricing.html or index.html if visible
    const prices = document.querySelectorAll('.plan-card .price');
    const originals = [9.99, 24.99];
    prices.forEach((el, i) => {
        if (i === 0) return; // skip free tier
        const orig = originals[i - 1];
        if (!orig) return;
        const discounted = (orig * (1 - pct / 100)).toFixed(2);
        el.innerHTML = `
            <span style="text-decoration:line-through;font-size:0.55em;color:var(--color-subtle-text);display:block;">$${orig}</span>
            $${discounted}<span class="per-month">/month</span>
            <span style="font-size:0.35em;background:var(--color-secondary);color:#fff;border-radius:4px;padding:2px 6px;margin-left:6px;vertical-align:middle;">${pct}% OFF</span>
        `;
    });
}

// Run discount check on load and every minute
checkDiscountEvents();
setInterval(checkDiscountEvents, 60000);

    // ── 7. (Auth handled by send-code.js) ──

    // ── 8. Cookie Consent ──
    function checkCookieConsent() {
        if (cookiesPopup && !localStorage.getItem('cookieConsent')) {
            cookiesPopup.style.display = 'flex';
        }
    }

    if (acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            if (cookiesPopup) cookiesPopup.style.display = 'none';
        });
    }

    if (manageCookiesBtn) {
        manageCookiesBtn.addEventListener('click', () => {
            if (cookiesPopup) cookiesPopup.style.display = 'none';
            openModal(manageCookiesModal);
        });
    }

    if (cookiePreferencesForm) {
        cookiePreferencesForm.addEventListener('submit', (e) => {
            e.preventDefault();
            localStorage.setItem('cookieConsent', 'custom');
            closeModal(manageCookiesModal);
            showCustomAlert("Preferences Saved", "Your cookie preferences have been saved.");
        });
    }

    if (cookiesPopup) checkCookieConsent();

    // ── 9. BGM Music Player ──
    const tracks = ['TIKI TIKI.mp3', 'MATADORA.mp3', 'HEAVENLY JUMPSTYLE.mp3', 'LUZ ROJA.mp3', 'BEAUTIFUL MOON.mp3', 'TODA SUA.mp3'];
    let currentTrackIndex = 0;
    let isControlsVisible = false;
    let isPlaylistVisible = false;
    let isSeeking = false;

    const prevBtn       = document.getElementById('bgm-prev-btn');
    const playlistBtn   = document.getElementById('bgm-playlist-btn');
    const playlistPanel = document.getElementById('bgm-playlist');
    const playlistItems = document.getElementById('bgm-playlist-items');
    const seekBar       = document.getElementById('bgm-seekbar');

    function formatTime(secs) {
        if (isNaN(secs) || secs < 0) return '0:00';
        const m = Math.floor(secs / 60);
        const s = Math.floor(secs % 60);
        return `${m}:${s < 10 ? '0' + s : s}`;
    }

    function updateSliderFill(slider) {
        const min = parseFloat(slider.min) || 0;
        const max = parseFloat(slider.max) || 1;
        const val = parseFloat(slider.value) || 0;
        const pct = ((val - min) / (max - min)) * 100;
        slider.style.background = `linear-gradient(to right, var(--color-primary) ${pct}%, rgba(76,201,240,0.2) ${pct}%)`;
    }

    function buildPlaylist() {
        if (!playlistItems) return;
        playlistItems.innerHTML = '';
        tracks.forEach((track, i) => {
            const name = track.replace('.mp3', '');
            const li = document.createElement('li');
            li.textContent = (i === currentTrackIndex ? '▶ ' : '') + name;
            if (i === currentTrackIndex) li.classList.add('active-track');
            li.addEventListener('click', () => {
                currentTrackIndex = i;
                loadTrack(i);
                audio.play().catch(e => console.error(e));
                buildPlaylist();
            });
            playlistItems.appendChild(li);
        });
    }

    function loadTrack(index) {
        if (!audio || !songTitle) return;
        audio.src = tracks[index];
        songTitle.textContent = tracks[index].replace('.mp3', '');
        audio.load();
        if (seekBar) { seekBar.value = 0; seekBar.max = 100; updateSliderFill(seekBar); }
        if (currentTimeDisplay) currentTimeDisplay.textContent = '0:00';
        if (durationDisplay) durationDisplay.textContent = '0:00';
    }

    function setControlsVisibility(visible) {
        if (!controls) return;
        isControlsVisible = visible;
        controls.classList.toggle('bgm-controls-hidden', !visible);
        controls.classList.toggle('bgm-controls-visible', visible);
        if (!visible && playlistPanel) {
            playlistPanel.style.display = 'none';
            isPlaylistVisible = false;
        }
    }

    function updateMuteIcon() {
        if (!muteBtn || !audio) return;
        const icon = muteBtn.querySelector('i');
        icon.className = audio.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
        if (volumeSlider) volumeSlider.disabled = audio.muted;
    }

    if (audio) {
        audio.addEventListener('play', () => {
            if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            if (toggleBtn) toggleBtn.innerHTML = '<i class="fas fa-pause"></i>';
        });
        audio.addEventListener('pause', () => {
            if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            if (toggleBtn) toggleBtn.innerHTML = '<i class="fas fa-music"></i>';
        });
        audio.addEventListener('ended', () => {
            currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
            loadTrack(currentTrackIndex);
            audio.play().catch(e => console.error(e));
            buildPlaylist();
        });
        audio.addEventListener('loadedmetadata', () => {
            if (durationDisplay) durationDisplay.textContent = formatTime(audio.duration);
            if (seekBar) { seekBar.max = audio.duration; updateSliderFill(seekBar); }
        });
        audio.addEventListener('timeupdate', () => {
            if (!isSeeking && audio.duration) {
                if (currentTimeDisplay) currentTimeDisplay.textContent = formatTime(audio.currentTime);
                if (seekBar) { seekBar.value = audio.currentTime; updateSliderFill(seekBar); }
            }
        });
    }

    if (seekBar) {
        seekBar.addEventListener('mousedown',  () => { isSeeking = true; });
        seekBar.addEventListener('touchstart', () => { isSeeking = true; });
        seekBar.addEventListener('input', () => {
            if (currentTimeDisplay) currentTimeDisplay.textContent = formatTime(parseFloat(seekBar.value));
            updateSliderFill(seekBar);
        });
        seekBar.addEventListener('change', () => { if (audio) audio.currentTime = parseFloat(seekBar.value); isSeeking = false; });
        seekBar.addEventListener('mouseup',  () => { isSeeking = false; });
        seekBar.addEventListener('touchend', () => { isSeeking = false; });
    }

    if (volumeSlider && audio) {
        audio.volume = parseFloat(volumeSlider.value);
        updateSliderFill(volumeSlider);
        volumeSlider.addEventListener('input', () => {
            audio.volume = parseFloat(volumeSlider.value);
            updateSliderFill(volumeSlider);
            if (audio.muted) { audio.muted = false; updateMuteIcon(); }
        });
    }

    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!audio.src || audio.src === window.location.href) loadTrack(currentTrackIndex);
            audio.paused ? audio.play().catch(err => console.error(err)) : audio.pause();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (audio.currentTime > 3) {
                audio.currentTime = 0;
            } else {
                const wasPlaying = !audio.paused;
                currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
                loadTrack(currentTrackIndex);
                buildPlaylist();
                if (wasPlaying) audio.play().catch(e => console.error(e));
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const wasPlaying = !audio.paused;
            currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
            loadTrack(currentTrackIndex);
            buildPlaylist();
            if (wasPlaying) audio.play().catch(e => console.error(e));
        });
    }

    if (muteBtn) {
        muteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            audio.muted = !audio.muted;
            updateMuteIcon();
        });
    }

    if (playlistBtn) {
        playlistBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            isPlaylistVisible = !isPlaylistVisible;
            if (playlistPanel) playlistPanel.style.display = isPlaylistVisible ? 'block' : 'none';
            if (isPlaylistVisible) buildPlaylist();
        });
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            setControlsVisibility(!isControlsVisible);
        });
    }

    let bgmCloseTimer = null;
    function bgmCancelClose() { if (bgmCloseTimer) { clearTimeout(bgmCloseTimer); bgmCloseTimer = null; } }
    function bgmScheduleClose() { bgmCancelClose(); bgmCloseTimer = setTimeout(() => setControlsVisibility(false), 800); }

    if (playerContainer) {
        playerContainer.addEventListener('mouseenter', bgmCancelClose);
        playerContainer.addEventListener('mouseleave', bgmScheduleClose);
    }
    if (controls) {
        controls.addEventListener('mouseenter', bgmCancelClose);
        controls.addEventListener('mouseleave', bgmScheduleClose);
    }

    // Init BGM
    loadTrack(currentTrackIndex);
    if (audio && volumeSlider) audio.volume = parseFloat(volumeSlider.value);
    updateMuteIcon();
    buildPlaylist();

}); // END DOMContentLoaded