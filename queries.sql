-- create table --
drop table if exists Books,Book_User;

create table Book_User(
    id serial primary key,
    username varchar(50),
    Password varchar(10)
);

Create table Books(
id serial primary key,
title varchar(100) not null,
description text not null,
summary text,
personal_note text,
isbn numeric(13),
user_id integer references Book_User(id)
);

-- insert data --
insert into Book_User(username,password) values ('willy','123456'),('candra','678910');

insert into Books(title,description, summary, personal_note,isbn,user_id) 
values
('Atomic Habits',
$$James Clear’s Atomic Habits is a practical guide that dives into how small changes can lead to big improvements over time. The book emphasizes the power of small, consistent actions in building better habits and breaking bad ones.$$,
$$Clear introduces the idea that habits are a compound interest of self-improvement. By focusing on systems over goals, readers learn how to build habits that stick by understanding the four laws of behavior change: cue, craving, response, and reward. Each chapter offers actionable strategies for habit formation, from environment design to tracking progress.$$,
$$Atomic Habits is incredibly actionable, with takeaways I can use immediately. It reminds me that big changes aren't about willpower but about creating systems that make good habits easy and bad habits difficult.$$,
'9780735211292',
'1'),
('The Power of Now',
$$Eckhart Tolle’s The Power of Now is a transformative book that explores the concept of mindfulness and living in the present moment. Tolle argues that by letting go of the past and future, individuals can free themselves from anxiety and find true peace.$$,
$$The book encourages readers to break free from identifying with their minds, instead becoming an observer of their thoughts. Through practical exercises and philosophical insights, Tolle emphasizes the importance of living in the 'Now' as a path to enlightenment and inner peace. His teachings encourage acceptance of what is, reducing resistance, and embracing life's flow.$$,
$$This book gave me a new perspective on how often I live in the future or past rather than being present. It’s a refreshing reminder to focus on “Now” to find calm and clarity in daily life.$$,
'9781577314806',
'1'),
($$Mindset: The New Psychology of Success$$,
$$Dr. Carol S. Dweck’s Mindset examines how the way we view our abilities influences our success. She contrasts the 'fixed mindset' with the 'growth mindset,' showing how our beliefs shape our approach to challenges, effort, and feedback.$$,
$$Dweck explains that those with a growth mindset believe abilities can be developed through dedication and hard work, which fosters resilience. Conversely, a fixed mindset assumes talents are static, leading to a fear of failure and avoidance of challenges. Through real-life examples, she shows how adopting a growth mindset can transform one's approach to life, making one more willing to take on challenges and learn from failure.$$,
$$Mindset helped me see how I sometimes avoid challenges because of fear of failure. Embracing a growth mindset is empowering and reminds me to view setbacks as opportunities.$$,
'9780345472328',
'1');