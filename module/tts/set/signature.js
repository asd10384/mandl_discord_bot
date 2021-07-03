
const snobj = [
    {
        name: [
            'ㅋㅋㄹㅃㅃ',
            'ㅋㅋ루삥뽕',
            'ㅋㅋ뤀삥뽕',
            '쿠쿠뤀삥뽕',
            '쿠쿠루삥뽕'
        ],
        url: '찬구/ㅋㅋ뤀삥뽕'
    },
    {
        name: [
            '멈춰',
            '멈춰!'
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
            '무야호!',
            '무 야호',
            '무 야호!',
            '무야호~',
            '무 야호~'
        ],
        url: '무야호'
    },
    {
        name: [
            '자드가자',
            '자드가자!',
            '자 드가자',
            '자 드가자!',
            '자드가자~',
            '자 드가자~'
        ],
        url: '자드가자'
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
