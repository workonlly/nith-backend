const { sql } = require('./src/db/neon');

async function run() {
  try {
    await sql`
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
    `;
    await sql`
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
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS practice_paragraphs (
          id SERIAL PRIMARY KEY,
          page_id INTEGER REFERENCES core_values_page(id) ON DELETE CASCADE,
          paragraph_en TEXT,
          paragraph_hi TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Clear existing data
    await sql`DELETE FROM core_values_page`;
    await sql`DELETE FROM core_values`;
    await sql`DELETE FROM practice_paragraphs`;

    // Insert Main Page Data
    const pageData = {
      hero_heading: 'Our Core Values',
      hero_description: 'The principles that guide our work daily, shaping our culture and driving excellence in education and research.',
      pillars_label: 'Six Pillars',
      pillars_heading: 'Our Guiding Principles',
      pillars_subtitle: 'The foundation of our institutional excellence and ethical leadership',
      practice_label: 'In Practice',
      practice_heading: 'Our Vision in Action',
      practice_subtitle: 'How we bring these values to life every day'
    };

    const parent = await sql`
      INSERT INTO core_values_page (
        hero_heading_en, hero_heading_hi,
        hero_description_en, hero_description_hi,
        pillars_label_en, pillars_label_hi,
        pillars_heading_en, pillars_heading_hi,
        pillars_subtitle_en, pillars_subtitle_hi,
        practice_label_en, practice_label_hi,
        practice_heading_en, practice_heading_hi,
        practice_subtitle_en, practice_subtitle_hi
      ) VALUES (
        ${pageData.hero_heading}, ${pageData.hero_heading},
        ${pageData.hero_description}, ${pageData.hero_description},
        ${pageData.pillars_label}, ${pageData.pillars_label},
        ${pageData.pillars_heading}, ${pageData.pillars_heading},
        ${pageData.pillars_subtitle}, ${pageData.pillars_subtitle},
        ${pageData.practice_label}, ${pageData.practice_label},
        ${pageData.practice_heading}, ${pageData.practice_heading},
        ${pageData.practice_subtitle}, ${pageData.practice_subtitle}
      ) RETURNING id
    `;
    const pageId = parent[0].id;

    const coreValues = [
      {
        title: 'Integrity',
        description: 'To be honest in intention, fair in evaluation, transparent in deeds, and adhere to the highest standards of ethics in all its activities.',
      },
      {
        title: 'Excellence',
        description: 'A relentless commitment to continuous improvement, innovation, and pursuit of best practices in education, research, and institutional performance.',
      },
      {
        title: 'Unity',
        description: 'Building capacity through trust, collaboration, and respect for others — fostering a culture of teamwork and inclusivity as the foundation of collective success.',
      },
      {
        title: 'Accountability',
        description: "To uphold responsibility in all academic and administrative processes, ensuring transparency, responsiveness, and reliability across the institute's functioning.",
      },
      {
        title: 'Inclusivity',
        description: 'Embracing diversity by providing equal opportunities for all — irrespective of gender, culture, region, or background — fostering an environment of belonging and respect.',
      },
      {
        title: 'Empathy',
        description: 'Encouraging compassion and understanding toward others, valuing well-being, and nurturing a supportive academic and social ecosystem.',
      }
    ];

    for (const v of coreValues) {
      await sql`
        INSERT INTO core_values (page_id, title_en, title_hi, description_en, description_hi)
        VALUES (${pageId}, ${v.title}, ${v.title}, ${v.description}, ${v.description})
      `;
    }

    const practiceParagraphs = [
      'At NIT Hamirpur, these core values are not just statements — they are the foundation of our daily academic and administrative life. They guide our decisions, shape our culture, and inspire our community to strive for excellence.',
      'From fostering innovation in research to creating an inclusive environment for students from diverse backgrounds, we integrate these principles into every aspect of institutional functioning.',
      'Our commitment to accountability ensures transparency in governance, while empathy drives us to support the holistic development of every member of our academic family.',
      'Together, these values create a vibrant, ethical, and progressive institution dedicated to shaping future leaders and innovators.'
    ];

    for (const p of practiceParagraphs) {
      await sql`
        INSERT INTO practice_paragraphs (page_id, paragraph_en, paragraph_hi)
        VALUES (${pageId}, ${p}, ${p})
      `;
    }

    console.log('Core Values Tables created and seeded successfully.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
