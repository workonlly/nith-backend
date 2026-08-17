const pool = require('./src/db/db');

async function seedAnnualAlumniMeet() {
  try {
    console.log('Seeding rich, realistic NIT Hamirpur Annual Alumni Meet data...');

    // 1. Ensure tables exist
    await pool.query(`
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
          upcoming_reg_open BOOLEAN DEFAULT true,
          upcoming_image TEXT,
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

      CREATE TABLE IF NOT EXISTS alumni_annual_meet_schedule (
          id SERIAL PRIMARY KEY,
          time_en VARCHAR(255),
          time_hn VARCHAR(255),
          activity_en VARCHAR(255),
          activity_hn VARCHAR(255),
          venue_en VARCHAR(255),
          venue_hn VARCHAR(255),
          speaker_en VARCHAR(255),
          speaker_hn VARCHAR(255)
      );

      CREATE TABLE IF NOT EXISTS alumni_annual_meet_past (
          id SERIAL PRIMARY KEY,
          year VARCHAR(50),
          theme_en VARCHAR(255),
          theme_hn VARCHAR(255),
          date_en VARCHAR(255),
          date_hn VARCHAR(255),
          highlights_en TEXT,
          highlights_hn TEXT,
          attendees INT,
          images TEXT
      );

      CREATE TABLE IF NOT EXISTS alumni_annual_meet_gallery (
          id SERIAL PRIMARY KEY,
          url TEXT,
          year VARCHAR(50),
          caption_en VARCHAR(255),
          caption_hn VARCHAR(255)
      );
    `);

    // 2. Populate Heading
    await pool.query('DELETE FROM alumni_annual_meet_heading');
    await pool.query(`
      INSERT INTO alumni_annual_meet_heading (
        title_en, title_hn, sub_title_en, sub_title_hn,
        about_title_en, about_title_hn,
        about_desc1_en, about_desc1_hn,
        about_desc2_en, about_desc2_hn,
        about_desc3_en, about_desc3_hn,
        upcoming_title_en, upcoming_title_hn,
        upcoming_theme_en, upcoming_theme_hn,
        upcoming_date_en, upcoming_date_hn,
        upcoming_venue_en, upcoming_venue_hn,
        upcoming_desc_en, upcoming_desc_hn,
        upcoming_reg_open,
        upcoming_image,
        involve_title_en, involve_title_hn,
        involve_desc_en, involve_desc_hn,
        contact_email, contact_phone,
        contact_address_en, contact_address_hn,
        connected_title_en, connected_title_hn,
        connected_desc_en, connected_desc_hn,
        link_register_label_en, link_register_label_hn, link_register_url,
        link_network_label_en, link_network_label_hn, link_network_url,
        link_endowment_label_en, link_endowment_label_hn, link_endowment_url,
        btn_join_label_en, btn_join_label_hn, btn_join_url,
        btn_sub_label_en, btn_sub_label_hn, btn_sub_url
      ) VALUES (
        'Annual Alumni Meet – NIT Hamirpur',
        'वार्षिक पूर्व छात्र सम्मेलन – एनआईटी हमीरपुर',
        'Celebrating shared traditions, innovation, and lifelong bonds with the proud alumni family across the globe.',
        'दुनिया भर में गर्वित पूर्व छात्र परिवार के साथ साझा परंपराओं, नवाचार और आजीवन बंधनों का उत्सव।',
        'About the Annual Alumni Meet',
        'वार्षिक पूर्व छात्र सम्मेलन के बारे में',
        'The Annual Alumni Meet of National Institute of Technology Hamirpur serves as a grand homecoming celebration uniting distinguished alumni, faculty, researchers, and students. It provides a timeless platform to reconnect with classmates, walk down the lush pine-clad memory lanes of Hamirpur, and cherish the enduring bond with the alma mater.',
        'राष्ट्रीय प्रौद्योगिकी संस्थान हमीरपुर का वार्षिक पूर्व छात्र सम्मेलन एक भव्य पुनर्मिलन उत्सव है जो प्रतिष्ठित पूर्व छात्रों, संकाय, शोधकर्ताओं और छात्रों को एकजुट करता है। यह सहपाठियों से फिर से जुड़ने, हमीरपुर की चीड़ की सुंदर वादियों की यादों में लौटने और अल्मा मेटर के साथ अपने स्थायी संबंध को संजोने का एक मंच प्रदान करता है।',
        'Over the course of this cherished annual rendezvous, alumni witness the modern infrastructural transformations of NITH, participate in interactive student mentorship roundtables, and deliberate upon industry-academia collaborative programs that empower the next generation of engineers and technologists.',
        'इस प्रतिष्ठित वार्षिक सम्मेलन के दौरान, पूर्व छात्र एनआईटीएच के आधुनिक बुनियादी ढांचे के परिवर्तनों को देखते हैं, छात्र परामर्श गोलमेज बैठकों में भाग लेते हैं, और उद्योग-अकादमिक सहयोग कार्यक्रमों पर विचार-विमर्श करते हैं जो इंजीनियरों और प्रौद्योगिकीविदों की अगली पीढ़ी को सशक्त बनाते हैं।',
        'The meet also features the prestigious Distinguished Alumni Awards ceremony, honoring exceptional alumni who have achieved exemplary milestones across multinational leadership, entrepreneurship, civil services, academic research, and community upliftment.',
        'सम्मेलन में प्रतिष्ठित विशिष्ट पूर्व छात्र पुरस्कार समारोह भी आयोजित किया जाता है, जिसमें बहुराष्ट्रीय नेतृत्व, उद्यमिता, सिविल सेवा, शैक्षणिक अनुसंधान और सामुदायिक उत्थान में असाधारण मील के पत्थर हासिल करने वाले पूर्व छात्रों को सम्मानित किया जाता है।',
        'Annual Alumni Homecoming Meet 2025',
        'वार्षिक पूर्व छात्र पुनर्मिलन सम्मेलन 2025',
        'Reconnecting Roots, Inspiring Futures',
        'जड़ों से जुड़ाव, भविष्य की प्रेरणा',
        'November 8–9, 2025',
        '8-9 नवंबर, 2025',
        'Auditorium Complex, NIT Hamirpur (H.P.)',
        'ऑडिटोरियम परिसर, एनआईटी हमीरपुर (हि.प्र.)',
        'Join hundreds of NITHians from batches spanning 1986 to 2024 for two memorable days of nostalgic walks, keynote addresses, department visitations, alumni sports fiesta, and an enchanting Himachali cultural gala dinner.',
        '1986 से 2024 तक के बैचों के सैकड़ों एनआईटीएचियंस के साथ दो यादगार दिनों के लिए जुड़ें, जिसमें पुरानी यादों की सैर, मुख्य भाषण, विभाग भ्रमण, पूर्व छात्र खेल उत्सव और एक मनमोहक हिमाचली सांस्कृतिक गाला डिनर शामिल हैं।',
        true,
        'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop',
        'Get in Touch with Alumni Cell',
        'पूर्व छात्र प्रकोष्ठ से संपर्क करें',
        'For queries regarding accommodation on campus, delegate passes, or batch reunion coordination:',
        'परिसर में आवास, प्रतिनिधि पास या बैच पुनर्मिलन समन्वय से संबंधित प्रश्नों के लिए संपर्क करें:',
        'dar@nith.ac.in',
        '+91-1972-254054 / 254634',
        'Office of Dean (Alumni & Resources), Administrative Block, NIT Hamirpur, Himachal Pradesh – 177005',
        'डीन (पूर्व छात्र और संसाधन) कार्यालय, प्रशासनिक भवन, एनआईटी हमीरपुर, हिमाचल प्रदेश - 177005',
        'Stay Connected with the Global NITH Network',
        'वैश्विक एनआईटीएच नेटवर्क से जुड़े रहें',
        'Engage with your alma mater, mentor dynamic student leaders, share job referrals, and leave an everlasting legacy.',
        'अपने अल्मा मेटर से जुड़ें, ऊर्जावान छात्र नेताओं का मार्गदर्शन करें, जॉब रेफरल साझा करें और एक स्थायी विरासत छोड़ें।',
        'Register for Homecoming 2025',
        'सम्मेलन 2025 के लिए पंजीकरण करें',
        '/alumni/registration',
        'Browse Alumni Directory',
        'पूर्व छात्र निर्देशिका देखें',
        '/alumni/list',
        'Contribute to Endowment Fund',
        'अक्षय निधि में योगदान करें',
        '/alumni/endowment-fund',
        'Alumni Portal Login',
        'पूर्व छात्र पोर्टल लॉगिन',
        '/alumni/registration',
        'Download Souvenir Booklet',
        'स्मारिका पुस्तिका डाउनलोड करें',
        '/Download_routes/Miscellaneous-Downloads/general'
      );
    `);
    console.log('✅ Seeded alumni_annual_meet_heading with rich content');

    // 3. Schedule
    await pool.query('DELETE FROM alumni_annual_meet_schedule');
    const scheduleItems = [
      {
        time_en: '09:00 AM – 10:00 AM',
        time_hn: 'सुबह 09:00 – 10:00 बजे',
        activity_en: 'Alumni Registration & Welcome Refreshments',
        activity_hn: 'पूर्व छात्र पंजीकरण एवं स्वागत जलपान',
        venue_en: 'Auditorium Foyer',
        venue_hn: 'ऑडिटोरियम फ़ोयर',
        speaker_en: 'Alumni Relations Student Team',
        speaker_hn: 'पूर्व छात्र संबंध छात्र टीम'
      },
      {
        time_en: '10:00 AM – 11:30 AM',
        time_hn: 'सुबह 10:00 – 11:30 बजे',
        activity_en: 'Inaugural Ceremony & Presidential Address by Director',
        activity_hn: 'उद्घाटन समारोह एवं निदेशक द्वारा अध्यक्षीय भाषण',
        venue_en: 'Main Institute Auditorium',
        venue_hn: 'मुख्य संस्थान प्रेक्षागृह',
        speaker_en: 'Prof. H. M. Suryawanshi (Director, NIT Hamirpur)',
        speaker_hn: 'प्रो. एच. एम. सूर्यवंशी (निदेशक, एनआईटी हमीरपुर)'
      },
      {
        time_en: '11:45 AM – 01:15 PM',
        time_hn: 'सुबह 11:45 – दोपहर 01:15 बजे',
        activity_en: 'Distinguished Alumni Awards & Silver Jubilee Batch Felicitation (Class of 2000)',
        activity_hn: 'विशिष्ट पूर्व छात्र पुरस्कार एवं रजत जयंती बैच अभिनंदन (2000 का बैच)',
        venue_en: 'Main Institute Auditorium',
        venue_hn: 'मुख्य संस्थान प्रेक्षागृह',
        speaker_en: 'Dean (Alumni & Resources)',
        speaker_hn: 'डीन (पूर्व छात्र और संसाधन)'
      },
      {
        time_en: '01:15 PM – 02:30 PM',
        time_hn: 'दोपहर 01:15 – 02:30 बजे',
        activity_en: 'Networking Lunch with Faculty & Department HoDs',
        activity_hn: 'संकाय और विभागाध्यक्षों के साथ नेटवर्किंग दोपहर का भोजन',
        venue_en: 'Institute Guest House Lawns',
        venue_hn: 'संस्थान अतिथि गृह लॉन',
        speaker_en: 'All Alumni & Faculty',
        speaker_hn: 'सभी पूर्व छात्र एवं संकाय'
      },
      {
        time_en: '02:30 PM – 04:30 PM',
        time_hn: 'दोपहर 02:30 – 04:30 बजे',
        activity_en: 'Departmental Walkthroughs, Lab Demonstrations & Interactive Student Panels',
        activity_hn: 'विभागीय भ्रमण, प्रयोगशाला प्रदर्शन और संवादात्मक छात्र सत्र',
        venue_en: 'Respective Department Blocks (CSE, ECE, ME, CE, EE, Chem)',
        venue_hn: 'संबंधित विभाग भवन (सीएसई, ईसीई, एमई, सीई, ईई, रसायन)',
        speaker_en: 'Head of Departments',
        speaker_hn: 'विभागाध्यक्ष'
      },
      {
        time_en: '05:30 PM – 07:00 PM',
        time_hn: 'शाम 05:30 – 07:00 बजे',
        activity_en: 'Friendly Alumni vs Students Cricket & Volleyball Matches',
        activity_hn: 'पूर्व छात्र बनाम छात्र मैत्रीपूर्ण क्रिकेट और वॉलीबॉल मैच',
        venue_en: 'Institute Sports Stadium',
        venue_hn: 'संस्थान खेल स्टेडियम',
        speaker_en: 'Sports Council',
        speaker_hn: 'खेल परिषद'
      },
      {
        time_en: '07:30 PM – 10:00 PM',
        time_hn: 'रात 07:30 – 10:00 बजे',
        activity_en: 'Gala Cultural Evening (Himachali Nati & Musical Performances) & Fellowship Dinner',
        activity_hn: 'सांस्कृतिक संध्या (हिमाचली नाटी और संगीत प्रस्तुतियां) और भव्य रात्रिभोज',
        venue_en: 'Open Air Theatre (OAT)',
        venue_hn: 'ओपन एयर थिएटर (ओएटी)',
        speaker_en: 'Student Cultural Clubs & Music Society',
        speaker_hn: 'छात्र सांस्कृतिक क्लब और संगीत सोसायटी'
      }
    ];

    for (const item of scheduleItems) {
      await pool.query(`
        INSERT INTO alumni_annual_meet_schedule (time_en, time_hn, activity_en, activity_hn, venue_en, venue_hn, speaker_en, speaker_hn)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [item.time_en, item.time_hn, item.activity_en, item.activity_hn, item.venue_en, item.venue_hn, item.speaker_en, item.speaker_hn]);
    }
    console.log(`✅ Seeded ${scheduleItems.length} schedule items`);

    // 4. Past Meets
    await pool.query('DELETE FROM alumni_annual_meet_past');
    const pastMeets = [
      {
        year: '2024',
        theme_en: 'Pinnacles of Progress: Honoring Four Decades of Engineering Legacy',
        theme_hn: 'प्रगति के शिखर: इंजीनियरिंग विरासत के चार दशकों का सम्मान',
        date_en: 'November 4–5, 2024',
        date_hn: '4-5 नवंबर, 2024',
        highlights_en: 'Over 450 alumni attended. Celebrated the Silver Jubilee of the 1999 batch. Inaugurated the Alumni Robotics Lab & Incubation Centre.',
        highlights_hn: '450 से अधिक पूर्व छात्रों ने भाग लिया। 1999 बैच की रजत जयंती मनाई गई। पूर्व छात्र रोबोटिक्स लैब और इनक्यूबेशन सेंटर का उद्घाटन किया गया।',
        attendees: 480,
        images: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop'
      },
      {
        year: '2023',
        theme_en: 'Sustainable Engineering & Global Leadership for a Greener Tomorrow',
        theme_hn: 'हरित कल के लिए सतत इंजीनियरिंग और वैश्विक नेतृत्व',
        date_en: 'October 14–15, 2023',
        date_hn: '14-15 अक्टूबर, 2023',
        highlights_en: 'Felicitation of Distinguished Alumni from Silicon Valley and Civil Services. Over 300 alumni participated in panel discussions on clean energy.',
        highlights_hn: 'सिलिकॉन वैली और सिविल सेवा के विशिष्ट पूर्व छात्रों का अभिनंदन। स्वच्छ ऊर्जा पर पैनल चर्चा में 300 से अधिक पूर्व छात्रों ने भाग लिया।',
        attendees: 360,
        images: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=800&auto=format&fit=crop'
      },
      {
        year: '2022',
        theme_en: 'Resilience and Reconnection: Rebuilding Global Ties Post-Pandemic',
        theme_hn: 'लचीलापन और पुनर्संयोजन: महामारी के बाद वैश्विक संबंधों का पुनर्निर्माण',
        date_en: 'November 19–20, 2022',
        date_hn: '19-20 नवंबर, 2022',
        highlights_en: 'Hybrid gathering with live streaming to chapters in USA, UK, and UAE. Launched the NITH Alumni Mentorship Program for undergraduate students.',
        highlights_hn: 'अमेरिका, ब्रिटेन और यूएई के अध्यायों के लिए लाइव स्ट्रीमिंग के साथ हाइब्रिड सम्मेलन। स्नातक छात्रों के लिए एनआईटीएच पूर्व छात्र मेंटरशिप कार्यक्रम शुरू किया गया।',
        attendees: 420,
        images: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800&auto=format&fit=crop'
      },
      {
        year: '2019',
        theme_en: 'From REC Hamirpur to NIT Hamirpur: Celebrating Excellence & Evolution',
        theme_hn: 'आरईसी हमीरपुर से एनआईटी हमीरपुर: उत्कृष्टता और विकास का जश्न',
        date_en: 'October 19–20, 2019',
        date_hn: '19-20 अक्टूबर, 2019',
        highlights_en: 'Massive reunion of REC era batches (1986–1995). Established the Student Financial Aid Endowment Fund.',
        highlights_hn: 'आरईसी युग के बैचों (1986-1995) का भव्य पुनर्मिलन। छात्र वित्तीय सहायता अक्षय निधि की स्थापना की गई।',
        attendees: 520,
        images: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop'
      }
    ];

    for (const item of pastMeets) {
      await pool.query(`
        INSERT INTO alumni_annual_meet_past (year, theme_en, theme_hn, date_en, date_hn, highlights_en, highlights_hn, attendees, images)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [item.year, item.theme_en, item.theme_hn, item.date_en, item.date_hn, item.highlights_en, item.highlights_hn, item.attendees, item.images]);
    }
    console.log(`✅ Seeded ${pastMeets.length} past meets`);

    // 5. Gallery
    await pool.query('DELETE FROM alumni_annual_meet_gallery');
    const galleryItems = [
      {
        url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
        year: '2024',
        caption_en: 'Alumni Group Photo with Director & Faculty in front of Admin Block',
        caption_hn: 'प्रशासनिक भवन के सामने निदेशक एवं संकाय के साथ पूर्व छात्रों का सामूहिक चित्र'
      },
      {
        url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop',
        year: '2024',
        caption_en: 'Lamp Lighting & Welcome Address at Main Auditorium',
        caption_hn: 'मुख्य प्रेक्षागृह में दीप प्रज्ज्वलन एवं स्वागत भाषण'
      },
      {
        url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800&auto=format&fit=crop',
        year: '2023',
        caption_en: 'Silver Jubilee Batch (1998) Felicitation & Memento Presentation',
        caption_hn: 'रजत जयंती बैच (1998) अभिनंदन एवं स्मृति चिन्ह भेंट'
      },
      {
        url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=800&auto=format&fit=crop',
        year: '2023',
        caption_en: 'Alumni Interaction and Mentorship Session with B.Tech Students',
        caption_hn: 'बी.टेक छात्रों के साथ पूर्व छात्र संवाद एवं परामर्श सत्र'
      },
      {
        url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop',
        year: '2022',
        caption_en: 'Vibrant Himachali Folk Dance (Nati) Performance during Cultural Night',
        caption_hn: 'सांस्कृतिक संध्या के दौरान जीवंत हिमाचली लोक नृत्य (नाटी) प्रस्तुति'
      },
      {
        url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop',
        year: '2019',
        caption_en: 'Fellowship Gala Dinner & Networking at Guest House Lawns',
        caption_hn: 'गेस्ट हाउस लॉन में फेलोशिप गाला डिनर और नेटवर्किंग'
      }
    ];

    for (const item of galleryItems) {
      await pool.query(`
        INSERT INTO alumni_annual_meet_gallery (url, year, caption_en, caption_hn)
        VALUES ($1, $2, $3, $4)
      `, [item.url, item.year, item.caption_en, item.caption_hn]);
    }
    console.log(`✅ Seeded ${galleryItems.length} gallery photos`);

    console.log('🎉 Successfully seeded rich NIT Hamirpur Annual Alumni Meet data!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding annual meet:', err);
    process.exit(1);
  }
}

seedAnnualAlumniMeet();
