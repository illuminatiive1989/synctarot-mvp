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

    const initialBotMessage = {
        text: "안녕하세요. 어떤 타로를 보시겠어요?",
        sampleAnswers: ["오늘의 운세", "카드뽑을래"] // 여기에 "카드뽑을래"가 있어야 합니다.
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
        "결정된싱크타입": "스텔라터틀",
        "사용자소속성운": "루미네시아",
        "사용자가성운에속한이유": "아직 알 수 없어요.",
        "맞춤싱크타입이름": "별을 기다리는 자",
        "overviewText": "당신은 복잡한 내면세계를 가진 존재입니다. 때로는 활기차고 외향적이다가도, 깊은 생각에 잠겨 혼자만의 시간을 즐기기도 합니다. 다양한 가능성을 탐색하는 것을 좋아하며, 정해진 틀에 얽매이는 것을 답답해할 수 있습니다. 당신의 강점은 뛰어난 직관력과 공감 능력이지만, 때로는 감정에 쉽게 휩쓸리거나 결정을 내리는 데 어려움을 겪을 수도 있습니다. 균형을 찾는 여정이 중요해 보입니다.", // 총평 텍스트 임시값
        "사용자의감정상태": "평온",
        "선택된타로카드들": [], // 사용자가 최종 선택한 실제 타로 카드 ID 목록
        "지금까지수집된타로카드": [],
        "시나리오": null,
        "메뉴단계": 1,
        "싱크타입단계": "미결정",
        "tarotbg": "default.png" // 타로 선택 화면 배경 이미지 파일명
    };

    userProfile = { ...defaultProfile };

    if (loadedProfileData) {
        // 기존 속성들 로드
        if (loadedProfileData.결정된싱크타입) userProfile.결정된싱크타입 = loadedProfileData.결정된싱크타입;
        if (loadedProfileData.사용자소속성운) userProfile.사용자소속성운 = loadedProfileData.사용자소속성운;
        if (loadedProfileData.사용자이름) userProfile.사용자이름 = loadedProfileData.사용자이름;
        if (loadedProfileData.사용자애칭) userProfile.사용자애칭 = loadedProfileData.사용자애칭;
        if (loadedProfileData.지금까지수집된타로카드) userProfile.지금까지수집된타로카드 = loadedProfileData.지금까지수집된타로카드;
        if (loadedProfileData.overviewText) userProfile.overviewText = loadedProfileData.overviewText;
        if (loadedProfileData.tarotbg) userProfile.tarotbg = loadedProfileData.tarotbg; // tarotbg 로드

        if (userProfile.결정된싱크타입 && userProfile.사용자소속성운) {
            userProfile.싱크타입단계 = "결정됨";
        }
        console.log("[UserProfile] 로컬 스토리지 데이터로 프로필 업데이트 완료.");
    } else {
        console.log("[UserProfile] 첫 방문 또는 로컬 데이터 없음. 기본값 사용 및 저장.");
        // 기본값 중 일부 사용자 정의
        userProfile.사용자이름 = "임시방문객";
        userProfile.사용자애칭 = "별 탐험가";
        userProfile.싱크타입단계 = "결정됨"; // 초기 테스트를 위해 '결정됨'으로 설정
        // overviewText는 defaultProfile의 임시값을 사용
        // tarotbg는 defaultProfile의 값을 사용
        saveUserProfileToLocalStorage(userProfile);
    }

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
        지금까지수집된타로카드: profile.지금까지수집된타로카드, // 수집된 카드도 저장
        overviewText: profile.overviewText, // 총평 텍스트 저장
        tarotbg: profile.tarotbg, // 타로 배경 이미지 저장
        선택된타로카드들: profile.선택된타로카드들 // 선택된 타로카드 ID도 저장
        // 필요에 따라 다른 userProfile 속성들도 추가
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

