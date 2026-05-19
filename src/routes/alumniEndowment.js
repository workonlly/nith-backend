const express = require('express');
const router = express.Router();
const db = require('../db/db');

// 1. GET dynamic page headings & copy
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM alumni_endowment_heading LIMIT 1');
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.json({
        title_en: 'Endowment Fund Generation',
        title_hn: 'एंडोमेंट फंड जनरेशन',
        sub_title_en: 'Building a sustainable future for NIT Hamirpur through strategic endowment initiatives that support academic excellence, innovation, and student welfare.',
        sub_title_hn: 'शैक्षणिक उत्कृष्टता, नवाचार और छात्र कल्याण का समर्थन करने वाली रणनीतिक एंडोमेंट पहलों के माध्यम से एनआईटी हमीरपुर के लिए एक स्थायी भविष्य का निर्माण करना।',
        about_title_en: 'About the Endowment Fund',
        about_title_hn: 'एंडोमेंट फंड के बारे में',
        about_desc1_en: 'An Endowment Fund is a permanent fund established to provide long-term financial support to NIT Hamirpur. The principal amount is invested prudently, and the generated returns are utilized to support various institutional initiatives without depleting the core corpus.',
        about_desc1_hn: 'एक एंडोमेंट फंड एनआईटी हमीरपुर को दीर्घकालिक वित्तीय सहायता प्रदान करने के लिए स्थापित एक स्थायी फंड है। मूल राशि का निवेश विवेकपूर्ण तरीके से किया जाता है, और उत्पन्न रिटर्न का उपयोग कोर कॉर्पस को समाप्त किए बिना विभिन्न संस्थागत पहलों का समर्थन करने के लिए किया जाता है।',
        about_desc2_en: 'The Endowment Fund plays a crucial role in supporting academic excellence, cutting-edge research, modern infrastructure development, student scholarships, faculty development, and overall student welfare at the institute.',
        about_desc2_hn: 'एंडोमेंट फंड संस्थान में शैक्षणिक उत्कृष्टता, अत्याधुनिक अनुसंधान, आधुनिक बुनियादी ढांचे के विकास, छात्र छात्रवृत्ति, संकाय विकास और समग्र छात्र कल्याण का समर्थन करने में महत्वपूर्ण भूमिका निभाता है।',
        about_desc3_en: 'Alumni participation is vital to the success of these initiatives. By contributing to the endowment fund, alumni give back to their alma mater, ensuring that future generations of students receive the same quality education and opportunities that shaped their own careers.',
        about_desc3_hn: 'इन पहलों की सफलता के लिए पूर्व छात्रों की भागीदारी महत्वपूर्ण है। एंडोमेंट फंड में योगदान देकर, पूर्व छात्र अपने अल्मा मेटर को वापस देते हैं, यह सुनिश्चित करते हुए कि छात्रों की भावी पीढ़ियों को वही गुणवत्तापूर्ण शिक्षा और अवसर प्राप्त हों जिन्होंने उनके अपने करियर को आकार दिया।'
      });
    }
  } catch (err) {
    console.error('Error fetching endowment headings:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 2. PUT update page headings & copy
router.put('/heading', async (req, res) => {
  const fields = [
    'title_en', 'title_hn', 'sub_title_en', 'sub_title_hn',
    'about_title_en', 'about_title_hn',
    'about_desc1_en', 'about_desc1_hn', 'about_desc2_en', 'about_desc2_hn', 'about_desc3_en', 'about_desc3_hn',
    'obj1_title_en', 'obj1_title_hn', 'obj1_desc_en', 'obj1_desc_hn',
    'obj2_title_en', 'obj2_title_hn', 'obj2_desc_en', 'obj2_desc_hn',
    'obj3_title_en', 'obj3_title_hn', 'obj3_desc_en', 'obj3_desc_hn',
    'obj4_title_en', 'obj4_title_hn', 'obj4_desc_en', 'obj4_desc_hn',
    'obj5_title_en', 'obj5_title_hn', 'obj5_desc_en', 'obj5_desc_hn',
    'obj6_title_en', 'obj6_title_hn', 'obj6_desc_en', 'obj6_desc_hn',
    'trans_title_en', 'trans_title_hn', 'trans_desc_en', 'trans_desc_hn',
    'trans1_title_en', 'trans1_title_hn', 'trans1_desc_en', 'trans1_desc_hn',
    'trans2_title_en', 'trans2_title_hn', 'trans2_desc_en', 'trans2_desc_hn',
    'trans3_title_en', 'trans3_title_hn', 'trans3_desc_en', 'trans3_desc_hn',
    'contrib_title_en', 'contrib_title_hn', 'contrib_desc_en', 'contrib_desc_hn',
    'contrib1_title_en', 'contrib1_title_hn', 'contrib1_desc_en', 'contrib1_desc_hn',
    'contrib2_title_en', 'contrib2_title_hn', 'contrib2_desc_en', 'contrib2_desc_hn',
    'contrib3_title_en', 'contrib3_title_hn', 'contrib3_desc_en', 'contrib3_desc_hn',
    'contrib4_title_en', 'contrib4_title_hn', 'contrib4_desc_en', 'contrib4_desc_hn',
    'contrib_btn1_en', 'contrib_btn1_hn', 'contrib_btn2_en', 'contrib_btn2_hn',
    'contact_title_en', 'contact_title_hn',
    'contact_office_title_en', 'contact_office_title_hn', 'contact_office_desc_en', 'contact_office_desc_hn',
    'contact_email_title_en', 'contact_email_title_hn', 'contact_email_desc_en', 'contact_email_desc_hn',
    'contact_phone_title_en', 'contact_phone_title_hn', 'contact_phone_desc_en', 'contact_phone_desc_hn',
    'contact_hours_title_en', 'contact_hours_title_hn', 'contact_hours_desc_en', 'contact_hours_desc_hn'
  ];

  try {
    const check = await db.query('SELECT id FROM alumni_endowment_heading LIMIT 1');
    if (check.rows.length > 0) {
      const setClause = fields.map((f, idx) => `"${f}" = $${idx + 1}`).join(', ');
      const values = fields.map(f => req.body[f] !== undefined ? req.body[f] : null);
      values.push(check.rows[0].id);

      await db.query(`
        UPDATE alumni_endowment_heading SET
          ${setClause}
        WHERE id = $${values.length}
      `, values);
    } else {
      const colNames = fields.map(f => `"${f}"`).join(', ');
      const placeholders = fields.map((_, idx) => `$${idx + 1}`).join(', ');
      const values = fields.map(f => req.body[f] !== undefined ? req.body[f] : null);

      await db.query(`
        INSERT INTO alumni_endowment_heading (${colNames})
        VALUES (${placeholders})
      `, values);
    }
    res.json({ success: true, message: 'Endowment headings updated successfully' });
  } catch (err) {
    console.error('Error updating endowment headings:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 3. GET all initiatives
router.get('/initiatives', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM alumni_endowment_initiatives ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching endowment initiatives:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 4. POST create initiative
router.post('/initiatives', async (req, res) => {
  const {
    title_en, title_hn, description_en, description_hn,
    status, year_en, year_hn, amount_en, amount_hn
  } = req.body;

  try {
    const result = await db.query(`
      INSERT INTO alumni_endowment_initiatives (
        title_en, title_hn, description_en, description_hn,
        status, year_en, year_hn, amount_en, amount_hn
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      title_en, title_hn, description_en, description_hn,
      status, year_en, year_hn, amount_en, amount_hn
    ]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating endowment initiative:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 5. PUT update initiative
router.put('/initiatives/:id', async (req, res) => {
  const id = req.params.id;
  const {
    title_en, title_hn, description_en, description_hn,
    status, year_en, year_hn, amount_en, amount_hn
  } = req.body;

  try {
    const result = await db.query(`
      UPDATE alumni_endowment_initiatives SET
        title_en = $1, title_hn = $2, description_en = $3, description_hn = $4,
        status = $5, year_en = $6, year_hn = $7, amount_en = $8, amount_hn = $9
      WHERE id = $10
      RETURNING *
    `, [
      title_en, title_hn, description_en, description_hn,
      status, year_en, year_hn, amount_en, amount_hn,
      id
    ]);

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Initiative not found' });
    }
  } catch (err) {
    console.error('Error updating endowment initiative:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 6. DELETE initiative
router.delete('/initiatives/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query('DELETE FROM alumni_endowment_initiatives WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length > 0) {
      res.json({ success: true, message: 'Initiative deleted successfully' });
    } else {
      res.status(404).json({ error: 'Initiative not found' });
    }
  } catch (err) {
    console.error('Error deleting endowment initiative:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
