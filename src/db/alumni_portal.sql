-- Alumni Activities Heading
CREATE TABLE IF NOT EXISTS alumni_activities_heading (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255),
    title_hn VARCHAR(255),
    sub_title_en TEXT,
    sub_title_hn TEXT
);

-- Alumni Activities List
CREATE TABLE IF NOT EXISTS alumni_activities_list (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255),
    title_hn VARCHAR(255),
    description_en TEXT,
    description_hn TEXT,
    date_en VARCHAR(255),
    date_hn VARCHAR(255),
    category_en VARCHAR(255),
    category_hn VARCHAR(255),
    mode_en VARCHAR(255),
    mode_hn VARCHAR(255),
    location_en VARCHAR(255),
    location_hn VARCHAR(255)
);

-- Alumni MoU Heading
CREATE TABLE IF NOT EXISTS alumni_mou_heading (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255),
    title_hn VARCHAR(255),
    sub_title_en TEXT,
    sub_title_hn TEXT
);

-- Alumni MoU List
CREATE TABLE IF NOT EXISTS alumni_mou_list (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255),
    title_hn VARCHAR(255),
    drafted_date VARCHAR(255),
    document_url VARCHAR(255),
    file_type VARCHAR(50)
);

-- Alumni Functionaries Heading
CREATE TABLE IF NOT EXISTS alumni_functionaries_heading (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255),
    title_hn VARCHAR(255),
    sub_title_en TEXT,
    sub_title_hn TEXT
);

-- Alumni Functionaries List
CREATE TABLE IF NOT EXISTS alumni_functionaries_list (
    id SERIAL PRIMARY KEY,
    section_title_en VARCHAR(255),
    section_title_hn VARCHAR(255),
    sl_no VARCHAR(50),
    name_en VARCHAR(255),
    name_hn VARCHAR(255),
    responsibility_en VARCHAR(255),
    responsibility_hn VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255)
);

-- Alumni Assist Heading
CREATE TABLE IF NOT EXISTS alumni_assist_heading (
    id SERIAL PRIMARY KEY,
    title_en TEXT,
    title_hn TEXT,
    sub_title_en TEXT,
    sub_title_hn TEXT,
    note_title_en TEXT,
    note_title_hn TEXT,
    note_desc_en TEXT,
    note_desc_hn TEXT,
    fees_title_en TEXT,
    fees_title_hn TEXT
);

-- Alumni Assist Procedures
CREATE TABLE IF NOT EXISTS alumni_assist_procedures (
    id SERIAL PRIMARY KEY,
    section_title_en TEXT,
    section_title_hn TEXT,
    step_order INT,
    step_text_en TEXT,
    step_text_hn TEXT
);

-- Alumni Assist Fees
CREATE TABLE IF NOT EXISTS alumni_assist_fees (
    id SERIAL PRIMARY KEY,
    sl_no VARCHAR(50),
    name_en TEXT,
    name_hn TEXT,
    fee VARCHAR(50)
);

-- Alumni Distinguished Heading
CREATE TABLE IF NOT EXISTS alumni_distinguished_heading (
    id SERIAL PRIMARY KEY,
    title_en TEXT,
    title_hn TEXT,
    sub_title_en TEXT,
    sub_title_hn TEXT
);

-- Alumni Distinguished List
CREATE TABLE IF NOT EXISTS alumni_distinguished_list (
    id SERIAL PRIMARY KEY,
    name_en VARCHAR(255),
    name_hn VARCHAR(255),
    batch_en VARCHAR(255),
    batch_hn VARCHAR(255),
    photo TEXT,
    achievement_en TEXT,
    achievement_hn TEXT,
    department_en VARCHAR(255),
    department_hn VARCHAR(255),
    linkedin VARCHAR(255)
);

