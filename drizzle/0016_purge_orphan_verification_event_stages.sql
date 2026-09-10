DELETE FROM `event_stages`
WHERE `event_id` NOT IN (SELECT `id` FROM `events`);