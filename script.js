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

// 다단락 응답 처리용 전역 변수
let currentCardInterpretation = null; // API로부터 받은 현재 카드에 대한 전체 해석 객체
let currentShortIndex = -1;          // 현재 보여주고 있는 단락의 인덱스 (0부터 시작)
let currentIniFileName = '';         // 현재 사용 중인 .ini 파일명
let currentSelectedCardImagePaths = []; // 현재 해석 중인 카드의 이미지 경로들 (단일 또는 여러 개)


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
        // --- API 관련 상수 ---
    const API_KEY = 'AIzaSyDSAA6rbNdD3tV1W_u0nIll0XyTe63rU_k'; // 사용자가 제공한 API 키
    let MODEL_NAME = 'gemini-2.5-flash-preview-04-17'; // 기본 모델명, 추후 변경 가능
    let API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;
    console.log("[API] 초기화: API_KEY, MODEL_NAME, API_URL 설정 완료.");

    // --- 대화 기록 관리 ---
    let chatHistoryForAPI = []; // Gemini API 요청을 위한 대화 기록


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
        "결정된싱크타입": "스텔라터틀",
        "사용자소속성운": "루미네시아",
        "사용자가성운에속한이유": "아직 알 수 없어요.",
        "맞춤싱크타입이름": "별을 기다리는 자",
        "overviewText": "당신은 복잡한 내면세계를 가진 존재입니다. 때로는 활기차고 외향적이다가도, 깊은 생각에 잠겨 혼자만의 시간을 즐기기도 합니다. 다양한 가능성을 탐색하는 것을 좋아하며, 정해진 틀에 얽매이는 것을 답답해할 수 있습니다. 당신의 강점은 뛰어난 직관력과 공감 능력이지만, 때로는 감정에 쉽게 휩쓸리거나 결정을 내리는 데 어려움을 겪을 수도 있습니다. 균형을 찾는 여정이 중요해 보입니다.",
        "사용자의감정상태": "평온",
        "선택된타로카드들": [], // API 전송 및 내부 로직용 (카드 ID 저장)
        "지금까지수집된타로카드": [],
        "시나리오": null,
        "메뉴단계": 1,
        "싱크타입단계": "미결정",
        "tarotbg": "default.png",
        "bones": 10 // 기본 뼈다귀 개수 (예시)
    };

    userProfile = { ...defaultProfile };
    currentSelectedCardImagePaths = []; // 초기화 시 카드 이미지 경로도 비움

    if (loadedProfileData) {
        // 기존 속성들 로드
        if (loadedProfileData.결정된싱크타입) userProfile.결정된싱크타입 = loadedProfileData.결정된싱크타입;
        if (loadedProfileData.사용자소속성운) userProfile.사용자소속성운 = loadedProfileData.사용자소속성운;
        if (loadedProfileData.사용자이름) userProfile.사용자이름 = loadedProfileData.사용자이름;
        if (loadedProfileData.사용자애칭) userProfile.사용자애칭 = loadedProfileData.사용자애칭;
        if (loadedProfileData.지금까지수집된타로카드) userProfile.지금까지수집된타로카드 = loadedProfileData.지금까지수집된타로카드;
        if (loadedProfileData.overviewText) userProfile.overviewText = loadedProfileData.overviewText;
        if (loadedProfileData.tarotbg) userProfile.tarotbg = loadedProfileData.tarotbg;
        if (typeof loadedProfileData.bones === 'number') userProfile.bones = loadedProfileData.bones; // 뼈다귀 개수 로드
        // 선택된 타로카드 ID 목록은 로드하지만, currentSelectedCardImagePaths는 API 호출 시점에 채워지므로 여기서 로드하지 않음.
        if (loadedProfileData.선택된타로카드들) userProfile.선택된타로카드들 = loadedProfileData.선택된타로카드들;


        if (userProfile.결정된싱크타입 && userProfile.사용자소속성운) {
            userProfile.싱크타입단계 = "결정됨";
        }
        console.log("[UserProfile] 로컬 스토리지 데이터로 프로필 업데이트 완료.");
    } else {
        console.log("[UserProfile] 첫 방문 또는 로컬 데이터 없음. 기본값 사용 및 저장.");
        userProfile.사용자이름 = "임시방문객";
        userProfile.사용자애칭 = "별 탐험가";
        userProfile.싱크타입단계 = "결정됨"; // 기본값을 결정됨으로 시작 (추후 변경 가능)
        saveUserProfileToLocalStorage(userProfile);
    }

    updateBoneCountDisplay(); // 뼈다귀 UI 업데이트
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
        사용자애칭: profile.사용자애칭,
        사용자이름: profile.사용자이름,
        지금까지수집된타로카드: profile.지금까지수집된타로카드,
        overviewText: profile.overviewText,
        tarotbg: profile.tarotbg,
        선택된타로카드들: profile.선택된타로카드들,
        bones: profile.bones // 뼈다귀 개수 저장
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

