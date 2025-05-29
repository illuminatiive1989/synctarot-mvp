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


    // 타로 카드 선택 UI 요소
    const tarotSelectionOverlay = document.getElementById('tarotSelectionOverlay');
    const tarotCardCarouselContainer = document.getElementById('tarotCardCarouselContainer');
    const tarotCardCarousel = document.getElementById('tarotCardCarousel');
    const tarotCardInfo = document.getElementById('tarotCardInfo');
    const tarotSelectionConfirmBtn = document.getElementById('tarotSelectionConfirmBtn');
    const tarotClearSelectionBtn = document.getElementById('tarotClearSelectionBtn'); // 추가
    const tarotRandomSelectBtn = document.getElementById('tarotRandomSelectBtn');   // 추가

    // --- 전역 변수 및 상수 ---
    let userProfile;
    let isLoadingBotResponse = false;
    const TYPING_CHUNK_DELAY_MS = 30;
    let currentPanelMenuKey = 'main';
    let menuNavigationHistory = [];
    let hasUserSentMessage = false;
    const fullScreenLoader = document.getElementById('fullScreenLoader');

        const tarotInitiationMessages = [
            "오늘의 운세 보여줘",
            "오늘 뭐 먹을지 추천해줘",
            "썸인지 아닌지 알려줘",
            "그 사람의 마음을 알고 싶어"
        ];

    // 타로 카드 선택 관련 변수
    let isTarotSelectionActive = false;
    let cardsToSelectCount = 0;
    let selectedTarotCardIndices = [];
    const TOTAL_CARDS_IN_DECK = 78; // <-- ********** 이 라인이 반드시 있어야 합니다! **********
    let carouselScrollState = {
        isDragging: false,
        startX: 0,
        scrollLeftStart: 0
    };

    // --- 로드될 프롬프트 및 데이터 변수 ---
    let LOADED_PROMPT_SYNC_TYPE_TEST = "";
    let LOADED_PROMPT_TAROT_CHOICE = "";
    let LOADED_PROMPT_TAROT_TRANS = "";
    let LOADED_PROMPT_TAROT_ADVICE = "";
    // MATCHING_CRITERIA도 외부 파일로 옮긴다면 여기에 변수 선언
    // let LOADED_MATCHING_CRITERIA = {}; 

        // --- API 관련 상수 ---
    const API_KEY = 'AIzaSyDSAA6rbNdD3tV1W_u0nIll0XyTe63rU_k'; // 실제 키로 교체 필요
    const MODEL_NAME = 'gemini-2.5-flash-preview-04-17'; // 또는 사용자가 명시한 모델
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

    // --- 프롬프트 상수 (ini 파일 내용 대체) ---
    const PROMPT_SYNC_TYPE_TEST = `
# 역할: 당신은 사용자의 주관식 및 객관식 답변을 분석하여 MBTI와 유사한 성격 유형(DISC) 점수 및 5가지 주요 성격 요인(신경성, 외향성, 개방성, 우호성, 성실성) 점수를 추론하는 심리 분석가입니다.
# 목표: 제공된 사용자의 답변들을 바탕으로 각 항목의 점수를 0점에서 10점 사이로 부여하고, 결정된 싱크타입명, 사용자 소속 성운명, 맞춤 싱크타입 애칭, 그리고 사용자의 성향에 대한 간략한 개요 텍스트를 생성해야 합니다.
# 출력 형식 (반드시 JSON 형식으로 반환):
{
  "결정된싱크타입": "예시_싱크타입명 (예: 스텔라터틀)",
  "사용자소속성운": "예시_성운명 (예: 루미네시아)",
  "맞춤싱크타입이름": "예시_애칭 (예: 별을 사랑하는 탐험가)",
  "overviewText": "사용자의 답변을 종합적으로 고려했을 때, 사용자는 [핵심 성향 키워드 1], [핵심 성향 키워드 2] 등의 특징을 보이는 경향이 있습니다. [간략한 추가 설명 및 긍정적 조언 한두 문장]",
  "DISC_D_점수": 0, // 0-10점
  "DISC_I_점수": 0, // 0-10점
  "DISC_S_점수": 0, // 0-10점
  "DISC_C_점수": 0, // 0-10점
  "신경성": 0, // 0-10점 (Neuroticism)
  "외향성": 0, // 0-10점 (Extraversion)
  "개방성": 0, // 0-10점 (Openness to experience)
  "우호성": 0, // 0-10점 (Agreeableness)
  "성실성": 0 // 0-10점 (Conscientiousness)
}
# 사용자 답변:
`; // 실제 API 호출 시 이 뒤에 사용자 답변이 추가됨
    // --- 액션 관련 상수 ---
    const SELECT_ONE_CARD_ACTION = "action_select_one_card";
    const SELECT_THREE_CARDS_ACTION = "action_select_three_cards";
    const CONFIRM_ONE_CARD_COST_ACTION = "action_confirm_one_card_cost"; // 현재 미사용이나, 일관성을 위해 정의
    const CONFIRM_THREE_CARDS_COST_ACTION = "action_confirm_three_cards_cost";
    const CANCEL_COST_CONFIRMATION_ACTION = "action_cancel_cost_confirmation";
    const PROMPT_TAROT_CHOICE = `
# 역할: 당신은 사용자가 선택한 타로 카드와 사용자의 기본적인 성향 정보를 바탕으로, 해당 타로 카드가 현재 사용자에게 어떤 의미를 가질 수 있는지 간략하게 핵심 키워드 중심으로 풀이하는 타로 해석가입니다.
# 목표: 제공된 사용자 정보와 선택된 타로 카드 목록을 보고, 각 카드에 대한 핵심 의미와 전체적인 상황에 대한 짧은 조언을 생성합니다. 결과는 JSON 형식으로 반환합니다.
# 참고: 사용자의 싱크타입이나 성운 정보가 있다면 해석에 미묘한 뉘앙스를 추가할 수 있지만, 주된 해석은 타로 카드 자체에 집중합니다.
# 출력 형식 (반드시 JSON 형식으로 반환):
{
  "cardInterpretations": [
    { "cardId": "선택된_카드_ID_1", "keyword": "키워드1", "briefMeaning": "카드1에 대한 간략한 의미 또는 조언 (1-2문장)" },
    { "cardId": "선택된_카드_ID_2", "keyword": "키워드2", "briefMeaning": "카드2에 대한 간략한 의미 또는 조언 (1-2문장)" }
    // ... 카드 개수만큼 반복
  ],
  "overallAdvice": "선택된 카드들을 종합적으로 고려한 현재 상황에 대한 핵심 조언 (2-3문장)"
}
# 사용자 정보:
`; // 실제 API 호출 시 이 뒤에 사용자 정보와 카드 목록이 추가됨

    const PROMPT_TAROT_TRANS = `
# 역할: 당신은 사용자의 타로 카드 선택 결과(tarotResult)와 이전 대화 내용을 바탕으로, 사용자에게 타로 점괘를 전달하고 관련된 대화를 자연스럽게 이어가는 친절한 타로 상담가 '루비'입니다.
# 목표: 제공된 tarotResult 내용을 사용자에게 친절하게 설명하고, 사용자의 반응이나 질문에 맞춰 추가적인 대화를 이끌어냅니다. 당신의 답변은 일반적인 채팅 메시지 형식이어야 합니다.
# 참고: tarotResult는 시스템이 생성한 분석 내용이며, 당신은 이를 사용자 친화적으로 각색하여 전달하는 역할입니다. 당신의 답변에는 tarotResult의 JSON 구조가 직접 노출되어서는 안 됩니다.
# 이전 대화 내용:
`; // 실제 API 호출 시 이 뒤에 이전 대화 내용과 tarotResult가 추가됨

    const PROMPT_TAROT_ADVICE = `
# 역할: 당신은 사용자의 타로 카드 선택 결과(tarotResult), 이전 대화 내용, 그리고 사용자의 프로필을 종합적으로 고려하여 깊이 있는 삶의 조언을 제공하는 현명한 타로 마스터 '루비'입니다.
# 목표: 제공된 모든 정보를 바탕으로 사용자가 현재 직면한 상황이나 고민에 대해 구체적이고 실질적인 조언을 제공합니다. 당신의 답변은 사려 깊고 공감하는 채팅 메시지 형식이어야 합니다.
# 참고: "깊은 상담"을 요청한 사용자에게 제공되는 내용입니다.
# 이전 대화 내용:
`; // 실제 API 호출 시 이 뒤에 이전 대화, tarotResult, 사용자 프로필이 추가됨


    const MATCHING_CRITERIA = { // 예시 데이터, 실제 기준은 더 복잡할 수 있음
        NEBULAS: [ // 각 성운별 대표적인 성격 5요인 점수 (이상적인 값 또는 범위)
            { name: "루미네시아", Neuroticism: 3, Extraversion: 7, Openness: 8, Agreeableness: 6, Conscientiousness: 5 },
            { name: "크레아티오", Neuroticism: 5, Extraversion: 5, Openness: 9, Agreeableness: 4, Conscientiousness: 7 },
            // ... 기타 성운들
        ],
        SYNC_TYPES: [ // 각 싱크타입별 대표적인 DISC 점수
            { name: "스텔라터틀", D: 3, I: 5, S: 8, C: 6 },
            { name: "인터스텔라캣", D: 7, I: 8, S: 3, C: 4 },
            // ... 기타 싱크타입들
        ]
    };


    async function loadPromptFromFile(filePath) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Failed to load prompt file: ${filePath} - ${response.status} ${response.statusText}`);
            }
            let text = await response.text();
            // .ini 파일의 주석 (세미콜론 또는 #으로 시작하는 줄) 제거
            text = text.split('\n').filter(line => !line.trim().startsWith(';') && !line.trim().startsWith('#')).join('\n');
            console.log(`[FileLoad] 프롬프트 파일 로드 성공: ${filePath}`);
            return text.trim();
        } catch (error) {
            console.error(`[FileLoad] 프롬프트 파일 로드 오류 (${filePath}):`, error);
            // 기본 프롬프트 제공 또는 오류 처리를 위한 대체 문자열 반환 가능
            // 여기서는 오류를 다시 throw하여 초기화 과정에서 인지하도록 함
            throw error; 
        }
    }

    // MATCHING_CRITERIA를 외부 JSON 파일로 관리한다면 유사한 로드 함수 필요
    // async function loadDataFromFile(filePath) {
    //     try {
    //         const response = await fetch(filePath);
    //         if (!response.ok) {
    //             throw new Error(`Failed to load data file: ${filePath} - ${response.status} ${response.statusText}`);
    //         }
    //         const data = await response.json();
    //         console.log(`[FileLoad] 데이터 파일 로드 성공: ${filePath}`);
    //         return data;
    //     } catch (error) {
    //         console.error(`[FileLoad] 데이터 파일 로드 오류 (${filePath}):`, error);
    //         throw error;
    //     }
    // }

    const initialBotMessage = {
        text: "안녕하세요! 루비입니다. 무엇을 도와드릴까요?", 
        sampleAnswers: [
            { text: "먼저 보고싶은 타로를 골라주세요", value: "info_initial_prompt", actionType: 'info_disabled', disabled: true }
        ] 
    };
    // 참고용 카드 파일명 목록 (실제 사용은 데이터 파일의 cardName 필드를 우선)
    const KNOWN_SYNC_TYPE_CARD_FILES = [
        "planetoid", "interstellarcat", "stellarturtle",
        "spaceslug", "pulsar", "astralbunny",
        "nebulafox", "youngalien", "spacesnowflake",
        "spiralsheller", "interstellarbat", "spacebird",
        "firesprout", "spookoid", "eyebot",
        "jellynaut", "aquadog", "armoredslug",
        "vortexelemental", "bubblepuff", "orbiteeater",
        "astromite", "eldersquid", "spacejellies",
        "critternaut", "starryskitter", "pinkinvader",
        "lightrodent", "starhive", "spacewaffle",
        "graviton", "floater", "spacerat",
        "dusty", "rocky", "snooter",
        "cosmiceye", "mycelian", "craterbeast",
        "spacemites", "cosmicwump", "toxilum",
        "floxie", "spacewalk", "venotongue",
        "ufoot", "moltenite", "polaroid",
        "sporebloom", "gentlebeam", "orbiter",
        "starguppy", "celestiray", "sonarpod",
        "cephalon", "starsprite", "moonsnuut",
        "cosmon", "astroshroom", "cometcanine",
        "galaxycat", "starhoot", "venublub",
        "mooncritter", "spacepup", "lunaling",
        "globro", "azurecometpup", "gemcrab",
        "steadfast_robobear", "flarrow",
        "guardian_robobear", "pulsefeesh", "ringbee",
        "interloper", "orbineer", "swirlth",
        "aurabop", "cosmirillo", "lumisquid",
        "moonjaw", "stardasher", "jellomite",
        "spinder"
    ];
    const KNOWN_NEBULA_CARD_FILES = [
        "aeolus", "albion_prima", "castellaris",
        "chronica", "conexus", "creatio",
        "equilibria", "ignitio", "inquisito",
        "luminesia", "silvanis", "umbralis"
    ];


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

function initializeUserProfile() {
    console.log("[UserProfile] 초기화 시작.");

    let loadedProfileData = loadUserProfileFromLocalStorage();

    let defaultProfile = {
        "사용자이름": "방문객",
        "사용자애칭": "방문객",
        "사용자가좋아하는것": "새로운 경험",
        "사용자의마음을아프게하는것": "오류 메시지",
        "사용자가싫어하는것": "지루함",
        "사용자의나이성별": "비공개",
        "사용자의고민": "오늘의 운세는 어떨까?",
        "주관식질문1": null, "주관식답변1": null, "주관식질문2": null, "주관식답변2": null,
        "주관식질문3": null, "주관식답변3": null, "주관식질문4": null, "주관식답변4": null,
        "주관식질문5": null, "주관식답변5": null,
        "객관식질문과답변": [],
        "DISC_D_점수": 0, "DISC_I_점수": 0, "DISC_S_점수": 0, "DISC_C_점수": 0,
        "결정된싱크타입": null, 
        "사용자소속성운": null, 
        "사용자가성운에속한이유": "아직 알 수 없어요.",
        "맞춤싱크타입이름": null, 
        "overviewText": "당신의 성향을 파악하기 위한 분석이 아직 진행되지 않았습니다. 싱크타입 테스트를 통해 더 자세히 알아보세요.", 
        "사용자의감정상태": "평온",
        "선택된타로카드들": [],
        "지금까지수집된타로카드": [],
        "tarotResult": null, 
        "시나리오": null,
        "메뉴단계": 1,
        "싱크타입단계": "미결정",
        "tarotbg": "default.png",
        "bones": 10,
        "신경성": 0,
        "외향성": 0,
        "개방성": 0,
        "우호성": 0,
        "성실성": 0,
        "현재테스트종류": null, 
        "현재질문ID": null, 
        "싱크테스트답변": { 
            subjective_answers: {}, 
            objective_scores: {}  
        },
        "hasUsedAddTwoCards": false // "2장 더 뽑기" 사용 여부 플래그 추가
    };

    userProfile = { ...defaultProfile };

    if (loadedProfileData) {
        if (loadedProfileData.결정된싱크타입) userProfile.결정된싱크타입 = loadedProfileData.결정된싱크타입;
        else userProfile.결정된싱크타입 = null; 
        if (loadedProfileData.사용자소속성운) userProfile.사용자소속성운 = loadedProfileData.사용자소속성운;
        else userProfile.사용자소속성운 = null;
        if (loadedProfileData.맞춤싱크타입이름) userProfile.맞춤싱크타입이름 = loadedProfileData.맞춤싱크타입이름;
        else userProfile.맞춤싱크타입이름 = null;
        if (loadedProfileData.overviewText) userProfile.overviewText = loadedProfileData.overviewText;
        else userProfile.overviewText = defaultProfile.overviewText; 
        if (loadedProfileData.사용자이름) userProfile.사용자이름 = loadedProfileData.사용자이름;
        if (loadedProfileData.사용자애칭) userProfile.사용자애칭 = loadedProfileData.사용자애칭;
        if (loadedProfileData.지금까지수집된타로카드) userProfile.지금까지수집된타로카드 = loadedProfileData.지금까지수집된타로카드;
        if (loadedProfileData.tarotbg) userProfile.tarotbg = loadedProfileData.tarotbg;
        if (typeof loadedProfileData.bones === 'number') userProfile.bones = loadedProfileData.bones;
        if (typeof loadedProfileData.DISC_D_점수 === 'number') userProfile.DISC_D_점수 = loadedProfileData.DISC_D_점수;
        if (typeof loadedProfileData.DISC_I_점수 === 'number') userProfile.DISC_I_점수 = loadedProfileData.DISC_I_점수;
        if (typeof loadedProfileData.DISC_S_점수 === 'number') userProfile.DISC_S_점수 = loadedProfileData.DISC_S_점수;
        if (typeof loadedProfileData.DISC_C_점수 === 'number') userProfile.DISC_C_점수 = loadedProfileData.DISC_C_점수;
        if (typeof loadedProfileData.신경성 === 'number') userProfile.신경성 = loadedProfileData.신경성;
        if (typeof loadedProfileData.외향성 === 'number') userProfile.외향성 = loadedProfileData.외향성;
        if (typeof loadedProfileData.개방성 === 'number') userProfile.개방성 = loadedProfileData.개방성;
        if (typeof loadedProfileData.우호성 === 'number') userProfile.우호성 = loadedProfileData.우호성;
        if (typeof loadedProfileData.성실성 === 'number') userProfile.성실성 = loadedProfileData.성실성;
        if (loadedProfileData.tarotResult) userProfile.tarotResult = loadedProfileData.tarotResult;
        if (typeof loadedProfileData.hasUsedAddTwoCards === 'boolean') userProfile.hasUsedAddTwoCards = loadedProfileData.hasUsedAddTwoCards; // 플래그 로드

        if (userProfile.결정된싱크타입 && userProfile.사용자소속성운) {
            userProfile.싱크타입단계 = "결정됨";
        } else {
            userProfile.싱크타입단계 = "미결정";
        }
        console.log("[UserProfile] 로컬 스토리지 데이터로 프로필 업데이트 완료.");
    } else {
        console.log("[UserProfile] 첫 방문 또는 로컬 데이터 없음. 기본값 사용 및 저장.");
        saveUserProfileToLocalStorage(userProfile);
    }

    updateBoneCountDisplay();
    console.log("[UserProfile] 최종 초기화 완료 (파생 데이터 설정 전):", JSON.parse(JSON.stringify(userProfile)));
}
function drawRadarChart(canvasId, labels, datasets) { // datasets는 배열 형태 [{label, data, backgroundColor, borderColor}, ...]
    const ctx = document.getElementById(canvasId);
    if (!ctx) {
        console.error(`[Chart] Canvas ID '${canvasId}'를 찾을 수 없습니다.`);
        return null;
    }

    let existingChart = Chart.getChart(ctx);
    if (existingChart) {
        existingChart.destroy();
    }

    // 모든 데이터셋의 모든 값을 종합하여 최대값 계산
    let allDataValues = [];
    datasets.forEach(ds => {
        ds.data.forEach(val => {
            allDataValues.push((typeof val === 'string' ? parseFloat(val) : val) || 0);
        });
    });
    const maxVal = Math.max(...allDataValues, 0);
    const suggestedMax = Math.max(10, Math.ceil(maxVal / 5) * 5); // 최소 10, 5단위 올림 (예: 최대 20점 척도)


    return new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels, // 모든 데이터셋이 공유하는 x축 레이블 (예: D, I, S, C, 신경성...)
            datasets: datasets.map(ds => ({
                label: ds.label,
                data: ds.data.map(val => (typeof val === 'string' ? parseFloat(val) : val) || 0),
                backgroundColor: ds.backgroundColor || 'rgba(0, 0, 0, 0.2)', // 기본값
                borderColor: ds.borderColor || 'rgba(0, 0, 0, 1)',       // 기본값
                borderWidth: ds.borderWidth || 1.5,
                pointBackgroundColor: ds.borderColor || 'rgba(0, 0, 0, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: ds.borderColor || 'rgba(0, 0, 0, 1)',
                fill: true // 영역 채우기
            }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // false로 설정하여 부모 컨테이너에 더 잘 맞도록 함
            scales: {
                r: {
                    angleLines: { display: true, color: 'rgba(0, 0, 0, 0.1)' },
                    grid: { color: 'rgba(0, 0, 0, 0.1)' }, // 방사형 그리드 라인 색상
                    suggestedMin: 0,
                    suggestedMax: suggestedMax, // 모든 데이터셋의 최대값을 고려하여 설정
                    ticks: {
                        display: true,
                        stepSize: suggestedMax / 4, // 눈금 간격 (4등분 또는 5등분)
                        backdropColor: 'transparent', // 눈금 배경 투명
                        color: '#666' // 눈금 숫자 색상
                    },
                    pointLabels: {
                        font: {
                            size: 10 // 항목 레이블 폰트 크기 (예: '주도형(D)')
                        },
                        color: '#333' // 항목 레이블 색상
                    }
                }
            },
            plugins: {
                legend: {
                    display: false // Chart.js 자체 범례 숨기기 (커스텀 범례 사용)
                },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.r !== null) {
                                label += context.parsed.r.toFixed(1); // 소수점 한 자리까지
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
}
function generateSyncTypeData() {
    console.log("[SyncTypeData] 생성 시작. UserProfile:", userProfile);
    if (!userProfile || typeof ALL_SYNC_TYPES === 'undefined' || typeof ALL_NEBULAS === 'undefined') {
        console.error("[SyncTypeData] 생성 실패: userProfile, ALL_SYNC_TYPES, 또는 ALL_NEBULAS가 정의되지 않았습니다.");
        syncTypeDataStore = {
            overview: {
                text: userProfile.overviewText || "총평 정보를 불러올 수 없습니다.",
                chartData: { labels: [], datasets: [] },
                customLegend: []
            },
            nebula: { image: "img/sync_type/nebula_default.png", text: "성운 정보를 불러오는 중 오류가 발생했습니다." },
            syncTypeDetail: { image: "img/sync_type/type_default.png", text: "세부 싱크타입 정보를 불러오는 중 오류가 발생했습니다." }
        };
        userProfile.맞춤싱크타입이름 = userProfile.맞춤싱크타입이름 || "정보 부족";
        userProfile.사용자가성운에속한이유 = userProfile.사용자가성운에속한이유 || "정보 부족";
        return;
    }

    function findDataFlexible(dataObject, primaryKey, secondaryKeyField, secondaryKeyTransform = (k) => k.toLowerCase().replace(/\s+/g, '')) {
        if (!primaryKey && !secondaryKeyField) return null;
        let foundData = null;
        if (primaryKey && dataObject[primaryKey]) {
            foundData = dataObject[primaryKey];
            console.log(`[findDataFlexible] Found by primary key (exact): '${primaryKey}'`);
            return foundData;
        }
        if (primaryKey) {
            const normalizedPrimaryKey = primaryKey.replace(/\s+/g, '');
            if (dataObject[normalizedPrimaryKey]) {
                foundData = dataObject[normalizedPrimaryKey];
                console.log(`[findDataFlexible] Found by primary key (whitespace removed): '${normalizedPrimaryKey}' (original: '${primaryKey}')`);
                return foundData;
            }
            for (const key in dataObject) {
                if (key.replace(/\s+/g, '') === normalizedPrimaryKey) {
                    foundData = dataObject[key];
                    console.log(`[findDataFlexible] Found by matching dataObject key (whitespace removed): '${key}' to normalized primary key '${normalizedPrimaryKey}'`);
                    return foundData;
                }
            }
        }
        if (secondaryKeyField && primaryKey) {
            const transformedTargetValue = secondaryKeyTransform(primaryKey);
            for (const key in dataObject) {
                if (dataObject[key][secondaryKeyField]) {
                    const transformedSourceValue = secondaryKeyTransform(dataObject[key][secondaryKeyField]);
                    if (transformedSourceValue === transformedTargetValue) {
                        foundData = dataObject[key];
                        console.log(`[findDataFlexible] Found by secondary key field '${secondaryKeyField}': '${dataObject[key][secondaryKeyField]}' (transformed: '${transformedSourceValue}') matched target '${transformedTargetValue}'`);
                        return foundData;
                    }
                }
            }
        }
        if (!foundData) {
            console.warn(`[findDataFlexible] Data not found for primaryKey: '${primaryKey}' or via secondary key.`);
        }
        return null;
    }

    const userNebulaKey = userProfile.사용자소속성운;
    const nebulaInfo = findDataFlexible(ALL_NEBULAS, userNebulaKey, 'nameEng');

    const userSyncTypeKey = userProfile.결정된싱크타입;
    const syncTypeInfo = findDataFlexible(ALL_SYNC_TYPES, userSyncTypeKey, 'nameEng');

    // 1. 총평 (Overview) 데이터 - 통합 차트 및 커스텀 범례 데이터 준비
    const bigFiveChartLabels = ["신경성", "외향성", "개방성", "우호성", "성실성"];
    // const discChartLabels = ["주도형(D)", "사교형(I)", "안정형(S)", "신중형(C)"]; // DISC 레이블은 차트 데이터셋 레이블로 사용

    const commonRadarLabels = bigFiveChartLabels; // BigFive 레이블을 공통 축으로 사용

    let bigFiveScores = [0, 0, 0, 0, 0];
    if (nebulaInfo) {
        bigFiveScores = [
            parseFloat(nebulaInfo.Neuroticism) || 0,
            parseFloat(nebulaInfo.Extraversion) || 0,
            parseFloat(nebulaInfo.Openness) || 0,
            parseFloat(nebulaInfo.Agreeableness) || 0,
            parseFloat(nebulaInfo.Conscientiousness) || 0
        ];
    }

    let discScores = [0, 0, 0, 0];
    if (syncTypeInfo) {
        discScores = [
            syncTypeInfo.D || 0,
            syncTypeInfo.I || 0,
            syncTypeInfo.S || 0,
            syncTypeInfo.C || 0
        ];
    }
    const discDataPadded = [...discScores, null]; // 5개 항목으로 패딩된 DISC 점수 (마지막 null은 Big5의 5번째 항목과 축을 맞추기 위함)

    const dataset1Color = 'rgba(255, 159, 64, 1)';
    const dataset1BgColor = 'rgba(255, 159, 64, 0.3)';
    const dataset2Color = 'rgba(75, 192, 192, 1)';
    const dataset2BgColor = 'rgba(75, 192, 192, 0.3)';


    syncTypeDataStore.overview = {
        text: userProfile.overviewText || "당신의 성향에 대한 종합적인 분석입니다.",
        chartData: {
            labels: commonRadarLabels,
            datasets: [
                {
                    label: '성격 5요인', // 차트 툴팁 등에 사용될 레이블
                    data: bigFiveScores,
                    borderColor: dataset1Color,
                    backgroundColor: dataset1BgColor,
                    pointBackgroundColor: dataset1Color,
                    borderWidth: 1.5
                },
                {
                    label: '행동 유형', // 차트 툴팁 등에 사용될 레이블
                    data: discDataPadded,
                    borderColor: dataset2Color,
                    backgroundColor: dataset2BgColor,
                    pointBackgroundColor: dataset2Color,
                    borderWidth: 1.5
                }
            ]
        },
        customLegend: [ // 커스텀 범례를 위한 정보 (텍스트 수정)
            { text: '성격 5요인', color: dataset1Color },
            { text: '행동 유형', color: dataset2Color }
        ]
    };


    // 2. 성운 (Nebula) 데이터 및 userProfile 업데이트
    let nebulaImage = "img/sync_type/nebula_default.png";
    let nebulaText = "당신의 소속 성운 정보를 불러올 수 없거나 아직 결정되지 않았습니다.";

    if (nebulaInfo) {
        const rawNebulaCardName = nebulaInfo.cardName || userNebulaKey.toLowerCase().replace(/\s+/g, '_');
        nebulaImage = `img/sync_type/constellation_${rawNebulaCardName}_card.png`;

        let big5ScoresText = "";
        if (nebulaInfo.Neuroticism !== undefined) big5ScoresText += `신경성(N): ${nebulaInfo.Neuroticism}, `;
        if (nebulaInfo.Extraversion !== undefined) big5ScoresText += `외향성(E): ${nebulaInfo.Extraversion}, `;
        if (nebulaInfo.Openness !== undefined) big5ScoresText += `개방성(O): ${nebulaInfo.Openness}, `;
        if (nebulaInfo.Agreeableness !== undefined) big5ScoresText += `우호성(A): ${nebulaInfo.Agreeableness}, `;
        if (nebulaInfo.Conscientiousness !== undefined) big5ScoresText += `성실성(C): ${nebulaInfo.Conscientiousness}`;
        big5ScoresText = big5ScoresText.trim().replace(/,$/, '');


        userProfile.사용자가성운에속한이유 = `당신은 ${nebulaInfo.nameKor}의 ${nebulaInfo.tendency} 특성과 깊은 연결고리를 가지고 있는 것 같아요.`;

        nebulaText = `당신은 <b>${nebulaInfo.nameKor} (${nebulaInfo.nameEng})</b> 성운에 속해 있습니다.<br><br>
                      <b>성향:</b> ${nebulaInfo.tendency}<br>
                      <b>설명:</b> ${nebulaInfo.description}<br>
                      <b>특징:</b> ${nebulaInfo.characteristics || '정보 없음'}<br>
                      ${big5ScoresText ? `<b>성격 5요인 점수:</b> ${big5ScoresText}<br>` : ''}
                      <b>주요 소속 싱크타입:</b> ${(nebulaInfo.memberSyncTypes || []).join(', ') || '정보 없음'}<br><br>
                      당신이 이 성운에 속한 이유는 아마도 ${userProfile.사용자가성운에속한이유} 당신의 잠재력을 발휘하여 성운의 빛을 더욱 밝혀주세요.`;
    } else if (userNebulaKey) {
        userProfile.사용자가성운에속한이유 = `성운 '${userNebulaKey}' 정보를 찾을 수 없어 이유를 알 수 없습니다.`;
        nebulaText = `당신의 소속 성운 '${userNebulaKey}'에 대한 상세 정보를 찾을 수 없습니다. 관리자에게 문의해주세요.`;
    } else {
        userProfile.사용자가성운에속한이유 = "소속 성운이 아직 결정되지 않았습니다.";
    }
    syncTypeDataStore.nebula = {
        image: nebulaImage,
        text: nebulaText
    };

    // 3. 싱크타입 (SyncTypeDetail) 데이터 및 userProfile 업데이트
    let syncTypeImage = "img/sync_type/type_default.png";
    let syncTypeText = "당신의 싱크타입 정보를 불러올 수 없거나 아직 결정되지 않았습니다.";

    if (syncTypeInfo) {
        const rawSyncTypeCardName = syncTypeInfo.cardName || userSyncTypeKey.toLowerCase().replace(/\s+/g, '_');
        syncTypeImage = `img/sync_type/${rawSyncTypeCardName}_character_card.png`;

        let discScoresText = "";
        if (syncTypeInfo.D !== undefined) discScoresText += `D: ${syncTypeInfo.D}, `;
        if (syncTypeInfo.I !== undefined) discScoresText += `I: ${syncTypeInfo.I}, `;
        if (syncTypeInfo.S !== undefined) discScoresText += `S: ${syncTypeInfo.S}, `;
        if (syncTypeInfo.C !== undefined) discScoresText += `C: ${syncTypeInfo.C}`;
        discScoresText = discScoresText.trim().replace(/,$/, '');

        userProfile.맞춤싱크타입이름 = `${syncTypeInfo.tendency.split(',')[0].trim()} ${syncTypeInfo.nameKor}`;

        syncTypeText = `당신의 결정된 싱크타입은 <b>${syncTypeInfo.nameKor} (${syncTypeInfo.nameEng})</b>입니다.<br>
                       ${userProfile.맞춤싱크타입이름 ? `애칭: <b>${userProfile.맞춤싱크타입이름}</b><br><br>` : '<br>'}
                       <b>성향:</b> ${syncTypeInfo.tendency}<br>
                       <b>설명:</b> ${syncTypeInfo.description}<br>
                       <b>강점:</b> ${syncTypeInfo.strength || '정보 없음'}<br>
                       <b>보완점:</b> ${syncTypeInfo.weakness || '정보 없음'}<br>
                       ${discScoresText ? `<b>DISC 점수:</b> ${discScoresText}<br>` : ''}
                       <b>소속 성운:</b> ${syncTypeInfo.nebulaName || '정보 없음'}`;
    } else if (userSyncTypeKey) {
        userProfile.맞춤싱크타입이름 = `싱크타입 '${userSyncTypeKey}' 정보를 찾을 수 없습니다.`;
        syncTypeText = `당신의 싱크타입 '${userSyncTypeKey}'에 대한 상세 정보를 찾을 수 없습니다. 관리자에게 문의해주세요.`;
    } else {
         userProfile.맞춤싱크타입이름 = "싱크타입이 아직 결정되지 않았습니다.";
    }
    syncTypeDataStore.syncTypeDetail = {
        image: syncTypeImage,
        text: syncTypeText
    };

    console.log("[SyncTypeData] 생성 완료 및 userProfile 파생 정보 업데이트:", JSON.parse(JSON.stringify(syncTypeDataStore)));
    console.log("[UserProfile] (파생 정보 업데이트 후):", JSON.parse(JSON.stringify(userProfile)));
}

    const menuConfigurations = {
        "main_menu_stage1": [
            {
                groupTitle: "타로 선택",
                items: [
                    { text: "오늘의 운세", actionType: "SUB_MENU", actionValue: "submenu_fortune_stage1", iconName: "today" },
                    { text: "연애상담", actionType: "SUB_MENU", actionValue: "submenu_love_counsel_stage1", iconName: "love" }
                ]
            },
            {
                groupTitle: "특별한 요소",
                items: [
                    { text: "싱크타입", actionType: "MODAL", actionValue: "syncTypeModal", iconName: "sync" },
                    { text: "타로콜렉션", actionType: "MODAL", actionValue: "tarotCollectionModal", iconName: "collection" }
                ]
            },
            {
                groupTitle: "시스템 요소",
                items: [
                    { text: "소셜로그인", actionType: "MODAL", actionValue: "socialLoginModal", iconName: "social" }
                ]
            }
        ],
        "submenu_fortune_stage1": [
            {
                items: [
                    { text: "오늘의 운세 (보기)", actionType: "CHAT_MESSAGE", actionValue: "오늘의 운세 보여줘", iconName: "view", isTarotRelated: true, tarotbg: "fortune_bg_celestial.png" }, // 예시 배경
                    { text: "오늘 뭐먹지?", actionType: "CHAT_MESSAGE", actionValue: "오늘 뭐 먹을지 추천해줘", iconName: "food", isTarotRelated: true, tarotbg: "food_choice_bg_rustic.png" }, // 예시 배경
                    { text: "뒤로 가기", actionType: "BACK_MENU", iconName: "back" }
                ]
            }
        ],
        "submenu_love_counsel_stage1": [
            {
                items: [
                    { text: "썸타는걸까?", actionType: "CHAT_MESSAGE", actionValue: "썸인지 아닌지 알려줘", iconName: "heart", isTarotRelated: true, tarotbg: "love_썸_bg.png" }, // 예시 배경
                    { text: "그 사람 마음이 궁금해", actionType: "CHAT_MESSAGE", actionValue: "그 사람의 마음을 알고 싶어", iconName: "mind", isTarotRelated: true, tarotbg: "love_mind_bg.png" }, // 예시 배경
                    { text: "뒤로 가기", actionType: "BACK_MENU", iconName: "back" }
                ]
            }
        ],
        "main_menu_stage2": [ // 사용자가 메시지를 한 번이라도 보낸 후의 메뉴
            {
                groupTitle: "상담 관리",
                items: [
                    { text: "새상담 시작", actionType: "ALERT", actionValue: "새상담 시작 기능은 아직 준비 중입니다.", iconName: "new_chat" }
                ]
            },
            { // 특별한 요소, 시스템 요소 등은 stage1과 동일하게 유지하거나 다르게 구성 가능
                groupTitle: "특별한 요소",
                items: [
                    { text: "싱크타입", actionType: "MODAL", actionValue: "syncTypeModal", iconName: "sync" },
                    { text: "타로콜렉션", actionType: "MODAL", actionValue: "tarotCollectionModal", iconName: "collection" }
                ]
            },
            {
                groupTitle: "시스템 요소",
                items: [
                    { text: "소셜로그인", actionType: "MODAL", actionValue: "socialLoginModal", iconName: "social" }
                ]
            }
        ],
    };
function loadUserProfileFromLocalStorage() {
    console.log("[LocalStorage] 사용자 프로필 로드 시도.");
    const storedData = localStorage.getItem('userSyncData');
    if (storedData) {
        try {
            const parsedData = JSON.parse(storedData);
            console.log("[LocalStorage] 저장된 데이터 로드:", parsedData);
            return parsedData;
        } catch (error) {
            console.error("[LocalStorage] 저장된 데이터 파싱 오류:", error);
            localStorage.removeItem('userSyncData'); // 손상된 데이터 제거
            return null;
        }
    }
    console.log("[LocalStorage] 저장된 사용자 프로필 데이터 없음.");
    return null;
}

function saveUserProfileToLocalStorage(profile) {
    if (!profile) {
        console.error("[LocalStorage] 저장할 프로필 데이터 없음.");
        return;
    }
    const dataToStore = {
        결정된싱크타입: profile.결정된싱크타입,
        사용자소속성운: profile.사용자소속성운,
        맞춤싱크타입이름: profile.맞춤싱크타입이름,
        overviewText: profile.overviewText,
        DISC_D_점수: profile.DISC_D_점수,
        DISC_I_점수: profile.DISC_I_점수,
        DISC_S_점수: profile.DISC_S_점수,
        DISC_C_점수: profile.DISC_C_점수,
        신경성: profile.신경성,
        외향성: profile.외향성,
        개방성: profile.개방성,
        우호성: profile.우호성,
        성실성: profile.성실성,
        사용자애칭: profile.사용자애칭,
        사용자이름: profile.사용자이름,
        지금까지수집된타로카드: profile.지금까지수집된타로카드,
        선택된타로카드들: profile.선택된타로카드들, 
        tarotResult: profile.tarotResult, 
        tarotbg: profile.tarotbg,
        bones: profile.bones,
        hasUsedAddTwoCards: profile.hasUsedAddTwoCards // 플래그 저장
    };
    try {
        localStorage.setItem('userSyncData', JSON.stringify(dataToStore));
        console.log("[LocalStorage] 사용자 프로필 저장 완료:", dataToStore);
    } catch (error) {
        console.error("[LocalStorage] 사용자 프로필 저장 오류:", error);
    }
}
    function adjustChatMessagesPadding() {
        if (!sampleAnswersContainer || !chatInputArea || !chatMessages) {
            console.error("[UIAdjust] adjustChatMessagesPadding 필수 DOM 요소 누락.");
            return;
        }
        const sampleAnswersHeight = sampleAnswersContainer.offsetHeight;
        const chatInputAreaHeight = chatInputArea.offsetHeight;
        const totalBottomAreaHeight = sampleAnswersHeight + chatInputAreaHeight;
        const extraPadding = 10;
        chatMessages.style.paddingBottom = `${totalBottomAreaHeight + extraPadding}px`;
    }

    function scrollToBottom() {
        chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: 'smooth' });
    }

    function adjustTextareaHeight() {
        messageInput.style.height = 'auto';
        let newHeight = messageInput.scrollHeight;
        const maxHeightStyle = getComputedStyle(messageInput).maxHeight;
        const maxHeight = maxHeightStyle && maxHeightStyle !== 'none' ? parseInt(maxHeightStyle) : Infinity;
        if (newHeight > maxHeight) {
            newHeight = maxHeight;
            messageInput.style.overflowY = 'auto';
        } else {
            messageInput.style.overflowY = 'hidden';
        }
        messageInput.style.height = `${newHeight}px`;
    }

function sanitizeBotHtml(htmlString) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString; // 1. 먼저 HTML 문자열을 DOM으로 파싱
    // console.log('[Sanitize] Input HTML string:', htmlString);
    // console.log('[Sanitize] Parsed tempDiv innerHTML:', tempDiv.innerHTML);

    // 허용할 태그와, 각 태그별 허용할 속성 정의
    const allowedElements = {
        'B': [],
        'STRONG': [],
        'BR': [],
        'SPAN': ['style', 'class'], // 스타일과 클래스 허용 (필요시 style 내용은 추가 검증)
        'DIV': ['style', 'class'],  // 스타일과 클래스 허용
        'IMG': ['src', 'alt', 'title', 'class'] // IMG는 src, alt, title, class 허용
    };

    function cleanNodeRecursive(node) {
        // 텍스트 노드는 그대로 반환
        if (node.nodeType === Node.TEXT_NODE) {
            return document.createTextNode(node.textContent);
        }

        // 엘리먼트 노드 처리
        if (node.nodeType === Node.ELEMENT_NODE) {
            const tagName = node.tagName.toUpperCase();

            // 허용된 태그인지 확인
            if (allowedElements.hasOwnProperty(tagName)) {
                const newNode = document.createElement(node.tagName.toLowerCase());
                const allowedAttributes = allowedElements[tagName];

                // 허용된 속성만 복사
                for (const attr of Array.from(node.attributes)) {
                    const attrNameLower = attr.name.toLowerCase();
                    if (allowedAttributes.includes(attrNameLower)) {
                        if (attrNameLower === 'src') { // src 속성 특별 처리 (URL 유효성 등)
                            const srcValue = attr.value;
                            if (srcValue && (srcValue.startsWith('http') || srcValue.startsWith('/') || srcValue.startsWith('img/') || srcValue.match(/^[a-zA-Z0-9_\-\/\.]+$/))) {
                                newNode.setAttribute(attr.name, srcValue);
                            } else {
                                console.warn(`[Sanitize] 유효하지 않거나 허용되지 않는 ${tagName} src: ${srcValue}`);
                            }
                        } else if (attrNameLower === 'style') { // style 속성 (더 엄격한 필터링 필요할 수 있음)
                            // 간단히는 허용하되, 복잡한 CSS injection 방지를 위해 정제 로직 추가 가능
                            newNode.setAttribute(attr.name, attr.value);
                        }
                        else {
                            newNode.setAttribute(attr.name, attr.value);
                        }
                    } else if (attrNameLower.startsWith('on')) {
                        console.warn(`[Sanitize] on* 이벤트 핸들러 제거: ${attr.name} for ${tagName}`);
                    } else {
                         // console.log(`[Sanitize] Disallowed attribute: ${attr.name} for ${tagName}`);
                    }
                }

                // 자식 노드들도 재귀적으로 처리
                for (const childNode of Array.from(node.childNodes)) {
                    newNode.appendChild(cleanNodeRecursive(childNode));
                }
                return newNode;
            } else {
                // 허용되지 않은 태그는 제거하고, 자식 노드들만 가져와서 이어붙임 (텍스트 등 보존)
                // console.log(`[Sanitize] Disallowed tag: ${tagName}. Processing children.`);
                const fragment = document.createDocumentFragment();
                for (const childNode of Array.from(node.childNodes)) {
                    fragment.appendChild(cleanNodeRecursive(childNode));
                }
                return fragment;
            }
        }
        // 그 외 노드 타입 (주석 등)은 빈 DocumentFragment 반환하여 무시
        return document.createDocumentFragment();
    }

    const fragment = document.createDocumentFragment();
    // tempDiv의 자식 노드들을 순회하며 정제
    Array.from(tempDiv.childNodes).forEach(child => {
        fragment.appendChild(cleanNodeRecursive(child));
    });
    
    const resultDiv = document.createElement('div');
    resultDiv.appendChild(fragment);
    // console.log('[Sanitize] Sanitized HTML result:', resultDiv.innerHTML);
    return resultDiv.innerHTML;
}

    function clearChatMessages() {
        if (chatMessages) {
            while (chatMessages.firstChild) {
                chatMessages.removeChild(chatMessages.firstChild);
            }
            console.log("[Chat] 모든 메시지 삭제됨.");
            requestAnimationFrame(adjustChatMessagesPadding);
        } else {
            console.error("[Chat] chatMessages 요소를 찾을 수 없어 메시지를 삭제할 수 없습니다.");
        }
    }

async function addMessage(data, type, options = {}) { // 첫 번째 인자를 data 객체로 받거나, 텍스트와 타입을 분리
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    
    let textContentForLog = "";
    if (typeof data === 'string') {
        textContentForLog = data;
    } else if (data && typeof data.text === 'string') {
        textContentForLog = data.text;
    } else if (data && typeof data.interpretationHtml === 'string') { // 조수 해석용 객체
        textContentForLog = "조수 해석 컨텐츠";
    }

    console.log(`[Message] '${type}' 메시지 추가 시작: "${textContentForLog.substring(0, 70)}..."`);

    return new Promise(async (resolveAllMessagesAdded) => {
        if (type === 'user') {
            messageDiv.classList.add('user-message');
            messageDiv.textContent = typeof data === 'string' ? data : data.text; // data가 문자열일 수도 객체일 수도 있음
            if (chatMessages) chatMessages.appendChild(messageDiv);
            requestAnimationFrame(() => {
                adjustChatMessagesPadding();
                scrollToBottom();
                console.log("[Message] 사용자 메시지 DOM 추가 완료.");
                resolveAllMessagesAdded();
            });
        } else if (type === 'bot') {
            messageDiv.classList.add('bot-message');
            // 만약 data.isAssistantInterpretation 플래그가 true이면 특별 클래스 추가
            if (data && data.isAssistantInterpretation) {
                messageDiv.classList.add('assistant-type-message'); // 이 클래스로 CSS에서 패딩 등 조절
                // 내부 컨테이너 직접 생성
                const interpretationContainer = document.createElement('div');
                interpretationContainer.className = 'assistant-interpretation-container';
                // data.interpretationHtml은 이미 HTML 문자열로 가정 (sanitize는 simulateBotResponse에서 미리 처리)
                interpretationContainer.innerHTML = sanitizeBotHtml(data.interpretationHtml);
                messageDiv.appendChild(interpretationContainer);
                if (chatMessages) chatMessages.appendChild(messageDiv);
                requestAnimationFrame(() => {
                    adjustChatMessagesPadding();
                    scrollToBottom();
                    console.log("[Message] 조수 해석 메시지 DOM 추가 완료.");
                    resolveAllMessagesAdded();
                });

            } else { // 일반 봇 메시지 (루비)
                if (chatMessages) chatMessages.appendChild(messageDiv);
                
                requestAnimationFrame(() => {
                    adjustChatMessagesPadding();
                    scrollToBottom();
                });

                const textToType = typeof data === 'string' ? data : data.text; // 일반 봇 메시지 텍스트
                const sanitizedHtml = sanitizeBotHtml(textToType);
                
                const tempContainer = document.createElement('div');
                tempContainer.innerHTML = sanitizedHtml;

                const typingChunks = [];
                function extractChunksRecursive(node) {
                    if (node.nodeType === Node.TEXT_NODE) {
                        const textContent = node.textContent;
                        if (textContent.trim() !== '') {
                            const words = textContent.match(/\S+\s*|\S/g) || [];
                            words.forEach(word => {
                                if (word.trim() !== '') {
                                    typingChunks.push({ type: 'text_word', content: word });
                                } else if (word.length > 0) {
                                    typingChunks.push({ type: 'text_whitespace', content: word });
                                }
                            });
                        } else if (textContent.length > 0) {
                            typingChunks.push({ type: 'text_whitespace', content: textContent });
                        }
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        const tagName = node.tagName.toLowerCase();
                        if (tagName === 'img') {
                            typingChunks.push({ type: 'element_immediate', element: node.cloneNode(true) });
                        } else if (tagName === 'br') {
                            typingChunks.push({ type: 'br_tag' });
                        } else {
                            typingChunks.push({ type: 'open_tag', tagName: tagName, attributes: Array.from(node.attributes) });
                            Array.from(node.childNodes).forEach(extractChunksRecursive);
                            typingChunks.push({ type: 'close_tag', tagName: tagName });
                        }
                    }
                }

                Array.from(tempContainer.childNodes).forEach(extractChunksRecursive);
                let currentContextElement = messageDiv;

                for (let i = 0; i < typingChunks.length; i++) {
                    const chunk = typingChunks[i];
                    if (chunk.type === 'element_immediate') {
                        currentContextElement.appendChild(chunk.element);
                    } else {
                        await new Promise(resolve => setTimeout(resolve, TYPING_CHUNK_DELAY_MS));
                        if (chunk.type === 'text_word') {
                            const wordSpan = document.createElement('span');
                            wordSpan.className = 'message-text-chunk-animated';
                            wordSpan.textContent = chunk.content;
                            currentContextElement.appendChild(wordSpan);
                        } else if (chunk.type === 'text_whitespace') {
                            currentContextElement.appendChild(document.createTextNode(chunk.content));
                        } else if (chunk.type === 'br_tag') {
                            currentContextElement.appendChild(document.createElement('br'));
                        } else if (chunk.type === 'open_tag') {
                            const newElement = document.createElement(chunk.tagName);
                            chunk.attributes.forEach(attr => newElement.setAttribute(attr.name, attr.value));
                            currentContextElement.appendChild(newElement);
                            currentContextElement = newElement;
                        } else if (chunk.type === 'close_tag') {
                            if (currentContextElement.tagName.toLowerCase() === chunk.tagName && currentContextElement.parentElement && currentContextElement !== messageDiv) {
                                currentContextElement = currentContextElement.parentElement;
                            }
                        }
                    }
                    if (i % 3 === 0 || i === typingChunks.length - 1) {
                         requestAnimationFrame(scrollToBottom);
                    }
                }
                
                requestAnimationFrame(() => {
                    adjustChatMessagesPadding();
                    scrollToBottom();
                });
                console.log("[Message] 봇 메시지(루비) 타이핑 완료.");
                resolveAllMessagesAdded();
            }

        } else if (type === 'system') {
            messageDiv.classList.add('system-message');
            messageDiv.textContent = typeof data === 'string' ? data : data.text;
            if (chatMessages) chatMessages.appendChild(messageDiv);
            requestAnimationFrame(() => {
                adjustChatMessagesPadding();
                scrollToBottom();
                console.log("[Message] 시스템 메시지 DOM 추가 완료.");
                resolveAllMessagesAdded();
            });
        } else {
            console.warn(`[Message] 알 수 없는 메시지 타입: ${type}`);
            resolveAllMessagesAdded(); // 알 수 없는 타입도 일단 Promise는 resolve
        }
    });
}

function updateBoneCountDisplay() {
    const userBoneCountEl = document.getElementById('userBoneCount');
    if (userBoneCountEl && userProfile && typeof userProfile.bones === 'number') {
        userBoneCountEl.textContent = userProfile.bones;
        console.log(`[UI] 뼈다귀 개수 UI 업데이트: ${userProfile.bones}개`);
    } else {
        console.warn("[UI] 뼈다귀 개수 UI 업데이트 실패: 요소 또는 프로필 데이터 없음.");
    }
}

function updateSampleAnswers(answers = [], importance = 'low', isConfirmationStage = false, promptMessage = null) {
    return new Promise((resolve) => {
        console.log(`[SampleAnswers] 업데이트 시작. 요청된 중요도: ${importance}, 현재 클래스: ${sampleAnswersContainer.className}`);
        const existingElements = Array.from(sampleAnswersContainer.querySelectorAll('.sample-answer-btn, .sample-answer-prompt'));
        const buttonFadeOutDuration = 200; 

        if (importance === 'high') {
            if (!sampleAnswersContainer.classList.contains('high-importance')) {
                sampleAnswersContainer.classList.add('high-importance');
                console.log('[SampleAnswers] "high-importance" 클래스 추가됨. CSS transition 발동.');
            }
        } else {
            if (sampleAnswersContainer.classList.contains('high-importance')) {
                sampleAnswersContainer.classList.remove('high-importance');
                console.log('[SampleAnswers] "high-importance" 클래스 제거됨. CSS transition 발동.');
            }
        }

        function addAndAnimateNewButtons() {
            sampleAnswersContainer.innerHTML = '';
            console.log('[SampleAnswers] addAndAnimateNewButtons: 컨테이너 내부 비워짐 (새 버튼 추가 직전).');

            if (isConfirmationStage && promptMessage) {
                const promptDiv = document.createElement('div');
                promptDiv.className = 'sample-answer-prompt';
                promptDiv.innerHTML = promptMessage; 
                sampleAnswersContainer.appendChild(promptDiv);
                console.log('[SampleAnswers] addAndAnimateNewButtons: 프롬프트 추가됨.');
            }

            if (answers.length > 0) {
                if (!sampleAnswersContainer.classList.contains('has-buttons')) {
                    sampleAnswersContainer.classList.add('has-buttons');
                }
                answers.forEach((answerData, index) => {
                    const button = document.createElement('button');
                    button.classList.add('sample-answer-btn');
                    const answerText = answerData.text;
                    const answerValue = answerData.value || answerText; // value가 없으면 text를 사용
                    button.dataset.value = answerValue;
                    button.dataset.actionType = answerData.actionType || 'message';
                    if (answerData.cost !== undefined) button.dataset.cost = answerData.cost;
                    
                    const contentWrapper = document.createElement('span');
                    contentWrapper.className = 'btn-content-wrapper';

                    if (answerData.displayCostIcon) {
                        const costIcon = document.createElement('img');
                        costIcon.alt = '';
                        costIcon.className = 'cost-icon';
                        if (answerData.iconType === 'free') {
                            costIcon.src = 'img/icon/free_tag.png';
                            costIcon.alt = '무료';
                            costIcon.classList.add('free-icon');
                        } else if (answerData.iconType === 'bone') {
                            costIcon.src = 'img/icon/bone_inline.png';
                            costIcon.alt = '뼈다귀';
                        }
                        if (costIcon.src) contentWrapper.appendChild(costIcon);

                        if (answerData.displayCostText && answerData.cost > 0) {
                            const costTextSpan = document.createElement('span');
                            costTextSpan.className = 'cost-text';
                            costTextSpan.textContent = `-${answerData.cost}`;
                            contentWrapper.appendChild(costTextSpan);
                        }
                        if (costIcon.src || (answerData.displayCostText && answerData.cost > 0)) {
                             contentWrapper.appendChild(document.createTextNode('\u00A0'));
                        }
                    }

                    const textSpan = document.createElement('span');
                    textSpan.className = 'btn-text';
                    textSpan.textContent = answerText;
                    contentWrapper.appendChild(textSpan);
                    button.appendChild(contentWrapper);

                    button.style.animationDelay = `${index * 70}ms`;
                    
                    if (answerData.actionType === 'info_disabled' || answerData.disabled === true) {
                        button.disabled = true;
                        button.classList.add('info-disabled-btn'); 
                        // CSS에서 pointer-events: none; 을 info-disabled-btn에 적용하여 클릭 이벤트 자체를 막도록 함
                    } else {
                        button.disabled = isLoadingBotResponse;
                    }
                    
                    sampleAnswersContainer.appendChild(button);
                });
            } else {
                if (sampleAnswersContainer.classList.contains('has-buttons')) {
                    sampleAnswersContainer.classList.remove('has-buttons');
                }
            }
            
            requestAnimationFrame(adjustChatMessagesPadding);
            console.log(`[SampleAnswers] addAndAnimateNewButtons 최종 완료. 현재 컨테이너 클래스: ${sampleAnswersContainer.className}`);
            resolve();
        }

        if (existingElements.length > 0) {
            console.log(`[SampleAnswers] 기존 요소 ${existingElements.length}개 페이드 아웃 시작.`);
            existingElements.forEach(el => el.classList.add('fade-out'));
            
            setTimeout(() => {
                console.log('[SampleAnswers] setTimeout: 기존 요소 제거 후 새 버튼 추가 시작.');
                addAndAnimateNewButtons();
            }, buttonFadeOutDuration);
        } else {
            console.log('[SampleAnswers] 기존 요소 없음, 바로 새 버튼 추가 시작.');
            addAndAnimateNewButtons();
        }
    });
}




// --- simulateBotResponse 헬퍼 함수들 ---

async function handleSyncTypeTestActions(userMessageText, buttonData) {
    let responseData = {};
    if (userMessageText === "action_submit_sync_test") {
        showFullScreenLoader("싱크타입 분석 중입니다. 잠시만 기다려주세요...");
        let testAnswersContent = "주관식 답변:\n";
        for (const qId in userProfile.싱크테스트답변.subjective_answers) {
            const questionText = QUESTIONS_DATA.subjective.find(q => q.id === qId)?.questionText || qId;
            testAnswersContent += `- ${questionText}: ${userProfile.싱크테스트답변.subjective_answers[qId]}\n`;
        }
        testAnswersContent += "\n객관식 답변 (점수):\n";
        for (const qId in userProfile.싱크테스트답변.objective_scores) {
             const questionText = QUESTIONS_DATA.objective.find(q => q.id === qId)?.questionText || qId;
            testAnswersContent += `- ${questionText}: ${userProfile.싱크테스트답변.objective_scores[qId]}점\n`;
        }
        const fullPrompt = LOADED_PROMPT_SYNC_TYPE_TEST + "\n" + testAnswersContent; 
        
        try {
            const apiResponseObj = await callChatAPI(fullPrompt); 
            const resultText = await apiResponseObj.text(); 
            const parsedResult = JSON.parse(resultText); 
            console.log("[SyncTestAPI] API 응답 파싱 결과:", parsedResult);

            userProfile.결정된싱크타입 = parsedResult.결정된싱크타입 || userProfile.결정된싱크타입;
            userProfile.사용자소속성운 = parsedResult.사용자소속성운 || userProfile.사용자소속성운;
            userProfile.맞춤싱크타입이름 = parsedResult.맞춤싱크타입이름 || userProfile.맞춤싱크타입이름;
            userProfile.overviewText = parsedResult.overviewText || userProfile.overviewText;
            userProfile.DISC_D_점수 = parsedResult.DISC_D_점수 !== undefined ? parsedResult.DISC_D_점수 : userProfile.DISC_D_점수;
            userProfile.DISC_I_점수 = parsedResult.DISC_I_점수 !== undefined ? parsedResult.DISC_I_점수 : userProfile.DISC_I_점수;
            userProfile.DISC_S_점수 = parsedResult.DISC_S_점수 !== undefined ? parsedResult.DISC_S_점수 : userProfile.DISC_S_점수;
            userProfile.DISC_C_점수 = parsedResult.DISC_C_점수 !== undefined ? parsedResult.DISC_C_점수 : userProfile.DISC_C_점수;
            userProfile.신경성 = parsedResult.신경성 !== undefined ? parsedResult.신경성 : userProfile.신경성;
            userProfile.외향성 = parsedResult.외향성 !== undefined ? parsedResult.외향성 : userProfile.외향성;
            userProfile.개방성 = parsedResult.개방성 !== undefined ? parsedResult.개방성 : userProfile.개방성;
            userProfile.우호성 = parsedResult.우호성 !== undefined ? parsedResult.우호성 : userProfile.우호성;
            userProfile.성실성 = parsedResult.성실성 !== undefined ? parsedResult.성실성 : userProfile.성실성;
            userProfile.싱크타입단계 = "결정됨";
            userProfile.현재테스트종류 = null; 
            userProfile.현재질문ID = null;
            generateSyncTypeData(); 
            saveUserProfileToLocalStorage(userProfile);
            
            responseData = {
                assistantmsg: `${userProfile.사용자애칭}님의 싱크타입 분석이 완료되었습니다!<br>'더보기 > 싱크타입' 메뉴에서 자세한 결과를 확인해보세요.<br><br>이제 선택하신 타로에 대한 해석을 진행할게요.`,
                sampleAnswers: [ { text: "네, 타로 해석 보여주세요", value: "action_proceed_tarot_interpretation_after_sync", actionType: 'message' } ],
                importance: 'low', disableChatInput: false,
                user_profile_update: { "결정된싱크타입": userProfile.결정된싱크타입, "싱크타입단계": userProfile.싱크타입단계 }
            };
        } catch (error) {
            console.error("[SyncTestAPI] API 호출 또는 처리 중 오류:", error);
            responseData = {
                assistantmsg: "싱크타입 분석 중 오류가 발생했어요. 다시 시도해주시겠어요?",
                sampleAnswers: [
                    { text: "다시 분석 요청하기", value: "action_submit_sync_test", actionType: 'confirm_action' },
                    { text: "나중에 할래요", value: "action_skip_sync_test_after_error", actionType: 'cancel_action' }
                ],
                importance: 'high', disableChatInput: false, isConfirmationStage: true, user_profile_update: {}
            };
        } finally {
            hideFullScreenLoader(); 
        }
    } else if (userProfile.현재테스트종류 === 'subjective' && userProfile.현재질문ID && userMessageText !== "action_start_sync_type_test" && !(buttonData && buttonData.actionType === 'info_disabled') && userMessageText !== "placeholder_disabled") {
        const currentQuestionId = userProfile.현재질문ID;
        userProfile.싱크테스트답변.subjective_answers[currentQuestionId] = userMessageText;
        console.log(`[SyncTest] 주관식 답변 (${currentQuestionId}): ${userMessageText}`);
        const subjectiveQuestions = QUESTIONS_DATA.subjective;
        const currentIndex = subjectiveQuestions.findIndex(q => q.id === currentQuestionId);
        if (currentIndex < subjectiveQuestions.length - 1) {
            const nextQuestion = subjectiveQuestions[currentIndex + 1];
            userProfile.현재질문ID = nextQuestion.id;
            responseData = {
                assistantmsg: `<b>다음 질문입니다:</b><br>${nextQuestion.questionText}`,
                sampleAnswers: [{ text: "채팅으로 답변해주세요", value: "placeholder_disabled", actionType: 'info_disabled', disabled: true }],
                importance: 'low', disableChatInput: false, 
                user_profile_update: { "현재질문ID": userProfile.현재질문ID, "싱크테스트답변": userProfile.싱크테스트답변 }
            };
        } else {
            userProfile.현재테스트종류 = 'objective';
            userProfile.현재질문ID = QUESTIONS_DATA.objective[0].id; 
            const firstObjectiveQuestion = QUESTIONS_DATA.objective.find(q => q.id === userProfile.현재질문ID);
            responseData = {
                assistantmsg: `주관식 질문이 모두 끝났습니다. 감사합니다.<br><br>이제 객관식 질문을 시작하겠습니다.<br><b>첫 번째 객관식 질문입니다:</b><br>${firstObjectiveQuestion.questionText}`,
                sampleAnswers: firstObjectiveQuestion.options.map(opt => ({
                    text: opt.text, value: `${userProfile.현재질문ID}_${opt.score}`, actionType: 'objective_answer'
                })),
                importance: 'low', disableChatInput: true, 
                user_profile_update: { "현재테스트종류": userProfile.현재테스트종류, "현재질문ID": userProfile.현재질문ID, "싱크테스트답변": userProfile.싱크테스트답변 }
            };
        }
    } else if (buttonData && buttonData.actionType === 'objective_answer' && userProfile.현재테스트종류 === 'objective') {
        const parts = userMessageText.split('_');
        const questionIdFromButton = parts.slice(0, -1).join('_'); 
        const scoreStr = parts.pop(); 
        const score = parseInt(scoreStr, 10);
        const currentQuestionId = userProfile.현재질문ID;
        console.log(`[SyncTest] 객관식 버튼 클릭. value: "${userMessageText}", 파싱된 questionId: "${questionIdFromButton}", 파싱된 score: ${score}`);
        if (questionIdFromButton === currentQuestionId) { 
            userProfile.싱크테스트답변.objective_scores[currentQuestionId] = score;
            console.log(`[SyncTest] 객관식 답변 저장 (${currentQuestionId}): ${score}점`);
            const objectiveQuestions = QUESTIONS_DATA.objective;
            const currentIndex = objectiveQuestions.findIndex(q => q.id === currentQuestionId);
            if (currentIndex < objectiveQuestions.length - 1) {
                const nextQuestion = objectiveQuestions[currentIndex + 1];
                userProfile.현재질문ID = nextQuestion.id;
                responseData = {
                    assistantmsg: `<b>다음 객관식 질문입니다:</b><br>${nextQuestion.questionText}`,
                    sampleAnswers: nextQuestion.options.map(opt => ({
                        text: opt.text, value: `${userProfile.현재질문ID}_${opt.score}`, actionType: 'objective_answer'
                    })),
                    importance: 'low', disableChatInput: true, 
                    user_profile_update: { "현재질문ID": userProfile.현재질문ID, "싱크테스트답변": userProfile.싱크테스트답변 }
                };
            } else {
                responseData = {
                    assistantmsg: "모든 질문에 답변해주셔서 감사합니다!<br>싱크타입 분석 결과를 확인하시려면 '결과 제출하기' 버튼을 눌러주세요.<br>테스트를 다시 진행하고 싶으시면 '처음부터 다시하기'를 선택해주세요.",
                    importance: 'high', isConfirmationStage: true,
                    sampleAnswers: [
                        { text: "결과 제출하기", value: "action_submit_sync_test", actionType: 'confirm_action', cost:0, displayCostIcon: true, iconType:'free' },
                        { text: "처음부터 다시하기", value: "action_restart_sync_test_full", actionType: 'cancel_action' }
                    ],
                    disableChatInput: false, 
                    user_profile_update: { "싱크테스트답변": userProfile.싱크테스트답변 } 
                };
            }
        } else {
            const currentQ = QUESTIONS_DATA.objective.find(q => q.id === currentQuestionId);
             responseData = {
                assistantmsg: `<b>현재 질문입니다:</b><br>${currentQ.questionText}`,
                sampleAnswers: currentQ.options.map(opt => ({
                    text: opt.text, value: `${currentQuestionId}_${opt.score}`, actionType: 'objective_answer'
                })),
                importance: 'low', disableChatInput: true, user_profile_update: {} 
            };
            console.warn(`[SyncTest] 객관식 답변의 질문 ID(${questionIdFromButton})와 현재 질문 ID(${currentQuestionId}) 불일치. 버튼 value: ${userMessageText}`);
        }
    } else if (userMessageText === "action_restart_sync_test_full") {
        userProfile.시나리오 = (userProfile.시나리오.split("_started")[0].split("_restarted")[0] || "sync_test") + "_restarted";
        userProfile.현재테스트종류 = "subjective";
        userProfile.현재질문ID = QUESTIONS_DATA.subjective[0].id;
        userProfile.싱크테스트답변 = { subjective_answers: {}, objective_scores: {} }; 
        saveUserProfileToLocalStorage(userProfile); 
        responseData = {
            assistantmsg: `알겠습니다. 싱크타입 테스트를 처음부터 다시 시작하겠습니다.<br><br><b>첫 번째 질문입니다:</b><br>${QUESTIONS_DATA.subjective[0].questionText}`,
            sampleAnswers: [{ text: "채팅으로 답변해주세요", value: "placeholder_disabled", actionType: 'info_disabled', disabled: true }],
            importance: 'low', disableChatInput: false,
            user_profile_update: { "시나리오": userProfile.시나리오, "현재테스트종류": userProfile.현재테스트종류, "현재질문ID": userProfile.현재질문ID, "싱크테스트답변": userProfile.싱크테스트답변 }
        };
    }
    return responseData;
}

async function handleTarotSetupActions(userMessageText, buttonData, selectedTarotTopicName, tarotInitiationMessages) {
    let responseData = {};
    if (tarotInitiationMessages.includes(userMessageText) && selectedTarotTopicName) {
        userProfile.시나리오 = `tarot_topic_${userMessageText.replace(/\s+/g, '_')}`;
        userProfile.hasUsedAddTwoCards = false; 
        saveUserProfileToLocalStorage(userProfile);
        responseData = {
            assistantmsg: `네, <b>${selectedTarotTopicName}</b> 타로를 진행하겠습니다.<br>카드는 몇 장 뽑으시겠어요?`,
            tarocardview: false, cards_to_select: null,
            sampleAnswers: [
                { text: "1장 뽑기", value: "action_select_one_card_for_topic", actionType: 'choice', cost:0, displayCostIcon: true, iconType:'free' },
                { text: "3장 뽑기", value: "action_select_three_cards_for_topic", actionType: 'choice', cost:2, displayCostIcon: true, iconType:'bone' }
            ],
            importance: 'low', disableChatInput: true, 
            user_profile_update: { "시나리오": userProfile.시나리오, "hasUsedAddTwoCards": false }
        };
    } else if (userMessageText === "action_select_one_card_for_topic") {
        responseData = {
            tarocardview: true, cards_to_select: 1, sampleAnswers: [],
            importance: 'low', disableChatInput: true, 
            user_profile_update: { "시나리오": userProfile.시나리오 + "_single_pick" },
            systemMessageOnConfirm: "1장을 선택하셨습니다. 카드를 골라주세요."
        };
    } else if (userMessageText === "action_select_three_cards_for_topic") {
         responseData = {
            assistantmsg: `<b>3장 뽑기</b> 시 <img src="img/icon/bone_inline.png" alt="뼈다귀" class="inline-bone-icon"><b>2개</b>가 사용됩니다. 진행하시겠어요?`,
            importance: 'high', isConfirmationStage: true,
            sampleAnswers: [
                { text: `사용`, value: "action_confirm_three_cards_cost_for_topic", cost: 2, displayCostIcon: true, displayCostText: true, iconType: 'bone', actionType: 'confirm_cost' },
                { text: "취소", value: "action_cancel_cost_confirmation_for_topic", actionType: 'cancel_cost' }
            ],
            disableChatInput: true, user_profile_update: {}
        };
    } else if (userMessageText === "action_confirm_three_cards_cost_for_topic") {
        if (userProfile.bones >= 2) {
            userProfile.bones -= 2;
            updateBoneCountDisplay();
            saveUserProfileToLocalStorage(userProfile);
            responseData = {
                tarocardview: true, cards_to_select: 3, sampleAnswers: [],
                importance: 'low', disableChatInput: true, 
                user_profile_update: { "시나리오": userProfile.시나리오 + "_triple_pick", "bones": userProfile.bones },
                systemMessageOnConfirm: "3장을 선택하셨습니다. 카드를 골라주세요. (뼈다귀 -2)"
            };
        } else { 
            responseData = {
                assistantmsg: "이런! 뼈다귀가 부족해요. (현재 <img src='img/icon/bone_inline.png' alt='뼈다귀' class='inline-bone-icon'>" + userProfile.bones + "개)<br>1장만 무료로 보시겠어요?",
                tarocardview: false, cards_to_select: null, importance: 'low', disableChatInput: true, 
                sampleAnswers: [
                    { text: "1장 뽑기 (무료)", value: "action_select_one_card_for_topic", cost: 0, displayCostIcon: true, iconType: 'free', actionType: 'choice' },
                    { text: "다음에 할게요", value: "action_cancel_ 부족", actionType: 'message' }
                ], user_profile_update: {}
            };
        }
    } else if (userMessageText === "action_cancel_cost_confirmation_for_topic") {
        const topicNameToDisplay = selectedTarotTopicName || (userProfile.시나리오 ? userProfile.시나리오.split("_pick")[0].replace("tarot_topic_", "").replace(/_/g, " ") : "선택하신");
        responseData = {
            assistantmsg: `네, 알겠습니다. ${topicNameToDisplay} 타로 카드는 몇 장 뽑으시겠어요?`,
            tarocardview: false, cards_to_select: null,
            sampleAnswers: [
                { text: "1장 뽑기", value: "action_select_one_card_for_topic", actionType: 'choice', cost:0, displayCostIcon: true, iconType:'free' },
                { text: "3장 뽑기", value: "action_select_three_cards_for_topic", actionType: 'choice', cost:2, displayCostIcon: true, iconType:'bone' }
            ],
            importance: 'low', disableChatInput: true, user_profile_update: {}
        };
    } else if (userMessageText === "카드 뽑기" || userMessageText === "카드뽑을래") {
         userProfile.hasUsedAddTwoCards = false; 
         saveUserProfileToLocalStorage(userProfile);
        responseData = {
            assistantmsg: "카드를 몇 장 뽑으시겠어요?",
            tarocardview: false, cards_to_select: null,
            sampleAnswers: [
                { text: "1장", value: SELECT_ONE_CARD_ACTION, cost: 0, displayCostIcon: true, iconType: 'free', actionType: 'choice' }, 
                { text: "3장", value: SELECT_THREE_CARDS_ACTION, cost: 2, displayCostIcon: true, iconType: 'bone', actionType: 'choice' }  
            ],
            importance: 'low', disableChatInput: true, user_profile_update: { "hasUsedAddTwoCards": false }
        };
    } else if (userMessageText === SELECT_ONE_CARD_ACTION) { 
        responseData = {
            tarocardview: true, cards_to_select: 1, sampleAnswers: [],
            importance: 'low', disableChatInput: true,
            user_profile_update: { "시나리오": "tarot_single_pick_general" },
            systemMessageOnConfirm: "1장을 선택하셨습니다. 카드를 골라주세요."
        };
    } else if (userMessageText === SELECT_THREE_CARDS_ACTION) { 
        responseData = {
            assistantmsg: `<b>3장</b> 선택 시 <img src="img/icon/bone_inline.png" alt="뼈다귀" class="inline-bone-icon"><b>2개</b>가 사용됩니다. 진행하시겠어요?`,
            importance: 'high', isConfirmationStage: true,
            sampleAnswers: [
                { text: `사용`, value: CONFIRM_THREE_CARDS_COST_ACTION, cost: 2, displayCostIcon: true, displayCostText: true, iconType: 'bone', actionType: 'confirm_cost' }, 
                { text: "취소", value: CANCEL_COST_CONFIRMATION_ACTION, actionType: 'cancel_cost' } 
            ],
            disableChatInput: true, user_profile_update: {}
        };
    } else if (userMessageText === CONFIRM_THREE_CARDS_COST_ACTION) { 
        if (userProfile.bones >= 2) {
            userProfile.bones -= 2;
            updateBoneCountDisplay();
            saveUserProfileToLocalStorage(userProfile);
            responseData = {
                tarocardview: true, cards_to_select: 3, sampleAnswers: [],
                importance: 'low', disableChatInput: true,
                user_profile_update: { "시나리오": "tarot_triple_pick_general", "bones": userProfile.bones },
                systemMessageOnConfirm: "3장을 선택하셨습니다. 카드를 골라주세요. (뼈다귀 -2)"
            };
        } else { 
             responseData = {
                assistantmsg: "이런! 뼈다귀가 부족해요. (현재 <img src='img/icon/bone_inline.png' alt='뼈다귀' class='inline-bone-icon'>" + userProfile.bones + "개)<br>1장만 무료로 보시겠어요?",
                tarocardview: false, cards_to_select: null, importance: 'low', disableChatInput: true,
                sampleAnswers: [
                    { text: "1장", value: SELECT_ONE_CARD_ACTION, cost: 0, displayCostIcon: true, iconType: 'free', actionType: 'choice' }, 
                    { text: "다음에 할게요", value: "action_cancel_ 부족", actionType: 'message' }
                ], user_profile_update: {}
            };
        }
    } else if (userMessageText === CANCEL_COST_CONFIRMATION_ACTION) { 
         responseData = {
            assistantmsg: "카드를 몇 장 뽑으시겠어요?",
            tarocardview: false, cards_to_select: null,
            sampleAnswers: [
                { text: "1장", value: SELECT_ONE_CARD_ACTION, cost: 0, displayCostIcon: true, iconType: 'free', actionType: 'choice' }, 
                { text: "3장", value: SELECT_THREE_CARDS_ACTION, cost: 2, displayCostIcon: true, iconType: 'bone', actionType: 'choice' }  
            ],
            importance: 'low', disableChatInput: true, user_profile_update: {}
        };
    }
    return responseData;
}

async function handleTarotCardSelectionCompleteActions(userMessageText, buttonData) {
    let responseData = {};
    if (userMessageText === "카드 선택 완료") {
        console.log("[BotResponse] 카드 선택 완료. userProfile.결정된싱크타입:", userProfile.결정된싱크타입);
        if (!userProfile.결정된싱크타입 || userProfile.싱크타입단계 === "미결정") {
            userProfile.시나리오 = (userProfile.시나리오 || "tarot_general") + "_propose_sync_test";
            saveUserProfileToLocalStorage(userProfile);
            responseData = {
                assistantmsg: `아직 ${userProfile.사용자애칭}님의 싱크타입이 결정되지 않았네요!<br>싱크타입을 알면 더 정확한 타로 해석에 도움이 될 수 있어요.<br><br><b>싱크타입 테스트</b>는 무료이며, 약 2분 정도 소요됩니다. 진행하시겠어요?`,
                importance: 'high', isConfirmationStage: true,
                sampleAnswers: [
                    { text: "네, 테스트 할래요", value: "action_start_sync_type_test", actionType: 'confirm_action', cost:0, displayCostIcon: true, iconType:'free' },
                    { text: "아니오, 다음에 할게요", value: "action_skip_sync_type_test", actionType: 'cancel_action' }
                ],
                disableChatInput: true, 
                user_profile_update: { "시나리오": userProfile.시나리오 }
            };
        } else {
            // 싱크타입 이미 결정됨 -> 바로 타로 해석 진행 요청 (내부 액션 사용)
            return { internalAction: "action_proceed_tarot_interpretation" }; 
        }
    } else if (userMessageText === "action_start_sync_type_test") {
        userProfile.시나리오 = (userProfile.시나리오.replace("_propose_sync_test","") || "sync_test") + "_started";
        userProfile.현재테스트종류 = "subjective"; 
        userProfile.현재질문ID = QUESTIONS_DATA.subjective[0].id; 
        userProfile.싱크테스트답변 = { subjective_answers: {}, objective_scores: {} }; 
        saveUserProfileToLocalStorage(userProfile);
        responseData = {
            assistantmsg: `좋아요! ${userProfile.사용자애칭}님의 싱크타입을 알아보기 위한 테스트를 시작하겠습니다.<br>먼저 몇 가지 질문을 드릴게요. 편하게 답변해주세요. <br><br><b>첫 번째 질문입니다:</b><br>${QUESTIONS_DATA.subjective[0].questionText}`,
            sampleAnswers: [ { text: "채팅으로 답변해주세요", value: "placeholder_disabled", actionType: 'info_disabled', disabled: true } ], 
            importance: 'low', disableChatInput: false,
            user_profile_update: { "시나리오": userProfile.시나리오, "현재테스트종류": userProfile.현재테스트종류, "현재질문ID": userProfile.현재질문ID, "싱크테스트답변": userProfile.싱크테스트답변 }
        };
    } else if (userMessageText === "action_skip_sync_type_test") {
        // "아니오, 다음에 할게요" 선택 시, 바로 타로 해석 진행 요청 (내부 액션 사용)
        console.log("[BotResponse] 'action_skip_sync_type_test' 수신. 타로 해석으로 진행.");
        return { internalAction: "action_proceed_tarot_interpretation" };
    }
    // action_proceed_tarot_interpretation_after_sync는 handleTarotInterpretationActions에서 직접 처리
    return responseData;
}
async function handleTarotInterpretationActions(userMessageText, buttonData, selectedTarotTopicName) {
    let responseData = {};
    let 진행메시지 = "";
    let currentScenario = userProfile.시나리오 || "tarot_general";

    if (userMessageText === "action_skip_sync_type_test") {
        currentScenario = currentScenario.replace("_propose_sync_test","") + "_skipped_sync_test";
        진행메시지 = "싱크타입 테스트를 건너뛰고 타로 해석을 바로 진행합니다.";
    } else if (userMessageText === "action_proceed_tarot_interpretation_after_sync") {
        currentScenario = currentScenario.replace("_started","").replace("_restarted","").replace("_propose_sync_test","") + "_after_sync_test";
        진행메시지 = "싱크타입 분석 완료! 이제 타로 해석을 진행합니다.";
    } else if (userMessageText === "action_proceed_tarot_interpretation") { 
         진행메시지 = "타로 해석을 진행합니다.";
    } else {
        return {}; // 이 함수에서 처리할 액션이 아님
    }
    userProfile.시나리오 = currentScenario;
    saveUserProfileToLocalStorage(userProfile); 
    console.log(`[BotResponse] ${진행메시지} 시나리오: ${userProfile.시나리오}`);
    
    showFullScreenLoader("타로 해석을 준비 중입니다..."); 
    
    let tarotChoicePrompt = LOADED_PROMPT_TAROT_CHOICE;
    tarotChoicePrompt += `\n타로 상담 주제: ${selectedTarotTopicName || '알 수 없음'}`; 
    tarotChoicePrompt += `\n선택된 카드: ${userProfile.선택된타로카드들.join(', ')}`;

    try {
        const choiceApiResponseObj = await callChatAPI(tarotChoicePrompt);
        const choiceResultText = await choiceApiResponseObj.text();
        const parsedChoiceResult = JSON.parse(choiceResultText);
        
        userProfile.tarotResult = { 
            cardInterpretations: parsedChoiceResult.cardInterpretations 
        };
        saveUserProfileToLocalStorage(userProfile); 
        console.log("[TarotChoiceAPI] API 응답 파싱 결과 (overallAdvice 제외된 tarotResult):", userProfile.tarotResult);

        let simpleChatHistory = [];

        const transPrompt = LOADED_PROMPT_TAROT_TRANS + `\n## 이전 대화 요약 (카드 선택 결과):\n${JSON.stringify(userProfile.tarotResult, null, 2)}\n## 사용자 질문:\n타로 해석을 부탁드려요.`;
        const transApiResponseObj = await callChatAPI(transPrompt, simpleChatHistory);
        const finalInterpretationText = await transApiResponseObj.text();
        
        let assistantInterpretationHTML = "";
        if (userProfile.tarotResult && userProfile.tarotResult.cardInterpretations) {
            let titleCardTypeText = "";
            // userProfile.선택된타로카드들.length 로 현재 최종 선택된 카드 수를 알 수 있음
            // userProfile.시나리오 를 통해 어떤 과정을 거쳤는지 파악

            if (currentScenario.includes("_add_two_pick")) { // "2장 더 뽑기" 시나리오 (최종 3장)
                 titleCardTypeText = "추가 타로 해석";
            } else if (userProfile.선택된타로카드들.length === 1 || currentScenario.includes("_single_pick")) { // 1장 선택 시
                titleCardTypeText = "싱글 타로 해석";
            } else if (userProfile.선택된타로카드들.length === 3 || currentScenario.includes("_triple_pick")) { // 처음부터 3장 선택 시
                titleCardTypeText = "트리플 타로 해석";
            } else if (userProfile.선택된타로카드들.length > 0) { // 그 외의 경우 (예: cards_to_select 가 다른 값으로 설정된 경우)
                 titleCardTypeText = `(${userProfile.선택된타로카드들.length}장) 타로 해석`; // 일반적인 장수 표시
            } else {
                titleCardTypeText = "타로 해석"; // 카드 정보가 없을 경우 기본
            }


            assistantInterpretationHTML += `<div class="assistant-interpretation-container">`;
            assistantInterpretationHTML += `<div class="interpretation-title-text"><b>'${selectedTarotTopicName || '선택하신 주제'}' ${titleCardTypeText}</b></div><br>`;
            userProfile.tarotResult.cardInterpretations.forEach((interp, index) => {
                let cardDisplayName = `카드 정보 없음 (${interp.cardId})`; 
                if (TAROT_CARD_DATA && TAROT_CARD_DATA[interp.cardId] && TAROT_CARD_DATA[interp.cardId].name) {
                    cardDisplayName = TAROT_CARD_DATA[interp.cardId].name;
                } else {
                    const parts = interp.cardId.split('_');
                    let tempName = "";
                    if (parts.length >= 3) {
                        if (parts[0] === "major") {
                            tempName = `메이저 ${parts[1]}번 ${parts[2].charAt(0).toUpperCase() + parts[2].slice(1)}`;
                        } else {
                            tempName = `${parts[0].charAt(0).toUpperCase() + parts[0].slice(1)} ${parts[1]}번`;
                        }
                        if (parts.includes("reversed")) tempName += " (역방향)";
                        else if (parts.includes("upright")) tempName += " (정방향)";
                    } else {
                        tempName = interp.cardId.replace(/_/g, " "); 
                    }
                    cardDisplayName = tempName;
                    console.warn(`[TarotInterpretation] TAROT_CARD_DATA에 ${interp.cardId}의 name 정보가 없어 임시 이름 사용: ${cardDisplayName}`);
                }

                let imageNameForFile = interp.cardId.replace('_reversed', '_upright');
                if (!imageNameForFile.endsWith('_upright')) imageNameForFile += '_upright';
                const cardImageUrl = `img/tarot/${imageNameForFile}.png`;
                
                assistantInterpretationHTML += `<img src="${cardImageUrl}" alt="${cardDisplayName}" class="chat-embedded-image">`;
                assistantInterpretationHTML += `<div class="interpretation-text" style="text-align: center; font-size: 0.9em; margin-bottom: 10px;"><b>${index + 1}번 카드 - ${cardDisplayName}</b><br>(${(interp.keyword || '정보없음')})</div>`;
                assistantInterpretationHTML += `<div class="interpretation-text">${(interp.briefMeaning || '해석 준비 중').replace(/\n/g, '<br>')}</div><br>`;
            });
            assistantInterpretationHTML += `</div>`;
        }
        
        let nextSampleAnswers = [];
        if (userProfile.선택된타로카드들.length === 1 && !userProfile.hasUsedAddTwoCards) { 
            nextSampleAnswers.push({ text: "2장 더 뽑기", value: "action_add_two_cards_phase1", actionType: 'message', cost:2, displayCostIcon: true, iconType:'bone' });
        }
        nextSampleAnswers.push({ text: "깊은 상담 요청하기", value: "action_deep_advice_phase1", actionType: 'message', cost:1, displayCostIcon: true, iconType:'bone' });

        responseData = {
            assistant_interpretation: assistantInterpretationHTML, 
            assistantmsg: finalInterpretationText, 
            tarocardview: false, cards_to_select: null,
            sampleAnswers: nextSampleAnswers,
            importance: 'low', disableChatInput: true, 
            user_profile_update: { "tarotResult": userProfile.tarotResult } 
        };
    } catch (error) {
        console.error("[TarotInterpretationAPI] API 호출 또는 처리 중 오류:", error);
        responseData = {
            assistantmsg: "타로 해석 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.",
            sampleAnswers: [ { text: "알겠습니다", value: "error_acknowledged_tarot_interp", actionType: 'message'} ],
            importance: 'low', disableChatInput: false, user_profile_update: {}
        };
    } finally {
        hideFullScreenLoader();
    }
    return responseData;
}
async function handleAddTwoCardsActions(userMessageText, buttonData) {
    let responseData = {};
    if (userMessageText === "action_add_two_cards" || userMessageText === "action_add_two_cards_phase1") {
        responseData = {
            assistantmsg: `<b>2장 더 뽑기</b> 시 <img src="img/icon/bone_inline.png" alt="뼈다귀" class="inline-bone-icon"><b>2개</b>가 사용됩니다. 진행하시겠어요?`,
            importance: 'high', isConfirmationStage: true,
            sampleAnswers: [
                { text: `사용`, value: "action_confirm_add_two_cards_cost", cost: 2, displayCostIcon: true, displayCostText: true, iconType: 'bone', actionType: 'confirm_cost' },
                { text: "취소", value: "action_cancel_cost_confirmation_for_add_cards", actionType: 'cancel_cost' }
            ],
            disableChatInput: true, user_profile_update: {}
        };
    } else if (userMessageText === "action_confirm_add_two_cards_cost") {
        if (userProfile.bones >= 2) {
            userProfile.bones -= 2;
            userProfile.hasUsedAddTwoCards = true; 
            updateBoneCountDisplay();
            saveUserProfileToLocalStorage(userProfile);
            responseData = {
                tarocardview: true, cards_to_select: 2, sampleAnswers: [],
                importance: 'low', disableChatInput: true,
                user_profile_update: { "시나리오": (userProfile.시나리오 || "tarot_general") + "_add_two_pick", "bones": userProfile.bones, "hasUsedAddTwoCards": true },
                systemMessageOnConfirm: "2장을 추가로 선택합니다. 카드를 골라주세요. (뼈다귀 -2)"
            };
        } else { 
             responseData = {
                assistantmsg: "이런! 뼈다귀가 부족해요. (현재 <img src='img/icon/bone_inline.png' alt='뼈다귀' class='inline-bone-icon'>" + userProfile.bones + "개)",
                importance: 'low', disableChatInput: true,
                sampleAnswers: [ { text: "다음에 할게요", value: "action_cancel_ 부족", actionType: 'message' } ],
                user_profile_update: {}
            };
        }
    } else if (userMessageText === "action_cancel_cost_confirmation_for_add_cards") {
        let nextSampleAnswersAfterCancel = [];
        // "2장 더 뽑기"는 이미 시도했으므로, 여기서는 "깊은 상담"만 제안 (또는 상황에 맞게)
        nextSampleAnswersAfterCancel.push({ text: "깊은 상담 요청하기", value: "action_deep_advice_phase1", actionType: 'message', cost:1, displayCostIcon: true, iconType:'bone' });
        nextSampleAnswersAfterCancel.push({ text: "다른 질문", value: "다른 질문 할래", actionType: 'message'});
        responseData = {
            assistantmsg: "네, 알겠습니다. 다른 도움이 필요하시면 말씀해주세요.",
            sampleAnswers: nextSampleAnswersAfterCancel,
            importance: 'low', disableChatInput: true, user_profile_update: {}
        };
    }
    return responseData;
}

