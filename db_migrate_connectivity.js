const { sql } = require('./src/db/neon');

async function run() {
  try {
    await sql`
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
    `;

    await sql`
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
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS travel_service_paragraphs (
          id SERIAL PRIMARY KEY,
          travel_option_id INTEGER REFERENCES travel_options(id) ON DELETE CASCADE,
          paragraph_en TEXT,
          paragraph_hi TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Clear existing data
    await sql`DELETE FROM connectivity_page`;
    await sql`DELETE FROM travel_options`;
    await sql`DELETE FROM travel_service_paragraphs`;

    // Insert Main Page Data
    const pageData = {
      heroHeading: 'Getting Here',
      heroDescription: 'Find out how to reach us...',
      travelOptionsLabel: 'Modes',
      travelOptionsHeading: 'Travel Options',
      travelOptionsSubtitle: 'Select your preferred route and transit system'
    };

    const parent = await sql`
      INSERT INTO connectivity_page (
        hero_heading_en, hero_heading_hi,
        hero_description_en, hero_description_hi,
        travel_options_label_en, travel_options_label_hi,
        travel_options_heading_en, travel_options_heading_hi,
        travel_options_subtitle_en, travel_options_subtitle_hi
      ) VALUES (
        ${pageData.heroHeading}, ${pageData.heroHeading},
        ${pageData.heroDescription}, ${pageData.heroDescription},
        ${pageData.travelOptionsLabel}, ${pageData.travelOptionsLabel},
        ${pageData.travelOptionsHeading}, ${pageData.travelOptionsHeading},
        ${pageData.travelOptionsSubtitle}, ${pageData.travelOptionsSubtitle}
      ) RETURNING id
    `;
    const pageId = parent[0].id;

    const travelOptions = [
      {
        icon: 'TrainIcon',
        title: 'By Rail',
        nearestPoint: 'Una Railway Station (Himachal Pradesh)',
        distance: 'Approximately 80 km',
        travelTime: '~2-3 hours',
        servicesParagraphs: [
          'Una is well-linked to all parts of the country. Regular bus and taxi services are available from Una to Hamirpur.',
          'Trains from Delhi, Chandigarh, and Ambala connect to Una, from where road transport to Hamirpur takes around 2–3 hours.'
        ]
      },
      {
        icon: 'PlaneIcon',
        title: 'By Air',
        nearestPoint: 'Dharamshala Airport (Gaggal, District Kangra)',
        distance: 'About 75 km',
        travelTime: '~2 hours',
        servicesParagraphs: [
          'Chandigarh International Airport — approximately 200 km (~4 hours). Both airports have taxi and cab facilities.',
          'Both airports have taxi and cab facilities directly to Hamirpur, with scenic routes through the Himalayan foothills.'
        ]
      },
      {
        icon: 'BusIcon',
        title: 'By Road',
        nearestPoint: 'National Highways NH-3',
        distance: '450 km from Delhi | 200 km from Chandigarh',
        travelTime: '~5 hours from Chandigarh',
        servicesParagraphs: [
          'Frequent HRTC and private bus services connect Hamirpur to Delhi, Chandigarh, Shimla, Dharamshala, and other major cities.',
          'The campus is just 4 km from the main bus stand on the Hamirpur–Tauni Devi road.'
        ]
      }
    ];

    for (const opt of travelOptions) {
      const insertedOption = await sql`
        INSERT INTO travel_options (
          page_id, icon, title_en, title_hi,
          nearest_point_label_en, nearest_point_label_hi,
          nearest_point_value_en, nearest_point_value_hi,
          distance_label_en, distance_label_hi,
          distance_value_en, distance_value_hi,
          travel_time_en, travel_time_hi,
          services_label_en, services_label_hi
        ) VALUES (
          ${pageId}, ${opt.icon}, ${opt.title}, ${opt.title},
          'Nearest Station/Point', 'Nearest Station/Point',
          ${opt.nearestPoint}, ${opt.nearestPoint},
          'Distance', 'Distance',
          ${opt.distance}, ${opt.distance},
          ${opt.travelTime}, ${opt.travelTime},
          'Services & Routes', 'Services & Routes'
        ) RETURNING id
      `;
      const optionId = insertedOption[0].id;

      for (const p of opt.servicesParagraphs) {
        await sql`
          INSERT INTO travel_service_paragraphs (travel_option_id, paragraph_en, paragraph_hi)
          VALUES (${optionId}, ${p}, ${p})
        `;
      }
    }

    console.log('Connectivity Tables created and seeded successfully.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
