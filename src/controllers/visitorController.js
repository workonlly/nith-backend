const db = require('../db/db');

const FALLBACK_PAGE = {
  id: 1,
  hero_heading_en: 'Visitor Management',
  hero_heading_hi: 'आगंतुक प्रबंधन',
  hero_subheading_en: 'Manage institutional visitors and their profiles',
  hero_subheading_hi: 'संस्थान के आगंतुकों और उनकी प्रोफ़ाइल का प्रबंधन करें',
  intro_en: 'Official visitor details and public communication content.',
  intro_hi: 'आधिकारिक आगंतुक विवरण और सार्वजनिक संचार सामग्री।',
  cta_label_en: 'Official Portal',
  cta_label_hi: 'आधिकारिक पोर्टल',
  cta_url: 'https://rashtrapati.gov.in',
  footer_note_en: 'For formal communications, please use the official channels.',
  footer_note_hi:
    'औपचारिक संचार के लिए कृपया आधिकारिक चैनलों का उपयोग करें।',
};

const toInt = (value, fallback = 0) => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const deleteMinioFile = async (fileUrl) => {
  if (!fileUrl || typeof fileUrl !== 'string') {
    return;
  }

  try {
    const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
    const s3Client = require('../db/minio');
    const fileKey = decodeURIComponent(fileUrl.split('/').pop());

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: 'images',
        Key: fileKey,
      })
    );
  } catch (error) {
    console.error('[MinIO] Visitor file delete failed:', error.message);
  }
};

exports.getVisitorPage = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM administration_visitor_page ORDER BY id LIMIT 1'
    );

    res.json({
      success: true,
      data: result.rows[0] || FALLBACK_PAGE,
    });
  } catch (error) {
    console.error('Error fetching visitor page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch visitor page data',
      error: error.message,
    });
  }
};

exports.updateVisitorPage = async (req, res) => {
  try {
    const {
      hero_heading_en,
      hero_heading_hi,
      hero_subheading_en,
      hero_subheading_hi,
      intro_en,
      intro_hi,
      cta_label_en,
      cta_label_hi,
      cta_url,
      footer_note_en,
      footer_note_hi,
    } = req.body;

    if (!hero_heading_en || !hero_heading_hi || !hero_subheading_en || !hero_subheading_hi) {
      return res.status(400).json({
        success: false,
        message: 'English and Hindi hero headings and subheadings are required',
      });
    }

    const result = await db.query(
      `
      INSERT INTO administration_visitor_page (
        id,
        hero_heading_en,
        hero_heading_hi,
        hero_subheading_en,
        hero_subheading_hi,
        intro_en,
        intro_hi,
        cta_label_en,
        cta_label_hi,
        cta_url,
        footer_note_en,
        footer_note_hi,
        updated_at
      )
      VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
      ON CONFLICT (id)
      DO UPDATE SET
        hero_heading_en = EXCLUDED.hero_heading_en,
        hero_heading_hi = EXCLUDED.hero_heading_hi,
        hero_subheading_en = EXCLUDED.hero_subheading_en,
        hero_subheading_hi = EXCLUDED.hero_subheading_hi,
        intro_en = EXCLUDED.intro_en,
        intro_hi = EXCLUDED.intro_hi,
        cta_label_en = EXCLUDED.cta_label_en,
        cta_label_hi = EXCLUDED.cta_label_hi,
        cta_url = EXCLUDED.cta_url,
        footer_note_en = EXCLUDED.footer_note_en,
        footer_note_hi = EXCLUDED.footer_note_hi,
        updated_at = NOW()
      RETURNING *
      `,
      [
        hero_heading_en,
        hero_heading_hi,
        hero_subheading_en,
        hero_subheading_hi,
        intro_en || null,
        intro_hi || null,
        cta_label_en || null,
        cta_label_hi || null,
        cta_url || null,
        footer_note_en || null,
        footer_note_hi || null,
      ]
    );

    res.json({
      success: true,
      message: 'Visitor page updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating visitor page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update visitor page',
      error: error.message,
    });
  }
};

exports.getAllVisitors = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM administration_visitors ORDER BY sort_order ASC, id ASC'
    );

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error('Error fetching visitors:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch visitors',
      error: error.message,
    });
  }
};

