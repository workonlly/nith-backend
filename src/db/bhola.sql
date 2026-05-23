CREATE TABLE homepage (
    id SERIAL PRIMARY KEY,

    
    heromaintext_en TEXT,
    herosubheading_en TEXT,
    herodescheading_en TEXT,

    
    heromaintext_hi TEXT,
    herosubheading_hi TEXT,
    herodescheading_hi TEXT,

    
    aboutdesc TEXT,

  
    createdat TIMESTAMP DEFAULT NOW(),
    updatedat TIMESTAMP DEFAULT NOW());

CREATE TABLE hero_image (

   id SERIAL PRIMARY KEY,

    image TEXT NOT NULL,
    image_url TEXT NOT NULL,

    createdat TIMESTAMP DEFAULT NOW()
);


INSERT INTO homepage (

    heromaintext,
    herosubheading,
    herodescheading,
    aboutdesc

)

VALUES (

    '',
    '',
    '',
    ''

);

/*  homepage-about */
CREATE TABLE about (
  id SERIAL PRIMARY KEY,

  title_en TEXT NOT NULL,
  title_hi TEXT NOT NULL,

  description_en TEXT NOT NULL,
  description_hi TEXT NOT NULL,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);


/* homepage-event*/

-- Create Events Table
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
    title_en VARCHAR(255) NOT NULL,
    title_hi VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    description_en TEXT NOT NULL,
    description_hi TEXT NOT NULL,
    category_en VARCHAR(100) NOT NULL,
    category_hi VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );


/* homepage-academics*/

-- Create academics Table
CREATE TABLE academics (
   id SERIAL PRIMARY KEY,
    title_en VARCHAR(255) NOT NULL,
    title_hi VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    description_en TEXT NOT NULL,
    description_hi TEXT NOT NULL,
    category_en VARCHAR(100) NOT NULL,
    category_hi VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

/* homepage-latest news*/

-- Create news Table
CREATE TABLE newss (
   id SERIAL PRIMARY KEY,
    title_en VARCHAR(255) NOT NULL,
    title_hi VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    description_en TEXT NOT NULL,
    description_hi TEXT NOT NULL,
    category_en VARCHAR(100) NOT NULL,
    category_hi VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

/* homepage-admissions*/

-- Create admissions Table
CREATE TABLE admissions (

   id SERIAL PRIMARY KEY,

  
  heading_en TEXT NOT NULL,
  heading_hi TEXT NOT NULL,

  
  title_en TEXT NOT NULL,
  title_hi TEXT NOT NULL,

  description_en TEXT NOT NULL,
  description_hi TEXT NOT NULL,

  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );


/* homepage-placements*/

-- Create placements Table

CREATE TABLE placements (
  id SERIAL PRIMARY KEY,

heading_en TEXT,
heading_hi TEXT,

stats JSONB,

recruitersheading_en TEXT,
recruitersheading_hi TEXT,

recruitersdescription_en TEXT,
recruitersdescription_hi TEXT,

toprecruiters_en JSONB,
toprecruiters_hi JSONB,

updatedat TIMESTAMP DEFAULT NOW()
);

/* homepage-achievements*/

-- Create achievements Table

CREATE TABLE achievements (
  id SERIAL PRIMARY KEY,

    
    tagline_en TEXT DEFAULT '',
    tagline_hi TEXT DEFAULT '',

    
    heading_en TEXT DEFAULT '',
    heading_hi TEXT DEFAULT '',

    
    description_en TEXT DEFAULT '',
    description_hi TEXT DEFAULT '',

  
    image TEXT DEFAULT '',

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
    );


/* homepage-director*/

-- Create director Table


CREATE TABLE director (
  id SERIAL PRIMARY KEY,

  image TEXT,

  label_en TEXT,
  label_hi TEXT,

  heading_en TEXT,
  heading_hi TEXT,

  name_en TEXT,
  name_hi TEXT,

  designation_en TEXT,
  designation_hi TEXT,

  institute_en TEXT,
  institute_hi TEXT,

  message_en TEXT,
  message_hi TEXT,

  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);


-- =========================
-- GALLERY SECTION TABLE
-- =========================

CREATE TABLE gallery_section (
  id SERIAL PRIMARY KEY,

    heading_en TEXT DEFAULT '',
    heading_hi TEXT DEFAULT '',

    description_en TEXT DEFAULT '',
    description_hi TEXT DEFAULT '',

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW());

-- =========================
-- GALLERY IMAGES TABLE
-- =========================

CREATE TABLE gallery_images (
   id SERIAL PRIMARY KEY,

    title_en TEXT DEFAULT '',
    title_hi TEXT DEFAULT '',

    category_en TEXT DEFAULT '',
    category_hi TEXT DEFAULT '',

    alt_text_en TEXT DEFAULT '',
    alt_text_hi TEXT DEFAULT '',

    image_url TEXT DEFAULT '',

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW());