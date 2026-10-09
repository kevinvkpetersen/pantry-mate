CREATE TABLE items (
    id              integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name            text NOT NULL,
    quantity        numeric NOT NULL DEFAULT 1,
    unit            text, -- "g", "can", "box", or null
    expires_on      date
);

INSERT INTO items (name, quantity, unit, expires_on) VALUES
    ('Spaghetti',       2,   'box',    NULL),
    ('Canned tomatoes', 4,   'can',    CURRENT_DATE + 365),
    ('Rice',            1.5, 'kg',     CURRENT_DATE + 540),
    ('Milk',            1,   'l',      CURRENT_DATE + 5),
    ('Eggs',            6,   NULL,     CURRENT_DATE + 14),
    ('Cheddar',         200, 'g',      CURRENT_DATE - 2),
    ('Frozen peas',     1,   'bag',    CURRENT_DATE + 200),
    ('Olive oil',       1,   'bottle', NULL);
