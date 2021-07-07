
const snobj = [
    {
        name: [
            'ㅋㅋㄹㅃㅃ',
            'ㅋㅋ루삥뽕',
            '쿠쿠루삥뽕'
        ],
        url: '찬구/ㅋㅋ뤀삥뽕'
    },
    {
        name: [
            '멈춰'
        ],
        url: '멈춰'
    },
    {
        name: [
            '나락'
        ],
        url: '나락'
    },
    {
        name: [
            '응아니야',
            '응 아니야'
        ],
        url: '응아니야'
    },
    {
        name: [
            '무야호',
            '무 야호'
        ],
        url: '무야호'
    },
    {
        name: [
            '자드가자',
            '자 드가자'
        ],
        url: '랄로/자드가자'
    },
    {
        name: [
            '마라탕'
        ],
        url: '랄로/마라탕'
    },
    {
        name: [
            '앙기모찌',
            '앙 기모찌',
            '앙기모띠',
            '앙 기모띠',
        ],
        url: '앙기모찌'
    },
    {
        name: [
            '아이고난',
            '아이고 난'
        ],
        url: '케인/아이고난'
    },
    {
        name: [
            '어허'
        ],
        url: '브베/어허'
    },
    {
        name: [
            '샤를르클레르',
            '샤를 르클레르'
        ],
        url: 'f1/샤를르클레르'
    },
    {
        name: [
            '대가리박고자살하자',
            '대가리박고 자살하자'
        ],
        url: '대가리박고자살하자'
    }
];
var sncheckobj = {};
for (i in snobj) {
    var obj = snobj[i];
    for (j in obj.name) {
        sncheckobj[obj.name[j]] = obj.url;
    }
}
const output = [
    sncheckobj,
    snobj
];

module.exports = output;