async function handleDeepAdviceActions(userMessageText, buttonData) {
    let responseData = {};
    if (userMessageText.startsWith("action_deep_analysis_") || userMessageText === "action_deep_advice_phase1") {
        let cost = 1; 
        let confirmActionValue = "action_confirm_deep_analysis_generic_cost";
        
        if (userProfile.선택된타로카드들 && userProfile.선택된타로카드들.length > 0 && userProfile.tarotResult) { 
            responseData = {
                assistantmsg: `<b>깊은 상담</b> 시 <img src="img/icon/bone_inline.png" alt="뼈다귀" class="inline-bone-icon"><b>${cost}개</b>가 사용됩니다. 진행하시겠어요?`,
                importance: 'high', isConfirmationStage: true,
                sampleAnswers: [
                    { text: `사용`, value: confirmActionValue, cost: cost, displayCostIcon: true, displayCostText: true, iconType: 'bone', actionType: 'confirm_cost' },
                    { text: "취소", value: "action_cancel_cost_confirmation_for_deep_advice", actionType: 'cancel_cost' }
                ],
                disableChatInput: true, user_profile_update: {}
            };
        } else {
             responseData = {
                assistantmsg: "깊은 상담을 진행하기 전에 먼저 타로를 선택하고 기본 해석을 받아보세요.",
                sampleAnswers: [ { text: "알겠습니다", value: "understood_tarot_first_for_deep_advice", actionType: 'message' } ],
                importance: 'low', disableChatInput: true, user_profile_update: {}
             };
        }
    } else if (userMessageText.startsWith("action_confirm_deep_analysis_") && userMessageText.endsWith("_cost")) {
        let requiredBones = 0;
        if (userMessageText === "action_confirm_deep_analysis_generic_cost") requiredBones = 1;
        else if (userMessageText === "action_confirm_deep_analysis_single_cost") requiredBones = 3; 
        else if (userMessageText === "action_confirm_deep_analysis_triple_cost") requiredBones = 1;

        if (requiredBones > 0 && userProfile.bones >= requiredBones) {
            userProfile.bones -= requiredBones;
            updateBoneCountDisplay();
            userProfile.isInDeepAdviceMode = true; 
            userProfile.시나리오 = (userProfile.시나리오 || "tarot_general") + "_deep_advice_started";
            saveUserProfileToLocalStorage(userProfile);
            
            responseData = {
                assistantmsg: `네, ${userProfile.사용자애칭}님. 깊은 상담을 시작하겠습니다. 어떤 점이 가장 궁금하시거나 이야기하고 싶으신가요? 편하게 말씀해주세요.`,
                tarocardview: false, cards_to_select: null,
                importance: 'low', disableChatInput: false, 
                sampleAnswers: [], 
                user_profile_update: { "bones": userProfile.bones, "시나리오": userProfile.시나리오, "isInDeepAdviceMode": true },
            };
        } else if (requiredBones > 0) { 
             responseData = {
                assistantmsg: "이런! 뼈다귀가 부족해서 더 깊은 조언을 듣기 어렵겠어요. (현재 <img src='img/icon/bone_inline.png' alt='뼈다귀' class='inline-bone-icon'>" + userProfile.bones + "개)",
                importance: 'low', disableChatInput: false,
                sampleAnswers: [ { text: "괜찮아요", value: "괜찮습니다", actionType: 'message' }, { text: "뼈다귀는 어떻게 얻나요?", value: "뼈다귀 얻는법", actionType: 'message' } ],
                user_profile_update: {}
            };
        } else { 
            responseData = botKnowledgeBase["기본"] ? { ...botKnowledgeBase["기본"] } : 
                           { assistantmsg: "죄송해요, 요청을 처리할 수 없습니다.", sampleAnswers: [], importance: 'low', disableChatInput: false, user_profile_update: {} };
            if(botKnowledgeBase["기본"] && botKnowledgeBase["기본"].sampleAnswers && Array.isArray(botKnowledgeBase["기본"].sampleAnswers) && botKnowledgeBase["기본"].sampleAnswers.every(sa => typeof sa === 'string')) {
                 responseData.sampleAnswers = botKnowledgeBase["기본"].sampleAnswers.map(sa => ({text: sa, value: sa, actionType: 'message'}));
            } else if (botKnowledgeBase["기본"] && botKnowledgeBase["기본"].sampleAnswers) {
                responseData.sampleAnswers = botKnowledgeBase["기본"].sampleAnswers;
            } else {
                responseData.sampleAnswers = [];
            }
             if (responseData.assistantmsg === undefined) responseData.assistantmsg = "죄송해요, 잘 이해하지 못했어요.";
             if (responseData.disableChatInput === undefined) responseData.disableChatInput = false;
             if (responseData.user_profile_update === undefined) responseData.user_profile_update = {};
        }
    } else if (userProfile.isInDeepAdviceMode && !(buttonData && buttonData.actionType) && userMessageText !== "고맙습니다" && userMessageText !== "다른 질문" && userMessageText !== "괜찮습니다" && userMessageText !== "뼈다귀는 어떻게 얻나요?" && userMessageText !== "알겠습니다" && userMessageText !== "understood_tarot_first_for_deep_advice" && userMessageText !== "error_acknowledged_deep_advice" && userMessageText !== "error_acknowledged_tarot_interp" && !tarotInitiationMessages.includes(userMessageText) && !userMessageText.startsWith("action_") ) {
        // showFullScreenLoader("루비가 답변을 준비 중입니다...");  // 이 줄 제거
        let deepAdviceContinuationPrompt = LOADED_PROMPT_TAROT_ADVICE; 
        deepAdviceContinuationPrompt += `\n\n[사용자 정보]\n애칭: ${userProfile.사용자애칭}\n싱크타입: ${userProfile.결정된싱크타입 || '미결정'}\n성운: ${userProfile.사용자소속성운 || '미결정'}\n최근 고민: ${userProfile.사용자의고민 || '특정 고민 없음'}\n`;
        if(userProfile.tarotResult && userProfile.tarotResult.cardInterpretations) {
            deepAdviceContinuationPrompt += `\n[이전 타로 해석 요약]\n`;
            userProfile.tarotResult.cardInterpretations.forEach(interp => {
                deepAdviceContinuationPrompt += `- ${interp.cardId.replace(/_/g,' ')}: ${interp.keyword} (${interp.briefMeaning})\n`;
            });
            deepAdviceContinuationPrompt += `종합 조언: ${userProfile.tarotResult.overallAdvice}\n`;
        }
        
        let chatHistoryForDeepContinuation = [];
        const messages = Array.from(chatMessages.querySelectorAll('.message'));
        const recentMessagesForHistory = messages.slice(-6); 
        recentMessagesForHistory.forEach(msgEl => {
            if (msgEl.classList.contains('user-message')) {
                chatHistoryForDeepContinuation.push({role: "user", parts: [{text: msgEl.textContent}]});
            } else if (msgEl.classList.contains('bot-message') && !msgEl.classList.contains('assistant-type-message')) {
                chatHistoryForDeepContinuation.push({role: "model", parts: [{text: msgEl.textContent.replace(/ \(뼈다귀 -\d+\)/, "")}]}); 
            }
        });

        try {
            const apiResponseObj = await callChatAPI(deepAdviceContinuationPrompt, chatHistoryForDeepContinuation);
            const apiResponseText = await apiResponseObj.text();
            responseData = {
                assistantmsg: apiResponseText.replace(/\n/g, '<br>'),
                sampleAnswers: [], 
                importance: 'low', disableChatInput: false, user_profile_update: {} 
            };
        } catch (error) {
            console.error("[DeepAdviceContinuationAPI] API 호출 또는 처리 중 오류:", error);
            responseData = {
                assistantmsg: "대화 중 오류가 발생했어요. 잠시 후 다시 말씀해주세요.",
                sampleAnswers: [], importance: 'low', disableChatInput: false, user_profile_update: {}
            };
        } finally {
            // hideFullScreenLoader(); // 이 줄 제거
        }
    }
    return responseData;
}
function handleGeneralKnowledgeActions(userMessageText, buttonData) {
    let responseData = {};
    
    // 비활성화된 정보 버튼 클릭은 여기서도 한 번 더 방어적으로 처리 (CSS가 우선)
    if (buttonData && buttonData.actionType === 'info_disabled') {
        console.log("[GeneralKnowledge] Info_disabled 버튼 클릭됨, 무시:", userMessageText);
        // 이 경우, 특별한 메시지 없이 현재 상태를 유지하거나,
        // 사용자가 다른 행동을 하도록 유도하는 매우 간단한 안내만 제공할 수 있습니다.
        // 여기서는 기본적으로 아무런 추가 메시지나 샘플 답변을 제공하지 않는 것으로 처리.
        // simulateBotResponse 마지막의 기본값 보장 로직이 최소한의 응답을 만들어줄 것임.
        return { 
            disableChatInput: !userProfile.isInDeepAdviceMode && userProfile.현재테스트종류 !== 'subjective' 
            // disableChatInput은 현재 상태에 맞게 설정
        }; 
    }

    // botKnowledgeBase가 제거되었으므로, 모든 알 수 없는 입력은 동일한 메시지 처리
    responseData = { 
        assistantmsg: userProfile.isInDeepAdviceMode ? 
                      "죄송해요, 잘 이해하지 못했어요. 깊은 상담 중이시니 편하게 다시 말씀해주시겠어요?" :
                      "죄송해요, 잘 이해하지 못했어요. <br>더보기 메뉴를 통해 원하시는 기능을 선택해주세요.",
        sampleAnswers: [], 
        importance: 'low', 
        disableChatInput: !userProfile.isInDeepAdviceMode && userProfile.현재테스트종류 !== 'subjective', 
        user_profile_update: {} 
    };
    
    return responseData;
}
// --- 헬퍼 함수들 끝 ---



