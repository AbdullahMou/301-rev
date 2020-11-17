drop table if exists jokes;

create table jokes (
    id serial primary key,
    type varchar (50),
    setup varchar (100),
    punchline varchar(100)
);
insert into jokes (type,setup,punchline) values('programming',
'To understand what recursion is...',
'You must first understand what recursion is');