-- Alumni Registration Heading
CREATE TABLE IF NOT EXISTS alumni_registration_heading (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255),
    title_hn VARCHAR(255),
    sub_title_en TEXT,
    sub_title_hn TEXT,
    about_title_en VARCHAR(255),
    about_title_hn VARCHAR(255),
    about_sub_en TEXT,
    about_sub_hn TEXT,
    card1_title_en VARCHAR(255),
    card1_title_hn VARCHAR(255),
    card1_desc_en TEXT,
    card1_desc_hn TEXT,
    card2_title_en VARCHAR(255),
    card2_title_hn VARCHAR(255),
    card2_desc_en TEXT,
    card2_desc_hn TEXT,
    card3_title_en VARCHAR(255),
    card3_title_hn VARCHAR(255),
    card3_desc_en TEXT,
    card3_desc_hn TEXT,
    card4_title_en VARCHAR(255),
    card4_title_hn VARCHAR(255),
    card4_desc_en TEXT,
    card4_desc_hn TEXT,
    help_title_en VARCHAR(255),
    help_title_hn VARCHAR(255),
    help_desc_en TEXT,
    help_desc_hn TEXT,
    help_email VARCHAR(255),
    help_phone VARCHAR(255)
);

-- Alumni Registrations List
CREATE TABLE IF NOT EXISTS alumni_registrations (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255),
    roll_number VARCHAR(255),
    email VARCHAR(255),
    mobile VARCHAR(255),
    degree VARCHAR(255),
    department VARCHAR(255),
    passing_year VARCHAR(255),
    current_organization VARCHAR(255),
    designation VARCHAR(255),
    industry VARCHAR(255),
    current_city VARCHAR(255),
    current_country VARCHAR(255),
    areas_of_interest TEXT,
    willing_to_support VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alumni Endowment Heading & Config
CREATE TABLE IF NOT EXISTS alumni_endowment_heading (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255),
    title_hn VARCHAR(255),
    sub_title_en TEXT,
    sub_title_hn TEXT,
    about_title_en VARCHAR(255),
    about_title_hn VARCHAR(255),
    about_desc1_en TEXT,
    about_desc1_hn TEXT,
    about_desc2_en TEXT,
    about_desc2_hn TEXT,
    about_desc3_en TEXT,
    about_desc3_hn TEXT,
    obj1_title_en VARCHAR(255),
    obj1_title_hn VARCHAR(255),
    obj1_desc_en TEXT,
    obj1_desc_hn TEXT,
    obj2_title_en VARCHAR(255),
    obj2_title_hn VARCHAR(255),
    obj2_desc_en TEXT,
    obj2_desc_hn TEXT,
    obj3_title_en VARCHAR(255),
    obj3_title_hn VARCHAR(255),
    obj3_desc_en TEXT,
    obj3_desc_hn TEXT,
    obj4_title_en VARCHAR(255),
    obj4_title_hn VARCHAR(255),
    obj4_desc_en TEXT,
    obj4_desc_hn TEXT,
    obj5_title_en VARCHAR(255),
    obj5_title_hn VARCHAR(255),
    obj5_desc_en TEXT,
    obj5_desc_hn TEXT,
    obj6_title_en VARCHAR(255),
    obj6_title_hn VARCHAR(255),
    obj6_desc_en TEXT,
    obj6_desc_hn TEXT,
    trans_title_en VARCHAR(255),
    trans_title_hn VARCHAR(255),
    trans_desc_en TEXT,
    trans_desc_hn TEXT,
    trans1_title_en VARCHAR(255),
    trans1_title_hn VARCHAR(255),
    trans1_desc_en TEXT,
    trans1_desc_hn TEXT,
    trans2_title_en VARCHAR(255),
    trans2_title_hn VARCHAR(255),
    trans2_desc_en TEXT,
    trans2_desc_hn TEXT,
    trans3_title_en VARCHAR(255),
    trans3_title_hn VARCHAR(255),
    trans3_desc_en TEXT,
    trans3_desc_hn TEXT,
    contrib_title_en VARCHAR(255),
    contrib_title_hn VARCHAR(255),
    contrib_desc_en TEXT,
    contrib_desc_hn TEXT,
    contrib1_title_en VARCHAR(255),
    contrib1_title_hn VARCHAR(255),
    contrib1_desc_en TEXT,
    contrib1_desc_hn TEXT,
    contrib2_title_en VARCHAR(255),
    contrib2_title_hn VARCHAR(255),
    contrib2_desc_en TEXT,
    contrib2_desc_hn TEXT,
    contrib3_title_en VARCHAR(255),
    contrib3_title_hn VARCHAR(255),
    contrib3_desc_en TEXT,
    contrib3_desc_hn TEXT,
    contrib4_title_en VARCHAR(255),
    contrib4_title_hn VARCHAR(255),
    contrib4_desc_en TEXT,
    contrib4_desc_hn TEXT,
    contrib_btn1_en VARCHAR(255),
    contrib_btn1_hn VARCHAR(255),
    contrib_btn2_en VARCHAR(255),
    contrib_btn2_hn VARCHAR(255),
    contact_title_en VARCHAR(255),
    contact_title_hn VARCHAR(255),
    contact_office_title_en VARCHAR(255),
    contact_office_title_hn VARCHAR(255),
    contact_office_desc_en TEXT,
    contact_office_desc_hn TEXT,
    contact_email_title_en VARCHAR(255),
    contact_email_title_hn VARCHAR(255),
    contact_email_desc_en TEXT,
    contact_email_desc_hn TEXT,
    contact_phone_title_en VARCHAR(255),
    contact_phone_title_hn VARCHAR(255),
    contact_phone_desc_en TEXT,
    contact_phone_desc_hn TEXT,
    contact_hours_title_en VARCHAR(255),
    contact_hours_title_hn VARCHAR(255),
    contact_hours_desc_en TEXT,
    contact_hours_desc_hn TEXT
);

