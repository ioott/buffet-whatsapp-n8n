DROP TABLE IF EXISTS orcamentos_eventos;
DROP TABLE IF EXISTS clientes;
DROP TABLE IF EXISTS event_quotes;
DROP TABLE IF EXISTS clients;

-- 1. CLIENTS TABLE
CREATE TABLE clients (
    phone VARCHAR(20) PRIMARY KEY,
    source VARCHAR(50),
    first_name VARCHAR(150),
    last_name VARCHAR(150),
    birth_date DATE,
    company_profession VARCHAR(150),
    has_children BOOLEAN DEFAULT FALSE,
    child_name VARCHAR(150),
    child_birth_date DATE,
    cpf VARCHAR(20),
    address TEXT,
    notes TEXT
);

-- 2. EVENT QUOTES TABLE
CREATE TABLE event_quotes (
    id SERIAL PRIMARY KEY,
    client_phone VARCHAR(20) REFERENCES clients(phone) ON DELETE CASCADE,

    -- Birthday Person (Nullables for events without one)
    birthday_person_relationship VARCHAR(20) NULL,
    birthday_person_name VARCHAR(150) NULL,
    birthday_person_birth_date DATE NULL,
    birthday_person_company_profession VARCHAR(150) NULL,

    -- CRM
    quote_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(50),
    message_control VARCHAR(50),
    lost_reason TEXT,

    -- Event Data
    event_type VARCHAR(50),
    menu VARCHAR(100),
    event_date DATE,
    neighborhood VARCHAR(150),
    start_time TIME,
    venue_manager VARCHAR(150),

    -- Quantities
    qty_4_to_6_years INTEGER DEFAULT 0,
    qty_7_to_11_years INTEGER DEFAULT 0,
    qty_12_plus_years INTEGER DEFAULT 0,

    -- Financials
    total_cost NUMERIC(10, 2) DEFAULT 0.00,
    full_payer NUMERIC(10, 2) DEFAULT 0.00,
    half_payer NUMERIC(10, 2) DEFAULT 0.00,
    profit NUMERIC(10, 2) DEFAULT 0.00,
    total_event_price NUMERIC(10, 2) DEFAULT 0.00
);