document.addEventListener('DOMContentLoaded', () => {
    // --- DOM 요소 ---
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const sampleAnswersContainer = document.getElementById('sampleAnswersContainer');
    const moreOptionsBtn = document.getElementById('moreOptionsBtn');
    const moreOptionsPanel = document.getElementById('moreOptionsPanel');
    const chatInputArea = document.querySelector('.chat-input-area'); 

    // 모달 내부 요소들
    const syncTypeMainImage = document.getElementById('syncTypeMainImage');
    const syncTypeDescription = document.getElementById('syncTypeDescription');
    const syncTypeTabsContainer = document.querySelector('.sync-type-tabs');

    const tarotCollectedCountEl = document.getElementById('tarotCollectedCount');
    const tarotTotalCountEl = document.getElementById('tarotTotalCount');
    const tarotGaugeFillEl = document.getElementById('tarotGaugeFill');
    const tarotCardGridEl = document.getElementById('tarotCardGrid');
    const tarotCardScrollWrapper = document.getElementById('tarotCardScrollWrapper');


    // --- 전역 변수 및 상수 ---
    let userProfile;
    let isLoadingBotResponse = false;
    const TYPING_CHUNK_DELAY_MS = 30;
    let currentPanelMenuKey = 'main'; 
    let menuNavigationHistory = []; 

    const initialBotMessage = {
        text: "안녕하세요! 무엇을 도와드릴까요?<br>아래에서 선택하거나 직접 입력해주세요.<br><b>도움말</b>이라고 입력하면 사용 가능한 명령어를 볼 수 있습니다.",
        sampleAnswers: ["오늘의 운세", "추천 메뉴", "날씨 알려줘"]
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

    const syncTypeData = {
        overview: { image: "img/sync_type/overview_default.png", text: "당신의 싱크타입에 대한 전반적인 분석입니다. 당신은 다면적인 성향을 가지고 있으며, 상황에 따라 유연하게 대처하는 능력이 돋보입니다. 때로는 내면의 목소리에 더 귀 기울일 필요가 있습니다." },
        nebula: { image: "img/sync_type/nebula_default.png", text: "당신은 [사용자소속성운] 성운에 속해 있습니다. 이 성운의 특징은 [성운 특징]이며, 당신이 이 성운에 속한 이유는 [사용자가성운에속한이유]입니다. 당신의 잠재력을 발휘하여 성운의 빛을 더욱 밝혀주세요." },
        syncTypeDetail: { image: "img/sync_type/type_default.png", text: "당신의 결정된 싱크타입은 [결정된싱크타입] ([맞춤싱크타입이름])입니다. 이 타입은 [싱크타입 설명] 특징을 가지며, 당신의 강점은 [강점], 보완할 점은 [보완점]입니다." }
    };

    function initializeUserProfile() {
        console.log("[UserProfile] 초기화 시작.");
        let defaultProfile = { "사용자이름": "테스트유저", "사용자애칭": "테스터", "사용자가좋아하는것": "코딩", "사용자의마음을아프게하는것": "버그", "사용자가싫어하는것": "미팅", "사용자의나이성별": "30대 비공개", "사용자의고민": "오늘 저녁 뭐먹지", "주관식질문1": null, "주관식답변1": null, "주관식질문2": null, "주관식답변2": null, "주관식질문3": null, "주관식답변3": null, "주관식질문4": null, "주관식답변4": null, "주관식질문5": null, "주관식답변5": null, "객관식질문과답변": [], "DISC_D_점수": 0, "DISC_I_점수": 0, "DISC_S_점수": 0, "DISC_C_점수": 0, "결정된싱크타입": "몽상가", "사용자소속성운": "오리온", "사용자가성운에속한이유": "창의적 사고", "맞춤싱크타입이름": "별을 쫓는 몽상가", "사용자의감정상태": "평온함", "선택된타로카드들": [], "지금까지수집된타로카드": ["major_00_fool_upright", "wands_01_ace_upright", "cups_02_two_reversed", "major_15_devil_upright", "swords_10_ten_reversed"], "시나리오": null, "메뉴단계": 1, "싱크타입단계": "결정됨" };
        userProfile = { ...defaultProfile }; 
        console.log("[UserProfile] 초기화 완료:", JSON.parse(JSON.stringify(userProfile)));
    }

    const menuConfigurations = {
        "main_menu_stage1": [ { groupTitle: "타로 선택", items: [ { text: "오늘의 운세", actionType: "SUB_MENU", actionValue: "submenu_fortune_stage1", iconName: "today" }, { text: "연애상담", actionType: "SUB_MENU", actionValue: "submenu_love_counsel_stage1", iconName: "love" } ] }, { groupTitle: "특별한 요소", items: [ { text: "싱크타입", actionType: "MODAL", actionValue: "syncTypeModal", iconName: "sync" }, { text: "타로콜렉션", actionType: "MODAL", actionValue: "tarotCollectionModal", iconName: "collection" } ] }, { groupTitle: "시스템 요소", items: [ { text: "소셜로그인", actionType: "MODAL", actionValue: "socialLoginModal", iconName: "social" } ] } ],
        "submenu_fortune_stage1": [ { items: [ { text: "오늘의 운세 (보기)", actionType: "CHAT_MESSAGE", actionValue: "오늘의 운세 보여줘", iconName: "view" }, { text: "오늘 뭐먹지?", actionType: "CHAT_MESSAGE", actionValue: "오늘 뭐 먹을지 추천해줘", iconName: "food" }, { text: "뒤로 가기", actionType: "BACK_MENU", iconName: "back" } ] } ],
        "submenu_love_counsel_stage1": [ { items: [ { text: "썸타는걸까?", actionType: "CHAT_MESSAGE", actionValue: "썸인지 아닌지 알려줘", iconName: "heart" }, { text: "그 사람 마음이 궁금해", actionType: "CHAT_MESSAGE", actionValue: "그 사람의 마음을 알고 싶어", iconName: "mind" }, { text: "뒤로 가기", actionType: "BACK_MENU", iconName: "back" } ] } ],
        "main_menu_stage2": [ { groupTitle: "상담 관리", items: [ { text: "새상담 시작", actionType: "ALERT", actionValue: "새상담 시작 기능은 아직 준비 중입니다.", iconName: "new_chat" } ] }, { groupTitle: "특별한 요소", items: [ { text: "싱크타입", actionType: "MODAL", actionValue: "syncTypeModal", iconName: "sync" }, { text: "타로콜렉션", actionType: "MODAL", actionValue: "tarotCollectionModal", iconName: "collection" } ] }, { groupTitle: "시스템 요소", items: [ { text: "소셜로그인", actionType: "MODAL", actionValue: "socialLoginModal", iconName: "social" } ] } ],
    };

    function adjustChatMessagesPadding() { if (!sampleAnswersContainer || !chatInputArea || !chatMessages) { console.error("[UIAdjust] adjustChatMessagesPadding 필수 DOM 요소 누락."); return; } const sampleAnswersHeight = sampleAnswersContainer.offsetHeight; const chatInputAreaHeight = chatInputArea.offsetHeight; const totalBottomAreaHeight = sampleAnswersHeight + chatInputAreaHeight; const extraPadding = 10; chatMessages.style.paddingBottom = `${totalBottomAreaHeight + extraPadding}px`; }
    function scrollToBottom() { chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: 'smooth' }); }
    function adjustTextareaHeight() { messageInput.style.height = 'auto'; let newHeight = messageInput.scrollHeight; const maxHeightStyle = getComputedStyle(messageInput).maxHeight; const maxHeight = maxHeightStyle && maxHeightStyle !== 'none' ? parseInt(maxHeightStyle) : Infinity; if (newHeight > maxHeight) { newHeight = maxHeight; messageInput.style.overflowY = 'auto'; } else { messageInput.style.overflowY = 'hidden'; } messageInput.style.height = `${newHeight}px`; }
    function sanitizeBotHtml(htmlString) { const tempDiv = document.createElement('div'); tempDiv.innerHTML = htmlString; const allowedTags = ['B', 'BR', 'STRONG']; function cleanNode(node) { if (node.nodeType === Node.TEXT_NODE) return document.createTextNode(node.textContent); if (node.nodeType === Node.ELEMENT_NODE) { if (allowedTags.includes(node.tagName.toUpperCase())) { const newNode = document.createElement(node.tagName.toLowerCase()); for (const childNode of Array.from(node.childNodes)) newNode.appendChild(cleanNode(childNode)); return newNode; } else { const fragment = document.createDocumentFragment(); for (const childNode of Array.from(node.childNodes)) fragment.appendChild(cleanNode(childNode)); return fragment; } } return document.createDocumentFragment(); } const fragment = document.createDocumentFragment(); Array.from(tempDiv.childNodes).forEach(child => fragment.appendChild(cleanNode(child))); const resultDiv = document.createElement('div'); resultDiv.appendChild(fragment); return resultDiv.innerHTML; }
    async function addMessage(text, type) { const messageDiv = document.createElement('div'); messageDiv.classList.add('message'); console.log(`[Message] '${type}' 메시지 추가 시작: "${text.substring(0,30)}..."`); return new Promise(async (resolveAllMessagesAdded) => { if (type === 'user') { messageDiv.classList.add('user-message'); messageDiv.textContent = text; chatMessages.appendChild(messageDiv); requestAnimationFrame(() => { adjustChatMessagesPadding(); scrollToBottom(); console.log("[Message] 사용자 메시지 DOM 추가 완료."); resolveAllMessagesAdded(); }); } else if (type === 'bot') { messageDiv.classList.add('bot-message'); chatMessages.appendChild(messageDiv); requestAnimationFrame(() => { adjustChatMessagesPadding(); scrollToBottom(); }); const sanitizedHtml = sanitizeBotHtml(text); const tempContainer = document.createElement('div'); tempContainer.innerHTML = sanitizedHtml; const typingChunks = []; function extractChunks(node) { if (node.nodeType === Node.TEXT_NODE) { const words = node.textContent.match(/\S+\s*|\S/g) || []; words.forEach(word => typingChunks.push({ type: 'text', content: word })); } else if (node.nodeType === Node.ELEMENT_NODE) { const tagName = node.tagName.toLowerCase(); if (tagName === 'b' || tagName === 'strong') { typingChunks.push({ type: 'open_tag', content: tagName }); Array.from(node.childNodes).forEach(extractChunks); typingChunks.push({ type: 'close_tag', content: tagName }); } else if (tagName === 'br') { typingChunks.push({ type: 'br' }); } else { Array.from(node.childNodes).forEach(extractChunks); } } } Array.from(tempContainer.childNodes).forEach(extractChunks); let currentElementContext = messageDiv; console.log(`[Message] 봇 메시지 타이핑 시작. 총 ${typingChunks.length} 청크.`); for (let i = 0; i < typingChunks.length; i++) { const chunk = typingChunks[i]; await new Promise(resolve => setTimeout(resolve, TYPING_CHUNK_DELAY_MS)); if (chunk.type === 'text') { const span = document.createElement('span'); span.className = 'message-text-chunk-animated'; span.textContent = chunk.content; currentElementContext.appendChild(span); } else if (chunk.type === 'open_tag') { const newTag = document.createElement(chunk.content); currentElementContext.appendChild(newTag); currentElementContext = newTag; } else if (chunk.type === 'close_tag') { if (currentElementContext.parentElement && currentElementContext.parentElement !== messageDiv.parentElement) { currentElementContext = currentElementContext.parentElement; } } else if (chunk.type === 'br') { currentElementContext.appendChild(document.createElement('br')); } if (i % 5 === 0 || i === typingChunks.length - 1) scrollToBottom(); }  console.log("[Message] 봇 메시지 타이핑 완료."); resolveAllMessagesAdded(); } else if (type === 'system') { messageDiv.classList.add('system-message'); messageDiv.textContent = text; chatMessages.appendChild(messageDiv); requestAnimationFrame(() => { adjustChatMessagesPadding(); scrollToBottom(); console.log("[Message] 시스템 메시지 DOM 추가 완료."); resolveAllMessagesAdded(); }); } }); }
    function updateSampleAnswers(answers = []) { console.log("[SampleAnswers] 업데이트 시작. 답변 개수:", answers.length); const existingButtons = Array.from(sampleAnswersContainer.querySelectorAll('.sample-answer-btn')); const buttonFadeOutDuration = 200; function addAndAnimateNewButtons() { sampleAnswersContainer.innerHTML = ''; if (answers.length > 0) { sampleAnswersContainer.classList.add('has-buttons'); answers.forEach((answerData, index) => { const button = document.createElement('button'); button.classList.add('sample-answer-btn'); const answerText = (typeof answerData === 'string') ? answerData : answerData.text; const answerValue = (typeof answerData === 'string') ? answerData : (answerData.value || answerData.text); button.textContent = answerText; button.dataset.answer = answerValue; button.style.animationDelay = `${index * 70}ms`; button.disabled = isLoadingBotResponse; sampleAnswersContainer.appendChild(button); }); } else { sampleAnswersContainer.classList.remove('has-buttons'); } requestAnimationFrame(adjustChatMessagesPadding); console.log("[SampleAnswers] 업데이트 완료."); } if (existingButtons.length > 0) { console.log("[SampleAnswers] 기존 버튼 페이드 아웃."); existingButtons.forEach(btn => btn.classList.add('fade-out')); setTimeout(addAndAnimateNewButtons, buttonFadeOutDuration); } else { addAndAnimateNewButtons(); } }
    const botKnowledgeBase = { "오늘의 운세 보여줘": { response: "오늘 당신의 운세는... <b>매우 긍정적</b>입니다! 새로운 시작을 하기에 좋은 날이에요. <br>자신감을 가지세요!", sampleAnswers: ["다른 운세", "고마워"] }, "오늘 뭐 먹을지 추천해줘": { response: "오늘은 <b>따뜻한 국물 요리</b> 어떠세요? 예를 들어, <b>김치찌개</b>나 <b>순두부찌개</b>도 좋겠네요!", sampleAnswers: ["김치찌개 레시피", "다른 추천"] }, "썸인지 아닌지 알려줘": { response: "상대방의 행동과 말투를 자세히 알려주시면, 제가 분석해볼게요! <br>예를 들어, '그 사람은 나에게 자주 웃어줘요.' 처럼요.", sampleAnswers: ["카톡 대화 분석해줘", "데이트 신청해도 될까?"] }, "그 사람의 마음을 알고 싶어": { response: "마음을 읽는 것은 어렵지만, 몇 가지 질문을 통해 추측해볼 수 있어요.<br>그 사람과 어떤 관계인가요?", sampleAnswers: ["친구 관계예요", "직장 동료예요"] }, "오늘의 운세가 궁금해요.": { response: "오늘의 운세입니다:<br><b>희망찬 하루!</b> 작은 노력들이 결실을 맺을 거예요.<br>자신감을 갖고 나아가세요.", sampleAnswers: ["다른 운세 보기", "오늘 날씨는?", "고마워"] }, "추천 메뉴 알려주세요.": { response: "오늘은 특별한 날인가요? <b>스테이크</b> 어떠세요?<br>아니면 가볍게 <b>샐러드 파스타</b>도 좋아요!", sampleAnswers: ["스테이크 맛집", "파스타 레시피", "다른 추천"] }, "날씨 알려줘.": { response: "현재 계신 지역의 날씨를 알려드릴까요?<br>아니면 특정 도시의 날씨가 궁금하신가요?", sampleAnswers: ["서울 날씨", "부산 날씨", "내 위치 날씨"] }, "도움말 보여주세요.": { response: "무엇을 도와드릴까요?<br>저는 <b>운세 보기</b>, <b>메뉴 추천</b>, <b>날씨 정보</b> 등을 제공할 수 있어요.<br>궁금한 것을 말씀해주세요!", sampleAnswers: ["오늘의 운세", "추천 메뉴", "날씨 알려줘"] }, "오늘의 운세": { response: "오늘의 운세입니다:<br><b>대박!</b> 원하는 모든 것을 이룰 수 있는 하루예요!<br>긍정적인 마음으로 도전해보세요.", sampleAnswers: ["추천 메뉴", "오늘 날씨 어때?", "고마워"] }, "추천 메뉴": { response: "점심 메뉴로는 <b>얼큰한 김치찌개</b> 어떠세요? 아니면 저녁으로 <b>부드러운 크림 파스타</b>도 좋겠네요!", sampleAnswers: ["김치찌개 레시피", "파스타 맛집 추천", "다른 거 없어?"] }, "날씨 알려줘": { response: "오늘 서울의 날씨는 <b>맑음</b>, 최고 기온 25도입니다. <br>외출하기 좋은 날씨네요!", sampleAnswers: ["미세먼지 정보", "내일 날씨는?", "고마워"] }, "기본": { response: "죄송해요, 잘 이해하지 못했어요. <br><b>도움말</b>이라고 입력하시면 제가 할 수 있는 일을 알려드릴게요.", sampleAnswers: ["도움말", "오늘의 운세", "추천 메뉴"] } };
    function simulateBotResponse(userMessageText) { console.log(`[BotResponse] "${userMessageText}"에 대한 응답 시뮬레이션 시작.`); return new Promise(resolve => { setTimeout(() => { let responseData = botKnowledgeBase[userMessageText]; if (!responseData) { const lowerUserMessage = userMessageText.toLowerCase(); if (lowerUserMessage.includes("운세")) responseData = botKnowledgeBase["오늘의 운세 보여줘"] || botKnowledgeBase["오늘의 운세가 궁금해요."]; else if (lowerUserMessage.includes("메뉴") || lowerUserMessage.includes("음식") || lowerUserMessage.includes("추천")) responseData = botKnowledgeBase["오늘 뭐 먹을지 추천해줘"] || botKnowledgeBase["추천 메뉴 알려주세요."]; else if (lowerUserMessage.includes("날씨")) responseData = botKnowledgeBase["날씨 알려줘."]; else if (lowerUserMessage.includes("도움") || lowerUserMessage.includes("help")) responseData = botKnowledgeBase["도움말 보여주세요."]; } if (!responseData) responseData = botKnowledgeBase["기본"]; console.log(`[BotResponse] 응답 데이터 준비 완료:`, responseData); resolve({ text: responseData.response, sampleAnswers: responseData.sampleAnswers }); }, 200 + Math.random() * 300); }); }
    function setUIInteractions(isProcessing, shouldFocusInput = false) { console.log(`[UI] 상호작용 상태 변경: isProcessing=${isProcessing}, shouldFocusInput=${shouldFocusInput}`); messageInput.disabled = false; sendBtn.disabled = isProcessing || messageInput.value.trim() === ''; const sampleButtons = sampleAnswersContainer.querySelectorAll('.sample-answer-btn'); sampleButtons.forEach(btn => btn.disabled = isProcessing); const panelOptions = moreOptionsPanel.querySelectorAll('.panel-option'); panelOptions.forEach(opt => opt.disabled = isProcessing); if (!isProcessing && shouldFocusInput) { console.log("[UI] 메시지 입력창 포커스 시도."); messageInput.focus(); } }
    async function processMessageExchange(messageText, source = 'input') { console.log(`[ProcessExchange] 시작. 메시지: "${messageText}", 소스: ${source}`); if (messageText.trim() === '' || isLoadingBotResponse) { console.log("[ProcessExchange] 조건 미충족으로 중단 (빈 메시지 또는 로딩 중)."); return; } isLoadingBotResponse = true; sendBtn.classList.add('loading'); setUIInteractions(true, false); if (moreOptionsPanel.classList.contains('active')) { console.log("[ProcessExchange] 더보기 패널 닫기."); moreOptionsPanel.classList.remove('active'); moreOptionsBtn.classList.remove('active'); } await addMessage(messageText, 'user'); if (source === 'input') { messageInput.value = ''; adjustTextareaHeight(); } try { const botResponse = await simulateBotResponse(messageText); await addMessage(botResponse.text, 'bot'); updateSampleAnswers(botResponse.sampleAnswers); } catch (error) { console.error("[ProcessExchange] 오류 발생:", error); await addMessage("죄송합니다. 응답 중 오류가 발생했습니다.", 'system'); updateSampleAnswers(initialBotMessage.sampleAnswers); } finally { isLoadingBotResponse = false; sendBtn.classList.remove('loading'); setUIInteractions(false, source === 'input'); console.log("[ProcessExchange] 완료."); } }
    async function handleSendMessage() { const messageText = messageInput.value.trim(); await processMessageExchange(messageText, 'input'); }

    // --- 툴팁 관련 변수 및 함수 ---
    let activeTooltip = null; 
    let tooltipTimeoutId = null; 

    function showTooltip(cardInfo, clickedElement) {
        hideTooltip(); 
        if (tooltipTimeoutId) {
            clearTimeout(tooltipTimeoutId);
            tooltipTimeoutId = null;
        }

        const tooltipElement = document.createElement('div');
        tooltipElement.className = 'tooltip';

        const nameElement = document.createElement('div');
        nameElement.className = 'tooltip-name';
        nameElement.textContent = cardInfo.name;
        tooltipElement.appendChild(nameElement);

        if (cardInfo.description) {
            const descriptionElement = document.createElement('div');
            descriptionElement.className = 'tooltip-description';
            descriptionElement.textContent = cardInfo.description;
            tooltipElement.appendChild(descriptionElement);
        }
        
        // 툴팁을 클릭된 카드 아이템(.tarot-card-item) 내부에 추가
        clickedElement.appendChild(tooltipElement);
        activeTooltip = tooltipElement;

        // 툴팁의 max-width를 카드 너비로 설정
        const cardWidth = clickedElement.offsetWidth;
        activeTooltip.style.maxWidth = `${cardWidth}px`;
        
        // CSS에서 position:absolute 및 위치(left, bottom, transform)가 설정되어 있음
        // JS에서는 visible 클래스만 추가하여 등장 애니메이션 트리거
        requestAnimationFrame(() => {
            if (!activeTooltip) return;
            activeTooltip.classList.add('visible');
        });

        console.log(`[Tooltip] 표시: "${cardInfo.name}" for element`, clickedElement);

        tooltipTimeoutId = setTimeout(() => {
            console.log("[Tooltip] 5초 경과, 자동 숨김 시도.");
            hideTooltip();
        }, 5000);
    }

    function hideTooltip() {
        if (tooltipTimeoutId) { 
            clearTimeout(tooltipTimeoutId);
            tooltipTimeoutId = null;
        }

        if (activeTooltip && activeTooltip.parentNode) {
            activeTooltip.classList.remove('visible');
            
            const currentActiveTooltip = activeTooltip; 
            const transitionDuration = parseFloat(getComputedStyle(currentActiveTooltip).transitionDuration) * 1000;

            if (transitionDuration > 0) {
                currentActiveTooltip.addEventListener('transitionend', function handleTransitionEnd() {
                    if (currentActiveTooltip.parentNode && activeTooltip === currentActiveTooltip && !currentActiveTooltip.classList.contains('visible')) {
                        currentActiveTooltip.remove();
                        if (activeTooltip === currentActiveTooltip) { 
                            activeTooltip = null;
                        }
                        console.log("[Tooltip] 트랜지션 후 숨김 및 제거 완료.");
                    }
                    currentActiveTooltip.removeEventListener('transitionend', handleTransitionEnd);
                });
            } else { 
                currentActiveTooltip.remove();
                if (activeTooltip === currentActiveTooltip) {
                    activeTooltip = null;
                }
                console.log("[Tooltip] 즉시 숨김 및 제거 완료 (트랜지션 없음).");
            }
        } else if (activeTooltip) { // parentNode가 없지만 activeTooltip 참조가 남아있는 경우 (극히 드문 예외처리)
            activeTooltip = null; 
            console.log("[Tooltip] activeTooltip 참조만 초기화 (이미 DOM에서 제거됨).");
        }
    }
    
    // --- 모달 업데이트 및 열기/닫기 함수 ---
    function updateSyncTypeModal(tabId = 'overview') { console.log(`[Modal] 싱크타입 모달 업데이트. 탭: ${tabId}`); if (!userProfile || !syncTypeMainImage || !syncTypeDescription || !syncTypeTabsContainer) { console.error("[Modal] 싱크타입 모달 필수 요소 없음."); return; } const data = syncTypeData[tabId]; if (!data) { console.error(`[Modal] 싱크타입 데이터 없음: ${tabId}`); syncTypeDescription.innerHTML = `<p>정보를 불러올 수 없습니다.</p>`; syncTypeMainImage.src = "img/sync_type/default.png"; return; } let imageUrl = data.image; if (tabId === 'nebula' && userProfile.사용자소속성운) { /* imageUrl = `img/sync_type/nebula_${userProfile.사용자소속성운}.png`; */ } else if (tabId === 'syncTypeDetail' && userProfile.결정된싱크타입) { /* imageUrl = `img/sync_type/type_${userProfile.결정된싱크타입}.png`; */ } syncTypeMainImage.src = imageUrl; syncTypeMainImage.alt = `${tabId} 관련 이미지`; let descriptionText = data.text; descriptionText = descriptionText.replace(/\[사용자소속성운\]/g, userProfile.사용자소속성운 || "알 수 없음"); descriptionText = descriptionText.replace(/\[성운 특징\]/g, "각 성운의 고유한 특성 설명"); descriptionText = descriptionText.replace(/\[사용자가성운에속한이유\]/g, userProfile.사용자가성운에속한이유 || "알 수 없음"); descriptionText = descriptionText.replace(/\[결정된싱크타입\]/g, userProfile.결정된싱크타입 || "미정"); descriptionText = descriptionText.replace(/\[맞춤싱크타입이름\]/g, userProfile.맞춤싱크타입이름 || "정해지지 않음"); descriptionText = descriptionText.replace(/\[싱크타입 설명\]/g, "해당 싱크타입의 상세 설명"); descriptionText = descriptionText.replace(/\[강점\]/g, "당신의 특별한 강점"); descriptionText = descriptionText.replace(/\[보완점\]/g, "성장을 위한 조언"); syncTypeDescription.innerHTML = `<p>${descriptionText.replace(/\n/g, "<br>")}</p>`; syncTypeTabsContainer.querySelectorAll('.sync-tab-btn').forEach(btn => { btn.classList.toggle('active', btn.dataset.tab === tabId); }); }
    function updateTarotCollectionModal() { console.log("[Modal] 타로 콜렉션 모달 업데이트."); if (!userProfile || !tarotCollectedCountEl || !tarotTotalCountEl || !tarotGaugeFillEl || !tarotCardGridEl) { console.error("[Modal] 타로 콜렉션 모달 필수 요소 없음."); return; } const collectedCards = userProfile.지금까지수집된타로카드 || []; const collectedCount = collectedCards.length; tarotCollectedCountEl.textContent = collectedCount; tarotTotalCountEl.textContent = TOTAL_TAROT_CARDS; const percentage = TOTAL_TAROT_CARDS > 0 ? (collectedCount / TOTAL_TAROT_CARDS) * 100 : 0; tarotGaugeFillEl.style.width = `${percentage}%`; tarotCardGridEl.innerHTML = ''; ALL_TAROT_CARD_IDS.forEach(cardId => { const cardItem = document.createElement('div'); cardItem.className = 'tarot-card-item'; const isCollected = collectedCards.includes(cardId); if (!isCollected) { cardItem.classList.add('not-collected'); } const isReversed = cardId.endsWith('_reversed'); if (isReversed) { cardItem.classList.add('reversed-card'); } const img = document.createElement('img'); const imageName = isReversed ? cardId.replace('_reversed', '_upright') : cardId; img.src = `img/tarot/${imageName}.png`; const cardData = TAROT_CARD_DATA[cardId] || { name: cardId.replace(/_/g, ' '), description: "정보 없음" }; img.alt = cardData.name; cardItem.appendChild(img); cardItem.addEventListener('click', (event) => { hideTooltip(); showTooltip({ name: cardData.name, description: cardData.description }, event.currentTarget); }); tarotCardGridEl.appendChild(cardItem); }); console.log("[Modal] 타로 콜렉션 카드 목록 생성 완료."); }
    function openModal(modalId) { console.log(`[Modal] 열기 시도: ${modalId}`); const modal = document.getElementById(modalId); if (modal) { if (modalId === 'syncTypeModal') { updateSyncTypeModal(); } else if (modalId === 'tarotCollectionModal') { updateTarotCollectionModal(); } modal.style.display = 'flex'; modal.addEventListener('click', closeModalOnOutsideClick); console.log(`[Modal] ${modalId} 열림.`); } else { console.error(`[Modal] 모달 ID "${modalId}"을 찾을 수 없음.`); alert(`모달 "${modalId}"을 찾을 수 없습니다.`); } if (moreOptionsPanel.classList.contains('active')) { moreOptionsPanel.classList.remove('active'); moreOptionsBtn.classList.remove('active'); } }
    function closeModal(modalId) { console.log(`[Modal] 닫기 시도: ${modalId}`); const modal = document.getElementById(modalId); if (modal) { modal.style.display = 'none'; modal.removeEventListener('click', closeModalOnOutsideClick); console.log(`[Modal] ${modalId} 닫힘.`); } }
    window.closeModal = closeModal; 
    function closeModalOnOutsideClick(event) { if (event.target === this) { console.log(`[Modal] 외부 클릭으로 ${this.id} 닫기.`); closeModal(this.id); } }

    function populateMoreOptionsPanel(menuKey, previousActionType = null) { console.log(`[Panel] 채우기 시작. 요청된 메뉴 키: "${menuKey}", 이전 액션 타입: ${previousActionType}`); if (previousActionType === 'SUB_MENU' && currentPanelMenuKey !== menuKey) { menuNavigationHistory.push(currentPanelMenuKey); console.log(`[Panel] 히스토리에 추가: "${currentPanelMenuKey}". 현재 히스토리:`, [...menuNavigationHistory]); } currentPanelMenuKey = menuKey; moreOptionsPanel.innerHTML = ''; const menuGroups = menuConfigurations[menuKey]; if (!menuGroups || !Array.isArray(menuGroups)) { console.error(`[Panel] 메뉴 설정 오류: 키 "${menuKey}"에 해당하는 메뉴 그룹 없음 또는 잘못된 형식.`); const errorOption = document.createElement('button'); errorOption.className = 'panel-option'; errorOption.textContent = '메뉴 구성 오류'; errorOption.disabled = true; moreOptionsPanel.appendChild(errorOption); return; } console.log(`[Panel] 키 "${menuKey}"에 대한 메뉴 그룹 ${menuGroups.length}개 처리 중.`); menuGroups.forEach((group, groupIndex) => { if (group.groupTitle) { const groupTitleDiv = document.createElement('div'); groupTitleDiv.className = 'panel-menu-group-title'; groupTitleDiv.textContent = group.groupTitle; moreOptionsPanel.appendChild(groupTitleDiv); console.log(`[Panel] 그룹 타이틀 추가: "${group.groupTitle}"`); } if (group.items && Array.isArray(group.items)) { group.items.forEach(item => { const optionButton = document.createElement('button'); optionButton.className = 'panel-option'; if (item.iconName) { const iconImg = document.createElement('img'); iconImg.className = 'menu-icon-img'; iconImg.src = `img/icon/${item.iconName}.png`; iconImg.alt = ''; optionButton.appendChild(iconImg); } const textNode = document.createTextNode(item.text); optionButton.appendChild(textNode); optionButton.dataset.actionType = item.actionType; if (item.actionValue !== undefined) { optionButton.dataset.actionValue = item.actionValue; } optionButton.disabled = isLoadingBotResponse; moreOptionsPanel.appendChild(optionButton); }); } if (groupIndex < menuGroups.length - 1) { const divider = document.createElement('div'); divider.className = 'panel-menu-group-divider'; moreOptionsPanel.appendChild(divider); console.log(`[Panel] 그룹 구분선 추가 (after group index ${groupIndex})`); } }); console.log(`[Panel] 키 "${menuKey}" 메뉴 생성 완료.`); }
    moreOptionsBtn.addEventListener('click', () => { console.log("[Panel] 더보기 버튼 클릭."); if (!userProfile) { console.error("[Panel] 사용자 프로필 없음. 패널 열기 실패."); alert("오류: 사용자 프로필을 불러올 수 없습니다."); return; } const panelIsCurrentlyActive = moreOptionsPanel.classList.contains('active'); const mainMenuKey = `main_menu_stage${userProfile.메뉴단계}`; if (!panelIsCurrentlyActive) { console.log(`[Panel] 메인 메뉴 로드 시도: ${mainMenuKey}`); menuNavigationHistory = []; populateMoreOptionsPanel(mainMenuKey, null); moreOptionsPanel.classList.add('active'); moreOptionsBtn.classList.add('active'); moreOptionsPanel.style.bottom = `${chatInputArea.offsetHeight -1}px`; console.log("[Panel] 패널 활성화됨."); } else { moreOptionsPanel.classList.remove('active'); moreOptionsBtn.classList.remove('active'); console.log("[Panel] 패널 비활성화됨."); } });
    moreOptionsPanel.addEventListener('click', async (e) => { const targetOption = e.target.closest('.panel-option'); if (targetOption && !targetOption.disabled && !isLoadingBotResponse) { e.stopPropagation(); const actionType = targetOption.dataset.actionType; const actionValue = targetOption.dataset.actionValue; console.log(`[Panel] 옵션 클릭: Text="${targetOption.textContent.trim()}", Type="${actionType}", Value="${actionValue}"`); switch (actionType) { case 'SUB_MENU': populateMoreOptionsPanel(actionValue, actionType); break; case 'MODAL': openModal(actionValue); break; case 'CHAT_MESSAGE': await processMessageExchange(actionValue, 'panel_option'); break; case 'ALERT': alert(actionValue); moreOptionsPanel.classList.remove('active'); moreOptionsBtn.classList.remove('active'); break; case 'BACK_MENU': console.log("[Panel] 뒤로 가기 요청. 현재 히스토리:", [...menuNavigationHistory]); if (menuNavigationHistory.length > 0) { const previousMenuKey = menuNavigationHistory.pop(); console.log(`[Panel] 이전 메뉴로 이동: "${previousMenuKey}"`); populateMoreOptionsPanel(previousMenuKey, actionType); } else { console.log("[Panel] 뒤로 갈 히스토리 없음. 메인 메뉴로 이동."); const mainMenuKey = `main_menu_stage${userProfile.메뉴단계}`; populateMoreOptionsPanel(mainMenuKey, actionType); } break; default: console.warn(`[Panel] 알 수 없는 액션 타입: ${actionType}`); moreOptionsPanel.classList.remove('active'); moreOptionsBtn.classList.remove('active'); } } });
    
    // 타로 카드 그리드 스크롤 시 툴팁 숨기기
    if (tarotCardScrollWrapper) {
        tarotCardScrollWrapper.addEventListener('scroll', () => {
            if (activeTooltip) {
                console.log("[Tooltip] 타로 그리드 스크롤 발생, 툴팁 숨김.");
                hideTooltip();
            }
        });
    }
    // 싱크타입 모달 탭 클릭 이벤트
    if (syncTypeTabsContainer) { syncTypeTabsContainer.addEventListener('click', (e) => { const targetTab = e.target.closest('.sync-tab-btn'); if (targetTab && !targetTab.classList.contains('active')) { const tabId = targetTab.dataset.tab; updateSyncTypeModal(tabId); } }); }

    sendBtn.addEventListener('click', handleSendMessage);
    messageInput.addEventListener('keypress', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } });
    messageInput.addEventListener('input', () => { adjustTextareaHeight(); if (!isLoadingBotResponse) sendBtn.disabled = messageInput.value.trim() === ''; });
    sampleAnswersContainer.addEventListener('click', async (e) => { const targetButton = e.target.closest('.sample-answer-btn'); if (targetButton && !targetButton.disabled && !isLoadingBotResponse) { const answerText = targetButton.dataset.answer; await processMessageExchange(answerText, 'sample_button'); } });
    document.addEventListener('click', (e) => { if (activeTooltip && !activeTooltip.contains(e.target) && !e.target.closest('.tarot-card-item')) { console.log("[Tooltip] 문서 외부 클릭으로 툴팁 숨김."); hideTooltip(); } if (moreOptionsPanel.classList.contains('active') && !moreOptionsBtn.contains(e.target) && !moreOptionsPanel.contains(e.target)) { console.log("[Panel] 외부 클릭으로 패널 닫기."); moreOptionsPanel.classList.remove('active'); moreOptionsBtn.classList.remove('active'); } }, true); 
    let resizeTimeout;
    window.addEventListener('resize', () => { clearTimeout(resizeTimeout); resizeTimeout = setTimeout(() => { adjustChatMessagesPadding(); if (moreOptionsPanel.classList.contains('active')) { moreOptionsPanel.style.bottom = `${chatInputArea.offsetHeight -1}px`; } }, 100); });

    async function initializeChat() { console.log("[App] 초기화 시작."); initializeUserProfile(); adjustTextareaHeight(); sendBtn.disabled = true; messageInput.disabled = false; requestAnimationFrame(adjustChatMessagesPadding); isLoadingBotResponse = true; setUIInteractions(true, false); if (typeof initialBotMessage === 'undefined') { console.error("[App] initialBotMessage 정의되지 않음. 초기화 중단."); isLoadingBotResponse = false; setUIInteractions(false, false); return; } await addMessage(initialBotMessage.text, 'bot'); isLoadingBotResponse = false; setUIInteractions(false, false); updateSampleAnswers(initialBotMessage.sampleAnswers); console.log("[App] 초기화 완료."); }

    initializeChat();
});