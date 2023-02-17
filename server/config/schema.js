module.exports = {
    interest: [
        {
            "id": 14,
            "name": "Gi\u1ea3m b\u00e9o"
        },
        {
            "id": 19,
            "name": "Mua b\u00e1n"
        },
        {
            "id": 22,
            "name": "Nh\u00e0 h\u00e0ng"
        },
        {
            "id": 24,
            "name": "N\u00f4ng nghi\u1ec7p"
        },
        {
            "id": 25,
            "name": "N\u01b0\u1edbc hoa"
        },
        {
            "id": 26,
            "name": "Online"
        },
        {
            "id": 29,
            "name": "Ph\u1ee5 ki\u1ec7n th\u1eddi trang"
        },
        {
            "id": 40,
            "name": "Th\u1ef1c ph\u1ea9m dinh d\u01b0\u1ee1ng"
        },
        {
            "id": 41,
            "name": "T\u1ed5 ch\u1ee9c s\u1ef1 ki\u1ec7n"
        },
        {
            "id": 44,
            "name": "Vi\u1ec7c l\u00e0m & tuy\u1ec3n d\u1ee5ng"
        },
        {
            "id": 5,
            "name": "Ch\u0103m s\u00f3c t\u00f3c"
        },
        {
            "id": 8,
            "name": "\u0110i\u1ec7n t\u1eed & c\u00f4ng ngh\u1ec7"
        },
        {
            "id": 9,
            "name": "Du h\u1ecdc/ Xu\u1ea5t kh\u1ea9u lao \u0111\u1ed9ng"
        },
        {
            "id": 10,
            "name": "Du l\u1ecbch"
        },
        {
            "id": 12,
            "name": "Gia \u0111\u00ecnh"
        },
        {
            "id": 21,
            "name": "Nh\u00e0 c\u1eeda & V\u01b0\u1eddn t\u01b0\u1ee3c"
        },
        {
            "id": 30,
            "name": "Ph\u1ee5 ki\u1ec7n th\u1eddi trang cao c\u1ea5p"
        },
        {
            "id": 32,
            "name": "S\u00e1ch"
        },
        {
            "id": 33,
            "name": "Spa & L\u00e0m \u0111\u1eb9p"
        },
        {
            "id": 34,
            "name": "T\u00e0i ch\u00ednh"
        },
        {
            "id": 42,
            "name": "T\u00f4n gi\u00e1o"
        },
        {
            "id": 6,
            "name": "C\u00f4ng ngh\u1ec7"
        },
        {
            "id": 2,
            "name": "\u1ea8m th\u1ef1c"
        },
        {
            "id": 4,
            "name": "B\u00f3ng \u0111\u00e1"
        },
        {
            "id": 15,
            "name": "Gi\u00e1o d\u1ee5c"
        },
        {
            "id": 20,
            "name": "Mua s\u1eafm th\u1eddi trang"
        },
        {
            "id": 27,
            "name": "Phim"
        },
        {
            "id": 35,
            "name": "Th\u1ea9m m\u1ef9 vi\u1ec7n"
        },
        {
            "id": 36,
            "name": "Thi\u1ebft k\u1ebf"
        },
        {
            "id": 38,
            "name": "Th\u00fa c\u01b0ng"
        },
        {
            "id": 43,
            "name": "T\u1eeb thi\u1ec7n"
        },
        {
            "id": 1,
            "name": "\u00c2m nh\u1ea1c"
        },
        {
            "id": 7,
            "name": "\u0110\u1ea5u gi\u00e1"
        },
        {
            "id": 13,
            "name": "Gi\u1ea3i tr\u00ed"
        },
        {
            "id": 16,
            "name": "Kinh doanh"
        },
        {
            "id": 18,
            "name": "M\u1eb9 & b\u00e9"
        },
        {
            "id": 28,
            "name": "Phong th\u1ee7y"
        },
        {
            "id": 39,
            "name": "Th\u1ef1c ph\u1ea9m"
        },
        {
            "id": 46,
            "name": "Xe c\u1ed9"
        },
        {
            "id": 3,
            "name": "B\u1ea5t \u0111\u1ed9ng s\u1ea3n"
        },
        {
            "id": 11,
            "name": "Game online"
        },
        {
            "id": 17,
            "name": "Marketing"
        },
        {
            "id": 23,
            "name": "Nh\u00e0 n\u01b0\u1edbc"
        },
        {
            "id": 31,
            "name": "Ph\u01b0\u01a1ng ti\u1ec7n \u0111i l\u1ea1i"
        },
        {
            "id": 37,
            "name": "Th\u1eddi trang"
        },
        {
            "id": 45,
            "name": "Vui ch\u01a1i gi\u1ea3i tr\u00ed"
        },
        {
            "id": 47,
            "name": "Y t\u1ebf & s\u1ee9c kh\u1ecfe"
        }
    ],
    user:
        {
            "local": {
                "username": "fpt",
                "email": "fpt@gmail.com",
                "password": "$2a$08$5Lzrb6jihVWRixehRNMbduWufeO6NN3vlpbAh6EkddsZgii3GR8UK"
            },
            "roles": "1",
            "is_active": true,
            "email_activated": true,
            "created_at": "2019-01-14T07:25:25.667Z"
        }

    ,
    role: [
        {
            "role_id": "1",
            'role_name': 'Admin',
            'permissions': 'view:superusers;delete:superusers;create:superusers;list:superusers;activate:superusers;deactivate:superusers;reset:passwords;change:passwords'
        },
        {
            'role_id': '10',
            'role_name': 'SuperUser',
            'permissions': 'view:users;delete:users;list:users;create:users;activate:users;deactivate:users;reset:passwords;change:passwords;view:profiles;create:projects;view:projects;list:projects;delete:projects;update:projects'
        },

        {
            'role_id': '100',
            'role_name': 'user',
            'permissions': 'change:passwords;change:profiles;view:profiles;list:projects;view:projects;create:projects;update:projects;delete:projects'
        }
    ]
};







