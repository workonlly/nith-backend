const db = require('./db');

const academics = [
  {
    title_en: 'Academic Calendar Updated for 2026',
    title_hi: '2026 के लिए शैक्षणिक कैलेंडर अपडेट',
    date: '2026-08-10',
    description_en:
      'The institute has released the revised academic calendar with important registration, examination, and semester break dates for the new session.',
    description_hi:
      'संस्थान ने नए सत्र के लिए पंजीकरण, परीक्षा और सेमेस्टर अवकाश की महत्वपूर्ण तिथियों के साथ संशोधित शैक्षणिक कैलेंडर जारी किया है।',
    category_en: 'Notice',
    category_hi: 'सूचना',
  },
  {
    title_en: 'Minor Degree Applications Now Open',
    title_hi: 'माइनर डिग्री आवेदन अब खुले हैं',
    date: '2026-08-14',
    description_en:
      'Eligible students can apply for minor degree programmes in emerging domains through the academic portal before the deadline.',
    description_hi:
      'योग्य छात्र अकादमिक पोर्टल के माध्यम से अंतिम तिथि से पहले उभरते क्षेत्रों में माइनर डिग्री कार्यक्रमों के लिए आवेदन कर सकते हैं।',
    category_en: 'Academic Update',
    category_hi: 'शैक्षणिक अपडेट',
  },
  {
    title_en: 'Outcome-Based Education Workshop',
    title_hi: 'आउटकम-बेस्ड एजुकेशन कार्यशाला',
    date: '2026-08-21',
    description_en:
      'A faculty development workshop will be held to strengthen lesson planning, assessment design, and programme outcomes mapping.',
    description_hi:
      'पाठ योजना, मूल्यांकन डिजाइन और कार्यक्रम परिणाम मानचित्रण को मजबूत करने के लिए एक संकाय विकास कार्यशाला आयोजित की जाएगी।',
    category_en: 'Workshop',
    category_hi: 'कार्यशाला',
  },
  {
    title_en: 'Semester Fee Payment Extension',
    title_hi: 'सेमेस्टर शुल्क भुगतान विस्तार',
    date: '2026-08-25',
    description_en:
      'The fee payment deadline has been extended to help students complete pending payments without late penalties.',
    description_hi:
      'बिना विलंब शुल्क के लंबित भुगतान पूरा करने में सहायता के लिए शुल्क भुगतान की अंतिम तिथि बढ़ा दी गई है।',
    category_en: 'Important',
    category_hi: 'महत्वपूर्ण',
  },
];

const admissions = [
  {
    title_en: 'UG Counseling Round 2 Schedule',
    title_hi: 'यूजी काउंसलिंग राउंड 2 कार्यक्रम',
    date: '2026-08-12',
    description_en:
      'Round 2 counseling for undergraduate admissions will be conducted online with document verification and seat allotment updates.',
    description_hi:
      'स्नातक प्रवेश के लिए राउंड 2 काउंसलिंग ऑनलाइन आयोजित की जाएगी, जिसमें दस्तावेज़ सत्यापन और सीट आवंटन अपडेट शामिल होंगे।',
    category_en: 'Counseling',
    category_hi: 'काउंसलिंग',
  },
  {
    title_en: 'PG Spot Admission Notice',
    title_hi: 'पीजी स्पॉट एडमिशन सूचना',
    date: '2026-08-18',
    description_en:
      'Spot admission for select postgraduate programmes will be available after the first round of seat adjustments.',
    description_hi:
      'सीट समायोजन के पहले चरण के बाद चयनित स्नातकोत्तर कार्यक्रमों के लिए स्पॉट एडमिशन उपलब्ध होगा।',
    category_en: 'Admission',
    category_hi: 'प्रवेश',
  },
  {
    title_en: 'Hostel Reporting Instructions',
    title_hi: 'हॉस्टल रिपोर्टिंग निर्देश',
    date: '2026-08-24',
    description_en:
      'Newly admitted students should report to the hostels on the assigned date with fee receipts and identity documents.',
    description_hi:
      'नवप्रवेशित छात्रों को शुल्क रसीद और पहचान पत्र के साथ निर्धारित तिथि पर हॉस्टल में रिपोर्ट करना होगा।',
    category_en: 'Instructions',
    category_hi: 'निर्देश',
  },
];

