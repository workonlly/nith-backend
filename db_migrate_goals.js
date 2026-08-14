const { sql } = require('./src/db/neon');

async function run() {
  try {
    await sql`
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
    `;

    await sql`
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
    `;

    await sql`
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
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS cta_buttons (
          id SERIAL PRIMARY KEY,
          reference_id INTEGER REFERENCES goals(id) ON DELETE CASCADE,
          button_text_en VARCHAR(255),
          button_text_hi VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Clear existing data
    await sql`DELETE FROM goals`;
    await sql`DELETE FROM goal_items`;
    await sql`DELETE FROM action_steps`;
    await sql`DELETE FROM cta_buttons`;

    // Insert Main Page Data
    const pageData = {
      hero_heading: 'Our Strategic Goals',
      hero_description: 'Setting the course for institutional excellence, research innovation, and global recognition.',
      goals_heading: 'Core Objectives',
      goals_subtitle: 'The strategic priorities that drive our vision forward',
      tagline: 'Excellence in Action',
      tagline_description: 'Working together to achieve our goals.',
      strategy_heading: 'Implementation Roadmap',
      strategy_subheading: 'Action Plan',
      strategy_description: 'How we plan to achieve our strategic objectives',
      cta_heading: 'Join our journey',
      cta_description: 'Be a part of our success.'
    };

    const parent = await sql`
      INSERT INTO goals (
        hero_heading_en, hero_heading_hi,
        hero_description_en, hero_description_hi,
        goals_heading_en, goals_heading_hi,
        goals_subtitle_en, goals_subtitle_hi,
        tagline_en, tagline_hi,
        tagline_description_en, tagline_description_hi,
        strategy_heading_en, strategy_heading_hi,
        strategy_subheading_en, strategy_subheading_hi,
        strategy_description_en, strategy_description_hi,
        cta_heading_en, cta_heading_hi,
        cta_description_en, cta_description_hi
      ) VALUES (
        ${pageData.hero_heading}, ${pageData.hero_heading},
        ${pageData.hero_description}, ${pageData.hero_description},
        ${pageData.goals_heading}, ${pageData.goals_heading},
        ${pageData.goals_subtitle}, ${pageData.goals_subtitle},
        ${pageData.tagline}, ${pageData.tagline},
        ${pageData.tagline_description}, ${pageData.tagline_description},
        ${pageData.strategy_heading}, ${pageData.strategy_heading},
        ${pageData.strategy_subheading}, ${pageData.strategy_subheading},
        ${pageData.strategy_description}, ${pageData.strategy_description},
        ${pageData.cta_heading}, ${pageData.cta_heading},
        ${pageData.cta_description}, ${pageData.cta_description}
      ) RETURNING id
    `;
    const pageId = parent[0].id;

    const goalsItems = [
      {
        title: 'Academic Excellence',
        description: 'To strengthen academic programs through innovation in pedagogy, curriculum modernization, and outcome-based education.',
      },
      {
        title: 'Research and Innovation',
        description: 'To encourage interdisciplinary research and technological advancements that contribute to societal and industrial progress.',
      },
      {
        title: 'Global Collaboration',
        description: 'To establish partnerships with reputed international universities, research bodies, and industries to promote global knowledge exchange.',
      },
      {
        title: 'Sustainability & Environment',
        description: 'To embed sustainable practices in campus life, infrastructure, and research, ensuring eco-conscious growth and green initiatives.',
      },
      {
        title: 'Student Development',
        description: 'To nurture leadership, entrepreneurship, and ethics among students through holistic education and experiential learning.',
      },
      {
        title: 'Social Responsibility',
        description: 'To apply science and technology for addressing community needs and driving inclusive development at regional and national levels.',
      },
      {
        title: 'Infrastructure & Digital Growth',
        description: 'To continuously upgrade infrastructure and embrace digital transformation to enhance academic and administrative efficiency.',
      },
      {
        title: 'Faculty Empowerment',
        description: 'To promote continuous faculty training, research opportunities, and academic freedom for enhanced teaching and mentorship quality.',
      },
    ];

    for (const g of goalsItems) {
      await sql`
        INSERT INTO goal_items (reference_id, title_en, title_hi, description_en, description_hi, link_text_en, link_text_hi)
        VALUES (${pageId}, ${g.title}, ${g.title}, ${g.description}, ${g.description}, 'Learn more', 'Learn more')
      `;
    }

    const roadmap = [
      {
        title: 'Strengthening Teaching-Learning Framework',
        description: 'Regular curriculum revision and inclusion of modern technologies to enhance learning outcomes.',
      },
      {
        title: 'Enhancing Research Infrastructure',
        description: 'Developing state-of-the-art laboratories and research centers to foster cutting-edge innovation.',
      },
      {
        title: 'Building Industry Linkages',
        description: 'Establishing strong partnerships with leading industries for internships, placements, and collaborative research.',
      },
      {
        title: 'Promoting Global Exposure',
        description: 'Facilitating international collaborations, student exchange programs, and faculty development initiatives.',
      },
      {
        title: 'Ensuring Continuous Quality Improvement',
        description: 'Implementing robust quality assurance mechanisms and accreditation standards for sustained excellence.',
      },
    ];

    for (let i = 0; i < roadmap.length; i++) {
      const step = roadmap[i];
      const num = '0' + (i + 1);
      await sql`
        INSERT INTO action_steps (reference_id, step_number, title_en, title_hi, description_en, description_hi)
        VALUES (${pageId}, ${num}, ${step.title}, ${step.title}, ${step.description}, ${step.description})
      `;
    }

    console.log('Goals Tables created and seeded successfully.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