async function simulateBotResponse(userMessageText, buttonData = null) { 
    console.log(`[BotResponse] "${userMessageText}"에 대한 응답 시뮬레이션 시작. buttonData:`, buttonData);
    return new Promise(async (resolve) => { // Promise 시작

        let responseData = {}; 
        const lowerUserMessage = userMessageText.toLowerCase();

        // tarotInitiationMessages는 전역 상수

        // --- 초기 메시지 응답 처리 ---
        // 앱 시작 시 봇의 첫 마디에 대한 응답, 또는 비활성화된 초기 안내 버튼이 (어떤 이유로든) 클릭된 경우
        if ((userMessageText === initialBotMessage.text && !buttonData && !hasUserSentMessage) || 
            userMessageText === "info_initial_prompt" || 
            (buttonData && buttonData.value === "info_initial_prompt")) { 
            console.log("[BotResponse] 초기 안내 프롬프트 또는 초기 메시지 인식.");
            responseData = {
                // assistantmsg는 이미 initializeChat에서 addMessage로 표시했으므로, 여기서는 추가하지 않음.
                sampleAnswers: initialBotMessage.sampleAnswers, 
                importance: 'low',
                disableChatInput: true, 
                user_profile_update: {}
            };
        }
        // --- 싱크타입 테스트 관련 액션 ---
        else if (userMessageText === "action_submit_sync_test" || 
            (userProfile.현재테스트종류 === 'subjective' && userProfile.현재질문ID && userMessageText !== "action_start_sync_type_test" && !(buttonData && buttonData.actionType === 'info_disabled') && userMessageText !== "placeholder_disabled") ||
            (buttonData && buttonData.actionType === 'objective_answer' && userProfile.현재테스트종류 === 'objective') ||
            userMessageText === "action_restart_sync_test_full") {
            responseData = await handleSyncTypeTestActions(userMessageText, buttonData);
        }
        // --- 그 외의 경우, 기존 로직 실행 ---
        else { 
            let selectedTarotTopicName = null;
            if (userProfile.시나리오 && userProfile.시나리오.startsWith("tarot_topic_")) {
                const topicKey = userProfile.시나리오.substring("tarot_topic_".length).split("_pick")[0].split("_propose_sync_test")[0].split("_started")[0].split("_skipped_sync_test")[0];
                 for (const menuKey in menuConfigurations) {
                    for (const group of menuConfigurations[menuKey]) {
                        if (group.items) {
                            for (const item of group.items) {
                                if (item.actionValue && item.actionValue.replace(/\s+/g, '_') === topicKey) {
                                    selectedTarotTopicName = item.text.replace(" (보기)", "").replace("?", "");
                                    break;
                                }
                            }
                        }
                        if (selectedTarotTopicName) break;
                    }
                    if (selectedTarotTopicName) break;
                }
                 if (!selectedTarotTopicName) selectedTarotTopicName = topicKey.replace(/_/g, " ");
            } else {
                 for (const menuKey in menuConfigurations) {
                    for (const group of menuConfigurations[menuKey]) {
                        if (group.items) {
                            for (const item of group.items) {
                                if (item.actionValue === userMessageText && item.isTarotRelated) {
                                    selectedTarotTopicName = item.text.replace(" (보기)", "").replace("?", "");
                                    break;
                                }
                            }
                        }
                        if (selectedTarotTopicName) break;
                    }
                    if (selectedTarotTopicName) break;
                }
            }

            if (tarotInitiationMessages.includes(userMessageText) || 
                     userMessageText === "action_select_one_card_for_topic" ||
                     userMessageText === "action_select_three_cards_for_topic" ||
                     userMessageText === "action_confirm_three_cards_cost_for_topic" ||
                     userMessageText === "action_cancel_cost_confirmation_for_topic" ||
                     userMessageText === "카드 뽑기" || userMessageText === "카드뽑을래" ||
                     userMessageText === SELECT_ONE_CARD_ACTION ||
                     userMessageText === SELECT_THREE_CARDS_ACTION ||
                     userMessageText === CONFIRM_THREE_CARDS_COST_ACTION ||
                     userMessageText === CANCEL_COST_CONFIRMATION_ACTION) {
                responseData = await handleTarotSetupActions(userMessageText, buttonData, selectedTarotTopicName, tarotInitiationMessages);
            }
            else if (userMessageText === "카드 선택 완료" || userMessageText === "action_start_sync_type_test" || userMessageText === "action_skip_sync_type_test") {
                const result = await handleTarotCardSelectionCompleteActions(userMessageText, buttonData);
                if (result.internalAction) { 
                    return resolve(await simulateBotResponse(result.internalAction, buttonData));
                }
                responseData = result;
            }
            else if (userMessageText === "action_proceed_tarot_interpretation_after_sync" || userMessageText === "action_proceed_tarot_interpretation") {
                responseData = await handleTarotInterpretationActions(userMessageText, buttonData, selectedTarotTopicName);
            }
            else if (userMessageText === "action_add_two_cards" || userMessageText === "action_add_two_cards_phase1" || userMessageText === "action_confirm_add_two_cards_cost" || userMessageText === "action_cancel_cost_confirmation_for_add_cards") {
                responseData = await handleAddTwoCardsActions(userMessageText, buttonData);
            }
            else if (userMessageText.startsWith("action_deep_analysis_") || userMessageText === "action_deep_advice_phase1" || (userMessageText.startsWith("action_confirm_deep_analysis_") && userMessageText.endsWith("_cost")) || (userProfile.isInDeepAdviceMode && !(buttonData && buttonData.actionType) && !["고맙습니다", "다른 질문", "괜찮습니다", "뼈다귀는 어떻게 얻나요?", "알겠습니다", "understood_tarot_first_for_deep_advice", "error_acknowledged_deep_advice", "error_acknowledged_tarot_interp"].includes(userMessageText) && !tarotInitiationMessages.includes(userMessageText) && !userMessageText.startsWith("action_") ) ) {
                 if(userMessageText === "action_cancel_cost_confirmation_for_deep_advice"){ 
                     let nextSampleAnswersAfterCancel = [];
                     if (userProfile.선택된타로카드들 && userProfile.선택된타로카드들.length === 1 && !userProfile.hasUsedAddTwoCards) {
                         nextSampleAnswersAfterCancel.push({ text: "2장 더 뽑기", value: "action_add_two_cards_phase1", actionType: 'message', cost:2, displayCostIcon: true, iconType:'bone' });
                     }
                     nextSampleAnswersAfterCancel.push({ text: "깊은 상담 요청하기", value: "action_deep_advice_phase1", actionType: 'message', cost:1, displayCostIcon: true, iconType:'bone' });
                     nextSampleAnswersAfterCancel.push({ text: "다른 질문", value: "다른 질문 할래", actionType: 'message'});
                     responseData = {
                         assistantmsg: "네, 알겠습니다. 다른 도움이 필요하시면 말씀해주세요.",
                         sampleAnswers: nextSampleAnswersAfterCancel,
                         importance: 'low', disableChatInput: true, user_profile_update: {}
                     };
                 } else {
                    responseData = await handleDeepAdviceActions(userMessageText, buttonData);
                 }
            }
            else { 
                responseData = handleGeneralKnowledgeActions(userMessageText, buttonData);
            }
        }

        if (responseData.sampleanswer && !responseData.sampleAnswers) {
            responseData.sampleAnswers = responseData.sampleanswer.split('|').map(s => ({ text: s.trim(), value: s.trim(), actionType: 'message' })).filter(s => s.text);
            delete responseData.sampleanswer;
        }

        if (Object.keys(responseData).length === 0 && buttonData && buttonData.actionType === 'info_disabled') {
            console.log("[BotResponse] Info_disabled 버튼 클릭으로 responseData가 비어있음. 추가 처리 없음.");
        }

        if (responseData.assistantmsg === undefined && responseData.assistant_interpretation === undefined && responseData.systemMessageOnConfirm === undefined) {
            if (userMessageText !== "info_initial_prompt" && !(buttonData && buttonData.value === "info_initial_prompt") && userMessageText !== initialBotMessage.text ) { // 초기메시지/프롬프트가 아닐때만 기본메시지
                 responseData.assistantmsg = userProfile.isInDeepAdviceMode ? 
                                             "죄송해요, 잘 이해하지 못했어요. 깊은 상담 중이시니 편하게 다시 말씀해주시겠어요?" :
                                             "죄송해요, 잘 이해하지 못했어요. <br>더보기 메뉴를 통해 원하시는 기능을 선택해주세요.";
            }
        }
        if (responseData.sampleAnswers === undefined) responseData.sampleAnswers = [];
        if (responseData.importance === undefined) responseData.importance = 'low';
        
        if (responseData.disableChatInput === undefined) { 
            if (userProfile.isInDeepAdviceMode || userProfile.현재테스트종류 === 'subjective') {
                responseData.disableChatInput = false; 
            } else if (responseData.sampleAnswers && responseData.sampleAnswers.length > 0 && responseData.sampleAnswers.some(sa => sa.actionType !== 'info_disabled')) {
                responseData.disableChatInput = true; 
            } else { 
                // 초기 앱 시작 시 ("안녕하세요! 루비입니다...") 또는
                // 초기 안내 버튼("info_initial_prompt")을 (어떤 이유로든) 받은 경우, 입력을 막음.
                if (userMessageText === initialBotMessage.text || userMessageText === "info_initial_prompt" || (buttonData && buttonData.value === "info_initial_prompt")) {
                    responseData.disableChatInput = true;
                } else {
                    responseData.disableChatInput = false; // 일반적인 경우엔 false로 두어 setUIInteractions에서 isProcessing으로 제어
                }
            }
        }

        if (responseData.user_profile_update === undefined) responseData.user_profile_update = {};

        console.log(`[BotResponse] 생성된 응답 데이터:`, JSON.parse(JSON.stringify(responseData)));
        resolve(responseData);
    }); // Promise 종료
} // simulateBotResponse 함수 종료
function setUIInteractions(isProcessing, shouldFocusInput = false, forceDisableInput = false) {
    console.log(`[UI] 상호작용 상태 변경: isProcessing=${isProcessing}, shouldFocusInput=${shouldFocusInput}, forceDisableInput=${forceDisableInput}`);
    
    const trulyDisabled = isProcessing || forceDisableInput;

    if (messageInput) messageInput.disabled = trulyDisabled;
    if (sendBtn) sendBtn.disabled = trulyDisabled || (messageInput && messageInput.value.trim() === '');

    const sampleButtons = sampleAnswersContainer.querySelectorAll('.sample-answer-btn');
    sampleButtons.forEach(btn => {
        // info-disabled-btn 클래스가 없는 버튼만 isProcessing 상태에 따라 비활성화
        if (!btn.classList.contains('info-disabled-btn')) {
            btn.disabled = isProcessing;
        }
    });

    const panelOptions = moreOptionsPanel.querySelectorAll('.panel-option');
    panelOptions.forEach(opt => opt.disabled = isProcessing);
    
    if (moreOptionsBtn) moreOptionsBtn.disabled = isProcessing;

    if (!trulyDisabled && shouldFocusInput && !isTarotSelectionActive && messageInput) {
        console.log("[UI] 메시지 입력창 포커스 시도.");
        messageInput.focus();
    } else if ((isTarotSelectionActive || trulyDisabled) && messageInput && document.activeElement === messageInput) {
        messageInput.blur();
        console.log("[UI] 타로 UI 활성화 또는 강제 비활성화로 입력창 포커스 해제.");
    }
}
async function processMessageExchange(messageText, source = 'input', options = {}) {
    const { clearBeforeSend = false, menuItemData = null, buttonData: optionsButtonData = null } = options; 

    console.log(`[ProcessExchange] 시작. 메시지: "${messageText}", 소스: ${source}, 옵션:`, options);
    
    // botApiResponse를 try 블록 외부에서 선언하여 finally에서도 접근 가능하도록 함
    let botApiResponse; 

    if (isLoadingBotResponse && source !== 'system_internal_force') {
        console.log("[ProcessExchange] 조건 미충족으로 중단 (로딩 중).");
        return;
    }

    const currentButtonData = (source === 'sample_button' && optionsButtonData) ? optionsButtonData : null;

    if (messageText.trim() === '' && source !== 'system_init_skip_user_message' && source !== 'system_internal_no_user_echo' && !(currentButtonData && currentButtonData.actionType === 'confirm_cost')) {
        console.log("[ProcessExchange] 조건 미충족으로 중단 (빈 메시지).");
        return;
    }

    let shouldClearChat = clearBeforeSend;
    if (!hasUserSentMessage && source !== 'system_init' && source !== 'system_internal' && source !== 'panel_option_topic_reset' && source !== 'system_init_skip_user_message') {
        shouldClearChat = true;
        hasUserSentMessage = true;
        userProfile.메뉴단계 = 2;
        console.log("[ProcessExchange] 사용자의 첫 상호작용. 채팅창 비움 활성화, 메뉴 단계 2로 변경.");
    }

    if (shouldClearChat) {
        clearChatMessages();
    }

    isLoadingBotResponse = true;
    if(sendBtn) sendBtn.classList.add('loading');
    // 초기 UI 상태 설정: 로딩 중, 입력창은 상황에 따라 (여기서는 우선 isProcessing=true로 비활성화)
    setUIInteractions(true, false); 

    if (moreOptionsPanel.classList.contains('active')) {
        console.log("[ProcessExchange] 더보기 패널 닫기.");
        moreOptionsPanel.classList.remove('active');
        moreOptionsBtn.classList.remove('active');
    }

    const shouldAddUserMessage = 
        source === 'input' || 
        source === 'panel_option' || 
        source === 'panel_option_topic_reset' ||
        (source === 'sample_button' && currentButtonData && currentButtonData.actionType !== 'confirm_cost' && currentButtonData.actionType !== 'cancel_cost' && currentButtonData.actionType !== 'objective_answer' && currentButtonData.actionType !== 'info_disabled'); 

    if (shouldAddUserMessage && source !== 'system_init_skip_user_message' && source !== 'system_internal_no_user_echo') {
        const textForUserMessage = (source === 'sample_button' && currentButtonData && currentButtonData.text) ? currentButtonData.text : messageText;
        await addMessage(textForUserMessage, 'user');
    }

    if (source === 'input' && messageInput) {
        messageInput.value = '';
        adjustTextareaHeight();
    }

    const effectiveMessageForAPI = (source === 'sample_button' && currentButtonData && currentButtonData.value) ? currentButtonData.value : messageText;

    try {
        // botApiResponse 변수에 할당
        botApiResponse = await simulateBotResponse(effectiveMessageForAPI, currentButtonData); 
        
        // `disableChatInput` 플래그에 따른 직접적인 DOM 제어 제거
        // if (messageInput && sendBtn) {
        //     if (botApiResponse.disableChatInput === true) {
        //         messageInput.disabled = true;
        //         sendBtn.disabled = true;
        //         console.log("[UIControls] 채팅 입력창 및 전송 버튼 비활성화 (봇 요청).");
        //     }
        // }

        if (botApiResponse.user_profile_update) {
             for (const key in botApiResponse.user_profile_update) {
                if (key !== "bones") { 
                    if (botApiResponse.user_profile_update[key] !== null && botApiResponse.user_profile_update[key] !== undefined && botApiResponse.user_profile_update[key] !== "없음") {
                        if (key === "선택된타로카드들" && Array.isArray(botApiResponse.user_profile_update[key]) && botApiResponse.user_profile_update[key].length === 0 && userProfile.선택된타로카드들.length > 0) {
                        } else {
                            userProfile[key] = botApiResponse.user_profile_update[key];
                        }
                    }
                }
            }
            if (Object.keys(botApiResponse.user_profile_update).some(k => k !== "bones")) {
                saveUserProfileToLocalStorage(userProfile);
            }
            console.log("[UserProfile] API 응답으로 프로필 업데이트 (일부):", botApiResponse.user_profile_update);
        }

        if (botApiResponse.assistant_interpretation) {
            await addMessage({ interpretationHtml: botApiResponse.assistant_interpretation, isAssistantInterpretation: true }, 'bot');
        }

        if (botApiResponse.assistantmsg && !botApiResponse.systemMessageOnConfirm) { 
            await addMessage(botApiResponse.assistantmsg, 'bot');
        } else if (botApiResponse.systemMessageOnConfirm) { 
             await addMessage(botApiResponse.systemMessageOnConfirm, 'system');
        }
        
        await updateSampleAnswers(
            botApiResponse.sampleAnswers || [], 
            botApiResponse.importance || 'low',
            botApiResponse.isConfirmationStage || false,
            botApiResponse.assistantmsg && botApiResponse.isConfirmationStage ? botApiResponse.assistantmsg : null
        );

        if (botApiResponse.tarocardview && botApiResponse.cards_to_select > 0) {
            if (messageInput && document.activeElement === messageInput) {
                messageInput.blur();
            }
            let currentTarotBg = userProfile.tarotbg || 'default.png';
            const bgSourceMenuItem = menuItemData; 
            const bgSourceButton = (source === 'sample_button' && currentButtonData) ? currentButtonData : null; 

            if (bgSourceMenuItem && bgSourceMenuItem.tarotbg) {
                currentTarotBg = bgSourceMenuItem.tarotbg;
            } else if (bgSourceButton && bgSourceButton.tarotbg) { 
                currentTarotBg = bgSourceButton.tarotbg;
            }
            
            if (currentTarotBg !== userProfile.tarotbg) { 
                 userProfile.tarotbg = currentTarotBg;
                 saveUserProfileToLocalStorage(userProfile);
            }

            console.log(`[TarotUI] 카드 선택 UI 표시. 선택할 카드 수: ${botApiResponse.cards_to_select}, 배경: ${currentTarotBg}`);
            showTarotSelectionUI(botApiResponse.cards_to_select, currentTarotBg);
        }

    } catch (error) {
        console.error("[ProcessExchange] 오류 발생:", error);
        await addMessage("죄송합니다. 응답 중 오류가 발생했습니다.", 'system');
        const fallbackSampleAnswers = (typeof initialBotMessage !== 'undefined' && initialBotMessage.sampleAnswers) 
            ? initialBotMessage.sampleAnswers.map(sa => ({text: sa, value: sa, actionType: 'message'}))
            : [{text: "도움말", value: "도움말", actionType: 'message'}];
        await updateSampleAnswers(fallbackSampleAnswers);
    } finally {
        isLoadingBotResponse = false;
        if(sendBtn) sendBtn.classList.remove('loading');
        
        const shouldFocusAfterProcessing = (source === 'input' && !isTarotSelectionActive);
        // botApiResponse가 try 블록에서 정의되었으므로, finally에서 안전하게 접근 가능
        const forceDisableChatInput = botApiResponse && botApiResponse.disableChatInput === true;
        
        setUIInteractions(false, shouldFocusAfterProcessing, forceDisableChatInput);
        
        console.log("[ProcessExchange] 완료.");
    }
}
    async function handleSendMessage() {
        const messageText = messageInput.value.trim();
        await processMessageExchange(messageText, 'input');
    }

    let activeTooltip = null;
    let tooltipTimeoutId = null;

    function showTooltip(cardInfo, clickedElement) {
        hideTooltip();
        if (tooltipTimeoutId) { clearTimeout(tooltipTimeoutId); tooltipTimeoutId = null; }

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

        clickedElement.appendChild(tooltipElement);
        activeTooltip = tooltipElement;

        const cardWidth = clickedElement.offsetWidth;
        activeTooltip.style.maxWidth = `${cardWidth * 0.9}px`;

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
        if (tooltipTimeoutId) { clearTimeout(tooltipTimeoutId); tooltipTimeoutId = null; }
        if (activeTooltip && activeTooltip.parentNode) {
            activeTooltip.classList.remove('visible');
            const currentActiveTooltip = activeTooltip;
            const transitionDuration = parseFloat(getComputedStyle(currentActiveTooltip).transitionDuration) * 1000 || 200;
            setTimeout(() => {
                if (activeTooltip === currentActiveTooltip && currentActiveTooltip.parentNode && !currentActiveTooltip.classList.contains('visible')) {
                    currentActiveTooltip.remove();
                    if (activeTooltip === currentActiveTooltip) {
                        activeTooltip = null;
                    }
                    console.log("[Tooltip] 숨김 및 제거 완료 (타이머/트랜지션).");
                }
            }, transitionDuration);
        } else if (activeTooltip) {
            activeTooltip = null;
            console.log("[Tooltip] activeTooltip 참조만 초기화 (이미 DOM에서 제거됨 또는 parentNode 없음).");
        }
    }

