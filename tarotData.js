// tarotData.js

// 전역 변수로 타로 카드 데이터 객체 선언
const TAROT_CARD_DATA = {
    "major_00_fool_upright": {
        name: "메이저 0번 바보 (정방향)",
        description: "새로운 시작, 모험, 순수함, 무한한 가능성, 즉흥성."
    },
    "major_01_magician_upright": {
        name: "메이저 1번 마법사 (정방향)",
        description: "창조력, 의지력, 재능, 기회 활용, 능숙함."
    },
    "major_02_high_priestess_upright": {
        name: "메이저 2번 여사제 (정방향)",
        description: "직관, 비밀, 무의식, 지혜, 내적 성찰."
    },
    "major_03_empress_upright": {
        name: "메이저 3번 여황제 (정방향)",
        description: "풍요, 모성애, 아름다움, 창조, 관능."
    },
    "major_04_emperor_upright": {
        name: "메이저 4번 황제 (정방향)",
        description: "권위, 통제, 리더십, 안정, 아버지상."
    },
    "major_05_hierophant_upright": {
        name: "메이저 5번 교황 (정방향)",
        description: "전통, 교육, 신념, 제도, 정신적 스승."
    },
    "major_06_lovers_upright": {
        name: "메이저 6번 연인 (정방향)",
        description: "사랑, 관계, 선택, 조화, 결합."
    },
    "major_07_chariot_upright": {
        name: "메이저 7번 전차 (정방향)",
        description: "승리, 의지, 통제, 전진, 결단력."
    },
    "major_08_justice_upright": {
        name: "메이저 8번 정의 (정방향)",
        description: "정의, 균형, 진실, 공정함, 법."
    },
    "major_09_hermit_upright": {
        name: "메이저 9번 은둔자 (정방향)",
        description: "고독, 성찰, 지혜, 내면 탐구, 안내자."
    },
    "major_10_wheel_upright": {
        name: "메이저 10번 운명의 수레바퀴 (정방향)",
        description: "운명, 변화, 전환점, 행운, 주기."
    },
    "major_11_strength_upright": {
        name: "메이저 11번 힘 (정방향)",
        description: "용기, 내면의 힘, 인내, 온화한 통제, 자신감."
    },
    "major_12_hanged_man_upright": {
        name: "메이저 12번 매달린 남자 (정방향)",
        description: "희생, 새로운 관점, 기다림, 깨달음, 내려놓음."
    },
    "major_13_death_upright": {
        name: "메이저 13번 죽음 (정방향)",
        description: "변화, 끝과 시작, 전환, 놓아줌, 변형."
    },
    "major_14_temperance_upright": {
        name: "메이저 14번 절제 (정방향)",
        description: "균형, 조화, 절제, 인내, 통합."
    },
    "major_15_devil_upright": {
        name: "메이저 15번 악마 (정방향)",
        description: "속박, 중독, 유혹, 물질주의, 부정적 패턴."
    },
    "major_16_tower_upright": {
        name: "메이저 16번 탑 (정방향)",
        description: "급격한 변화, 파괴, 각성, 예상치 못한 사건, 계시."
    },
    "major_17_star_upright": {
        name: "메이저 17번 별 (정방향)",
        description: "희망, 영감, 치유, 평온, 믿음."
    },
    "major_18_moon_upright": {
        name: "메이저 18번 달 (정방향)",
        description: "환상, 불안, 무의식, 직관, 혼란."
    },
    "major_19_sun_upright": {
        name: "메이저 19번 태양 (정방향)",
        description: "성공, 기쁨, 활력, 명확성, 낙천주의."
    },
    "major_20_judgement_upright": {
        name: "메이저 20번 심판 (정방향)",
        description: "부활, 심판, 깨달음, 새로운 시작, 용서."
    },
    "major_21_world_upright": {
        name: "메이저 21번 세계 (정방향)",
        description: "완성, 성취, 통합, 여행, 성공적인 마무리."
    },
    "wands_01_ace_upright": {
        name: "완드 에이스 (정방향)",
        description: "새로운 열정, 창의적인 시작, 영감, 성장 가능성."
    },
    "wands_02_two_upright": {
        name: "완드 2번 (정방향)",
        description: "미래 계획, 결정, 파트너십, 잠재력 발견."
    },
    "wands_03_three_upright": {
        name: "완드 3번 (정방향)",
        description: "확장, 해외 진출, 장기적 비전, 기회 기다림."
    },
    "wands_04_four_upright": {
        name: "완드 4번 (정방향)",
        description: "축하, 안정, 가정, 조화로운 관계."
    },
    "wands_05_five_upright": {
        name: "완드 5번 (정방향)",
        description: "경쟁, 갈등, 도전, 다양한 의견."
    },
    "wands_06_six_upright": {
        name: "완드 6번 (정방향)",
        description: "승리, 인정, 성공, 대중의 지지."
    },
    "wands_07_seven_upright": {
        name: "완드 7번 (정방향)",
        description: "방어, 도전, 용기, 자신의 입장 고수."
    },
    "wands_08_eight_upright": {
        name: "완드 8번 (정방향)",
        description: "빠른 진행, 소식, 행동, 여행."
    },
    "wands_09_nine_upright": {
        name: "완드 9번 (정방향)",
        description: "끈기, 방어적 태세, 마지막 노력, 회복력."
    },
    "wands_10_ten_upright": {
        name: "완드 10번 (정방향)",
        description: "부담, 책임감, 과로, 노력의 결실."
    },
    "wands_11_page_upright": {
        name: "완드 페이지 (정방향)",
        description: "새로운 아이디어, 열정적인 젊은이, 영감, 탐구."
    },
    "wands_12_knight_upright": {
        name: "완드 나이트 (정방향)",
        description: "행동력, 열정, 모험, 자신감 넘치는 돌진."
    },
    "wands_13_queen_upright": {
        name: "완드 퀸 (정방향)",
        description: "자신감, 독립심, 열정적 리더십, 매력."
    },
    "wands_14_king_upright": {
        name: "완드 킹 (정방향)",
        description: "비전, 리더십, 창의성, 카리스마, 통제력."
    },
    "cups_01_ace_upright": {
        name: "컵 에이스 (정방향)",
        description: "새로운 감정, 사랑의 시작, 창의성, 정서적 만족."
    },
    "cups_02_two_upright": {
        name: "컵 2번 (정방향)",
        description: "파트너십, 사랑, 조화, 상호 존중."
    },
    "cups_03_three_upright": {
        name: "컵 3번 (정방향)",
        description: "축하, 우정, 공동체, 즐거운 모임."
    },
    "cups_04_four_upright": {
        name: "컵 4번 (정방향)",
        description: "권태, 무관심, 성찰, 새로운 기회 간과."
    },
    "cups_05_five_upright": {
        name: "컵 5번 (정방향)",
        description: "상실, 슬픔, 후회, 부정적인 것에 집중."
    },
    "cups_06_six_upright": {
        name: "컵 6번 (정방향)",
        description: "추억, 순수함, 과거의 영향, 선물."
    },
    "cups_07_seven_upright": {
        name: "컵 7번 (정방향)",
        description: "선택지, 환상, 상상력, 비현실적 기대."
    },
    "cups_08_eight_upright": {
        name: "컵 8번 (정방향)",
        description: "떠남, 포기, 새로운 길 모색, 정서적 전환."
    },
    "cups_09_nine_upright": {
        name: "컵 9번 (정방향)",
        description: "소원 성취, 만족, 행복, 감사의 마음."
    },
    "cups_10_ten_upright": {
        name: "컵 10번 (정방향)",
        description: "가정의 행복, 정서적 안정, 조화, 완성된 사랑."
    },
    "cups_11_page_upright": {
        name: "컵 페이지 (정방향)",
        description: "새로운 감정의 시작, 창의적 아이디어, 감수성, 직관적 메시지."
    },
    "cups_12_knight_upright": {
        name: "컵 나이트 (정방향)",
        description: "로맨스, 매력, 감정적 제안, 몽상가."
    },
    "cups_13_queen_upright": {
        name: "컵 퀸 (정방향)",
        description: "공감 능력, 직관, 따뜻함, 감정적 지지."
    },
    "cups_14_king_upright": {
        name: "컵 킹 (정방향)",
        description: "감정적 성숙, 자비, 외교술, 평화로움."
    },
    "swords_01_ace_upright": {
        name: "소드 에이스 (정방향)",
        description: "새로운 아이디어, 진실, 명확성, 정신적 돌파구."
    },
    "swords_02_two_upright": {
        name: "소드 2번 (정방향)",
        description: "결정 유보, 교착 상태, 평화 유지, 내적 갈등."
    },
    "swords_03_three_upright": {
        name: "소드 3번 (정방향)",
        description: "슬픔, 상실, 마음의 상처, 고통스러운 진실."
    },
    "swords_04_four_upright": {
        name: "소드 4번 (정방향)",
        description: "휴식, 회복, 명상, 재충전."
    },
    "swords_05_five_upright": {
        name: "소드 5번 (정방향)",
        description: "갈등, 패배, 이기적인 승리, 불명예."
    },
    "swords_06_six_upright": {
        name: "소드 6번 (정방향)",
        description: "과도기, 슬픔 뒤의 평화, 이동, 문제 해결."
    },
    "swords_07_seven_upright": {
        name: "소드 7번 (정방향)",
        description: "기만, 속임수, 전략, 혼자만의 행동."
    },
    "swords_08_eight_upright": {
        name: "소드 8번 (정방향)",
        description: "제한, 속박, 무력감, 자기 구속."
    },
    "swords_09_nine_upright": {
        name: "소드 9번 (정방향)",
        description: "불안, 악몽, 걱정, 절망."
    },
    "swords_10_ten_upright": {
        name: "소드 10번 (정방향)",
        description: "파멸, 고통스러운 끝, 배신, 바닥."
    },
    "swords_11_page_upright": {
        name: "소드 페이지 (정방향)",
        description: "호기심, 새로운 소식, 진실 탐구, 날카로운 정신."
    },
    "swords_12_knight_upright": {
        name: "소드 나이트 (정방향)",
        description: "단호함, 야망, 빠른 행동, 논리적 접근."
    },
    "swords_13_queen_upright": {
        name: "소드 퀸 (정방향)",
        description: "지성, 독립심, 공정함, 명확한 판단."
    },
    "swords_14_king_upright": {
        name: "소드 킹 (정방향)",
        description: "권위, 지성, 진실, 정의로운 판단."
    },
    "pentacles_01_ace_upright": {
        name: "펜타클 에이스 (정방향)",
        description: "새로운 기회, 물질적 시작, 번영, 안정."
    },
    "pentacles_02_two_upright": {
        name: "펜타클 2번 (정방향)",
        description: "균형, 유연성, 다중 작업, 우선순위 조정."
    },
    "pentacles_03_three_upright": {
        name: "펜타클 3번 (정방향)",
        description: "팀워크, 협력, 기술, 숙련도."
    },
    "pentacles_04_four_upright": {
        name: "펜타클 4번 (정방향)",
        description: "소유욕, 안정 추구, 절약, 통제."
    },
    "pentacles_05_five_upright": {
        name: "펜타클 5번 (정방향)",
        description: "궁핍, 고립, 어려움, 도움 필요."
    },
    "pentacles_06_six_upright": {
        name: "펜타클 6번 (정방향)",
        description: "관대함, 나눔, 자선, 균형 잡힌 분배."
    },
    "pentacles_07_seven_upright": {
        name: "펜타클 7번 (정방향)",
        description: "인내, 장기적 투자, 평가, 결실 기다림."
    },
    "pentacles_08_eight_upright": {
        name: "펜타클 8번 (정방향)",
        description: "기술 연마, 노력, 집중, 숙련."
    },
    "pentacles_09_nine_upright": {
        name: "펜타클 9번 (정방향)",
        description: "자립, 풍요, 만족, 독립적 성공."
    },
    "pentacles_10_ten_upright": {
        name: "펜타클 10번 (정방향)",
        description: "부, 가족의 유산, 안정, 지속적인 번영."
    },
    "pentacles_11_page_upright": {
        name: "펜타클 페이지 (정방향)",
        description: "실용적 기회, 학구열, 새로운 기술 습득, 근면함."
    },
    "pentacles_12_knight_upright": {
        name: "펜타클 나이트 (정방향)",
        description: "책임감, 근면, 신뢰성, 꾸준한 노력."
    },
    "pentacles_13_queen_upright": {
        name: "펜타클 퀸 (정방향)",
        description: "현실 감각, 자애로움, 풍요, 안정적인 지원."
    },
    "pentacles_14_king_upright": {
        name: "펜타클 킹 (정방향)",
        description: "사업적 성공, 안정, 부, 현실적인 리더십."
    },
    "major_00_fool_reversed": {
        name: "메이저 0번 바보 (역방향)",
        description: "무모함, 부주의, 어리석은 선택, 책임감 부족, 혼란."
    },
    "major_01_magician_reversed": {
        name: "메이저 1번 마법사 (역방향)",
        description: "기만, 속임수, 재능 낭비, 의지력 부족, 조작."
    },
    "major_02_high_priestess_reversed": {
        name: "메이저 2번 여사제 (역방향)",
        description: "비밀 누설, 직관 무시, 피상적임, 숨겨진 문제."
    },
    "major_03_empress_reversed": {
        name: "메이저 3번 여황제 (역방향)",
        description: "창의력 막힘, 의존성, 불균형, 과잉보호."
    },
    "major_04_emperor_reversed": {
        name: "메이저 4번 황제 (역방향)",
        description: "독재, 통제력 상실, 무책임, 경직됨."
    },
    "major_05_hierophant_reversed": {
        name: "메이저 5번 교황 (역방향)",
        description: "관습 타파, 비전통적, 자유, 규칙 위반."
    },
    "major_06_lovers_reversed": {
        name: "메이저 6번 연인 (역방향)",
        description: "불화, 잘못된 선택, 관계의 어려움, 갈등."
    },
    "major_07_chariot_reversed": {
        name: "메이저 7번 전차 (역방향)",
        description: "방향성 상실, 통제 불능, 좌절, 무모한 돌진."
    },
    "major_08_justice_reversed": {
        name: "메이저 8번 정의 (역방향)",
        description: "불공정, 편견, 부정, 책임 회피."
    },
    "major_09_hermit_reversed": {
        name: "메이저 9번 은둔자 (역방향)",
        description: "고립, 외로움, 성찰 부족, 회피."
    },
    "major_10_wheel_reversed": {
        name: "메이저 10번 운명의 수레바퀴 (역방향)",
        description: "불운, 저항, 정체, 예상치 못한 방해."
    },
    "major_11_strength_reversed": {
        name: "메이저 11번 힘 (역방향)",
        description: "나약함, 자신감 부족, 두려움, 억압된 힘."
    },
    "major_12_hanged_man_reversed": {
        name: "메이저 12번 매달린 남자 (역방향)",
        description: "무의미한 희생, 정체, 저항, 완고함."
    },
    "major_13_death_reversed": {
        name: "메이저 13번 죽음 (역방향)",
        description: "변화에 대한 저항, 정체, 두려움, 과거에 얽매임."
    },
    "major_14_temperance_reversed": {
        name: "메이저 14번 절제 (역방향)",
        description: "불균형, 극단, 과도함, 조급함."
    },
    "major_15_devil_reversed": {
        name: "메이저 15번 악마 (역방향)",
        description: "속박에서 벗어남, 자유, 유혹 극복, 자각."
    },
    "major_16_tower_reversed": {
        name: "메이저 16번 탑 (역방향)",
        description: "재앙 회피, 변화의 두려움, 내부적 혼란, 점진적 변화."
    },
    "major_17_star_reversed": {
        name: "메이저 17번 별 (역방향)",
        description: "절망, 희망 상실, 불신, 영감 부족."
    },
    "major_18_moon_reversed": {
        name: "메이저 18번 달 (역방향)",
        description: "두려움 극복, 혼란 해소, 숨겨진 진실 발견, 명확성."
    },
    "major_19_sun_reversed": {
        name: "메이저 19번 태양 (역방향)",
        description: "일시적 좌절, 비관주의, 자신감 부족, 불분명함."
    },
    "major_20_judgement_reversed": {
        name: "메이저 20번 심판 (역방향)",
        description: "자기비판, 후회, 기회 놓침, 과거에 얽매임."
    },
    "major_21_world_reversed": {
        name: "메이저 21번 세계 (역방향)",
        description: "미완성, 정체, 부족함, 다음 단계로 나아가지 못함."
    },
    "wands_01_ace_reversed": {
        name: "완드 에이스 (역방향)",
        description: "시작의 어려움, 의욕 상실, 방향성 부족, 지연."
    },
    "wands_02_two_reversed": {
        name: "완드 2번 (역방향)",
        description: "결정 장애, 계획 부족, 불안, 선택의 기로."
    },
    "wands_03_three_reversed": {
        name: "완드 3번 (역방향)",
        description: "지연, 계획 차질, 해외 문제, 실망."
    },
    "wands_04_four_reversed": {
        name: "완드 4번 (역방향)",
        description: "불안정, 축하 부족, 가정 불화, 환영받지 못함."
    },
    "wands_05_five_reversed": {
        name: "완드 5번 (역방향)",
        description: "갈등 회피, 내부적 다툼, 긴장 완화, 타협."
    },
    "wands_06_six_reversed": {
        name: "완드 6번 (역방향)",
        description: "실패, 인정받지 못함, 오만함, 지연된 성공."
    },
    "wands_07_seven_reversed": {
        name: "완드 7번 (역방향)",
        description: "압도됨, 포기, 자신감 상실, 방어 실패."
    },
    "wands_08_eight_reversed": {
        name: "완드 8번 (역방향)",
        description: "지연, 좌절, 잘못된 방향, 정체."
    },
    "wands_09_nine_reversed": {
        name: "완드 9번 (역방향)",
        description: "피로, 포기 직전, 방어벽 붕괴, 완고함."
    },
    "wands_10_ten_reversed": {
        name: "완드 10번 (역방향)",
        description: "부담 내려놓음, 책임 회피, 과로 해소, 포기."
    },
    "wands_11_page_reversed": {
        name: "완드 페이지 (역방향)",
        description: "미숙함, 아이디어 부족, 나쁜 소식, 반항적임."
    },
    "wands_12_knight_reversed": {
        name: "완드 나이트 (역방향)",
        description: "무모함, 조급함, 좌절, 방향성 없는 행동."
    },
    "wands_13_queen_reversed": {
        name: "완드 퀸 (역방향)",
        description: "공격성, 질투, 불안정, 통제욕."
    },
    "wands_14_king_reversed": {
        name: "완드 킹 (역방향)",
        description: "독단적, 편협함, 무자비함, 리더십 부족."
    },
    "cups_01_ace_reversed": {
        name: "컵 에이스 (역방향)",
        description: "감정 억압, 사랑의 어려움, 창의력 막힘, 공허함."
    },
    "cups_02_two_reversed": {
        name: "컵 2번 (역방향)",
        description: "불화, 오해, 관계의 어려움, 조화롭지 못함."
    },
    "cups_03_three_reversed": {
        name: "컵 3번 (역방향)",
        description: "과도한 사교, 고립, 축하 취소, 소외감."
    },
    "cups_04_four_reversed": {
        name: "컵 4번 (역방향)",
        description: "새로운 시작, 권태 극복, 기회 포착, 동기 부여."
    },
    "cups_05_five_reversed": {
        name: "컵 5번 (역방향)",
        description: "과거 극복, 긍정적 전환, 용서, 새로운 희망."
    },
    "cups_06_six_reversed": {
        name: "컵 6번 (역방향)",
        description: "과거에 얽매임, 미성숙함, 현실 도피, 향수병."
    },
    "cups_07_seven_reversed": {
        name: "컵 7번 (역방향)",
        description: "현실 직시, 환상에서 벗어남, 결단력, 명확한 선택."
    },
    "cups_08_eight_reversed": {
        name: "컵 8번 (역방향)",
        description: "두려움 때문에 머무름, 정체, 미련, 회피."
    },
    "cups_09_nine_reversed": {
        name: "컵 9번 (역방향)",
        description: "불만족, 탐욕, 소원 불성취, 물질적 집착."
    },
    "cups_10_ten_reversed": {
        name: "컵 10번 (역방향)",
        description: "가정 불화, 정서적 불안정, 깨진 약속, 불행."
    },
    "cups_11_page_reversed": {
        name: "컵 페이지 (역방향)",
        description: "감정적 미숙함, 상상력 부족, 슬픈 소식, 자기 연민."
    },
    "cups_12_knight_reversed": {
        name: "컵 나이트 (역방향)",
        description: "변덕, 기만, 감정적 불안정, 비현실적 기대."
    },
    "cups_13_queen_reversed": {
        name: "컵 퀸 (역방향)",
        description: "감정 과잉, 의존성, 불안, 변덕스러움."
    },
    "cups_14_king_reversed": {
        name: "컵 킹 (역방향)",
        description: "감정적 조작, 냉담함, 불안정, 변덕."
    },
    "swords_01_ace_reversed": {
        name: "소드 에이스 (역방향)",
        description: "혼란, 잘못된 판단, 아이디어 부족, 진실 왜곡."
    },
    "swords_02_two_reversed": {
        name: "소드 2번 (역방향)",
        description: "결정의 압박, 정보 부족, 거짓된 평화, 갈등 심화."
    },
    "swords_03_three_reversed": {
        name: "소드 3번 (역방향)",
        description: "고통 극복, 치유, 용서, 긍정적 변화."
    },
    "swords_04_four_reversed": {
        name: "소드 4번 (역방향)",
        description: "정체, 고립, 회복 지연, 강제된 휴식."
    },
    "swords_05_five_reversed": {
        name: "소드 5번 (역방향)",
        description: "갈등 해소, 화해, 용서, 평화로운 해결."
    },
    "swords_06_six_reversed": {
        name: "소드 6번 (역방향)",
        description: "정체, 이동의 어려움, 과거에 발목 잡힘, 문제 미해결."
    },
    "swords_07_seven_reversed": {
        name: "소드 7번 (역방향)",
        description: "정직, 조언 구함, 죄책감, 비밀 폭로."
    },
    "swords_08_eight_reversed": {
        name: "소드 8번 (역방향)",
        description: "자유, 제약 극복, 자기 해방, 새로운 관점."
    },
    "swords_09_nine_reversed": {
        name: "소드 9번 (역방향)",
        description: "희망, 두려움 극복, 도움 요청, 현실 직시."
    },
    "swords_10_ten_reversed": {
        name: "소드 10번 (역방향)",
        description: "회복, 최악의 상황 종료, 새로운 시작, 희망."
    },
    "swords_11_page_reversed": {
        name: "소드 페이지 (역방향)",
        description: "비판적, 냉소적, 나쁜 소식, 의심 많음."
    },
    "swords_12_knight_reversed": {
        name: "소드 나이트 (역방향)",
        description: "공격성, 충동적, 무모함, 잔인함."
    },
    "swords_13_queen_reversed": {
        name: "소드 퀸 (역방향)",
        description: "냉정함, 비판적, 편협함, 고독."
    },
    "swords_14_king_reversed": {
        name: "소드 킹 (역방향)",
        description: "독재적, 냉혹함, 권력 남용, 비판적."
    },
    "pentacles_01_ace_reversed": {
        name: "펜타클 에이스 (역방향)",
        description: "기회 상실, 재정적 어려움, 불안정, 잘못된 투자."
    },
    "pentacles_02_two_reversed": {
        name: "펜타클 2번 (역방향)",
        description: "불균형, 관리 소홀, 재정적 스트레스, 무모함."
    },
    "pentacles_03_three_reversed": {
        name: "펜타클 3번 (역방향)",
        description: "협력 부족, 낮은 기술 수준, 계획 부족, 질 낮은 작업."
    },
    "pentacles_04_four_reversed": {
        name: "펜타클 4번 (역방향)",
        description: "낭비, 불안정, 탐욕, 변화에 대한 두려움."
    },
    "pentacles_05_five_reversed": {
        name: "펜타클 5번 (역방향)",
        description: "회복, 도움 수용, 고립 탈출, 긍정적 변화."
    },
    "pentacles_06_six_reversed": {
        name: "펜타클 6번 (역방향)",
        description: "빚, 불균형한 관계, 이기심, 부당한 대우."
    },
    "pentacles_07_seven_reversed": {
        name: "펜타클 7번 (역방향)",
        description: "조급함, 투자 실패, 노력 부족, 실망."
    },
    "pentacles_08_eight_reversed": {
        name: "펜타클 8번 (역방향)",
        description: "게으름, 낮은 질, 단기적 집중, 실력 부족."
    },
    "pentacles_09_nine_reversed": {
        name: "펜타클 9번 (역방향)",
        description: "재정적 의존, 불안정, 외로움, 과소비."
    },
    "pentacles_10_ten_reversed": {
        name: "펜타클 10번 (역방향)",
        description: "재정적 손실, 가족 분쟁, 불안정, 전통 파괴."
    },
    "pentacles_11_page_reversed": {
        name: "펜타클 페이지 (역방향)",
        description: "실용성 부족, 게으름, 나쁜 소식(재정), 학습 의욕 저하."
    },
    "pentacles_12_knight_reversed": {
        name: "펜타클 나이트 (역방향)",
        description: "나태함, 무책임, 정체, 신뢰성 부족."
    },
    "pentacles_13_queen_reversed": {
        name: "펜타클 퀸 (역방향)",
        description: "물질주의, 불안정, 질투, 자기 관리 소홀."
    },
    "pentacles_14_king_reversed": {
        name: "펜타클 킹 (역방향)",
        description: "탐욕, 부패, 무능함, 불안정한 사업가."
    }
};


// 모든 카드 ID에 대한 데이터가 있는지 확인하는 로직 (개발 중 유용)
// 실제 프로덕션에서는 제거하거나 조건부로 실행할 수 있습니다.
/*
if (typeof ALL_TAROT_CARD_IDS !== 'undefined') { // script.js가 먼저 로드되었을 경우를 대비 (보통은 tarotData.js가 먼저)
    ALL_TAROT_CARD_IDS.forEach(id => {
        if (!TAROT_CARD_DATA[id]) {
            console.warn(`[tarotData.js] Missing data for card ID: ${id}. Please add its name and description.`);
            // 기본값이라도 넣어주려면:
            // TAROT_CARD_DATA[id] = { name: id.replace(/_/g, ' '), description: "설명 없음" };
        }
    });
} else {
    // 이 파일이 ALL_TAROT_CARD_IDS 정의보다 먼저 로드될 경우, script.js에서 확인 필요
}
*/