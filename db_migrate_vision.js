const { sql } = require('./src/db/neon');

async function run() {
  try {
    await sql`
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
    `;

    await sql`
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
    `;

    await sql`
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
    `;

    await sql`DELETE FROM vision_mission`;
    await sql`DELETE FROM vision_mission_pillars`;
    await sql`DELETE FROM vision_mission_legacy_stats`;

    const pageData = {
      guiding_principles_heading: 'Guiding Principles',
      guiding_principles_description: 'Our vision and mission define our commitment to academic excellence, research innovation, and holistic human development',
      vision_heading: "Building Tomorrow's Leaders",
      vision_subtitle: 'Our Vision',
      vision_description: 'To build a center of excellence in technical education and research that fosters innovation, critical thinking, and societal growth — empowering students to lead with vision, wisdom, and integrity.',
      strategic_objectives_heading: 'Strategic Objectives',
      mission_heading: 'Our Mission',
      mission_subtitle: 'Five core pillars that guide our institutional excellence',
      tagline: 'Innovation. Integrity. Impact.',
      tagline_description: 'Empowering minds, building futures, and advancing humanity through technology.',
      legacy_heading: 'Our Legacy',
      legacy_subheading: 'A tradition of excellence'
    };

    const parent = await sql`
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
        ${pageData.guiding_principles_heading}, ${pageData.guiding_principles_heading},
        ${pageData.guiding_principles_description}, ${pageData.guiding_principles_description},
        ${pageData.vision_heading}, ${pageData.vision_heading},
        ${pageData.vision_subtitle}, ${pageData.vision_subtitle},
        ${pageData.vision_description}, ${pageData.vision_description},
        ${pageData.strategic_objectives_heading}, ${pageData.strategic_objectives_heading},
        ${pageData.mission_heading}, ${pageData.mission_heading},
        ${pageData.mission_subtitle}, ${pageData.mission_subtitle},
        ${pageData.tagline}, ${pageData.tagline},
        ${pageData.tagline_description}, ${pageData.tagline_description},
        ${pageData.legacy_heading}, ${pageData.legacy_heading},
        ${pageData.legacy_subheading}, ${pageData.legacy_subheading}
      ) RETURNING id
    `;
    const pageId = parent[0].id;

    const missions = [
      {
        title: 'Academic Excellence',
        description: 'To provide high-quality technical education and foster an environment that encourages curiosity, creativity, and lifelong learning.'
      },
      {
        title: 'Research & Innovation',
        description: 'To promote cutting-edge research and innovation that contributes to sustainable technological and social development.'
      },
      {
        title: 'Holistic Development',
        description: 'To cultivate ethical values, leadership qualities, and teamwork among students for personal and professional excellence.'
      },
      {
        title: 'Social Contribution',
        description: 'To leverage technology and knowledge in service of society, addressing real-world challenges with compassion and responsibility.'
      },
      {
        title: 'Global Competence',
        description: 'To build collaborations with academic and research institutions globally for knowledge exchange and innovation.'
      }
    ];

    for (const m of missions) {
      await sql`
        INSERT INTO vision_mission_pillars (reference_id, title_en, title_hi, description_en, description_hi)
        VALUES (${pageId}, ${m.title}, ${m.title}, ${m.description}, ${m.description})
      `;
    }

    console.log('Vision & Mission Tables created and seeded successfully.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
