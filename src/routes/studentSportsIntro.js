const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// --- Heading Endpoints (Singleton) ---

// GET Heading singleton
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_sports_intro_heading ORDER BY id DESC LIMIT 1');
        res.json(result.rows[0] || {});
    } catch (err) {
        console.error('GET /api/student-sports-intro error:', err);
        res.status(500).json({ error: 'Database error fetching Sports headings' });
    }
});

// PUT Update Heading singleton
router.put('/', async (req, res) => {
    const {
        title_en, title_hn,
        sub_title_en, sub_title_hn,
        intro_title_en, intro_title_hn,
        intro_desc_en, intro_desc_hn,
        facilities_title_en, facilities_title_hn,
        events_title_en, events_title_hn,
        achievements_title_en, achievements_title_hn,
        achievements_desc_en, achievements_desc_hn,
        contact_title_en, contact_title_hn,
        
        // Faculty In-charge
        coord1_name_en, coord1_name_hn,
        coord1_role_en, coord1_role_hn,
        coord1_contact, coord1_email,

        // Sports Office
        coord2_name_en, coord2_name_hn,
        coord2_address_en, coord2_address_hn,
        coord2_contact, coord2_email
    } = req.body;

    try {
        const check = await pool.query('SELECT id FROM student_sports_intro_heading LIMIT 1');
        if (check.rows.length > 0) {
            const result = await pool.query(
                `UPDATE student_sports_intro_heading 
                 SET title_en=$1, title_hn=$2, 
                     sub_title_en=$3, sub_title_hn=$4, 
                     intro_title_en=$5, intro_title_hn=$6, 
                     intro_desc_en=$7, intro_desc_hn=$8,
                     facilities_title_en=$9, facilities_title_hn=$10,
                     events_title_en=$11, events_title_hn=$12,
                     achievements_title_en=$13, achievements_title_hn=$14,
                     achievements_desc_en=$15, achievements_desc_hn=$16,
                     contact_title_en=$17, contact_title_hn=$18,
                     
                     coord1_name_en=$19, coord1_name_hn=$20,
                     coord1_role_en=$21, coord1_role_hn=$22,
                     coord1_contact=$23, coord1_email=$24,
                     
                     coord2_name_en=$25, coord2_name_hn=$26,
                     coord2_address_en=$27, coord2_address_hn=$28,
                     coord2_contact=$29, coord2_email=$30
                 WHERE id=$31 RETURNING *`,
                [
                    title_en, title_hn,
                    sub_title_en, sub_title_hn,
                    intro_title_en, intro_title_hn,
                    intro_desc_en, intro_desc_hn,
                    facilities_title_en, facilities_title_hn,
                    events_title_en, events_title_hn,
                    achievements_title_en, achievements_title_hn,
                    achievements_desc_en, achievements_desc_hn,
                    contact_title_en, contact_title_hn,
                    
                    coord1_name_en, coord1_name_hn,
                    coord1_role_en, coord1_role_hn,
                    coord1_contact, coord1_email,
                    
                    coord2_name_en, coord2_name_hn,
                    coord2_address_en, coord2_address_hn,
                    coord2_contact, coord2_email,
                    check.rows[0].id
                ]
            );
            res.json(result.rows[0]);
        } else {
            const result = await pool.query(
                `INSERT INTO student_sports_intro_heading (
                    title_en, title_hn,
                    sub_title_en, sub_title_hn,
                    intro_title_en, intro_title_hn,
                    intro_desc_en, intro_desc_hn,
                    facilities_title_en, facilities_title_hn,
                    events_title_en, events_title_hn,
                    achievements_title_en, achievements_title_hn,
                    achievements_desc_en, achievements_desc_hn,
                    contact_title_en, contact_title_hn,
                    
                    coord1_name_en, coord1_name_hn,
                    coord1_role_en, coord1_role_hn,
                    coord1_contact, coord1_email,
                    
                    coord2_name_en, coord2_name_hn,
                    coord2_address_en, coord2_address_hn,
                    coord2_contact, coord2_email
                 ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30) RETURNING *`,
                [
                    title_en, title_hn,
                    sub_title_en, sub_title_hn,
                    intro_title_en, intro_title_hn,
                    intro_desc_en, intro_desc_hn,
                    facilities_title_en, facilities_title_hn,
                    events_title_en, events_title_hn,
                    achievements_title_en, achievements_title_hn,
                    achievements_desc_en, achievements_desc_hn,
                    contact_title_en, contact_title_hn,
                    
                    coord1_name_en, coord1_name_hn,
                    coord1_role_en, coord1_role_hn,
                    coord1_contact, coord1_email,
                    
                    coord2_name_en, coord2_name_hn,
                    coord2_address_en, coord2_address_hn,
                    coord2_contact, coord2_email
                ]
            );
            res.json(result.rows[0]);
        }
    } catch (err) {
        console.error('PUT /api/student-sports-intro error:', err);
        res.status(500).json({ error: 'Database error updating Sports headings' });
    }
});