-- Alumni Endowment Initiatives
CREATE TABLE IF NOT EXISTS alumni_endowment_initiatives (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255),
    title_hn VARCHAR(255),
    description_en TEXT,
    description_hn TEXT,
    status VARCHAR(50),
    year_en VARCHAR(100),
    year_hn VARCHAR(100),
    amount_en VARCHAR(100),
    amount_hn VARCHAR(100)
);

-- Alumni Award Heading
CREATE TABLE IF NOT EXISTS alumni_award_heading (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255),
    title_hn VARCHAR(255),
    sub_title_en TEXT,
    sub_title_hn TEXT,
    about_title_en VARCHAR(255),
    about_title_hn VARCHAR(255),
    about_desc_en TEXT,
    about_desc_hn TEXT,
    join_title_en VARCHAR(255),
    join_title_hn VARCHAR(255),
    join_desc_en TEXT,
    join_desc_hn TEXT,
    join_btn1_en VARCHAR(255),
    join_btn1_hn VARCHAR(255),
    join_btn2_en VARCHAR(255),
    join_btn2_hn VARCHAR(255),
    inquiries_text_en TEXT,
    inquiries_text_hn TEXT
);

-- Alumni Award Categories
CREATE TABLE IF NOT EXISTS alumni_award_categories (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255),
    title_hn VARCHAR(255),
    description_en TEXT,
    description_hn TEXT,
    icon TEXT
);

-- Alumni Award Initiatives
CREATE TABLE IF NOT EXISTS alumni_award_initiatives (
    id SERIAL PRIMARY KEY,
    name_en VARCHAR(255),
    name_hn VARCHAR(255),
    initiated_by_en VARCHAR(255),
    initiated_by_hn VARCHAR(255),
    year_introduced INTEGER,
    frequency_en VARCHAR(255),
    frequency_hn VARCHAR(255),
    description_en TEXT,
    description_hn TEXT
);