async function addMessage(data, type, options = {}) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    
    let textContentForLog = "";
    let tarotImageToDisplay = null; // 개별 메시지 내 타로 이미지 (예: freetalk.ini에서 지정)
    let displayCardImageHeader = options.displayCardImageHeader || false; // 단락 위에 표시할 카드 이미지 여부

    if (typeof data === 'string') {
        textContentForLog = data;
    } else if (data && typeof data.text === 'string') {
        textContentForLog = data.text;
        if (data.tarotImg) tarotImageToDisplay = data.tarotImg;
    } else if (data && typeof data.interpretationHtml === 'string') {
        textContentForLog = "조수 해석 컨텐츠";
    } else if (data && data.assistantmsg && typeof data.assistantmsg === 'string') {
        textContentForLog = data.assistantmsg;
        if (data.tarotImg) tarotImageToDisplay = data.tarotImg;
    }

    console.log(`[Message] '${type}' 메시지 추가 시작: "${textContentForLog.substring(0, 70)}..."`, 
                tarotImageToDisplay ? `개별이미지: ${tarotImageToDisplay}` : "",
                displayCardImageHeader ? `카드헤더표시: Yes, 경로: ${currentSelectedCardImagePaths.join(', ')}` : "");

    return new Promise(async (resolveAllMessagesAdded) => {
        if (type === 'user') {
            messageDiv.classList.add('user-message');
            messageDiv.textContent = typeof data === 'string' ? data : (data.text || data.assistantmsg);
            if (chatMessages) chatMessages.appendChild(messageDiv);
            requestAnimationFrame(() => {
                adjustChatMessagesPadding();
                scrollToBottom();
                console.log("[Message] 사용자 메시지 DOM 추가 완료.");
                resolveAllMessagesAdded();
            });
        } else if (type === 'bot') {
            messageDiv.classList.add('bot-message');

            // 단락 위 카드 이미지 헤더 표시 로직 (displayCardImageHeader가 true이고, 경로가 있을 경우)
            if (displayCardImageHeader && currentSelectedCardImagePaths && currentSelectedCardImagePaths.length > 0) {
                const cardImageHeaderDiv = document.createElement('div');
                cardImageHeaderDiv.className = 'message-card-image-header';
                
                currentSelectedCardImagePaths.forEach(imgPath => {
                    if (imgPath) { // 유효한 경로만 처리
                        const imgElement = document.createElement('img');
                        imgElement.src = imgPath; // 경로는 'img/tarot/major_00_fool_upright.png'와 같은 형태여야 함
                        imgElement.alt = "선택된 타로 카드"; // alt 텍스트 개선 가능
                        imgElement.className = 'header-tarot-card-image';
                        cardImageHeaderDiv.appendChild(imgElement);
                    }
                });
                if (cardImageHeaderDiv.hasChildNodes()) { // 이미지가 하나라도 추가된 경우에만 헤더를 추가
                     messageDiv.appendChild(cardImageHeaderDiv);
                }
            }
            
            // 메시지 내 개별 타로 이미지 표시 (tarotImageToDisplay가 유효할 경우)
            if (tarotImageToDisplay) {
                const imgElement = document.createElement('img');
                imgElement.src = `img/tarot/${tarotImageToDisplay}`; 
                imgElement.alt = "타로 카드 이미지";
                imgElement.className = 'chat-embedded-image tarot-card-in-message';
                messageDiv.appendChild(imgElement);
            }

            if (data && data.isAssistantInterpretation) {
                messageDiv.classList.add('assistant-type-message');
                const interpretationContainer = document.createElement('div');
                interpretationContainer.className = 'assistant-interpretation-container';
                interpretationContainer.innerHTML = sanitizeBotHtml(data.interpretationHtml);
                messageDiv.appendChild(interpretationContainer);
                if (chatMessages) chatMessages.appendChild(messageDiv);
                requestAnimationFrame(() => {
                    adjustChatMessagesPadding();
                    scrollToBottom();
                    console.log("[Message] 조수 해석 메시지 DOM 추가 완료.");
                    resolveAllMessagesAdded();
                });
            } else {
                if (chatMessages) chatMessages.appendChild(messageDiv);
                
                requestAnimationFrame(() => {
                    adjustChatMessagesPadding();
                    scrollToBottom();
                });

                const textToType = typeof data === 'string' ? data : (data.text || data.assistantmsg);
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
                                if (word.trim() !== '') typingChunks.push({ type: 'text_word', content: word });
                                else if (word.length > 0) typingChunks.push({ type: 'text_whitespace', content: word });
                            });
                        } else if (textContent.length > 0) {
                            typingChunks.push({ type: 'text_whitespace', content: textContent });
                        }
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        const tagName = node.tagName.toLowerCase();
                        if (tagName === 'img' && (node.classList.contains('chat-embedded-image') || node.classList.contains('header-tarot-card-image'))) {
                            // 이미지는 위에서 별도 처리
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
                
                // 텍스트가 추가될 컨텍스트를 messageDiv 내부의 특정 위치로 지정할 수 있도록 수정
                // 예를 들어, 이미지가 있다면 이미지 다음에 텍스트가 오도록
                let currentContextElement = messageDiv;
                // 만약 messageDiv 내부에 이미 .assistant-interpretation-container 같은 특정 컨테이너가 있다면
                // 그 안에 텍스트를 넣도록 할 수도 있지만, 현재 로직은 messageDiv에 직접 추가.
                // 혹은, 텍스트를 담을 span이나 div를 하나 만들고 그 안에 타이핑.
                const textWrapperDiv = document.createElement('div'); // 텍스트 컨텐츠를 위한 래퍼
                messageDiv.appendChild(textWrapperDiv);
                currentContextElement = textWrapperDiv;


                for (let i = 0; i < typingChunks.length; i++) {
                    const chunk = typingChunks[i];
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
                        if (currentContextElement !== textWrapperDiv && currentContextElement.tagName.toLowerCase() === chunk.tagName && currentContextElement.parentElement) {
                            currentContextElement = currentContextElement.parentElement;
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
            messageDiv.textContent = typeof data === 'string' ? data : (data.text || data.assistantmsg);
            if (chatMessages) chatMessages.appendChild(messageDiv);
            requestAnimationFrame(() => {
                adjustChatMessagesPadding();
                scrollToBottom();
                console.log("[Message] 시스템 메시지 DOM 추가 완료.");
                resolveAllMessagesAdded();
            });
        } else {
            console.warn(`[Message] 알 수 없는 메시지 타입: ${type}`);
            resolveAllMessagesAdded();
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
        console.log(`[SampleAnswers] 업데이트 시작. Answers:`, JSON.parse(JSON.stringify(answers)), `Importance: ${importance}`);
        const existingElements = Array.from(sampleAnswersContainer.querySelectorAll('.sample-answer-btn, .sample-answer-prompt'));
        const buttonFadeOutDuration = 200; 

        if (importance === 'high') {
            if (!sampleAnswersContainer.classList.contains('high-importance')) {
                sampleAnswersContainer.classList.add('high-importance');
            }
        } else {
            if (sampleAnswersContainer.classList.contains('high-importance')) {
                sampleAnswersContainer.classList.remove('high-importance');
            }
        }
        
        function addAndAnimateNewButtons() {
            sampleAnswersContainer.innerHTML = '';

            if (isConfirmationStage && promptMessage) {
                const promptDiv = document.createElement('div');
                promptDiv.className = 'sample-answer-prompt';
                promptDiv.innerHTML = promptMessage; 
                sampleAnswersContainer.appendChild(promptDiv);
            }

            if (answers.length > 0) {
                if (!sampleAnswersContainer.classList.contains('has-buttons')) {
                    sampleAnswersContainer.classList.add('has-buttons');
                }
                answers.forEach((answerData, index) => {
                    const button = document.createElement('button');
                    button.classList.add('sample-answer-btn');
                    const answerText = answerData.text;
                    const answerValue = answerData.value || answerText; 
                    button.dataset.value = answerValue; 
                    button.dataset.actionType = answerData.actionType || (answerData.type ? 'multi_step_choice' : 'message');
                    if (answerData.type) button.dataset.type = answerData.type;
                    
                    // 로그 추가: 생성되는 버튼의 dataset 확인
                    console.log(`[SampleAnswers] 버튼 생성: text="${answerText}", value="${answerValue}", actionType="${button.dataset.actionType}", type="${button.dataset.type}"`);

                    const contentWrapper = document.createElement('span');
                    contentWrapper.className = 'btn-content-wrapper';
                    
                    const costForThisButton = determineCostByType(answerData.type);
                    const shouldDisplayCostIcon = answerData.displayCostIcon !== undefined ? answerData.displayCostIcon : (costForThisButton >= 0 && answerData.type !== 'placeholder');
                    const iconTypeToShow = answerData.iconType || (costForThisButton > 0 ? 'bone' : 'free');
                    const shouldDisplayCostText = answerData.displayCostText !== undefined ? answerData.displayCostText : (costForThisButton > 0);

                    if (shouldDisplayCostIcon) {
                        const costIcon = document.createElement('img');
                        costIcon.alt = '';
                        costIcon.className = 'cost-icon';
                        if (iconTypeToShow === 'free') {
                            costIcon.src = 'img/icon/free_tag.png';
                            costIcon.alt = '무료';
                            costIcon.classList.add('free-icon');
                        } else if (iconTypeToShow === 'bone' && costForThisButton > 0) { 
                            costIcon.src = 'img/icon/bone_inline.png';
                            costIcon.alt = '뼈다귀';
                        }
                        
                        if (costIcon.src) contentWrapper.appendChild(costIcon);

                        if (shouldDisplayCostText && costForThisButton > 0) {
                            const costTextSpan = document.createElement('span');
                            costTextSpan.className = 'cost-text';
                            costTextSpan.textContent = `-${costForThisButton}`;
                            contentWrapper.appendChild(costTextSpan);
                        }
                        if (costIcon.src || (shouldDisplayCostText && costForThisButton > 0) ) {
                             contentWrapper.appendChild(document.createTextNode('\u00A0')); 
                        }
                    }

                    const textSpan = document.createElement('span');
                    textSpan.className = 'btn-text';
                    textSpan.textContent = answerText;
                    contentWrapper.appendChild(textSpan);
                    button.appendChild(contentWrapper);

                    button.style.animationDelay = `${index * 70}ms`; 
                    button.disabled = isLoadingBotResponse || answerData.disabled; 
                    sampleAnswersContainer.appendChild(button);
                });
            } else {
                if (sampleAnswersContainer.classList.contains('has-buttons')) {
                    sampleAnswersContainer.classList.remove('has-buttons');
                }
            }
            
            requestAnimationFrame(adjustChatMessagesPadding);
            resolve(); 
        }

        if (existingElements.length > 0) {
            existingElements.forEach(el => el.classList.add('fade-out'));
            setTimeout(() => {
                addAndAnimateNewButtons();
            }, buttonFadeOutDuration);
        } else {
            addAndAnimateNewButtons();
        }
    });
}
// const botKnowledgeBase = {
//     "오늘의 운세 보여줘": { response: "오늘 당신의 운세는... <b>매우 긍정적</b>입니다! 새로운 시작을 하기에 좋은 날이에요. <br>자신감을 가지세요!", sampleAnswers: ["다른 운세", "고마워"] },
//     "오늘 뭐 먹을지 추천해줘": { response: "오늘은 <b>따뜻한 국물 요리</b> 어떠세요? 예를 들어, <b>김치찌개</b>나 <b>순두부찌개</b>도 좋겠네요!", sampleAnswers: ["김치찌개 레시피", "다른 추천"] },
//     "썸인지 아닌지 알려줘": { response: "상대방의 행동과 말투를 자세히 알려주시면, 제가 분석해볼게요! <br>예를 들어, '그 사람은 나에게 자주 웃어줘요.' 처럼요.", sampleAnswers: ["카톡 대화 분석해줘", "데이트 신청해도 될까?"] },
//     "그 사람의 마음을 알고 싶어": { response: "마음을 읽는 것은 어렵지만, 몇 가지 질문을 통해 추측해볼 수 있어요.<br>그 사람과 어떤 관계인가요?", sampleAnswers: ["친구 관계예요", "직장 동료예요"] },
//     "오늘의 운세가 궁금해요.": { response: "오늘의 운세입니다:<br><b>희망찬 하루!</b> 작은 노력들이 결실을 맺을 거예요.<br>자신감을 갖고 나아가세요.", sampleAnswers: ["다른 운세 보기", "오늘 날씨는?", "고마워"] },
//     "추천 메뉴 알려주세요.": { response: "오늘은 특별한 날인가요? <b>스테이크</b> 어떠세요?<br>아니면 가볍게 <b>샐러드 파스타</b>도 좋아요!", sampleAnswers: ["스테이크 맛집", "파스타 레시피", "다른 추천"] },
//     "날씨 알려줘.": { response: "현재 계신 지역의 날씨를 알려드릴까요?<br>아니면 특정 도시의 날씨가 궁금하신가요?", sampleAnswers: ["서울 날씨", "부산 날씨", "내 위치 날씨"] },
//     "도움말 보여주세요.": { response: "무엇을 도와드릴까요?<br>저는 <b>운세 보기</b>, <b>메뉴 추천</b>, <b>날씨 정보</b> 등을 제공할 수 있어요.<br>궁금한 것을 말씀해주세요!", sampleAnswers: ["오늘의 운세", "추천 메뉴", "날씨 알려줘"] },
//     "오늘의 운세": { response: "오늘의 운세입니다:<br><b>대박!</b> 원하는 모든 것을 이룰 수 있는 하루예요!<br>긍정적인 마음으로 도전해보세요.", sampleAnswers: ["추천 메뉴", "오늘 날씨 어때?", "고마워"] },
//     "추천 메뉴": { response: "점심 메뉴로는 <b>얼큰한 김치찌개</b> 어떠세요? 아니면 저녁으로 <b>부드러운 크림 파스타</b>도 좋겠네요!", sampleAnswers: ["김치찌개 레시피", "파스타 맛집 추천", "다른 거 없어?"] },
//     "날씨 알려줘": { response: "오늘 서울의 날씨는 <b>맑음</b>, 최고 기온 25도입니다. <br>외출하기 좋은 날씨네요!", sampleAnswers: ["미세먼지 정보", "내일 날씨는?", "고마워"] },
//     "기본": { response: "죄송해요, 잘 이해하지 못했어요. <br><b>도움말</b>이라고 입력하시면 제가 할 수 있는 일을 알려드릴게요.", sampleAnswers: ["도움말", "오늘의 운세", "추천 메뉴"] }
// };
async function simulateBotResponse(userMessageText) {
    console.log(`[SimulateResponse] ========== 함수 시작 ========== 입력: "${userMessageText}"`);
    let responseData = {};
    let additionalInstructionForAPI = null;

    // 1. 하드코딩된 초기 UI 응답 (API 호출 없음)
    if (userMessageText === "오늘의 운세 보여줘" || userMessageText === "썸인지 아닌지 알려줘" || userMessageText === "그 사람의 마음을 알고 싶어" || userMessageText === "오늘 뭐 먹을지 추천해줘" ) {
        console.log(`[SimulateResponse] "${userMessageText}" 감지: '몇 장 뽑을래?' 하드코딩 선택지 반환.`);
        currentCardInterpretation = null; 
        currentShortIndex = -1;
        currentSelectedCardImagePaths = [];
        currentIniFileName = ''; 

        // assistantmsg를 새로운 다단락 JSON 형식으로 통일
        responseData = {
            assistantmsg: {
                totalShorts: 1,
                shorts: [{
                    id: 1,
                    text: "응, 좋아. 카드를 몇 장 뽑아볼까? 😊",
                    sampleAnswers: [ 
                        { type: "system_choice_one_cost_0", text: "1장만 볼래" }, // actionType은 updateSampleAnswers에서 자동 부여 가능
                        { type: "system_choice_three_cost_2", text: "3장으로 자세히 볼래" }
                    ]
                }]
            },
            // sampleAnswers 필드는 이제 assistantmsg.shorts[0].sampleAnswers로 통합됨
            importance: 'high' 
        };
    } else if (userMessageText === "action_show_initial_menu") { 
        console.log("[SimulateResponse] 'action_show_initial_menu' 감지: 초기 환영 메시지 반환.");
        currentCardInterpretation = null; 
        currentShortIndex = -1;
        currentSelectedCardImagePaths = [];
        currentIniFileName = '';
        responseData = {
            assistantmsg: { // 다단락 형식으로 통일
                totalShorts: 1,
                shorts: [{
                    id: 1,
                    text: "안녕, 또 왔네. 😊 어떤 타로를 준비해볼까?",
                    sampleAnswers: [
                        { type: "placeholder", text: "좌측 [더보기] 메뉴에서 원하는 타로를 선택해줘." }
                        // 플레이스홀더는 버튼으로 만들 때 disabled 처리 필요
                    ]
                }]
            }
        };
    }
    // 2. 카드 선택 UI를 띄우기 위한 정보 반환 (API 호출 없음)
    else if (userMessageText === "action_select_one_card_trigger") {
        console.log("[SimulateResponse] 'action_select_one_card_trigger' 감지: 1장 카드 선택 UI 요청.");
        currentIniFileName = 'tarot-single.ini'; 
        console.log(`[SimulateResponse] currentIniFileName 설정: ${currentIniFileName}`);
        userProfile.시나리오 = "tarot_single_pick";
        responseData = {
            tarocardview: true,
            cards_to_select: 1,
            systemMessageOnConfirm: "좋아, 1장을 선택했네. 마음에 드는 카드를 골라봐. ✨"
        };
    } else if (userMessageText === "action_select_three_cards_trigger") { // 비용 확인 UI 요청
        console.log("[SimulateResponse] 'action_select_three_cards_trigger' 감지: 3장 카드 비용 확인 UI 요청.");
        responseData = {
            requestUiUpdate: "show_three_cards_cost_confirm" 
        };
    }
    else if (userMessageText === "action_confirm_three_cards_cost_trigger") { // 비용 확인 후 카드 선택 UI 요청
        console.log("[SimulateResponse] 'action_confirm_three_cards_cost_trigger' 감지: 3장 카드 선택 UI 요청.");
        currentIniFileName = 'tarot-1st.ini'; 
        console.log(`[SimulateResponse] currentIniFileName 설정: ${currentIniFileName}`);
        userProfile.시나리오 = "tarot_triple_pick";
        responseData = {
            tarocardview: true,
            cards_to_select: 3,
            systemMessageOnConfirm: "좋아! 3장을 선택했구나. 신중하게 골라봐. 😊"
        };
    }
    else if (userMessageText === "action_confirm_add_two_cards_cost_trigger") { // 2장 추가 비용 확인 후 카드 선택 UI 요청
        console.log("[SimulateResponse] 'action_confirm_add_two_cards_cost_trigger' 감지: 2장 추가 카드 선택 UI 요청.");
        currentIniFileName = 'tarot-single-add2-1st.ini'; 
        console.log(`[SimulateResponse] currentIniFileName 설정: ${currentIniFileName}`);
        userProfile.시나리오 = "tarot_add_two_pick";
        responseData = {
            tarocardview: true,
            cards_to_select: 2,
            systemMessageOnConfirm: "좋아, 2장을 더 골라보자! 어떤 카드가 나올까? 👀"
        };
    }
    // 3. API 호출이 필요한 경우
    else if (userMessageText === "카드 선택 완료" || userMessageText === "action_cards_selected_start_interpretation" || userMessageText === "action_interpret_next_card" || userMessageText.startsWith("freetalk_") /* 예시: 자유대화 시작을 알리는 접두사 */ || (!userMessageText.startsWith("action_") && currentCardInterpretation === null) /* 일반 텍스트 입력이고, 현재 해석 중이 아닐 때 */ ) {
        
        if (userMessageText === "카드 선택 완료" || userMessageText === "action_cards_selected_start_interpretation") {
            console.log(`[SimulateResponse] "${userMessageText}" 감지: 카드 선택 완료, 첫 해석 API 호출. 현재 ini: ${currentIniFileName}`);
            if (!currentIniFileName) { // tarot-single.ini 또는 tarot-1st.ini 등이 설정되어 있어야 함
                console.error("[SimulateResponse] '카드 선택 완료': currentIniFileName이 설정되지 않았습니다. tarot-single.ini로 기본 설정합니다.");
                currentIniFileName = 'tarot-single.ini'; 
                console.log(`[SimulateResponse] currentIniFileName 기본값 설정: ${currentIniFileName}`);
            }
            if (!userProfile.선택된타로카드들 || userProfile.선택된타로카드들.length === 0) {
                 console.error("[SimulateResponse] '카드 선택 완료': 선택된 카드가 없습니다.");
                 return { assistantmsg: {totalShorts:1, shorts:[{id:1, text:"오류: 선택된 카드가 없어 해석을 시작할 수 없어. 다시 시도해 줄래?", sampleAnswers:[{type:"return_home", text:"처음으로"}]}]}};
            }
            const cardNames = userProfile.선택된타로카드들.map(id => (TAROT_CARD_DATA[id] ? TAROT_CARD_DATA[id].name : id)).join(', ');
            const selectionCompleteMsgForHistory = `사용자가 다음 타로 카드를 선택했어: ${cardNames}. 이 카드들에 대한 해석을 부탁해.`;
            if (chatHistoryForAPI.length === 0 || chatHistoryForAPI[chatHistoryForAPI.length-1].parts[0].text !== selectionCompleteMsgForHistory) {
                chatHistoryForAPI.push(formatChatHistoryForAPI(selectionCompleteMsgForHistory, 'user'));
                console.log("[SimulateResponse] 카드 선택 완료 메시지 히스토리 추가:", selectionCompleteMsgForHistory);
            }
            // additionalInstructionForAPI 설정 (이전과 동일)
            additionalInstructionForAPI = "선택된 카드에 대한 첫 번째 해석을 시작해줘.";
            if (currentIniFileName === 'tarot-1st.ini') { additionalInstructionForAPI = "사용자가 선택한 세 장의 카드 중 첫 번째 카드를 해석하는 단계야. 전체적인 흐름을 염두에 두되, 이번 응답은 첫 번째 카드에 집중해줘."; } 
            else if (currentIniFileName === 'tarot-2nd.ini') { additionalInstructionForAPI = "이전에 해석한 첫 번째 카드와 연결하여, 지금 사용자가 선택한 세 장의 카드 중 두 번째 카드에 대한 해석을 시작해줘."; } 
            else if (currentIniFileName === 'tarot-3rd.ini') { additionalInstructionForAPI = "이전에 해석한 두 카드와 연결하여, 지금 사용자가 선택한 세 장의 카드 중 세 번째 카드에 대한 해석을 시작하고, 전체적인 조언과 함께 마무리해줘. 이 해석이 끝나면 종합 심층 해석이나 상담 종료를 제안해야 해."; } 
            else if (currentIniFileName === 'tarot-single.ini') { additionalInstructionForAPI = "사용자가 선택한 한 장의 카드에 대한 해석을 시작해줘. 해석이 끝나면 2장 더 뽑기나 심층 해석을 제안해야 해."; } 
            else if (currentIniFileName === 'tarot-single-add2-1st.ini') { additionalInstructionForAPI = "이전에 해석한 한 장의 카드에 이어, 추가로 선택된 첫 번째 카드(총 두 번째 카드)에 대한 해석을 시작해줘. 이전 카드의 내용을 참고해서 연결해주는 게 좋아."; } 
            else if (currentIniFileName === 'tarot-single-add2-last.ini') { additionalInstructionForAPI = "이전에 해석한 두 장의 카드에 이어, 추가로 선택된 두 번째 카드(총 세 번째 카드)에 대한 해석을 시작하고, 전체적인 조언과 함께 마무리해줘. 이 해석이 끝나면 종합 심층 해석이나 상담 종료를 제안해야 해.";}

        } else if (userMessageText === "action_interpret_next_card") {
            // ... (이전과 동일한 nextIni 설정 로직)
            console.log(`[SimulateResponse] "action_interpret_next_card" 감지. 현재 ini: ${currentIniFileName}`);
            let nextIni = '';
            let currentCardContext = ''; 
            if (currentIniFileName === 'tarot-1st.ini') { nextIni = 'tarot-2nd.ini'; currentCardContext = '두 번째'; } 
            else if (currentIniFileName === 'tarot-2nd.ini') { nextIni = 'tarot-3rd.ini'; currentCardContext = '세 번째'; } 
            else if (currentIniFileName === 'tarot-single-add2-1st.ini') { nextIni = 'tarot-single-add2-last.ini'; currentCardContext = '추가로 선택한 카드 중 마지막';}
            
            if (nextIni) {
                currentIniFileName = nextIni;
                console.log(`[SimulateResponse] 다음 ini 파일 설정: ${currentIniFileName}`);
                const userRequestForNextCard = "응, 다음 카드도 해석해줘."; // 이 메시지는 사용자가 'next' 버튼을 눌렀을 때 processMessageExchange에서 히스토리에 추가됨
                // if (chatHistoryForAPI.length === 0 || chatHistoryForAPI[chatHistoryForAPI.length-1].parts[0].text !== userRequestForNextCard) {
                //     chatHistoryForAPI.push(formatChatHistoryForAPI(userRequestForNextCard, 'user'));
                //     console.log("[SimulateResponse] 다음 카드 요청 메시지 히스토리 추가.");
                // }
                additionalInstructionForAPI = `이제 사용자가 선택한 카드들 중 ${currentCardContext} 카드에 대한 해석을 진행해줘. 이전 카드들의 내용을 참고해서 자연스럽게 이어가면 좋아.`;
                if (nextIni === 'tarot-3rd.ini' || nextIni === 'tarot-single-add2-last.ini') { additionalInstructionForAPI += " 이 카드가 마지막 해석이니, 전체적인 조언과 함께 마무리하고, 종합 심층 해석이나 상담 종료를 제안해줘."; }
            } else {
                console.warn("[SimulateResponse] 'action_interpret_next_card': 다음 .ini 파일을 결정할 수 없음. 현재 ini:", currentIniFileName);
                return await simulateBotResponse("action_conclude_session_prompt"); // await 추가
            }
        } else { // 일반 텍스트 입력 (freetalk)
            console.log(`[SimulateResponse] 일반 메시지 또는 알 수 없는 액션: "${userMessageText}". freetalk.ini 사용 시도.`);
            currentIniFileName = 'freetalk.ini';
            if (chatHistoryForAPI.length === 0 || (chatHistoryForAPI.length > 0 && chatHistoryForAPI[chatHistoryForAPI.length-1].parts[0].text !== userMessageText) ) {
                 chatHistoryForAPI.push(formatChatHistoryForAPI(userMessageText, 'user'));
                 console.log("[SimulateResponse] 일반 메시지 히스토리 추가:", userMessageText);
            }
            additionalInstructionForAPI = "사용자의 질문에 답변하거나 자유롭게 대화를 이어가줘. 필요하다면 관련된 타로 카드 이미지를 함께 언급해도 좋아.";
        }
        
        console.log(`[SimulateResponse] API 호출 준비. ini: ${currentIniFileName}, 추가 지침: ${additionalInstructionForAPI ? additionalInstructionForAPI.substring(0,100)+"..." : "없음"}`);
        const tarotIniCombined = await fetchTarotIniContent(currentIniFileName); 
        const apiResponse = await callGeminiAPI(tarotIniCombined, userProfile, chatHistoryForAPI, additionalInstructionForAPI);
        
        if (apiResponse.assistantmsg && apiResponse.assistantmsg.shorts && apiResponse.assistantmsg.shorts.length > 0) {
            const firstShortText = apiResponse.assistantmsg.shorts[0].text;
            if (chatHistoryForAPI.length === 0 || !(chatHistoryForAPI[chatHistoryForAPI.length - 1].role === 'model' && chatHistoryForAPI[chatHistoryForAPI.length - 1].parts[0].text === firstShortText)) {
                 chatHistoryForAPI.push(formatChatHistoryForAPI(firstShortText, 'model'));
                 console.log("[SimulateResponse] API 응답(첫 단락) 히스토리 추가:", firstShortText.substring(0,30)+"...");
            }
        }
        responseData = { assistantmsg: apiResponse.assistantmsg }; // assistantmsg는 다단락 JSON 객체

    }
    // 4. 다단락 JSON을 직접 생성하는 간단한 UI 액션들
    else if (userMessageText === "action_conclude_session_prompt") {
        // ... (이전과 동일, assistantmsg가 다단락 JSON 형식을 따름)
        console.log("[SimulateResponse] 'action_conclude_session_prompt' 감지: 상담 종료 제안 메시지 생성.");
        currentCardInterpretation = null; 
        currentShortIndex = -1;
        let deepenOverallText = "오늘 내용 종합해서 더 깊게!";
        if (userProfile.선택된타로카드들.length === 1 && (currentIniFileName === 'tarot-single.ini' || currentIniFileName === 'tarot-single-add2-last.ini' ) ) {
            deepenOverallText = "이 카드에 대해 더 깊게!";
        }
        responseData = {
            assistantmsg: { totalShorts: 1, shorts: [{ id: 1, text: "오늘 타로 상담은 어땠어? 😊 혹시 더 깊이 이야기하고 싶은 부분이 있거나, 아니면 다른 주제로 넘어가 볼까?", sampleAnswers: [ { type: "deepen_overall", text: deepenOverallText }, { type: "return_home", text: "고마워, 오늘은 만족해!" }] }] }
        };
    }
    else if (userMessageText === "action_trigger_add_two_cards_scenario") { 
        console.log("[SimulateResponse] 'action_trigger_add_two_cards_scenario' 감지: 2장 더 뽑기 비용 확인 UI 요청.");
        responseData = await handleAddTwoCards_Confirmation(); // 이 함수는 다단락 JSON 객체를 반환
    }
    else if (userMessageText === "action_cancel_cost_confirmation" || userMessageText.startsWith("action_bone_lack_guidance") || userMessageText === "action_error_fallback" || userMessageText === "action_default_fallback_options") {
        console.log(`[SimulateResponse] "${userMessageText}" 감지: 간단한 UI 액션 처리.`);
        responseData = await handleSimpleUIActions(userMessageText); // 이 함수는 다단락 JSON 객체를 반환
    }
    else { // 정말 알 수 없는 경우 (오류 또는 예외 상황)
        console.error(`[SimulateResponse] 처리할 수 없는 userMessageText: "${userMessageText}"`);
        responseData = { assistantmsg: { totalShorts: 1, shorts: [{ id: 1, text: "음... 내가 지금 뭘 해야 할지 잘 모르겠어. 😥 다시 한번 말해줄래?", sampleAnswers: [{type:"return_home", text:"처음으로"}] }] } };
    }
    
    console.log(`[SimulateResponse] ========== 함수 종료 ========== 최종 생성/반환 데이터:`, responseData.assistantmsg ? JSON.parse(JSON.stringify(responseData.assistantmsg)) : JSON.parse(JSON.stringify(responseData)));
    return responseData;
}
// simulateBotResponse에서 사용될 간단한 UI 액션 핸들러
async function handleSimpleUIActions(userMessageText) {
    // 이 함수는 API 호출 없이, 간단한 UI 피드백이나 다음 단계로 넘어가기 전의 확인 메시지를 생성합니다.
    // 모든 응답은 다단락 JSON 형식으로 통일하여 processMessageExchange에서 일관되게 처리합니다.
    if (userMessageText === "action_cancel_cost_confirmation") { // 비용 확인 취소 시
        currentCardInterpretation = null; // 진행 중이던 해석 상태 초기화
        currentShortIndex = -1;
        // currentIniFileName = ''; // 초기 상태로 돌릴지는 정책에 따라 결정
        return {
            assistantmsg: {
                totalShorts: 1,
                shorts: [{
                    id: 1,
                    text: "알겠어. 그럼 다른 걸 해볼까? 😊",
                    sampleAnswers: [ // 초기 "몇 장 뽑을래"와 유사한 선택지
                        { type: "system_choice_one", text: "1장만 볼래" }, // 이 value는 simulate에서 다시 처리
                        { type: "system_choice_three", text: "3장으로 자세히 볼래" }
                    ]
                }]
            }
        };
    } else if (userMessageText.startsWith("action_bone_lack_guidance")) {
         return {
            assistantmsg: {
                totalShorts: 1,
                shorts: [{
                    id: 1,
                    text: "이런! 뼈다귀가 부족한 것 같아. 😥 뼈다귀는 매일 접속하거나 특별한 활동을 통해 얻을 수 있어! 오늘은 무료로 가능한 다른 걸 해보는 건 어때?",
                    sampleAnswers: [
                        { type: "system_choice_one_free", text: "무료 운세 보기 (1장)" }, // value는 simulate에서 처리
                        { type: "message", text: "괜찮아, 다음에 할게" } // 일반 메시지로 처리
                    ]
                }]
            }
        };
    } else if (userMessageText === "action_error_fallback" || userMessageText === "action_default_fallback_options") {
        return {
             assistantmsg: {
                totalShorts: 1,
                shorts: [{
                    id: 1,
                    text: "이런, 잠시 뭔가 문제가 있었나 봐. 😥 다시 시도해 줄래? 아니면 다른 걸 해볼까?",
                    sampleAnswers: [
                        // "action_retry_last_known_good_action"은 현재 구현에서 복잡하므로, 일반적인 선택지로 대체
                        { type: "return_home", text: "처음으로 돌아가기" },
                        { type: "message", text: "도움말 보여줘" }
                    ]
                }]
            }
        };
    }
    // 정의되지 않은 simple action의 경우, 빈 객체나 기본 메시지 반환
    console.warn(`[SimpleUIActions] 처리되지 않은 액션: ${userMessageText}`);
    return { assistantmsg: { totalShorts:1, shorts:[{id:1, text:"음... 다시 한번 말해줄래? 🤔", sampleAnswers:[{type:"return_home", text:"처음으로"}]}] }};
}

// --- 기존 simulateBotResponse 관련 헬퍼 함수들 수정 또는 대체 ---

// handleInitialCardPickQuery -> handleSimpleUIActions로 통합 또는 유사하게 수정
// async function handleInitialCardPickQuery(userMessageText) { ... }

async function handleSelectOneCard() {
    console.log("[SimulateResponse] handleSelectOneCard 실행 (UI 표시 요청)");
    userProfile.시나리오 = "tarot_single_pick"; // 시나리오 설정
    currentIniFileName = 'tarot-single.ini';   // 해당 시나리오의 ini 파일명 설정
    return {
        tarocardview: true,
        cards_to_select: 1,
        // sampleAnswers는 카드 선택 후 processMessageExchange에서 API 응답으로 채워짐
        systemMessageOnConfirm: "1장을 선택했네. 마음에 드는 카드를 골라봐. ✨" // 시스템 메시지는 그대로 사용 가능
    };
}

async function handleSelectThreeCards_Confirmation() {
    console.log("[SimulateResponse] handleSelectThreeCards_Confirmation 실행 (비용 확인 메시지 생성)");
    // 이 함수는 이제 API 호출 없이, 비용 확인을 위한 메시지와 샘플 답변(JSON 형식)만 반환합니다.
    // 실제 비용 차감 및 다음 단계 진행은 사용자가 샘플 답변을 선택했을 때 processMessageExchange에서 처리됩니다.
    return {
        assistantmsg: {
            totalShorts: 1,
            shorts: [{
                id: 1,
                text: `<b>3장</b>을 선택하면 <img src="img/icon/bone_inline.png" alt="뼈다귀" class="inline-bone-icon"><b>2개</b>가 필요해. 진행해볼까? 🤔`,
                sampleAnswers: [
                    // 이 value("action_confirm_three_cards_cost_trigger")는 simulateBotResponse에서 다시 받아서 다음 단계를 처리합니다.
                    { type: "action_confirm_three_cards_cost_trigger", text: "응, 사용할게" },
                    { type: "action_cancel_cost_confirmation", text: "아니, 취소할래" }
                ]
            }]
        },
        importance: 'high', // sampleAnswersContainer 배경 강조
        isConfirmationStage: true // promptMessage 표시 (현재는 assistantmsg.shorts[0].text 사용)
    };
}

async function handleConfirmThreeCardsCost() {
    console.log("[SimulateResponse] handleConfirmThreeCardsCost 실행 (UI 표시 요청)");
    if (userProfile.bones >= 2) {
        // 비용 차감은 processMessageExchange에서 'type' 기반으로 처리되므로, 여기서는 시나리오 설정만
        // userProfile.bones -= 2; // 여기서 직접 차감하지 않음
        // updateBoneCountDisplay();
        // saveUserProfileToLocalStorage(userProfile);
        userProfile.시나리오 = "tarot_triple_pick";
        currentIniFileName = 'tarot-1st.ini'; // 3장 중 첫 번째 카드용 ini
        return {
            tarocardview: true,
            cards_to_select: 3,
            systemMessageOnConfirm: "3장을 선택했구나! 신중하게 골라봐. 😊 (뼈다귀 2개 사용 예정)"
        };
    } else {
        return await handleSimpleUIActions("action_bone_lack_guidance");
    }
}


async function handleAddTwoCards_Confirmation() {
    console.log("[SimulateResponse] handleAddTwoCards_Confirmation 실행 (비용 확인 메시지 생성)");
    // 1장 해석 후 "2장 더 뽑기"를 선택했을 때의 비용 확인
    return {
        assistantmsg: {
            totalShorts: 1,
            shorts: [{
                id: 1,
                text: `<b>2장 더 뽑기</b>에는 <img src="img/icon/bone_inline.png" alt="뼈다귀" class="inline-bone-icon"><b>2개</b>가 필요해. 계속할까? ✨`,
                sampleAnswers: [
                    // 이 value("action_confirm_add_two_cards_cost_trigger")는 simulateBotResponse에서 처리
                    { type: "action_confirm_add_two_cards_cost_trigger", text: "응, 더 뽑을래" },
                    { type: "action_cancel_cost_confirmation", text: "아니, 괜찮아" }
                ]
            }]
        },
        importance: 'high',
        isConfirmationStage: true
    };
}

async function handleConfirmAddTwoCardsCost() {
    console.log("[SimulateResponse] handleConfirmAddTwoCardsCost 실행 (UI 표시 요청)");
    if (userProfile.bones >= 2) {
        userProfile.시나리오 = "tarot_add_two_pick";
        // currentIniFileName은 이전 단계(예: action_trigger_add_two_cards_scenario)에서 설정되었거나 여기서 설정
        if (!currentIniFileName || !currentIniFileName.includes("add2")) {
            currentIniFileName = 'tarot-single-add2-1st.ini';
        }
        return {
            tarocardview: true,
            cards_to_select: 2, // 2장 더 뽑음
            systemMessageOnConfirm: "좋아, 2장을 더 골라보자! 어떤 카드가 나올까? 👀 (뼈다귀 2개 사용 예정)"
        };
    } else {
         return await handleSimpleUIActions("action_bone_lack_guidance");
    }
}

// handleCardSelectionComplete, handleDeepAnalysis_Confirmation, handleConfirmDeepAnalysisCost, handleDefaultMessage 등은
// API 직접 호출 또는 processMessageExchange의 다단락 처리 로직으로 흡수/변경됨.
// 특히 handleDefaultMessage는 freetalk.ini를 사용하는 API 호출로 대체.
    function setUIInteractions(isProcessing, shouldFocusInput = false) {
        console.log(`[UI] 상호작용 상태 변경: isProcessing=${isProcessing}, shouldFocusInput=${shouldFocusInput}`);
        if (messageInput) messageInput.disabled = isProcessing;
        if (sendBtn) sendBtn.disabled = isProcessing || (messageInput && messageInput.value.trim() === '');

        const sampleButtons = sampleAnswersContainer.querySelectorAll('.sample-answer-btn');
        sampleButtons.forEach(btn => btn.disabled = isProcessing);

        const panelOptions = moreOptionsPanel.querySelectorAll('.panel-option');
        panelOptions.forEach(opt => opt.disabled = isProcessing);
        
        if (moreOptionsBtn) moreOptionsBtn.disabled = isProcessing;

        // 타로 선택 UI가 활성화되어 있으면 입력창 포커스하지 않음
        if (!isProcessing && shouldFocusInput && !isTarotSelectionActive && messageInput) {
            console.log("[UI] 메시지 입력창 포커스 시도.");
            // 모바일에서 키보드가 자동으로 올라오는 것을 방지하기 위해,
            // 사용자가 직접 입력창을 터치했을 때만 포커스가 가도록 하는 것이 좋을 수 있음.
            // 여기서는 일단 요청대로 'shouldFocusInput' 플래그에 따라 포커스.
            messageInput.focus();
        } else if (isTarotSelectionActive && messageInput && document.activeElement === messageInput) {
            // 타로 UI가 활성화되었는데 입력창에 포커스가 있다면 포커스 해제 (키보드 내리기)
            messageInput.blur();
            console.log("[UI] 타로 UI 활성화로 입력창 포커스 해제.");
        }
    }

async function processMessageExchange(messageText, source = 'input', options = {}) {
    const { clearBeforeSend = false, menuItemData = null, buttonData = null } = options;

    console.log(`[ProcessExchange] ========== 함수 시작 ========== 메시지: "${messageText}", 소스: ${source}, buttonData:`, buttonData ? JSON.parse(JSON.stringify(buttonData)) : '없음', "menuItemData:", menuItemData ? "있음" : "없음");
    
    if (isLoadingBotResponse && source !== 'system_internal_force' && source !== 'system_init_skip_user_message') { 
        console.log("[ProcessExchange] 조건 미충족으로 중단 (로딩 중).");
        return;
    }
    
    if (source === 'system_init_skip_user_message' && isLoadingBotResponse) {
        console.log("[ProcessExchange] 초기화 호출 (`system_init_skip_user_message`)이지만 로딩 중. 일단 진행.");
    }


    if (messageText.trim() === '' && source !== 'system_init_skip_user_message' && source !== 'system_internal_no_user_echo' && !(buttonData && (buttonData.actionType === 'confirm_cost' || buttonData.actionType === 'multi_step_choice' || buttonData.type)) && source !== 'system_internal_no_user_echo') {
        console.log("[ProcessExchange] 조건 미충족으로 중단 (빈 메시지 또는 특정 내부 호출 아님).");
        return;
    }

    let shouldClearChat = clearBeforeSend;

    if (buttonData && buttonData.type === 'return_home') {
        console.log("[ProcessExchange] 'return_home' 타입 감지. 채팅 초기화 시도.");
        const confirmReset = confirm("모든 대화 내용이 지워지고 첫 화면으로 돌아갑니다. 괜찮으신가요?");
        if (confirmReset) {
            console.log("[ProcessExchange] 사용자가 초기화 동의함. initializeChat 호출.");
            clearChatMessages(); 
            chatHistoryForAPI = [];
            currentCardInterpretation = null;
            currentShortIndex = -1;
            currentSelectedCardImagePaths = [];
            currentIniFileName = '';
            userProfile.선택된타로카드들 = [];
            hasUserSentMessage = false; 
            userProfile.메뉴단계 = 1;   
            
            isLoadingBotResponse = true; 
            setUIInteractions(true, false);
            await initializeChat(); 
            return; 
        } else {
            console.log("[ProcessExchange] 사용자가 초기화 취소함.");
            if (isLoadingBotResponse) { 
                 isLoadingBotResponse = false;
                 if(sendBtn) sendBtn.classList.remove('loading');
                 setUIInteractions(false, false);
            }
            return; 
        }
    }

    if (source === 'panel_option' && menuItemData && menuItemData.text) { 
        const newTarotKeywords = ["오늘의 운세", "썸인지", "그 사람 마음", "오늘 뭐먹지"]; 
        if (newTarotKeywords.some(keyword => menuItemData.text.includes(keyword)) || messageText.startsWith("action_select_")) {
            if (hasUserSentMessage || chatHistoryForAPI.length > 0) { 
                console.log("[ProcessExchange] 새로운 타로 주제 선택됨. 채팅창 및 API 히스토리 초기화.");
                shouldClearChat = true;
            }
        }
    }

    if (!hasUserSentMessage && source !== 'system_init' && source !== 'system_internal' && source !== 'panel_option_topic_reset' && source !== 'system_init_skip_user_message' && source !== 'system_internal_multi_step') {
        shouldClearChat = true; 
    }
    
    if (shouldClearChat) {
        console.log("[ProcessExchange] 채팅창 비우기 실행.");
        clearChatMessages();
        chatHistoryForAPI = []; 
        currentCardInterpretation = null; 
        currentShortIndex = -1;
        currentSelectedCardImagePaths = [];
        hasUserSentMessage = true; 
        userProfile.메뉴단계 = (source === 'system_init_skip_user_message') ? 1 : 2; 
        console.log("[ProcessExchange] 채팅창 비움. API 대화 기록 및 다단락 해석 상태 초기화됨.");
    }

    console.log("[ProcessExchange] 로딩 상태 설정 및 UI 비활성화.");
    isLoadingBotResponse = true;
    if(sendBtn) sendBtn.classList.add('loading');
    setUIInteractions(true, false);

    if (moreOptionsPanel.classList.contains('active')) {
        moreOptionsPanel.classList.remove('active');
        moreOptionsBtn.classList.remove('active');
    }

    const shouldAddUserMessageToDisplayFromHere =
        source === 'input' || 
        (source === 'panel_option' && !messageText.startsWith("action_")) ||
        (source === 'sample_button' && buttonData && buttonData.actionType !== 'confirm_cost' && buttonData.actionType !== 'cancel_cost' && buttonData.actionType !== 'multi_step_choice' && !buttonData.type); 


    const textForUserDisplay = (source === 'sample_button' && buttonData && buttonData.text) ? buttonData.text : messageText;

    if (shouldAddUserMessageToDisplayFromHere && source !== 'system_init_skip_user_message' && source !== 'system_internal_no_user_echo') {
        console.log(`[ProcessExchange] 사용자 메시지 표시: "${textForUserDisplay}"`);
        await addMessage(textForUserDisplay, 'user');
        if (!hasUserSentMessage && source !== 'system_init_skip_user_message') {
            hasUserSentMessage = true;
            userProfile.메뉴단계 = 2;
        }
    }
    
    const effectiveMessageForAPI = (source === 'sample_button' && buttonData && buttonData.value) ? buttonData.value : messageText;
    console.log(`[ProcessExchange] API로 전달될 유효 메시지 또는 액션: "${effectiveMessageForAPI}"`);


    if (source === 'input' && messageInput) {
        messageInput.value = '';
        adjustTextareaHeight();
    }

    // --- 다단락 선택지 처리 로직 (새로운 함수 호출) ---
    if (source === 'sample_button' && buttonData && buttonData.actionType === 'multi_step_choice') {
        await handleMultiStepChoice(buttonData, options); // options에는 menuItemData 등이 포함될 수 있음
        isLoadingBotResponse = false; 
        if(sendBtn) sendBtn.classList.remove('loading'); 
        setUIInteractions(false, false);
        console.log(`[ProcessExchange] ========== 다단락 선택지 처리 후 함수 종료 ========== 현재 ini: ${currentIniFileName || '없음'}, 단락 idx: ${currentShortIndex}`);
        return; 
    }

    // --- 일반 메시지 처리 (API 호출) ---
    console.log("[ProcessExchange] 일반 메시지 또는 초기 UI 로드 경로 처리 시작.");
    try {
        const botApiResponse = await simulateBotResponse(effectiveMessageForAPI); 
        
        if (botApiResponse.user_profile_update) { 
             for (const key in botApiResponse.user_profile_update) {
                if (key !== "bones") { 
                    if (botApiResponse.user_profile_update[key] !== null && botApiResponse.user_profile_update[key] !== undefined && botApiResponse.user_profile_update[key] !== "없음") {
                        userProfile[key] = botApiResponse.user_profile_update[key];
                    }
                }
            }
            if (Object.keys(botApiResponse.user_profile_update).length > 0 && !Object.keys(botApiResponse.user_profile_update).every(k => k === "bones")) {
                saveUserProfileToLocalStorage(userProfile);
            }
        }
        
        // simulateBotResponse는 이제 항상 assistantmsg (다단락 JSON) 또는 assistantmsg_text (단일 텍스트) 또는 tarocardview/requestUiUpdate 등을 반환
        if (botApiResponse.assistantmsg && typeof botApiResponse.assistantmsg === 'object' && botApiResponse.assistantmsg.totalShorts !== undefined) {
            console.log("[ProcessExchange] 일반 메시지 처리 결과, 다단락 응답 받음.");
            currentCardInterpretation = botApiResponse.assistantmsg;
            currentShortIndex = 0;
            const firstShortText = currentCardInterpretation.shorts[0].text;
            // API 호출을 동반한 경우(즉, simulateBotResponse 내부에서 API 호출 후 반환)에만 모델 응답을 히스토리에 추가
            // (단, handleMultiStepChoice 내부의 'again'처럼 API 호출 없이 단락만 넘어가는 경우는 제외)
            // 이 부분은 simulateBotResponse 내부에서 API 호출 직후 히스토리에 추가하는 것이 더 명확할 수 있음.
            // 여기서는 일단, 새로운 해석이 시작될 때 첫 단락을 추가하는 것으로 간주.
            if (chatHistoryForAPI.length === 0 || !(chatHistoryForAPI[chatHistoryForAPI.length - 1].role === 'model' && chatHistoryForAPI[chatHistoryForAPI.length - 1].parts[0].text === firstShortText)) {
                chatHistoryForAPI.push(formatChatHistoryForAPI(firstShortText, 'model'));
                 console.log("[ProcessExchange] API 응답(첫 단락) 히스토리 추가 (일반):", firstShortText.substring(0,30)+"...");
            }
            await displayCurrentShort(); 
        } 
        else if (botApiResponse.assistantmsg_text) { // simulateBotResponse가 하드코딩된 단일 메시지 반환 시
            console.log("[ProcessExchange] assistantmsg_text 감지 (주로 초기 단계 메시지).");
            await addMessage({ text: botApiResponse.assistantmsg_text }, 'bot');
            if (botApiResponse.sampleAnswers) {
                await updateSampleAnswers(botApiResponse.sampleAnswers, botApiResponse.importance || 'low');
            }
        }
        // requestUiUpdate 처리 (예: 3장 비용 확인)
        else if (botApiResponse.requestUiUpdate) {
            if (botApiResponse.requestUiUpdate === "show_three_cards_cost_confirm") {
                console.log("[ProcessExchange] 'show_three_cards_cost_confirm' UI 업데이트 요청 받음.");
                const confirmationResponse = await handleSelectThreeCards_Confirmation(); // 이 함수는 다단락 JSON 반환
                if (confirmationResponse.assistantmsg && confirmationResponse.assistantmsg.totalShorts > 0) {
                    currentCardInterpretation = confirmationResponse.assistantmsg;
                    currentShortIndex = 0;
                    await displayCurrentShort(); // 비용 확인 메시지를 다단락으로 표시
                } else {
                     console.error("[ProcessExchange] 비용 확인 메시지 생성 오류(UI Update):", confirmationResponse);
                }
            }
            // 다른 requestUiUpdate 타입이 있다면 여기서 추가 처리
        }
        // 그 외 (예: 조수 해석 또는 일반 텍스트 + 이미지 - simulateBotResponse에서 이 형식은 이제 거의 사용 안함)
        else { 
            console.log("[ProcessExchange] 일반 메시지 처리 결과, 기타 응답 유형 받음.");
            const messageDataForBot = {
                assistantmsg: botApiResponse.assistantmsg, 
                tarotImg: botApiResponse.tarotImg || null,
                isAssistantInterpretation: botApiResponse.assistant_interpretation ? true : false,
                interpretationHtml: botApiResponse.assistant_interpretation
            };
            
            if (messageDataForBot.isAssistantInterpretation) { 
                await addMessage(messageDataForBot, 'bot');
            } 
            else if (typeof messageDataForBot.assistantmsg === 'string' || messageDataForBot.tarotImg) {  
                await addMessage({ text: messageDataForBot.assistantmsg, tarotImg: messageDataForBot.tarotImg }, 'bot', { displayCardImageHeader: false });
                if (typeof messageDataForBot.assistantmsg === 'string') {
                     if (chatHistoryForAPI.length === 0 || !(chatHistoryForAPI[chatHistoryForAPI.length - 1].role === 'model' && chatHistoryForAPI[chatHistoryForAPI.length - 1].parts[0].text === messageDataForBot.assistantmsg)) {
                        chatHistoryForAPI.push(formatChatHistoryForAPI(messageDataForBot.assistantmsg, 'model'));
                        console.log("[ProcessExchange] 모델 일반 텍스트 응답 히스토리 추가:", messageDataForBot.assistantmsg.substring(0,30)+"...");
                    }
                }
            } 
            else if (botApiResponse.systemMessageOnConfirm) { 
                 await addMessage(botApiResponse.systemMessageOnConfirm, 'system');
            } else if (!botApiResponse.assistantmsg && !botApiResponse.tarocardview && !botApiResponse.requestUiUpdate && !botApiResponse.assistantmsg_text) { 
                console.warn("[ProcessExchange] botApiResponse에서 유효한 응답 필드를 찾을 수 없음:", botApiResponse);
                 const fallbackResponse = await simulateBotResponse("action_error_fallback");
                 if (fallbackResponse.assistantmsg && fallbackResponse.assistantmsg.totalShorts > 0) { currentCardInterpretation = fallbackResponse.assistantmsg; currentShortIndex = 0; await displayCurrentShort(); } 
                 else { await addMessage({text: (fallbackResponse.assistantmsg_text || "응답을 받지 못했어. 😥")}, 'bot'); await updateSampleAnswers(fallbackResponse.sampleAnswers || []); }
            }
            
            await updateSampleAnswers(
                botApiResponse.sampleAnswers || [], 
                botApiResponse.importance || 'low',
                botApiResponse.isConfirmationStage || false,
                (botApiResponse.isConfirmationStage && typeof botApiResponse.assistantmsg === 'string') ? botApiResponse.assistantmsg : ( (botApiResponse.isConfirmationStage && botApiResponse.assistantmsg && typeof botApiResponse.assistantmsg === 'object' && botApiResponse.assistantmsg.totalShorts > 0) ? botApiResponse.assistantmsg.shorts[0].text : null )
            );
        }

        if (botApiResponse.tarocardview && botApiResponse.cards_to_select > 0) { 
            console.log("[ProcessExchange] 일반 메시지 처리 결과, 타로 카드 선택 UI 표시 요청 받음.");
            if (messageInput && document.activeElement === messageInput) messageInput.blur();
            let currentTarotBg = userProfile.tarotbg || 'default.png';
            const bgSource = menuItemData || (source === 'sample_button' && buttonData ? buttonData : null);
            if (bgSource && bgSource.tarotbg) {
                currentTarotBg = bgSource.tarotbg;
                userProfile.tarotbg = currentTarotBg;
                saveUserProfileToLocalStorage(userProfile);
            }
            showTarotSelectionUI(botApiResponse.cards_to_select, currentTarotBg);
        }

    } catch (error) { 
        console.error("[ProcessExchange] 일반 메시지 처리 중 오류 발생:", error);
        const fallbackResponse = await simulateBotResponse("action_error_fallback");
        if (fallbackResponse.assistantmsg && fallbackResponse.assistantmsg.totalShorts > 0) {
           currentCardInterpretation = fallbackResponse.assistantmsg; currentShortIndex = 0; await displayCurrentShort();
       } else { 
            await addMessage({text: (fallbackResponse.assistantmsg_text || "처리 중 심각한 오류가 발생했어. 미안해. 😥")}, 'bot');
            await updateSampleAnswers(fallbackResponse.sampleAnswers || []);
       }
    } finally { 
        isLoadingBotResponse = false;
        if(sendBtn) sendBtn.classList.remove('loading');
        const shouldFocus = (source === 'input' && !isTarotSelectionActive);
        setUIInteractions(false, shouldFocus);
        console.log(`[ProcessExchange] ========== 함수 종료 ========== 현재 ini: ${currentIniFileName || '없음'}, 단락 idx: ${currentShortIndex}`);
    }
}
async function handleSendMessage() {
    const messageText = messageInput.value.trim();
    if (messageText === '') return;

    // 현재 다단락 해석이 진행 중인지 확인
    if (currentCardInterpretation && currentCardInterpretation.shorts && currentShortIndex >= 0 && currentShortIndex < currentCardInterpretation.shorts.length) {
        console.log("[HandleSendMessage] 다단락 해석 중 사용자 직접 입력 감지. 'break'로 처리 시도.");
        
        // 사용자의 직접 입력을 'break'와 유사하게 처리
        const cost = determineCostByType('break_direct_input'); // 'break_direct_input'에 대한 비용 정의 필요 (예: 1)
        if (userProfile.bones < cost) {
            await addMessage(`이런! 뼈다귀가 부족해. (현재 ${userProfile.bones}개, 필요 ${cost}개) 😥`, 'bot');
            const boneLackResponse = await simulateBotResponse("action_bone_lack_guidance_for_input");
            await updateSampleAnswers(boneLackResponse.sampleAnswers || []);
            messageInput.value = messageText; // 입력 내용 복원
            return;
        }
        if (cost > 0) {
            userProfile.bones -= cost;
            updateBoneCountDisplay();
            saveUserProfileToLocalStorage(userProfile);
            await addMessage(`(뼈다귀 ${cost}개 사용했어요! 남은 뼈다귀: ${userProfile.bones}개)`, 'system');
        }
        
        await addMessage(messageText, 'user'); // 사용자 입력 표시
        messageInput.value = ''; // 입력창 비우기
        adjustTextareaHeight();

        isLoadingBotResponse = true;
        if(sendBtn) sendBtn.classList.add('loading');
        setUIInteractions(true, false);

        // API 호출을 위한 추가 지침
        let contextForDirectInput = `사용자가 이전 단락 ("${currentCardInterpretation.shorts[currentShortIndex].text}")에 대해 직접 "${messageText}" 라고 입력했습니다. 이 입력을 고려하여 이전의 흐름에서 벗어나 새로운 방향으로 다음 해석 단락들을 생성해주세요.`;
        
        chatHistoryForAPI.push(formatChatHistoryForAPI(messageText, 'user'));
        // 이전 단락까지의 AI 응답을 히스토리에 추가 (선택적)
        if (currentShortIndex >= 0 && currentCardInterpretation && currentCardInterpretation.shorts) {
            for(let i=0; i <= currentShortIndex; i++) {
               const shortText = currentCardInterpretation.shorts[i].text;
               if (chatHistoryForAPI.length === 0 || !(chatHistoryForAPI[chatHistoryForAPI.length - 1].role === 'model' && chatHistoryForAPI[chatHistoryForAPI.length - 1].parts[0].text === shortText)) {
                   chatHistoryForAPI.push(formatChatHistoryForAPI(shortText, 'model'));
               }
            }
       }

        const tarotIniCombined = await fetchTarotIniContent(currentIniFileName);
        const apiResponse = await callGeminiAPI(tarotIniCombined, userProfile, chatHistoryForAPI, contextForDirectInput);

        if (apiResponse.assistantmsg && apiResponse.assistantmsg.totalShorts > 0) {
            currentCardInterpretation = apiResponse.assistantmsg;
            currentCardInterpretation.isNewInterpretationAfterBreak = true; 
            currentShortIndex = 0;
            await displayCurrentShort();
        } else {
            console.error("[HandleSendMessage] API가 유효한 다단락 응답을 반환하지 않음 (직접 입력 처리 중):", apiResponse);
            await addMessage(apiResponse.assistantmsg || "오류: 응답을 처리할 수 없습니다.", 'system');
            const fallbackResponse = await simulateBotResponse("action_default_fallback_options");
            await updateSampleAnswers(fallbackResponse.sampleAnswers || []);
        }

        isLoadingBotResponse = false;
        if(sendBtn) sendBtn.classList.remove('loading');
        setUIInteractions(false, false);

    } else {
        // 다단락 해석 중이 아닐 경우, 기존 방식대로 메시지 처리
        await processMessageExchange(messageText, 'input');
    }
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

    const availableCardIds = [...ALL_TAROT_CARD_IDS];
    let newlyChosenCardIds = [];
    currentSelectedCardImagePaths = []; // 새로 선택했으므로 이미지 경로 초기화

    if (userProfile.시나리오 === "tarot_add_two_pick") {
        console.log("[TarotSelection] '2장 더 뽑기' 시나리오. 기존 선택된 카드:", userProfile.선택된타로카드들);
        // 기존 카드 이미지 경로 유지 또는 추가 로직 필요 시 여기에
        userProfile.선택된타로카드들.forEach(cardId => {
             const imageName = cardId.endsWith('_reversed') ? cardId.replace('_reversed', '_upright') : cardId;
             currentSelectedCardImagePaths.push(`img/tarot/${imageName}.png`);
        });
    } else {
        userProfile.선택된타로카드들 = [];
        console.log("[TarotSelection] 최초 선택 시나리오. 선택된 카드 목록 초기화.");
    }

    for (let i = 0; i < cardsToSelectCount; i++) { 
        let currentDeck = [...availableCardIds];
        const existingAndNewlyChosen = [...userProfile.선택된타로카드들, ...newlyChosenCardIds];
        currentDeck = currentDeck.filter(id => !existingAndNewlyChosen.includes(id));
        
        if (currentDeck.length === 0) {
            console.warn("[TarotSelection] 더 이상 뽑을 유니크한 카드가 없습니다. 전체 덱에서 중복 가능하게 다시 뽑습니다.");
            currentDeck = [...availableCardIds].filter(id => !newlyChosenCardIds.includes(id)); 
            if (currentDeck.length === 0) { 
                 console.error("[TarotSelection] 모든 카드를 이미 선택했습니다.");
                 break;
            }
        }

        const randomIndex = Math.floor(Math.random() * currentDeck.length);
        const chosenId = currentDeck.splice(randomIndex, 1)[0];
        newlyChosenCardIds.push(chosenId);
        
        // 선택된 카드의 이미지 경로 저장 (정방향 이미지로)
        const imageName = chosenId.endsWith('_reversed') ? chosenId.replace('_reversed', '_upright') : chosenId;
        currentSelectedCardImagePaths.push(`img/tarot/${imageName}.png`);
    }
    
    userProfile.선택된타로카드들.push(...newlyChosenCardIds);
    console.log("[UserProfile] 최종 선택된 타로 카드 ID (순서대로 저장):", userProfile.선택된타로카드들);
    console.log("[TarotSelection] 화면 표시용 카드 이미지 경로:", currentSelectedCardImagePaths);
    
    newlyChosenCardIds.forEach(cardId => {
        if (!userProfile.지금까지수집된타로카드.includes(cardId)) {
            userProfile.지금까지수집된타로카드.push(cardId);
        }
    });

    saveUserProfileToLocalStorage(userProfile);

    hideTarotSelectionUI();
    // "카드 선택 완료" 메시지 대신, 선택된 카드 정보를 바탕으로 simulateBotResponse가 다음 .ini파일을 결정하고 첫 해석을 가져오도록 변경
    // 예를 들어, processMessageExchange("action_cards_selected_start_interpretation", 'system_internal_multi_step');
    // 혹은 simulateBotResponse에서 직접 userProfile.선택된타로카드들를 참조하여 시나리오 시작
    await processMessageExchange("카드 선택 완료", 'system_internal_multi_step', { 
        initialAction: true // 첫 다단락 해석 시작임을 알리는 플래그 (선택적)
    }); 
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
            const actionValue = targetOption.dataset.actionValue; // CHAT_MESSAGE의 경우, 이 값은 실제 메시지 내용이 됨 (예: "오늘의 운세")
            const isTarotRelatedMenu = targetOption.dataset.isTarotRelated === 'true';
            const tarotBgFromMenu = targetOption.dataset.tarotbg;

            // panel-option의 텍스트 내용을 가져옴 (예: "오늘의 운세")
            const optionTextContent = targetOption.textContent.trim().replace(/[^a-zA-Z0-9가-힣\s]/g, ''); // 아이콘 등 제거


            console.log(`[Panel] 옵션 클릭: TextContent="${optionTextContent}", Type="${actionType}", Value="${actionValue}", isTarotRelated=${isTarotRelatedMenu}, tarotBg=${tarotBgFromMenu}`);

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

                    // menuItemData에 타로 배경 이미지와 함께, 사용자 메시지로 표시될 텍스트(optionTextContent)를 전달
                    const messageOptions = {
                        menuItemData: {
                            text: optionTextContent, // "오늘의 운세" 등 버튼의 실제 텍스트
                            tarotbg: tarotBgFromMenu
                        }
                    };

                    // processMessageExchange 호출 시 첫 번째 인자는 actionValue (또는 optionTextContent)를 사용
                    // source를 'panel_option'으로 하여 processMessageExchange 내부에서 메시지 가공
                    await processMessageExchange(actionValue || optionTextContent, 'panel_option', messageOptions);
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

async function fetchTarotIniContent(specificIniFileName = 'tarot-single.ini') { // 기본 파일명 또는 상황에 맞는 파일명
    console.log(`[Prompt] prompts/${specificIniFileName} 및 common_instructions.ini 파일 로드 시도...`);
    let commonContent = '';
    let specificContent = '';

    try {
        const commonResponse = await fetch('prompts/common_instructions.ini');
        if (!commonResponse.ok) {
            throw new Error(`[Prompt] common_instructions.ini 로드 실패: ${commonResponse.status} ${commonResponse.statusText}`);
        }
        commonContent = await commonResponse.text();
        console.log("[Prompt] common_instructions.ini 로드 성공.");
    } catch (error) {
        console.error(error.message);
        // 공통 프롬프트 로드 실패 시, 기본값 또는 오류 처리
        commonContent = "## 기본 시스템 지침: 당신은 친절한 AI 챗봇입니다. 사용자의 질문에 답변해주세요.";
    }

    try {
        const specificResponse = await fetch(`prompts/${specificIniFileName}`);
        if (!specificResponse.ok) {
            throw new Error(`[Prompt] ${specificIniFileName} 로드 실패: ${specificResponse.status} ${specificResponse.statusText}`);
        }
        specificContent = await specificResponse.text();
        console.log(`[Prompt] ${specificIniFileName} 로드 성공.`);
    } catch (error) {
        console.error(error.message);
        // 특정 프롬프트 로드 실패 시, 해당 내용 없이 공통 프롬프트만 사용하거나 오류 처리
        // 또는, specificContent를 빈 문자열로 두어 공통 지침만 사용하도록 할 수 있음
        specificContent = `\n## 경고: ${specificIniFileName} 파일 로드에 실패했습니다. 일반적인 답변만 가능할 수 있습니다.`;
    }
    
    // 공통 지침과 특정 지침을 합쳐서 반환 (특정 지침이 공통 지침 아래에 오도록)
    // common_instructions.ini의 "--- (이 아래부터는 각 상황별 .ini 파일의 특화된 지침이 이어집니다) ---" 부분을 기준으로 합칠 수도 있음
    // 여기서는 간단히 문자열 결합
    const combinedPrompt = commonContent + "\n\n" + specificContent;
    console.log("[Prompt] 프롬프트 결합 완료. 총 길이:", combinedPrompt.length);
    return combinedPrompt;
}

// 비용 결정을 위한 헬퍼 함수 (예시)
function determineCostByType(type) {
    switch (type) {
        case 'break':
        case 'deepen':
        case 'break_direct_input': 
            return 1; 
        case 'add_two_cards':
        case 'system_choice_three_cost_2': 
            return 2; 
        case 'system_choice_one_cost_0':   
        case 'again':
        case 'next':
        case 'return_home':
        case 'placeholder': // 플레이스홀더 타입은 비용 없음
        case 'message':     // 일반 메시지 타입도 비용 없음
        default:
            return 0; 
    }
}

// 현재 단락 및 샘플 답변 표시 함수
async function displayCurrentShort() {
    if (!currentCardInterpretation || !currentCardInterpretation.shorts || currentShortIndex < 0 || currentShortIndex >= currentCardInterpretation.shorts.length) {
        console.error("[DisplayShort] 유효하지 않은 해석 데이터 또는 인덱스:", currentCardInterpretation, currentShortIndex);
        // 오류 처리: 예를 들어 기본 샘플 답변을 보여주거나, 사용자에게 오류 알림
        await updateSampleAnswers([{ text: "다시 시도", value: "action_retry_last", type: "system_action" }]);
        return;
    }

    const currentShortData = currentCardInterpretation.shorts[currentShortIndex];
    
    // 단락 메시지 추가 (카드 이미지 헤더 포함)
    // 첫 번째 단락이거나, 사용자가 break를 선택하여 API를 새로 호출한 경우에만 카드 헤더를 표시
    // 또는 매 단락마다 표시할 수도 있음 - 정책에 따라 결정
    const shouldDisplayHeader = currentShortIndex === 0 || (currentCardInterpretation.isNewInterpretationAfterBreak === true && currentShortIndex === 0) ;

    await addMessage(
        { text: currentShortData.text }, 
        'bot', 
        { displayCardImageHeader: shouldDisplayHeader }
    );

    // 샘플 답변 업데이트
    const sampleAnswersForDisplay = currentShortData.sampleAnswers.map(sa => ({
        ...sa, // type, text 포함
        value: sa.text, // value는 버튼 텍스트와 동일하게 하거나, type을 value로 사용할 수도 있음
        actionType: 'multi_step_choice', // 새로운 타입으로 지정
        // 비용 아이콘/텍스트 표시를 위한 추가 정보 (선택적)
        displayCostIcon: true, 
        iconType: determineCostByType(sa.type) > 0 ? 'bone' : 'free',
        displayCostText: determineCostByType(sa.type) > 0 // 비용이 있을 때만 텍스트 표시
    }));
    await updateSampleAnswers(sampleAnswersForDisplay, 'low', false, null);

    // 다음 API 호출 시, 이전에 break로 새로 받은 해석임을 구분하기 위한 플래그 초기화
    if (currentCardInterpretation.isNewInterpretationAfterBreak) {
        currentCardInterpretation.isNewInterpretationAfterBreak = false;
    }
}
    sampleAnswersContainer.addEventListener('click', async (e) => {
        console.log("[SampleAnswerClick] sampleAnswersContainer 클릭 이벤트 발생.");
        const targetButton = e.target.closest('.sample-answer-btn');
        
        if (targetButton) {
            console.log("[SampleAnswerClick] 클릭된 요소는 .sample-answer-btn 입니다.", targetButton);
            if (targetButton.disabled) {
                console.log("[SampleAnswerClick] 버튼이 비활성화되어 있어 처리하지 않습니다.");
                return;
            }
            if (isLoadingBotResponse) {
                console.log("[SampleAnswerClick] 현재 봇 응답 로딩 중이므로 처리하지 않습니다.");
                return;
            }

            const buttonValue = targetButton.dataset.value; 
            const buttonActionType = targetButton.dataset.actionType;
            const buttonSpecificType = targetButton.dataset.type; 
            
            const btnTextElement = targetButton.querySelector('.btn-text');
            const buttonText = btnTextElement ? btnTextElement.textContent.trim() : targetButton.textContent.trim();

            console.log(`[SampleAnswerClick] 추출된 버튼 데이터: value="${buttonValue}", actionType="${buttonActionType}", type="${buttonSpecificType}", text="${buttonText}"`);

            const buttonDataForExchange = {
                value: buttonValue, 
                text: buttonText, 
                actionType: buttonActionType, 
                type: buttonSpecificType      
            };
            
            console.log("[SampleAnswerClick] processMessageExchange 호출 예정. buttonData:", JSON.parse(JSON.stringify(buttonDataForExchange)));
            await processMessageExchange(buttonValue, 'sample_button', { buttonData: buttonDataForExchange });

        } else {
            console.log("[SampleAnswerClick] 클릭된 요소가 .sample-answer-btn이 아닙니다:", e.target);
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



async function fetchTarotIniContent() {
    console.log("[Prompt] prompts/tarot.ini 파일 로드 시도...");
    try {
        const response = await fetch('prompts/tarot.ini');
        if (!response.ok) {
            throw new Error(`[Prompt] tarot.ini 로드 실패: ${response.status} ${response.statusText}`);
        }
        const textContent = await response.text();
        console.log("[Prompt] tarot.ini 로드 성공. 내용 길이:", textContent.length);
        return textContent;
    } catch (error) {
        console.error(error.message);
        return null; // 오류 발생 시 null 반환
    }
}

function formatChatHistoryForAPI(messageText, role = 'user') {
    // role: 'user' 또는 'model'
    // Gemini API는 이전 대화를 'parts': [{'text': message}] 형태로 받음
    return {
        role: role,
        parts: [{ text: messageText }]
    };
}
async function callGeminiAPI(tarotIniContent, userProfileData, currentChatHistory, additionalSystemInstruction = null) {
    if (!API_KEY) {
        console.error("[API CRITICAL] Gemini API 키가 설정되지 않았습니다.");
        return { assistantmsg: { totalShorts: 1, shorts: [{ id: 1, text: "API 통신 오류: API 키가 설정되지 않았습니다. 관리자에게 문의하세요.", sampleAnswers: [{type: "return_home", text: "처음으로"}] }] }, error: "API 키가 없습니다." };
    }
    if (!tarotIniContent) {
        console.error("[API CRITICAL] 결합된 프롬프트 내용(tarotIniContent)이 없습니다.");
        return { assistantmsg: { totalShorts: 1, shorts: [{ id: 1, text: "API 통신 오류: AI에게 전달할 지침을 불러올 수 없습니다.", sampleAnswers: [{type: "return_home", text: "처음으로"}] }] }, error: "프롬프트 내용 없음" };
    }

    console.log("[API] Gemini API 호출 시작. 현재 ini 관련 내용 길이:", tarotIniContent.length);
    
    const systemPromptParts = [{ text: tarotIniContent }];
    
    if (additionalSystemInstruction) {
        systemPromptParts.push({text: "\n## 추가 시스템 지침 (Additional System Instruction):\n" + additionalSystemInstruction});
        console.log("[API] 추가 시스템 지침 적용:", additionalSystemInstruction.substring(0,100) + "...");
    }
    
    const generationConfig = {
        "temperature": 0.7, "topK": 40, "topP": 0.95, "maxOutputTokens": 2048,
    };

    const requestBody = {
        contents: currentChatHistory, 
        systemInstruction: { parts: systemPromptParts },
        generationConfig: generationConfig
    };

    console.log("[API] 요청 URL:", API_URL);

    let lastError = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
        console.log(`[API] API 호출 시도 #${attempt}`);
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorBodyText = await response.text();
                console.error(`[API] API 오류 응답 (시도 #${attempt}): ${response.status} ${response.statusText}`, errorBodyText.substring(0, 500));
                let errorMessage = `API 오류: ${response.status}`;
                try { const errorJson = JSON.parse(errorBodyText); if (errorJson.error && errorJson.error.message) errorMessage = errorJson.error.message; else errorMessage = errorBodyText.substring(0, 200); } catch (e) { errorMessage = errorBodyText.substring(0, 200); }
                lastError = new Error(errorMessage);
                if (attempt === 3) throw lastError; // 마지막 시도 실패 시 에러 throw
                console.log(`[API] API 호출 실패 (시도 #${attempt}). 잠시 후 재시도합니다.`);
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // 재시도 전 대기
                continue; // 다음 시도
            }

            const responseData = await response.json();
            
            if (responseData.candidates && responseData.candidates.length > 0 && responseData.candidates[0].content && responseData.candidates[0].content.parts && responseData.candidates[0].content.parts.length > 0) {
                let rawText = responseData.candidates[0].content.parts[0].text;
                console.log(`[API] (시도 #${attempt}) 추출된 Raw 응답 텍스트:`, rawText.substring(0, 300) + "...");

                try {
                    let jsonString = rawText;
                    const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
                    const jsonMatch = rawText.match(jsonRegex);
                    if (jsonMatch && jsonMatch[1]) {
                        jsonString = jsonMatch[1];
                    }
                    
                    const parsedJson = JSON.parse(jsonString);
                    console.log(`[API] (시도 #${attempt}) 1차 JSON 파싱 성공. 객체:`, JSON.parse(JSON.stringify(parsedJson)));

                    // 프롬프트는 항상 새로운 다단락 형식(totalShorts, shorts)으로 응답해야 함.
                    if (parsedJson.totalShorts !== undefined && 
                        Array.isArray(parsedJson.shorts) && 
                        parsedJson.shorts.every(s => s.id !== undefined && s.text !== undefined && Array.isArray(s.sampleAnswers) && s.sampleAnswers.every(sa => sa.type !== undefined && sa.text !== undefined))) {
                        console.log("[API] 새로운 다단락 형식으로 응답 검증 완료.");
                        return { assistantmsg: parsedJson }; // 성공 시 즉시 반환
                    } else {
                        console.error(`[API CRITICAL] (시도 #${attempt}) API 응답이 정의된 다단락 JSON 형식을 따르지 않음! 프롬프트를 확인해야 합니다. 받은 JSON:`, parsedJson);
                        lastError = new Error("API 응답 형식 불일치 (프롬프트 확인 필요)");
                        if (attempt === 3) throw lastError;
                        console.log(`[API] 응답 형식 불일치 (시도 #${attempt}). 잠시 후 재시도합니다.`);
                        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
                        continue;
                    }
                } catch (e) { // JSON 파싱 자체 실패
                    console.warn(`[API] (시도 #${attempt}) 응답 JSON 파싱 실패. 원본 텍스트:`, rawText.substring(0,100), "오류:", e);
                    lastError = new Error("JSON 파싱 실패");
                    if (attempt === 3) throw lastError;
                    console.log(`[API] JSON 파싱 실패 (시도 #${attempt}). 잠시 후 재시도합니다.`);
                    await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
                    continue;
                }
            } else if (responseData.promptFeedback && responseData.promptFeedback.blockReason) {
                const blockReason = responseData.promptFeedback.blockReason;
                console.warn(`[API] (시도 #${attempt}) Gemini API 요청 차단됨:`, blockReason, responseData.promptFeedback.safetyRatings);
                const assistantMessageText = `죄송합니다. 요청이 안전 문제로 인해 차단되었습니다. (${blockReason})`;
                // 차단된 경우 재시도 의미 없음
                return { assistantmsg: { totalShorts: 1, shorts: [{ id: 1, text: assistantMessageText, sampleAnswers: [{type: "return_home", text: "처음으로"}] }] }, error: `Blocked: ${blockReason}` };
            } else {
                console.warn(`[API] (시도 #${attempt}) Gemini API 응답에서 유효한 콘텐츠를 찾을 수 없음.`);
                lastError = new Error("No valid content in API response");
                if (attempt === 3) throw lastError;
                console.log(`[API] 유효 콘텐츠 없음 (시도 #${attempt}). 잠시 후 재시도합니다.`);
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
                continue;
            }
        } catch (error) { // fetch 자체의 네트워크 오류 등
            console.error(`[API] (시도 #${attempt}) Gemini API 호출 중 예외 발생:`, error.message);
            lastError = error;
            if (attempt === 3) throw lastError;
            console.log(`[API] 예외 발생 (시도 #${attempt}). 잠시 후 재시도합니다.`);
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
    }

    // 3회 시도 모두 실패한 경우
    console.error("[API CRITICAL] API 호출 3회 재시도 모두 실패.", lastError);
    const errorMessageForChat = `죄송합니다. 현재 루비와의 연결이 원활하지 않아요. 😥 잠시 후 다시 시도해주세요. (오류: ${lastError ? lastError.message.substring(0,50) : "통신 실패"})`;
    return { assistantmsg: { totalShorts: 1, shorts: [{ id: 1, text: errorMessageForChat, sampleAnswers: [{type: "return_home", text: "처음으로"}] }] }, error: lastError ? lastError.message : "API 재시도 모두 실패" };
}
// simulateBotResponse 관련 헬퍼 함수들
async function handleInitialCardPickQuery(userMessageText) {
    // "카드 뽑기", "카드뽑을래", CANCEL_COST_CONFIRMATION_ACTION
    console.log("[SimulateResponse] handleInitialCardPickQuery 실행:", userMessageText);
    return {
        assistantmsg: "카드를 몇 장 뽑으시겠어요?",
        tarocardview: false,
        cards_to_select: null,
        sampleAnswers: [
            { text: "1장", value: "action_select_one_card", cost: 0, displayCostIcon: true, iconType: 'free', actionType: 'choice' },
            { text: "3장", value: "action_select_three_cards", cost: 2, displayCostIcon: true, iconType: 'bone', actionType: 'choice' }
        ],
        importance: 'low',
        user_profile_update: {}
    };
}

async function handleSelectOneCard() {
    console.log("[SimulateResponse] handleSelectOneCard 실행");
    return {
        tarocardview: true,
        cards_to_select: 1,
        sampleAnswers: [],
        importance: 'low',
        user_profile_update: { "시나리오": "tarot_single_pick" },
        systemMessageOnConfirm: "1장을 선택하셨습니다. 카드를 골라주세요."
    };
}

async function handleSelectThreeCards_Confirmation() {
    console.log("[SimulateResponse] handleSelectThreeCards_Confirmation 실행");
    return {
        assistantmsg: `<b>3장</b> 선택 시 <img src="img/icon/bone_inline.png" alt="뼈다귀" class="inline-bone-icon"><b>2개</b>가 사용됩니다. 진행하시겠어요?`,
        importance: 'high',
        isConfirmationStage: true,
        sampleAnswers: [
            { text: `사용`, value: "action_confirm_three_cards_cost", cost: 2, displayCostIcon: true, displayCostText: true, iconType: 'bone', actionType: 'confirm_cost' },
            { text: "취소", value: "action_cancel_cost_confirmation", actionType: 'cancel_cost' }
        ],
        user_profile_update: {}
    };
}

async function handleConfirmThreeCardsCost() {
    console.log("[SimulateResponse] handleConfirmThreeCardsCost 실행");
    if (userProfile.bones >= 2) {
        userProfile.bones -= 2;
        updateBoneCountDisplay();
        saveUserProfileToLocalStorage(userProfile);
        return {
            tarocardview: true,
            cards_to_select: 3,
            sampleAnswers: [],
            importance: 'low',
            user_profile_update: { "시나리오": "tarot_triple_pick", "bones": userProfile.bones },
            systemMessageOnConfirm: "3장을 선택하셨습니다. 카드를 골라주세요. (뼈다귀 -2)"
        };
    } else {
        return {
            assistantmsg: "이런! 뼈다귀가 부족해요. (현재 <img src='img/icon/bone_inline.png' alt='뼈다귀' class='inline-bone-icon'>" + userProfile.bones + "개)<br>1장만 무료로 보시겠어요?",
            tarocardview: false,
            cards_to_select: null,
            importance: 'low',
            sampleAnswers: [
                { text: "1장", value: "action_select_one_card", cost: 0, displayCostIcon: true, iconType: 'free', actionType: 'choice' },
                { text: "다음에 할게요", value: "action_cancel_ 부족", actionType: 'message' }
            ],
            user_profile_update: {}
        };
    }
}

async function handleCardSelectionComplete() {
    console.log("[SimulateResponse] handleCardSelectionComplete 실행. 선택된 카드:", userProfile.선택된타로카드들);
    
    if (!userProfile.선택된타로카드들 || userProfile.선택된타로카드들.length === 0) {
        chatHistoryForAPI.push(formatChatHistoryForAPI("카드 선택 없이 '카드 선택 완료'가 호출됨 (오류 상황)", 'user')); // 시스템적 사용자 메시지
        const errorMsg = "선택된 카드가 없어 풀이를 진행할 수 없습니다. 다시 시도해주십시오.";
        chatHistoryForAPI.push(formatChatHistoryForAPI(errorMsg, 'model'));
        return {
            assistantmsg: errorMsg,
            tarocardview: false, cards_to_select: null, importance: 'low',
            sampleAnswers: [{ text: "카드 뽑기", value: "카드 뽑기", actionType: 'message' }],
            user_profile_update: {}
        };
    }
    
    const tarotIni = await fetchTarotIniContent();
    // API 호출 전에 현재 사용자 행동(카드 선택 완료)을 context로 추가
    const userActionMessage = `사용자가 다음 타로 카드를 선택했습니다: ${userProfile.선택된타로카드들.map(id => (TAROT_CARD_DATA[id] ? TAROT_CARD_DATA[id].name : id)).join(', ')}. 이 카드들에 대한 해석을 부탁합니다. 답변은 항상 사용자가 다음에 선택할 수 있는 2~3개의 sampleanswer (문자열 배열)를 JSON 코드 블록 안에 포함해야 합니다. 예시: \`\`\`json\\n{\\n  \"msg\": \"[카드 해석 내용]\",\\n  \"sampleanswer\": [\"질문1\", \"질문2\"]\n}\\n\`\`\``;
    
    // 이 메시지를 chatHistoryForAPI에 추가 (중복 방지 로직은 handleDefaultMessage와 유사하게 적용 가능하나, 여기선 일단 직접 추가)
    chatHistoryForAPI.push(formatChatHistoryForAPI(userActionMessage, 'user'));
    console.log("[API History] handleCardSelectionComplete에서 사용자 액션 메시지 추가:", userActionMessage);
    
    const additionalInstructionForAPI = "사용자가 타로 카드를 선택했습니다. 선택된 카드에 대한 기본 해석과 함께, 다음 단계로 어떤 것을 할 수 있는지 안내해주세요. 응답에는 항상 JSON 코드 블록으로 msg와 sampleanswer를 포함해야 합니다.";
    
    const apiResponse = await callGeminiAPI(tarotIni, userProfile, chatHistoryForAPI, additionalInstructionForAPI);

    let finalSampleAnswers;
    if (apiResponse.parsedSampleAnswers && apiResponse.parsedSampleAnswers.length > 0) {
        finalSampleAnswers = apiResponse.parsedSampleAnswers.map(saText => ({
            text: saText,
            value: saText,
            actionType: 'message'
        }));
    } else { // API가 sampleanswer를 제공하지 못한 경우, 상황에 맞는 기본값 설정
        if (userProfile.선택된타로카드들.length === 1) {
            finalSampleAnswers = [
                { text: "2장 더 뽑기", value: "action_add_two_cards", cost: 2, displayCostIcon: true, iconType: 'bone', actionType: 'choice' },
                { text: "더 깊은 해석", value: "action_deep_analysis_single", cost: 3, displayCostIcon: true, iconType: 'bone', actionType: 'choice' }
            ];
        } else { 
            finalSampleAnswers = [
                { text: "조금 더 풀이", value: "action_more_interpretation_triple", cost: 0, displayCostIcon: false, actionType: 'message' },
                { text: "더 깊은 해석", value: "action_deep_analysis_triple", cost: 1, displayCostIcon: true, iconType: 'bone', actionType: 'choice' }
            ];
        }
        console.warn("[SimulateResponse] API 응답에서 sampleanswer를 파싱하지 못했거나 비어있음. 시나리오 기반 샘플 답변 사용.");
    }

    return {
        assistantmsg: apiResponse.assistantmsg || "카드 해석을 준비 중입니다...",
        tarocardview: false,
        cards_to_select: null,
        sampleAnswers: finalSampleAnswers,
        importance: 'low',
        user_profile_update: {}
    };
}
async function handleAddTwoCards_Confirmation() {
    console.log("[SimulateResponse] handleAddTwoCards_Confirmation 실행");
    return {
        assistantmsg: `<b>2장 더 뽑기</b> 시 <img src="img/icon/bone_inline.png" alt="뼈다귀" class="inline-bone-icon"><b>2개</b>가 사용됩니다. 진행하시겠어요?`,
        importance: 'high',
        isConfirmationStage: true,
        sampleAnswers: [
            { text: `사용`, value: "action_confirm_add_two_cards_cost", cost: 2, displayCostIcon: true, displayCostText: true, iconType: 'bone', actionType: 'confirm_cost' },
            { text: "취소", value: "action_cancel_cost_confirmation", actionType: 'cancel_cost' }
        ],
        user_profile_update: {}
    };
}

async function handleConfirmAddTwoCardsCost() {
    console.log("[SimulateResponse] handleConfirmAddTwoCardsCost 실행");
    if (userProfile.bones >= 2) {
        userProfile.bones -= 2;
        updateBoneCountDisplay();
        saveUserProfileToLocalStorage(userProfile);
        return {
            tarocardview: true,
            cards_to_select: 2,
            sampleAnswers: [],
            importance: 'low',
            user_profile_update: { "시나리오": "tarot_add_two_pick", "bones": userProfile.bones },
            systemMessageOnConfirm: "2장을 추가로 선택합니다. 카드를 골라주세요. (뼈다귀 -2)"
        };
    } else { // 재화 부족
        return {
            assistantmsg: "이런! 뼈다귀가 부족해요. (현재 <img src='img/icon/bone_inline.png' alt='뼈다귀' class='inline-bone-icon'>" + userProfile.bones + "개)",
            importance: 'low',
            sampleAnswers: [ { text: "다음에 할게요", value: "action_cancel_ 부족", actionType: 'message' } ],
            user_profile_update: {}
        };
    }
}

async function handleDeepAnalysis_Confirmation(userMessageText) {
    console.log("[SimulateResponse] handleDeepAnalysis_Confirmation 실행:", userMessageText);
    let cost = 0;
    let confirmActionValue = "";
    if (userMessageText === "action_deep_analysis_single") { cost = 3; confirmActionValue = "action_confirm_deep_analysis_single_cost"; }
    else if (userMessageText === "action_deep_analysis_triple") { cost = 1; confirmActionValue = "action_confirm_deep_analysis_triple_cost"; }

    if (cost > 0) {
        return {
            assistantmsg: `<b>더 깊은 해석</b> 시 <img src="img/icon/bone_inline.png" alt="뼈다귀" class="inline-bone-icon"><b>${cost}개</b>가 사용됩니다. 진행하시겠어요?`,
            importance: 'high',
            isConfirmationStage: true,
            sampleAnswers: [
                { text: `사용`, value: confirmActionValue, cost: cost, displayCostIcon: true, displayCostText: true, iconType: 'bone', actionType: 'confirm_cost' },
                { text: "취소", value: "action_cancel_cost_confirmation", actionType: 'cancel_cost' }
            ],
            user_profile_update: {}
        };
    }
    // 오류 또는 알 수 없는 요청에 대한 기본 처리
    return handleDefaultMessage(userMessageText);
}

async function handleConfirmDeepAnalysisCost(userMessageText) {
    console.log("[SimulateResponse] handleConfirmDeepAnalysisCost 실행:", userMessageText);
    let requiredBones = 0;
    let additionalInstructionForAPI = "사용자가 선택한 카드에 대해 이전에 제공된 기본 해석을 바탕으로, 더 심층적이고 구체적인 조언을 제공해주세요.";
    if (userMessageText === "action_confirm_deep_analysis_single_cost") requiredBones = 3;
    else if (userMessageText === "action_confirm_deep_analysis_triple_cost") requiredBones = 1;

    if (requiredBones > 0 && userProfile.bones >= requiredBones) {
        userProfile.bones -= requiredBones;
        updateBoneCountDisplay();
        saveUserProfileToLocalStorage(userProfile);

        const tarotIni = await fetchTarotIniContent();
        const currentMessageForHistory = formatChatHistoryForAPI(`사용자가 카드 ${userProfile.선택된타로카드들.map(id => (TAROT_CARD_DATA[id] ? TAROT_CARD_DATA[id].name : id)).join(', ')}에 대한 더 깊은 해석을 요청했습니다. (비용: ${requiredBones} 뼈다귀 사용)`, 'user');
        
        const apiResponse = await callGeminiAPI(tarotIni, userProfile, [...chatHistoryForAPI, currentMessageForHistory], additionalInstructionForAPI);
        chatHistoryForAPI.push(currentMessageForHistory);

        return {
            assistantmsg: apiResponse.assistantmsg || `더 깊은 해석을 준비 중입니다... (뼈다귀 -${requiredBones})`,
            tarocardview: false, cards_to_select: null, importance: 'low',
            sampleAnswers: [ { text: "정말 고마워요!", value: "고맙습니다", actionType: 'message'}, { text: "다른 질문 있어요", value: "다른 질문", actionType: 'message' } ],
            user_profile_update: { "bones": userProfile.bones }
        };
    } else if (requiredBones > 0) { // 재화 부족
        return {
            assistantmsg: "이런! 뼈다귀가 부족해서 더 깊은 해석을 듣기 어렵겠어요. (현재 <img src='img/icon/bone_inline.png' alt='뼈다귀' class='inline-bone-icon'>" + userProfile.bones + "개)",
            importance: 'low',
            sampleAnswers: [ { text: "괜찮아요", value: "괜찮습니다", actionType: 'message' }, { text: "뼈다귀는 어떻게 얻나요?", value: "뼈다귀 얻는법", actionType: 'message' } ],
            user_profile_update: {}
        };
    }
    return handleDefaultMessage(userMessageText);
}

async function handleDefaultMessage(userMessageText) {
    console.log("[SimulateResponse] handleDefaultMessage 실행:", userMessageText);

    // "오늘의 운세 보여줘" 또는 유사 키워드 감지
    const lowerUserMessage = userMessageText.toLowerCase();
    if (lowerUserMessage.includes("오늘의 운세") || lowerUserMessage.includes("오늘 운세")) {
        console.log("[SimulateResponse] '오늘의 운세' 요청 감지. 카드 뽑기 단계로 안내.");
        // 사용자 메시지를 히스토리에 추가
        const userMessageEntry = formatChatHistoryForAPI(userMessageText, 'user');
         if (chatHistoryForAPI.length === 0 || 
            !(chatHistoryForAPI[chatHistoryForAPI.length - 1].role === 'user' && 
              chatHistoryForAPI[chatHistoryForAPI.length - 1].parts[0].text === userMessageText)) {
            chatHistoryForAPI.push(userMessageEntry);
        }
        // 봇의 안내 메시지도 히스토리에 추가
        const fortuneIntroMsg = "오늘의 운세를 보려면 먼저 카드를 뽑아야 해. 😊<br>몇 장으로 볼까?";
        chatHistoryForAPI.push(formatChatHistoryForAPI(fortuneIntroMsg, 'model'));
        
        return {
            assistantmsg: fortuneIntroMsg,
            tarocardview: false,
            cards_to_select: null,
            sampleAnswers: [ // "카드 뽑기"와 동일한 선택지 제공
                { text: "1장", value: "action_select_one_card", cost: 0, displayCostIcon: true, iconType: 'free', actionType: 'choice' },
                { text: "3장", value: "action_select_three_cards", cost: 2, displayCostIcon: true, iconType: 'bone', actionType: 'choice' }
            ],
            importance: 'low',
            user_profile_update: {}
        };
    }


    if (!userMessageText || userMessageText.trim() === "") {
        // ... (기존 빈 메시지 처리 로직)
        console.warn("[SimulateResponse] handleDefaultMessage: 빈 메시지 수신, 기본 응답 처리.");
        const emptyMsgResponse = "죄송해요, 잘 이해하지 못했어요. 좀 더 자세히 말씀해주시겠어요?";
        chatHistoryForAPI.push(formatChatHistoryForAPI(emptyMsgResponse, 'model'));
        return {
            assistantmsg: emptyMsgResponse,
            tarocardview: false,
            cards_to_select: null,
            sampleAnswers: [{ text: "도움말", value: "도움말", actionType: 'message' }],
            importance: 'low',
            user_profile_update: {}
        };
    }

    const userMessageEntry = formatChatHistoryForAPI(userMessageText, 'user');
    if (chatHistoryForAPI.length === 0 || 
        !(chatHistoryForAPI[chatHistoryForAPI.length - 1].role === 'user' && 
          chatHistoryForAPI[chatHistoryForAPI.length - 1].parts[0].text === userMessageText)) {
        chatHistoryForAPI.push(userMessageEntry);
        console.log("[API History] handleDefaultMessage에서 사용자 메시지 추가:", userMessageText);
    } else {
        console.log("[API History] handleDefaultMessage: 직전과 동일한 사용자 메시지, 중복 추가 방지.");
    }

    const tarotIni = await fetchTarotIniContent();
    let additionalInstruction = "사용자의 일반적인 질문 또는 요청에 대해 답변해주세요. 답변은 항상 사용자가 다음에 선택할 수 있는 2~3개의 sampleanswer (문자열 배열)와, 해당 답변과 관련된 타로 카드 이미지가 있다면 그 파일명을 tarotImg 필드로 JSON 코드 블록 안에 포함해야 합니다. 예시: ```json\\n{\\n  \"msg\": \"[여기에 짧은 답변]\",\\n  \"tarotImg\": \"major_00_fool_upright.png\",\\n  \"sampleanswer\": [\"질문1\", \"질문2\"]\n}\\n```";
    if (userMessageText.toLowerCase().includes("도움말") || userMessageText.toLowerCase().includes("help")) {
        additionalInstruction = "사용자가 도움말을 요청했습니다. 당신이 할 수 있는 주요 기능들을 간략히 안내해주세요. 답변은 항상 사용자가 다음에 선택할 수 있는 2~3개의 sampleanswer (문자열 배열)를 JSON 코드 블록 안에 포함해야 합니다. tarotImg는 null로 설정해도 됩니다. 예시: ```json\\n{\\n  \"msg\": \"[여기에 도움말 내용]\",\\n  \"tarotImg\": null,\\n  \"sampleanswer\": [\"기능1 문의\", \"기능2 문의\"]\n}\\n```";
    }
    
    const apiResponse = await callGeminiAPI(tarotIni, userProfile, chatHistoryForAPI, additionalInstruction);
    
    let finalSampleAnswers;
    if (apiResponse.parsedSampleAnswers && apiResponse.parsedSampleAnswers.length > 0) {
        finalSampleAnswers = apiResponse.parsedSampleAnswers.map(saText => ({
            text: saText, value: saText, actionType: 'message'
        }));
    } else {
        finalSampleAnswers = [{ text: "다른 질문", value: "다른 질문 할래", actionType: 'message' }];
        console.warn("[SimulateResponse] API 응답에서 sampleanswer를 파싱하지 못했거나 비어있음. 기본 샘플 답변 사용.");
    }

    return {
        assistantmsg: apiResponse.assistantmsg || "응답을 생성하는 중입니다...",
        tarotImg: apiResponse.tarotImg || null, // API 응답에서 tarotImg 전달
        tarocardview: false,
        cards_to_select: null,
        sampleAnswers: finalSampleAnswers,
        importance: 'low',
        user_profile_update: {}
    };
}
async function initializeChat() {
    console.log("[App] 초기화 시작.");
    initializeUserProfile(); // 여기서 currentSelectedCardImagePaths도 초기화됨

    if (typeof ALL_SYNC_TYPES === 'undefined' || typeof ALL_NEBULAS === 'undefined' || typeof TAROT_CARD_DATA === 'undefined') {
        const missingData = [
            typeof ALL_SYNC_TYPES === 'undefined' ? 'ALL_SYNC_TYPES (syncTypes.js)' : null,
            typeof ALL_NEBULAS === 'undefined' ? 'ALL_NEBULAS (nebulas.js)' : null,
            typeof TAROT_CARD_DATA === 'undefined' ? 'TAROT_CARD_DATA (tarotData.js)' : null,
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

    if (tarotSelectionConfirmBtn) {
        tarotSelectionConfirmBtn.addEventListener('click', handleTarotSelectionConfirm);
    } else {
        console.error("[App] tarotSelectionConfirmBtn 요소를 찾을 수 없습니다.");
    }
    if (tarotClearSelectionBtn) {
        tarotClearSelectionBtn.addEventListener('click', handleClearTarotSelection);
    } else {
        console.error("[App] tarotClearSelectionBtn 요소를 찾을 수 없습니다.");
    }
    if (tarotRandomSelectBtn) {
        tarotRandomSelectBtn.addEventListener('click', handleRandomTarotSelection);
    } else {
        console.error("[App] tarotRandomSelectBtn 요소를 찾을 수 없습니다.");
    }

    isLoadingBotResponse = true;
    setUIInteractions(true, false); // 초기 상호작용 비활성화

    // 초기 메시지 및 샘플 답변을 simulateBotResponse를 통해 가져오도록 변경
    // 이렇게 하면 초기 메시지도 다단락 JSON 형식을 따를 수 있음 (필요하다면)
    try {
        // currentIniFileName = 'initial-greeting.ini'; // 초기 인사용 ini 파일 (선택적)
        // const initialBotData = await simulateBotResponse("action_show_initial_greeting");
        // 여기서는 간단한 메시지와 함께 '카드 뽑기' 유도 샘플 답변을 표시하도록 수정
        
        currentCardInterpretation = null; // 초기에는 해석 없음
        currentShortIndex = -1;
        currentIniFileName = ''; // 특정 ini에 종속되지 않은 초기 상태
        currentSelectedCardImagePaths = []; // 초기 이미지 없음

        // await addMessage("안녕, 또 왔네. 😊 어떤 타로를 준비해볼까?", 'bot');
        // await updateSampleAnswers([
        //     { text: "오늘의 운세 (1장)", value: "action_select_one_card", type: "tarot_choice" },
        //     { text: "고민 상담 (3장)", value: "action_select_three_cards", type: "tarot_choice" }
        // ]);
        // processMessageExchange를 통해 초기 메시지 표시
        await processMessageExchange("action_show_initial_menu", 'system_init_skip_user_message');


    } catch (error) {
        console.error("[App] 초기 메시지 표시 중 오류:", error);
        await addMessage("초기 메시지를 표시하는 중 오류가 발생했습니다.", "system");
    }

    isLoadingBotResponse = false;
    setUIInteractions(false, false);
    if(messageInput) {
        messageInput.disabled = false;
        if (sendBtn) sendBtn.disabled = messageInput.value.trim() === '';
    }
    if(moreOptionsBtn) moreOptionsBtn.disabled = false;

    console.log("[App] 초기화 완료.");
}
    initializeChat();
});