function updateSyncTypeModal(tabId = 'overview') {
    console.log(`[Modal] 싱크타입 모달 업데이트. 탭: ${tabId}`);

    const overviewContent = document.querySelector('.sync-type-overview-content');
    const imageContainer = document.querySelector('.sync-type-image-container');
    const customLegendArea = document.querySelector('.overview-custom-legend-area');


    if (!userProfile || !syncTypeDescription || !syncTypeTabsContainer || Object.keys(syncTypeDataStore).length === 0 || !overviewContent || !imageContainer || !customLegendArea) {
        console.error("[Modal] 싱크타입 모달 필수 요소 또는 데이터 없음.");
        if(syncTypeDescription) syncTypeDescription.innerHTML = `<p>싱크타입 정보를 표시할 수 없습니다. 데이터를 확인해주세요.</p>`;
        if(syncTypeMainImage) syncTypeMainImage.src = "img/sync_type/default.png";
        if(overviewContent) overviewContent.style.display = 'none';
        if(imageContainer) imageContainer.style.display = 'block';
        if(customLegendArea) customLegendArea.innerHTML = ''; // 범례 영역 비우기
        return;
    }

    const dataForTab = syncTypeDataStore[tabId];

    if (!dataForTab) {
        console.error(`[Modal] 싱크타입 데이터 없음: ${tabId}`);
        syncTypeDescription.innerHTML = `<p>선택된 탭(${tabId})에 대한 정보를 불러올 수 없습니다.</p>`;
        customLegendArea.innerHTML = ''; // 범례 영역 비우기
        if (tabId === 'overview') {
            overviewContent.style.display = 'flex'; // overviewContent는 flex 컨테이너
            imageContainer.style.display = 'none';
            // 차트 데이터가 없으므로 빈 차트 또는 안내 메시지
            drawRadarChart('combinedRadarChart', [], []); // 빈 데이터셋으로 호출 시 기본 차트
        } else {
            overviewContent.style.display = 'none';
            imageContainer.style.display = 'block';
            if(syncTypeMainImage) {
                syncTypeMainImage.src = "img/sync_type/default.png";
                syncTypeMainImage.alt = "기본 이미지";
            }
        }
        return;
    }

    syncTypeDescription.innerHTML = `<p>${dataForTab.text ? dataForTab.text.replace(/\n/g, "<br>") : "설명 정보가 없습니다."}</p>`;
    customLegendArea.innerHTML = ''; // 이전 범례 내용 초기화

    if (tabId === 'overview') {
        overviewContent.style.display = 'flex'; // overviewContent는 flex 컨테이너
        imageContainer.style.display = 'none';

        if (dataForTab.chartData && dataForTab.chartData.datasets && dataForTab.chartData.datasets.length > 0) {
            drawRadarChart('combinedRadarChart', dataForTab.chartData.labels, dataForTab.chartData.datasets);
        } else {
            console.warn("[Modal] 통합 차트 데이터 없음.");
             // 필요시 캔버스 대신 안내 메시지 표시
            const chartCanvas = document.getElementById('combinedRadarChart');
            if (chartCanvas) {
                 const ctx = chartCanvas.getContext('2d');
                 ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height); // 캔버스 클리어
                 // ctx.fillText("차트 데이터를 불러올 수 없습니다.", 10, 50); // 간단한 텍스트
            }
        }

        // 커스텀 범례 생성
        if (dataForTab.customLegend && dataForTab.customLegend.length > 0) {
            dataForTab.customLegend.forEach(item => {
                const legendItemDiv = document.createElement('div');
                legendItemDiv.className = 'custom-legend-item';

                const colorBox = document.createElement('span');
                colorBox.className = 'custom-legend-color-box';
                colorBox.style.backgroundColor = item.color;
                legendItemDiv.appendChild(colorBox);

                const textSpan = document.createElement('span');
                textSpan.className = 'custom-legend-text';
                textSpan.textContent = item.text;
                legendItemDiv.appendChild(textSpan);

                customLegendArea.appendChild(legendItemDiv);
            });
        }

    } else { // nebula 또는 syncTypeDetail 탭
        overviewContent.style.display = 'none';
        imageContainer.style.display = 'block';
        if (syncTypeMainImage) {
            syncTypeMainImage.src = dataForTab.image || "img/sync_type/default.png";
            syncTypeMainImage.alt = `${tabId} 관련 이미지`;
        }
    }

    syncTypeTabsContainer.querySelectorAll('.sync-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
}

    function updateTarotCollectionModal() {
        console.log("[Modal] 타로 콜렉션 모달 업데이트.");
        if (!userProfile || !tarotCollectedCountEl || !tarotTotalCountEl || !tarotGaugeFillEl || !tarotCardGridEl || typeof TAROT_CARD_DATA === 'undefined') {
            console.error("[Modal] 타로 콜렉션 모달 필수 요소 또는 TAROT_CARD_DATA 없음.");
            return;
        }
        const collectedCards = userProfile.지금까지수집된타로카드 || [];
        const collectedCount = collectedCards.length;

        tarotCollectedCountEl.textContent = collectedCount;
        tarotTotalCountEl.textContent = TOTAL_TAROT_CARDS;

        const percentage = TOTAL_TAROT_CARDS > 0 ? (collectedCount / TOTAL_TAROT_CARDS) * 100 : 0;
        tarotGaugeFillEl.style.width = `${percentage}%`;

        tarotCardGridEl.innerHTML = '';
        ALL_TAROT_CARD_IDS.forEach(cardId => {
            const cardItem = document.createElement('div');
            cardItem.className = 'tarot-card-item';

            const isCollected = collectedCards.includes(cardId);
            if (!isCollected) {
                cardItem.classList.add('not-collected');
            }

            const isReversed = cardId.endsWith('_reversed');
            if (isReversed) {
                cardItem.classList.add('reversed-card');
            }

            const img = document.createElement('img');
            const imageName = isReversed ? cardId.replace('_reversed', '_upright') : cardId;
            img.src = `img/tarot/${imageName}.png`;

            const cardDataForAlt = TAROT_CARD_DATA[cardId] || { name: cardId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), description: "정보 없음" };
            img.alt = cardDataForAlt.name;

            cardItem.appendChild(img);

            cardItem.addEventListener('click', (event) => {
                hideTooltip();
                let tooltipInfo;
                if (isCollected) {
                    const detailedCardData = TAROT_CARD_DATA[cardId] || {
                        name: cardId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                        description: "상세 정보 준비 중..."
                    };
                    tooltipInfo = {
                        name: detailedCardData.name,
                        description: detailedCardData.description
                    };
                } else {
                    tooltipInfo = {
                        name: "미수집 카드",
                        description: "아직 수집되지 않은 카드입니다."
                    };
                }
                showTooltip(tooltipInfo, event.currentTarget);
            });
            tarotCardGridEl.appendChild(cardItem);
        });
        console.log("[Modal] 타로 콜렉션 카드 목록 생성 완료.");
    }
    function showTarotSelectionUI(cardsToPick, backgroundFileName) {
        console.log(`[TarotSelection] UI 표시. 선택할 카드: ${cardsToPick}, 배경: ${backgroundFileName}`);
        if (!tarotSelectionOverlay || !tarotCardCarousel || !tarotCardInfo || !tarotSelectionConfirmBtn) {
            console.error("[TarotSelection] UI 요소를 찾을 수 없습니다.");
            return;
        }

        // 타로 UI 표시 전, 현재 활성화된 엘리먼트가 입력창이라면 blur 처리하여 키보드를 내린다.
        if (messageInput && document.activeElement === messageInput) {
            messageInput.blur();
            console.log("[TarotSelection] 입력창 포커스 해제 (키보드 내리기).");
        }


        tarotSelectionOverlay.style.backgroundImage = `url('img/tarot/bg/${backgroundFileName}')`;
        cardsToSelectCount = cardsToPick;
        selectedTarotCardIndices = [];

        populateTarotCarousel();
        updateTarotSelectionInfo();

        tarotSelectionConfirmBtn.disabled = true;
        tarotSelectionOverlay.classList.add('active');
        isTarotSelectionActive = true; // 플래그 설정
        document.body.style.overflow = 'hidden';

        setupCarouselDragScroll();
        tarotCardCarousel.addEventListener('scroll', applyCarouselPerspective);
    }

    function hideTarotSelectionUI() {
        if (!tarotSelectionOverlay) return;
        tarotSelectionOverlay.classList.remove('active');
        isTarotSelectionActive = false;
        document.body.style.overflow = ''; // 스크롤 복원

        // 이벤트 리스너 제거 (메모리 누수 방지)
        if (tarotCardCarousel) {
            tarotCardCarousel.removeEventListener('mousedown', handleCarouselMouseDown);
            tarotCardCarousel.removeEventListener('scroll', applyCarouselPerspective);
            // mousemove, mouseup, mouseleave는 document에 등록되므로 주의해서 제거하거나, 플래그로 관리
        }
        document.removeEventListener('mousemove', handleCarouselMouseMove);
        document.removeEventListener('mouseup', handleCarouselMouseUp);
        document.removeEventListener('mouseleave', handleCarouselMouseLeave); // document에 등록된 경우

        console.log("[TarotSelection] UI 숨김.");
    }

    function populateTarotCarousel() {
        if (!tarotCardCarousel) return;
        tarotCardCarousel.innerHTML = ''; // 기존 카드 제거

        const fragment = document.createDocumentFragment();
        for (let i = 0; i < TOTAL_CARDS_IN_DECK; i++) {
            const cardItem = document.createElement('div');
            cardItem.className = 'tarot-card-item';
            cardItem.dataset.index = i;

            const img = document.createElement('img');
            img.src = 'img/tarot/card_back.png';
            img.alt = `타로 카드 ${i + 1}`;
            cardItem.appendChild(img);

            cardItem.addEventListener('click', (e) => handleTarotCardClick(e, i));
            fragment.appendChild(cardItem);
        }
        tarotCardCarousel.appendChild(fragment);

        // 캐러셀 초기 중앙 정렬 (첫 번째 카드가 그려진 후 정확한 너비 계산)
        requestAnimationFrame(() => {
            if (tarotCardCarousel.firstElementChild) {
                const cardWidth = tarotCardCarousel.firstElementChild.offsetWidth;
                // 카드가 겹쳐있으므로 실제 보이는 너비(스타일에서 margin: 0 -25px; 이므로 100 - 25 -25 = 50)
                // 혹은 카드의 실제 너비에서 겹치는 부분을 뺀 값으로 계산해야함
                // CSS에서 margin: 0 -25px; 이므로, 각 카드는 (100 - 25*2) = 50px의 공간만 차지하는 것처럼 보임.
                // 그러나 transform 효과를 위해 각 카드의 offsetWidth는 100px임.
                // 스크롤 시에는 겹침을 고려한 실제 카드 간격으로 계산.
                // margin: 0 -Npx; 일 경우, 카드의 시각적 너비는 실제너비 - 2*N
                // 여기서는 카드를 펼쳐놓고 중앙 카드가 화면 중앙에 오도록 함
                const effectiveCardSpacing = cardWidth + parseInt(getComputedStyle(tarotCardCarousel.firstElementChild).marginLeft) + parseInt(getComputedStyle(tarotCardCarousel.firstElementChild).marginRight); // 대략 100 - 25 - 25 = 50

                const middleCardIndex = Math.floor(TOTAL_CARDS_IN_DECK / 2);
                // (중앙 카드 인덱스 * 카드 간격) 은 중앙 카드의 시작점.
                // 여기서 (캐러셀 컨테이너 너비 / 2)를 빼고 (카드 간격 / 2)를 더하면 중앙 카드의 중심이 캐러셀 컨테이너 중심에 옴.
                const initialScroll = (middleCardIndex * effectiveCardSpacing) - (tarotCardCarouselContainer.offsetWidth / 2) + (effectiveCardSpacing / 2);
                
                tarotCardCarousel.scrollLeft = initialScroll;
                applyCarouselPerspective(); // 초기 3D 효과 적용
            }
        });
    }

    function handleTarotCardClick(event, cardIndex) {
        if (isLoadingBotResponse) return; // 봇 응답 중에는 카드 선택 불가

        const cardElement = event.currentTarget;
        const indexInSelected = selectedTarotCardIndices.indexOf(cardIndex);

        if (indexInSelected > -1) { // 이미 선택된 카드 -> 선택 해제
            selectedTarotCardIndices.splice(indexInSelected, 1);
            cardElement.classList.remove('selected');
        } else if (selectedTarotCardIndices.length < cardsToSelectCount) { // 새로 선택 (최대 선택 가능 개수 미만일 때)
            selectedTarotCardIndices.push(cardIndex);
            cardElement.classList.add('selected');
        } else {
            // 최대 개수를 이미 선택했는데 다른 카드를 누른 경우 (무시 또는 알림)
            console.log("[TarotSelection] 최대 선택 개수에 도달했습니다.");
            // 간단한 시각적 피드백 (예: 캐러셀 살짝 흔들기)을 줄 수도 있음
            // tarotCardCarouselContainer.classList.add('shake');
            // setTimeout(() => tarotCardCarouselContainer.classList.remove('shake'), 300);
            return;
        }
        updateTarotSelectionInfo();
        tarotSelectionConfirmBtn.disabled = selectedTarotCardIndices.length !== cardsToSelectCount;
    }

    function updateTarotSelectionInfo() {
        if (!tarotCardInfo) return;
        tarotCardInfo.textContent = `${selectedTarotCardIndices.length}장 선택됨 / 총 ${cardsToSelectCount}장 선택하세요`;
    }

    async function handleTarotSelectionConfirm() {
        if (selectedTarotCardIndices.length !== cardsToSelectCount) return;

        console.log("[TarotSelection] 선택 완료. 사용자가 고른 'UI 위치' 인덱스:", selectedTarotCardIndices);

        // 실제 타로 카드 ID를 할당하는 로직
        const availableCardIds = [...ALL_TAROT_CARD_IDS];
        let newlyChosenCardIds = []; // 이번 선택 단계에서 새로 뽑힌 카드 ID들

        // 사용자가 UI에서 선택한 '위치'에 해당하는 카드들에게 실제 카드 ID를 랜덤 배정
        for (let i = 0; i < cardsToSelectCount; i++) {
            if (availableCardIds.length === 0) break; 
            // 중복 방지를 위해 userProfile.선택된타로카드들 (이미 뽑힌 카드)과 availableCardIds에서 제외
            let currentDeck = [...availableCardIds];
            if (userProfile.선택된타로카드들 && userProfile.선택된타로카드들.length > 0) {
                currentDeck = currentDeck.filter(id => !userProfile.선택된타로카드들.includes(id));
            }
             if (currentDeck.length === 0) { // 뽑을 수 있는 유니크한 카드가 없다면
                console.warn("[TarotSelection] 더 이상 뽑을 유니크한 카드가 없습니다. 이미 뽑은 카드 중에서 중복될 수 있습니다.");
                // 이 경우, availableCardIds (전체 덱)에서 다시 뽑도록 하거나, 에러 처리
                currentDeck = [...availableCardIds]; // 중복 허용으로 전환 (임시)
                if (currentDeck.length === 0) break; // 그래도 없으면 중단
            }

            const randomIndex = Math.floor(Math.random() * currentDeck.length);
            const chosenId = currentDeck.splice(randomIndex, 1)[0]; // currentDeck에서 제거하며 선택
            newlyChosenCardIds.push(chosenId);

            // availableCardIds에서도 제거 (다음 카드 선택 시 중복 방지 위함 - currentDeck에서 이미 처리했지만, 명시적)
            const indexInAvailable = availableCardIds.indexOf(chosenId);
            if (indexInAvailable > -1) availableCardIds.splice(indexInAvailable, 1);
        }
        
        // 시나리오에 따라 카드 ID 목록 처리
        if (userProfile.시나리오 === "tarot_add_two_pick" && userProfile.선택된타로카드들) {
            // "2장 더 뽑을래" 시나리오: 기존 카드에 새로 뽑은 카드 추가
            userProfile.선택된타로카드들.push(...newlyChosenCardIds);
            console.log("[UserProfile] 추가로 2장 선택. 총 선택된 타로 카드 ID:", userProfile.선택된타로카드들);
        } else {
            // "한 장만" 또는 "3장" (최초 선택) 시나리오: 새로 뽑은 카드로 덮어쓰기
            userProfile.선택된타로카드들 = newlyChosenCardIds;
            console.log("[UserProfile] 최초 선택. 실제 선택된 타로 카드 ID 저장:", userProfile.선택된타로카드들);
        }
        
        // userProfile.지금까지수집된타로카드에도 새로 뽑은 카드 추가 (중복 없이)
        newlyChosenCardIds.forEach(cardId => {
            if (!userProfile.지금까지수집된타로카드.includes(cardId)) {
                userProfile.지금까지수집된타로카드.push(cardId);
            }
        });

        saveUserProfileToLocalStorage(userProfile); // 변경된 카드 목록과 수집 목록 저장

        hideTarotSelectionUI();
        // "카드 선택 완료" 메시지는 시스템 내부적으로 처리하여 사용자에게 보이지 않게 할 수 있음
        // source를 'system_internal_no_user_echo' 등으로 하여 사용자 메시지 추가 생략
        await processMessageExchange("카드 선택 완료", 'system_internal_no_user_echo');
    }
    function handleClearTarotSelection() {
        if (isLoadingBotResponse || !tarotCardCarousel) return;
        console.log("[TarotSelection] 모든 선택 취소.");

        selectedTarotCardIndices = []; // 선택된 인덱스 배열 비우기
        
        // 캐러셀의 모든 카드에서 'selected' 클래스 제거
        const cards = tarotCardCarousel.querySelectorAll('.tarot-card-item.selected');
        cards.forEach(card => card.classList.remove('selected'));

        updateTarotSelectionInfo(); // 정보 텍스트 업데이트
        tarotSelectionConfirmBtn.disabled = true; // 선택 완료 버튼 비활성화
    }

