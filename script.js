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
    const audio              = document.getElementById('bgm-audio');
    const toggleBtn          = document.getElementById('bgm-toggle-button');
    const controls           = document.getElementById('bgm-controls');
    const playPauseBtn       = document.getElementById('bgm-play-pause-btn');
    const volumeSlider       = document.getElementById('bgm-volume');
    const nextBtn            = document.getElementById('bgm-next-btn');
    const songTitle          = document.getElementById('bgm-song-title');
    const currentTimeDisplay = document.getElementById('bgm-current-time');
    const durationDisplay    = document.getElementById('bgm-duration');
    const playerContainer    = document.getElementById('bgm-player-container');
    const muteBtn            = document.getElementById('bgm-mute-btn');

    const loginModal              = document.getElementById('loginModal');
    const customAlertModal        = document.getElementById('customAlertModal');
    const manageCookiesModal      = document.getElementById('manageCookiesModal');
    const customAlertCloseBtn     = document.getElementById('customAlertCloseBtn');
    const openManageCookiesFooter = document.getElementById('openManageCookiesFooter');

    const promptInput        = document.getElementById('promptInput');
    const examplePromptText  = document.getElementById('examplePromptText');
    const generateBtn        = document.getElementById('generateBtn');
    const loadingIndicator   = document.getElementById('loadingIndicator');
    const imageResult        = document.getElementById('imageResult');
    const dynamicWord        = document.getElementById('dynamicWord');

    const imageStyleSelect   = document.getElementById('imageStyleSelect');
    const imageQualitySelect = document.getElementById('imageQualitySelect');
    const aspectRatioSelect  = document.getElementById('aspectRatioSelect');

    const tabButtons  = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    const openLoginBtn   = document.getElementById('openLoginBtn');
    const openPremiumBtn = document.getElementById('openPremiumBtn');

    const cookiesPopup          = document.getElementById('cookiesPopup');
    const acceptCookiesBtn      = document.getElementById('acceptCookiesBtn');
    const manageCookiesBtn      = document.getElementById('manageCookiesBtn');
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

    // ── 2. Prompt Typing Animation ──
    const promptExamples = [
        "A neon-lit cyberpunk street with a flying taxi",
        "A watercolor mountain landscape at sunrise",
        "8-bit pixel art hero in a dark forest",
        "Clockwork gadget with gold gears, steampunk style"
    ];

    let promptIndex = 0;
    let isInputActive = false;
    let typingTimeout = null;

    if (promptInput) {
        promptInput.addEventListener('focus', () => {
            isInputActive = true;
            if (examplePromptText) examplePromptText.style.opacity = '0';
            if (typingTimeout) clearTimeout(typingTimeout);
        });
        promptInput.addEventListener('blur', () => {
            isInputActive = false;
            if (promptInput.value.trim() === '') startTypingAnimation();
        });
        promptInput.addEventListener('input', () => {
            if (examplePromptText)
                examplePromptText.style.opacity = promptInput.value.trim() !== '' ? '0' : '1';
        });
    }

    function typeText(text, el, charIndex, onDone) {
        if (isInputActive || (promptInput && promptInput.value.trim() !== '')) return;
        if (charIndex <= text.length) {
            el.textContent = text.substring(0, charIndex);
            typingTimeout = setTimeout(() => typeText(text, el, charIndex + 1, onDone), 38);
        } else {
            typingTimeout = setTimeout(() => eraseText(el, text.length, onDone), 1800);
        }
    }

    function eraseText(el, charIndex, onDone) {
        if (isInputActive || (promptInput && promptInput.value.trim() !== '')) return;
        if (charIndex >= 0) {
            el.textContent = el.textContent.substring(0, charIndex);
            typingTimeout = setTimeout(() => eraseText(el, charIndex - 1, onDone), 18);
        } else {
            typingTimeout = setTimeout(onDone, 400);
        }
    }

    function startTypingAnimation() {
        if (!examplePromptText || isInputActive) return;
        if (promptInput && promptInput.value.trim() !== '') return;
        examplePromptText.style.opacity = '1';
        const text = promptExamples[promptIndex];
        promptIndex = (promptIndex + 1) % promptExamples.length;
        typeText(text, examplePromptText, 0, startTypingAnimation);
    }

    if (examplePromptText) {
        examplePromptText.textContent = '';
        startTypingAnimation();
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
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            tabContents.forEach(content => content.classList.remove('active'));
            const targetContent = document.getElementById(button.getAttribute('data-tab'));
            if (targetContent) {
                targetContent.classList.add('active');
                if (button.getAttribute('data-tab') === 'user-gallery') renderGalleryTab();
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
                </div>`;
            return;
        }

        galleryContent.innerHTML = `
            <p class="gallery-placeholder-text" style="margin-bottom:16px;">${images.length} image${images.length !== 1 ? 's' : ''} generated</p>
            <div class="gallery-grid" id="gallery-grid-live" style="grid-template-columns:repeat(auto-fill,minmax(180px,1fr));">
                ${images.map((img, i) => `
                    <div class="gallery-live-item" data-index="${i}" style="position:relative;border-radius:10px;overflow:hidden;border:1px solid var(--color-border);background:var(--color-card-bg);cursor:pointer;">
                        <button class="gallery-remove-btn" data-index="${i}" title="Remove"
                            style="position:absolute;top:6px;right:6px;z-index:10;width:22px;height:22px;border-radius:50%;background:rgba(0,0,0,0.65);border:none;color:#fff;font-size:0.75em;cursor:pointer;display:flex;align-items:center;justify-content:center;"
                            onmouseover="this.style.background='var(--color-secondary)'"
                            onmouseout="this.style.background='rgba(0,0,0,0.65)'">✕</button>
                        <img src="${img.url}" alt="${img.prompt}"
                            style="width:100%;height:160px;object-fit:cover;display:block;"
                            onerror="this.parentElement.style.display='none'"
                            onclick="const m=document.getElementById('imageLightboxModal');const l=document.getElementById('lightboxImage');if(m&&l){l.src='${img.url}';m.style.visibility='visible';m.style.opacity='1';}">
                        <div style="padding:8px;">
                            <div style="font-size:0.75em;color:var(--color-text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${img.prompt}">${img.prompt}</div>
                            <div style="font-size:0.7em;color:var(--color-subtle-text);margin-top:3px;">${img.date}</div>
                        </div>
                    </div>`).join('')}
            </div>`;

        galleryContent.querySelectorAll('.gallery-remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const idx = parseInt(btn.dataset.index);
                const imgs = JSON.parse(localStorage.getItem('lv_generated') || '[]');
                imgs.splice(idx, 1);
                localStorage.setItem('lv_generated', JSON.stringify(imgs));
                renderGalleryTab();
            });
        });
    }

    // ── Scroll Reveal ──
    function initScrollReveal() {
        document.querySelectorAll('.section-heading').forEach(el => el.classList.add('lv-reveal'));
        document.querySelectorAll('.section-subtext').forEach(el => el.classList.add('lv-reveal', 'lv-delay-1'));
        document.querySelectorAll('.style-card').forEach((el, i) => el.classList.add('lv-reveal', `lv-delay-${(i % 4) + 1}`));
        document.querySelectorAll('.plan-card').forEach((el, i) => el.classList.add('lv-reveal', `lv-delay-${i + 1}`));
        document.querySelectorAll('.footer-brand').forEach(el => el.classList.add('lv-reveal-left'));
        document.querySelectorAll('.footer-links').forEach((el, i) => el.classList.add('lv-reveal-right', `lv-delay-${i + 1}`));
        document.querySelectorAll('.generation-controls').forEach(el => el.classList.add('lv-reveal'));
        document.querySelectorAll('.gallery-divider').forEach(el => el.classList.add('lv-reveal'));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('lv-visible');
                else entry.target.classList.remove('lv-visible');
            });
        }, { threshold: 0.12 });

        document.querySelectorAll('.lv-reveal, .lv-reveal-left, .lv-reveal-right').forEach(el => observer.observe(el));
    }
    initScrollReveal();

    // ── 5. Modal Handlers ──
    if (openLoginBtn) openLoginBtn.addEventListener('click', () => openModal(loginModal));

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

    if (customAlertCloseBtn) customAlertCloseBtn.addEventListener('click', () => closeModal(customAlertModal));

    if (openManageCookiesFooter) {
        openManageCookiesFooter.addEventListener('click', (e) => {
            e.preventDefault();
            if (loginModal) closeModal(loginModal);
            openModal(manageCookiesModal);
        });
    }

    // ── 6. Generation Limit Helpers ──

    function getGenerationData() {
        return JSON.parse(localStorage.getItem('lv_gen_count') || '{}');
    }

    // Logged-in user: 5/day with rollover
    function getGenerationCount() {
        const today = new Date().toDateString();
        const data  = getGenerationData();
        if (data.date !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const wasYesterday = data.date === yesterday.toDateString();
            const unused     = wasYesterday ? Math.max(0, 5 - (data.count || 0)) : 0;
            const rolledOver = Math.min(unused, 5);
            localStorage.setItem('lv_gen_count', JSON.stringify({ date: today, count: 0, bonus: rolledOver }));
            return 0;
        }
        return data.count || 0;
    }

    function incrementGenerationCount() {
        const today = new Date().toDateString();
        const data  = getGenerationData();
        const count = data.date === today ? (data.count || 0) + 1 : 1;
        const bonus = data.date === today ? (data.bonus || 0) : 0;
        localStorage.setItem('lv_gen_count', JSON.stringify({ date: today, count, bonus }));
    }

    function getDailyLimit() {
        const user  = typeof getLoggedInUser === 'function' ? getLoggedInUser() : null;
        const today = new Date().toDateString();
        const data  = getGenerationData();
        if (!user) return 50; // guests: 50/day
        const base = 5;
        if (data.date !== today) return base;
        return base + (data.bonus || 0);
    }

    // Guest: 50/day, resets daily, no rollover
    function getGuestGenerationCount() {
        const today = new Date().toDateString();
        const data  = JSON.parse(localStorage.getItem('lv_guest_count') || '{}');
        if (data.date !== today) return 0;
        return data.count || 0;
    }

    function incrementGuestCount() {
        const today = new Date().toDateString();
        const data  = JSON.parse(localStorage.getItem('lv_guest_count') || '{}');
        const count = data.date === today ? (data.count || 0) + 1 : 1;
        localStorage.setItem('lv_guest_count', JSON.stringify({ date: today, count }));
    }

    function getUserPlan() {
        const user = typeof getLoggedInUser === 'function' ? getLoggedInUser() : null;
        if (!user) return 'free';
        const account = typeof getAccount === 'function' ? getAccount(user) : null;
        return (account && account.plan) ? account.plan : 'free';
    }

    // ── 7. Image Generation ──
    const loadingWords = ["Your Image"];
    let loadingIndex = 0;

    function updateLoadingWord() {
        if (loadingIndicator && loadingIndicator.style.display !== 'none') {
            if (dynamicWord) dynamicWord.textContent = loadingWords[loadingIndex];
            loadingIndex = (loadingIndex + 1) % loadingWords.length;
            setTimeout(updateLoadingWord, 500);
        }
    }

    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {

            const prompt = promptInput ? promptInput.value.trim() : '';
            if (prompt === '') {
                showCustomAlert("Error", "Please enter your prompt first.");
                return;
            }

            // ── 3D ripple + shine effect ──
            generateBtn.classList.remove('btn-shine');
            void generateBtn.offsetWidth;
            generateBtn.classList.add('btn-shine');
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            const rect = generateBtn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.cssText = `width:${size}px;height:${size}px;left:${(rect.width - size) / 2}px;top:${(rect.height - size) / 2}px;`;
            generateBtn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);

            // ── Generation limit check ──
            const plan        = getUserPlan();
            const currentUser = typeof getLoggedInUser === 'function' ? getLoggedInUser() : null;

            if (!currentUser) {
                // Guest: 50/day
                const guestUsed = getGuestGenerationCount();
                if (guestUsed >= 50) {
                    showCustomAlert(
                        "Daily Limit Reached",
                        "You've used all 50 free generations for today. Sign up for free to get rollover generations, or come back tomorrow!"
                    );
                    return;
                }
            } else if (plan === 'free') {
                // Logged-in free: 5/day + rollover
                const FREE_LIMIT = getDailyLimit();
                const usedToday  = getGenerationCount();
                if (usedToday >= FREE_LIMIT) {
                    showCustomAlert(
                        "Daily Limit Reached",
                        `You've used all ${FREE_LIMIT} generations for today. Unused generations roll over tomorrow! Upgrade for unlimited.`
                    );
                    return;
                }
            }
            // Pro & Ultimate: no limit

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
                const ratioDimensions = {
                    '1:1':  { width: 768,  height: 768  },
                    '3:4':  { width: 768,  height: 1024 },
                    '9:16': { width: 576,  height: 1024 },
                    '16:9': { width: 1024, height: 576  },
                };
                const dims = ratioDimensions[ratio] || { width: 768, height: 768 };

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

                const styleHints = {
                    'pixel_art':    'pixel art style, 8-bit',
                    'watercolor':   'watercolor painting style, soft brush strokes',
                    'oil_painting': 'classical oil painting style',
                    'steampunk':    'steampunk style, brass gears, Victorian era',
                    'anime':        'anime illustration style',
                    'low_poly':     'low poly 3D abstract art style',
                    'synthwave':    '80s synthwave aesthetic, neon, retro',
                    'cinematic':    'cinematic 4K, dramatic lighting',
                };
                const styledPrompt = styleHints[style] ? `${prompt}, ${styleHints[style]}` : prompt;

                const qualityScale = { 'standard': 1, 'high': 1.25, 'ultra_4k': 1.5 };
                const scale        = qualityScale[quality] || 1;
                const finalWidth   = Math.round(dims.width  * scale);
                const finalHeight  = Math.round(dims.height * scale);

                const seed          = Math.floor(Math.random() * 1000000);
                const encodedPrompt = encodeURIComponent(styledPrompt);
                const imageUrl      = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${finalWidth}&height=${finalHeight}&model=${model}&seed=${seed}&nologo=true`;

                if (!imageResult) throw new Error("Image result container not found.");

                // ── Save to history ──
                function saveToHistory(url, promptText) {
                    const imgs = JSON.parse(localStorage.getItem('lv_generated') || '[]');
                    imgs.unshift({ url, prompt: promptText, date: new Date().toLocaleDateString() });
                    if (imgs.length > 50) imgs.pop();
                    localStorage.setItem('lv_generated', JSON.stringify(imgs));
                    renderGalleryTab();
                }

                // ── Increment correct counter ──
                function countGeneration() {
                    if (!currentUser) {
                        incrementGuestCount();
                    } else if (plan === 'free') {
                        incrementGenerationCount();
                    }
                    // pro/ultimate: unlimited, no counting
                }

                const currentBatchCount = (typeof batchCount !== 'undefined') ? batchCount : 1;

                if (currentBatchCount === 1) {
                    // ── Single image ──
                    imageResult.innerHTML = `
                        <div style="display:flex;flex-direction:column;align-items:center;gap:12px;width:100%;">
                            <img
                                src="${imageUrl}"
                                alt="Generated: ${prompt}"
                                style="max-width:100%;max-height:80vh;width:auto;height:auto;border-radius:12px;object-fit:contain;cursor:zoom-in;display:block;"
                                onclick="openLightbox('${imageUrl}')"
                                onload="document.getElementById('loadingIndicator').style.display='none';document.getElementById('generateBtn').disabled=false;"
                                onerror="this.parentElement.innerHTML='<p style=color:var(--color-secondary)>Generation failed. Please try again.</p>';document.getElementById('loadingIndicator').style.display='none';document.getElementById('generateBtn').disabled=false;"
                            >
                            <button id="lv-download-btn"
                                style="font-size:0.85em;padding:8px 20px;display:inline-flex;align-items:center;gap:8px;background:transparent;border:2px solid var(--color-primary);color:var(--color-primary);border-radius:6px;cursor:pointer;font-weight:bold;letter-spacing:0.05em;transition:all 0.2s;"
                                onmouseover="this.style.background='rgba(76,201,240,0.1)'"
                                onmouseout="this.style.background='transparent'">
                                <i class="fas fa-download"></i> Download
                            </button>
                        </div>`;

                    document.getElementById('lv-download-btn').addEventListener('click', async () => {
                        const btn = document.getElementById('lv-download-btn');
                        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
                        btn.disabled  = true;
                        try {
                            const res     = await fetch(imageUrl);
                            const blob    = await res.blob();
                            const blobUrl = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = blobUrl; a.download = `lumivision-${Date.now()}.png`;
                            document.body.appendChild(a); a.click();
                            document.body.removeChild(a); URL.revokeObjectURL(blobUrl);
                            btn.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
                            setTimeout(() => { btn.innerHTML = '<i class="fas fa-download"></i> Download'; btn.disabled = false; }, 2000);
                        } catch { btn.innerHTML = '<i class="fas fa-download"></i> Download'; btn.disabled = false; }
                    });

                    const account    = typeof getAccount === 'function' ? getAccount(currentUser) : null;
                    const shouldSave = !account || !account.prefs || account.prefs.saveImages !== false;
                    if (shouldSave) saveToHistory(imageUrl, styledPrompt);
                    countGeneration();
                    return; // onload handles spinner/button

                } else {
                    // ── Batch generation ──
                    imageResult.innerHTML = `<div id="batch-result-grid"></div>`;
                    const grid = document.getElementById('batch-result-grid');
                    if (loadingIndicator) loadingIndicator.style.display = 'none';
                    generateBtn.disabled = false;

                    const batchUrls = Array.from({ length: currentBatchCount }, () => {
                        const batchSeed = Math.floor(Math.random() * 1000000);
                        return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${finalWidth}&height=${finalHeight}&model=${model}&seed=${batchSeed}&nologo=true`;
                    });

                    batchUrls.forEach((url, i) => {
                        const wrap = document.createElement('div');
                        wrap.className = 'batch-img-wrap';
                        wrap.innerHTML = `
                            <img src="${url}" alt="Batch ${i + 1}" loading="lazy"
                                onclick="openLightbox('${url}')"
                                onerror="this.parentElement.style.opacity='0.4'">
                            <button class="batch-dl-btn"><i class="fas fa-download"></i></button>`;
                        grid.appendChild(wrap);

                        wrap.querySelector('.batch-dl-btn').addEventListener('click', async (e) => {
                            e.stopPropagation();
                            const btn = e.currentTarget;
                            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                            try {
                                const res     = await fetch(url);
                                const blob    = await res.blob();
                                const blobUrl = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = blobUrl; a.download = `lumivision-batch${i + 1}-${Date.now()}.png`;
                                document.body.appendChild(a); a.click();
                                document.body.removeChild(a); URL.revokeObjectURL(blobUrl);
                                btn.innerHTML = '<i class="fas fa-check"></i>';
                                setTimeout(() => { btn.innerHTML = '<i class="fas fa-download"></i>'; }, 2000);
                            } catch { btn.innerHTML = '<i class="fas fa-download"></i>'; }
                        });

                        saveToHistory(url, styledPrompt);
                    });

                    countGeneration();
                    renderGalleryTab();
                    return;
                }

            } catch (error) {
                showCustomAlert("Generation Failed", error.message);
                if (loadingIndicator) loadingIndicator.style.display = 'none';
                generateBtn.disabled = false;
            }

        }); // END generateBtn click
    } // END if (generateBtn)

    // ── Prompt Enhancer ──
    const enhanceBtn = document.getElementById('enhancePromptBtn');
    if (enhanceBtn) {
        enhanceBtn.addEventListener('click', async () => {
            const rough = promptInput ? promptInput.value.trim() : '';
            if (!rough) {
                showCustomAlert("Empty Prompt", "Type a rough idea first, then click Enhance.");
                return;
            }

            const originalHTML = '<i class="fas fa-wand-magic-sparkles"></i>';
            enhanceBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            enhanceBtn.disabled  = true;

            try {
                const systemMsg = `You are an AI art prompt engineer. Expand this rough idea into a vivid, detailed image generation prompt. Add lighting, mood, style, camera angle, color palette. Keep it under 100 words. Return ONLY the enhanced prompt, nothing else.`;
                const fullMsg   = encodeURIComponent(`${systemMsg}\n\nPrompt: ${rough}`);

                const res = await fetch(`https://text.pollinations.ai/${fullMsg}`, {
                    method: 'GET',
                    headers: { 'Accept': 'text/plain' }
                });

                if (!res.ok) throw new Error('API error');

                let enhanced = await res.text();

                // Strip deprecation warnings
                enhanced = enhanced
                    .replace(/⚠️[\s\S]*?normally\./gi, '')
                    .replace(/IMPORTANT NOTICE[\s\S]*?normally\./gi, '')
                    .replace(/The Pollinations[\s\S]*?normally\./gi, '')
                    .trim();

                if (!enhanced || enhanced.length < 10) throw new Error('Empty response');

                if (promptInput) {
                    promptInput.value = enhanced;
                    promptInput.dispatchEvent(new Event('input'));
                    promptInput.style.borderColor = 'var(--color-secondary)';
                    promptInput.style.boxShadow   = '0 0 16px rgba(247,37,133,0.5)';
                    setTimeout(() => {
                        promptInput.style.borderColor = '';
                        promptInput.style.boxShadow   = '';
                    }, 1500);
                }
            } catch {
                showCustomAlert("Enhance Failed", "Could not enhance prompt. Please try again in a moment.");
            }

            enhanceBtn.innerHTML = originalHTML;
            enhanceBtn.disabled  = false;
        });

        // Mobile long-press tooltip
        let pressTimer = null;
        enhanceBtn.addEventListener('touchstart', () => {
            pressTimer = setTimeout(() => {
                showCustomAlert("✨ Enhance Prompt", "Tap to make your rough prompt richer using AI.");
            }, 600);
        });
        enhanceBtn.addEventListener('touchend',  () => { if (pressTimer) clearTimeout(pressTimer); });
        enhanceBtn.addEventListener('touchmove', () => { if (pressTimer) clearTimeout(pressTimer); });
    }

    // ── Batch Generation ──
    let batchCount = 1;
    const batchSection = document.getElementById('batchSection');
    const batchBtns    = document.querySelectorAll('.batch-btn');

    function updateBatchVisibility() {
        const p = getUserPlan();
        if (batchSection) batchSection.style.display = p === 'ultimate' ? 'block' : 'none';
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
    const lightboxModal = document.getElementById('imageLightboxModal');
    const lightboxImg   = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxCont  = document.getElementById('lightboxContainer');
    const zoomInBtn     = document.getElementById('lightboxZoomIn');
    const zoomOutBtn    = document.getElementById('lightboxZoomOut');
    const zoomResetBtn  = document.getElementById('lightboxZoomReset');

    let lbScale = 1, lbDragging = false, lbStartX = 0, lbStartY = 0, lbTransX = 0, lbTransY = 0;

    function openLightbox(src) {
        if (!lightboxModal || !lightboxImg) return;
        lightboxImg.src = src;
        lbScale = 1; lbTransX = 0; lbTransY = 0;
        lightboxImg.style.transform = 'scale(1) translate(0,0)';
        lightboxModal.style.visibility = 'visible';
        lightboxModal.style.opacity    = '1';
    }
    function closeLightbox() {
        if (lightboxModal) { lightboxModal.style.visibility = 'hidden'; lightboxModal.style.opacity = '0'; }
    }
    function applyLightboxTransform() {
        if (lightboxImg) lightboxImg.style.transform = `scale(${lbScale}) translate(${lbTransX / lbScale}px,${lbTransY / lbScale}px)`;
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxModal) lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal || e.target.classList.contains('image-lightbox-content')) closeLightbox();
    });
    if (zoomInBtn)    zoomInBtn.addEventListener('click',    () => { lbScale = Math.min(lbScale + 0.3, 5); applyLightboxTransform(); });
    if (zoomOutBtn)   zoomOutBtn.addEventListener('click',   () => { lbScale = Math.max(lbScale - 0.3, 0.5); applyLightboxTransform(); });
    if (zoomResetBtn) zoomResetBtn.addEventListener('click', () => { lbScale = 1; lbTransX = 0; lbTransY = 0; applyLightboxTransform(); });

    if (lightboxModal) {
        lightboxModal.addEventListener('wheel', (e) => {
            e.preventDefault();
            lbScale = e.deltaY < 0 ? Math.min(lbScale + 0.15, 5) : Math.max(lbScale - 0.15, 0.5);
            applyLightboxTransform();
        }, { passive: false });
    }

    if (lightboxCont) {
        lightboxCont.addEventListener('mousedown',  (e) => { lbDragging = true; lbStartX = e.clientX - lbTransX; lbStartY = e.clientY - lbTransY; lightboxCont.style.cursor = 'grabbing'; });
        lightboxCont.addEventListener('mousemove',  (e) => { if (!lbDragging) return; lbTransX = e.clientX - lbStartX; lbTransY = e.clientY - lbStartY; applyLightboxTransform(); });
        lightboxCont.addEventListener('mouseup',    () => { lbDragging = false; lightboxCont.style.cursor = 'grab'; });
        lightboxCont.addEventListener('mouseleave', () => { lbDragging = false; lightboxCont.style.cursor = 'grab'; });

        let lastDist = 0;
        lightboxCont.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) lastDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
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
        for (const event of LV_EVENTS) {
            const eventStart   = new Date(now.getFullYear(), event.month, event.day);
            const eventEnd     = new Date(now.getFullYear(), event.month, event.day + event.validDays);
            const previewStart = new Date(now.getFullYear(), event.month, event.day - event.previewDays);
            if (now >= previewStart && now < eventEnd) {
                showDiscountBanner(event, eventEnd, now >= eventStart);
                return;
            }
        }
        removeDiscountBanner();
    }

    function showDiscountBanner(event, endDate, isLive) {
        const existing = document.getElementById('lv-discount-banner');
        if (existing) existing.remove();
        const banner = document.createElement('div');
        banner.id    = 'lv-discount-banner';
        banner.innerHTML = `
            ${event.emoji}
            <span>${isLive
                ? `<strong>${event.name} Sale is LIVE!</strong> Get <strong>${event.discount}% OFF</strong> on Pro & Ultimate!`
                : `<strong>${event.name} Sale</strong> starts soon! <strong>${event.discount}% OFF</strong> coming up!`}
            </span>
            <span class="lv-countdown">⏳ <span id="lv-banner-countdown">--</span> left</span>
            <button class="lv-banner-close" onclick="removeDiscountBanner()">✕</button>`;
        document.body.prepend(banner);
        document.body.classList.add('has-discount-banner');

        const tick = () => {
            const diff = endDate - new Date();
            if (diff <= 0) { removeDiscountBanner(); return; }
            const el = document.getElementById('lv-banner-countdown');
            if (!el) return;
            const d = Math.floor(diff / 86400000);
            const h = Math.floor((diff % 86400000) / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            el.textContent = `${d}d ${h}h ${m}m ${s}s`;
        };
        tick();
        const interval = setInterval(() => {
            if (!document.getElementById('lv-banner-countdown')) { clearInterval(interval); return; }
            tick();
        }, 1000);

        if (isLive) applyDiscountToPricing(event.discount);
    }

    function removeDiscountBanner() {
        const b = document.getElementById('lv-discount-banner');
        if (b) b.remove();
        document.body.classList.remove('has-discount-banner');
    }
    window.removeDiscountBanner = removeDiscountBanner;

    function applyDiscountToPricing(pct) {
        const prices    = document.querySelectorAll('.plan-card .price');
        const originals = [9.99, 24.99];
        prices.forEach((el, i) => {
            if (i === 0) return;
            const orig = originals[i - 1];
            if (!orig) return;
            const discounted = (orig * (1 - pct / 100)).toFixed(2);
            el.innerHTML = `
                <span style="text-decoration:line-through;font-size:0.55em;color:var(--color-subtle-text);display:block;">$${orig}</span>
                $${discounted}<span class="per-month">/month</span>
                <span style="font-size:0.35em;background:var(--color-secondary);color:#fff;border-radius:4px;padding:2px 6px;margin-left:6px;vertical-align:middle;">${pct}% OFF</span>`;
        });
    }

    checkDiscountEvents();
    setInterval(checkDiscountEvents, 60000);

    // ── 8. Cookie Consent ──
    function checkCookieConsent() {
        if (cookiesPopup && !localStorage.getItem('cookieConsent')) cookiesPopup.style.display = 'flex';
    }
    if (acceptCookiesBtn) acceptCookiesBtn.addEventListener('click', () => { localStorage.setItem('cookieConsent', 'accepted'); if (cookiesPopup) cookiesPopup.style.display = 'none'; });
    if (manageCookiesBtn) manageCookiesBtn.addEventListener('click', () => { if (cookiesPopup) cookiesPopup.style.display = 'none'; openModal(manageCookiesModal); });
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
    let isSeeking         = false;

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
        slider.style.background = `linear-gradient(to right,var(--color-primary) ${pct}%,rgba(76,201,240,0.2) ${pct}%)`;
    }

    function buildPlaylist() {
        if (!playlistItems) return;
        playlistItems.innerHTML = '';
        tracks.forEach((track, i) => {
            const li = document.createElement('li');
            li.textContent = (i === currentTrackIndex ? '▶ ' : '') + track.replace('.mp3', '');
            if (i === currentTrackIndex) li.classList.add('active-track');
            li.addEventListener('click', () => { currentTrackIndex = i; loadTrack(i); audio.play().catch(console.error); buildPlaylist(); });
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
        if (durationDisplay)    durationDisplay.textContent    = '0:00';
    }

    function setControlsVisibility(visible) {
        if (!controls) return;
        isControlsVisible = visible;
        controls.classList.toggle('bgm-controls-hidden', !visible);
        controls.classList.toggle('bgm-controls-visible', visible);
        if (!visible && playlistPanel) { playlistPanel.style.display = 'none'; isPlaylistVisible = false; }
    }

    function updateMuteIcon() {
        if (!muteBtn || !audio) return;
        muteBtn.querySelector('i').className = audio.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
        if (volumeSlider) volumeSlider.disabled = audio.muted;
    }

    if (audio) {
        audio.addEventListener('play',  () => { if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';  if (toggleBtn) toggleBtn.innerHTML = '<i class="fas fa-pause"></i>'; });
        audio.addEventListener('pause', () => { if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';   if (toggleBtn) toggleBtn.innerHTML = '<i class="fas fa-music"></i>'; });
        audio.addEventListener('ended', () => { currentTrackIndex = (currentTrackIndex + 1) % tracks.length; loadTrack(currentTrackIndex); audio.play().catch(console.error); buildPlaylist(); });
        audio.addEventListener('loadedmetadata', () => { if (durationDisplay) durationDisplay.textContent = formatTime(audio.duration); if (seekBar) { seekBar.max = audio.duration; updateSliderFill(seekBar); } });
        audio.addEventListener('timeupdate', () => { if (!isSeeking && audio.duration) { if (currentTimeDisplay) currentTimeDisplay.textContent = formatTime(audio.currentTime); if (seekBar) { seekBar.value = audio.currentTime; updateSliderFill(seekBar); } } });
    }

    if (seekBar) {
        seekBar.addEventListener('mousedown',  () => { isSeeking = true; });
        seekBar.addEventListener('touchstart', () => { isSeeking = true; });
        seekBar.addEventListener('input',  () => { if (currentTimeDisplay) currentTimeDisplay.textContent = formatTime(parseFloat(seekBar.value)); updateSliderFill(seekBar); });
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

    if (playPauseBtn) playPauseBtn.addEventListener('click', (e) => { e.stopPropagation(); if (!audio.src || audio.src === window.location.href) loadTrack(currentTrackIndex); audio.paused ? audio.play().catch(console.error) : audio.pause(); });
    if (prevBtn)      prevBtn.addEventListener('click', (e) => { e.stopPropagation(); if (audio.currentTime > 3) { audio.currentTime = 0; } else { const wp = !audio.paused; currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length; loadTrack(currentTrackIndex); buildPlaylist(); if (wp) audio.play().catch(console.error); } });
    if (nextBtn)      nextBtn.addEventListener('click', (e) => { e.stopPropagation(); const wp = !audio.paused; currentTrackIndex = (currentTrackIndex + 1) % tracks.length; loadTrack(currentTrackIndex); buildPlaylist(); if (wp) audio.play().catch(console.error); });
    if (muteBtn)      muteBtn.addEventListener('click', (e) => { e.stopPropagation(); audio.muted = !audio.muted; updateMuteIcon(); });
    if (playlistBtn)  playlistBtn.addEventListener('click', (e) => { e.stopPropagation(); isPlaylistVisible = !isPlaylistVisible; if (playlistPanel) playlistPanel.style.display = isPlaylistVisible ? 'block' : 'none'; if (isPlaylistVisible) buildPlaylist(); });
    if (toggleBtn)    toggleBtn.addEventListener('click', (e) => { e.stopPropagation(); setControlsVisibility(!isControlsVisible); });

    let bgmCloseTimer = null;
    const bgmCancelClose   = () => { if (bgmCloseTimer) { clearTimeout(bgmCloseTimer); bgmCloseTimer = null; } };
    const bgmScheduleClose = () => { bgmCancelClose(); bgmCloseTimer = setTimeout(() => setControlsVisibility(false), 800); };

    if (playerContainer) { playerContainer.addEventListener('mouseenter', bgmCancelClose); playerContainer.addEventListener('mouseleave', bgmScheduleClose); }
    if (controls)        { controls.addEventListener('mouseenter', bgmCancelClose);        controls.addEventListener('mouseleave', bgmScheduleClose); }

    loadTrack(currentTrackIndex);
    if (audio && volumeSlider) audio.volume = parseFloat(volumeSlider.value);
    updateMuteIcon();
    buildPlaylist();

    // ── Gallery Arrows ──
    window.scrollGallery = function(btn, direction) {
        const wrapper = btn.closest('.gallery-scroll-wrapper');
        const grid    = wrapper ? wrapper.querySelector('.scrollable-gallery') : null;
        if (grid) grid.scrollBy({ left: direction * 220, behavior: 'smooth' });
    };

}); // END DOMContentLoaded