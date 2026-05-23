CREATE TABLE IF NOT EXISTS download_tables (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    category_en VARCHAR(50) NOT NULL,
    category_hi VARCHAR(50),
    title_en VARCHAR(255) NOT NULL,
    title_hi VARCHAR(255),
    particulars_en VARCHAR(255) NOT NULL,
    particulars_hi VARCHAR(255),
    name_en VARCHAR(255) NOT NULL,
    name_hi VARCHAR(255),
    form_type VARCHAR(255) NOT NULL,
    file_url VARCHAR(255) NULL,
    word_url VARCHAR(255),
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE download_page_meta (
  id SERIAL PRIMARY KEY,
  page_type VARCHAR(50) UNIQUE NOT NULL,
  
  heading_en TEXT NOT NULL,
  heading_hi TEXT,
  
  subheading_en TEXT,
  subheading_hi TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);