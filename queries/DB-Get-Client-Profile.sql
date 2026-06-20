SELECT *
FROM clients
LEFT JOIN event_quotes ON clients.phone = event_quotes.client_phone
WHERE clients.phone = '{{ $json.phone }}'
ORDER BY event_quotes.id DESC
LIMIT 1;