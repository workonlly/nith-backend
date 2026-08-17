const pool = require('./src/db/db');

async function seedAboutNith() {
  try {
    console.log('Connecting to Neon DB to setup & seed About NITH tables...');

    // 1. History Tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS aboutnith_history (
          id SERIAL PRIMARY KEY,
          description1_en TEXT,
          description2_en TEXT,
          legacy_en TEXT,
          description1_hi TEXT,
          description2_hi TEXT,
          legacy_hi TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS aboutnith_history_timeline (
          id SERIAL PRIMARY KEY,
          reference_id INTEGER REFERENCES aboutnith_history(id) ON DELETE CASCADE,
          year VARCHAR(255),
          event_date VARCHAR(255),
          subtitle_en VARCHAR(255),
          title_en VARCHAR(255),
          description_en TEXT,
          subtitle_hi VARCHAR(255),
          title_hi VARCHAR(255),
          description_hi TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS about_nith_timeline (
        id SERIAL PRIMARY KEY,
        year VARCHAR(50) NOT NULL,
        title_en VARCHAR(255) NOT NULL,
        title_hi VARCHAR(255) NOT NULL,
        description_en TEXT NOT NULL,
        description_hi TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    try {
      await pool.query('ALTER TABLE aboutnith_history_timeline ALTER COLUMN event_date TYPE VARCHAR(255);');
    } catch (e) {
      console.log('event_date column type already updated or altered');
    }

    // 2. Core Values Tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS core_values_page (
          id SERIAL PRIMARY KEY,
          hero_heading_en VARCHAR(255),
          hero_heading_hi VARCHAR(255),
          hero_description_en TEXT,
          hero_description_hi TEXT,
          pillars_label_en VARCHAR(255),
          pillars_label_hi VARCHAR(255),
          pillars_heading_en VARCHAR(255),
          pillars_heading_hi VARCHAR(255),
          pillars_subtitle_en VARCHAR(255),
          pillars_subtitle_hi VARCHAR(255),
          practice_label_en VARCHAR(255),
          practice_label_hi VARCHAR(255),
          practice_heading_en VARCHAR(255),
          practice_heading_hi VARCHAR(255),
          practice_subtitle_en VARCHAR(255),
          practice_subtitle_hi VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS core_values (
          id SERIAL PRIMARY KEY,
          page_id INTEGER REFERENCES core_values_page(id) ON DELETE CASCADE,
          title_en VARCHAR(255),
          title_hi VARCHAR(255),
          description_en TEXT,
          description_hi TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS practice_paragraphs (
          id SERIAL PRIMARY KEY,
          page_id INTEGER REFERENCES core_values_page(id) ON DELETE CASCADE,
          paragraph_en TEXT,
          paragraph_hi TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS about_nith_core_values (
        id SERIAL PRIMARY KEY,
        icon VARCHAR(100) NOT NULL,
        title_en VARCHAR(255) NOT NULL,
        title_hi VARCHAR(255) NOT NULL,
        description_en TEXT NOT NULL,
        description_hi TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Vision & Mission Tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vision_mission (
          id SERIAL PRIMARY KEY,
          guiding_principles_heading_en VARCHAR(255),
          guiding_principles_heading_hi VARCHAR(255),
          guiding_principles_description_en TEXT,
          guiding_principles_description_hi TEXT,
          vision_heading_en VARCHAR(255),
          vision_heading_hi VARCHAR(255),
          vision_subtitle_en VARCHAR(255),
          vision_subtitle_hi VARCHAR(255),
          vision_description_en TEXT,
          vision_description_hi TEXT,
          strategic_objectives_heading_en VARCHAR(255),
          strategic_objectives_heading_hi VARCHAR(255),
          mission_heading_en VARCHAR(255),
          mission_heading_hi VARCHAR(255),
          mission_subtitle_en VARCHAR(255),
          mission_subtitle_hi VARCHAR(255),
          tagline_en VARCHAR(255),
          tagline_hi VARCHAR(255),
          tagline_description_en TEXT,
          tagline_description_hi TEXT,
          legacy_heading_en VARCHAR(255),
          legacy_heading_hi VARCHAR(255),
          legacy_subheading_en VARCHAR(255),
          legacy_subheading_hi VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS vision_mission_pillars (
          id SERIAL PRIMARY KEY,
          reference_id INTEGER REFERENCES vision_mission(id) ON DELETE CASCADE,
          title_en VARCHAR(255),
          title_hi VARCHAR(255),
          description_en TEXT,
          description_hi TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS vision_mission_legacy_stats (
          id SERIAL PRIMARY KEY,
          reference_id INTEGER REFERENCES vision_mission(id) ON DELETE CASCADE,
          value_en VARCHAR(255),
          value_hi VARCHAR(255),
          label_en VARCHAR(255),
          label_hi VARCHAR(255),
          description_en TEXT,
          description_hi TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS about_nith_missions (
        id SERIAL PRIMARY KEY,
        icon VARCHAR(100) NOT NULL,
        title_en VARCHAR(255) NOT NULL,
        title_hi VARCHAR(255) NOT NULL,
        description_en TEXT NOT NULL,
        description_hi TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Connectivity Tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS connectivity_page (
          id SERIAL PRIMARY KEY,
          hero_heading_en VARCHAR(255),
          hero_heading_hi VARCHAR(255),
          hero_description_en TEXT,
          hero_description_hi TEXT,
          travel_options_label_en VARCHAR(255),
          travel_options_label_hi VARCHAR(255),
          travel_options_heading_en VARCHAR(255),
          travel_options_heading_hi VARCHAR(255),
          travel_options_subtitle_en VARCHAR(255),
          travel_options_subtitle_hi VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS travel_options (
          id SERIAL PRIMARY KEY,
          page_id INTEGER REFERENCES connectivity_page(id) ON DELETE CASCADE,
          icon VARCHAR(255),
          title_en VARCHAR(255),
          title_hi VARCHAR(255),
          nearest_point_label_en VARCHAR(255),
          nearest_point_label_hi VARCHAR(255),
          nearest_point_value_en VARCHAR(255),
          nearest_point_value_hi VARCHAR(255),
          distance_label_en VARCHAR(255),
          distance_label_hi VARCHAR(255),
          distance_value_en VARCHAR(255),
          distance_value_hi VARCHAR(255),
          travel_time_en VARCHAR(255),
          travel_time_hi VARCHAR(255),
          services_label_en VARCHAR(255),
          services_label_hi VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS travel_service_paragraphs (
          id SERIAL PRIMARY KEY,
          travel_option_id INTEGER REFERENCES travel_options(id) ON DELETE CASCADE,
          paragraph_en TEXT,
          paragraph_hi TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS about_nith_connectivity_modes (
        id SERIAL PRIMARY KEY,
        icon VARCHAR(100) NOT NULL,
        title_en VARCHAR(255) NOT NULL,
        title_hi VARCHAR(255) NOT NULL,
        nearest_point_en VARCHAR(255) NOT NULL,
        nearest_point_hi VARCHAR(255) NOT NULL,
        distance_en VARCHAR(255) NOT NULL,
        distance_hi VARCHAR(255) NOT NULL,
        travel_time_en VARCHAR(255),
        travel_time_hi VARCHAR(255),
        services_en TEXT NOT NULL,
        services_hi TEXT NOT NULL,
        additional_info_en TEXT,
        additional_info_hi TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. Goals & Roadmap Tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS goals (
          id SERIAL PRIMARY KEY,
          hero_heading_en VARCHAR(255),
          hero_heading_hi VARCHAR(255),
          hero_description_en TEXT,
          hero_description_hi TEXT,
          goals_heading_en VARCHAR(255),
          goals_heading_hi VARCHAR(255),
          goals_subtitle_en VARCHAR(255),
          goals_subtitle_hi VARCHAR(255),
          tagline_en VARCHAR(255),
          tagline_hi VARCHAR(255),
          tagline_description_en TEXT,
          tagline_description_hi TEXT,
          strategy_heading_en VARCHAR(255),
          strategy_heading_hi VARCHAR(255),
          strategy_subheading_en VARCHAR(255),
          strategy_subheading_hi VARCHAR(255),
          strategy_description_en TEXT,
          strategy_description_hi TEXT,
          cta_heading_en VARCHAR(255),
          cta_heading_hi VARCHAR(255),
          cta_description_en TEXT,
          cta_description_hi TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS goal_items (
          id SERIAL PRIMARY KEY,
          reference_id INTEGER REFERENCES goals(id) ON DELETE CASCADE,
          title_en VARCHAR(255),
          title_hi VARCHAR(255),
          description_en TEXT,
          description_hi TEXT,
          link_text_en VARCHAR(255),
          link_text_hi VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS action_steps (
          id SERIAL PRIMARY KEY,
          reference_id INTEGER REFERENCES goals(id) ON DELETE CASCADE,
          step_number VARCHAR(255),
          title_en VARCHAR(255),
          title_hi VARCHAR(255),
          description_en TEXT,
          description_hi TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS cta_buttons (
          id SERIAL PRIMARY KEY,
          reference_id INTEGER REFERENCES goals(id) ON DELETE CASCADE,
          button_text_en VARCHAR(255),
          button_text_hi VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS about_nith_goals (
        id SERIAL PRIMARY KEY,
        icon VARCHAR(100) NOT NULL,
        title_en VARCHAR(255) NOT NULL,
        title_hi VARCHAR(255) NOT NULL,
        text_en TEXT NOT NULL,
        text_hi TEXT NOT NULL,
        stats_label_en VARCHAR(255),
        stats_label_hi VARCHAR(255),
        stats_value VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS about_nith_roadmap (
        id SERIAL PRIMARY KEY,
        year VARCHAR(50) NOT NULL,
        title_en VARCHAR(255) NOT NULL,
        title_hi VARCHAR(255) NOT NULL,
        focus_en VARCHAR(255) NOT NULL,
        focus_hi VARCHAR(255) NOT NULL,
        items_en JSONB,
        items_hi JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 6. The City Tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS about_city (
          id SERIAL PRIMARY KEY,
          heading_en VARCHAR(255),
          heading_hi VARCHAR(255),
          introduction_en TEXT,
          introduction_hi TEXT,
          overview_title_en VARCHAR(255),
          overview_title_hi VARCHAR(255),
          overview_subtitle_en VARCHAR(255),
          overview_subtitle_hi VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS about_city_info_cards (
          id SERIAL PRIMARY KEY,
          reference_id INTEGER REFERENCES about_city(id) ON DELETE CASCADE,
          label_en VARCHAR(255),
          label_hi VARCHAR(255),
          value_en VARCHAR(255),
          value_hi VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS about_city_descriptions (
          id SERIAL PRIMARY KEY,
          reference_id INTEGER REFERENCES about_city(id) ON DELETE CASCADE,
          description_en TEXT,
          description_hi TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS about_nith_city_info (
        id SERIAL PRIMARY KEY,
        icon VARCHAR(100) NOT NULL,
        title_en VARCHAR(255) NOT NULL,
        title_hi VARCHAR(255) NOT NULL,
        description_en TEXT NOT NULL,
        description_hi TEXT NOT NULL,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Tables created or verified.');

    // =========================================================================
    // SEED DATA
    // =========================================================================

    // 1. HISTORY
    await pool.query('DELETE FROM aboutnith_history');
    const histRes = await pool.query(`
      INSERT INTO aboutnith_history (
        description1_en, description2_en, legacy_en,
        description1_hi, description2_hi, legacy_hi
      ) VALUES (
        'National Institute of Technology Hamirpur (NITH), nestled in the scenic Shivalik ranges of Himachal Pradesh, was established in 1986 as Regional Engineering College (REC) Hamirpur, a joint venture of the Government of India and the Government of Himachal Pradesh.',
        'The institute was upgraded to National Institute of Technology with Deemed University status on June 26, 2002, and later awarded the status of Institute of National Importance under the NIT Act 2007. Over the decades, NITH has emerged as a premier technical education institution committed to excellence in academics, groundbreaking research, and societal development.',
        'Spanning over 320 acres of lush pine-forested terrain, NIT Hamirpur is celebrated for its world-class academic environment, high-impact innovations, vibrant student life, and global alumni network.',
        'राष्ट्रीय प्रौद्योगिकी संस्थान हमीरपुर (एनआईटीएच), हिमाचल प्रदेश की सुरम्य शिवालिक पर्वतमाला में स्थित, 1986 में भारत सरकार और हिमाचल प्रदेश सरकार के एक संयुक्त उद्यम के रूप में क्षेत्रीय इंजीनियरिंग कॉलेज (आरईसी) हमीरपुर के रूप में स्थापित किया गया था।',
        'संस्थान को 26 जून 2002 को मानद विश्वविद्यालय के दर्जे के साथ राष्ट्रीय प्रौद्योगिकी संस्थान में अपग्रेड किया गया, और बाद में एनआईटी अधिनियम 2007 के तहत राष्ट्रीय महत्व का संस्थान घोषित किया गया। दशकों से, एनआईटी हमीरपुर शिक्षा, अनुसंधान और सामाजिक विकास में उत्कृष्टता के लिए प्रतिबद्ध एक प्रमुख संस्थान के रूप में उभरा है।',
        '320 एकड़ से अधिक हरे-भरे चीड़ के जंगलों में फैला, एनआईटी हमीरपुर अपने विश्वस्तरीय शैक्षणिक वातावरण, नवाचार, जीवंत छात्र जीवन और वैश्विक पूर्व छात्र नेटवर्क के लिए प्रसिद्ध है।'
      ) RETURNING id;
    `);
    const historyId = histRes.rows[0].id;

    await pool.query('DELETE FROM aboutnith_history_timeline');
    const timelineData = [
      {
        year: '1986',
        event_date: 'August 1986',
        subtitle_en: 'Inception of REC Hamirpur',
        title_en: 'Foundation as Regional Engineering College',
        description_en: 'Established as REC Hamirpur with Civil and Electrical Engineering undergraduate programmes to advance technical education in the Himalayan region.',
        subtitle_hi: 'आरईसी हमीरपुर की शुरुआत',
        title_hi: 'क्षेत्रीय इंजीनियरिंग कॉलेज के रूप में स्थापना',
        description_hi: 'हिमालयी क्षेत्र में तकनीकी शिक्षा को बढ़ावा देने के लिए सिविल और इलेक्ट्रिकल इंजीनियरिंग स्नातक कार्यक्रमों के साथ आरईसी हमीरपुर के रूप में स्थापित।'
      },
      {
        year: '1989',
        event_date: 'July 1989',
        subtitle_en: 'Departmental Expansion',
        title_en: 'Introduction of Mechanical and Electronics Disciplines',
        description_en: 'Expanded academic footprint with Mechanical Engineering and Electronics & Communication Engineering departments and laboratory complexes.',
        subtitle_hi: 'विभागीय विस्तार',
        title_hi: 'मैकेनिकल और इलेक्ट्रॉनिक्स विषयों की शुरुआत',
        description_hi: 'मैकेनिकल इंजीनियरिंग और इलेक्ट्रॉनिक्स एवं संचार इंजीनियरिंग विभागों और प्रयोगशाला परिसरों के साथ शैक्षणिक विस्तार।'
      },
      {
        year: '1995',
        event_date: 'March 1995',
        subtitle_en: 'Computing Age',
        title_en: 'Launch of Computer Science & Engineering',
        description_en: 'Established the Department of Computer Science & Engineering and campus-wide computer networking infrastructure.',
        subtitle_hi: 'कंप्यूटिंग युग',
        title_hi: 'कंप्यूटर साइंस एंड इंजीनियरिंग की शुरुआत',
        description_hi: 'कंप्यूटर साइंस एंड इंजीनियरिंग विभाग और परिसर-व्यापी कंप्यूटर नेटवर्किंग बुनियादी ढांचे की स्थापना।'
      },
      {
        year: '2002',
        event_date: '26 June 2002',
        subtitle_en: 'Elevation to NIT',
        title_en: 'Deemed University & National Institute of Technology',
        description_en: 'Upgraded to National Institute of Technology (NIT) with Deemed University status, empowering autonomous curriculum and advanced research degree offerings.',
        subtitle_hi: 'एनआईटी में उन्नयन',
        title_hi: 'डीम्ड यूनिवर्सिटी और राष्ट्रीय प्रौद्योगिकी संस्थान',
        description_hi: 'डीम्ड यूनिवर्सिटी के दर्जे के साथ राष्ट्रीय प्रौद्योगिकी संस्थान (एनआईटी) में अपग्रेड किया गया, जिससे स्वायत्त पाठ्यक्रम और उन्नत अनुसंधान कार्यक्रमों का मार्ग प्रशस्त हुआ।'
      },
      {
        year: '2007',
        event_date: '15 August 2007',
        subtitle_en: 'Parliamentary Act',
        title_en: 'Institute of National Importance (INI)',
        description_en: 'Enacted by the Parliament of India under the NIT Act 2007 as an Institute of National Importance, positioning NITH at the forefront of national education.',
        subtitle_hi: 'संसदीय अधिनियम',
        title_hi: 'राष्ट्रीय महत्व का संस्थान (आईएनआई)',
        description_hi: 'एनआईटी अधिनियम 2007 के तहत भारत की संसद द्वारा राष्ट्रीय महत्व के संस्थान के रूप में घोषित किया गया।'
      },
      {
        year: '2015',
        event_date: 'October 2015',
        subtitle_en: 'Research & Global Outreach',
        title_en: 'Centres of Excellence & International Collaborations',
        description_en: 'Inauguration of state-of-the-art research centres in Energy and Environmental Engineering, Materials Science, and MoUs with global universities.',
        subtitle_hi: 'अनुसंधान और वैश्विक पहुंच',
        title_hi: 'उत्कृष्टता केंद्र और अंतर्राष्ट्रीय सहयोग',
        description_hi: 'ऊर्जा और पर्यावरण इंजीनियरिंग, सामग्री विज्ञान में अत्याधुनिक अनुसंधान केंद्रों का उद्घाटन और वैश्विक विश्वविद्यालयों के साथ समझौता ज्ञापन।'
      },
      {
        year: '2025',
        event_date: 'Present & Beyond',
        subtitle_en: 'Smart Campus & Sustainable Future',
        title_en: 'Pioneering NEP 2020 & AI Interdisciplinary Research',
        description_en: 'Implementing multidisciplinary NEP 2020 curriculum, cutting-edge AI/ML centres, robust incubation ecosystems, and green sustainable campus initiatives.',
        subtitle_hi: 'स्मार्ट कैंपस और सतत भविष्य',
        title_hi: 'एनईपी 2020 और एआई अंतःविषय अनुसंधान में अग्रणी',
        description_hi: 'बहुविषयक एनईपी 2020 पाठ्यक्रम, अत्याधुनिक एआई/एमएल केंद्र, मजबूत इनक्यूबेशन पारिस्थितिकी तंत्र और हरित सतत परिसर पहल का कार्यान्वयन।'
      }
    ];

    for (const item of timelineData) {
      await pool.query(`
        INSERT INTO aboutnith_history_timeline (
          reference_id, year, event_date, subtitle_en, title_en, description_en, subtitle_hi, title_hi, description_hi
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [historyId, item.year, item.event_date, item.subtitle_en, item.title_en, item.description_en, item.subtitle_hi, item.title_hi, item.description_hi]);
    }

    await pool.query('DELETE FROM about_nith_timeline');
    for (const item of timelineData) {
      await pool.query(`
        INSERT INTO about_nith_timeline (year, title_en, title_hi, description_en, description_hi)
        VALUES ($1, $2, $3, $4, $5)
      `, [item.year, item.title_en, item.title_hi, item.description_en, item.description_hi]);
    }
    console.log('✅ Seeded History');

    // 2. CORE VALUES
    await pool.query('DELETE FROM core_values_page');
    const cvPageRes = await pool.query(`
      INSERT INTO core_values_page (
        hero_heading_en, hero_heading_hi, hero_description_en, hero_description_hi,
        pillars_label_en, pillars_label_hi, pillars_heading_en, pillars_heading_hi, pillars_subtitle_en, pillars_subtitle_hi,
        practice_label_en, practice_label_hi, practice_heading_en, practice_heading_hi, practice_subtitle_en, practice_subtitle_hi
      ) VALUES (
        'Core Values of NIT Hamirpur',
        'एनआईटी हमीरपुर के मूल मूल्य',
        'At National Institute of Technology Hamirpur, our core values represent the foundational principles that guide our academic endeavours, student development, research innovation, and societal commitment.',
        'राष्ट्रीय प्रौद्योगिकी संस्थान हमीरपुर में, हमारे मूल मूल्य उन आधारभूत सिद्धांतों का प्रतिनिधित्व करते हैं जो हमारे शैक्षणिक प्रयासों, छात्र विकास, अनुसंधान नवाचार और सामाजिक प्रतिबद्धता का मार्गदर्शन करते हैं।',
        'Foundational Pillars', 'आधारभूत स्तंभ', 'The Principles That Guide Us', 'सिद्धांत जो हमारा मार्गदर्शन करते हैं', 'Building a legacy of integrity, scientific curiosity, and holistic growth.', 'ईमानदारी, वैज्ञानिक जिज्ञासा और समग्र विकास की विरासत का निर्माण।',
        'Values in Practice', 'अभ्यास में मूल्य', 'Living Our Values Every Day', 'प्रतिदिन अपने मूल्यों को जीना', 'How our principles shape campus life, governance, research, and community outreach.', 'हमारे सिद्धांत परिसर के जीवन, शासन, अनुसंधान और सामुदायिक पहुंच को कैसे आकार देते हैं।'
      ) RETURNING id;
    `);
    const cvPageId = cvPageRes.rows[0].id;

    await pool.query('DELETE FROM core_values');
    await pool.query('DELETE FROM about_nith_core_values');
    const coreValuesData = [
      {
        icon: 'ShieldCheck',
        title_en: 'Integrity & Ethics',
        title_hi: 'सत्यनिष्ठा और नैतिकता',
        description_en: 'Upholding absolute honesty, moral responsibility, academic transparency, and uncompromising ethical conduct in all research and governance.',
        description_hi: 'सभी अनुसंधान और शासन में पूर्ण ईमानदारी, नैतिक जिम्मेदारी, शैक्षणिक पारदर्शिता और नैतिक आचरण को बनाए रखना।'
      },
      {
        icon: 'Trophy',
        title_en: 'Academic & Research Excellence',
        title_hi: 'शैक्षणिक और अनुसंधान उत्कृष्टता',
        description_en: 'Striving for global benchmarks in engineering, architecture, sciences, and humanities through rigorous pedagogy and high-impact scholarship.',
        description_hi: 'सख्त शिक्षण और उच्च-प्रभाव छात्रवृत्ति के माध्यम से इंजीनियरिंग, वास्तुकला, विज्ञान और मानविकी में वैश्विक बेंचमार्क हासिल करना।'
      },
      {
        icon: 'Globe',
        title_en: 'Innovation & Sustainability',
        title_hi: 'नवाचार और स्थिरता',
        description_en: 'Fostering inventive problem-solving focused on ecological preservation, renewable energy, circular economy, and socio-economic progress.',
        description_hi: 'पारिस्थितिक संरक्षण, नवीकरणीय ऊर्जा, चक्रीय अर्थव्यवस्था और सामाजिक-आर्थिक प्रगति पर केंद्रित समस्या-समाधान को बढ़ावा देना।'
      },
      {
        icon: 'Users',
        title_en: 'Inclusivity & Diversity',
        title_hi: 'समावेशिता और विविधता',
        description_en: 'Cultivating an empathetic, egalitarian, and collaborative campus culture that celebrates diverse cultures, perspectives, and talents.',
        description_hi: 'एक सहानुभूतिपूर्ण, समतावादी और सहयोगात्मक परिसर संस्कृति का निर्माण करना जो विविध संस्कृतियों, दृष्टिकोणों और प्रतिभाओं का सम्मान करती है।'
      },
      {
        icon: 'Heart',
        title_en: 'Social Responsibility & Patriotism',
        title_hi: 'सामाजिक उत्तरदायित्व और राष्ट्र सेवा',
        description_en: 'Dedicated to community welfare, rural transformation, technology transfer to hill areas, and national development goals (Atmanirbhar Bharat).',
        description_hi: 'सामुदायिक कल्याण, ग्रामीण परिवर्तन, पहाड़ी क्षेत्रों में प्रौद्योगिकी हस्तांतरण और राष्ट्रीय विकास लक्ष्यों (आत्मनिर्भर भारत) के लिए समर्पित।'
      },
      {
        icon: 'ClipboardCheck',
        title_en: 'Lifelong Learning & Leadership',
        title_hi: 'आजीवन सीखना और नेतृत्व',
        description_en: 'Nurturing adaptive curiosity, analytical resilience, and leadership qualities in students to excel in dynamically changing global landscapes.',
        description_hi: 'गतिशील रूप से बदलती वैश्विक चुनौतियों में उत्कृष्ट प्रदर्शन करने के लिए छात्रों में जिज्ञासा, विश्लेषणात्मक लचीलापन और नेतृत्व गुणों का पोषण करना।'
      }
    ];

    for (const item of coreValuesData) {
      await pool.query(`
        INSERT INTO core_values (page_id, title_en, title_hi, description_en, description_hi)
        VALUES ($1, $2, $3, $4, $5)
      `, [cvPageId, item.title_en, item.title_hi, item.description_en, item.description_hi]);

      await pool.query(`
        INSERT INTO about_nith_core_values (icon, title_en, title_hi, description_en, description_hi)
        VALUES ($1, $2, $3, $4, $5)
      `, [item.icon, item.title_en, item.title_hi, item.description_en, item.description_hi]);
    }

    await pool.query('DELETE FROM practice_paragraphs');
    const practiceParas = [
      {
        en: 'At NIT Hamirpur, values are not merely documented; they are embodied through democratic student councils, rigorous anti-plagiarism protocols, open-source technology initiatives, and active green-campus chapters.',
        hi: 'एनआईटी हमीरपुर में, मूल्य केवल प्रलेखित नहीं हैं; वे लोकतांत्रिक छात्र परिषदों, सख्त साहित्यिक चोरी-रोधी प्रोटोकॉल, ओपन-सोर्स प्रौद्योगिकी पहलों और सक्रिय हरित-परिसर अध्यायों के माध्यम से साकार होते हैं।'
      },
      {
        en: 'Through programmes like Unnat Bharat Abhiyan, IEEE Humanitarian Technology initiatives, and extensive rural outreach, our students and faculty actively deploy scientific solutions for societal upliftment across Himachal Pradesh and the nation.',
        hi: 'उन्नत भारत अभियान, आईईईई मानवीय प्रौद्योगिकी पहलों और व्यापक ग्रामीण पहुंच जैसे कार्यक्रमों के माध्यम से, हमारे छात्र और संकाय पूरे हिमाचल प्रदेश और देश में सामाजिक उत्थान के लिए सक्रिय रूप से वैज्ञानिक समाधान लागू करते हैं।'
      }
    ];

    for (const p of practiceParas) {
      await pool.query(`
        INSERT INTO practice_paragraphs (page_id, paragraph_en, paragraph_hi)
        VALUES ($1, $2, $3)
      `, [cvPageId, p.en, p.hi]);
    }
    console.log('✅ Seeded Core Values');

    // 3. VISION & MISSION
    await pool.query('DELETE FROM vision_mission');
    const vmRes = await pool.query(`
      INSERT INTO vision_mission (
        guiding_principles_heading_en, guiding_principles_heading_hi,
        guiding_principles_description_en, guiding_principles_description_hi,
        vision_heading_en, vision_heading_hi,
        vision_subtitle_en, vision_subtitle_hi,
        vision_description_en, vision_description_hi,
        strategic_objectives_heading_en, strategic_objectives_heading_hi,
        mission_heading_en, mission_heading_hi,
        mission_subtitle_en, mission_subtitle_hi,
        tagline_en, tagline_hi,
        tagline_description_en, tagline_description_hi,
        legacy_heading_en, legacy_heading_hi,
        legacy_subheading_en, legacy_subheading_hi
      ) VALUES (
        'Guiding Principles & Philosophy', 'मार्गदर्शक सिद्धांत और दर्शन',
        'Rooted in the pristine foothills of Himachal Pradesh, NIT Hamirpur draws inspiration from timeless values of knowledge seeking, technical mastery, and universal welfare.',
        'हिमाचल प्रदेश की प्राचीन तलहटी में स्थित, एनआईटी हमीरपुर ज्ञान प्राप्ति, तकनीकी दक्षता और सार्वभौमिक कल्याण के शाश्वत मूल्यों से प्रेरणा लेता है।',
        'Our Vision', 'हमारा विजन',
        'A Global Leader in Technical Education & Transformative Innovation', 'तकनीकी शिक्षा और परिवर्तनकारी नवाचार में एक वैश्विक अग्रणी',
        'To build a vibrant, multidisciplinary learning environment that fosters research excellence, sustainable technological solutions, ethical leadership, and global competence for the betterment of society and the nation.',
        'एक जीवंत, बहुविषयक शिक्षण वातावरण का निर्माण करना जो समाज और राष्ट्र की भलाई के लिए अनुसंधान उत्कृष्टता, सतत तकनीकी समाधान, नैतिक नेतृत्व और वैश्विक सक्षमता को बढ़ावा देता है।',
        'Strategic Mission Pillars', 'रणनीतिक मिशन स्तंभ',
        'Our Mission', 'हमारा मिशन',
        'Dedicated Paths Towards Academic & Societal Leadership', 'शैक्षणिक और सामाजिक नेतृत्व की दिशा में समर्पित मार्ग',
        'Education, Innovation & Excellence for Sustainable Future', 'सतत भविष्य के लिए शिक्षा, नवाचार और उत्कृष्टता',
        'Bridging the gap between Himalayan wisdom and 21st-century technological breakthroughs through collaborative research and industry integration.',
        'सहयोगात्मक अनुसंधान और उद्योग एकीकरण के माध्यम से हिमालयी ज्ञान और 21वीं सदी की तकनीकी प्रगति के बीच की दूरी को पाटना।',
        'Our Enduring Legacy & Impact', 'हमारी स्थायी विरासत और प्रभाव',
        'Decades of Empowering Minds and Shaping the Nation', 'दशकों से प्रतिभाओं को सशक्त बनाना और राष्ट्र को आकार देना'
      ) RETURNING id;
    `);
    const vmId = vmRes.rows[0].id;

    await pool.query('DELETE FROM vision_mission_pillars');
    await pool.query('DELETE FROM about_nith_missions');
    const missionsData = [
      {
        icon: 'BookOpen',
        title_en: 'Academic Excellence & Rigour',
        title_hi: 'शैक्षणिक उत्कृष्टता और कठोरता',
        description_en: 'Provide cutting-edge undergraduate, postgraduate, and doctoral education that meets international accreditation and dynamic industry requirements.',
        description_hi: 'अत्याधुनिक स्नातक, स्नातकोत्तर और डॉक्टरेट शिक्षा प्रदान करना जो अंतर्राष्ट्रीय मान्यता और गतिशील उद्योग आवश्यकताओं को पूरा करती है।'
      },
      {
        icon: 'Cpu',
        title_en: 'High-Impact Research & Innovation',
        title_hi: 'उच्च-प्रभाव अनुसंधान और नवाचार',
        description_en: 'Advance interdisciplinary research in clean energy, artificial intelligence, sustainable materials, and healthcare technology.',
        description_hi: 'स्वच्छ ऊर्जा, कृत्रिम बुद्धिमत्ता, सतत सामग्री और स्वास्थ्य प्रौद्योगिकी में अंतःविषय अनुसंधान को आगे बढ़ाना।'
      },
      {
        icon: 'Briefcase',
        title_en: 'Industry & Entrepreneurship Synergy',
        title_hi: 'उद्योग और उद्यमिता तालमेल',
        description_en: 'Promote startup ecosystems, patent commercialization, technology incubation, and corporate research alliances.',
        description_hi: 'स्टार्टअप पारिस्थितिकी तंत्र, पेटेंट व्यावसायीकरण, प्रौद्योगिकी इनक्यूबेशन और कॉर्पोरेट अनुसंधान गठबंधनों को बढ़ावा देना।'
      },
      {
        icon: 'Compass',
        title_en: 'Ethical Leadership & Social Impact',
        title_hi: 'नैतिक नेतृत्व और सामाजिक प्रभाव',
        description_en: 'Instill human values, environmental stewardship, empathy, and professional integrity in students for holistic nation-building.',
        description_hi: 'समग्र राष्ट्र निर्माण के लिए छात्रों में मानवीय मूल्यों, पर्यावरण संरक्षण, सहानुभूति और पेशेवर सत्यनिष्ठा का संचार करना।'
      }
    ];

    for (const item of missionsData) {
      await pool.query(`
        INSERT INTO vision_mission_pillars (reference_id, title_en, title_hi, description_en, description_hi)
        VALUES ($1, $2, $3, $4, $5)
      `, [vmId, item.title_en, item.title_hi, item.description_en, item.description_hi]);

      await pool.query(`
        INSERT INTO about_nith_missions (icon, title_en, title_hi, description_en, description_hi)
        VALUES ($1, $2, $3, $4, $5)
      `, [item.icon, item.title_en, item.title_hi, item.description_en, item.description_hi]);
    }

    await pool.query('DELETE FROM vision_mission_legacy_stats');
    const legacyStats = [
      { value_en: '320+', value_hi: '320+', label_en: 'Acres Lush Green Campus', label_hi: 'एकड़ हरा-भरा परिसर', description_en: 'Spread across picturesque Himalayan pine hills with state-of-the-art infrastructure.', description_hi: 'अत्याधुनिक बुनियादी ढांचे के साथ सुरम्य हिमालयी चीड़ की पहाड़ियों में फैला।' },
      { value_en: '4,500+', value_hi: '4,500+', label_en: 'Active Students', label_hi: 'सक्रिय छात्र', description_en: 'Enrolled in B.Tech, B.Arch, M.Tech, MBA, M.Sc, and PhD degree programmes.', description_hi: 'बी.टेक, बी.आर्क, एम.टेक, एमबीए, एम.एससी और पीएचडी कार्यक्रमों में नामांकित।' },
      { value_en: '25,000+', value_hi: '25,000+', label_en: 'Global Alumni', label_hi: 'वैश्विक पूर्व छात्र', description_en: 'Leading global enterprises, universities, civil services, and entrepreneurial ventures worldwide.', description_hi: 'दुनिया भर में वैश्विक उद्यमों, विश्वविद्यालयों, सिविल सेवाओं और उद्यमों का नेतृत्व कर रहे हैं।' },
      { value_en: '100+', value_hi: '100+', label_en: 'Patents & Research Labs', label_hi: 'पेटेंट और अनुसंधान प्रयोगशालाएं', description_en: 'Cutting-edge innovation in clean technology, smart grids, and computing sciences.', description_hi: 'स्वच्छ प्रौद्योगिकी, स्मार्ट ग्रिड और कंप्यूटिंग विज्ञान में अत्याधुनिक नवाचार।' }
    ];

    for (const stat of legacyStats) {
      await pool.query(`
        INSERT INTO vision_mission_legacy_stats (reference_id, value_en, value_hi, label_en, label_hi, description_en, description_hi)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [vmId, stat.value_en, stat.value_hi, stat.label_en, stat.label_hi, stat.description_en, stat.description_hi]);
    }
    console.log('✅ Seeded Vision & Mission');

    // 4. CONNECTIVITY
    await pool.query('DELETE FROM connectivity_page');
    const connRes = await pool.query(`
      INSERT INTO connectivity_page (
        hero_heading_en, hero_heading_hi, hero_description_en, hero_description_hi,
        travel_options_label_en, travel_options_label_hi, travel_options_heading_en, travel_options_heading_hi, travel_options_subtitle_en, travel_options_subtitle_hi
      ) VALUES (
        'How to Reach NIT Hamirpur',
        'एनआईटी हमीरपुर कैसे पहुँचें',
        'NIT Hamirpur is well-connected by road, rail, and air to major metropolitan hubs including New Delhi, Chandigarh, Kangra, and Shimla. Located at Anu, 4 km from Hamirpur city bus terminus.',
        'एनआईटी हमीरपुर नई दिल्ली, चंडीगढ़, कांगड़ा और शिमला सहित प्रमुख महानगरों से सड़क, रेल और हवाई मार्ग द्वारा अच्छी तरह से जुड़ा हुआ है। हमीरपुर शहर के बस टर्मिनल से 4 किमी दूर अनु में स्थित है।',
        'Modes of Transport', 'परिवहन के साधन', 'Travel Options & Connectivity Routes', 'यात्रा के विकल्प और संपर्क मार्ग',
        'Detailed guidelines for arriving via Air, Train, and Bus networks.', 'हवाई, ट्रेन और बस नेटवर्क के माध्यम से आने के लिए विस्तृत दिशानिर्देश।'
      ) RETURNING id;
    `);
    const connId = connRes.rows[0].id;

    await pool.query('DELETE FROM travel_options');
    await pool.query('DELETE FROM travel_service_paragraphs');
    await pool.query('DELETE FROM about_nith_connectivity_modes');

    const connectivityModes = [
      {
        icon: 'Plane',
        title_en: 'By Air',
        title_hi: 'हवाई मार्ग द्वारा',
        nearest_point_en: 'Gaggal Airport (Dharamshala/Kangra) / Chandigarh Airport',
        nearest_point_hi: 'गग्गल हवाई अड्डा (कांगड़ा/धर्मशाला) / चंडीगढ़ हवाई अड्डा',
        distance_en: '85 km from Gaggal / 210 km from Chandigarh',
        distance_hi: 'गग्गल से 85 किमी / चंडीगढ़ से 210 किमी',
        travel_time_en: '2.5 - 4.5 Hours by Taxi/Bus',
        travel_time_hi: 'टैक्सी/बस द्वारा 2.5 - 4.5 घंटे',
        services_en: 'Regular daily flights from New Delhi (DEL) to Kangra Airport (DHM) operated by Alliance Air, SpiceJet, and IndiGo. Direct taxis and frequent state transport buses are available from Kangra to Hamirpur.',
        services_hi: 'एलायंस एयर, स्पाइसजेट और इंडिगो द्वारा संचालित नई दिल्ली (DEL) से कांगड़ा हवाई अड्डे (DHM) के लिए नियमित दैनिक उड़ानें। कांगड़ा से हमीरपुर के लिए सीधी टैक्सियाँ और लगातार राज्य परिवहन बसें उपलब्ध हैं।',
        additional_info_en: 'Chandigarh International Airport (IXC) serves as a convenient alternative with nationwide flight connectivity and 4.5-hour direct highway access to Hamirpur.',
        additional_info_hi: 'चंडीगढ़ अंतर्राष्ट्रीय हवाई अड्डा (IXC) देशव्यापी उड़ान कनेक्टिविटी और हमीरपुर के लिए 4.5 घंटे के सीधे राजमार्ग पहुंच के साथ एक सुविधाजनक विकल्प के रूप में कार्य करता है।'
      },
      {
        icon: 'Train',
        title_en: 'By Train',
        title_hi: 'रेल मार्ग द्वारा',
        nearest_point_en: 'Una Himachal Railway Station (UHL) / Amb Andaura (AADR)',
        nearest_point_hi: 'ऊना हिमाचल रेलवे स्टेशन (UHL) / अंब अंदौरा (AADR)',
        distance_en: '78 km from Una / 80 km from Amb Andaura',
        distance_hi: 'ऊना से 78 किमी / अंब अंदौरा से 80 किमी',
        travel_time_en: '2 Hours by Bus / Taxi from Una',
        travel_time_hi: 'ऊना से बस / टैक्सी द्वारा 2 घंटे',
        services_en: 'Broad gauge railway stations with direct superfast and Vande Bharat Express connectivity to New Delhi (Vande Bharat Express 22447/22448, Himachal Express, Jan Shatabdi Express).',
        services_hi: 'नई दिल्ली के लिए सीधी सुपरफास्ट और वंदे भारत एक्सप्रेस कनेक्टिविटी वाले ब्रॉड गेज रेलवे स्टेशन (वंदे भारत एक्सप्रेस 22447/22448, हिमाचल एक्सप्रेस, जन शताब्दी एक्सप्रेस)।',
        additional_info_en: 'Round-the-clock HRTC buses and pre-paid taxis are easily available outside Una Railway Station directly to NIT Hamirpur campus.',
        additional_info_hi: 'ऊना रेलवे स्टेशन के बाहर से सीधे एनआईटी हमीरपुर परिसर के लिए 24 घंटे एचआरटीसी बसें और प्री-पेड टैक्सियां आसानी से उपलब्ध हैं।'
      },
      {
        icon: 'Bus',
        title_en: 'By Road / Bus',
        title_hi: 'सड़क / बस द्वारा',
        nearest_point_en: 'Hamirpur Main Bus Stand (ISBT Hamirpur)',
        nearest_point_hi: 'हमीरपुर मुख्य बस स्टैंड (आईएसबीटी हमीरपुर)',
        distance_en: '4 km from Campus (Anu)',
        distance_hi: 'परिसर (अनु) से 4 किमी',
        travel_time_en: '10 mins via local city bus or taxi',
        travel_time_hi: 'स्थानीय सिटी बस या टैक्सी द्वारा 10 मिनट',
        services_en: 'Direct overnight Deluxe and Volvo AC buses run daily by HRTC and private operators from ISBT Kashmiri Gate New Delhi (450 km, 8-9 hours), Chandigarh ISBT Sector 43 (200 km, 4.5 hours), and Shimla (145 km, 4 hours).',
        services_hi: 'आईएसबीटी कश्मीरी गेट नई दिल्ली (450 किमी, 8-9 घंटे), चंडीगढ़ आईएसबीटी सेक्टर 43 (200 किमी, 4.5 घंटे), और शिमला (145 किमी, 4 घंटे) से एचआरटीसी और निजी ऑपरेटरों द्वारा प्रतिदिन सीधी वोल्वो एसी बसें चलती हैं।',
        additional_info_en: 'Local buses and autorickshaws ply frequently from Hamirpur Main Bus Stand to NIT Campus Gate (Anu).',
        additional_info_hi: 'हमीरपुर मुख्य बस स्टैंड से एनआईटी कैंपस गेट (अनु) तक स्थानीय बसें और ऑटो रिक्शा लगातार चलते हैं।'
      }
    ];

    for (const item of connectivityModes) {
      const toRes = await pool.query(`
        INSERT INTO travel_options (
          page_id, icon, title_en, title_hi, nearest_point_label_en, nearest_point_label_hi, nearest_point_value_en, nearest_point_value_hi,
          distance_label_en, distance_label_hi, distance_value_en, distance_value_hi, travel_time_en, travel_time_hi, services_label_en, services_label_hi
        ) VALUES (
          $1, $2, $3, $4, 'Nearest Point', 'निकटतम बिंदु', $5, $6,
          'Distance', 'दूरी', $7, $8, $9, $10, 'Services & Routes', 'सेवाएं और मार्ग'
        ) RETURNING id;
      `, [connId, item.icon, item.title_en, item.title_hi, item.nearest_point_en, item.nearest_point_hi, item.distance_en, item.distance_hi, item.travel_time_en, item.travel_time_hi]);
      
      const toId = toRes.rows[0].id;

      await pool.query(`
        INSERT INTO travel_service_paragraphs (travel_option_id, paragraph_en, paragraph_hi)
        VALUES ($1, $2, $3), ($1, $4, $5)
      `, [toId, item.services_en, item.services_hi, item.additional_info_en, item.additional_info_hi]);

      await pool.query(`
        INSERT INTO about_nith_connectivity_modes (
          icon, title_en, title_hi, nearest_point_en, nearest_point_hi, distance_en, distance_hi,
          travel_time_en, travel_time_hi, services_en, services_hi, additional_info_en, additional_info_hi
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      `, [item.icon, item.title_en, item.title_hi, item.nearest_point_en, item.nearest_point_hi, item.distance_en, item.distance_hi, item.travel_time_en, item.travel_time_hi, item.services_en, item.services_hi, item.additional_info_en, item.additional_info_hi]);
    }
    console.log('✅ Seeded Connectivity');

    // 5. GOALS & ROADMAP
    await pool.query('DELETE FROM goals');
    const goalsRes = await pool.query(`
      INSERT INTO goals (
        hero_heading_en, hero_heading_hi, hero_description_en, hero_description_hi,
        goals_heading_en, goals_heading_hi, goals_subtitle_en, goals_subtitle_hi,
        tagline_en, tagline_hi, tagline_description_en, tagline_description_hi,
        strategy_heading_en, strategy_heading_hi, strategy_subheading_en, strategy_subheading_hi,
        strategy_description_en, strategy_description_hi,
        cta_heading_en, cta_heading_hi, cta_description_en, cta_description_hi
      ) VALUES (
        'Institutional Strategic Goals & Roadmap',
        'संस्थान के रणनीतिक लक्ष्य और रोडमैप',
        'Charting a transformative trajectory for academic distinction, global research competitiveness, state-of-the-art infrastructure, and sustainable Himalayan development.',
        'शैक्षणिक विशिष्टता, वैश्विक अनुसंधान प्रतिस्पर्धा, अत्याधुनिक बुनियादी ढांचे और सतत हिमालयी विकास के लिए एक परिवर्तनकारी प्रक्षेपवक्र का निर्माण।',
        'Key Strategic Objectives', 'प्रमुख रणनीतिक उद्देश्य', 'Milestones for Institutional Evolution', 'संस्थागत विकास के लिए मील के पत्थर',
        'Targeting Global Top Rankings & Societal Excellence', 'वैश्विक शीर्ष रैंकिंग और सामाजिक उत्कृष्टता का लक्ष्य',
        'Empowering generations of engineers, architects, and scientists to lead global transformations through cutting-edge technology and humane values.',
        'अत्याधुनिक प्रौद्योगिकी और मानवीय मूल्यों के माध्यम से वैश्विक परिवर्तनों का नेतृत्व करने के लिए इंजीनियरों, वास्तुकारों और वैज्ञानिकों की पीढ़ियों को सशक्त बनाना।',
        'Strategic Action Plan', 'रणनीतिक कार्य योजना', 'Methodology for Milestone Achievement', 'मील का पत्थर हासिल करने की कार्यप्रणाली',
        'Phased implementation of multidisciplinary research clusters, digital campus infrastructure, industry-backed patent commercialization, and green energy self-sufficiency.',
        'बहुविषयक अनुसंधान समूहों, डिजिटल परिसर बुनियादी ढांचे, उद्योग-समर्थित पेटेंट व्यावसायीकरण और हरित ऊर्जा आत्मनिर्भरता का चरणबद्ध कार्यान्वयन।',
        'Join Us in Shaping the Future', 'भविष्य को आकार देने में हमारे साथ जुड़ें',
        'Explore research partnerships, industry collaborations, and academic programmes at NIT Hamirpur.',
        'एनआईटी हमीरपुर में अनुसंधान साझेदारी, उद्योग सहयोग और शैक्षणिक कार्यक्रमों का अन्वेषण करें।'
      ) RETURNING id;
    `);
    const gId = goalsRes.rows[0].id;

    await pool.query('DELETE FROM goal_items');
    await pool.query('DELETE FROM action_steps');
    await pool.query('DELETE FROM cta_buttons');
    await pool.query('DELETE FROM about_nith_goals');
    await pool.query('DELETE FROM about_nith_roadmap');

    const goalsList = [
      {
        icon: 'Target',
        title_en: 'Rank Among Top 20 Institutes in India (NIRF)',
        title_hi: 'भारत के शीर्ष 20 संस्थानों में स्थान (एनआईआरएफ)',
        text_en: 'Enhance faculty-to-student ratios, high-impact indexed publications, patents, and campus placements to achieve top NIRF and QS world rankings.',
        text_hi: 'शीर्ष एनआईआरएफ और क्यूएस विश्व रैंकिंग प्राप्त करने के लिए संकाय-छात्र अनुपात, उच्च-प्रभाव प्रकाशनों, पेटेंट और परिसर प्लेसमेंट को बढ़ाना।',
        stats_label_en: 'Target Rank',
        stats_label_hi: 'लक्ष्य रैंक',
        stats_value: 'Top 20'
      },
      {
        icon: 'Zap',
        title_en: '100% Green & Zero Carbon Campus',
        title_hi: '100% हरित और शून्य कार्बन परिसर',
        text_en: 'Transition to 100% solar and micro-hydro energy, zero-waste recycling, electric intra-campus mobility, and rainwater harvesting.',
        text_hi: '100% सौर और लघु-जल ऊर्जा, शून्य-अपशिष्ट पुनर्चक्रण, इलेक्ट्रिक कैंपस मोबिलिटी और वर्षा जल संचयन में परिवर्तन।',
        stats_label_en: 'Green Energy Share',
        stats_label_hi: 'हरित ऊर्जा हिस्सा',
        stats_value: '100%'
      },
      {
        icon: 'TrendingUp',
        title_en: 'Interdisciplinary AI & Quantum Research Hub',
        title_hi: 'अंतःविषय एआई और क्वांटम अनुसंधान केंद्र',
        text_en: 'Establish dedicated centres of excellence for Artificial Intelligence, Quantum Computing, Climate Resilience, and Advanced Semiconductor design.',
        text_hi: 'आर्टिफिशियल इंटेलिजेंस, क्वांटम कंप्यूटिंग, जलवायु लचीलापन और उन्नत सेमीकंडक्टर डिजाइन के लिए समर्पित उत्कृष्टता केंद्र स्थापित करना।',
        stats_label_en: 'Centres of Excellence',
        stats_label_hi: 'उत्कृष्टता केंद्र',
        stats_value: '10+'
      },
      {
        icon: 'Award',
        title_en: 'Startup Incubation & 50+ New Patents Annually',
        title_hi: 'स्टार्टअप इनक्यूबेशन और प्रति वर्ष 50+ नए पेटेंट',
        text_en: 'Scale the Technology Business Incubator (TBI) to foster student startups, regional entrepreneurship, and intellectual property monetization.',
        text_hi: 'छात्र स्टार्टअप, क्षेत्रीय उद्यमिता और बौद्धिक संपदा मुद्रीकरण को बढ़ावा देने के लिए प्रौद्योगिकी व्यवसाय इनक्यूबेटर (टीबीआई) का विस्तार करना।',
        stats_label_en: 'Annual Patents & Startups',
        stats_label_hi: 'वार्षिक पेटेंट और स्टार्टअप',
        stats_value: '50+'
      }
    ];

    for (const g of goalsList) {
      await pool.query(`
        INSERT INTO goal_items (reference_id, title_en, title_hi, description_en, description_hi, link_text_en, link_text_hi)
        VALUES ($1, $2, $3, $4, $5, 'Learn More', 'और जानें')
      `, [gId, g.title_en, g.title_hi, g.text_en, g.text_hi]);

      await pool.query(`
        INSERT INTO about_nith_goals (icon, title_en, title_hi, text_en, text_hi, stats_label_en, stats_label_hi, stats_value)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [g.icon, g.title_en, g.title_hi, g.text_en, g.text_hi, g.stats_label_en, g.stats_label_hi, g.stats_value]);
    }

    const actionSteps = [
      { step: '01', title_en: 'Curriculum Overhaul with NEP 2020', title_hi: 'एनईपी 2020 के साथ पाठ्यक्रम में सुधार', desc_en: 'Flexible multi-entry/exit degree tracks, experiential laboratory learning, and industry co-taught subjects.', desc_hi: 'लचीले मल्टी-एंट्री/एग्जिट डिग्री ट्रैक, अनुभवात्मक प्रयोगशाला शिक्षण, और उद्योग सह-सिखाए गए विषय।' },
      { step: '02', title_en: 'Recruitment of Global Star Faculty', title_hi: 'वैश्विक विशेषज्ञ संकाय की भर्ती', desc_en: 'Attracting premier educators and researchers with competitive research seed grants and modernized laboratory facilities.', desc_hi: 'प्रतिस्पर्धी अनुसंधान बीज अनुदान और आधुनिक प्रयोगशाला सुविधाओं के साथ प्रमुख शिक्षकों और शोधकर्ताओं को आकर्षित करना।' },
      { step: '03', title_en: 'Strengthening International Alliances', title_hi: 'अंतर्राष्ट्रीय गठबंधनों को मजबूत करना', desc_en: 'Joint dual-degree programmes, student exchange initiatives, and collaborative funded international research consortia.', desc_hi: 'संयुक्त दोहरी-डिग्री कार्यक्रम, छात्र विनिमय पहल और सहयोगात्मक वित्त पोषित अंतर्राष्ट्रीय अनुसंधान संघ।' },
      { step: '04', title_en: 'High-Tech Himalayan Incubation Centre', title_hi: 'हाई-टेक हिमालयन इनक्यूबेशन सेंटर', desc_en: 'Empowering local communities with tech solutions in disaster management, cold-climate agriculture, and green tourism.', desc_hi: 'आपदा प्रबंधन, शीत-जलवायु कृषि और हरित पर्यटन में तकनीकी समाधानों के साथ स्थानीय समुदायों को सशक्त बनाना।' }
    ];

    for (const a of actionSteps) {
      await pool.query(`
        INSERT INTO action_steps (reference_id, step_number, title_en, title_hi, description_en, description_hi)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [gId, a.step, a.title_en, a.title_hi, a.desc_en, a.desc_hi]);
    }

    const roadmapData = [
      {
        year: '2025-2026',
        title_en: 'Phase 1: Academic Modernization & Infrastructure Expansion',
        title_hi: 'चरण 1: शैक्षणिक आधुनिकीकरण और बुनियादी ढांचा विस्तार',
        focus_en: 'NEP 2020 Full Rollout, High-Performance Computing Cluster, New Smart Lecture Complex',
        focus_hi: 'एनईपी 2020 पूर्ण रोलआउट, उच्च प्रदर्शन कंप्यूटिंग क्लस्टर, नया स्मार्ट व्याख्यान परिसर',
        items_en: ['Launch AI & Data Science B.Tech and M.Tech programmes', 'Install 2 MW rooftop solar grid on campus buildings', 'Modernize 35 core departmental laboratories'],
        items_hi: ['एआई और डेटा साइंस बी.टेक और एम.टेक कार्यक्रम शुरू करना', 'परिसर के भवनों पर 2 मेगावाट रूफटॉप सोलर ग्रिड स्थापित करना', '35 मुख्य विभागीय प्रयोगशालाओं का आधुनिकीकरण']
      },
      {
        year: '2027-2028',
        title_en: 'Phase 2: Global Research Collaborations & Innovation Surge',
        title_hi: 'चरण 2: वैश्विक अनुसंधान सहयोग और नवाचार वृद्धि',
        focus_en: 'International Joint Research Labs, Technology Transfer Accelerator, 100+ PhD Fellowships',
        focus_hi: 'अंतर्राष्ट्रीय संयुक्त अनुसंधान प्रयोगशालाएं, प्रौद्योगिकी हस्तांतरण त्वरक, 100+ पीएचडी फैलोशिप',
        items_en: ['Establish Joint Research Centre with Top 100 Global Universities', 'Incubate 25 deep-tech startups at NITH TBI', 'Scale annual research funding to INR 50+ Crores'],
        items_hi: ['शीर्ष 100 वैश्विक विश्वविद्यालयों के साथ संयुक्त अनुसंधान केंद्र स्थापित करना', 'एनआईटीएच टीबीआई में 25 डीप-टेक स्टार्टअप इनक्यूबेट करना', 'वार्षिक अनुसंधान निधि को 50+ करोड़ रुपये तक बढ़ाना']
      },
      {
        year: '2029-2030',
        title_en: 'Phase 3: Global Eminence & Net-Zero Model Himalayan Campus',
        title_hi: 'चरण 3: वैश्विक प्रतिष्ठा और नेट-जीरो मॉडल हिमालयी परिसर',
        focus_en: 'Top 500 QS World Ranking, Self-Sustaining Green Tech Ecosystem, World-Class Sports Complex',
        focus_hi: 'शीर्ष 500 क्यूएस विश्व रैंकिंग, आत्मनिर्भर ग्रीन टेक इकोसिस्टम, विश्व स्तरीय खेल परिसर',
        items_en: ['Achieve Top 15 NIRF Engineering Ranking', 'Complete 100% zero-waste and green-energy transformation', 'Establish Global Innovation Park for Himalayan Ecological Sustainability'],
        items_hi: ['शीर्ष 15 एनआईआरएफ इंजीनियरिंग रैंकिंग प्राप्त करना', '100% शून्य-अपशिष्ट और हरित-ऊर्जा परिवर्तन पूरा करना', 'हिमालयी पारिस्थितिक स्थिरता के लिए वैश्विक नवाचार पार्क स्थापित करना']
      }
    ];

    for (const r of roadmapData) {
      await pool.query(`
        INSERT INTO about_nith_roadmap (year, title_en, title_hi, focus_en, focus_hi, items_en, items_hi)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [r.year, r.title_en, r.title_hi, r.focus_en, r.focus_hi, JSON.stringify(r.items_en), JSON.stringify(r.items_hi)]);
    }
    console.log('✅ Seeded Goals & Roadmap');

    // 6. THE CITY (HAMIRPUR)
    await pool.query('DELETE FROM about_city');
    const cityRes = await pool.query(`
      INSERT INTO about_city (
        heading_en, heading_hi, introduction_en, introduction_hi,
        overview_title_en, overview_title_hi, overview_subtitle_en, overview_subtitle_hi
      ) VALUES (
        'About Hamirpur City',
        'हमीरपुर शहर के बारे में',
        'Hamirpur, the educational heartland of Himachal Pradesh, is a vibrant town nestled amidst the tranquil pine-clad hills of the Shivalik range. Renowned for having the highest literacy rate in the state and second highest in India, Hamirpur combines serene natural splendor with a rich cultural heritage and dynamic student community.',
        'हिमाचल प्रदेश का शैक्षणिक केंद्र हमीरपुर, शिवालिक पर्वतमाला की शांत चीड़ से ढकी पहाड़ियों के बीच बसा एक जीवंत शहर है। राज्य में सबसे अधिक साक्षरता दर और भारत में दूसरी सबसे अधिक साक्षरता दर के लिए प्रसिद्ध, हमीरपुर समृद्ध सांस्कृतिक विरासत और गतिशील छात्र समुदाय के साथ शांत प्राकृतिक वैभव को जोड़ता है।',
        'City Overview & Heritage', 'शहर का अवलोकन और विरासत',
        'Discover the History, Climate, Culture, and Attractions of Hamirpur.', 'हमीरपुर के इतिहास, जलवायु, संस्कृति और आकर्षणों की खोज करें।'
      ) RETURNING id;
    `);
    const cId = cityRes.rows[0].id;

    await pool.query('DELETE FROM about_city_info_cards');
    await pool.query('DELETE FROM about_city_descriptions');
    await pool.query('DELETE FROM about_nith_city_info');

    const cityCards = [
      { label_en: 'State & District', label_hi: 'राज्य और जिला', value_en: 'Himachal Pradesh (Hamirpur Dist.)', value_hi: 'हिमाचल प्रदेश (हमीरपुर जिला)' },
      { label_en: 'Elevation', label_hi: 'ऊंचाई', value_en: '785 metres (2,575 ft) AMSL', value_hi: '785 मीटर (2,575 फीट) औसत समुद्र तल से' },
      { label_en: 'Literacy Rate', label_hi: 'साक्षरता दर', value_en: '88.15% (Highest in Himachal Pradesh)', value_hi: '88.15% (हिमाचल प्रदेश में सर्वाधिक)' },
      { label_en: 'Climate', label_hi: 'जलवायु', value_en: 'Sub-tropical to Temperate (Pleasant)', value_hi: 'उपोष्णकटिबंधीय से समशीतोष्ण (सुहावना)' }
    ];

    for (const c of cityCards) {
      await pool.query(`
        INSERT INTO about_city_info_cards (reference_id, label_en, label_hi, value_en, value_hi)
        VALUES ($1, $2, $3, $4, $5)
      `, [cId, c.label_en, c.label_hi, c.value_en, c.value_hi]);
    }

    const cityDescs = [
      {
        en: 'Historical Significance: Named after Raja Hamir Chand of the Katoch dynasty who ruled the region from 1700 to 1740 AD, Hamirpur was part of the ancient Katoch kingdom of Kangra. The historic Sujanpur Tira fort and the Narvadeshwar Temple located nearby stand testimony to exquisite Kangra miniature art and monumental architecture.',
        hi: 'ऐतिहासिक महत्व: कटोच राजवंश के राजा हमीर चंद के नाम पर, जिन्होंने 1700 से 1740 ईस्वी तक इस क्षेत्र पर शासन किया था, हमीरपुर कांगड़ा के प्राचीन कटोच साम्राज्य का हिस्सा था। पास में स्थित ऐतिहासिक सुजानपुर टीरा किला और नर्वदेश्वर मंदिर उत्कृष्ट कांगड़ा लघु कला और स्मारकीय वास्तुकला के गवाह हैं।'
      },
      {
        en: 'Educational Hub: Nicknamed the "Education Capital of Himachal Pradesh", Hamirpur houses premier institutions including NIT Hamirpur, Himachal Pradesh Technical University (HPTU), Dr. Radhakrishnan Government Medical College, and numerous reputed central schools and polytechnic colleges.',
        hi: 'शैक्षणिक केंद्र: "हिमाचल प्रदेश की शिक्षा राजधानी" के उपनाम से प्रसिद्ध, हमीरपुर में एनआईटी हमीरपुर, हिमाचल प्रदेश तकनीकी विश्वविद्यालय (एचपीटीयू), डॉ. राधाकृष्णन राजकीय मेडिकल कॉलेज और कई प्रतिष्ठित केंद्रीय विद्यालय और पॉलिटेक्निक कॉलेज सहित प्रमुख संस्थान हैं।'
      },
      {
        en: 'Culture and Festivals: Celebrated for its warm hospitality, Pahari customs, folk dances like Jhamakda, and vibrant local fairs such as the historic Sujanpur Holi Fair and Hamir Utsav, the city offers students a safe, welcoming, and culturally enriching experience.',
        hi: 'संस्कृति और त्यौहार: अपने गर्मजोशी भरे आतिथ्य, पहाड़ी रीति-रिवाजों, झमाकड़ा जैसे लोक नृत्यों और ऐतिहासिक सुजानपुर होली मेले और हमीर उत्सव जैसे जीवंत स्थानीय मेलों के लिए प्रसिद्ध, यह शहर छात्रों को एक सुरक्षित, स्वागत योग्य और सांस्कृतिक रूप से समृद्ध अनुभव प्रदान करता है।'
      }
    ];

    for (const d of cityDescs) {
      await pool.query(`
        INSERT INTO about_city_descriptions (reference_id, description_en, description_hi)
        VALUES ($1, $2, $3)
      `, [cId, d.en, d.hi]);
    }

    const cityInfoCards = [
      {
        icon: 'Landmark',
        title_en: 'Historic Sujanpur Tira & Fort',
        title_hi: 'ऐतिहासिक सुजानपुर टीरा और किला',
        description_en: 'Built in 1748 AD by Raja Abhay Chand and expanded by Maharaja Sansar Chand, famed for Kangra wall paintings and the royal chaugan (ground).',
        description_hi: '1748 ईस्वी में राजा अभय चंद द्वारा निर्मित और महाराजा संसार चंद द्वारा विस्तारित, कांगड़ा भित्ति चित्रों और शाही चौगान के लिए प्रसिद्ध।',
        image_url: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=800&q=80'
      },
      {
        icon: 'Sparkles',
        title_en: 'Baba Balak Nath Temple, Deotsidh',
        title_hi: 'बाबा बालक नाथ मंदिर, दियोटसिद्ध',
        description_en: 'A holy cave shrine situated on the Dhaulagiri hill border attracting millions of pilgrims from across India and the globe during the Chaitra Fair.',
        description_hi: 'धौलागिरी पहाड़ी सीमा पर स्थित एक पवित्र गुफा मंदिर जो चैत्र मेले के दौरान भारत और दुनिया भर से लाखों तीर्थयात्रियों को आकर्षित करता है।',
        image_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80'
      },
      {
        icon: 'Sun',
        title_en: 'Scenic Pine Forests & Shivalik Vistas',
        title_hi: 'सुरम्य चीड़ के जंगल और शिवालिक दृश्य',
        description_en: 'Clean mountain air, invigorating nature trails, and breathtaking panoramic views of the snow-clad Dhauladhar peaks during winter months.',
        description_hi: 'स्वच्छ पहाड़ी हवा, स्फूर्तियुक्त प्रकृति ट्रेल्स और सर्दियों के महीनों के दौरान बर्फ से ढकी धौलाधार चोटियों के लुभावने दृश्य।',
        image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
      },
      {
        icon: 'GraduationCap',
        title_en: 'Premier Academic & Research Hub',
        title_hi: 'प्रमुख शैक्षणिक और अनुसंधान केंद्र',
        description_en: 'A thriving ecosystem of scholars, engineers, and scientists making Hamirpur a beacon of innovation and youth empowerment in North India.',
        description_hi: 'विद्वानों, इंजीनियरों और वैज्ञानिकों का एक संपन्न पारिस्थितिकी तंत्र जो हमीरपुर को उत्तर भारत में नवाचार और युवा सशक्तिकरण का एक प्रकाशस्तंभ बनाता है।',
        image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'
      }
    ];

    for (const info of cityInfoCards) {
      await pool.query(`
        INSERT INTO about_nith_city_info (icon, title_en, title_hi, description_en, description_hi, image_url)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [info.icon, info.title_en, info.title_hi, info.description_en, info.description_hi, info.image_url]);
    }
    console.log('✅ Seeded The City (Hamirpur)');

    console.log('🎉 ALL ABOUT NITH TABLES SETUP & SEEDED SUCCESSFULLY!');
    process.exit(0);
  } catch (err) {
    console.error('Error during About NITH setup & seed:', err);
    process.exit(1);
  }
}

seedAboutNith();
