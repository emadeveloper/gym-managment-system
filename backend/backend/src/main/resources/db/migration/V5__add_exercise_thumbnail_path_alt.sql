ALTER TABLE exercises
ADD COLUMN thumbnail_path TEXT,
ADD COLUMN thumbnail_alt VARCHAR(220);

UPDATE exercises
SET thumbnail_path = thumbnail_url
WHERE thumbnail_path IS NULL AND thumbnail_url IS NOT NULL;

