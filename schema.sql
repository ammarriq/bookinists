-- DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
   id TEXT PRIMARY KEY,
   name TEXT,
   picture TEXT,
   email TEXT UNIQUE,
   role TEXT,
   social_id TEXT,
   network TEXT,
   last_login INTEGER,
   last_ip TEXT,
   last_country TEXT
);

-- DROP TABLE IF EXISTS sessions;
CREATE TABLE IF NOT EXISTS sessions (
   id TEXT PRIMARY KEY,
   user_id TEXT,
   expires_at TEXT,
   fresh INTEGER,
   created_on INTEGER,
   FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- DROP TABLE IF EXISTS books;
CREATE TABLE IF NOT EXISTS books (
   id TEXT PRIMARY KEY,
   title TEXT,
   url TEXT,
   excerpt TEXT,
   read_status TEXT,
   rating INTEGER,
   review TEXT,
   genre_id TEXT,
   created_on INTEGER,
   FOREIGN KEY (genre_id) REFERENCES genres (id) ON DELETE
   SET NULL
);

-- DROP TABLE IF EXISTS books_fts;
CREATE VIRTUAL TABLE IF NOT EXISTS books_fts USING fts5(id UNINDEXED, title);

CREATE TRIGGER IF NOT EXISTS books_ai AFTER INSERT ON books
   BEGIN INSERT INTO books_fts (id, title) VALUES (NEW.id, NEW.title); END;

CREATE TRIGGER IF NOT EXISTS books_au AFTER UPDATE ON books
   BEGIN UPDATE books_fts SET title = NEW.title WHERE id = OLD.id; END;

CREATE TRIGGER IF NOT EXISTS books_ad AFTER DELETE ON books
   BEGIN DELETE FROM books_fts WHERE id = OLD.id; END;

-- DROP TABLE IF EXISTS tags;
CREATE TABLE IF NOT EXISTS tags (
   id TEXT PRIMARY KEY,
   name TEXT,
   description TEXT,
   icon TEXT,
   text_color TEXT,
   bg_color TEXT,
   created_on INTEGER
);

-- DROP TABLE IF EXISTS tags_fts;
CREATE VIRTUAL TABLE IF NOT EXISTS tags_fts USING fts5(id UNINDEXED, name);

CREATE TRIGGER IF NOT EXISTS tags_ai AFTER INSERT ON tags
   BEGIN INSERT INTO tags_fts (id, name) VALUES (NEW.id, NEW.name); END;

CREATE TRIGGER IF NOT EXISTS tags_au AFTER UPDATE ON tags
   BEGIN UPDATE tags_fts SET name = NEW.name WHERE id = OLD.id; END;

CREATE TRIGGER IF NOT EXISTS tags_ad AFTER DELETE ON tags
   BEGIN DELETE FROM tags_fts WHERE id = OLD.id; END;

-- DROP TABLE IF EXISTS books_tags;
CREATE TABLE IF NOT EXISTS books_tags (
   id TEXT PRIMARY KEY,
   book_id TEXT,
   tag_id TEXT,
   rank TEXT,
   created_on INTEGER,
   CONSTRAINT book_tag UNIQUE (book_id, tag_id),
   FOREIGN KEY (book_id) REFERENCES books (id) ON DELETE CASCADE,
   FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
);

-- DROP TABLE IF EXISTS collections;
CREATE TABLE IF NOT EXISTS collections (
   id TEXT PRIMARY KEY,
   name TEXT,
   description TEXT,
   image TEXT,
   created_on INTEGER
);

-- DROP TABLE IF EXISTS genres;
CREATE TABLE IF NOT EXISTS genres (
   id TEXT PRIMARY KEY,
   name TEXT,
   description TEXT,
   created_on INTEGER
);

-- DROP TABLE IF EXISTS genres_fts;
CREATE VIRTUAL TABLE IF NOT EXISTS genres_fts USING fts5(id UNINDEXED, name);

CREATE TRIGGER IF NOT EXISTS genres_ai AFTER INSERT ON genres
   BEGIN INSERT INTO genres_fts (id, name) VALUES (NEW.id, NEW.name); END;

CREATE TRIGGER IF NOT EXISTS genres_au AFTER UPDATE ON genres
   BEGIN UPDATE genres_fts SET name = NEW.name WHERE id = OLD.id; END;

CREATE TRIGGER IF NOT EXISTS genres_ad AFTER DELETE ON genres
   BEGIN DELETE FROM genres_fts WHERE id = OLD.id; END;

-- DROP TABLE IF EXISTS authors;
CREATE TABLE IF NOT EXISTS authors (
   id TEXT PRIMARY KEY,
   name TEXT,
   avatar TEXT,
   info TEXT,
   country_id TEXT,
   created_on INTEGER,
   FOREIGN KEY (country_id) REFERENCES countries (id) ON DELETE
   SET NULL
);

-- DROP TABLE IF EXISTS authors_fts;
CREATE VIRTUAL TABLE IF NOT EXISTS authors_fts USING fts5(id UNINDEXED, name, avatar UNINDEXED);

CREATE TRIGGER IF NOT EXISTS authors_ai AFTER INSERT ON authors
   BEGIN INSERT INTO authors_fts (id, name, avatar) VALUES (NEW.id, NEW.name, NEW.avatar); END;

CREATE TRIGGER IF NOT EXISTS authors_au AFTER UPDATE ON authors
   BEGIN UPDATE authors_fts SET name = NEW.name, avatar = NEW.avatar WHERE id = OLD.id; END;

CREATE TRIGGER IF NOT EXISTS authors_ad AFTER DELETE ON authors
   BEGIN DELETE FROM authors_fts WHERE id = OLD.id; END;

-- DROP TABLE IF EXISTS books_authors;
CREATE TABLE IF NOT EXISTS books_authors (
   id TEXT PRIMARY KEY,
   book_id TEXT,
   author_id TEXT,
   rank TEXT,
   created_on INTEGER,
   FOREIGN KEY (book_id) REFERENCES books (id) ON DELETE CASCADE,
   FOREIGN KEY (author_id) REFERENCES authors (id) ON DELETE CASCADE
);

-- DROP TABLE IF EXISTS publishers;
CREATE TABLE IF NOT EXISTS publishers (
   id TEXT PRIMARY KEY,
   name TEXT,
   logo TEXT,
   info TEXT,
   country_id TEXT,
   created_on INTEGER,
   FOREIGN KEY (country_id) REFERENCES countries (id) ON DELETE
   SET NULL
);

-- DROP TABLE IF EXISTS countries;
CREATE TABLE IF NOT EXISTS countries (
   id TEXT PRIMARY KEY,
   name TEXT,
   flag TEXT,
   created_on INTEGER
);

-- DROP TABLE IF EXISTS awards;
CREATE TABLE IF NOT EXISTS awards (
   id TEXT PRIMARY KEY,
   image TEXT,
   name TEXT,
   description TEXT,
   url TEXT,
   genre_id TEXT,
   country_id TEXT,
   created_on INTEGER,
   FOREIGN KEY (genre_id) REFERENCES genres (id) ON DELETE SET NULL,
   FOREIGN KEY (country_id) REFERENCES countries (id) ON DELETE SET NULL
);

-- DROP TABLE IF EXISTS awards_fts;
CREATE VIRTUAL TABLE IF NOT EXISTS awards_fts USING fts5(id UNINDEXED, name);

CREATE TRIGGER IF NOT EXISTS awards_ai AFTER INSERT ON awards
   BEGIN INSERT INTO awards_fts (id, name) VALUES (NEW.id, NEW.name); END;

CREATE TRIGGER IF NOT EXISTS awards_au AFTER UPDATE ON awards
   BEGIN UPDATE awards_fts SET name = NEW.name WHERE id = OLD.id; END;

CREATE TRIGGER IF NOT EXISTS awards_ad AFTER DELETE ON awards
   BEGIN DELETE FROM awards_fts WHERE id = OLD.id; END;

-- DROP TABLE IF EXISTS awards_categories;
CREATE TABLE IF NOT EXISTS awards_categories (
   id TEXT PRIMARY KEY,
   name TEXT,
   url TEXT,
   description TEXT,
   created_on INTEGER
);

-- DROP TABLE IF EXISTS awards_categories_fts;
CREATE VIRTUAL TABLE IF NOT EXISTS awards_categories_fts USING fts5(id UNINDEXED, name);

CREATE TRIGGER IF NOT EXISTS awards_categories_ai AFTER INSERT ON awards_categories
   BEGIN INSERT INTO awards_categories_fts (id, name) VALUES (NEW.id, NEW.name); END;

CREATE TRIGGER IF NOT EXISTS awards_categories_au AFTER UPDATE ON awards_categories
   BEGIN UPDATE awards_categories_fts SET name = NEW.name WHERE id = OLD.id; END;

CREATE TRIGGER IF NOT EXISTS awards_categories_ad AFTER DELETE ON awards_categories
   BEGIN DELETE FROM awards_categories_fts WHERE id = OLD.id; END;

-- DROP TABLE IF EXISTS books_awards;
CREATE TABLE IF NOT EXISTS books_awards (
   id TEXT PRIMARY KEY,
   book_id TEXT,
   award_id TEXT,
   award_category_id TEXT,
   created_on INTEGER,
   FOREIGN KEY(book_id) REFERENCES books(id) ON DELETE CASCADE,
   FOREIGN KEY(award_id) REFERENCES awards(id) ON DELETE CASCADE,
   FOREIGN KEY(award_category_id) REFERENCES awards_categories(id) ON DELETE CASCADE
);

-- DROP TABLE IF EXISTS storages;
CREATE TABLE IF NOT EXISTS storages (
   id TEXT PRIMARY KEY,
   name TEXT,
   image TEXT,
   storage_type TEXT,
   color TEXT,
   width INTEGER,
   height INTEGER,
   depth INTEGER,
   notes TEXT,
   created_on INTEGER
);

-- DROP TABLE IF EXISTS storages_fts;
CREATE VIRTUAL TABLE IF NOT EXISTS storages_fts USING fts5(id UNINDEXED, name);

CREATE TRIGGER IF NOT EXISTS storages_ai AFTER INSERT ON storages
   BEGIN INSERT INTO storages_fts (id, name) VALUES (NEW.id, NEW.name); END;

CREATE TRIGGER IF NOT EXISTS storages_au AFTER UPDATE ON storages
   BEGIN UPDATE storages_fts SET name = NEW.name WHERE id = OLD.id; END;

CREATE TRIGGER IF NOT EXISTS storages_ad AFTER DELETE ON storages
   BEGIN DELETE FROM storages_fts WHERE id = OLD.id; END;

-- DROP TABLE IF EXISTS editions;
CREATE TABLE IF NOT EXISTS editions (
   id TEXT PRIMARY KEY,
   date INTEGER,
   book_id TEXT,
   publisher_id TEXT,
   country_id TEXT,
   isbn TEXT,
   isbn13 TEXT,
   status TEXT,
   protection TEXT,
   pages INTEGER,
   msrp INTEGER,
   language_iso TEXT,
   binding TEXT,
   total_printed INTEGER,
   printing INTEGER,
   edition INTEGER,
   is_limited INTEGER,
   limited_num INTEGER,
   limited_total INTEGER,
   is_signed INTEGER,
   signature_type TEXT,
   signature_page INTEGER,
   need_repair INTEGER,
   description TEXT,
   book_condition TEXT,
   book_condition_notes TEXT,
   jacket_condition TEXT,
   jacket_condition_notes TEXT,
   width INTEGER,
   height INTEGER,
   depth INTEGER,
   purchase_price INTEGER,
   purchase_date INTEGER,
   purchase_invoice TEXT,
   seller_id TEXT,
   sell_price INTEGER,
   sell_date INTEGER,
   buyer_id TEXT,
   lend_status TEXT,
   lender_id TEXT,
   lending_time INTEGER,
   created_on INTEGER,
   FOREIGN KEY (book_id) REFERENCES books (id) ON DELETE
   SET NULL,
      FOREIGN KEY (publisher_id) REFERENCES publishers (id) ON DELETE
   SET NULL,
      FOREIGN KEY (country_id) REFERENCES countries (id) ON DELETE
   SET NULL,
      FOREIGN KEY (seller_id) REFERENCES contacts (id) ON DELETE
   SET NULL,
      FOREIGN KEY (buyer_id) REFERENCES contacts (id) ON DELETE
   SET NULL,
      FOREIGN KEY (lender_id) REFERENCES contacts (id) ON DELETE
   SET NULL
);

-- DROP TABLE IF EXISTS editions_images;
CREATE TABLE IF NOT EXISTS editions_images (
   id TEXT PRIMARY KEY,
   image TEXT,
   type TEXT,
   rank TEXT,
   edition_id TEXT,
   created_on INTEGER,
   FOREIGN KEY (edition_id) REFERENCES editions (id) ON DELETE
   SET NULL
);

-- DROP TABLE IF EXISTS storages_editions;
CREATE TABLE IF NOT EXISTS storages_editions (
   id TEXT PRIMARY KEY,
   storage_id TEXT,
   edition_id TEXT,
   shelve INTEGER,
   position INTEGER,
   notes TEXT,
   FOREIGN KEY (storage_id) REFERENCES storages (id) ON DELETE
   SET NULL,
      FOREIGN KEY (edition_id) REFERENCES editions (id) ON DELETE
   SET NULL
);

-- DROP TABLE IF EXISTS rooms;
CREATE TABLE IF NOT EXISTS rooms (
   id TEXT PRIMARY KEY,
   name TEXT,
   floor INTEGER,
   created_on INTEGER
);

-- DROP TABLE IF EXISTS rooms_fts;
CREATE VIRTUAL TABLE IF NOT EXISTS rooms_fts USING fts5(id UNINDEXED, name);

CREATE TRIGGER IF NOT EXISTS rooms_ai AFTER INSERT ON rooms
   BEGIN INSERT INTO rooms_fts (id, name) VALUES (NEW.id, NEW.name); END;

CREATE TRIGGER IF NOT EXISTS rooms_au AFTER UPDATE ON rooms
   BEGIN UPDATE rooms_fts SET name = NEW.name WHERE id = OLD.id; END;

CREATE TRIGGER IF NOT EXISTS rooms_ad AFTER DELETE ON rooms
   BEGIN DELETE FROM rooms_fts WHERE id = OLD.id; END;

-- DROP TABLE IF EXISTS rooms_storages;
CREATE TABLE IF NOT EXISTS rooms_storages (
   id TEXT PRIMARY KEY,
   storage_id TEXT,
   room_id TEXT,
   created_on INTEGER,
   FOREIGN KEY (storage_id) REFERENCES storages (id) ON DELETE
   SET NULL,
      FOREIGN KEY (room_id) REFERENCES rooms (id) ON DELETE
   SET NULL
);

-- DROP TABLE IF EXISTS locations;
CREATE TABLE IF NOT EXISTS locations (
   id TEXT PRIMARY KEY,
   name TEXT,
   address TEXT,
   phone TEXT,
   url TEXT,
   notes TEXT,
   created_on INTEGER
);

-- DROP TABLE IF EXISTS locations_rooms;
CREATE TABLE IF NOT EXISTS locations_rooms (
   id TEXT PRIMARY KEY,
   location_id TEXT,
   room_id TEXT,
   created_on INTEGER,
   FOREIGN KEY (location_id) REFERENCES locations (id) ON DELETE SET NULL,
   FOREIGN KEY (room_id) REFERENCES rooms (id) ON DELETE SET NULL
);

-- DROP TABLE IF EXISTS lists;
CREATE TABLE IF NOT EXISTS lists (
   id TEXT PRIMARY KEY,
   name TEXT,
   image TEXT,
   list_type TEXT,
   url TEXT,
   description TEXT,
   created_on INTEGER
);

-- DROP TABLE IF EXISTS lists_fts;
CREATE VIRTUAL TABLE IF NOT EXISTS lists_fts USING fts5(id UNINDEXED, name);

CREATE TRIGGER IF NOT EXISTS lists_ai AFTER INSERT ON lists
   BEGIN INSERT INTO lists_fts (id, name) VALUES (NEW.id, NEW.name); END;

CREATE TRIGGER IF NOT EXISTS lists_au AFTER UPDATE ON lists
   BEGIN UPDATE lists_fts SET name = NEW.name WHERE id = OLD.id; END;

CREATE TRIGGER IF NOT EXISTS lists_ad AFTER DELETE ON lists
   BEGIN DELETE FROM lists_fts WHERE id = OLD.id; END;

-- DROP TABLE IF EXISTS books_lists;
CREATE TABLE IF NOT EXISTS books_lists (
   id TEXT PRIMARY KEY,
   book_id TEXT,
   list_id TEXT,
   rank TEXT,
   created_on INTEGER,
   CONSTRAINT book_list UNIQUE (book_id, list_id),
   FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
   FOREIGN KEY (list_id) REFERENCES lists(id) ON DELETE CASCADE
);

-- DROP TABLE IF EXISTS contacts;
CREATE TABLE IF NOT EXISTS contacts (
   id TEXT PRIMARY KEY,
   name TEXT,
   avatar TEXT,
   currency TEXT,
   paypal_email TEXT,
   bank_info TEXT,
   favorite_contact TEXT,
   email TEXT,
   phone TEXT,
   url TEXT,
   use_whatsapp INTEGER,
   use_signal INTEGER,
   is_professional INTEGER,
   rating INTEGER,
   note TEXT,
   country_id TEXT,
   created_on INTEGER,
   FOREIGN KEY (country_id) REFERENCES countries (id) ON DELETE
   SET NULL
);

-- DROP TABLE IF EXISTS contacts_fts;
CREATE VIRTUAL TABLE IF NOT EXISTS contacts_fts USING fts5(id UNINDEXED, name);

CREATE TRIGGER IF NOT EXISTS contacts_ai AFTER INSERT ON contacts
   BEGIN INSERT INTO contacts_fts (id, name) VALUES (NEW.id, NEW.name); END;

CREATE TRIGGER IF NOT EXISTS contacts_au AFTER UPDATE ON contacts
   BEGIN UPDATE contacts_fts SET name = NEW.name WHERE id = OLD.id; END;

CREATE TRIGGER IF NOT EXISTS contacts_ad AFTER DELETE ON contacts
   BEGIN DELETE FROM contacts_fts WHERE id = OLD.id; END;

-- DROP TABLE IF EXISTS marketplaces;
CREATE TABLE IF NOT EXISTS marketplaces (
   id TEXT PRIMARY KEY,
   icon TEXT,
   name TEXT,
   url TEXT,
   description TEXT,
   created_on INTEGER
);

-- DROP TABLE IF EXISTS marketplaces_fts;
CREATE VIRTUAL TABLE IF NOT EXISTS marketplaces_fts USING fts5(id UNINDEXED, name);

CREATE TRIGGER IF NOT EXISTS marketplaces_ai AFTER INSERT ON marketplaces
   BEGIN INSERT INTO marketplaces_fts (id, name) VALUES (NEW.id, NEW.name); END;

CREATE TRIGGER IF NOT EXISTS marketplaces_au AFTER UPDATE ON marketplaces
   BEGIN UPDATE marketplaces_fts SET name = NEW.name WHERE id = OLD.id; END;

CREATE TRIGGER IF NOT EXISTS marketplaces_ad AFTER DELETE ON marketplaces
   BEGIN DELETE FROM marketplaces_fts WHERE id = OLD.id; END;

-- DROP TABLE IF EXISTS contacts_marketplaces;
CREATE TABLE IF NOT EXISTS contacts_marketplaces (
   id TEXT PRIMARY KEY,
   name TEXT,
   shop_url TEXT,
   description TEXT,
   contact_id TEXT,
   marketplace_id TEXT,
   created_on INTEGER,
   FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE  SET NULL,
   FOREIGN KEY (marketplace_id) REFERENCES marketplaces(id) ON DELETE  SET NULL
);