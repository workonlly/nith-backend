CREATE TABLE aboutnith_history (
    id SERIAL PRIMARY KEY,
    
    -- Main descriptions & legacy text in English and Hindi
    description1_en TEXT NULL,
    description1_hi TEXT NULL,
    
    description2_en TEXT NULL,
    description2_hi TEXT NULL,
    
    legacy_en TEXT NULL,
    legacy_hi TEXT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE aboutnith_history_timeline (
    id SERIAL PRIMARY KEY,
    reference_id INTEGER NOT NULL REFERENCES aboutnith_history(id) ON DELETE CASCADE,

    -- Timeline Parameters (Bilingual where applicable)
    year INTEGER NOT NULL,
    event_date DATE NULL,

    title_en VARCHAR(255) NULL,
    title_hi VARCHAR(255) NULL,
    
    subtitle_en VARCHAR(255) NULL,
    subtitle_hi VARCHAR(255) NULL,
    
    description_en TEXT NULL,
    description_hi TEXT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE vision_mission (
    id SERIAL PRIMARY KEY,

    -- Guiding Principles
    guiding_principles_heading_en VARCHAR(255) NULL,
    guiding_principles_heading_hi VARCHAR(255) NULL,
    guiding_principles_description_en TEXT NULL,
    guiding_principles_description_hi TEXT NULL,

    -- Vision Section
    vision_heading_en VARCHAR(255) NULL,
    vision_heading_hi VARCHAR(255) NULL,
    vision_subtitle_en VARCHAR(255) NULL,
    vision_subtitle_hi VARCHAR(255) NULL,
    vision_description_en TEXT NULL,
    vision_description_hi TEXT NULL,

    -- Strategic Objectives
    strategic_objectives_heading_en VARCHAR(255) NULL,
    strategic_objectives_heading_hi VARCHAR(255) NULL,

    -- Mission Section
    mission_heading_en VARCHAR(255) NULL,
    mission_heading_hi VARCHAR(255) NULL,
    mission_subtitle_en TEXT NULL,
    mission_subtitle_hi TEXT NULL,

    -- Tagline
    tagline_en VARCHAR(255) NULL,
    tagline_hi VARCHAR(255) NULL,
    tagline_description_en TEXT NULL,
    tagline_description_hi TEXT NULL,

    -- Legacy Section
    legacy_heading_en VARCHAR(255) NULL,
    legacy_heading_hi VARCHAR(255) NULL,
    legacy_subheading_en VARCHAR(255) NULL,
    legacy_subheading_hi VARCHAR(255) NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE vision_mission_pillars (
    id SERIAL PRIMARY KEY,
    reference_id INTEGER NOT NULL REFERENCES vision_mission(id) ON DELETE CASCADE,

    -- Pillar Title & Description (Bilingual)
    title_en VARCHAR(255) NULL,
    title_hi VARCHAR(255) NULL,
    description_en TEXT NULL,
    description_hi TEXT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE vision_mission_legacy_stats (
    id SERIAL PRIMARY KEY,
    reference_id INTEGER NOT NULL REFERENCES vision_mission(id) ON DELETE CASCADE,

    -- Stat Value (e.g., "100+", "99%"), Label, and Description (Bilingual)
    value_en VARCHAR(100) NULL,
    value_hi VARCHAR(100) NULL,
    label_en VARCHAR(255) NULL,
    label_hi VARCHAR(255) NULL,
    description_en TEXT NULL,
    description_hi TEXT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE goals (
    id SERIAL PRIMARY KEY,

    -- Hero/Intro
    hero_heading_en VARCHAR(255) NULL,
    hero_heading_hi VARCHAR(255) NULL,
    hero_description_en TEXT NULL,
    hero_description_hi TEXT NULL,

    -- Sub Heading & Intro
    goals_heading_en VARCHAR(255) NULL,
    goals_heading_hi VARCHAR(255) NULL,
    goals_subtitle_en TEXT NULL,
    goals_subtitle_hi TEXT NULL,

    -- Tagline Section
    tagline_en VARCHAR(255) NULL,
    tagline_hi VARCHAR(255) NULL,
    tagline_description_en TEXT NULL,
    tagline_description_hi TEXT NULL,

    -- Strategy Section
    strategy_heading_en VARCHAR(255) NULL,
    strategy_heading_hi VARCHAR(255) NULL,
    strategy_subheading_en VARCHAR(255) NULL,
    strategy_subheading_hi VARCHAR(255) NULL,
    strategy_description_en TEXT NULL,
    strategy_description_hi TEXT NULL,

    -- Call To Action (CTA) Section
    cta_heading_en VARCHAR(255) NULL,
    cta_heading_hi VARCHAR(255) NULL,
    cta_description_en TEXT NULL,
    cta_description_hi TEXT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE goal_items (
    id SERIAL PRIMARY KEY,
    reference_id INTEGER NOT NULL REFERENCES goals(id) ON DELETE CASCADE,

    title_en VARCHAR(255) NULL,
    title_hi VARCHAR(255) NULL,

    description_en TEXT NULL,
    description_hi TEXT NULL,

    link_text_en VARCHAR(255) NULL,
    link_text_hi VARCHAR(255) NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE action_steps (
    id SERIAL PRIMARY KEY,
    reference_id INTEGER NOT NULL REFERENCES goals(id) ON DELETE CASCADE,

    step_number VARCHAR(50) NULL, -- Shared step identity identifier

    title_en VARCHAR(255) NULL,
    title_hi VARCHAR(255) NULL,

    description_en TEXT NULL,
    description_hi TEXT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE cta_buttons (
    id SERIAL PRIMARY KEY,
    reference_id INTEGER NOT NULL REFERENCES goals(id) ON DELETE CASCADE,

    button_text_en VARCHAR(255) NULL,
    button_text_hi VARCHAR(255) NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);




CREATE TABLE about_city (
    id SERIAL PRIMARY KEY,

   
    heading_en TEXT DEFAULT NULL,
    heading_hi TEXT DEFAULT NULL,

    introduction_en TEXT DEFAULT NULL,
    introduction_hi TEXT DEFAULT NULL,

    overview_title_en TEXT DEFAULT NULL,
    overview_title_hi TEXT DEFAULT NULL,

    overview_subtitle_en TEXT DEFAULT NULL,
    overview_subtitle_hi TEXT DEFAULT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE about_city_info_cards (
    id SERIAL PRIMARY KEY,
    reference_id INTEGER NOT NULL,

    label_en VARCHAR(255) DEFAULT NULL,
    label_hi VARCHAR(255) DEFAULT NULL,

    value_en VARCHAR(255) DEFAULT NULL,
    value_hi VARCHAR(255) DEFAULT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_about_city
        FOREIGN KEY (reference_id)
        REFERENCES about_city(id)
        ON DELETE CASCADE
);


CREATE TABLE about_city_descriptions (
    id SERIAL PRIMARY KEY,
    reference_id INTEGER NOT NULL,

    description_en TEXT DEFAULT NULL,
    description_hi TEXT DEFAULT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_about_city_description
        FOREIGN KEY (reference_id)
        REFERENCES about_city(id)
        ON DELETE CASCADE
);

CREATE TABLE core_values_page (
    id SERIAL PRIMARY KEY,

   
    hero_heading_en TEXT DEFAULT NULL,
    hero_heading_hi TEXT DEFAULT NULL,
    
    hero_description_en TEXT DEFAULT NULL,
    hero_description_hi TEXT DEFAULT NULL,

    pillars_label_en TEXT DEFAULT NULL,
    pillars_label_hi TEXT DEFAULT NULL,
    
    pillars_heading_en TEXT DEFAULT NULL,
    pillars_heading_hi TEXT DEFAULT NULL,
    
    pillars_subtitle_en TEXT DEFAULT NULL,
    pillars_subtitle_hi TEXT DEFAULT NULL,

    practice_label_en TEXT DEFAULT NULL,
    practice_label_hi TEXT DEFAULT NULL,
    
    practice_heading_en TEXT DEFAULT NULL,
    practice_heading_hi TEXT DEFAULT NULL,
    
    practice_subtitle_en TEXT DEFAULT NULL,
    practice_subtitle_hi TEXT DEFAULT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE core_values (
    id SERIAL PRIMARY KEY,
    page_id INTEGER REFERENCES core_values_page(id) ON DELETE CASCADE,

    title_en TEXT DEFAULT NULL,
    title_hi TEXT DEFAULT NULL,
    
    description_en TEXT DEFAULT NULL,
    description_hi TEXT DEFAULT NULL
);

CREATE TABLE practice_paragraphs (
    id SERIAL PRIMARY KEY,
    page_id INTEGER REFERENCES core_values_page(id) ON DELETE CASCADE,

    paragraph_en TEXT DEFAULT NULL,
    paragraph_hi TEXT DEFAULT NULL
);

CREATE TABLE connectivity_page (
    id SERIAL PRIMARY KEY,

    -- Localized Hero Section (Nullable to support mutual exclusivity)
    hero_heading_en TEXT DEFAULT NULL,
    hero_heading_hi TEXT DEFAULT NULL,
    
    hero_description_en TEXT DEFAULT NULL,
    hero_description_hi TEXT DEFAULT NULL,

    -- Localized Travel Options Headers
    travel_options_label_en TEXT DEFAULT NULL,
    travel_options_label_hi TEXT DEFAULT NULL,
    
    travel_options_heading_en TEXT DEFAULT NULL,
    travel_options_heading_hi TEXT DEFAULT NULL,
    
    travel_options_subtitle_en TEXT DEFAULT NULL,
    travel_options_subtitle_hi TEXT DEFAULT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE travel_options (
    id SERIAL PRIMARY KEY,
    page_id INTEGER REFERENCES connectivity_page(id) ON DELETE CASCADE,

    -- Non-translatable graphic/system key
    icon TEXT NOT NULL,

    -- Localized Fields
    title_en TEXT DEFAULT NULL,
    title_hi TEXT DEFAULT NULL,

    nearest_point_label_en TEXT DEFAULT NULL,
    nearest_point_label_hi TEXT DEFAULT NULL,
    
    nearest_point_value_en TEXT DEFAULT NULL,
    nearest_point_value_hi TEXT DEFAULT NULL,

    distance_label_en TEXT DEFAULT NULL,
    distance_label_hi TEXT DEFAULT NULL,
    
    distance_value_en TEXT DEFAULT NULL,
    distance_value_hi TEXT DEFAULT NULL,

    travel_time_en TEXT DEFAULT NULL,
    travel_time_hi TEXT DEFAULT NULL,

    services_label_en TEXT DEFAULT NULL,
    services_label_hi TEXT DEFAULT NULL
);


CREATE TABLE travel_service_paragraphs (
    id SERIAL PRIMARY KEY,
    travel_option_id INTEGER REFERENCES travel_options(id) ON DELETE CASCADE,

    -- Localized paragraph texts
    paragraph_en TEXT DEFAULT NULL,
    paragraph_hi TEXT DEFAULT NULL
);

-- Enable UUID generator extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table for Board of Governors Members
CREATE TABLE bog_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    affiliation VARCHAR(255) NOT NULL,
    position VARCHAR(150),
    email VARCHAR(255) NOT NULL UNIQUE,
    contact_phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for Meeting Minutes
CREATE TABLE bog_minutes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    meeting_date DATE NOT NULL,
    document_url VARCHAR(1024) NOT NULL, -- Stores URL generated by multer-s3
    uploaded_date DATE NOT NULL DEFAULT CURRENT_DATE,
    uploaded_by VARCHAR(150) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Database triggers to keep updated_at current
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bog_members_modtime BEFORE UPDATE ON bog_members FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_bog_minutes_modtime BEFORE UPDATE ON bog_minutes FOR EACH ROW EXECUTE PROCEDURE update_modified_column();



CREATE TABLE senate_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(255),
    affiliation VARCHAR(255),
    position VARCHAR(255),
    email VARCHAR(255),
    contact_phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE senate_minutes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    meeting_date DATE NOT NULL,
    document_url TEXT NOT NULL,
    uploaded_date DATE DEFAULT CURRENT_DATE,
    uploaded_by VARCHAR(255) DEFAULT 'Admin'
);



CREATE TABLE fc_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(255),
    affiliation VARCHAR(255),
    position VARCHAR(255),
    email VARCHAR(255),
    contact_phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fc_minutes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    meeting_date DATE NOT NULL,
    document_url TEXT NOT NULL,
    uploaded_date DATE DEFAULT CURRENT_DATE,
    uploaded_by VARCHAR(255) DEFAULT 'Admin'
);



CREATE TABLE bwc_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(255),
    affiliation VARCHAR(255),
    position VARCHAR(255),
    email VARCHAR(255),
    contact_phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bwc_minutes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    meeting_date DATE NOT NULL,
    document_url TEXT NOT NULL,
    uploaded_date DATE DEFAULT CURRENT_DATE,
    uploaded_by VARCHAR(255) DEFAULT 'Admin'
);