INSERT INTO events 
(name, 
date_planned, 
description, 
max_participants, 
min_age)
VALUES (
    'May the 4th',
    (NOW() - INTERVAL '11 DAY'),
    'Celebrate the May 4th aka May the force be with you - from Star Wars',
    100,
    18
), (
    'June full moon',
    '2022-06-22 21:00:00',
    'When there is a full moon in the sky in June',
    NULL,
    NULL
);