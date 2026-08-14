const { sql } = require('./src/db/neon');

async function run() {
  try {
    await sql`
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
    `;

    await sql`
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
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS about_city_descriptions (
          id SERIAL PRIMARY KEY,
          reference_id INTEGER REFERENCES about_city(id) ON DELETE CASCADE,
          description_en TEXT,
          description_hi TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Clear existing data
    await sql`DELETE FROM about_city`;
    await sql`DELETE FROM about_city_info_cards`;
    await sql`DELETE FROM about_city_descriptions`;

    const pageData = {
      heading_en: 'About Hamirpur',
      heading_hi: 'हमीरपुर के बारे में',
      introduction_en: 'Set in the peaceful hills of Himachal Pradesh, Hamirpur offers a clean, calm, and welcoming environment for all who visit NIT Hamirpur. With its friendly community and natural beauty, the city creates the perfect backdrop for learning, growth, and new beginnings.',
      introduction_hi: 'हिमाचल प्रदेश की शांत पहाड़ियों में स्थित, हमीरपुर NIT हमीरपुर आने वाले सभी लोगों के लिए एक स्वच्छ, शांत और स्वागत करने वाला वातावरण प्रदान करता है। अपने मित्रवत समुदाय और प्राकृतिक सुंदरता के साथ, शहर सीखने, विकास और नई शुरुआत के लिए सही पृष्ठभूमि बनाता है।',
      overview_title_en: 'City Overview',
      overview_title_hi: 'शहर का अवलोकन',
      overview_subtitle_en: 'Essential information about Hamirpur\'s location and characteristics',
      overview_subtitle_hi: 'हमीरपुर के स्थान और विशेषताओं के बारे में आवश्यक जानकारी'
    };

    const parent = await sql`
      INSERT INTO about_city (
        heading_en, heading_hi,
        introduction_en, introduction_hi,
        overview_title_en, overview_title_hi,
        overview_subtitle_en, overview_subtitle_hi
      ) VALUES (
        ${pageData.heading_en}, ${pageData.heading_hi},
        ${pageData.introduction_en}, ${pageData.introduction_hi},
        ${pageData.overview_title_en}, ${pageData.overview_title_hi},
        ${pageData.overview_subtitle_en}, ${pageData.overview_subtitle_hi}
      ) RETURNING id
    `;
    const pageId = parent[0].id;

    const infoCards = [
      {
        label_en: 'Location', label_hi: 'स्थान',
        value_en: 'Himachal Pradesh, India', value_hi: 'हिमाचल प्रदेश, भारत'
      },
      {
        label_en: 'Altitude', label_hi: 'ऊंचाई',
        value_en: '785 metres', value_hi: '785 मीटर'
      },
      {
        label_en: 'Connectivity', label_hi: 'संयोजकता',
        value_en: 'NH-3 & NH-103', value_hi: 'NH-3 & NH-103'
      }
    ];

    for (const info of infoCards) {
      await sql`
        INSERT INTO about_city_info_cards (reference_id, label_en, label_hi, value_en, value_hi)
        VALUES (${pageId}, ${info.label_en}, ${info.label_hi}, ${info.value_en}, ${info.value_hi})
      `;
    }

    const descriptions = [
      {
        en: 'Hamirpur, the district headquarter, is situated at an altitude of 785 meters in the Himalayan State of Himachal Pradesh, India. Hamirpur is a clean and eco-friendly district and is famous for its high literacy rate.',
        hi: 'हमीरपुर, जिला मुख्यालय, हिमाचल प्रदेश के हिमालयी राज्य में 785 मीटर की ऊंचाई पर स्थित है। हमीरपुर एक स्वच्छ और पर्यावरण के अनुकूल जिला है और अपनी उच्च साक्षरता दर के लिए प्रसिद्ध है।'
      },
      {
        en: 'Hamirpur City is surrounded by pine tree forest and has a good city infrastructure ranging from Quality Educational Institutions including NIT, State Universities and Skill Learning Centres.',
        hi: 'हमीरपुर शहर देवदार के जंगल से घिरा हुआ है और NIT, राज्य विश्वविद्यालयों और कौशल सीखने के केंद्रों सहित गुणवत्ता वाली शैक्षणिक संस्थाओं की अच्छी शहरी बुनियादी ढांचे है।'
      },
      {
        en: 'During winter, the climate is cold but pleasant when woolens are required. During summer the maximum temperature is around 40 degrees Celsius and cottons are recommended.',
        hi: 'सर्दियों में जलवायु ठंडी लेकिन सुखद होती है जब ऊनी कपड़ों की आवश्यकता होती है। गर्मी के दौरान अधिकतम तापमान लगभग 40 डिग्री सेल्सियस होता है और कपास की सिफारिश की जाती है।'
      },
      {
        en: 'It is a major junction on National Highway 3 while National Highway 103 starts from here. The bulk of the population speaks Hindi, with English widely understood.',
        hi: 'यह राष्ट्रीय राजमार्ग 3 पर एक प्रमुख जंक्शन है जबकि राष्ट्रीय राजमार्ग 103 यहां से शुरू होता है। अधिकांश आबादी हिंदी बोलती है, अंग्रेजी व्यापक रूप से समझी जाती है।'
      }
    ];

    for (const d of descriptions) {
      await sql`
        INSERT INTO about_city_descriptions (reference_id, description_en, description_hi)
        VALUES (${pageId}, ${d.en}, ${d.hi})
      `;
    }

    console.log('City Tables created and seeded successfully.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
