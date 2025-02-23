PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'active',
    streak TEXT DEFAULT 'casual',
    streak_days INTEGER DEFAULT 0,
    last_access DATETIME NULL,
    utm_source TEXT NULL,
    utm_medium TEXT NULL,
    utm_campaign TEXT NULL,
    utm_channel TEXT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL,
    deleted_at DATETIME NULL
);
INSERT INTO users VALUES(1,'thenews@exemplo.com','active','Casual',5,'2025-02-16 10:30:00','google','cpc','winter_campaign','social_media','2025-02-16 03:37:16',NULL,NULL);
CREATE TABLE menus (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    route TEXT NOT NULL,
    permission_key TEXT NOT NULL,
    icon TEXT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL,
    deleted_at DATETIME NULL
);
INSERT INTO menus VALUES(1,'Dashboard','dashboard','DASHBOARD-VIEW','dashboard_icon','2025-02-16 03:35:11',NULL,NULL);
INSERT INTO menus VALUES(2,'Streak','streak','STREAK-VIEW','streak_icon','2025-02-16 03:35:11',NULL,NULL);
CREATE TABLE users_linked_menus (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    menu_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL,
    deleted_at DATETIME NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE
);
INSERT INTO users_linked_menus VALUES(1,1,1,'2025-02-16 03:39:45',NULL,NULL);
INSERT INTO users_linked_menus VALUES(2,1,2,'2025-02-16 03:39:45',NULL,NULL);
CREATE TABLE newsLetter_openings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    newsletter_id TEXT NOT NULL,
    opened_date DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL,
    deleted_at DATETIME NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
INSERT INTO newsLetter_openings VALUES(1,1,'post_2025-02-10','2025-02-10 03:57:00',CURRENT_TIMESTAMP,NULL,NULL);
INSERT INTO newsLetter_openings VALUES(2,1,'post_2025-02-11','2025-02-11 03:57:00',CURRENT_TIMESTAMP,NULL,NULL);
INSERT INTO newsLetter_openings VALUES(3,1,'post_2025-02-12','2025-02-12 03:57:00',CURRENT_TIMESTAMP,NULL,NULL);
INSERT INTO newsLetter_openings VALUES(4,1,'post_2025-02-13','2025-02-13 03:57:00',CURRENT_TIMESTAMP,NULL,NULL);
INSERT INTO newsLetter_openings VALUES(5,1,'post_2025-02-14','2025-02-14 03:57:00',CURRENT_TIMESTAMP,NULL,NULL);
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('menus',2);
INSERT INTO sqlite_sequence VALUES('users',1);
INSERT INTO sqlite_sequence VALUES('users_linked_menus',2);
INSERT INTO sqlite_sequence VALUES('newsLetter_openings',5);