
require('dotenv').config();
const { User, Message } = require('discord.js');
const { Schema, model, models, connect } = require('mongoose');
const log = require('../log/log');
const map = new Map();
connect(process.env.mongourl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const out = {
    module: {
        user: module_user,
        server: module_server,
        patchnote: module_patchnote,
        mandl: module_mandl,
    },
    set: {
        user: set_user,
        server: set_server,
    },
    object: {
        user: {
            name: String,
            userID: String,
            tts: Boolean,
            ttsnomove: Boolean,
            selfcheck: {
                area: String,
                school: String,
                name: String,
                birthday: String,
                password: String,
            },
        },
        server: {
            serverid: String,
            name: String,
            quiz: {
                qzchannelid: String,
                vcid: String,
                user: {
                    hint: Array,
                    skip: Array,
                },
                anser: {
                    time: Number,
                    imgtime: Number,
                },
                msg: {
                    listid: String,
                    npid: String,
                    scoreid: String,
                },
                quiz: {
                    format: String,
                    name: Array,
                    vocal: Array,
                    link: Array,
                    count: Number,
                    skipcount: Number,
                },
                start: {
                    userid: String,
                    start: Boolean,
                    embed: Boolean,
                    user: Boolean,
                    hint: Boolean,
                },
                page: {
                    click: Number,
                    now: Number,
                    p1: Number,
                    p2: Number,
                    p3: Number,
                    p4: Number,
                    slide: Number,
                },
            },
            tts: {
                ttschannelid: String,
                tts: Boolean,
            },
            selfcheck: {
                channelid: String,
                autochannelid: String,
            },
            role: Array,
            autovch: {
                set: Array,
                make: Array,
            },
        },
        patchnote: {
            type: String,
            year: String,
            month: String,
            day: String,
            text: String,
        },
        mandl: {
            type: String,
            id: String,
            name: String,
            guildid: String,
            vc: Array
        }
    },
};

module.exports = out;

function module_user() {
    var dataSchema = Schema(out.object.user);
    return models.Mandl_user || model('Mandl_user', dataSchema);
}
function module_server() {
    var dataSchema = Schema(out.object.server);
    return models.Mandl_server || model('Mandl_server', dataSchema);
}
function module_patchnote() {
    var dataSchema = Schema(out.object.patchnote);
    return models.Mandl_patchnote || model('Mandl_patchnote', dataSchema);
}
function module_mandl() {
    var dataSchema = Schema(out.object.mandl);
    return models.Mandl_mandl || model('Mandl_mandl', dataSchema);
}

async function set_user(user = new User) {
    var data = module_user(); //모듈
    const newdata = new data({
        name: user.username,
        userID: user.id,
        tts: true,
        ttsnomove: false,
        selfcheck: {
            area: '',
            school: '',
            name: '',
            birthday: '',
            password: '',
        },
    });
    return newdata.save().catch(err => log.errlog(err));
}
async function set_server(message = new Message) {
    var data = module_server(); //모듈
    const newdata = new data({
        serverid: message.guild.id,
        name: message.guild.name,
        quiz: {
            qzchannelid: '',
            vcid: '',
            user: {
                hint: [],
                skip: [],
            },
            anser: {
                time: 10,
                imgtime: 60,
            },
            msg: {
                listid: '',
                npid: '',
                scoreid: '',
            },
            quiz: {
                format: '음악퀴즈',
                name: [],
                vocal: [],
                link: [],
                count: 0,
                skipcount: 0,
            },
            start: {
                userid: '',
                start: false,
                embed: false,
                user: false,
                hint: false,
            },
            page: {
                click: 0,
                now: 0,
                p1: 0,
                p2: 0,
                p3: 0,
                p4: 0,
                slide: 0,
            },
        },
        selfcheck: {
            channelid: '',
            autochannelid: '',
        },
        tts: {
            ttschannelid: '',
            tts: true,
        },
        role: [],
        autovch: {
            set: [],
            make: [],
        },
    });
    return newdata.save().catch(err => log.errlog(err));
}