exports.getVisitorById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || Number.isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: 'Valid visitor id is required',
      });
    }

    const result = await db.query(
      'SELECT * FROM administration_visitors WHERE id = $1',
      [toInt(id)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No visitor found with ID: ${id}`,
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching visitor by id:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch visitor',
      error: error.message,
    });
  }
};

exports.createVisitor = async (req, res) => {
  try {
    const {
      name_en,
      name_hi,
      designation_en,
      designation_hi,
      description_en,
      description_hi,
      website_label_en,
      website_label_hi,
      website_url,
      image_url,
      sort_order,
    } = req.body;

    if (!name_en || !name_hi || !designation_en || !designation_hi) {
      return res.status(400).json({
        success: false,
        message: 'English and Hindi names and designations are required',
      });
    }

    const resolvedImageUrl = req.file?.location || image_url || null;

    const result = await db.query(
      `
      INSERT INTO administration_visitors (
        name_en,
        name_hi,
        designation_en,
        designation_hi,
        description_en,
        description_hi,
        website_label_en,
        website_label_hi,
        website_url,
        image_url,
        sort_order,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
      RETURNING *
      `,
      [
        name_en,
        name_hi,
        designation_en,
        designation_hi,
        description_en || null,
        description_hi || null,
        website_label_en || null,
        website_label_hi || null,
        website_url || null,
        resolvedImageUrl,
        toInt(sort_order, 0),
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Visitor created successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating visitor:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create visitor',
      error: error.message,
    });
  }
};

exports.updateVisitor = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name_en,
      name_hi,
      designation_en,
      designation_hi,
      description_en,
      description_hi,
      website_label_en,
      website_label_hi,
      website_url,
      image_url,
      sort_order,
    } = req.body;

    if (!id || Number.isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: 'Valid visitor id is required',
      });
    }

    const existingResult = await db.query(
      'SELECT * FROM administration_visitors WHERE id = $1',
      [toInt(id)]
    );

    if (existingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No visitor found with ID: ${id}`,
      });
    }

    const existingVisitor = existingResult.rows[0];
    const nextImageUrl = req.file?.location || image_url || existingVisitor.image_url || null;

    if (req.file && existingVisitor.image_url && existingVisitor.image_url !== nextImageUrl) {
      await deleteMinioFile(existingVisitor.image_url);
    }

    const result = await db.query(
      `
      UPDATE administration_visitors
      SET
        name_en = COALESCE($1, name_en),
        name_hi = COALESCE($2, name_hi),
        designation_en = COALESCE($3, designation_en),
        designation_hi = COALESCE($4, designation_hi),
        description_en = COALESCE($5, description_en),
        description_hi = COALESCE($6, description_hi),
        website_label_en = COALESCE($7, website_label_en),
        website_label_hi = COALESCE($8, website_label_hi),
        website_url = COALESCE($9, website_url),
        image_url = COALESCE($10, image_url),
        sort_order = COALESCE($11, sort_order),
        updated_at = NOW()
      WHERE id = $12
      RETURNING *
      `,
      [
        name_en || null,
        name_hi || null,
        designation_en || null,
        designation_hi || null,
        description_en || null,
        description_hi || null,
        website_label_en || null,
        website_label_hi || null,
        website_url || null,
        nextImageUrl,
        sort_order !== undefined ? toInt(sort_order, existingVisitor.sort_order || 0) : null,
        toInt(id),
      ]
    );

    res.json({
      success: true,
      message: 'Visitor updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating visitor:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update visitor',
      error: error.message,
    });
  }
};

exports.deleteVisitor = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || Number.isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: 'Valid visitor id is required',
      });
    }

    const existingResult = await db.query(
      'SELECT * FROM administration_visitors WHERE id = $1',
      [toInt(id)]
    );

    if (existingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No visitor found with ID: ${id}`,
      });
    }

    const existingVisitor = existingResult.rows[0];

    if (existingVisitor.image_url) {
      await deleteMinioFile(existingVisitor.image_url);
    }

    const result = await db.query(
      'DELETE FROM administration_visitors WHERE id = $1 RETURNING *',
      [toInt(id)]
    );

    res.json({
      success: true,
      message: 'Visitor deleted successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error deleting visitor:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete visitor',
      error: error.message,
    });
  }
};