function handleRandomTarotSelection() {
    if (isLoadingBotResponse || !tarotCardCarousel || cardsToSelectCount <= 0) return;
    console.log(`[TarotSelection] '운에 맡기기' 실행. ${cardsToSelectCount}장 랜덤으로 UI에 선택 표시.`);

    handleClearTarotSelection(); // 기존 UI 선택 모두 취소

    const availableDeckIndices = Array.from({ length: TOTAL_CARDS_IN_DECK }, (_, i) => i);
    const newlySelectedIndices = []; // 이번에 랜덤으로 선택된 카드들의 UI 인덱스

    for (let i = 0; i < cardsToSelectCount; i++) {
        if (availableDeckIndices.length === 0) break; // 뽑을 인덱스가 없으면 중단

        const randomIndexInAvailable = Math.floor(Math.random() * availableDeckIndices.length);
        // availableDeckIndices에서 실제 카드 덱의 인덱스를 하나 뽑음
        const selectedCardDeckIndex = availableDeckIndices.splice(randomIndexInAvailable, 1)[0];
        
        newlySelectedIndices.push(selectedCardDeckIndex); // UI상 선택된 인덱스 배열에 추가
        
        // 해당 인덱스의 카드 요소에 'selected' 클래스 추가
        const cardElement = tarotCardCarousel.querySelector(`.tarot-card-item[data-index="${selectedCardDeckIndex}"]`);
        if (cardElement) {
            cardElement.classList.add('selected');
        }
    }
    
    // 전역 selectedTarotCardIndices 업데이트 (UI와 동기화)
    selectedTarotCardIndices = newlySelectedIndices;

    updateTarotSelectionInfo(); // 상단 정보 텍스트 업데이트 ("N장 선택됨 / 총 M장 선택하세요")
    
    // "선택 완료" 버튼 활성화/비활성화 상태 업데이트
    if (tarotSelectionConfirmBtn) {
        tarotSelectionConfirmBtn.disabled = selectedTarotCardIndices.length !== cardsToSelectCount;
    }

    // 랜덤 선택 후, 첫 번째 선택된 카드로 스크롤 (선택 사항, 부드러운 사용자 경험을 위해)
    if (selectedTarotCardIndices.length > 0 && tarotCardCarousel && tarotCardCarouselContainer) {
        const firstSelectedCardIndex = selectedTarotCardIndices[0];
        const cardToScrollTo = tarotCardCarousel.querySelector(`.tarot-card-item[data-index="${firstSelectedCardIndex}"]`);
        if (cardToScrollTo) {
            const cardWidth = cardToScrollTo.offsetWidth;
            // margin 값을 고려한 유효 카드 간격 계산 (이전 populateTarotCarousel의 중앙 정렬 로직과 유사)
            const cardStyle = getComputedStyle(cardToScrollTo);
            const marginLeft = parseInt(cardStyle.marginLeft, 10) || 0;
            const marginRight = parseInt(cardStyle.marginRight, 10) || 0;
            const effectiveCardSpacing = cardWidth + marginLeft + marginRight;

            const targetScroll = (firstSelectedCardIndex * effectiveCardSpacing) - (tarotCardCarouselContainer.offsetWidth / 2) + (effectiveCardSpacing / 2);
            
            tarotCardCarousel.scrollTo({ left: targetScroll, behavior: 'smooth' });
            
            // 스크롤 애니메이션 후 3D 효과 재적용
            setTimeout(applyCarouselPerspective, 350); // scrollTo의 behavior: 'smooth' 시간을 고려하여 약간의 딜레이
        }
    }
    console.log("[TarotSelection] '운에 맡기기' 완료. UI에 랜덤 카드 선택됨:", selectedTarotCardIndices);
}
    function applyCarouselPerspective() {
        if (!tarotCardCarousel || !tarotCardCarousel.children.length) return;

        const cards = Array.from(tarotCardCarousel.children);
        const carouselRect = tarotCardCarousel.getBoundingClientRect();
        const carouselCenterX = carouselRect.left + carouselRect.width / 2;
        
        // perspective 값은 컨테이너 너비에 비례하게 설정
        const perspectiveValue = tarotCardCarouselContainer.offsetWidth * 2; 
        // translateZ를 위한 깊이감 조절 (카드가 얼마나 뒤로/앞으로 갈지)
        const zDepthFactor = cards[0].offsetWidth * 0.5; // 카드 너비의 절반 정도
        // 회전 각도 조절 계수
        const rotateFactor = 0.20; // 값이 클수록 더 많이 회전

        cards.forEach(card => {
            const cardRect = card.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            
            // 캐러셀 중심으로부터 카드 중심까지의 거리 (픽셀 단위)
            const distanceFromCenter = cardCenterX - carouselCenterX;
            
            // 거리에 따른 회전각 (중앙에서 멀수록 더 많이 회전)
            // 화면 너비의 절반을 기준으로 비율 계산하여 각도 결정
            const rotateY = (distanceFromCenter / (carouselRect.width / 2)) * (cards[0].offsetWidth * rotateFactor) ;
            
            // 거리에 따른 z축 이동 (중앙에서 멀수록 뒤로 약간 이동시켜 입체감 부여)
            // Math.abs(distanceFromCenter)가 클수록 더 뒤로
            const translateZ = - (Math.abs(distanceFromCenter) / (carouselRect.width / 2)) * zDepthFactor;

            card.style.transform = `perspective(${perspectiveValue}px) translateX(0px) rotateY(${rotateY}deg) translateZ(${translateZ}px)`;
        });
    }

    // --- 캐러셀 드래그 스크롤 함수들 ---
    function handleCarouselMouseDown(e) {
        if (!tarotCardCarousel) return;
        carouselScrollState.isDragging = true;
        // e.pageX는 뷰포트 기준, carousel.offsetLeft은 부모 기준이므로, offsetX를 사용하거나 pageX와 getBoundingClientRect().left 조합
        carouselScrollState.startX = e.pageX - tarotCardCarousel.getBoundingClientRect().left;
        carouselScrollState.scrollLeftStart = tarotCardCarousel.scrollLeft;
        tarotCardCarousel.classList.add('dragging');
        // document에 mousemove와 mouseup을 등록해야 캐러셀 밖으로 마우스가 나가도 드래그 유지
        document.addEventListener('mousemove', handleCarouselMouseMove);
        document.addEventListener('mouseup', handleCarouselMouseUp);
        document.addEventListener('mouseleave', handleCarouselMouseLeave); // 창밖으로 나갈 경우 대비
    }

    function handleCarouselMouseMove(e) {
        if (!carouselScrollState.isDragging || !tarotCardCarousel) return;
        e.preventDefault(); // 드래그 중 텍스트 선택 등 방지
        const x = e.pageX - tarotCardCarousel.getBoundingClientRect().left;
        const walk = (x - carouselScrollState.startX) * 2; // 드래그 감도 조절 (값을 키우면 더 민감)
        tarotCardCarousel.scrollLeft = carouselScrollState.scrollLeftStart - walk;
    }

    function handleCarouselMouseUp() {
        if (!tarotCardCarousel) return;
        carouselScrollState.isDragging = false;
        tarotCardCarousel.classList.remove('dragging');
        document.removeEventListener('mousemove', handleCarouselMouseMove);
        document.removeEventListener('mouseup', handleCarouselMouseUp);
        document.removeEventListener('mouseleave', handleCarouselMouseLeave);
    }
    function handleCarouselMouseLeave(e) { // 마우스가 document를 벗어났을 때
         if (carouselScrollState.isDragging) { // 드래그 중이었다면
            handleCarouselMouseUp(); // 드래그 종료 처리
        }
    }

    function setupCarouselDragScroll() {
        if (!tarotCardCarousel) return;
        // 기존 리스너 제거 (중복 방지)
        tarotCardCarousel.removeEventListener('mousedown', handleCarouselMouseDown);
        
        tarotCardCarousel.addEventListener('mousedown', handleCarouselMouseDown);
        // 터치 이벤트도 추가하면 좋음 (나중에)
    }
    function openModal(modalId) {
        console.log(`[Modal] 열기 시도: ${modalId}`);
        const modal = document.getElementById(modalId);
        if (modal) {
            if (modalId === 'syncTypeModal') {
                if (userProfile) generateSyncTypeData(); // 항상 최신 데이터로
                updateSyncTypeModal();
            } else if (modalId === 'tarotCollectionModal') {
                updateTarotCollectionModal();
            }
            modal.style.display = 'flex';
            modal.addEventListener('click', closeModalOnOutsideClick);
            console.log(`[Modal] ${modalId} 열림.`);
        } else {
            console.error(`[Modal] 모달 ID "${modalId}"을 찾을 수 없음.`);
            alert(`모달 "${modalId}"을 찾을 수 없습니다.`);
        }
        if (moreOptionsPanel.classList.contains('active')) {
            moreOptionsPanel.classList.remove('active');
            moreOptionsBtn.classList.remove('active');
        }
    }

    function closeModal(modalId) {
        console.log(`[Modal] 닫기 시도: ${modalId}`);
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            modal.removeEventListener('click', closeModalOnOutsideClick);
            console.log(`[Modal] ${modalId} 닫힘.`);
        }
    }
    window.closeModal = closeModal;

    function closeModalOnOutsideClick(event) {
        if (event.target === this) {
            console.log(`[Modal] 외부 클릭으로 ${this.id} 닫기.`);
            closeModal(this.id);
        }
    }

    function populateMoreOptionsPanel(menuKey, previousActionType = null) {
        console.log(`[Panel] 채우기 시작. 요청된 메뉴 키: "${menuKey}", 이전 액션 타입: ${previousActionType}`);

        if (previousActionType === 'SUB_MENU' && currentPanelMenuKey !== menuKey) {
            menuNavigationHistory.push(currentPanelMenuKey);
            console.log(`[Panel] 히스토리에 추가: "${currentPanelMenuKey}". 현재 히스토리:`, [...menuNavigationHistory]);
        }
        currentPanelMenuKey = menuKey;
        moreOptionsPanel.innerHTML = '';

        const menuGroups = menuConfigurations[menuKey];
        if (!menuGroups || !Array.isArray(menuGroups)) {
            console.error(`[Panel] 메뉴 설정 오류: 키 "${menuKey}"에 해당하는 메뉴 그룹 없음 또는 잘못된 형식.`);
            const errorOption = document.createElement('button');
            errorOption.className = 'panel-option';
            errorOption.textContent = '메뉴 구성 오류';
            errorOption.disabled = true;
            moreOptionsPanel.appendChild(errorOption);
            return;
        }

        console.log(`[Panel] 키 "${menuKey}"에 대한 메뉴 그룹 ${menuGroups.length}개 처리 중.`);
        menuGroups.forEach((group, groupIndex) => {
            if (group.groupTitle) {
                const groupTitleDiv = document.createElement('div');
                groupTitleDiv.className = 'panel-menu-group-title';
                groupTitleDiv.textContent = group.groupTitle;
                moreOptionsPanel.appendChild(groupTitleDiv);
            }

            if (group.items && Array.isArray(group.items)) {
                group.items.forEach(item => {
                    const optionButton = document.createElement('button');
                    optionButton.className = 'panel-option';

                    if (item.iconName) {
                        const iconImg = document.createElement('img');
                        iconImg.className = 'menu-icon-img';
                        iconImg.src = `img/icon/${item.iconName}.png`;
                        iconImg.alt = '';
                        optionButton.appendChild(iconImg);
                    }
                    const textNode = document.createTextNode(item.text);
                    optionButton.appendChild(textNode);

                    optionButton.dataset.actionType = item.actionType;
                    if (item.actionValue !== undefined) optionButton.dataset.actionValue = item.actionValue;
                    if (item.isTarotRelated !== undefined) optionButton.dataset.isTarotRelated = String(item.isTarotRelated);
                    if (item.tarotbg !== undefined) optionButton.dataset.tarotbg = item.tarotbg; // tarotbg 데이터 속성 추가
                    
                    optionButton.disabled = isLoadingBotResponse;
                    moreOptionsPanel.appendChild(optionButton);
                });
            }
            if (groupIndex < menuGroups.length - 1) {
                const divider = document.createElement('div');
                divider.className = 'panel-menu-group-divider';
                moreOptionsPanel.appendChild(divider);
            }
        });
        console.log(`[Panel] 키 "${menuKey}" 메뉴 생성 완료.`);
    }

    moreOptionsBtn.addEventListener('click', () => {
        console.log("[Panel] 더보기 버튼 클릭.");
        if (!userProfile) {
            console.error("[Panel] 사용자 프로필 없음. 패널 열기 실패.");
            alert("오류: 사용자 프로필을 불러올 수 없습니다.");
            return;
        }

        const panelIsCurrentlyActive = moreOptionsPanel.classList.contains('active');
        const mainMenuKey = `main_menu_stage${userProfile.메뉴단계}`;

        if (!panelIsCurrentlyActive) {
            console.log(`[Panel] 메인 메뉴 로드 시도: ${mainMenuKey}`);
            menuNavigationHistory = [];
            populateMoreOptionsPanel(mainMenuKey, null);
            moreOptionsPanel.classList.add('active');
            moreOptionsBtn.classList.add('active');
            moreOptionsPanel.style.bottom = `${chatInputArea.offsetHeight - 1}px`;
            console.log("[Panel] 패널 활성화됨.");
        } else {
            moreOptionsPanel.classList.remove('active');
            moreOptionsBtn.classList.remove('active');
            console.log("[Panel] 패널 비활성화됨.");
        }
    });

    moreOptionsPanel.addEventListener('click', async (e) => {
        const targetOption = e.target.closest('.panel-option');
        if (targetOption && !targetOption.disabled && !isLoadingBotResponse) {
            e.stopPropagation();

            const actionType = targetOption.dataset.actionType;
            const actionValue = targetOption.dataset.actionValue;
            const isTarotRelatedMenu = targetOption.dataset.isTarotRelated === 'true';
            const tarotBgFromMenu = targetOption.dataset.tarotbg; // tarotbg 값 가져오기

            console.log(`[Panel] 옵션 클릭: Text="${targetOption.textContent.trim()}", Type="${actionType}", Value="${actionValue}", isTarotRelated=${isTarotRelatedMenu}, tarotBg=${tarotBgFromMenu}`);

            switch (actionType) {
                case 'SUB_MENU':
                    populateMoreOptionsPanel(actionValue, actionType);
                    break;
                case 'MODAL':
                    openModal(actionValue);
                    break;
                case 'CHAT_MESSAGE':
                    moreOptionsPanel.classList.remove('active');
                    moreOptionsBtn.classList.remove('active');
                    
                    const messageOptions = {};
                    if (tarotBgFromMenu) {
                        messageOptions.menuItemData = { tarotbg: tarotBgFromMenu };
                    }

                    if (hasUserSentMessage && isTarotRelatedMenu) {
                        const userConfirmation = confirm("현재 상담 주제가 변경됩니다. 새로운 주제로 진행할까요?");
                        if (userConfirmation) {
                            console.log("[Panel] 사용자가 새 주제 진행 확인.");
                            await processMessageExchange(actionValue, 'panel_option_topic_reset', { ...messageOptions, clearBeforeSend: true });
                        } else {
                            console.log("[Panel] 사용자가 새 주제 진행 취소.");
                            return;
                        }
                    } else {
                        await processMessageExchange(actionValue, 'panel_option', messageOptions);
                    }
                    break;
                case 'ALERT':
                    alert(actionValue);
                    moreOptionsPanel.classList.remove('active');
                    moreOptionsBtn.classList.remove('active');
                    break;
                case 'BACK_MENU':
                    console.log("[Panel] 뒤로 가기 요청. 현재 히스토리:", [...menuNavigationHistory]);
                    if (menuNavigationHistory.length > 0) {
                        const previousMenuKey = menuNavigationHistory.pop();
                        console.log(`[Panel] 이전 메뉴로 이동: "${previousMenuKey}"`);
                        populateMoreOptionsPanel(previousMenuKey, actionType);
                    } else {
                        console.log("[Panel] 뒤로 갈 히스토리 없음. 메인 메뉴로 이동.");
                        const mainMenuKey = `main_menu_stage${userProfile.메뉴단계}`;
                        populateMoreOptionsPanel(mainMenuKey, actionType);
                    }
                    break;
                default:
                    console.warn(`[Panel] 알 수 없는 액션 타입: ${actionType}`);
                    moreOptionsPanel.classList.remove('active');
                    moreOptionsBtn.classList.remove('active');
            }
        }
    });

    if (tarotCardScrollWrapper) {
        tarotCardScrollWrapper.addEventListener('scroll', () => {
            if (activeTooltip) {
                console.log("[Tooltip] 타로 그리드 스크롤 발생, 툴팁 숨김.");
                hideTooltip();
            }
        });
    }

    if (syncTypeTabsContainer) {
        syncTypeTabsContainer.addEventListener('click', (e) => {
            const targetTab = e.target.closest('.sync-tab-btn');
            if (targetTab && !targetTab.classList.contains('active')) {
                const tabId = targetTab.dataset.tab;
                updateSyncTypeModal(tabId);
            }
        });
    }

    sendBtn.addEventListener('click', handleSendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });
    messageInput.addEventListener('input', () => {
        adjustTextareaHeight();
        if (!isLoadingBotResponse) sendBtn.disabled = messageInput.value.trim() === '';
    });

    sampleAnswersContainer.addEventListener('click', async (e) => {
        const targetButton = e.target.closest('.sample-answer-btn');
        if (targetButton && !targetButton.disabled && !isLoadingBotResponse) {
            const buttonValue = targetButton.dataset.value; 
            const buttonActionType = targetButton.dataset.actionType || 'message';
            
            // --- 중요: info_disabled 버튼 클릭 시 처리 중단 ---
            if (buttonActionType === 'info_disabled') {
                console.log("[SampleAnswersClick] info_disabled 버튼 클릭됨, 처리하지 않음.");
                return; 
            }
            // --- 중요: info_disabled 버튼 클릭 시 처리 중단 끝 ---

            const buttonCost = targetButton.dataset.cost ? parseInt(targetButton.dataset.cost, 10) : undefined;
            
            const btnTextElement = targetButton.querySelector('.btn-text');
            const buttonText = btnTextElement ? btnTextElement.textContent : targetButton.textContent.trim();

            const buttonDataForExchange = {
                value: buttonValue, 
                text: buttonText, 
                actionType: buttonActionType,
                cost: buttonCost
                // 여기에 isTarotRelated, tarotbg 등 버튼 데이터 속성 추가 가능 (필요시)
            };
            
            // 첫 번째 인자로 buttonValue (API로 보낼 값 또는 내부 액션 값)를 명확히 전달
            await processMessageExchange(buttonValue, 'sample_button', { buttonData: buttonDataForExchange });
        }
    });
    document.addEventListener('click', (e) => {
        if (activeTooltip && !activeTooltip.contains(e.target) && !e.target.closest('.tarot-card-item')) {
            console.log("[Tooltip] 문서 외부 클릭으로 툴팁 숨김.");
            hideTooltip();
        }
        if (moreOptionsPanel.classList.contains('active') &&
            !moreOptionsBtn.contains(e.target) &&
            !moreOptionsPanel.contains(e.target)) {
            console.log("[Panel] 외부 클릭으로 패널 닫기.");
            moreOptionsPanel.classList.remove('active');
            moreOptionsBtn.classList.remove('active');
        }
    }, true);
