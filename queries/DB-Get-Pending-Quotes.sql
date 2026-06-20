SELECT
    c.phone,
    c.first_name,
    e.id AS quote_id,
    e.quote_date,
    ((CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo')::date - e.quote_date) AS days_waiting
FROM event_quotes e
JOIN clients c ON e.client_phone = c.phone
WHERE e.status = 'Quote sent'
AND (
    e.quote_date = (CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo')::date - 2
    OR
    e.quote_date = (CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo')::date - 10
);