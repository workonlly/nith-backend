const { sql } = require('./neon');

const timelineEvents = [
  { year: '1986', title: 'Establishment', description: 'Regional Engineering College, Hamirpur founded with two departments (Civil & Electrical Engineering) with an intake of 30 students in each.' },
  { year: '2002', title: 'Upgradation to NIT', description: 'REC Hamirpur was awarded the status of Deemed University and upgraded to National Institute of Technology.' },
  { year: '2007', title: 'National Importance Status', description: 'NIT Hamirpur was recognized as an Institute of National Importance under the National Institutes of Technology Act, 2007.' },
  { year: '2007', title: 'Act Enforced', description: 'The NIT Act provisions came into effect on 15 August 2007 via notification S.O. 1384(E) by the MHRD.' }
];

const coreValues = [
  { icon: 'ShieldCheck', title: 'Integrity', description: 'To be honest in intention, fair in evaluation, transparent in deeds, and adhere to the highest standards of ethics in all its activities.' },
  { icon: 'Trophy', title: 'Excellence', description: 'A relentless commitment to continuous improvement, innovation, and pursuit of best practices in education, research, and institutional performance.' },
  { icon: 'Users', title: 'Unity', description: 'Building capacity through trust, collaboration, and respect for others — fostering a culture of teamwork and inclusivity as the foundation of collective success.' },
  { icon: 'ClipboardCheck', title: 'Accountability', description: "To uphold responsibility in all academic and administrative processes, ensuring transparency, responsiveness, and reliability across the institute's functioning." },
  { icon: 'Globe', title: 'Inclusivity', description: 'Promoting a diverse and welcoming environment that values different perspectives, backgrounds, and experiences, ensuring equal opportunity for all.' },
  { icon: 'Heart', title: 'Empathy', description: 'Cultivating compassion and understanding towards the needs of students, staff, and society, fostering a supportive and nurturing institutional climate.' }
];

const missions = [
  { icon: 'Target', title: 'Academic Excellence', description: 'To build a strong foundation of knowledge in students through rigorous curriculum, hands-on learning, and exposure to emerging technologies.' },
  { icon: 'Lightbulb', title: 'Research & Innovation', description: 'To foster a culture of inquiry, critical thinking, and innovation by undertaking cutting-edge research addressing societal and industrial challenges.' },
  { icon: 'Handshake', title: 'Industry Connect', description: 'To strengthen collaboration with industries, research organizations, and academic peers globally for enhanced experiential learning and technology transfer.' },
  { icon: 'Users', title: 'Holistic Development', description: 'To impart ethical values, leadership skills, and entrepreneurial spirit among students, molding them into socially responsible global citizens.' }
];

const connectivityModes = [
  { icon: 'TrainIcon', title: 'By Rail', nearestPoint: 'Una Railway Station (Himachal Pradesh)', distance: 'Approximately 80 km', travelTime: '~2-3 hours', services: 'Una is well-linked to all parts of the country. Regular bus and taxi services are available from Una to Hamirpur.', additionalInfo: 'Trains from Delhi, Chandigarh, and Ambala connect to Una, from where road transport to Hamirpur takes around 2–3 hours.' },
  { icon: 'PlaneIcon', title: 'By Air', nearestPoint: 'Dharamshala Airport (Gaggal, District Kangra)', distance: 'About 75 km', travelTime: '~2 hours', services: 'Chandigarh International Airport — approximately 200 km (~4 hours). Both airports have taxi and cab facilities.', additionalInfo: 'Both airports have taxi and cab facilities directly to Hamirpur, with scenic routes through the Himalayan foothills.' },
  { icon: 'BusIcon', title: 'By Road', nearestPoint: 'National Highways NH-3', distance: '450 km from Delhi | 200 km from Chandigarh', travelTime: '~5 hours from Chandigarh', services: 'Frequent HRTC and private bus services connect Hamirpur to Delhi, Chandigarh, Shimla, Dharamshala, and other major cities.', additionalInfo: 'The campus is just 4 km from the main bus stand on the Hamirpur–Tauni Devi road.' }
];

const goals = [
  { icon: 'BookOpen', title: 'Academic Excellence', text: 'To implement NEP 2020 and modernize the curriculum to foster multidisciplinary learning and skill development.', stats_label: 'Programs Updated', stats_value: '100%' },
  { icon: 'Globe', title: 'Global Recognition', text: 'To improve national and international rankings through impactful research and quality education.', stats_label: 'Target NIRF Rank', stats_value: 'Top 50' },
  { icon: 'Lightbulb', title: 'Innovation Ecosystem', text: 'To establish state-of-the-art incubation centers and promote a strong culture of entrepreneurship and start-ups.', stats_label: 'Incubators Planned', stats_value: '3+' }
];

const roadmap = [
  { year: '2024-2025', title: 'Curriculum & Infrastructure', focus: 'Implementation of NEP 2020 guidelines across all programs.', items: ["Launch of Minor Degree programs", "Establishment of new interdisciplinary research centers", "Modernization of 50% of undergraduate laboratories"] },
  { year: '2026-2027', title: 'Research & Innovation', focus: 'Fostering a strong research culture and entrepreneurial ecosystem.', items: ["Target of 500+ high-impact factor publications annually", "Setting up a dedicated Technology Business Incubator (TBI)", "Filing 50+ patents per year"] },
  { year: '2028-2030', title: 'Global Standing', focus: 'Achieving global recognition and deep industry integration.', items: ["Securing position in QS World University Rankings", "Establishment of 5 Centers of Excellence with industry giants", "Achieving 100% placement with high average packages"] }
];

