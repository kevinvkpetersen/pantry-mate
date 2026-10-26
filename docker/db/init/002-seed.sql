INSERT INTO locations (name) VALUES
    ('Pantry'),
    ('Fridge'),
    ('Freezer');

INSERT INTO items (name, location_id, quantity, unit, expires_on) VALUES
    ('Spaghetti',       1,  2,   'box',    NULL),
    ('Canned tomatoes', 1,  4,   'can',    CURRENT_DATE + 365),
    ('Rice',            1,  1.5, 'kg',     CURRENT_DATE + 540),
    ('Milk',            2,  1,   'l',      CURRENT_DATE + 5),
    ('Eggs',            2,  6,   NULL,     CURRENT_DATE + 14),
    ('Cheddar',         2,  200, 'g',      CURRENT_DATE - 2),
    ('Frozen peas',     3,  1,   'bag',    CURRENT_DATE + 200),
    ('Olive oil',       1,  1,   'bottle', NULL);
