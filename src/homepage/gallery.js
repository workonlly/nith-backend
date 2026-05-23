// src/homepage/gallery.js

const express = require('express');

const router = express.Router();

const pool = require('../db/db');

/**
 * =========================================
 * GET /gallery
 * =========================================
 */

router.get('/gallery', async (req, res) => {
  try {

    /**
     * =========================
     * SECTION
     * =========================
     */

    const sectionResult = await pool.query(`
      SELECT *
      FROM gallery_section
      ORDER BY id DESC
      LIMIT 1
    `);

    /**
     * =========================
     * IMAGES
     * =========================
     */

    const imagesResult = await pool.query(`
      SELECT *
      FROM gallery_images
      ORDER BY id ASC
    `);

    const section =
      sectionResult.rows[0] || {

        heading_en: '',
        heading_hi: '',

        description_en: '',
        description_hi: '',
      };

    /**
     * =========================
     * FORMAT IMAGES
     * =========================
     */

    const images = imagesResult.rows.map(
      (img) => ({
        id: img.id,

        title_en: img.title_en,
        title_hi: img.title_hi,

        category_en: img.category_en,
        category_hi: img.category_hi,

        altText_en: img.alt_text_en,
        altText_hi: img.alt_text_hi,

        imageUrl: img.image_url,
      })
    );

    res.json({
      success: true,

      data: {

        heading_en:
          section.heading_en || '',

        heading_hi:
          section.heading_hi || '',

        description_en:
          section.description_en || '',

        description_hi:
          section.description_hi || '',

        images,
      },
    });

  } catch (err) {

    console.error(
      'GET /gallery error:',
      err
    );

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

/**
 * =========================================
 * PUT /gallery
 * =========================================
 */

router.put('/gallery', async (req, res) => {
  try {

    console.log(req.body);

    const {

      heading_en,
      heading_hi,

      description_en,
      description_hi,

      images,

    } = req.body;

    /**
     * =========================
     * VALIDATION
     * =========================
     */

    if (!Array.isArray(images)) {
      return res.status(400).json({
        success: false,
        error: 'Images must be an array',
      });
    }

    /**
     * =========================
     * SECTION
     * =========================
     */

    // REMOVE OLD SECTION
    await pool.query(`
      DELETE FROM gallery_section
    `);

    // INSERT NEW SECTION
    await pool.query(
      `
      INSERT INTO gallery_section
      (

        heading_en,
        heading_hi,

        description_en,
        description_hi

      )
      VALUES ($1, $2, $3, $4)
      `,
      [

        heading_en || '',
        heading_hi || '',

        description_en || '',
        description_hi || '',

      ]
    );

    /**
     * =========================
     * IMAGES
     * =========================
     */

    // REMOVE OLD IMAGES
    await pool.query(`
      DELETE FROM gallery_images
    `);

    const insertedImages = [];

    for (const item of images) {

      const {

        title_en,
        title_hi,

        category_en,
        category_hi,

        altText_en,
        altText_hi,

        imageUrl,

      } = item;

      const result = await pool.query(
        `
        INSERT INTO gallery_images
        (

          title_en,
          title_hi,

          category_en,
          category_hi,

          alt_text_en,
          alt_text_hi,

          image_url

        )
        VALUES
        (
          $1, $2,
          $3, $4,
          $5, $6,
          $7
        )
        RETURNING *
        `,
        [

          title_en || '',
          title_hi || '',

          category_en || '',
          category_hi || '',

          altText_en || '',
          altText_hi || '',

          imageUrl || '',

        ]
      );

      insertedImages.push({

        id: result.rows[0].id,

        title_en:
          result.rows[0].title_en,

        title_hi:
          result.rows[0].title_hi,

        category_en:
          result.rows[0].category_en,

        category_hi:
          result.rows[0].category_hi,

        altText_en:
          result.rows[0].alt_text_en,

        altText_hi:
          result.rows[0].alt_text_hi,

        imageUrl:
          result.rows[0].image_url,
      });
    }

    res.json({
      success: true,

      data: {

        heading_en,
        heading_hi,

        description_en,
        description_hi,

        images: insertedImages,
      },
    });

  } catch (err) {

    console.error(
      'PUT /gallery error:',
      err
    );

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;