const events = [
  {
    title_en: 'Orientation Program for Freshers',
    title_hi: 'नए छात्रों के लिए ओरिएंटेशन कार्यक्रम',
    date: '2026-08-19',
    description_en:
      'The orientation program will introduce first-year students to campus life, academic rules, and support services.',
    description_hi:
      'ओरिएंटेशन कार्यक्रम प्रथम वर्ष के छात्रों को परिसर जीवन, शैक्षणिक नियमों और सहायता सेवाओं से परिचित कराएगा।',
    category_en: 'Students',
    category_hi: 'छात्र',
  },
  {
    title_en: 'TechFest 2026 Registration Opens',
    title_hi: 'टेकफेस्ट 2026 पंजीकरण प्रारंभ',
    date: '2026-08-20',
    description_en:
      'Student teams can now register for coding, robotics, and innovation challenges in the annual tech festival.',
    description_hi:
      'छात्र टीमें अब वार्षिक तकनीकी उत्सव में कोडिंग, रोबोटिक्स और नवाचार चुनौतियों के लिए पंजीकरण कर सकती हैं।',
    category_en: 'Campus Life',
    category_hi: 'कैंपस',
  },
  {
    title_en: 'Guest Lecture on AI and Society',
    title_hi: 'एआई और समाज पर अतिथि व्याख्यान',
    date: '2026-08-28',
    description_en:
      'A guest lecture will explore ethical AI, research opportunities, and the impact of automation on higher education.',
    description_hi:
      'अतिथि व्याख्यान में नैतिक एआई, शोध अवसर और उच्च शिक्षा पर स्वचालन के प्रभाव पर चर्चा की जाएगी।',
    category_en: 'Lecture',
    category_hi: 'व्याख्यान',
  },
  {
    title_en: 'Inter-Department Sports Meet',
    title_hi: 'अंतर-विभागीय खेल प्रतियोगिता',
    date: '2026-09-03',
    description_en:
      'Departments will compete in athletics, football, badminton, and relay events across the main sports ground.',
    description_hi:
      'विभाग मुख्य खेल मैदान में एथलेटिक्स, फुटबॉल, बैडमिंटन और रिले स्पर्धाओं में भाग लेंगे।',
    category_en: 'Sports',
    category_hi: 'खेल',
  },
];

const newss = [
  {
    title_en: 'NIT Hamirpur Reports Strong Research Growth',
    title_hi: 'एनआईटी हमीरपुर में शोध में मजबूत वृद्धि',
    date: '2026-08-11',
    description_en:
      'New publications, funded projects, and collaborative labs have contributed to the institute’s latest research progress.',
    description_hi:
      'नई प्रकाशन, वित्तपोषित परियोजनाएँ और सहयोगी प्रयोगशालाओं ने संस्थान की हालिया शोध प्रगति में योगदान दिया है।',
    category_en: 'Research',
    category_hi: 'शोध',
  },
  {
    title_en: 'MoU Signed with Industry Partner',
    title_hi: 'उद्योग भागीदार के साथ MoU पर हस्ताक्षर',
    date: '2026-08-15',
    description_en:
      'The institute has signed a memorandum of understanding to support internships, joint projects, and skill development programmes.',
    description_hi:
      'संस्थान ने इंटर्नशिप, संयुक्त परियोजनाओं और कौशल विकास कार्यक्रमों के लिए एक समझौता ज्ञापन पर हस्ताक्षर किए हैं।',
    category_en: 'Collaboration',
    category_hi: 'सहयोग',
  },
  {
    title_en: 'Library E-Resources Expanded',
    title_hi: 'पुस्तकालय ई-संसाधन विस्तारित',
    date: '2026-08-22',
    description_en:
      'Students and faculty now have access to additional journals, e-books, and research databases through the digital library.',
    description_hi:
      'छात्रों और संकाय को अब डिजिटल लाइब्रेरी के माध्यम से अतिरिक्त जर्नल, ई-बुक और शोध डेटाबेस की सुविधा मिलेगी।',
    category_en: 'Library',
    category_hi: 'पुस्तकालय',
  },
  {
    title_en: 'Students Win National Hackathon Prize',
    title_hi: 'छात्रों ने राष्ट्रीय हैकाथॉन पुरस्कार जीता',
    date: '2026-08-27',
    description_en:
      'A student team from NIT Hamirpur secured top honours for building a practical solution for campus sustainability.',
    description_hi:
      'एनआईटी हमीरपुर की एक छात्र टीम ने परिसर स्थिरता के लिए व्यावहारिक समाधान बनाकर शीर्ष सम्मान प्राप्त किया।',
    category_en: 'Achievement',
    category_hi: 'उपलब्धि',
  },
];

