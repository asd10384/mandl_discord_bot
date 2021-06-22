
var stats = {
    id: String,
    raw: null,
    pvp: {
        general: {
            dbno: Number,
            dbnoAssists: Number
        },
        operators: {
            opername: {
                name: String,
                role: String,
                unit: String,
                icon: String,
                kills: Number,
                deaths: Number,
                kd: Number,
                winds: Number,
                losses: Number,
                winRate: String,
                matches: Number,
                headshots: Number,
                meleeKills: Number,
                dbno: Number,
                xp: Number,
                playtime: Number,
                uniqueAbility: {
                    name: String,
                    icon: String,
                    stats: [{name: String, value: Number}] // doc: Teammates Revived, Self Revives, Hostages Revived
                }
            }
        },
        weapons: {
            assault: {
                general: {
                    name: String,
                    kills: Number,
                    deaths: Number,
                    kd: Number,
                    headshots: Number,
                    bulletsFired: Number,
                    bulletsConnected: Number,
                    timesChosen: Number
                },
                list: {
                    'gunname': {
                        name: String,
                        kills: Number,
                        deaths: Number,
                        kd: Number,
                        headshots: Number,
                        bulletsFired: Number,
                        bulletsConnected: Number,
                        timesChosen: Number
                    }
                }
            },
            smg: {
                general: {
                    name: String,
                    kills: Number,
                    deaths: Number,
                    kd: Number,
                    headshots: Number,
                    bulletsFired: Number,
                    bulletsConnected: Number,
                    timesChosen: Number
                },
                list: {
                    'gunname': {
                        name: String,
                        kills: Number,
                        deaths: Number,
                        kd: Number,
                        headshots: Number,
                        bulletsFired: Number,
                        bulletsConnected: Number,
                        timesChosen: Number
                    }
                }
            },
            lmg: {
                general: {
                    name: String,
                    kills: Number,
                    deaths: Number,
                    kd: Number,
                    headshots: Number,
                    bulletsFired: Number,
                    bulletsConnected: Number,
                    timesChosen: Number
                },
                list: {
                    'gunname': {
                        name: String,
                        kills: Number,
                        deaths: Number,
                        kd: Number,
                        headshots: Number,
                        bulletsFired: Number,
                        bulletsConnected: Number,
                        timesChosen: Number
                    }
                }
            },
            marksman: {
                general: {
                    name: String,
                    kills: Number,
                    deaths: Number,
                    kd: Number,
                    headshots: Number,
                    bulletsFired: Number,
                    bulletsConnected: Number,
                    timesChosen: Number
                },
                list: {
                    'gunname': {
                        name: String,
                        kills: Number,
                        deaths: Number,
                        kd: Number,
                        headshots: Number,
                        bulletsFired: Number,
                        bulletsConnected: Number,
                        timesChosen: Number
                    }
                }
            },
            pistol: {
                general: {
                    name: String,
                    kills: Number,
                    deaths: Number,
                    kd: Number,
                    headshots: Number,
                    bulletsFired: Number,
                    bulletsConnected: Number,
                    timesChosen: Number
                },
                list: {
                    'gunname': {
                        name: String,
                        kills: Number,
                        deaths: Number,
                        kd: Number,
                        headshots: Number,
                        bulletsFired: Number,
                        bulletsConnected: Number,
                        timesChosen: Number
                    }
                }
            },
            shotgun: {
                general: {
                    name: String,
                    kills: Number,
                    deaths: Number,
                    kd: Number,
                    headshots: Number,
                    bulletsFired: Number,
                    bulletsConnected: Number,
                    timesChosen: Number
                },
                list: {
                    'gunname': {
                        name: String,
                        kills: Number,
                        deaths: Number,
                        kd: Number,
                        headshots: Number,
                        bulletsFired: Number,
                        bulletsConnected: Number,
                        timesChosen: Number
                    }
                }
            },
            mp: {
                general: {
                    name: String,
                    kills: Number,
                    deaths: Number,
                    kd: Number,
                    headshots: Number,
                    bulletsFired: Number,
                    bulletsConnected: Number,
                    timesChosen: Number
                },
                list: {
                    'gunname': {
                        name: String,
                        kills: Number,
                        deaths: Number,
                        kd: Number,
                        headshots: Number,
                        bulletsFired: Number,
                        bulletsConnected: Number,
                        timesChosen: Number
                    }
                }
            },
            shield: {
                general: {
                    name: String,
                    kills: Number,
                    deaths: Number,
                    kd: Number,
                    headshots: Number,
                    bulletsFired: Number,
                    bulletsConnected: Number,
                    timesChosen: Number
                },
                list: {
                    'gunname': {
                        name: String,
                        kills: Number,
                        deaths: Number,
                        kd: Number,
                        headshots: Number,
                        bulletsFired: Number,
                        bulletsConnected: Number,
                        timesChosen: Number
                    }
                }
            },
            launcher: {
                general: {
                    name: String,
                    kills: Number,
                    deaths: Number,
                    kd: Number,
                    headshots: Number,
                    bulletsFired: Number,
                    bulletsConnected: Number,
                    timesChosen: Number
                },
                list: {
                    'gunname': {
                        name: String,
                        kills: Number,
                        deaths: Number,
                        kd: Number,
                        headshots: Number,
                        bulletsFired: Number,
                        bulletsConnected: Number,
                        timesChosen: Number
                    }
                }
            },
            utility: {
                general: {
                    name: String,
                    kills: Number,
                    deaths: Number,
                    kd: Number,
                    headshots: Number,
                    bulletsFired: Number,
                    bulletsConnected: Number,
                    timesChosen: Number
                },
                list: {
                    'gunname': {
                        name: String,
                        kills: Number,
                        deaths: Number,
                        kd: Number,
                        headshots: Number,
                        bulletsFired: Number,
                        bulletsConnected: Number,
                        timesChosen: Number
                    }
                }
            }
        },
        queues: {
            local: {
                normal: {
                    name: String,
                    bestScore: Number
                },
                hard: {
                    name: String,
                    bestScore: Number
                },
                realistic: {
                    name: String,
                    bestScore: Number
                }
            },
            coop: {
                normal: {
                    name: String,
                    bestScore: Number
                },
                hard: {
                    name: String,
                    bestScore: Number
                },
                realistic: {
                    name: String,
                    bestScore: Number
                }
            }
        },
        modes: {
            bomb: {
                name: String,
                wins: Number,
                losses: Number,
                winRate: String,
                matches: Number,
                bestScore: Number,
                playtime: Number
            },
            secureArea: {
                secured: Number,
                defended: Number,
                contested: Number
            },
            hostage: {
                hostageRescued: Number,
                hostageDefended: Number
            }
        }
    },
    pve: {
        general: {
            dbno: Number,
            dbnoAssists: Number
        },
        operators: {
            opername: {
                name: String,
                role: String,
                unit: String,
                icon: String,
                kills: Number,
                deaths: Number,
                kd: Number,
                winds: Number,
                losses: Number,
                winRate: String,
                matches: Number,
                headshots: Number,
                meleeKills: Number,
                dbno: Number,
                xp: Number,
                playtime: Number,
                uniqueAbility: {
                    name: String,
                    icon: String,
                    stats: [{name: String, value: Number}] // doc: Teammates Revived, Self Revives, Hostages Revived
                }
            }
        },
        weapons: {
            assault: {
                general: {
                    name: String,
                    kills: Number,
                    deaths: Number,
                    kd: Number,
                    headshots: Number,
                    bulletsFired: Number,
                    bulletsConnected: Number,
                    timesChosen: Number
                },
                list: {
                    'gunname': {
                        name: String,
                        kills: Number,
                        deaths: Number,
                        kd: Number,
                        headshots: Number,
                        bulletsFired: Number,
                        bulletsConnected: Number,
                        timesChosen: Number
                    }
                }
            },
            smg: {
                general: {
                    name: String,
                    kills: Number,
                    deaths: Number,
                    kd: Number,
                    headshots: Number,
                    bulletsFired: Number,
                    bulletsConnected: Number,
                    timesChosen: Number
                },
                list: {
                    'gunname': {
                        name: String,
                        kills: Number,
                        deaths: Number,
                        kd: Number,
                        headshots: Number,
                        bulletsFired: Number,
                        bulletsConnected: Number,
                        timesChosen: Number
                    }
                }
            },
            lmg: {
                general: {
                    name: String,
                    kills: Number,
                    deaths: Number,
                    kd: Number,
                    headshots: Number,
                    bulletsFired: Number,
                    bulletsConnected: Number,
                    timesChosen: Number
                },
                list: {
                    'gunname': {
                        name: String,
                        kills: Number,
                        deaths: Number,
                        kd: Number,
                        headshots: Number,
                        bulletsFired: Number,
                        bulletsConnected: Number,
                        timesChosen: Number
                    }
                }
            },
            marksman: {
                general: {
                    name: String,
                    kills: Number,
                    deaths: Number,
                    kd: Number,
                    headshots: Number,
                    bulletsFired: Number,
                    bulletsConnected: Number,
                    timesChosen: Number
                },
                list: {
                    'gunname': {
                        name: String,
                        kills: Number,
                        deaths: Number,
                        kd: Number,
                        headshots: Number,
                        bulletsFired: Number,
                        bulletsConnected: Number,
                        timesChosen: Number
                    }
                }
            },
            pistol: {
                general: {
                    name: String,
                    kills: Number,
                    deaths: Number,
                    kd: Number,
                    headshots: Number,
                    bulletsFired: Number,
                    bulletsConnected: Number,
                    timesChosen: Number
                },
                list: {
                    'gunname': {
                        name: String,
                        kills: Number,
                        deaths: Number,
                        kd: Number,
                        headshots: Number,
                        bulletsFired: Number,
                        bulletsConnected: Number,
                        timesChosen: Number
                    }
                }
            },
            shotgun: {
                general: {
                    name: String,
                    kills: Number,
                    deaths: Number,
                    kd: Number,
                    headshots: Number,
                    bulletsFired: Number,
                    bulletsConnected: Number,
                    timesChosen: Number
                },
                list: {
                    'gunname': {
                        name: String,
                        kills: Number,
                        deaths: Number,
                        kd: Number,
                        headshots: Number,
                        bulletsFired: Number,
                        bulletsConnected: Number,
                        timesChosen: Number
                    }
                }
            },
            mp: {
                general: {
                    name: String,
                    kills: Number,
                    deaths: Number,
                    kd: Number,
                    headshots: Number,
                    bulletsFired: Number,
                    bulletsConnected: Number,
                    timesChosen: Number
                },
                list: {
                    'gunname': {
                        name: String,
                        kills: Number,
                        deaths: Number,
                        kd: Number,
                        headshots: Number,
                        bulletsFired: Number,
                        bulletsConnected: Number,
                        timesChosen: Number
                    }
                }
            },
            shield: {
                general: {
                    name: String,
                    kills: Number,
                    deaths: Number,
                    kd: Number,
                    headshots: Number,
                    bulletsFired: Number,
                    bulletsConnected: Number,
                    timesChosen: Number
                },
                list: {
                    'gunname': {
                        name: String,
                        kills: Number,
                        deaths: Number,
                        kd: Number,
                        headshots: Number,
                        bulletsFired: Number,
                        bulletsConnected: Number,
                        timesChosen: Number
                    }
                }
            },
            launcher: {
                general: {
                    name: String,
                    kills: Number,
                    deaths: Number,
                    kd: Number,
                    headshots: Number,
                    bulletsFired: Number,
                    bulletsConnected: Number,
                    timesChosen: Number
                },
                list: {
                    'gunname': {
                        name: String,
                        kills: Number,
                        deaths: Number,
                        kd: Number,
                        headshots: Number,
                        bulletsFired: Number,
                        bulletsConnected: Number,
                        timesChosen: Number
                    }
                }
            },
            utility: {
                general: {
                    name: String,
                    kills: Number,
                    deaths: Number,
                    kd: Number,
                    headshots: Number,
                    bulletsFired: Number,
                    bulletsConnected: Number,
                    timesChosen: Number
                },
                list: {
                    'gunname': {
                        name: String,
                        kills: Number,
                        deaths: Number,
                        kd: Number,
                        headshots: Number,
                        bulletsFired: Number,
                        bulletsConnected: Number,
                        timesChosen: Number
                    }
                }
            }
        },
        queues: {
            local: {
                normal: {
                    name: String,
                    bestScore: Number
                },
                hard: {
                    name: String,
                    bestScore: Number
                },
                realistic: {
                    name: String,
                    bestScore: Number
                }
            },
            coop: {
                normal: {
                    name: String,
                    bestScore: Number
                },
                hard: {
                    name: String,
                    bestScore: Number
                },
                realistic: {
                    name: String,
                    bestScore: Number
                }
            }
        },
        modes: {
            bomb: {
                name: String,
                wins: Number,
                losses: Number,
                winRate: String,
                matches: Number,
                bestScore: Number,
                playtime: Number
            },
            secureArea: {
                secured: Number,
                defended: Number,
                contested: Number
            },
            hostage: {
                hostageRescued: Number,
                hostageDefended: Number
            }
        }
    }
};

module.exports = stats;