CREATE TABLE IF NOT EXISTS users (
    email           VARCHAR(50) PRIMARY KEY,
    password        VARCHAR(250),
    create_time     DATETIME default CURRENT_TIMESTAMP,
    last_login_time DATETIME ,
    valid           integer default 1,
    level           INTEGER DEFAULT 1
);



CREATE TABLE IF NOT EXISTS users_stat (
    squad_date  INT,
    email VARCHAR(50),
    query_count INT DEFAULT 0,
    UNIQUE(squad_date, email)
);

/*   Qwe123!@#.  sha-256加密后  12b242cde21be11412f2af47be89393a1cefba37a42dd86170c5f741b0a0e5f6   */
insert into users (email, password,level)
values ("admin@qq.com", "12b242cde21be11412f2af47be89393a1cefba37a42dd86170c5f741b0a0e5f6",0);