async function addMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    console.log(`[Message] '${type}' 메시지 추가 시작: "${String(text).substring(0, 50)}..."`);

    return new Promise(async (resolveAllMessagesAdded) => {
        if (type === 'user') {
            messageDiv.classList.add('user-message');
            messageDiv.textContent = text;
            if (chatMessages) chatMessages.appendChild(messageDiv);
            requestAnimationFrame(() => {
                adjustChatMessagesPadding();
                scrollToBottom();
                console.log("[Message] 사용자 메시지 DOM 추가 완료.");
                resolveAllMessagesAdded();
            });
        } else if (type === 'bot') {
            messageDiv.classList.add('bot-message');
            if (chatMessages) chatMessages.appendChild(messageDiv);
            
            requestAnimationFrame(() => {
                adjustChatMessagesPadding();
                scrollToBottom();
            });

            const sanitizedHtml = sanitizeBotHtml(text);
            // console.log('[Message] Bot message sanitized HTML for typing:', sanitizedHtml);
            
            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = sanitizedHtml;

            const typingChunks = [];
            function extractChunksRecursive(node) {
                if (node.nodeType === Node.TEXT_NODE) {
                    const textContent = node.textContent;
                    if (textContent.trim() !== '') {
                        // 텍스트를 단어 단위(공백 기준) 또는 의미 있는 단위로 분리
                        // 여기서는 정규식을 사용하여 공백 포함 단어 또는 연속된 특수문자 등을 분리
                        const words = textContent.match(/\S+\s*|\S/g) || []; // 이전 방식: 단어 + 뒤따르는 공백 or 단일 문자
                        words.forEach(word => {
                            if (word.trim() !== '') { // 실제 내용이 있는 단어만 청크로
                                typingChunks.push({ type: 'text_word', content: word });
                            } else if (word.length > 0) { // 공백만 있는 경우도 청크로 추가 (줄바꿈 등 유지 위함)
                                typingChunks.push({ type: 'text_whitespace', content: word });
                            }
                        });
                    } else if (textContent.length > 0) { // 전체가 공백인 텍스트 노드
                        typingChunks.push({ type: 'text_whitespace', content: textContent });
                    }
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    const tagName = node.tagName.toLowerCase();
                    
                    if (tagName === 'img') {
                        typingChunks.push({ type: 'element_immediate', element: node.cloneNode(true) });
                    } else if (tagName === 'br') {
                        typingChunks.push({ type: 'br_tag' });
                    } else { // b, strong, span, div 등
                        typingChunks.push({ type: 'open_tag', tagName: tagName, attributes: Array.from(node.attributes) });
                        Array.from(node.childNodes).forEach(extractChunksRecursive);
                        typingChunks.push({ type: 'close_tag', tagName: tagName });
                    }
                }
            }

            Array.from(tempContainer.childNodes).forEach(extractChunksRecursive);
            // console.log('[Message] Typing chunks:', typingChunks);

            let currentContextElement = messageDiv;

            for (let i = 0; i < typingChunks.length; i++) {
                const chunk = typingChunks[i];

                if (chunk.type === 'element_immediate') { // 이미지
                    currentContextElement.appendChild(chunk.element);
                } else {
                    // 텍스트, br, 여는/닫는 태그는 타이핑 딜레이 적용
                    await new Promise(resolve => setTimeout(resolve, TYPING_CHUNK_DELAY_MS));

                    if (chunk.type === 'text_word') {
                        const wordSpan = document.createElement('span');
                        wordSpan.className = 'message-text-chunk-animated'; // 페이드인 애니메이션 클래스
                        wordSpan.textContent = chunk.content;
                        currentContextElement.appendChild(wordSpan);
                    } else if (chunk.type === 'text_whitespace') {
                        // 공백은 span으로 감싸지 않고 텍스트 노드로 바로 추가
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
            console.log("[Message] 봇 메시지 타이핑 완료 (단어 단위 페이드인, 이미지 포함).");
            resolveAllMessagesAdded();

        } else if (type === 'system') {
            messageDiv.classList.add('system-message');
            messageDiv.textContent = text;
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

    function updateSampleAnswers(answers = []) {
        console.log("[SampleAnswers] 업데이트 시작. 답변 개수:", answers.length);
        const existingButtons = Array.from(sampleAnswersContainer.querySelectorAll('.sample-answer-btn'));
        const buttonFadeOutDuration = 200;

        function addAndAnimateNewButtons() {
            sampleAnswersContainer.innerHTML = '';
            if (answers.length > 0) {
                sampleAnswersContainer.classList.add('has-buttons');
                answers.forEach((answerData, index) => {
                    const button = document.createElement('button');
                    button.classList.add('sample-answer-btn');
                    const answerText = (typeof answerData === 'string') ? answerData : answerData.text;
                    const answerValue = (typeof answerData === 'string') ? answerData : (answerData.value || answerData.text);
                    button.textContent = answerText;
                    button.dataset.answer = answerValue;
                    button.style.animationDelay = `${index * 70}ms`;
                    button.disabled = isLoadingBotResponse;
                    sampleAnswersContainer.appendChild(button);
                });
            } else {
                sampleAnswersContainer.classList.remove('has-buttons');
            }
            requestAnimationFrame(adjustChatMessagesPadding);
            console.log("[SampleAnswers] 업데이트 완료.");
        }

        if (existingButtons.length > 0) {
            console.log("[SampleAnswers] 기존 버튼 페이드 아웃.");
            existingButtons.forEach(btn => btn.classList.add('fade-out'));
            setTimeout(addAndAnimateNewButtons, buttonFadeOutDuration);
        } else {
            addAndAnimateNewButtons();
        }
    }

const botKnowledgeBase = {
    "오늘의 운세 보여줘": { response: "오늘 당신의 운세는... <b>매우 긍정적</b>입니다! 새로운 시작을 하기에 좋은 날이에요. <br>자신감을 가지세요!", sampleAnswers: ["다른 운세", "고마워"] },
    "오늘 뭐 먹을지 추천해줘": { response: "오늘은 <b>따뜻한 국물 요리</b> 어떠세요? 예를 들어, <b>김치찌개</b>나 <b>순두부찌개</b>도 좋겠네요!", sampleAnswers: ["김치찌개 레시피", "다른 추천"] },
    "썸인지 아닌지 알려줘": { response: "상대방의 행동과 말투를 자세히 알려주시면, 제가 분석해볼게요! <br>예를 들어, '그 사람은 나에게 자주 웃어줘요.' 처럼요.", sampleAnswers: ["카톡 대화 분석해줘", "데이트 신청해도 될까?"] },
    "그 사람의 마음을 알고 싶어": { response: "마음을 읽는 것은 어렵지만, 몇 가지 질문을 통해 추측해볼 수 있어요.<br>그 사람과 어떤 관계인가요?", sampleAnswers: ["친구 관계예요", "직장 동료예요"] },
    "오늘의 운세가 궁금해요.": { response: "오늘의 운세입니다:<br><b>희망찬 하루!</b> 작은 노력들이 결실을 맺을 거예요.<br>자신감을 갖고 나아가세요.", sampleAnswers: ["다른 운세 보기", "오늘 날씨는?", "고마워"] },
    "추천 메뉴 알려주세요.": { response: "오늘은 특별한 날인가요? <b>스테이크</b> 어떠세요?<br>아니면 가볍게 <b>샐러드 파스타</b>도 좋아요!", sampleAnswers: ["스테이크 맛집", "파스타 레시피", "다른 추천"] },
    "날씨 알려줘.": { response: "현재 계신 지역의 날씨를 알려드릴까요?<br>아니면 특정 도시의 날씨가 궁금하신가요?", sampleAnswers: ["서울 날씨", "부산 날씨", "내 위치 날씨"] },
    "도움말 보여주세요.": { response: "무엇을 도와드릴까요?<br>저는 <b>운세 보기</b>, <b>메뉴 추천</b>, <b>날씨 정보</b> 등을 제공할 수 있어요.<br>궁금한 것을 말씀해주세요!", sampleAnswers: ["오늘의 운세", "추천 메뉴", "날씨 알려줘"] },
    "오늘의 운세": { response: "오늘의 운세입니다:<br><b>대박!</b> 원하는 모든 것을 이룰 수 있는 하루예요!<br>긍정적인 마음으로 도전해보세요.", sampleAnswers: ["추천 메뉴", "오늘 날씨 어때?", "고마워"] },
    "추천 메뉴": { response: "점심 메뉴로는 <b>얼큰한 김치찌개</b> 어떠세요? 아니면 저녁으로 <b>부드러운 크림 파스타</b>도 좋겠네요!", sampleAnswers: ["김치찌개 레시피", "파스타 맛집 추천", "다른 거 없어?"] },
    "날씨 알려줘": { response: "오늘 서울의 날씨는 <b>맑음</b>, 최고 기온 25도입니다. <br>외출하기 좋은 날씨네요!", sampleAnswers: ["미세먼지 정보", "내일 날씨는?", "고마워"] },
    "기본": { response: "죄송해요, 잘 이해하지 못했어요. <br><b>도움말</b>이라고 입력하시면 제가 할 수 있는 일을 알려드릴게요.", sampleAnswers: ["도움말", "오늘의 운세", "추천 메뉴"] }
};
function simulateBotResponse(userMessageText) {
    console.log(`[BotResponse] "${userMessageText}"에 대한 응답 시뮬레이션 시작.`);
    return new Promise(resolve => {
        setTimeout(() => {
            let responseData = {};
            const lowerUserMessage = userMessageText.toLowerCase();

            if (userMessageText === "카드뽑을래") {
                responseData = {
                    assistantmsg: "네, 알겠습니다. 잠시 카드를 준비하겠습니다.<br>준비가 되면 아래에서 <b>3장</b>의 카드를 선택해주십시오.",
                    tarocardview: true,
                    cards_to_select: 3,
                    sampleanswer: "선택 취소|운에 맡기기", // "운에 맡기기"도 초기 샘플 답변에 추가 가능
                    user_profile_update: {}
                };
            } else if (userMessageText === "카드 선택 완료") {
                let assistantMsgContent = `선택하신 카드들에 대한 분석을 진행하겠습니다.<br>결과는 잠시 후 말씀드리겠습니다.<br><br>`;
                
                if (userProfile.선택된타로카드들 && userProfile.선택된타로카드들.length > 0) {
                    assistantMsgContent += "선택하신 카드는 다음과 같습니다:<br>";
                    userProfile.선택된타로카드들.forEach((cardId, index) => {
                        let cardDisplayName = cardId.replace(/_/g, ' '); // 기본 이름
                        let imageNameForFile = cardId; // 파일명으로 사용할 ID
                        let isReversed = cardId.endsWith('_reversed');

                        if (typeof TAROT_CARD_DATA !== 'undefined' && TAROT_CARD_DATA[cardId]) {
                            cardDisplayName = TAROT_CARD_DATA[cardId].name;
                            // TAROT_CARD_DATA에 이미지 파일명 정보가 있다면 그것을 우선 사용할 수 있음
                            // 예: if (TAROT_CARD_DATA[cardId].imageFile) imageNameForFile = TAROT_CARD_DATA[cardId].imageFile;
                        } else {
                            cardDisplayName = cardId.replace(/_/g, ' ')
                                                  .replace(/\b\w/g, l => l.toUpperCase())
                                                  .replace(' Reversed', ' (역방향)')
                                                  .replace(' Upright', ' (정방향)');
                        }
                        
                        // 이미지 파일명 규칙: 모든 앞면 이미지는 _upright.png 형태라고 가정
                        // _reversed로 끝나는 ID는 _upright로 변경하여 파일명 생성
                        if (isReversed) {
                            imageNameForFile = cardId.substring(0, cardId.lastIndexOf('_reversed')) + '_upright';
                        } else if (cardId.endsWith('_upright')) {
                            // _upright로 끝나면 그대로 사용 (이미 파일명 규칙에 맞음)
                            imageNameForFile = cardId;
                        } else {
                            // _upright나 _reversed가 없는 ID라면 (예: 커스텀 카드), ID 자체를 파일명으로 사용하거나
                            // _upright를 붙여주는 규칙을 따를 수 있음. 여기서는 ID 그대로 사용.
                            // 하지만 ALL_TAROT_CARD_IDS는 규칙을 따르므로 이 경우는 드묾.
                            console.warn(`[BotResponse] 카드 ID (${cardId})가 표준 접미사(_upright/_reversed)를 따르지 않아 이미지 파일명 생성에 주의가 필요합니다.`);
                        }

                        const cardImageUrl = `img/tarot/${imageNameForFile}.png`;
                        
                        // HTML 문자열 생성 시, sanitizeBotHtml 함수가 이를 올바르게 처리할 수 있도록 구성
                        // class="chat-embedded-image"를 추가하여 CSS에서 스타일 제어
                        assistantMsgContent += `<div>`; // 각 카드를 div로 묶어줌 (스타일 적용 용이)
                        assistantMsgContent += `<img src="${cardImageUrl}" alt="${cardDisplayName}" class="chat-embedded-image">`;
                        assistantMsgContent += `<span style="display: block; text-align: center; font-size: 0.85em; color: #333; margin-top: 4px;">${index + 1}. ${cardDisplayName}</span>`;
                        assistantMsgContent += `</div>`;
                        if (index < userProfile.선택된타로카드들.length - 1) {
                             assistantMsgContent += `<br>`; // 카드 사이에 명시적 줄바꿈 추가 (선택 사항)
                        }
                    });
                    assistantMsgContent += "<br><br>곧 자세한 내용을 전달드리겠습니다.";
                } else {
                    assistantMsgContent += "선택된 카드가 없습니다. 다시 시도해주십시오.";
                }

                responseData = {
                    assistantmsg: assistantMsgContent,
                    tarocardview: false,
                    cards_to_select: null,
                    sampleanswer: "결과를 기다리겠습니다|다른 질문이 있습니다",
                    user_profile_update: {}
                };
            } else {
                // 일반 메시지 처리 (기존 botKnowledgeBase 사용)
                let baseResponse = botKnowledgeBase[userMessageText];
                if (!baseResponse) {
                    const lowerUserMessage = userMessageText.toLowerCase(); // 여기서 선언
                    if (lowerUserMessage.includes("운세")) baseResponse = botKnowledgeBase["오늘의 운세 보여줘"];
                    else if (lowerUserMessage.includes("메뉴") || lowerUserMessage.includes("음식") || lowerUserMessage.includes("추천")) baseResponse = botKnowledgeBase["오늘 뭐 먹을지 추천해줘"];
                    else if (lowerUserMessage.includes("날씨")) baseResponse = botKnowledgeBase["날씨 알려줘."];
                    else if (lowerUserMessage.includes("도움") || lowerUserMessage.includes("help")) baseResponse = botKnowledgeBase["도움말 보여주세요."];
                }
                if (!baseResponse) baseResponse = botKnowledgeBase["기본"];
                
                responseData = {
                    assistantmsg: baseResponse.response, // botKnowledgeBase에 정의된 말투 사용
                    tarocardview: false,
                    cards_to_select: null,
                    sampleanswer: (baseResponse.sampleAnswers || []).join('|') || "알겠습니다|다른 질문",
                    user_profile_update: {}
                };
            }
            
            console.log(`[BotResponse] 생성된 assistantmsg 미리보기 (sanitize 전):`, responseData.assistantmsg);
            resolve(responseData);
        }, 200 + Math.random() * 300);
    });
}
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
        const { clearBeforeSend = false, menuItemData = null } = options;

        console.log(`[ProcessExchange] 시작. 메시지: "${messageText}", 소스: ${source}, 옵션:`, options);
        if (messageText.trim() === '' || isLoadingBotResponse) {
            console.log("[ProcessExchange] 조건 미충족으로 중단 (빈 메시지 또는 로딩 중).");
            return;
        }

        let shouldClearChat = clearBeforeSend;
        if (!hasUserSentMessage && source !== 'system_init') {
            shouldClearChat = true;
            hasUserSentMessage = true;
            userProfile.메뉴단계 = 2;
            console.log("[ProcessExchange] 사용자의 첫 메시지. 채팅창 비움 활성화, 메뉴 단계 2로 변경.");
        }


        if (shouldClearChat) {
            clearChatMessages();
        }

        isLoadingBotResponse = true;
        if(sendBtn) sendBtn.classList.add('loading');
        setUIInteractions(true, false);


        if (moreOptionsPanel.classList.contains('active')) {
            console.log("[ProcessExchange] 더보기 패널 닫기.");
            moreOptionsPanel.classList.remove('active');
            moreOptionsBtn.classList.remove('active');
        }

        if (source !== 'system_init_skip_user_message' && source !== 'system_internal') {
             await addMessage(messageText, 'user');
        }


        if (source === 'input' && messageInput) {
            messageInput.value = '';
            adjustTextareaHeight();
        }

        try {
            const botApiResponse = await simulateBotResponse(messageText);
            
            if (botApiResponse.user_profile_update) {
                for (const key in botApiResponse.user_profile_update) {
                    if (botApiResponse.user_profile_update[key] !== null && botApiResponse.user_profile_update[key] !== undefined && botApiResponse.user_profile_update[key] !== "없음") {
                        if (key === "선택된타로카드들" && Array.isArray(botApiResponse.user_profile_update[key]) && botApiResponse.user_profile_update[key].length === 0 && userProfile.선택된타로카드들.length > 0) {
                            //
                        } else {
                            userProfile[key] = botApiResponse.user_profile_update[key];
                        }
                    }
                }
                saveUserProfileToLocalStorage(userProfile);
                console.log("[UserProfile] API 응답으로 프로필 업데이트:", botApiResponse.user_profile_update);
            }

            // assistantmsg만 사용하여 봇 메시지 추가 (action 필드 사용 안 함)
            await addMessage(botApiResponse.assistantmsg, 'bot');
            
            const sampleAnswersArray = botApiResponse.sampleanswer ? botApiResponse.sampleanswer.split('|').map(s => s.trim()).filter(s => s) : [];
            updateSampleAnswers(sampleAnswersArray);

            if (botApiResponse.tarocardview && botApiResponse.cards_to_select > 0) {
                if (messageInput && document.activeElement === messageInput) {
                    messageInput.blur();
                }
                let currentTarotBg = userProfile.tarotbg || 'default.png';
                if (menuItemData && menuItemData.tarotbg) {
                    currentTarotBg = menuItemData.tarotbg;
                    userProfile.tarotbg = currentTarotBg;
                    saveUserProfileToLocalStorage(userProfile);
                }
                console.log(`[TarotUI] 카드 선택 UI 표시. 선택할 카드 수: ${botApiResponse.cards_to_select}, 배경: ${currentTarotBg}`);
                showTarotSelectionUI(botApiResponse.cards_to_select, currentTarotBg);
            }

        } catch (error) {
            console.error("[ProcessExchange] 오류 발생:", error);
            await addMessage("죄송합니다. 응답 중 오류가 발생했습니다.", 'system');
            updateSampleAnswers(initialBotMessage.sampleAnswers);
        } finally {
            isLoadingBotResponse = false;
            if(sendBtn) sendBtn.classList.remove('loading');
            const shouldFocus = (source === 'input');
            setUIInteractions(false, shouldFocus);
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

        console.log("[TarotSelection] 선택 완료. 사용자가 고른 '위치' 인덱스:", selectedTarotCardIndices);

        // 실제 타로 카드 ID를 할당하는 로직
        // ALL_TAROT_CARD_IDS 에서 중복되지 않게 cardsToSelectCount 만큼 랜덤으로 뽑아서
        // selectedTarotCardIndices 에 있는 "순서"대로 매칭하여 저장.
        // 또는, selectedTarotCardIndices 자체가 이미 UI 상에서 사용자가 "고른 카드"의 인덱스이므로,
        // 이 인덱스를 ALL_TAROT_CARD_IDS에 직접 매핑할 수도 있으나, 이는 사용자가 특정 카드를 고른다는 의미가 되어버림.
        // "유저는 뭔카든지 몰라야 함" -> 사용자가 UI에서 카드를 골랐을 때, 그 "위치"에 어떤 카드가 배정될지는 이 시점에서 랜덤 결정.
        
        const availableCardIds = [...ALL_TAROT_CARD_IDS]; // 전체 카드 ID 복사본
        const chosenCardIds = [];

        for (let i = 0; i < cardsToSelectCount; i++) {
            if (availableCardIds.length === 0) break; // 뽑을 카드가 없으면 중단
            const randomIndex = Math.floor(Math.random() * availableCardIds.length);
            chosenCardIds.push(availableCardIds.splice(randomIndex, 1)[0]);
        }
        
        userProfile.선택된타로카드들 = chosenCardIds; // 실제 선택된 카드 ID들 저장
        saveUserProfileToLocalStorage(userProfile);
        console.log("[UserProfile] 실제 선택된 타로 카드 ID 저장:", userProfile.선택된타로카드들);


        hideTarotSelectionUI();
        await processMessageExchange("카드 선택 완료", 'system_internal');
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
        console.log(`[TarotSelection] 운에 맡기기. ${cardsToSelectCount}장 랜덤 선택.`);

        handleClearTarotSelection(); // 기존 UI 선택 모두 취소

        const availableCardIds = [...ALL_TAROT_CARD_IDS];
        const randomlyChosenCardIds = [];

        for (let i = 0; i < cardsToSelectCount; i++) {
            if (availableCardIds.length === 0) break;
            const randomIndex = Math.floor(Math.random() * availableCardIds.length);
            randomlyChosenCardIds.push(availableCardIds.splice(randomIndex, 1)[0]);
        }

        // UI 상에서 선택된 것처럼 표시하기 위해, 뽑힌 ID들의 "인덱스"를 찾아야 하지만,
        // "운에 맡기기"는 UI 인터랙션 없이 바로 ID를 결정하므로, UI 피드백은 생략하거나
        // 또는 이 ID들을 selectedTarotCardIndices에 (UI용 인덱스가 아닌 실제 ID로) 넣고
        // handleTarotSelectionConfirm을 호출하는 방식으로 통일할 수도 있습니다.
        // 여기서는 바로 handleTarotSelectionConfirm을 호출하여 ID 저장 및 다음 단계로 진행.
        
        userProfile.선택된타로카드들 = randomlyChosenCardIds; // 실제 선택된 카드 ID들 저장
        saveUserProfileToLocalStorage(userProfile);
        console.log("[UserProfile] '운에 맡기기'로 실제 선택된 타로 카드 ID 저장:", userProfile.선택된타로카드들);

        // "선택 완료" 버튼을 누른 것과 동일한 로직으로 진행
        hideTarotSelectionUI(); // UI 숨김
        processMessageExchange("카드 선택 완료", 'system_internal'); // 다음 단계로
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
            const answerText = targetButton.dataset.answer;
            await processMessageExchange(answerText, 'sample_button');
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

async function initializeChat() {
    console.log("[App] 초기화 시작.");
    initializeUserProfile();

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
    setUIInteractions(true, false);

    if (typeof initialBotMessage === 'undefined' || !initialBotMessage.text || !initialBotMessage.sampleAnswers) {
        console.error("[App] initialBotMessage가 올바르게 정의되지 않았습니다. 초기화 중단.");
        await addMessage("초기 메시지를 불러올 수 없습니다. 관리자에게 문의하세요.", 'system');
        isLoadingBotResponse = false;
        setUIInteractions(false, false);
        if(messageInput) messageInput.disabled = false;
        if(moreOptionsBtn) moreOptionsBtn.disabled = false;
        return;
    }

    try {
        // action 필드 없이이 initialBotMessage.text만 사용
        await addMessage(initialBotMessage.text, 'bot');
        updateSampleAnswers(initialBotMessage.sampleAnswers);
    } catch (error) {
        console.error("[App] 초기 메시지 표시 중 오류:", error);
        await addMessage("초기 메시지를 표시하는 중 오류가 발생했습니다.", "system");
    }

    isLoadingBotResponse = false;
    setUIInteractions(false, false);
    if(messageInput) {
        messageInput.disabled = false;
        sendBtn.disabled = messageInput.value.trim() === '';
    }
    if(moreOptionsBtn) moreOptionsBtn.disabled = false;


    console.log("[App] 초기화 완료.");
}

    initializeChat();
});