-- SELECT 
-- l.title AS place, e.name AS event_name, e.date_planned 
-- FROM events AS e
-- INNER JOIN locations AS l ON e.location_id = l.id;

-- SELECT 
-- CONCAT(u.first_name,' ',u.last_name) AS name,
-- l.title AS place, e.name AS event_name, e.date_planned
-- FROM events AS e
-- INNER JOIN locations AS l ON e.location_id = l.id
-- INNER JOIN events_users AS eu ON eu.event_id = e.id
-- INNER JOIN users AS u ON u.id = eu.user_id;

-- SELECT * FROM cities AS c
-- LEFT JOIN locations AS l ON l.city_name = c.name
-- LEFT JOIN events AS e ON e.location_id = l.id
-- WHERE c.name = 'Munich'
-- ;

-- SELECT * FROM users
-- WHERE first_name LIKE ('%a%l')

-- SELECT COUNT(id) FROM locations;

-- SELECT c.name, COUNT(l.id) FROM cities AS c
-- LEFT JOIN locations AS l ON l.city_name = c.name
-- GROUP BY c.name, l.street;

-- SELECT c.name, COUNT(l.id) FROM cities AS c
-- LEFT JOIN locations AS l ON l.city_name = c.name
-- GROUP BY c.name
-- HAVING COUNT(l.id) >=2;