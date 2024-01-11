export const enums = {
    MATCH_FORMATS:  {
        REGULAR_3: {val:0,desc:"Regular best of 3 sets"},
        PRO_8: {val:1,desc:"Pro-set to 8"},
        PRO_10: {val:2,desc:"Pro-set to 10"},
        FAST4_3: {val:3,desc:"Fast4 best of 3 sets"},
        FAST4_5: {val:4,desc:"Fast4 best of 5 sets"},
    },
    
    LOGIN_MODES : {
        UsernamePwd: "login",
        Google: "google",
        Facebook: "facebook",
        Amazon: "amazon",
        SIGN_IN: "signin",
        SIGN_UP: "signup"
    },

    DISPLAY_MODE: {
        Card: 'card',
        Inline: 'inline',
        Table: 'table',
        SimpleList: 'simpleList'
    },

    PLAYER_EXISTS: {
        Username: 'username',
        Name: 'name'
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
    },

    LevelMarks: [
        {value: 2, label: '2.0'}, {value: 2.5, label: '2.5'},
        {value: 3, label: '3.0'}, {value: 3.5, label: '3.5'},
        {value: 4, label: '4.0'}, {value: 4.5, label: '4.5'},
        {value: 5, label: '5.0'}, {value: 5.5, label: '5.5'},
        {value: 6, label: '6.0'}, {value: 6.5, label: '6.5'}]
}