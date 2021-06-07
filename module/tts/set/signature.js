
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
    }
];
var sncheckobj = {};
for (i in snobj) {
    var obj = snobj[i];
    for (j in obj.name) {
        sncheckobj[obj.name[j]] = obj.url;
    }
}

module.exports = sncheckobj;