async function callChatAPI(promptContent, chatHistory = [], maxRetries = 3) {
    console.log("[API] 실제 API 호출 시작. 프롬프트 앞부분:", promptContent.substring(0, 100) + "...", "히스토리 항목 수:", chatHistory.length);
    
    let attempt = 0;
    while (attempt < maxRetries) {
        try {
            const requestBody = {
                contents: []
            };

            if (chatHistory && chatHistory.length > 0) {
                requestBody.contents.push(...chatHistory);
            }
            requestBody.contents.push({ role: "user", parts: [{ text: promptContent }] });
            
            console.log(`[API] 요청 본문 (시도 ${attempt + 1}):`, JSON.stringify(requestBody).substring(0, 300) + "...");

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`API 요청 실패 (시도 ${attempt + 1}): ${response.status} ${response.statusText} - ${errorBody}`);
            }

            const responseJson = await response.json();
            console.log("[API] 응답 성공 (시도 " + (attempt + 1) + "):", JSON.stringify(responseJson).substring(0,200) + "...");

            if (!responseJson.candidates || !responseJson.candidates[0] || !responseJson.candidates[0].content || !responseJson.candidates[0].content.parts || !responseJson.candidates[0].content.parts[0] || typeof responseJson.candidates[0].content.parts[0].text !== 'string') {
                console.error("[API] 응답 형식이 예상과 다릅니다:", responseJson);
                throw new Error("API 응답에서 유효한 텍스트를 찾을 수 없습니다.");
            }
            
            let rawText = responseJson.candidates[0].content.parts[0].text;
            // 마크다운 코드 블록 제거 로직 추가
            if (rawText.startsWith("```json")) {
                rawText = rawText.substring(7); // "```json\n" 또는 "```json " 제거 고려
            } else if (rawText.startsWith("```")) { // json 명시 없이 ```만 있을 경우
                rawText = rawText.substring(3);
            }
            if (rawText.endsWith("```")) {
                rawText = rawText.substring(0, rawText.length - 3);
            }
            rawText = rawText.trim(); // 앞뒤 공백 제거

            return { 
                json: () => Promise.resolve(responseJson), 
                text: () => Promise.resolve(rawText), // 정제된 텍스트 반환
                ok: true 
            };

        } catch (error) {
            console.error(`[API] 호출 시도 ${attempt + 1} 실패:`, error);
            attempt++;
            if (attempt >= maxRetries) {
                console.error("[API] 최대 재시도 횟수 도달. 최종 실패.");
                throw error; 
            }
            const delayMs = 1000 * Math.pow(2, attempt -1); 
            console.log(`[API] ${delayMs}ms 후 재시도...`);
            await new Promise(r => setTimeout(r, delayMs));
        }
    }
    throw new Error("API 호출 최종 실패 (모든 재시도 후)");
}

    function showFullScreenLoader(message = "처리 중...") {
        if (fullScreenLoader) {
            const loaderTextElement = fullScreenLoader.querySelector('.loader-text');
            if (loaderTextElement) {
                loaderTextElement.textContent = message;
            }
            fullScreenLoader.style.display = 'flex';
            console.log(`[Loader] 전체 화면 로더 표시: ${message}`);
        }
    }

    function hideFullScreenLoader() {
        if (fullScreenLoader) {
            fullScreenLoader.style.display = 'none';
            console.log("[Loader] 전체 화면 로더 숨김.");
        }
    }

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            adjustChatMessagesPadding();
            if (moreOptionsPanel.classList.contains('active')) {
                moreOptionsPanel.style.bottom = `${chatInputArea.offsetHeight - 1}px`;
            }
        }, 100);
    });

