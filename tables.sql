create table users (
    id serial primary key,
    login varchar(50) not null unique,
    password varchar(64) not null,
    salt varchar(32) not null
);

create table sessions (
    id integer primary key,
    api_key varchar(32) not null,
    expired timestamp not null,
    foreign key (id) references users(id)
                      on delete cascade
                      on update cascade
);

create table boards (
    id serial primary key,
    name varchar(50) not null
);

create table tasks (
    id serial primary key,
    title varchar(150) not null,
    creator_id int not null,
    board_id int not null,
    foreign key (creator_id) references users(id)
                   on delete restrict
                   on update cascade,
    foreign key (board_id) references boards(id)
                   on delete cascade
                   on update cascade
)