// --- Facilities Endpoints ---

// GET All Facilities
router.get('/facilities', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_sports_intro_facilities ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('GET /api/student-sports-intro/facilities error:', err);
        res.status(500).json({ error: 'Database error fetching Sports facilities list' });
    }
});

// POST New Facility
router.post('/facilities', async (req, res) => {
    const { facility_en, facility_hn } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO student_sports_intro_facilities (facility_en, facility_hn) VALUES ($1, $2) RETURNING *`,
            [facility_en, facility_hn]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('POST /api/student-sports-intro/facilities error:', err);
        res.status(500).json({ error: 'Database error creating Sports facility' });
    }
});

// PUT Update Facility
router.put('/facilities/:id', async (req, res) => {
    const { id } = req.params;
    const { facility_en, facility_hn } = req.body;
    try {
        const result = await pool.query(
            `UPDATE student_sports_intro_facilities SET facility_en=$1, facility_hn=$2 WHERE id=$3 RETURNING *`,
            [facility_en, facility_hn, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Sports facility not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('PUT /api/student-sports-intro/facilities/:id error:', err);
        res.status(500).json({ error: 'Database error updating Sports facility' });
    }
});

// DELETE Facility
router.delete('/facilities/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM student_sports_intro_facilities WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Sports facility not found' });
        }
        res.json({ message: 'Deleted successfully', id: result.rows[0].id });
    } catch (err) {
        console.error('DELETE /api/student-sports-intro/facilities/:id error:', err);
        res.status(500).json({ error: 'Database error deleting Sports facility' });
    }
});

// --- Events Endpoints ---

// GET All Events
router.get('/events', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_sports_intro_events ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('GET /api/student-sports-intro/events error:', err);
        res.status(500).json({ error: 'Database error fetching Sports events list' });
    }
});

// POST New Event
router.post('/events', async (req, res) => {
    const { event_en, event_hn } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO student_sports_intro_events (event_en, event_hn) VALUES ($1, $2) RETURNING *`,
            [event_en, event_hn]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('POST /api/student-sports-intro/events error:', err);
        res.status(500).json({ error: 'Database error creating Sports event' });
    }
});

// PUT Update Event
router.put('/events/:id', async (req, res) => {
    const { id } = req.params;
    const { event_en, event_hn } = req.body;
    try {
        const result = await pool.query(
            `UPDATE student_sports_intro_events SET event_en=$1, event_hn=$2 WHERE id=$3 RETURNING *`,
            [event_en, event_hn, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Sports event not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('PUT /api/student-sports-intro/events/:id error:', err);
        res.status(500).json({ error: 'Database error updating Sports event' });
    }
});

// DELETE Event
router.delete('/events/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM student_sports_intro_events WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Sports event not found' });
        }
        res.json({ message: 'Deleted successfully', id: result.rows[0].id });
    } catch (err) {
        console.error('DELETE /api/student-sports-intro/events/:id error:', err);
        res.status(500).json({ error: 'Database error deleting Sports event' });
    }
});

// --- Achievements Endpoints ---

// GET All Achievements
router.get('/achievements', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student_sports_intro_achievements ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('GET /api/student-sports-intro/achievements error:', err);
        res.status(500).json({ error: 'Database error fetching Sports achievements list' });
    }
});

// POST New Achievement
router.post('/achievements', async (req, res) => {
    const { achievement_en, achievement_hn } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO student_sports_intro_achievements (achievement_en, achievement_hn) VALUES ($1, $2) RETURNING *`,
            [achievement_en, achievement_hn]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('POST /api/student-sports-intro/achievements error:', err);
        res.status(500).json({ error: 'Database error creating Sports achievement' });
    }
});

// PUT Update Achievement
router.put('/achievements/:id', async (req, res) => {
    const { id } = req.params;
    const { achievement_en, achievement_hn } = req.body;
    try {
        const result = await pool.query(
            `UPDATE student_sports_intro_achievements SET achievement_en=$1, achievement_hn=$2 WHERE id=$3 RETURNING *`,
            [achievement_en, achievement_hn, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Sports achievement not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('PUT /api/student-sports-intro/achievements/:id error:', err);
        res.status(500).json({ error: 'Database error updating Sports achievement' });
    }
});

// DELETE Achievement
router.delete('/achievements/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM student_sports_intro_achievements WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Sports achievement not found' });
        }
        res.json({ message: 'Deleted successfully', id: result.rows[0].id });
    } catch (err) {
        console.error('DELETE /api/student-sports-intro/achievements/:id error:', err);
        res.status(500).json({ error: 'Database error deleting Sports achievement' });
    }
});

module.exports = router;
