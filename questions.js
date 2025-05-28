// questions.js

const QUESTIONS_DATA = {
    subjective: [
        { 
            id: "subj_01", 
            questionText: "최근 당신의 삶에서 가장 중요하다고 생각하는 가치는 무엇인가요? 그리고 그 이유는 무엇인가요?" 
        }
        // 필요하다면 여기에 더 많은 주관식 질문 추가
        // 예: { id: "subj_02", questionText: "당신이 가장 스트레스를 받는 상황은 언제이며, 어떻게 대처하나요?" }
    ],
    objective: [
        {
            id: "obj_01",
            questionText: "나는 새로운 환경이나 변화에 빠르게 적응하는 편입니다.",
            options: [
                { text: "전혀 그렇지 않다", score: 1 },
                { text: "그렇지 않다", score: 2 },
                { text: "보통이다", score: 3 },
                { text: "그렇다", score: 4 },
                { text: "매우 그렇다", score: 5 }
            ]
        },
        {
            id: "obj_02",
            questionText: "혼자 시간을 보내는 것보다 다른 사람들과 함께 어울리는 것을 더 선호합니다.",
            options: [
                { text: "전혀 그렇지 않다", score: 1 },
                { text: "그렇지 않다", score: 2 },
                { text: "보통이다", score: 3 },
                { text: "그렇다", score: 4 },
                { text: "매우 그렇다", score: 5 }
            ]
        },
        {
            id: "obj_03",
            questionText: "결정을 내릴 때 감정보다는 논리적인 분석을 우선시하는 경향이 있습니다.",
            options: [
                { text: "전혀 그렇지 않다", score: 1 },
                { text: "그렇지 않다", score: 2 },
                { text: "보통이다", score: 3 },
                { text: "그렇다", score: 4 },
                { text: "매우 그렇다", score: 5 }
            ]
        }
        // 필요하다면 여기에 더 많은 객관식 질문 추가
    ]
};

// MATCHING_CRITERIA 등 다른 데이터도 이 파일로 옮기거나,
// 별도의 data.js 등으로 분리하여 관리할 수 있습니다.
// 우선은 QUESTIONS_DATA만 분리합니다.

// 예시: MATCHING_CRITERIA (script.js에서 이쪽으로 옮겨도 됨)
/*
const MATCHING_CRITERIA = {
    NEBULAS: [
        { name: "루미네시아", Neuroticism: 3, Extraversion: 7, Openness: 8, Agreeableness: 6, Conscientiousness: 5 },
        { name: "크레아티오", Neuroticism: 5, Extraversion: 5, Openness: 9, Agreeableness: 4, Conscientiousness: 7 },
    ],
    SYNC_TYPES: [
        { name: "스텔라터틀", D: 3, I: 5, S: 8, C: 6 },
        { name: "인터스텔라캣", D: 7, I: 8, S: 3, C: 4 },
    ]
};
*/