async function initializeChat() {
    console.log("[App] 초기화 시작.");

    try {
        const promptsToLoad = [
            loadPromptFromFile('prompts/synctypetest.ini'),
            loadPromptFromFile('prompts/tarotchoice.ini'),
            loadPromptFromFile('prompts/tarottrans.ini'),
            loadPromptFromFile('prompts/tarotadvice.ini'),
        ];
        const loadedContents = await Promise.all(promptsToLoad);
        LOADED_PROMPT_SYNC_TYPE_TEST = loadedContents[0];
        LOADED_PROMPT_TAROT_CHOICE = loadedContents[1];
        LOADED_PROMPT_TAROT_TRANS = loadedContents[2];
        LOADED_PROMPT_TAROT_ADVICE = loadedContents[3];
        console.log("[App] 모든 프롬프트 파일 로드 완료.");

    } catch (error) {
        console.error("[App] 프롬프트 파일 로딩 중 치명적 오류 발생. 앱 초기화 중단.", error);
        await addMessage("시스템 설정 파일을 불러오는 중 오류가 발생했습니다. 앱을 사용할 수 없습니다.", 'system');
        if(messageInput) messageInput.disabled = true;
        if(sendBtn) sendBtn.disabled = true;
        if(moreOptionsBtn) moreOptionsBtn.disabled = true;
        return; 
    }

    initializeUserProfile(); 

    if (typeof ALL_SYNC_TYPES === 'undefined' || typeof ALL_NEBULAS === 'undefined' || typeof TAROT_CARD_DATA === 'undefined' || typeof QUESTIONS_DATA === 'undefined') {
        const missingData = [
            typeof ALL_SYNC_TYPES === 'undefined' ? 'ALL_SYNC_TYPES (syncTypes.js)' : null,
            typeof ALL_NEBULAS === 'undefined' ? 'ALL_NEBULAS (nebulas.js)' : null,
            typeof TAROT_CARD_DATA === 'undefined' ? 'TAROT_CARD_DATA (tarotData.js)' : null,
            typeof QUESTIONS_DATA === 'undefined' ? 'QUESTIONS_DATA (questions.js)' : null,
        ].filter(Boolean).join(', ');

        console.error(`[App] 필수 데이터(${missingData})가 로드되지 않았습니다. HTML에서 해당 스크립트 파일들을 확인해주세요.`);
        await addMessage(`시스템 설정 오류로 일부 기능을 사용할 수 없습니다. (${missingData} 누락)`, 'system');
    } else {
        generateSyncTypeData();
        console.log("[App] 외부 데이터 로드 확인 후 SyncTypeData 생성 완료.");
    }

    adjustTextareaHeight();
    if(sendBtn) sendBtn.disabled = true;
    if(messageInput) messageInput.disabled = true; 
    if(moreOptionsBtn) moreOptionsBtn.disabled = true;
    requestAnimationFrame(adjustChatMessagesPadding);

    if (tarotSelectionConfirmBtn) tarotSelectionConfirmBtn.addEventListener('click', handleTarotSelectionConfirm);
    if (tarotClearSelectionBtn) tarotClearSelectionBtn.addEventListener('click', handleClearTarotSelection);
    if (tarotRandomSelectBtn) tarotRandomSelectBtn.addEventListener('click', handleRandomTarotSelection);
    
    isLoadingBotResponse = true;
    setUIInteractions(true, false, true); 

    try {
        await addMessage(initialBotMessage.text, 'bot'); 
        // 초기 샘플 답변은 initialBotMessage에 정의된 것을 직접 사용
        updateSampleAnswers(initialBotMessage.sampleAnswers, 'low', false, null);
        // 초기에는 채팅 입력 비활성화 유지 (메뉴 선택 유도)
        setUIInteractions(isLoadingBotResponse, false, true); 

    } catch (error) {
        console.error("[App] 초기 메시지 표시 중 오류:", error);
        await addMessage("초기 메시지를 표시하는 중 오류가 발생했습니다.", "system");
    }

    isLoadingBotResponse = false;
    // 초기화 완료 후 UI 상태 최종 설정
    const finalDisableInput = !userProfile.isInDeepAdviceMode && userProfile.현재테스트종류 !== 'subjective';
    setUIInteractions(false, false, finalDisableInput); 


    if(moreOptionsBtn) {
        moreOptionsBtn.disabled = false;
        if (moreOptionsBtn && !moreOptionsPanel.classList.contains('active')) {
            console.log("[App] 초기화 후 더보기 메뉴 자동 펼침 시도.");
            moreOptionsBtn.click();
        }
    }
    console.log("[App] 초기화 완료.");
}
    initializeChat();
});