const cityInfo = [
  { icon: 'Mountain', title: 'Dhauladhar Ranges', description: 'Experience breathtaking views of the snow-capped Dhauladhar mountains right from the campus.', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { icon: 'Sun', title: 'Pleasant Climate', description: 'Enjoy a moderate climate throughout the year, perfect for academic pursuits and outdoor activities.', image_url: 'https://images.unsplash.com/photo-1600055745124-7f97548f4305?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { icon: 'Map', title: 'Strategic Location', description: 'Well-connected to major cities while maintaining the serenity of a hill station.', image_url: 'https://images.unsplash.com/photo-1593693397690-362cb9666cb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { icon: 'Coffee', title: 'Local Culture', description: 'Rich Himachali culture, warm hospitality, and safe environment for students.', image_url: 'https://images.unsplash.com/photo-1517176118179-6524490ce524?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
];

async function seed() {
  console.log("Creating tables...");
  
  // Read final.sql to execute the DDL
  const fs = require('fs');
  const path = require('path');
  const ddl = fs.readFileSync(path.join(__dirname, 'final.sql'), 'utf-8');
  // Just execute the array tables part
  const arrayDDL = ddl.split('-- DYNAMIC ARRAYS FOR ABOUT NITH')[1];
  if(arrayDDL) {
    const queries = arrayDDL.split(';').map(q => q.trim()).filter(q => q.length > 0);
    for (const q of queries) {
      await sql.query(q);
    }
  }

  console.log("Seeding Timeline...");
  await sql`TRUNCATE TABLE about_nith_timeline RESTART IDENTITY`;
  for(const t of timelineEvents) {
    await sql`INSERT INTO about_nith_timeline (year, title_en, title_hi, description_en, description_hi) VALUES (${t.year}, ${t.title}, ${t.title}, ${t.description}, ${t.description})`;
  }

  console.log("Seeding Core Values...");
  await sql`TRUNCATE TABLE about_nith_core_values RESTART IDENTITY`;
  for(const c of coreValues) {
    await sql`INSERT INTO about_nith_core_values (icon, title_en, title_hi, description_en, description_hi) VALUES (${c.icon}, ${c.title}, ${c.title}, ${c.description}, ${c.description})`;
  }

  console.log("Seeding Missions...");
  await sql`TRUNCATE TABLE about_nith_missions RESTART IDENTITY`;
  for(const m of missions) {
    await sql`INSERT INTO about_nith_missions (icon, title_en, title_hi, description_en, description_hi) VALUES (${m.icon}, ${m.title}, ${m.title}, ${m.description}, ${m.description})`;
  }

  console.log("Seeding Connectivity...");
  await sql`TRUNCATE TABLE about_nith_connectivity_modes RESTART IDENTITY`;
  for(const c of connectivityModes) {
    await sql`INSERT INTO about_nith_connectivity_modes (icon, title_en, title_hi, nearest_point_en, nearest_point_hi, distance_en, distance_hi, travel_time_en, travel_time_hi, services_en, services_hi, additional_info_en, additional_info_hi) 
    VALUES (${c.icon}, ${c.title}, ${c.title}, ${c.nearestPoint}, ${c.nearestPoint}, ${c.distance}, ${c.distance}, ${c.travelTime}, ${c.travelTime}, ${c.services}, ${c.services}, ${c.additionalInfo || ''}, ${c.additionalInfo || ''})`;
  }

  console.log("Seeding Goals...");
  await sql`TRUNCATE TABLE about_nith_goals RESTART IDENTITY`;
  for(const g of goals) {
    await sql`INSERT INTO about_nith_goals (icon, title_en, title_hi, text_en, text_hi, stats_label_en, stats_label_hi, stats_value) VALUES (${g.icon}, ${g.title}, ${g.title}, ${g.text}, ${g.text}, ${g.stats_label}, ${g.stats_label}, ${g.stats_value})`;
  }

  console.log("Seeding Roadmap...");
  await sql`TRUNCATE TABLE about_nith_roadmap RESTART IDENTITY`;
  for(const r of roadmap) {
    await sql`INSERT INTO about_nith_roadmap (year, title_en, title_hi, focus_en, focus_hi, items_en, items_hi) VALUES (${r.year}, ${r.title}, ${r.title}, ${r.focus}, ${r.focus}, ${JSON.stringify(r.items)}, ${JSON.stringify(r.items)})`;
  }

  console.log("Seeding City Info...");
  await sql`TRUNCATE TABLE about_nith_city_info RESTART IDENTITY`;
  for(const c of cityInfo) {
    await sql`INSERT INTO about_nith_city_info (icon, title_en, title_hi, description_en, description_hi, image_url) VALUES (${c.icon}, ${c.title}, ${c.title}, ${c.description}, ${c.description}, ${c.image_url})`;
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch(console.error);
