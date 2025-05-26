// nebulas.js
const ALL_NEBULAS = {
    "루미네시아": {
        nameKor: "루미네시아 성운",
        nameEng: "Luminesia Nebula",
        cardName: "luminesia",
        memberSyncTypes: ["공감가", "성찰가"],
        tendency: "감정, 내면 성찰, 공감과 위로",
        description: "루미네시아 성운은 깊은 감정의 바다를 유영하며 내면의 빛을 밝히는 곳입니다. 이 성운에 속한 당신은 타인의 슬픔과 기쁨에 섬세하게 공명하고, 내면의 소리에 귀 기울이는 심연의 별빛 같은 존재입니다. 당신의 깊은 이해심과 따뜻함은 주변에 안정과 위로를 가져다줍니다.",
        characteristics: "깊은 공감 능력, 섬세한 감수성, 내면 성찰적 태도",
        Neuroticism: "3", // 척도: 신경성↓ (매우 안정적, 고요)
        Extraversion: "4", // 척도: 내향성↑ (매우 내향적, 성찰)
        Openness: "12", // 내면 성찰, 새로운 감정적 깊이 탐색
        Agreeableness: "18", // 공감, 위로 - 매우 우호적
        Conscientiousness: "10" // 성찰적이지만, 외부적 성실성과는 다소 거리가 있을 수 있음
    },
    "이그니티오": {
        nameKor: "이그니티오 성운",
        nameEng: "Ignitio Nebula",
        cardName: "ignitio",
        memberSyncTypes: ["열정가", "개척자"],
        tendency: "열정, 도전, 창조적 에너지",
        description: "이그니티오 성운은 타오르는 불꽃처럼 내면의 열정과 직관을 따라 거침없이 나아가는 이들이 모인 곳입니다. 이 성운에 속한 당신은 새로운 가능성을 창조하고 세상을 뜨겁게 달구며, 당신의 도전 정신은 주변에 강력한 영감과 활력을 불어넣습니다.",
        characteristics: "넘치는 열정, 대담한 도전 정신, 창의적 에너지",
        Neuroticism: "8", // 도전에는 어느 정도 스트레스 감내가 필요하지만, 긍정적 에너지로 극복
        Extraversion: "18", // 척도: 외향성↑ (매우 외향적, 열정)
        Openness: "17", // 척도: 개방성↑ (매우 개방적, 새로운 도전, 창조)
        Agreeableness: "10", // 목표 지향적일 수 있어 평균 수준
        Conscientiousness: "13" // 목표 달성을 위한 추진력
    },
    "카스텔라리스": {
        nameKor: "카스텔라리스 성운",
        nameEng: "Castellaris Nebula",
        cardName: "castellaris",
        memberSyncTypes: ["수호자", "원칙주의자"],
        tendency: "책임감, 원칙 준수, 신념 수호",
        description: "카스텔라리스 성운은 강철 심장으로 원칙과 신념을 지키는 수호자들이 모인 곳입니다. 이 성운에 속한 당신은 불굴의 의지와 책임감으로 소중한 것을 지키고, 정의와 질서를 굳건히 세우는 든든한 기둥과 같은 존재입니다. 당신의 헌신은 공동체에 안정과 신뢰를 가져다줍니다.",
        characteristics: "강한 책임감, 확고한 원칙, 헌신적인 보호 성향",
        Neuroticism: "5", // 강인함, 쉽게 흔들리지 않음
        Extraversion: "6", // 척도: 내향성↑ (내향적, 묵묵함, 수호)
        Openness: "7", // 원칙 중시, 변화보다는 안정 선호
        Agreeableness: "11", // 공동체 보호는 하지만, 원칙에 어긋나면 타협하지 않을 수 있음
        Conscientiousness: "19" // 척도: 성실성↑ (매우 성실하고 책임감 강함)
    },
    "크로니카": {
        nameKor: "크로니카 성운",
        nameEng: "Chronica Nebula",
        cardName: "chronica",
        memberSyncTypes: ["사색가", "기록자"],
        tendency: "지혜 탐구, 깊은 사색, 역사와 기록",
        description: "크로니카 성운은 시간의 지혜를 기록하고 성찰하는 이들이 모여있는 곳입니다. 이 성운에 속한 당신은 과거의 지혜를 배우고 현재를 성찰하며 미래를 조망하는 깊이 있는 통찰력을 지니고 있습니다. 당신의 지혜는 세상에 깊이와 의미를 더합니다.",
        characteristics: "깊이 있는 통찰력, 지적 탐구심, 역사와 전통 중시",
        Neuroticism: "6", // 내적 성찰이 깊으나, 안정적인 편
        Extraversion: "5", // 척도: 내향성↑ (매우 내향적, 조용한 사색, 기록)
        Openness: "16", // 지혜 탐구, 새로운 지식에 대한 개방성
        Agreeableness: "9", // 객관적 사실, 지혜 중시, 때로는 비판적일 수 있음
        Conscientiousness: "17" // 척도: 성실성↑ (기록, 탐구에 대한 성실함)
    },
    "코넥서스": {
        nameKor: "코넥서스 성운",
        nameEng: "Conexus Nebula",
        cardName: "conexus",
        memberSyncTypes: ["연결자", "조력가"],
        tendency: "관계 형성, 긍정적 연결, 상호 성장",
        description: "코넥서스 성운은 관계의 연결고리가 되어 긍정 에너지로 세상을 밝히는 이들이 모인 곳입니다. 이 성운에 속한 당신은 타인의 가능성을 발견하고 성장을 도우며, 따뜻한 마음으로 사람들을 하나로 묶습니다. 당신의 존재는 주변에 활기와 긍정적인 분위기를 만듭니다.",
        characteristics: "뛰어난 공감 능력, 긍정적 사교성, 관계 중심적 사고",
        Neuroticism: "7", // 타인 감정에 민감할 수 있지만, 긍정적으로 해소
        Extraversion: "17", // 척도: 외향성↑ (매우 외향적, 사람들과 어울림, 연결)
        Openness: "11", // 새로운 관계, 사람에 대한 개방성
        Agreeableness: "19", // 척도: 우호성↑ (매우 우호적, 타인 배려, 공감)
        Conscientiousness: "10" // 관계 유지는 중요하지만, 체계성보다는 유연성
    },
    "에오루스": {
        nameKor: "에오루스 성운",
        nameEng: "Aeolus Nebula",
        cardName: "aeolus",
        memberSyncTypes: ["모험가", "자유영혼"],
        tendency: "자유 추구, 변화와 모험, 새로운 경험",
        description: "에오루스 성운은 자유로운 바람처럼 변화와 모험을 즐기는 이들이 모인 곳입니다. 이 성운에 속한 당신은 정해진 틀과 규칙에 얽매이지 않고, 새로운 경험을 찾아 세상을 누빕니다. 당신의 자유로운 영혼은 주변에 신선함과 예측 불가능한 즐거움을 선사합니다.",
        characteristics: "자유로운 사고방식, 변화에 대한 높은 수용성, 탐험 정신",
        Neuroticism: "9", // 변화는 스트레스를 동반할 수 있으나, 즐기는 편
        Extraversion: "16", // 척도: 외향성↑ (활동적, 새로운 만남 추구, 모험)
        Openness: "19", // 척도: 개방성↑ (매우 개방적, 모험과 새로움 추구, 자유)
        Agreeableness: "10", // 자신의 자유를 중시, 때로는 독립적
        Conscientiousness: "6" // 계획보다는 즉흥적, 자유분방함
    },
    "인퀴지토": {
        nameKor: "인퀴지토 성운",
        nameEng: "Inquisito Nebula",
        cardName: "inquisito",
        memberSyncTypes: ["탐구가", "분석가"],
        tendency: "진실 탐구, 논리적 분석, 객관적 판단",
        description: "인퀴지토 성운은 논리와 이성으로 진실을 파헤치는 탐구자들이 모인 곳입니다. 이 성운에 속한 당신은 거짓과 환상을 꿰뚫어보고, 명확한 분석과 객관적인 판단으로 세상의 본질을 이해하려 합니다. 당신의 날카로운 통찰력은 복잡한 문제 해결에 기여합니다.",
        characteristics: "뛰어난 분석력, 논리적 사고, 객관적 진실 추구",
        Neuroticism: "7", // 진실 탐구 과정의 스트레스, 그러나 이성으로 통제
        Extraversion: "8", // 독립적인 연구나 탐구를 선호할 수 있음
        Openness: "17", // 새로운 정보, 지식, 진실에 대한 강한 개방성
        Agreeableness: "5", // 척도: (낮은)우호성 (객관성과 진실을 우선, 때로는 직설적, 비판적)
        Conscientiousness: "18" // 척도: 성실성↑ (철저한 조사, 꼼꼼한 분석, 논리)
    },
    "움브라리스": {
        nameKor: "움브라리스 성운",
        nameEng: "Umbralis Nebula",
        cardName: "umbralis",
        memberSyncTypes: ["변혁가", "통찰가"],
        tendency: "내면의 어둠 직시, 고통을 통한 성장, 근본적 변화",
        description: "움브라리스 성운은 심연의 그림자 속에서 재탄생하는 변혁가들이 모인 곳입니다. 이 성운에 속한 당신은 자신의 어두운 면과 세상의 그림자를 직시하며, 고통과 혼돈 속에서 오히려 새로운 질서와 깊은 자기 이해를 창조합니다. 당신의 깊은 통찰은 근본적인 변화를 이끌어냅니다.",
        characteristics: "깊은 자기 성찰, 위기 극복 능력, 변화와 혁신 주도",
        Neuroticism: "16", // 척도: 신경성↑ (내적 갈등, 감정의 깊이, 고통, 어둠)
        Extraversion: "6", // 척도: 내향성↑ (깊은 내면 탐구, 재탄생)
        Openness: "15", // 고통스러운 경험으로부터 배우고 새로운 관점을 얻음
        Agreeableness: "8", // 개인의 변화와 성장에 집중, 사회적 조화보다는 진실 직시
        Conscientiousness: "11" // 변혁 과정에서 목표 지향적일 수 있음
    },
    "에퀼리브리아": {
        nameKor: "에퀼리브리아 성운",
        nameEng: "Equilibria Nebula",
        cardName: "equilibria",
        memberSyncTypes: ["중재자", "조화주의자"],
        tendency: "조화 추구, 균형 유지, 평화로운 공존",
        description: "에퀼리브리아 성운은 조화와 균형을 추구하며 평화를 지키는 이들이 모인 곳입니다. 이 성운에 속한 당신은 대립하는 요소들 사이에서 중재하며, 평화로운 공존과 상생의 길을 모색합니다. 당신의 존재는 갈등을 해소하고 안정과 조화를 가져옵니다.",
        characteristics: "뛰어난 중재 능력, 공정함과 균형 감각, 평화 지향적 태도",
        Neuroticism: "4", // 평화롭고 안정적인 정서
        Extraversion: "12", // 타인과의 관계에서 조화를 추구하나, 주도적이기보다 지원적
        Openness: "10", // 새로운 것보다는 안정과 조화를 중시
        Agreeableness: "18", // 척도: 우호성↑ (타협, 협조, 평화 유지에 매우 우호적, 조화)
        Conscientiousness: "16" // 척도: 성실성↑ (질서, 규칙, 균형 유지를 위한 노력)
    },
    "크레아티오": {
        nameKor: "크레아티오 성운",
        nameEng: "Creatio Nebula",
        cardName: "creatio",
        memberSyncTypes: ["창조자", "혁신가"],
        tendency: "창의적 발상, 상상력 실현, 혁신과 새로움",
        description: "크레아티오 성운은 무한한 상상력으로 새로운 세계를 창조하는 이들이 모인 곳입니다. 이 성운에 속한 당신은 독창적인 아이디어로 현실의 경계를 넘어 새로운 가능성을 열어갑니다. 당신의 창의성은 세상에 아름다움과 혁신을 불어넣습니다.",
        characteristics: "풍부한 상상력, 독창적인 아이디어, 예술적 감각",
        Neuroticism: "9", // 창작 과정의 예민함, 그러나 대체로 긍정적
        Extraversion: "15", // 척도: 외향성↑ (아이디어 표현, 공유, 협업, 창조)
        Openness: "20", // 척도: 개방성↑ (상상력, 새로움, 혁신에 대한 극도의 개방성)
        Agreeableness: "11", // 아이디어에 대한 열정, 때로는 타협보다 고집
        Conscientiousness: "10" // 아이디어를 구체화하는 과정에서는 성실함이 필요하나, 자유로운 발상을 더 중시
    },
    "실바니스": {
        nameKor: "실바니스 성운",
        nameEng: "Silvanis Nebula",
        cardName: "silvanis",
        memberSyncTypes: ["성찰가", "자연주의자"],
        tendency: "자연과의 교감, 내면의 평화, 고요한 성찰",
        description: "실바니스 성운은 자연 속에서 고요한 성찰을 통해 평화를 찾는 이들이 모인 곳입니다. 이 성운에 속한 당신은 자연의 순리 속에서 내면의 목소리에 귀 기울이고, 고독 속에서 깊은 사색을 통해 자아를 탐구합니다. 당신의 평온함은 주변에 안정과 치유를 전합니다.",
        characteristics: "자연 친화적, 깊은 내적 평온함, 성찰적 태도",
        Neuroticism: "2", // 척도: (낮은)신경성 (매우 안정적, 평온함, 고요)
        Extraversion: "3", // 척도: 내향성↑ (매우 내향적, 고독 선호, 성찰, 자연)
        Openness: "13", // 자연의 신비, 내면 세계 탐구에 대한 개방성
        Agreeableness: "14", // 온화하고 평화로우나, 깊은 관계보다는 독립적 평화
        Conscientiousness: "12" // 자신의 삶의 방식에 대한 성실함
    },
    "알비온 프라이머": {
        nameKor: "알비온 프라이머 성운",
        nameEng: "Albion Prima Nebula",
        cardName: "albion_prima",
        memberSyncTypes: ["탐험가", "몽상가"],
        tendency: "순수한 호기심, 새로운 시작, 무한한 가능성",
        description: "알비온 프라이머 성운은 순수한 호기심으로 새로운 시작을 맞이하는 이들이 모인 곳입니다. 이 성운에 속한 당신은 때묻지 않은 마음으로 세상을 바라보며, 모든 것에서 새로운 가능성과 배움을 발견합니다. 당신의 긍정적이고 열린 태도는 새로운 시작에 활력을 불어넣습니다.",
        characteristics: "순수한 호기심, 긍정적 사고방식, 새로운 것에 대한 열린 마음",
        Neuroticism: "6", // 새로운 시작에 대한 설렘과 약간의 불안이 공존하나 긍정적
        Extraversion: "14", // 새로운 사람, 경험에 대해 개방적이고 사교적
        Openness: "18", // 척도: 개방성↑ (새로운 경험, 학습에 매우 개방적, 호기심)
        Agreeableness: "16", // 척도: 우호성↑ (순수하고 긍정적인 태도로 타인에게 우호적)
        Conscientiousness: "9" // 새로운 시작에는 계획보다 즉흥성이 따를 수 있음
    }
};
