export const enums = {
    MATCH_FORMATS:  {
        REGULAR_3: {val:0,desc:"Regular best of 3 sets"},
        PRO_8: {val:1,desc:"Pro-set to 8"},
        PRO_10: {val:2,desc:"Pro-set to 10"},
        FAST4_3: {val:3,desc:"Fast4 best of 3 sets"},
        FAST4_5: {val:4,desc:"Fast4 best of 5 sets"},
    },

    DISPLAY_MODE: {
        Card: 'card',
        Inline: 'inline',
        Table: 'table',
        SimpleList: 'simpleList'
    },

    STANDINGS_ID: {
        Current: 'cur',
        Old: 'old'
    },    

    MATCH_TYPE: {
        SINGLES: 'SINGLES',
        DOUBLES: 'DOUBLES'
    },

    OPERATION_TYPE: {
        CREATE: 'CREATE',
        UPDATE: 'UPDATE',
        DELETE: 'DELETE'
    }
}