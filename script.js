document.addEventListener('DOMContentLoaded', () => {
    // --- DOM 요소 ---
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const sampleAnswersContainer = document.getElementById('sampleAnswersContainer');
    const interactionButtonArea = document.getElementById('interactionButtonArea');
    const moreOptionsBtn = document.getElementById('moreOptionsBtn');
    const moreOptionsPanel = document.getElementById('moreOptionsPanel');
    const chatInputArea = document.querySelector('.chat-input-area');
    const userBoneCountEl = document.getElementById('userBoneCount');

    // 모달 내부 요소들
    const syncTypeMainImage = document.getElementById('syncTypeMainImage');
    const syncTypeDescription = document.getElementById('syncTypeDescription');
    const syncTypeTabsContainer = document.querySelector('.sync-type-tabs');
    const tarotCollectedCountEl = document.getElementById('tarotCollectedCount');
    const tarotTotalCountEl = document.getElementById('tarotTotalCount');
    const tarotGaugeFillEl = document.getElementById('tarotGaugeFill');
    const tarotCardGridEl = document.getElementById('tarotCardGrid');
    const tarotCardScrollWrapper = document.getElementById('tarotCardScrollWrapper');

    // 타로 카드 선택 UI 요소
    const tarotSelectionOverlay = document.getElementById('tarotSelectionOverlay');
    const tarotCardCarouselContainer = document.getElementById('tarotCardCarouselContainer');
    const tarotCardCarousel = document.getElementById('tarotCardCarousel');
    const tarotCardInfo = document.getElementById('tarotCardInfo');
    const tarotSelectionConfirmBtn = document.getElementById('tarotSelectionConfirmBtn');
    const tarotClearSelectionBtn = document.getElementById('tarotClearSelectionBtn');
    const tarotRandomSelectBtn = document.getElementById('tarotRandomSelectBtn');

    // --- 전역 변수 및 상수 ---
    let userProfile;
    let isLoadingBotResponse = false;
    const TYPING_CHUNK_DELAY_MS = 30;
    let currentPanelMenuKey = 'main';
    let menuNavigationHistory = [];
    let hasUserSentMessage = false;
    const SHOW_RECOMMEND_TOOLTIP_ON_PAID_BUTTONS = true;

    let isTarotSelectionActive = false;
    let cardsToSelectCount = 0;
    let selectedTarotCardIndices = [];
    const TOTAL_CARDS_IN_DECK = 78;
    let carouselScrollState = { isDragging: false, startX: 0, scrollLeftStart: 0 };

    const initialBotMessage = {
        text: "안녕하세요! 루비입니다. 무엇을 도와드릴까요?",
        sampleAnswers: ["오늘의 운세", "카드 뽑기"]
    };

    const ALL_TAROT_CARD_IDS = [
        "major_00_fool_upright", "major_01_magician_upright", "major_02_high_priestess_upright", "major_03_empress_upright", "major_04_emperor_upright", "major_05_hierophant_upright", "major_06_lovers_upright", "major_07_chariot_upright", "major_08_justice_upright", "major_09_hermit_upright", "major_10_wheel_upright", "major_11_strength_upright", "major_12_hanged_man_upright", "major_13_death_upright", "major_14_temperance_upright", "major_15_devil_upright", "major_16_tower_upright", "major_17_star_upright", "major_18_moon_upright", "major_19_sun_upright", "major_20_judgement_upright", "major_21_world_upright",
        "wands_01_ace_upright", "wands_02_two_upright", "wands_03_three_upright", "wands_04_four_upright", "wands_05_five_upright", "wands_06_six_upright", "wands_07_seven_upright", "wands_08_eight_upright", "wands_09_nine_upright", "wands_10_ten_upright", "wands_11_page_upright", "wands_12_knight_upright", "wands_13_queen_upright", "wands_14_king_upright",
        "cups_01_ace_upright", "cups_02_two_upright", "cups_03_three_upright", "cups_04_four_upright", "cups_05_five_upright", "cups_06_six_upright", "cups_07_seven_upright", "cups_08_eight_upright", "cups_09_nine_upright", "cups_10_ten_upright", "cups_11_page_upright", "cups_12_knight_upright", "cups_13_queen_upright", "cups_14_king_upright",
        "swords_01_ace_upright", "swords_02_two_upright", "swords_03_three_upright", "swords_04_four_upright", "swords_05_five_upright", "swords_06_six_upright", "swords_07_seven_upright", "swords_08_eight_upright", "swords_09_nine_upright", "swords_10_ten_upright", "swords_11_page_upright", "swords_12_knight_upright", "swords_13_queen_upright", "swords_14_king_upright",
        "pentacles_01_ace_upright", "pentacles_02_two_upright", "pentacles_03_three_upright", "pentacles_04_four_upright", "pentacles_05_five_upright", "pentacles_06_six_upright", "pentacles_07_seven_upright", "pentacles_08_eight_upright", "pentacles_09_nine_upright", "pentacles_10_ten_upright", "pentacles_11_page_upright", "pentacles_12_knight_upright", "pentacles_13_queen_upright", "pentacles_14_king_upright",
        "major_00_fool_reversed", "major_01_magician_reversed", "major_02_high_priestess_reversed", "major_03_empress_reversed", "major_04_emperor_reversed", "major_05_hierophant_reversed", "major_06_lovers_reversed", "major_07_chariot_reversed", "major_08_justice_reversed", "major_09_hermit_reversed", "major_10_wheel_reversed", "major_11_strength_reversed", "major_12_hanged_man_reversed", "major_13_death_reversed", "major_14_temperance_reversed", "major_15_devil_reversed", "major_16_tower_reversed", "major_17_star_reversed", "major_18_moon_reversed", "major_19_sun_reversed", "major_20_judgement_reversed", "major_21_world_reversed",
        "wands_01_ace_reversed", "wands_02_two_reversed", "wands_03_three_reversed", "wands_04_four_reversed", "wands_05_five_reversed", "wands_06_six_reversed", "wands_07_seven_reversed", "wands_08_eight_reversed", "wands_09_nine_reversed", "wands_10_ten_reversed", "wands_11_page_reversed", "wands_12_knight_reversed", "wands_13_queen_reversed", "wands_14_king_reversed",
        "cups_01_ace_reversed", "cups_02_two_reversed", "cups_03_three_reversed", "cups_04_four_reversed", "cups_05_five_reversed", "cups_06_six_reversed", "cups_07_seven_reversed", "cups_08_eight_reversed", "cups_09_nine_reversed", "cups_10_ten_reversed", "cups_11_page_reversed", "cups_12_knight_reversed", "cups_13_queen_reversed", "cups_14_king_reversed",
        "swords_01_ace_reversed", "swords_02_two_reversed", "swords_03_three_reversed", "swords_04_four_reversed", "swords_05_five_reversed", "swords_06_six_reversed", "swords_07_seven_reversed", "swords_08_eight_reversed", "swords_09_nine_reversed", "swords_10_ten_reversed", "swords_11_page_reversed", "swords_12_knight_reversed", "swords_13_queen_reversed", "swords_14_king_reversed",
        "pentacles_01_ace_reversed", "pentacles_02_two_reversed", "pentacles_03_three_reversed", "pentacles_04_four_reversed", "pentacles_05_five_reversed", "pentacles_06_six_reversed", "pentacles_07_seven_reversed", "pentacles_08_eight_reversed", "pentacles_09_nine_reversed", "pentacles_10_ten_reversed", "pentacles_11_page_reversed", "pentacles_12_knight_reversed", "pentacles_13_queen_reversed", "pentacles_14_king_reversed"
    ];
    const TOTAL_TAROT_CARDS = ALL_TAROT_CARD_IDS.length;
    let syncTypeDataStore = {};

    function adjustChatMessagesPadding() {
        if (!sampleAnswersContainer || !chatInputArea || !chatMessages || !interactionButtonArea) {
            console.error("[UIAdjust] adjustChatMessagesPadding 필수 DOM 요소 누락."); return;
        }
        const interactionAreaHeight = interactionButtonArea.classList.contains('active') ? interactionButtonArea.offsetHeight : 0;
        const sampleAnswersHeight = sampleAnswersContainer.offsetHeight;
        const chatInputAreaHeight = chatInputArea.offsetHeight;
        const totalBottomAreaHeight = interactionAreaHeight + sampleAnswersHeight + chatInputAreaHeight;
        const extraPadding = 10;
        chatMessages.style.paddingBottom = `${totalBottomAreaHeight + extraPadding}px`;
    }

    function scrollToBottom() { chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: 'smooth' }); }

    function adjustTextareaHeight() {
        if (!messageInput) return;
        messageInput.style.height = 'auto';
        let newHeight = messageInput.scrollHeight;
        const maxHeightStyle = getComputedStyle(messageInput).maxHeight;
        const maxHeight = maxHeightStyle && maxHeightStyle !== 'none' ? parseInt(maxHeightStyle) : Infinity;
        if (newHeight > maxHeight) { newHeight = maxHeight; messageInput.style.overflowY = 'auto'; }
        else messageInput.style.overflowY = 'hidden';
        messageInput.style.height = `${newHeight}px`;
    }

    function sanitizeBotHtml(htmlString) {
        const tempDiv = document.createElement('div'); tempDiv.innerHTML = htmlString;
        const allowedElements = { 'B': [], 'STRONG': [], 'BR': [], 'SPAN': ['style', 'class'], 'DIV': ['style', 'class'], 'IMG': ['src', 'alt', 'title', 'class'], 'BUTTON': ['class', 'data-value', 'disabled', 'type'] };
        function cleanNodeRecursive(node) {
            if (node.nodeType === Node.TEXT_NODE) return document.createTextNode(node.textContent);
            if (node.nodeType === Node.ELEMENT_NODE) {
                const tagName = node.tagName.toUpperCase();
                if (allowedElements.hasOwnProperty(tagName)) {
                    const newNode = document.createElement(node.tagName.toLowerCase());
                    const allowedAttributes = allowedElements[tagName];
                    for (const attr of Array.from(node.attributes)) {
                        const attrNameLower = attr.name.toLowerCase();
                        if (allowedAttributes.includes(attrNameLower)) {
                            if (attrNameLower === 'src') { const srcValue = attr.value; if (srcValue && (srcValue.startsWith('http') || srcValue.startsWith('/') || srcValue.startsWith('img/') || srcValue.match(/^[a-zA-Z0-9_\-\/\.]+$/))) newNode.setAttribute(attr.name, srcValue); else console.warn(`[Sanitize] 유효하지 않거나 허용되지 않는 ${tagName} src: ${srcValue}`); }
                            else if (attrNameLower === 'style') newNode.setAttribute(attr.name, attr.value);
                            else newNode.setAttribute(attr.name, attr.value);
                        } else if (attrNameLower.startsWith('on')) console.warn(`[Sanitize] on* 이벤트 핸들러 제거: ${attr.name} for ${tagName}`);
                    }
                    for (const childNode of Array.from(node.childNodes)) newNode.appendChild(cleanNodeRecursive(childNode));
                    return newNode;
                } else { const fragment = document.createDocumentFragment(); for (const childNode of Array.from(node.childNodes)) fragment.appendChild(cleanNodeRecursive(childNode)); return fragment; }
            }
            return document.createDocumentFragment();
        }
        const fragment = document.createDocumentFragment(); Array.from(tempDiv.childNodes).forEach(child => fragment.appendChild(cleanNodeRecursive(child)));
        const resultDiv = document.createElement('div'); resultDiv.appendChild(fragment); return resultDiv.innerHTML;
    }

    function clearChatMessages() { if (chatMessages) { while (chatMessages.firstChild) chatMessages.removeChild(chatMessages.firstChild); console.log("[Chat] 모든 메시지 삭제됨."); requestAnimationFrame(adjustChatMessagesPadding); } else console.error("[Chat] chatMessages 요소를 찾을 수 없어 메시지를 삭제할 수 없습니다."); }
    
    function updateBoneCountDisplay() { if (userBoneCountEl && userProfile && typeof userProfile.bones === 'number') userBoneCountEl.textContent = userProfile.bones; }

    function loadUserProfileFromLocalStorage() { const storedData = localStorage.getItem('userSyncData'); if (storedData) { try { return JSON.parse(storedData); } catch (error) { console.error("[LocalStorage] 저장된 데이터 파싱 오류:", error); localStorage.removeItem('userSyncData'); return null; } } return null; }

    function saveUserProfileToLocalStorage(profile) {
        if (!profile) { console.error("[LocalStorage] 저장할 프로필 데이터 없음."); return; }
        const dataToStore = { 결정된싱크타입: profile.결정된싱크타입, 사용자소속성운: profile.사용자소속성운, 사용자애칭: profile.사용자애칭, 사용자이름: profile.사용자이름, 지금까지수집된타로카드: profile.지금까지수집된타로카드, overviewText: profile.overviewText, tarotbg: profile.tarotbg, 선택된타로카드들: profile.선택된타로카드들, bones: profile.bones, 시나리오: profile.시나리오, 메뉴단계: profile.메뉴단계 };
        try { localStorage.setItem('userSyncData', JSON.stringify(dataToStore)); } catch (error) { console.error("[LocalStorage] 사용자 프로필 저장 오류:", error); }
    }

    function initializeUserProfile() {
        let loadedProfileData = loadUserProfileFromLocalStorage();
        let defaultProfile = { "사용자이름": "방문객", "사용자애칭": "방문객", "사용자가좋아하는것": "새로운 경험", "사용자의마음을아프게하는것": "오류 메시지", "사용자가싫어하는것": "지루함", "사용자의나이성별": "비공개", "사용자의고민": "오늘의 운세는 어떨까?", "주관식질문1": null, "주관식답변1": null, "주관식질문2": null, "주관식답변2": null, "주관식질문3": null, "주관식답변3": null, "주관식질문4": null, "주관식답변4": null, "주관식질문5": null, "주관식답변5": null, "객관식질문과답변": [], "DISC_D_점수": 0, "DISC_I_점수": 0, "DISC_S_점수": 0, "DISC_C_점수": 0, "결정된싱크타입": "스텔라터틀", "사용자소속성운": "루미네시아", "사용자가성운에속한이유": "아직 알 수 없어요.", "맞춤싱크타입이름": "별을 기다리는 자", "overviewText": "당신은 복잡한 내면세계를 가진 존재입니다. 때로는 활기차고 외향적이다가도, 깊은 생각에 잠겨 혼자만의 시간을 즐기기도 합니다. 다양한 가능성을 탐색하는 것을 좋아하며, 정해진 틀에 얽매이는 것을 답답해할 수 있습니다. 당신의 강점은 뛰어난 직관력과 공감 능력이지만, 때로는 감정에 쉽게 휩쓸리거나 결정을 내리는 데 어려움을 겪을 수도 있습니다. 균형을 찾는 여정이 중요해 보입니다.", "사용자의감정상태": "평온", "선택된타로카드들": [], "지금까지수집된타로카드": [], "시나리오": null, "메뉴단계": 1, "싱크타입단계": "미결정", "tarotbg": "default.png", "bones": 10 };
        userProfile = { ...defaultProfile };
        if (loadedProfileData) { Object.keys(defaultProfile).forEach(key => { if (loadedProfileData.hasOwnProperty(key) && loadedProfileData[key] !== null && loadedProfileData[key] !== undefined) userProfile[key] = loadedProfileData[key]; }); if (userProfile.결정된싱크타입 && userProfile.사용자소속성운) userProfile.싱크타입단계 = "결정됨"; }
        else { userProfile.사용자이름 = "임시방문객"; userProfile.사용자애칭 = "별 탐험가"; userProfile.싱크타입단계 = "결정됨"; saveUserProfileToLocalStorage(userProfile); }
        updateBoneCountDisplay();
    }

    function drawRadarChart(canvasId, labels, datasets) {
        const ctx = document.getElementById(canvasId); if (!ctx) return null;
        let existingChart = Chart.getChart(ctx); if (existingChart) existingChart.destroy();
        let allDataValues = []; datasets.forEach(ds => ds.data.forEach(val => allDataValues.push((typeof val === 'string' ? parseFloat(val) : val) || 0)));
        const maxVal = Math.max(...allDataValues, 0); const suggestedMax = Math.max(10, Math.ceil(maxVal / 5) * 5);
        return new Chart(ctx, { type: 'radar', data: { labels: labels, datasets: datasets.map(ds => ({ label: ds.label, data: ds.data.map(val => (typeof val === 'string' ? parseFloat(val) : val) || 0), backgroundColor: ds.backgroundColor || 'rgba(0,0,0,0.2)', borderColor: ds.borderColor || 'rgba(0,0,0,1)', borderWidth: ds.borderWidth || 1.5, pointBackgroundColor: ds.borderColor || 'rgba(0,0,0,1)', pointBorderColor: '#fff', pointHoverBackgroundColor: '#fff', pointHoverBorderColor: ds.borderColor || 'rgba(0,0,0,1)', fill: true })) }, options: { responsive: true, maintainAspectRatio: false, scales: { r: { angleLines: { display: true, color: 'rgba(0,0,0,0.1)' }, grid: { color: 'rgba(0,0,0,0.1)' }, suggestedMin: 0, suggestedMax: suggestedMax, ticks: { display: true, stepSize: suggestedMax / 4, backdropColor: 'transparent', color: '#666' }, pointLabels: { font: { size: 10 }, color: '#333' } } }, plugins: { legend: { display: false }, tooltip: { enabled: true, callbacks: { label: function(context) { let label = context.dataset.label || ''; if (label) label += ': '; if (context.parsed.r !== null) label += context.parsed.r.toFixed(1); return label; } } } } } });
    }

    function generateSyncTypeData() {
        if (!userProfile || typeof ALL_SYNC_TYPES === 'undefined' || typeof ALL_NEBULAS === 'undefined') { syncTypeDataStore = { overview: { text: userProfile.overviewText || "총평 정보 없음.", chartData: { labels: [], datasets: [] }, customLegend: [] }, nebula: { image: "img/sync_type/nebula_default.png", text: "성운 정보 오류." }, syncTypeDetail: { image: "img/sync_type/type_default.png", text: "싱크타입 정보 오류." } }; return; }
        function findDataFlexible(dataObject, primaryKey, secondaryKeyField, secondaryKeyTransform = (k) => k.toLowerCase().replace(/\s+/g, '')) { if (!primaryKey && !secondaryKeyField) return null; if (primaryKey && dataObject[primaryKey]) return dataObject[primaryKey]; if (primaryKey) { const npk = primaryKey.replace(/\s+/g, ''); if (dataObject[npk]) return dataObject[npk]; for (const key in dataObject) if (key.replace(/\s+/g, '') === npk) return dataObject[key]; } if (secondaryKeyField && primaryKey) { const ttv = secondaryKeyTransform(primaryKey); for (const key in dataObject) if (dataObject[key][secondaryKeyField] && secondaryKeyTransform(dataObject[key][secondaryKeyField]) === ttv) return dataObject[key]; } return null; }
        const nebulaInfo = findDataFlexible(ALL_NEBULAS, userProfile.사용자소속성운, 'nameEng'); const syncTypeInfo = findDataFlexible(ALL_SYNC_TYPES, userProfile.결정된싱크타입, 'nameEng');
        const bfl = ["신경성", "외향성", "개방성", "우호성", "성실성"]; const crl = bfl; let bfs = [0,0,0,0,0]; if (nebulaInfo) bfs = [parseFloat(nebulaInfo.Neuroticism)||0, parseFloat(nebulaInfo.Extraversion)||0, parseFloat(nebulaInfo.Openness)||0, parseFloat(nebulaInfo.Agreeableness)||0, parseFloat(nebulaInfo.Conscientiousness)||0]; let ds = [0,0,0,0]; if (syncTypeInfo) ds = [syncTypeInfo.D||0, syncTypeInfo.I||0, syncTypeInfo.S||0, syncTypeInfo.C||0]; const ddp = [...ds, null]; const d1c='rgba(255,159,64,1)', d1bgc='rgba(255,159,64,0.3)', d2c='rgba(75,192,192,1)', d2bgc='rgba(75,192,192,0.3)';
        syncTypeDataStore.overview = { text: userProfile.overviewText || "종합 분석입니다.", chartData: { labels: crl, datasets: [ {label:'성격 5요인', data:bfs, borderColor:d1c, backgroundColor:d1bgc, pointBackgroundColor:d1c, borderWidth:1.5}, {label:'행동 유형', data:ddp, borderColor:d2c, backgroundColor:d2bgc, pointBackgroundColor:d2c, borderWidth:1.5} ]}, customLegend: [{text:'성격 5요인',color:d1c},{text:'행동 유형',color:d2c}]};
        let ni="img/sync_type/nebula_default.png", nt="소속 성운 정보 없음."; if(nebulaInfo){const rncn=nebulaInfo.cardName||userProfile.사용자소속성운.toLowerCase().replace(/\s+/g,'_');ni=`img/sync_type/constellation_${rncn}_card.png`;let b5st=`N:${nebulaInfo.Neuroticism||0},E:${nebulaInfo.Extraversion||0},O:${nebulaInfo.Openness||0},A:${nebulaInfo.Agreeableness||0},C:${nebulaInfo.Conscientiousness||0}`;userProfile.사용자가성운에속한이유=`${nebulaInfo.nameKor}의 ${nebulaInfo.tendency} 특성과 연결.`;nt=`<b>${nebulaInfo.nameKor}(${nebulaInfo.nameEng})</b> 성운.<br><br><b>성향:</b> ${nebulaInfo.tendency}<br><b>설명:</b> ${nebulaInfo.description}<br><b>특징:</b> ${nebulaInfo.characteristics||'없음'}<br>${b5st?`<b>5요인:</b> ${b5st}<br>`:''}<b>주요 싱크타입:</b> ${(nebulaInfo.memberSyncTypes||[]).join(', ')||'없음'}<br><br>이유: ${userProfile.사용자가성운에속한이유}`; } else if(userProfile.사용자소속성운){userProfile.사용자가성운에속한이유=`성운 '${userProfile.사용자소속성운}' 정보 없음.`;nt=`'${userProfile.사용자소속성운}' 정보 없음.`;} else userProfile.사용자가성운에속한이유="성운 미결정."; syncTypeDataStore.nebula={image:ni,text:nt};
        let sti="img/sync_type/type_default.png", stt="싱크타입 정보 없음."; if(syncTypeInfo){const rstcn=syncTypeInfo.cardName||userProfile.결정된싱크타입.toLowerCase().replace(/\s+/g,'_');sti=`img/sync_type/${rstcn}_character_card.png`;let dst=`D:${syncTypeInfo.D||0},I:${syncTypeInfo.I||0},S:${syncTypeInfo.S||0},C:${syncTypeInfo.C||0}`;userProfile.맞춤싱크타입이름=`${syncTypeInfo.tendency.split(',')[0].trim()} ${syncTypeInfo.nameKor}`;stt=`<b>${syncTypeInfo.nameKor}(${syncTypeInfo.nameEng})</b>.<br>${userProfile.맞춤싱크타입이름?`애칭:<b>${userProfile.맞춤싱크타입이름}</b><br><br>`:'<br>'}<b>성향:</b> ${syncTypeInfo.tendency}<br><b>설명:</b> ${syncTypeInfo.description}<br><b>강점:</b> ${syncTypeInfo.strength||'없음'}<br><b>보완점:</b> ${syncTypeInfo.weakness||'없음'}<br>${dst?`<b>DISC:</b> ${dst}<br>`:''}<b>소속 성운:</b> ${syncTypeInfo.nebulaName||'없음'}`; } else if(userProfile.결정된싱크타입){userProfile.맞춤싱크타입이름=`싱크타입 '${userProfile.결정된싱크타입}' 정보 없음.`;stt=`'${userProfile.결정된싱크타입}' 정보 없음.`;} else userProfile.맞춤싱크타입이름="싱크타입 미결정."; syncTypeDataStore.syncTypeDetail={image:sti,text:stt};
    }

    async function addMessage(data, type, options = {}) {
        const messageDiv = document.createElement('div'); messageDiv.classList.add('message');
        let textContentForLog = ""; if (typeof data === 'string') textContentForLog = data; else if (data && typeof data.text === 'string') textContentForLog = data.text; else if (data && typeof data.interpretationHtml === 'string') textContentForLog = "조수 해석 컨텐츠";
        // console.log(`[Message] '${type}' 메시지 추가 시작: "${textContentForLog.substring(0, 70)}..."`); // 로그 축약
        return new Promise(async (resolveAllMessagesAdded) => {
            if (type === 'user') { messageDiv.classList.add('user-message'); messageDiv.textContent = typeof data === 'string' ? data : data.text; if (chatMessages) chatMessages.appendChild(messageDiv); requestAnimationFrame(() => { adjustChatMessagesPadding(); scrollToBottom(); resolveAllMessagesAdded(); }); }
            else if (type === 'bot') {
                messageDiv.classList.add('bot-message');
                if (data && data.isAssistantInterpretation) { messageDiv.classList.add('assistant-type-message'); const interpretationContainer = document.createElement('div'); interpretationContainer.className = 'assistant-interpretation-container'; interpretationContainer.innerHTML = sanitizeBotHtml(data.interpretationHtml); messageDiv.appendChild(interpretationContainer); if (chatMessages) chatMessages.appendChild(messageDiv); requestAnimationFrame(() => { adjustChatMessagesPadding(); scrollToBottom(); resolveAllMessagesAdded(); }); }
                else {
                    const messageContentString = typeof data === 'string' ? data : data.text; if (chatMessages) chatMessages.appendChild(messageDiv); requestAnimationFrame(() => { adjustChatMessagesPadding(); scrollToBottom(); });
                    messageDiv.innerHTML = ''; const sanitizedHtmlForTyping = sanitizeBotHtml(messageContentString); const tempContainer = document.createElement('div'); tempContainer.innerHTML = sanitizedHtmlForTyping; const typingChunks = [];
                    function extractChunksRecursive(node) { if (node.nodeType === Node.TEXT_NODE) { const tc = node.textContent; if (tc.trim() !== '') { const w = tc.match(/\S+\s*|\S/g) || []; w.forEach(wd => { if (wd.trim() !== '') typingChunks.push({ type: 'text_word', content: wd }); else if (wd.length > 0) typingChunks.push({ type: 'text_whitespace', content: wd }); }); } else if (tc.length > 0) typingChunks.push({ type: 'text_whitespace', content: tc }); } else if (node.nodeType === Node.ELEMENT_NODE) { const tn = node.tagName.toLowerCase(); if (tn === 'img') typingChunks.push({ type: 'element_immediate', element: node.cloneNode(true) }); else if (tn === 'br') typingChunks.push({ type: 'br_tag' }); else { typingChunks.push({ type: 'open_tag', tagName: tn, attributes: Array.from(node.attributes) }); Array.from(node.childNodes).forEach(extractChunksRecursive); typingChunks.push({ type: 'close_tag', tagName: tn }); } } }
                    Array.from(tempContainer.childNodes).forEach(extractChunksRecursive); let currentContextElement = messageDiv;
                    for (let i = 0; i < typingChunks.length; i++) { const chunk = typingChunks[i]; if (chunk.type === 'element_immediate') currentContextElement.appendChild(chunk.element); else { await new Promise(r => setTimeout(r, TYPING_CHUNK_DELAY_MS)); if (chunk.type === 'text_word') { const s = document.createElement('span'); s.className = 'message-text-chunk-animated'; s.textContent = chunk.content; currentContextElement.appendChild(s); } else if (chunk.type === 'text_whitespace') currentContextElement.appendChild(document.createTextNode(chunk.content)); else if (chunk.type === 'br_tag') currentContextElement.appendChild(document.createElement('br')); else if (chunk.type === 'open_tag') { const ne = document.createElement(chunk.tagName); chunk.attributes.forEach(attr => ne.setAttribute(attr.name, attr.value)); currentContextElement.appendChild(ne); currentContextElement = ne; } else if (chunk.type === 'close_tag') if (currentContextElement.tagName.toLowerCase() === chunk.tagName && currentContextElement.parentElement && currentContextElement !== messageDiv) currentContextElement = currentContextElement.parentElement; } if (i % 3 === 0 || i === typingChunks.length - 1) requestAnimationFrame(scrollToBottom); }
                    requestAnimationFrame(() => { adjustChatMessagesPadding(); scrollToBottom(); }); resolveAllMessagesAdded();
                }
            } else if (type === 'system') { messageDiv.classList.add('system-message'); messageDiv.textContent = typeof data === 'string' ? data : data.text; if (chatMessages) chatMessages.appendChild(messageDiv); requestAnimationFrame(() => { adjustChatMessagesPadding(); scrollToBottom(); resolveAllMessagesAdded(); }); }
            else { console.warn(`[Message] 알 수 없는 메시지 타입: ${type}`); resolveAllMessagesAdded(); }
        });
    }

    function updateInteractionButtons(buttonsArray = []) {
        if (!interactionButtonArea) return; interactionButtonArea.innerHTML = '';
        if (buttonsArray && buttonsArray.length > 0) {
            buttonsArray.forEach(buttonData => {
                const buttonEl = document.createElement('button'); buttonEl.className = 'interaction-btn';
                buttonEl.dataset.value = buttonData.value;
                if (buttonData.isPaid) {
                    buttonEl.classList.add('paid-action');
                    if (SHOW_RECOMMEND_TOOLTIP_ON_PAID_BUTTONS && buttonData.showRecommendTooltip !== false) {
                        const tooltipSpan = document.createElement('span'); tooltipSpan.className = 'recommend-tooltip'; tooltipSpan.textContent = '추천';
                        buttonEl.appendChild(tooltipSpan);
                        buttonEl.appendChild(document.createTextNode(" " + buttonData.text));
                    } else buttonEl.textContent = buttonData.text;
                } else buttonEl.textContent = buttonData.text;
                if (buttonData.disabled) buttonEl.disabled = true;
                interactionButtonArea.appendChild(buttonEl);
            });
            interactionButtonArea.classList.add('active');
        } else interactionButtonArea.classList.remove('active');
        requestAnimationFrame(adjustChatMessagesPadding);
    }
    
    function updateSampleAnswers(answers = [], showChatButtonsInstead = false) {
        const existingButtons = Array.from(sampleAnswersContainer.querySelectorAll('.sample-answer-btn')); const buttonFadeOutDuration = 200;
        function renderButtons() {
            sampleAnswersContainer.innerHTML = '';
            if (showChatButtonsInstead) {
                sampleAnswersContainer.classList.add('has-buttons'); const btn = document.createElement('button'); btn.classList.add('sample-answer-btn'); btn.textContent = '위에서 버튼을 선택해주세요'; btn.disabled = true; sampleAnswersContainer.appendChild(btn); sampleAnswersContainer.style.justifyContent = 'center';
            } else if (answers.length > 0) {
                sampleAnswersContainer.classList.add('has-buttons'); sampleAnswersContainer.style.justifyContent = 'flex-start';
                answers.forEach((answerData, index) => { const btn = document.createElement('button'); btn.classList.add('sample-answer-btn'); const txt = (typeof answerData === 'string') ? answerData : answerData.text; const val = (typeof answerData === 'string') ? answerData : (answerData.value || answerData.text); btn.textContent = txt; btn.dataset.answer = val; btn.style.animationDelay = `${index * 70}ms`; btn.disabled = isLoadingBotResponse; sampleAnswersContainer.appendChild(btn); });
            } else { sampleAnswersContainer.classList.remove('has-buttons'); sampleAnswersContainer.style.justifyContent = 'flex-start'; }
            requestAnimationFrame(adjustChatMessagesPadding);
        }
        if (existingButtons.length > 0) { existingButtons.forEach(btn => btn.classList.add('fade-out')); setTimeout(renderButtons, buttonFadeOutDuration); } else renderButtons();
    }

    const botKnowledgeBase = {
        "오늘의 운세 보여줘": { response: "오늘 당신의 운세는... <b>매우 긍정적</b>입니다! 새로운 시작을 하기에 좋은 날이에요. <br>자신감을 가지세요!", sampleAnswers: ["다른 운세", "고마워"] },
        "기본": { response: "죄송해요, 잘 이해하지 못했어요. <br><b>도움말</b>이라고 입력하시면 제가 할 수 있는 일을 알려드릴게요.", sampleAnswers: ["도움말", "오늘의 운세", "카드 뽑기"] }
    };

    async function simulateBotResponse(userMessageText) {
        console.log(`[BotResponse] "${userMessageText}"에 대한 응답 시뮬레이션 시작.`);
        return new Promise(async (resolve) => {
            await new Promise(r => setTimeout(r, 200 + Math.random() * 300));
            let responseData = { assistantmsg: "", assistant_interpretation: null, tarocardview: false, cards_to_select: null, sampleanswer: [], user_profile_update: {} };
            const lowerUserMessage = userMessageText.toLowerCase();
            if (userMessageText === "카드 뽑기" || userMessageText === "카드뽑을래") { responseData.assistantmsg = "카드를 몇 장 뽑으시겠어요?"; userProfile.시나리오 = "ask_card_count"; }
            else if (userMessageText === "1장 (무료)") { responseData.assistantmsg = "네, 알겠습니다. 잠시 카드를 준비하겠습니다.<br>준비가 되면 아래에서 <b>1장</b>의 카드를 선택해주십시오."; responseData.tarocardview = true; responseData.cards_to_select = 1; responseData.sampleanswer = [{text: "선택 취소", value: "선택 취소"}, {text: "운에 맡기기", value: "운에 맡기기"}]; responseData.user_profile_update = { "시나리오": "tarot_single_pick" }; }
            else if (userMessageText === "3장 (🦴-2)") { responseData.assistantmsg = "네, 잠시 카드를 준비하겠습니다.<br>준비가 되면 아래에서 <b>3장</b>의 카드를 선택해주십시오."; responseData.tarocardview = true; responseData.cards_to_select = 3; responseData.sampleanswer = [{text: "선택 취소", value: "선택 취소"}, {text: "운에 맡기기", value: "운에 맡기기"}]; responseData.user_profile_update = { "시나리오": "tarot_triple_pick" }; }
            else if (userMessageText === "카드 선택 완료") {
                let assistantInterpretationHTML = "", rubyCommentary = "";
                if (userProfile.선택된타로카드들 && userProfile.선택된타로카드들.length > 0) {
                    assistantInterpretationHTML += `<div class="assistant-interpretation-container"><div class="interpretation-text">선택하신 카드에 대한 풀이입니다.<br><br></div>`;
                    userProfile.선택된타로카드들.forEach((cardId, index) => { let cdn=cardId.replace(/_/g,' '), inf=cardId, ir=cardId.endsWith('_reversed'); if(typeof TAROT_CARD_DATA!=='undefined'&&TAROT_CARD_DATA[cardId])cdn=TAROT_CARD_DATA[cardId].name; else cdn=cardId.replace(/_/g,' ').replace(/\b\w/g,l=>l.toUpperCase()).replace(' Reversed',' (역방향)').replace(' Upright',' (정방향)'); if(ir)inf=cardId.substring(0,cardId.lastIndexOf('_reversed'))+'_upright'; else if(cardId.endsWith('_upright'))inf=cardId; const ciu=`img/tarot/${inf}.png`; const ci=(TAROT_CARD_DATA&&TAROT_CARD_DATA[cardId])?TAROT_CARD_DATA[cardId].description:"해석 준비 중"; assistantInterpretationHTML+=`<img src="${ciu}" alt="${cdn}" class="chat-embedded-image"><div class="interpretation-text" style="text-align:center;font-size:0.9em;margin-bottom:10px;"><b>${index+1}. ${cdn}</b></div><div class="interpretation-text">${ci.replace(/\n/g,'<br>')}</div><br>`; });
                    assistantInterpretationHTML += `<div class="interpretation-text"><br>이상으로 카드 풀이를 마치겠습니다.</div></div>`;
                    rubyCommentary = `흠... 흥미로운 카드들이 나왔군요! ${userProfile.사용자애칭}님의 상황에 대해 좀 더 깊이 생각해볼 수 있겠어요.`;
                    if(userProfile.선택된타로카드들.length===1)rubyCommentary+=` 특히 첫 번째 카드는 현재 상황을 잘 보여주는 것 같네요.`; else if(userProfile.선택된타로카드들.length===3)rubyCommentary+=` 여러 카드의 조합을 보니 더욱 다각적인 해석이 가능할 것 같아요.`;
                    userProfile.시나리오 = "tarot_interpretation_done";
                } else { assistantInterpretationHTML = "선택된 카드가 없습니다."; rubyCommentary = "다음에 다시 카드를 뽑아보세요!"; }
                responseData.assistant_interpretation = assistantInterpretationHTML; responseData.assistantmsg = rubyCommentary;
            } else if (userMessageText === "2장더 (🦴-2)") { responseData.assistantmsg = "네, 추가로 <b>2장</b>의 카드를 더 선택해주세요."; responseData.tarocardview = true; responseData.cards_to_select = 2; responseData.sampleanswer = [{text:"선택 취소",value:"선택 취소"},{text:"운에 맡기기",value:"운에 맡기기"}]; responseData.user_profile_update = {"시나리오":"tarot_add_two_pick"}; }
            else if (userMessageText.startsWith("깊은상담")) { responseData.assistantmsg = `네, ${userProfile.사용자애칭}님을 위한 더 깊은 해석을 준비 중입니다... <br><br>...(AI 깊은 해석)...<br><br>도움이 되길 바랍니다.`; userProfile.시나리오 = "deep_interpretation_done"; }
            else if (userMessageText === "잘가") { responseData.assistantmsg = "네, 알겠습니다. 언제든 다시 찾아주세요! 좋은 하루 보내세요, " + userProfile.사용자애칭 + "님."; userProfile.시나리오 = "conversation_ended"; }
            else { let br = botKnowledgeBase[userMessageText]; if(!br){if(lowerUserMessage.includes("운세"))br=botKnowledgeBase["오늘의 운세 보여줘"];} if(!br)br=botKnowledgeBase["기본"]; responseData.assistantmsg=br.response; responseData.sampleanswer=(br.sampleAnswers||[]).map(a=>({text:a,value:a}));}
            resolve(responseData);
        });
    }

    function setUIInteractions(isProcessing, shouldFocusInput = false) {
        if (messageInput) messageInput.disabled = isProcessing;
        if (sendBtn) sendBtn.disabled = isProcessing || (messageInput && messageInput.value.trim() === '');
        sampleAnswersContainer.querySelectorAll('.sample-answer-btn').forEach(btn => btn.disabled = isProcessing);
        if (interactionButtonArea) interactionButtonArea.querySelectorAll('.interaction-btn').forEach(btn => btn.disabled = isProcessing); // 상호작용 버튼도 제어
        moreOptionsPanel.querySelectorAll('.panel-option').forEach(opt => opt.disabled = isProcessing);
        if (moreOptionsBtn) moreOptionsBtn.disabled = isProcessing;
        if (!isProcessing && shouldFocusInput && !isTarotSelectionActive && messageInput) messageInput.focus();
        else if (isTarotSelectionActive && messageInput && document.activeElement === messageInput) messageInput.blur();
    }

    async function processMessageExchange(messageText, source = 'input', options = {}) {
        const { clearBeforeSend = false, menuItemData = null } = options;
        if (messageText.trim() === '' || isLoadingBotResponse) return;
        let shouldClearChat = clearBeforeSend; if (!hasUserSentMessage && source !== 'system_init' && source !== 'system_internal_no_user_echo' && source !== 'panel_option_topic_reset') { shouldClearChat = true; hasUserSentMessage = true; userProfile.메뉴단계 = 2; }
        if (shouldClearChat) clearChatMessages();
        isLoadingBotResponse = true; if(sendBtn) sendBtn.classList.add('loading'); setUIInteractions(true, false); // 모든 UI 비활성화
        if (moreOptionsPanel.classList.contains('active')) { moreOptionsPanel.classList.remove('active'); moreOptionsBtn.classList.remove('active'); }
        if (source !== 'system_init_skip_user_message' && source !== 'system_internal_no_user_echo') await addMessage(messageText, 'user');
        if (source === 'input' && messageInput) { messageInput.value = ''; adjustTextareaHeight(); }

        let bonesToConsume = 0; let insufficientBonesMessage = null; let currentActionRequiresBones = false;
        if (messageText === "3장 (🦴-2)") { bonesToConsume = 2; currentActionRequiresBones = true; }
        else if (messageText === "2장더 (🦴-2)") { bonesToConsume = 2; currentActionRequiresBones = true; }
        else if (messageText.startsWith("깊은상담")) { if (userProfile.선택된타로카드들&&userProfile.선택된타로카드들.length===1&&messageText.includes("(🦴-3)")) { bonesToConsume = 3; currentActionRequiresBones = true;} else if (userProfile.선택된타로카드들&&userProfile.선택된타로카드들.length===3&&messageText.includes("(🦴-1)")) { bonesToConsume = 1; currentActionRequiresBones = true;} }

        if (currentActionRequiresBones && userProfile.bones < bonesToConsume) {
            if (messageText === "3장 (🦴-2)") insufficientBonesMessage = "이런! 뼈다귀가 부족해요.<br>한 장만 무료로 보시겠어요?";
            else if (messageText === "2장더 (🦴-2)") insufficientBonesMessage = "이런! 뼈다귀가 부족해요.<br>지금 상태로 깊은 상담을 진행할까요?";
            else if (messageText.startsWith("깊은상담")) insufficientBonesMessage = "이런! 뼈다귀가 부족해요.<br>다른 도움이 필요하신가요?";
            await addMessage(insufficientBonesMessage, 'bot'); let bif = [];
            if (messageText === "3장 (🦴-2)") { bif.push({ text: "1장 (무료)", value: "1장 (무료)" }); bif.push({ text: "다음에 할게요", value: "다음에 할게요" }); }
            else if (messageText === "2장더 (🦴-2)") { bif.push({ text: `깊은상담 (🦴-3)`, value: `깊은상담 (🦴-3)`, isPaid: true }); bif.push({ text: "다음에 할게요", value: "다음에 할게요" }); }
            else if (messageText.startsWith("깊은상담")) { bif.push({ text: "괜찮아요", value: "괜찮아요" }); bif.push({ text: "뼈다귀는?", value: "뼈다귀는 어떻게 얻나요?" }); }
            updateInteractionButtons(bif); updateSampleAnswers([], true);
            isLoadingBotResponse = false; if(sendBtn) sendBtn.classList.remove('loading'); setUIInteractions(false, (source === 'input' && !isTarotSelectionActive)); return;
        }
        try {
            const botApiResponse = await simulateBotResponse(messageText);
            if (botApiResponse.user_profile_update) { for (const key in botApiResponse.user_profile_update) if (key !== "bones" && botApiResponse.user_profile_update[key] !== null && botApiResponse.user_profile_update[key] !== undefined && botApiResponse.user_profile_update[key] !== "없음") userProfile[key] = botApiResponse.user_profile_update[key]; if (Object.keys(botApiResponse.user_profile_update).some(k => k !== "bones")) saveUserProfileToLocalStorage(userProfile); }
            if (botApiResponse.assistant_interpretation) await addMessage({ interpretationHtml: botApiResponse.assistant_interpretation, isAssistantInterpretation: true }, 'bot');
            if (botApiResponse.assistantmsg) await addMessage(botApiResponse.assistantmsg, 'bot');
            let interactionButtonsToShow = [];
            if (userProfile.시나리오 === "ask_card_count") { interactionButtonsToShow = [{ text: "1장 (무료)", value: "1장 (무료)" }, { text: "3장 (🦴-2)", value: "3장 (🦴-2)", isPaid: true }]; }
            else if (userProfile.시나리오 === "tarot_interpretation_done") { if (userProfile.선택된타로카드들 && userProfile.선택된타로카드들.length === 1) interactionButtonsToShow = [{ text: "2장더 (🦴-2)", value: "2장더 (🦴-2)", isPaid: true }, { text: `깊은상담 (🦴-3)`, value: `깊은상담 (🦴-3)`, isPaid: true }]; else if (userProfile.선택된타로카드들 && userProfile.선택된타로카드들.length === 3) interactionButtonsToShow = [{ text: `깊은상담 (🦴-1)`, value: `깊은상담 (🦴-1)`, isPaid: true }, { text: "잘가", value: "잘가" }]; }
            else if (userProfile.시나리오 === "deep_interpretation_done" || userProfile.시나리오 === "conversation_ended") { if (userProfile.시나리오 === "deep_interpretation_done") interactionButtonsToShow.push({ text: "잘가", value: "잘가" }); }
            if (interactionButtonsToShow.length > 0) { updateInteractionButtons(interactionButtonsToShow); updateSampleAnswers([], true); } else { updateInteractionButtons([]); updateSampleAnswers(botApiResponse.sampleanswer || [], false); }
            if (botApiResponse.tarocardview && botApiResponse.cards_to_select > 0) {
                let consumeNow = 0; if (messageText === "3장 (🦴-2)" && userProfile.bones >= 2) consumeNow = 2; else if (messageText === "2장더 (🦴-2)" && userProfile.bones >= 2) consumeNow = 2;
                if(consumeNow > 0) { userProfile.bones -= consumeNow; updateBoneCountDisplay(); saveUserProfileToLocalStorage(userProfile); }
                if (messageInput && document.activeElement === messageInput) messageInput.blur(); let ctb = userProfile.tarotbg || 'default.png'; if (menuItemData && menuItemData.tarotbg) { ctb = menuItemData.tarotbg; userProfile.tarotbg = ctb; saveUserProfileToLocalStorage(userProfile); } showTarotSelectionUI(botApiResponse.cards_to_select, ctb);
            }
        } catch (error) { console.error("[ProcessExchange] 오류 발생:", error); await addMessage("죄송합니다. 응답 중 오류가 발생했습니다.", 'system'); const fsa = (typeof initialBotMessage !== 'undefined' && initialBotMessage.sampleAnswers) ? initialBotMessage.sampleAnswers : ["도움말"]; updateSampleAnswers(fsa.map(a=>({text:a,value:a})), false); updateInteractionButtons([]); }
        finally { isLoadingBotResponse = false; if(sendBtn) sendBtn.classList.remove('loading'); setUIInteractions(false, (source === 'input' && !isTarotSelectionActive)); }
    }

    function showTarotSelectionUI(cardsToPick, backgroundFileName) {
        if (!tarotSelectionOverlay || !tarotCardCarousel || !tarotCardInfo || !tarotSelectionConfirmBtn) return;
        if (messageInput && document.activeElement === messageInput) messageInput.blur();
        tarotSelectionOverlay.style.backgroundImage = `url('img/tarot/bg/${backgroundFileName}')`;
        cardsToSelectCount = cardsToPick; selectedTarotCardIndices = [];
        populateTarotCarousel(); updateTarotSelectionInfo();
        tarotSelectionConfirmBtn.disabled = true; tarotSelectionOverlay.classList.add('active');
        isTarotSelectionActive = true; document.body.style.overflow = 'hidden';
        setupCarouselDragScroll(); tarotCardCarousel.addEventListener('scroll', applyCarouselPerspective);
    }

    function hideTarotSelectionUI() {
        if (!tarotSelectionOverlay) return;
        tarotSelectionOverlay.classList.remove('active'); isTarotSelectionActive = false; document.body.style.overflow = '';
        if (tarotCardCarousel) { tarotCardCarousel.removeEventListener('mousedown', handleCarouselMouseDown); tarotCardCarousel.removeEventListener('scroll', applyCarouselPerspective); }
        document.removeEventListener('mousemove', handleCarouselMouseMove); document.removeEventListener('mouseup', handleCarouselMouseUp); document.removeEventListener('mouseleave', handleCarouselMouseLeave);
    }

    function populateTarotCarousel() {
        if (!tarotCardCarousel) return; tarotCardCarousel.innerHTML = ''; const fragment = document.createDocumentFragment();
        for (let i = 0; i < TOTAL_CARDS_IN_DECK; i++) { const cardItem = document.createElement('div'); cardItem.className = 'tarot-card-item'; cardItem.dataset.index = i; const img = document.createElement('img'); img.src = 'img/tarot/card_back.png'; img.alt = `타로 카드 ${i + 1}`; cardItem.appendChild(img); cardItem.addEventListener('click', (e) => handleTarotCardClick(e, i)); fragment.appendChild(cardItem); }
        tarotCardCarousel.appendChild(fragment);
        requestAnimationFrame(() => { if (tarotCardCarousel.firstElementChild) { const cardWidth = tarotCardCarousel.firstElementChild.offsetWidth; const effectiveCardSpacing = cardWidth + parseInt(getComputedStyle(tarotCardCarousel.firstElementChild).marginLeft) + parseInt(getComputedStyle(tarotCardCarousel.firstElementChild).marginRight); const middleCardIndex = Math.floor(TOTAL_CARDS_IN_DECK / 2); const initialScroll = (middleCardIndex * effectiveCardSpacing) - (tarotCardCarouselContainer.offsetWidth / 2) + (effectiveCardSpacing / 2); tarotCardCarousel.scrollLeft = initialScroll; applyCarouselPerspective(); } });
    }

    function handleTarotCardClick(event, cardIndex) {
        if (isLoadingBotResponse) return; const cardElement = event.currentTarget; const indexInSelected = selectedTarotCardIndices.indexOf(cardIndex);
        if (indexInSelected > -1) { selectedTarotCardIndices.splice(indexInSelected, 1); cardElement.classList.remove('selected'); }
        else if (selectedTarotCardIndices.length < cardsToSelectCount) { selectedTarotCardIndices.push(cardIndex); cardElement.classList.add('selected'); }
        else return;
        updateTarotSelectionInfo(); tarotSelectionConfirmBtn.disabled = selectedTarotCardIndices.length !== cardsToSelectCount;
    }

    function updateTarotSelectionInfo() { if (!tarotCardInfo) return; tarotCardInfo.textContent = `${selectedTarotCardIndices.length}장 선택됨 / 총 ${cardsToSelectCount}장 선택하세요`; }

    async function handleTarotSelectionConfirm() {
        if (selectedTarotCardIndices.length !== cardsToSelectCount) return;
        const availableCardIds = [...ALL_TAROT_CARD_IDS]; let newlyChosenCardIds = [];
        for (let i = 0; i < cardsToSelectCount; i++) { if (availableCardIds.length === 0) break; let currentDeck = [...availableCardIds]; if (userProfile.선택된타로카드들 && userProfile.선택된타로카드들.length > 0) currentDeck = currentDeck.filter(id => !userProfile.선택된타로카드들.includes(id)); if (currentDeck.length === 0) { currentDeck = [...availableCardIds]; if (currentDeck.length === 0) break; } const randomIndex = Math.floor(Math.random() * currentDeck.length); const chosenId = currentDeck.splice(randomIndex, 1)[0]; newlyChosenCardIds.push(chosenId); const indexInAvailable = availableCardIds.indexOf(chosenId); if (indexInAvailable > -1) availableCardIds.splice(indexInAvailable, 1); }
        if (userProfile.시나리오 === "tarot_add_two_pick" && userProfile.선택된타로카드들) userProfile.선택된타로카드들.push(...newlyChosenCardIds);
        else userProfile.선택된타로카드들 = newlyChosenCardIds;
        newlyChosenCardIds.forEach(cardId => { if (!userProfile.지금까지수집된타로카드.includes(cardId)) userProfile.지금까지수집된타로카드.push(cardId); });
        saveUserProfileToLocalStorage(userProfile); hideTarotSelectionUI();
        await processMessageExchange("카드 선택 완료", 'system_internal_no_user_echo');
    }

    function handleClearTarotSelection() { if (isLoadingBotResponse || !tarotCardCarousel) return; selectedTarotCardIndices = []; tarotCardCarousel.querySelectorAll('.tarot-card-item.selected').forEach(card => card.classList.remove('selected')); updateTarotSelectionInfo(); tarotSelectionConfirmBtn.disabled = true; }

    function handleRandomTarotSelection() {
        if (isLoadingBotResponse || !tarotCardCarousel || cardsToSelectCount <= 0) return; handleClearTarotSelection();
        const availableDeckIndices = Array.from({ length: TOTAL_CARDS_IN_DECK }, (_, i) => i); const newlySelectedIndices = [];
        for (let i = 0; i < cardsToSelectCount; i++) { if (availableDeckIndices.length === 0) break; const randomIndexInAvailable = Math.floor(Math.random() * availableDeckIndices.length); const selectedCardDeckIndex = availableDeckIndices.splice(randomIndexInAvailable, 1)[0]; newlySelectedIndices.push(selectedCardDeckIndex); const cardElement = tarotCardCarousel.querySelector(`.tarot-card-item[data-index="${selectedCardDeckIndex}"]`); if (cardElement) cardElement.classList.add('selected'); }
        selectedTarotCardIndices = newlySelectedIndices; updateTarotSelectionInfo();
        if (tarotSelectionConfirmBtn) tarotSelectionConfirmBtn.disabled = selectedTarotCardIndices.length !== cardsToSelectCount;
        if (selectedTarotCardIndices.length > 0 && tarotCardCarousel && tarotCardCarouselContainer) { const firstSelectedCardIndex = selectedTarotCardIndices[0]; const cardToScrollTo = tarotCardCarousel.querySelector(`.tarot-card-item[data-index="${firstSelectedCardIndex}"]`); if (cardToScrollTo) { const cardWidth = cardToScrollTo.offsetWidth; const cardStyle = getComputedStyle(cardToScrollTo); const marginLeft = parseInt(cardStyle.marginLeft, 10) || 0, marginRight = parseInt(cardStyle.marginRight, 10) || 0; const effectiveCardSpacing = cardWidth + marginLeft + marginRight; const targetScroll = (firstSelectedCardIndex * effectiveCardSpacing) - (tarotCardCarouselContainer.offsetWidth / 2) + (effectiveCardSpacing / 2); tarotCardCarousel.scrollTo({ left: targetScroll, behavior: 'smooth' }); setTimeout(applyCarouselPerspective, 350); } }
    }

    function applyCarouselPerspective() {
        if (!tarotCardCarousel || !tarotCardCarousel.children.length) return; const cards = Array.from(tarotCardCarousel.children); const carouselRect = tarotCardCarousel.getBoundingClientRect(); const carouselCenterX = carouselRect.left + carouselRect.width / 2; const perspectiveValue = tarotCardCarouselContainer.offsetWidth * 2; const zDepthFactor = cards[0].offsetWidth * 0.5; const rotateFactor = 0.20;
        cards.forEach(card => { const cardRect = card.getBoundingClientRect(); const cardCenterX = cardRect.left + cardRect.width / 2; const distanceFromCenter = cardCenterX - carouselCenterX; const rotateY = (distanceFromCenter / (carouselRect.width / 2)) * (cards[0].offsetWidth * rotateFactor) ; const translateZ = - (Math.abs(distanceFromCenter) / (carouselRect.width / 2)) * zDepthFactor; card.style.transform = `perspective(${perspectiveValue}px) translateX(0px) rotateY(${rotateY}deg) translateZ(${translateZ}px)`; });
    }

    function handleCarouselMouseDown(e) { if (!tarotCardCarousel) return; carouselScrollState.isDragging = true; carouselScrollState.startX = e.pageX - tarotCardCarousel.getBoundingClientRect().left; carouselScrollState.scrollLeftStart = tarotCardCarousel.scrollLeft; tarotCardCarousel.classList.add('dragging'); document.addEventListener('mousemove', handleCarouselMouseMove); document.addEventListener('mouseup', handleCarouselMouseUp); document.addEventListener('mouseleave', handleCarouselMouseLeave); }
    function handleCarouselMouseMove(e) { if (!carouselScrollState.isDragging || !tarotCardCarousel) return; e.preventDefault(); const x = e.pageX - tarotCardCarousel.getBoundingClientRect().left; const walk = (x - carouselScrollState.startX) * 2; tarotCardCarousel.scrollLeft = carouselScrollState.scrollLeftStart - walk; }
    function handleCarouselMouseUp() { if (!tarotCardCarousel) return; carouselScrollState.isDragging = false; tarotCardCarousel.classList.remove('dragging'); document.removeEventListener('mousemove', handleCarouselMouseMove); document.removeEventListener('mouseup', handleCarouselMouseUp); document.removeEventListener('mouseleave', handleCarouselMouseLeave); }
    function handleCarouselMouseLeave(e) { if (carouselScrollState.isDragging) handleCarouselMouseUp(); }
    function setupCarouselDragScroll() { if (!tarotCardCarousel) return; tarotCardCarousel.removeEventListener('mousedown', handleCarouselMouseDown); tarotCardCarousel.addEventListener('mousedown', handleCarouselMouseDown); }

    function openModal(modalId) {
        const modal = document.getElementById(modalId); if (modal) { if (modalId === 'syncTypeModal') { if (userProfile) generateSyncTypeData(); updateSyncTypeModal(); } else if (modalId === 'tarotCollectionModal') updateTarotCollectionModal(); modal.style.display = 'flex'; modal.addEventListener('click', closeModalOnOutsideClick); } else alert(`모달 "${modalId}"을(를) 찾을 수 없습니다.`); if (moreOptionsPanel.classList.contains('active')) { moreOptionsPanel.classList.remove('active'); moreOptionsBtn.classList.remove('active'); }
    }
    function closeModal(modalId) { const modal = document.getElementById(modalId); if (modal) { modal.style.display = 'none'; modal.removeEventListener('click', closeModalOnOutsideClick); } }
    window.closeModal = closeModal;
    function closeModalOnOutsideClick(event) { if (event.target === this) closeModal(this.id); }

    function updateSyncTypeModal(tabId = 'overview') {
        const overviewContent = document.querySelector('.sync-type-overview-content'); const imageContainer = document.querySelector('.sync-type-image-container'); const customLegendArea = document.querySelector('.overview-custom-legend-area');
        if (!userProfile || !syncTypeDescription || !syncTypeTabsContainer || Object.keys(syncTypeDataStore).length === 0 || !overviewContent || !imageContainer || !customLegendArea) { if(syncTypeDescription) syncTypeDescription.innerHTML = `<p>정보 표시 불가.</p>`; return; }
        const dataForTab = syncTypeDataStore[tabId]; if (!dataForTab) { syncTypeDescription.innerHTML = `<p>탭(${tabId}) 정보 없음.</p>`; customLegendArea.innerHTML = ''; if (tabId === 'overview') { overviewContent.style.display = 'flex'; imageContainer.style.display = 'none'; drawRadarChart('combinedRadarChart', [], []); } else { overviewContent.style.display = 'none'; imageContainer.style.display = 'block'; if(syncTypeMainImage) { syncTypeMainImage.src = "img/sync_type/default.png"; syncTypeMainImage.alt = "기본 이미지"; }} return; }
        syncTypeDescription.innerHTML = `<p>${dataForTab.text ? dataForTab.text.replace(/\n/g, "<br>") : "설명 없음."}</p>`; customLegendArea.innerHTML = '';
        if (tabId === 'overview') { overviewContent.style.display = 'flex'; imageContainer.style.display = 'none'; if (dataForTab.chartData && dataForTab.chartData.datasets && dataForTab.chartData.datasets.length > 0) drawRadarChart('combinedRadarChart', dataForTab.chartData.labels, dataForTab.chartData.datasets); else { const cc = document.getElementById('combinedRadarChart'); if (cc) { const ctx = cc.getContext('2d'); ctx.clearRect(0,0,cc.width,cc.height); }} if (dataForTab.customLegend && dataForTab.customLegend.length > 0) { dataForTab.customLegend.forEach(item => { const lid = document.createElement('div'); lid.className = 'custom-legend-item'; const cb = document.createElement('span'); cb.className = 'custom-legend-color-box'; cb.style.backgroundColor = item.color; lid.appendChild(cb); const ts = document.createElement('span'); ts.className = 'custom-legend-text'; ts.textContent = item.text; lid.appendChild(ts); customLegendArea.appendChild(lid); }); }
        } else { overviewContent.style.display = 'none'; imageContainer.style.display = 'block'; if (syncTypeMainImage) { syncTypeMainImage.src = dataForTab.image || "img/sync_type/default.png"; syncTypeMainImage.alt = `${tabId} 이미지`; } }
        syncTypeTabsContainer.querySelectorAll('.sync-tab-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabId));
    }

    function updateTarotCollectionModal() {
        if (!userProfile || !tarotCollectedCountEl || !tarotTotalCountEl || !tarotGaugeFillEl || !tarotCardGridEl || typeof TAROT_CARD_DATA === 'undefined') return;
        const collectedCards = userProfile.지금까지수집된타로카드 || []; const collectedCount = collectedCards.length; tarotCollectedCountEl.textContent = collectedCount; tarotTotalCountEl.textContent = TOTAL_TAROT_CARDS; const percentage = TOTAL_TAROT_CARDS > 0 ? (collectedCount / TOTAL_TAROT_CARDS) * 100 : 0; tarotGaugeFillEl.style.width = `${percentage}%`; tarotCardGridEl.innerHTML = '';
        ALL_TAROT_CARD_IDS.forEach(cardId => { const cardItem = document.createElement('div'); cardItem.className = 'tarot-card-item'; const isCollected = collectedCards.includes(cardId); if (!isCollected) cardItem.classList.add('not-collected'); const isReversed = cardId.endsWith('_reversed'); if (isReversed) cardItem.classList.add('reversed-card'); const img = document.createElement('img'); const imageName = isReversed ? cardId.replace('_reversed', '_upright') : cardId; img.src = `img/tarot/${imageName}.png`; const cardDataForAlt = TAROT_CARD_DATA[cardId] || { name: cardId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), description: "정보 없음" }; img.alt = cardDataForAlt.name; cardItem.appendChild(img); cardItem.addEventListener('click', (event) => { hideTooltip(); let tooltipInfo; if (isCollected) tooltipInfo = { name: (TAROT_CARD_DATA[cardId] || cardDataForAlt).name, description: (TAROT_CARD_DATA[cardId] || {description: "상세 정보 준비 중..."}).description }; else tooltipInfo = { name: "미수집 카드", description: "아직 수집되지 않은 카드입니다." }; showTooltip(tooltipInfo, event.currentTarget); }); tarotCardGridEl.appendChild(cardItem); });
    }

    let activeTooltip = null; let tooltipTimeoutId = null;
    function showTooltip(cardInfo, clickedElement) { hideTooltip(); if (tooltipTimeoutId) { clearTimeout(tooltipTimeoutId); tooltipTimeoutId = null; } const tooltipElement = document.createElement('div'); tooltipElement.className = 'tooltip'; const nameElement = document.createElement('div'); nameElement.className = 'tooltip-name'; nameElement.textContent = cardInfo.name; tooltipElement.appendChild(nameElement); if (cardInfo.description) { const descriptionElement = document.createElement('div'); descriptionElement.className = 'tooltip-description'; descriptionElement.textContent = cardInfo.description; tooltipElement.appendChild(descriptionElement); } clickedElement.appendChild(tooltipElement); activeTooltip = tooltipElement; const cardWidth = clickedElement.offsetWidth; activeTooltip.style.maxWidth = `${cardWidth * 0.9}px`; requestAnimationFrame(() => { if (!activeTooltip) return; activeTooltip.classList.add('visible'); }); tooltipTimeoutId = setTimeout(hideTooltip, 5000); }
    function hideTooltip() { if (tooltipTimeoutId) { clearTimeout(tooltipTimeoutId); tooltipTimeoutId = null; } if (activeTooltip && activeTooltip.parentNode) { activeTooltip.classList.remove('visible'); const currentActiveTooltip = activeTooltip; const transitionDuration = parseFloat(getComputedStyle(currentActiveTooltip).transitionDuration) * 1000 || 200; setTimeout(() => { if (activeTooltip === currentActiveTooltip && currentActiveTooltip.parentNode && !currentActiveTooltip.classList.contains('visible')) { currentActiveTooltip.remove(); if (activeTooltip === currentActiveTooltip) activeTooltip = null; }}, transitionDuration); } else if (activeTooltip) activeTooltip = null; }

    const menuConfigurations = { "main_menu_stage1": [ { groupTitle: "타로 선택", items: [ { text: "오늘의 운세", actionType: "SUB_MENU", actionValue: "submenu_fortune_stage1", iconName: "today" }, { text: "연애상담", actionType: "SUB_MENU", actionValue: "submenu_love_counsel_stage1", iconName: "love" } ] }, { groupTitle: "특별한 요소", items: [ { text: "싱크타입", actionType: "MODAL", actionValue: "syncTypeModal", iconName: "sync" }, { text: "타로콜렉션", actionType: "MODAL", actionValue: "tarotCollectionModal", iconName: "collection" } ] }, { groupTitle: "시스템 요소", items: [ { text: "소셜로그인", actionType: "MODAL", actionValue: "socialLoginModal", iconName: "social" } ] } ], "submenu_fortune_stage1": [ { items: [ { text: "오늘의 운세 (보기)", actionType: "CHAT_MESSAGE", actionValue: "오늘의 운세 보여줘", iconName: "view", isTarotRelated: true, tarotbg: "fortune_bg_celestial.png" }, { text: "오늘 뭐먹지?", actionType: "CHAT_MESSAGE", actionValue: "오늘 뭐 먹을지 추천해줘", iconName: "food", isTarotRelated: true, tarotbg: "food_choice_bg_rustic.png" }, { text: "뒤로 가기", actionType: "BACK_MENU", iconName: "back" } ] } ], "submenu_love_counsel_stage1": [ { items: [ { text: "썸타는걸까?", actionType: "CHAT_MESSAGE", actionValue: "썸인지 아닌지 알려줘", iconName: "heart", isTarotRelated: true, tarotbg: "love_썸_bg.png" }, { text: "그 사람 마음이 궁금해", actionType: "CHAT_MESSAGE", actionValue: "그 사람의 마음을 알고 싶어", iconName: "mind", isTarotRelated: true, tarotbg: "love_mind_bg.png" }, { text: "뒤로 가기", actionType: "BACK_MENU", iconName: "back" } ] } ], "main_menu_stage2": [ { groupTitle: "상담 관리", items: [ { text: "새상담 시작", actionType: "ALERT", actionValue: "새상담 시작 기능은 아직 준비 중입니다.", iconName: "new_chat" } ] }, { groupTitle: "특별한 요소", items: [ { text: "싱크타입", actionType: "MODAL", actionValue: "syncTypeModal", iconName: "sync" }, { text: "타로콜렉션", actionType: "MODAL", actionValue: "tarotCollectionModal", iconName: "collection" } ] }, { groupTitle: "시스템 요소", items: [ { text: "소셜로그인", actionType: "MODAL", actionValue: "socialLoginModal", iconName: "social" } ] } ], };
    function populateMoreOptionsPanel(menuKey, previousActionType = null) { if (previousActionType === 'SUB_MENU' && currentPanelMenuKey !== menuKey) menuNavigationHistory.push(currentPanelMenuKey); currentPanelMenuKey = menuKey; moreOptionsPanel.innerHTML = ''; const menuGroups = menuConfigurations[menuKey]; if (!menuGroups || !Array.isArray(menuGroups)) { const e = document.createElement('button'); e.className = 'panel-option'; e.textContent = '메뉴 구성 오류'; e.disabled = true; moreOptionsPanel.appendChild(e); return; } menuGroups.forEach((group, groupIndex) => { if (group.groupTitle) { const gtd = document.createElement('div'); gtd.className = 'panel-menu-group-title'; gtd.textContent = group.groupTitle; moreOptionsPanel.appendChild(gtd); } if (group.items && Array.isArray(group.items)) { group.items.forEach(item => { const ob = document.createElement('button'); ob.className = 'panel-option'; if (item.iconName) { const ii = document.createElement('img'); ii.className = 'menu-icon-img'; ii.src = `img/icon/${item.iconName}.png`; ii.alt = ''; ob.appendChild(ii); } ob.appendChild(document.createTextNode(item.text)); ob.dataset.actionType = item.actionType; if (item.actionValue !== undefined) ob.dataset.actionValue = item.actionValue; if (item.isTarotRelated !== undefined) ob.dataset.isTarotRelated = String(item.isTarotRelated); if (item.tarotbg !== undefined) ob.dataset.tarotbg = item.tarotbg; ob.disabled = isLoadingBotResponse; moreOptionsPanel.appendChild(ob); }); } if (groupIndex < menuGroups.length - 1) { const d = document.createElement('div'); d.className = 'panel-menu-group-divider'; moreOptionsPanel.appendChild(d); } }); }

    moreOptionsBtn.addEventListener('click', () => { if (!userProfile) { alert("오류: 사용자 프로필 로드 불가."); return; } const panelIsActive = moreOptionsPanel.classList.contains('active'); const mainMenuKey = `main_menu_stage${userProfile.메뉴단계}`; if (!panelIsActive) { menuNavigationHistory = []; populateMoreOptionsPanel(mainMenuKey, null); moreOptionsPanel.classList.add('active'); moreOptionsBtn.classList.add('active'); moreOptionsPanel.style.bottom = `${chatInputArea.offsetHeight - 1}px`; } else { moreOptionsPanel.classList.remove('active'); moreOptionsBtn.classList.remove('active'); } });
    moreOptionsPanel.addEventListener('click', async (e) => { const targetOption = e.target.closest('.panel-option'); if (targetOption && !targetOption.disabled && !isLoadingBotResponse) { e.stopPropagation(); const actionType = targetOption.dataset.actionType, actionValue = targetOption.dataset.actionValue; const isTarotRelatedMenu = targetOption.dataset.isTarotRelated === 'true', tarotBgFromMenu = targetOption.dataset.tarotbg; switch (actionType) { case 'SUB_MENU': populateMoreOptionsPanel(actionValue, actionType); break; case 'MODAL': openModal(actionValue); break; case 'CHAT_MESSAGE': moreOptionsPanel.classList.remove('active'); moreOptionsBtn.classList.remove('active'); const msgOpts = {}; if (tarotBgFromMenu) msgOpts.menuItemData = { tarotbg: tarotBgFromMenu }; if (hasUserSentMessage && isTarotRelatedMenu) { if (confirm("현재 상담 주제가 변경됩니다. 새로운 주제로 진행할까요?")) await processMessageExchange(actionValue, 'panel_option_topic_reset', { ...msgOpts, clearBeforeSend: true }); else return; } else await processMessageExchange(actionValue, 'panel_option', msgOpts); break; case 'ALERT': alert(actionValue); moreOptionsPanel.classList.remove('active'); moreOptionsBtn.classList.remove('active'); break; case 'BACK_MENU': if (menuNavigationHistory.length > 0) populateMoreOptionsPanel(menuNavigationHistory.pop(), actionType); else populateMoreOptionsPanel(`main_menu_stage${userProfile.메뉴단계}`, actionType); break; default: moreOptionsPanel.classList.remove('active'); moreOptionsBtn.classList.remove('active'); } } });
    if (tarotCardScrollWrapper) tarotCardScrollWrapper.addEventListener('scroll', () => { if (activeTooltip) hideTooltip(); });
    if (syncTypeTabsContainer) syncTypeTabsContainer.addEventListener('click', (e) => { const t = e.target.closest('.sync-tab-btn'); if (t && !t.classList.contains('active')) updateSyncTypeModal(t.dataset.tab); });
    async function handleSendMessage() { const mt = messageInput.value.trim(); await processMessageExchange(mt, 'input'); }
    sendBtn.addEventListener('click', handleSendMessage);
    messageInput.addEventListener('keypress', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } });
    messageInput.addEventListener('input', () => { adjustTextareaHeight(); if (!isLoadingBotResponse && sendBtn) sendBtn.disabled = messageInput.value.trim() === ''; });
    sampleAnswersContainer.addEventListener('click', async (e) => { const tb = e.target.closest('.sample-answer-btn'); if (tb && !tb.disabled && !isLoadingBotResponse) await processMessageExchange(tb.dataset.answer, 'sample_button'); });
    
    if (interactionButtonArea) {
        interactionButtonArea.addEventListener('click', async (e) => {
            const targetButton = e.target.closest('.interaction-btn');
            if (targetButton && !targetButton.disabled && !isLoadingBotResponse) {
                const buttonValue = targetButton.dataset.value || targetButton.textContent.trim();
                let buttonTextContent = "";
                targetButton.childNodes.forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE) buttonTextContent += node.textContent.trim();
                    else if (node.nodeType === Node.ELEMENT_NODE && !node.classList.contains('recommend-tooltip')) buttonTextContent += node.textContent.trim();
                });
                buttonTextContent = buttonTextContent.trim();
                console.log(`[InteractionButton] 클릭: "${buttonValue}" (표시 텍스트: "${buttonTextContent}")`);
                await processMessageExchange(buttonValue, 'interaction_button'); 
            }
        });
    }

    document.addEventListener('click', (e) => { if (activeTooltip && !activeTooltip.contains(e.target) && !e.target.closest('.tarot-card-item')) hideTooltip(); if (moreOptionsPanel.classList.contains('active') && !moreOptionsBtn.contains(e.target) && !moreOptionsPanel.contains(e.target)) { moreOptionsPanel.classList.remove('active'); moreOptionsBtn.classList.remove('active'); } }, true);
    let resizeTimeout; window.addEventListener('resize', () => { clearTimeout(resizeTimeout); resizeTimeout = setTimeout(() => { adjustChatMessagesPadding(); if (moreOptionsPanel.classList.contains('active')) moreOptionsPanel.style.bottom = `${chatInputArea.offsetHeight - 1}px`; }, 100); });

    async function initializeChat() {
        console.log("[App] 초기화 시작.");
        initializeUserProfile();
        if (typeof ALL_SYNC_TYPES === 'undefined' || typeof ALL_NEBULAS === 'undefined' || typeof TAROT_CARD_DATA === 'undefined') {
            const missingData = [ typeof ALL_SYNC_TYPES === 'undefined' ? 'ALL_SYNC_TYPES' : null, typeof ALL_NEBULAS === 'undefined' ? 'ALL_NEBULAS' : null, typeof TAROT_CARD_DATA === 'undefined' ? 'TAROT_CARD_DATA' : null ].filter(Boolean).join(', ');
            console.error(`[App] 필수 데이터(${missingData}) 누락.`);
            // 초기화 단계에서 addMessage 사용 시 오류 발생 가능성 있으므로 주석 처리 또는 다른 방식으로 사용자 알림
            // await addMessage(`시스템 설정 오류 (${missingData} 누락)`, 'system');
        } else { generateSyncTypeData(); }
        adjustTextareaHeight(); if(sendBtn) sendBtn.disabled = true; if(messageInput) messageInput.disabled = true; if(moreOptionsBtn) moreOptionsBtn.disabled = true;
        requestAnimationFrame(adjustChatMessagesPadding);
        if (tarotSelectionConfirmBtn) tarotSelectionConfirmBtn.addEventListener('click', handleTarotSelectionConfirm);
        if (tarotClearSelectionBtn) tarotClearSelectionBtn.addEventListener('click', handleClearTarotSelection);
        if (tarotRandomSelectBtn) tarotRandomSelectBtn.addEventListener('click', handleRandomTarotSelection);
        isLoadingBotResponse = true; setUIInteractions(true, false);
        if (typeof initialBotMessage === 'undefined' || !initialBotMessage.text || !initialBotMessage.sampleAnswers) {
            console.error("[App] initialBotMessage 정의 오류."); isLoadingBotResponse = false; setUIInteractions(false, false); if(messageInput) messageInput.disabled = false; if(moreOptionsBtn) moreOptionsBtn.disabled = false; return;
        }
        try { await addMessage(initialBotMessage.text, 'bot'); updateSampleAnswers(initialBotMessage.sampleAnswers.map(ans => ({text: ans, value: ans})), false); }
        catch (error) { console.error("[App] 초기 메시지 표시 중 오류:", error); }
        isLoadingBotResponse = false; setUIInteractions(false, false);
        if(messageInput) { messageInput.disabled = false; if(sendBtn) sendBtn.disabled = messageInput.value.trim() === ''; }
        if(moreOptionsBtn) moreOptionsBtn.disabled = false;
        console.log("[App] 초기화 완료.");
    }
    initializeChat();
});