-- Alumni Award Eligibility
CREATE TABLE IF NOT EXISTS alumni_award_eligibility (
    id SERIAL PRIMARY KEY,
    step VARCHAR(50),
    title_en VARCHAR(255),
    title_hn VARCHAR(255),
    points_en TEXT,
    points_hn TEXT
);

-- Alumni Award Benefits
CREATE TABLE IF NOT EXISTS alumni_award_benefits (
    id SERIAL PRIMARY KEY,
    icon TEXT,
    title_en VARCHAR(255),
    title_hn VARCHAR(255),
    description_en TEXT,
    description_hn TEXT
);

-- Alumni Annual Meet Heading
CREATE TABLE IF NOT EXISTS alumni_annual_meet_heading (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255),
    title_hn VARCHAR(255),
    sub_title_en TEXT,
    sub_title_hn TEXT,
    about_title_en VARCHAR(255),
    about_title_hn VARCHAR(255),
    about_desc1_en TEXT,
    about_desc1_hn TEXT,
    about_desc2_en TEXT,
    about_desc2_hn TEXT,
    about_desc3_en TEXT,
    about_desc3_hn TEXT,
    
    upcoming_title_en VARCHAR(255),
    upcoming_title_hn VARCHAR(255),
    upcoming_theme_en VARCHAR(255),
    upcoming_theme_hn VARCHAR(255),
    upcoming_date_en VARCHAR(255),
    upcoming_date_hn VARCHAR(255),
    upcoming_venue_en VARCHAR(255),
    upcoming_venue_hn VARCHAR(255),
    upcoming_desc_en TEXT,
    upcoming_desc_hn TEXT,
    upcoming_reg_open BOOLEAN,
    
    involve_title_en VARCHAR(255),
    involve_title_hn VARCHAR(255),
    involve_desc_en TEXT,
    involve_desc_hn TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(255),
    contact_address_en TEXT,
    contact_address_hn TEXT,
    
    connected_title_en VARCHAR(255),
    connected_title_hn VARCHAR(255),
    connected_desc_en TEXT,
    connected_desc_hn TEXT,
    
    link_register_label_en VARCHAR(255),
    link_register_label_hn VARCHAR(255),
    link_register_url VARCHAR(255),
    link_network_label_en VARCHAR(255),
    link_network_label_hn VARCHAR(255),
    link_network_url VARCHAR(255),
    link_endowment_label_en VARCHAR(255),
    link_endowment_label_hn VARCHAR(255),
    link_endowment_url VARCHAR(255),
    btn_join_label_en VARCHAR(255),
    btn_join_label_hn VARCHAR(255),
    btn_join_url VARCHAR(255),
    btn_sub_label_en VARCHAR(255),
    btn_sub_label_hn VARCHAR(255),
    btn_sub_url VARCHAR(255)
);

-- Alumni Annual Meet Schedule
CREATE TABLE IF NOT EXISTS alumni_annual_meet_schedule (
    id SERIAL PRIMARY KEY,
    time_en VARCHAR(100),
    time_hn VARCHAR(100),
    activity_en VARCHAR(255),
    activity_hn VARCHAR(255),
    venue_en VARCHAR(255),
    venue_hn VARCHAR(255),
    speaker_en VARCHAR(255),
    speaker_hn VARCHAR(255)
);

-- Alumni Annual Meet Past
CREATE TABLE IF NOT EXISTS alumni_annual_meet_past (
    id SERIAL PRIMARY KEY,
    year VARCHAR(50),
    theme_en VARCHAR(255),
    theme_hn VARCHAR(255),
    date_en VARCHAR(255),
    date_hn VARCHAR(255),
    highlights_en TEXT,
    highlights_hn TEXT,
    attendees INTEGER,
    images TEXT
);

-- Alumni Annual Meet Gallery
CREATE TABLE IF NOT EXISTS alumni_annual_meet_gallery (
    id SERIAL PRIMARY KEY,
    url TEXT,
    year VARCHAR(50),
    caption_en VARCHAR(255),
    caption_hn VARCHAR(255)
);