const achievements = [
  {
    tagline_en: 'Research',
    tagline_hi: 'शोध',
    heading_en: 'Solar Drone Prototype Recognized',
    heading_hi: 'सौर ड्रोन प्रोटोटाइप को मान्यता',
    description_en:
      'A multidisciplinary student project was showcased for combining renewable energy and autonomous systems in a single low-cost prototype.',
    description_hi:
      'एक बहु-विषयक छात्र परियोजना को नवीकरणीय ऊर्जा और स्वायत्त प्रणालियों को एक कम लागत वाले प्रोटोटाइप में जोड़ने के लिए प्रदर्शित किया गया।',
    image: '/award.jpg',
  },
  {
    tagline_en: 'Innovation',
    tagline_hi: 'नवाचार',
    heading_en: 'AI Lab Prototype Launched',
    heading_hi: 'एआई लैब प्रोटोटाइप लॉन्च',
    description_en:
      'The department developed an applied AI learning lab to help students experiment with practical models, datasets, and deployment workflows.',
    description_hi:
      'विभाग ने छात्रों को व्यावहारिक मॉडल, डेटासेट और डिप्लॉयमेंट वर्कफ़्लो के साथ प्रयोग करने में मदद करने के लिए एक लागू एआई लर्निंग लैब विकसित की।',
    image: '/group.jpg',
  },
  {
    tagline_en: 'Sports',
    tagline_hi: 'खेल',
    heading_en: 'Inter-NIT Gold Medal Victory',
    heading_hi: 'अंतर-एनआईटी स्वर्ण पदक जीत',
    description_en:
      'NIT Hamirpur athletes delivered a strong performance and brought home gold in a national-level team event.',
    description_hi:
      'एनआईटी हमीरपुर के खिलाड़ियों ने शानदार प्रदर्शन करते हुए राष्ट्रीय स्तर की टीम स्पर्धा में स्वर्ण पदक जीता।',
    image: '/nith.jpg',
  },
  {
    tagline_en: 'Community',
    tagline_hi: 'समुदाय',
    heading_en: 'Blood Donation Drive Reached 1000 Units',
    heading_hi: 'रक्तदान अभियान में 1000 यूनिट',
    description_en:
      'Students and staff united for a campus blood donation campaign that crossed the 1000-unit milestone across multiple camps.',
    description_hi:
      'छात्रों और कर्मचारियों ने एक परिसर रक्तदान अभियान में भाग लिया जिसने कई शिविरों के माध्यम से 1000 यूनिट का आंकड़ा पार किया।',
    image: '/admin.jpg',
  },
];

async function seedTable(tableName, rows, columns) {
  await db.query(`TRUNCATE TABLE ${tableName} RESTART IDENTITY CASCADE`);

  for (const row of rows) {
    const values = columns.map((column) => row[column]);
    const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');

    await db.query(
      `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`,
      values
    );
  }
}

async function main() {
  console.log('Seeding homepage tables...');

  await seedTable('academics', academics, [
    'title_en',
    'title_hi',
    'date',
    'description_en',
    'description_hi',
    'category_en',
    'category_hi',
  ]);

  await seedTable('admissions', admissions, [
    'title_en',
    'title_hi',
    'date',
    'description_en',
    'description_hi',
    'category_en',
    'category_hi',
  ]);

  await seedTable('events', events, [
    'title_en',
    'title_hi',
    'date',
    'description_en',
    'description_hi',
    'category_en',
    'category_hi',
  ]);

  await seedTable('newss', newss, [
    'title_en',
    'title_hi',
    'date',
    'description_en',
    'description_hi',
    'category_en',
    'category_hi',
  ]);

  await seedTable('achievements', achievements, [
    'tagline_en',
    'tagline_hi',
    'heading_en',
    'heading_hi',
    'description_en',
    'description_hi',
    'image',
  ]);

  console.log('Homepage seed completed successfully.');
}

main().catch((error) => {
  console.error('Homepage seed failed:', error);
  process.exit(1);
});