const express = require('express');
const router = express.Router();
const db = require('../db/db');

// 1. GET Headings
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM alumni_registration_heading LIMIT 1');
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.json({
        title_en: 'Alumni Registration',
        title_hn: 'पूर्व छात्र पंजीकरण',
        sub_title_en: 'Join the official NIT Hamirpur Alumni Network. Stay connected, contribute to your alma mater, and be part of a thriving community of accomplished professionals.',
        sub_title_hn: 'आधिकारिक एनआईटी हमीरपुर पूर्व छात्र नेटवर्क में शामिल हों। जुड़े रहें, अपने अल्मा मेटर में योगदान दें, और कुशल पेशेवरों के एक समृद्ध समुदाय का हिस्सा बनें।',
        about_title_en: 'About Alumni Registration',
        about_title_hn: 'पूर्व छात्र पंजीकरण के बारे में',
        about_sub_en: 'Join thousands of NITH alumni worldwide. Registration takes only a few minutes and opens doors to lifelong connections and opportunities.',
        about_sub_hn: 'दुनिया भर में हजारों एनआईटीएच पूर्व छात्रों में शामिल हों। पंजीकरण में केवल कुछ मिनट लगते हैं और यह आजीवन संबंधों और अवसरों के द्वार खोलता है।',
        card1_title_en: 'Who Can Register',
        card1_title_hn: 'कौन पंजीकरण कर सकता है',
        card1_desc_en: 'All graduates of National Institute of Technology, Hamirpur, across all programs and batches. Whether you graduated decades ago or recently, we welcome you to join our alumni network.',
        card1_desc_hn: 'राष्ट्रीय प्रौद्योगिकी संस्थान, हमीरपुर के सभी स्नातक, सभी कार्यक्रमों और बैचों में। चाहे आप दशकों पहले स्नातक हुए हों या हाल ही में, हम पूर्व छात्र नेटवर्क में शामिल होने के लिए स्वागत करते हैं।',
        card2_title_en: 'Purpose & Benefits',
        card2_title_hn: 'उद्देश्य और लाभ',
        card2_desc_en: 'Maintain an updated alumni database, facilitate networking opportunities, stay informed about institute developments, events, and initiatives. Connect with fellow alumni globally.',
        card2_desc_hn: 'एक अद्यतन पूर्व छात्र डेटाबेस बनाए रखें, नेटवर्किंग के अवसरों को सुगम बनाएं, संस्थान के विकास, कार्यक्रमों और पहलों के बारे में सूचित रहें। वैश्विक स्तर पर साथी पूर्व छात्रों के साथ जुड़ें।',
        card3_title_en: 'How We Use Your Data',
        card3_title_hn: 'हम आपके डेटा का उपयोग कैसे करते हैं',
        card3_desc_en: 'Your data is used solely for alumni engagement: event invitations, newsletters, mentorship programs, professional networking, and keeping you connected with your alma mater.',
        card3_desc_hn: 'आपके डेटा का उपयोग केवल पूर्व छात्र जुड़ाव के लिए किया जाता है: कार्यक्रम निमंत्रण, समाचार पत्र, परामर्श कार्यक्रम, पेशेवर नेटवर्किंग, और आपको अपने अल्मा मेटर से जोड़े रखना।',
        card4_title_en: 'Privacy & Security',
        card4_title_hn: 'गोपनीयता और सुरक्षा',
        card4_desc_en: 'We are committed to protecting your privacy. Your information will not be shared with third parties without consent and is stored securely in compliance with data protection regulations.',
        card4_desc_hn: 'हम आपकी गोपनीयता की रक्षा करने के लिए प्रतिबद्ध हैं। आपकी जानकारी सहमति के बिना तीसरे पक्षों के साथ साझा नहीं की जाएगी और डेटा सुरक्षा नियमों के अनुपालन में सुरक्षित रूप से संग्रहीत की जाती है।',
        help_title_en: 'Need Help?',
        help_title_hn: 'मदद की ज़रूरत है?',
        help_desc_en: 'If you encounter any issues during registration or have questions, please contact the Alumni Relations Office:',
        help_desc_hn: 'यदि आपको पंजीकरण के दौरान कोई समस्या आती है या आपके कोई प्रश्न हैं, तो कृपया पूर्व छात्र संबंध कार्यालय से संपर्क करें:',
        help_email: 'alumni@nith.ac.in',
        help_phone: '+91-1972-254802'
      });
    }
  } catch (err) {
    console.error('Error fetching registration headings:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 2. PUT Headings
router.put('/heading', async (req, res) => {
  const fields = [
    'title_en', 'title_hn', 'sub_title_en', 'sub_title_hn',
    'about_title_en', 'about_title_hn', 'about_sub_en', 'about_sub_hn',
    'card1_title_en', 'card1_title_hn', 'card1_desc_en', 'card1_desc_hn',
    'card2_title_en', 'card2_title_hn', 'card2_desc_en', 'card2_desc_hn',
    'card3_title_en', 'card3_title_hn', 'card3_desc_en', 'card3_desc_hn',
    'card4_title_en', 'card4_title_hn', 'card4_desc_en', 'card4_desc_hn',
    'help_title_en', 'help_title_hn', 'help_desc_en', 'help_desc_hn',
    'help_email', 'help_phone'
  ];

  try {
    const check = await db.query('SELECT id FROM alumni_registration_heading LIMIT 1');
    if (check.rows.length > 0) {
      const setClause = fields.map((f, idx) => `"${f}" = $${idx + 1}`).join(', ');
      const values = fields.map(f => req.body[f] !== undefined ? req.body[f] : null);
      values.push(check.rows[0].id);

      await db.query(`
        UPDATE alumni_registration_heading SET
          ${setClause}
        WHERE id = $${values.length}
      `, values);
    } else {
      const colNames = fields.map(f => `"${f}"`).join(', ');
      const placeholders = fields.map((_, idx) => `$${idx + 1}`).join(', ');
      const values = fields.map(f => req.body[f] !== undefined ? req.body[f] : null);

      await db.query(`
        INSERT INTO alumni_registration_heading (${colNames})
        VALUES (${placeholders})
      `, values);
    }
    res.json({ success: true, message: 'Headings updated successfully' });
  } catch (err) {
    console.error('Error updating registration headings:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 3. POST Submit Registration Form
router.post('/submit', async (req, res) => {
  const {
    fullName, rollNumber, email, mobile,
    degree, department, passingYear,
    currentOrganization, designation, industry,
    currentCity, currentCountry, areasOfInterest, willingToSupport
  } = req.body;

  try {
    const interests = Array.isArray(areasOfInterest) ? areasOfInterest.join(', ') : areasOfInterest;
    const result = await db.query(`
      INSERT INTO alumni_registrations (
        full_name, roll_number, email, mobile,
        degree, department, passing_year,
        current_organization, designation, industry,
        current_city, current_country, areas_of_interest, willing_to_support
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `, [
      fullName, rollNumber, email, mobile,
      degree, department, passingYear,
      currentOrganization, designation, industry,
      currentCity, currentCountry, interests, willingToSupport
    ]);
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error submitting alumni registration:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 4. GET All Registrations List
router.get('/list', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM alumni_registrations ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching registrations list:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 5. PUT Update Application Status
router.put('/:id/status', async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;

  try {
    const result = await db.query(
      'UPDATE alumni_registrations SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (result.rows.length > 0) {
      res.json({ success: true, data: result.rows[0] });
    } else {
      res.status(404).json({ error: 'Registration not found' });
    }
  } catch (err) {
    console.error('Error updating registration status:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 6. DELETE Registration
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query('DELETE FROM alumni_registrations WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length > 0) {
      res.json({ success: true, message: 'Registration deleted successfully' });
    } else {
      res.status(404).json({ error: 'Registration not found' });
    }
  } catch (err) {
    console.error('Error deleting registration:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
