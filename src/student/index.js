const express = require('express');
const createGenericRouter = require('./genericRouter');

const router = express.Router();

const studentRoutes = [
  // Activities
  { path: '/activities-heading', table: 'student_activities_heading', isSingleton: true },
  { path: '/activities-list', table: 'student_activities_list' },

  // Functionaries
  { path: '/functionaries-heading', table: 'student_functionaries_heading', isSingleton: true },
  { path: '/functionaries-list', table: 'student_functionaries_list' },

  // Notices
  { path: '/notices-heading', table: 'student_notices_heading', isSingleton: true },
  { path: '/notices-list', table: 'student_notices_list', fileField: 'attachment_url' },

  // SGRC
  { path: '/sgrc-heading', table: 'student_sgrc_heading', isSingleton: true },
  { path: '/sgrc-objectives', table: 'student_sgrc_objectives' },
  { path: '/sgrc-members', table: 'student_sgrc_members' },
  { path: '/sgrc-meetings', table: 'student_sgrc_meetings' },

  // Cultural
  { path: '/cultural-intro-heading', table: 'student_cultural_intro_heading', isSingleton: true },
  { path: '/cultural-societies', table: 'student_cultural_societies' },
  { path: '/hillfair-heading', table: 'student_hillfair_heading', isSingleton: true },
  { path: '/hillfair-highlights', table: 'student_hillfair_highlights' },
  { path: '/hillfair-events', table: 'student_hillfair_events' },

  // Technical
  { path: '/technical-intro-heading', table: 'student_technical_intro_heading', isSingleton: true },
  { path: '/technical-societies', table: 'student_technical_societies' },
  { path: '/nimbus-heading', table: 'student_nimbus_heading', isSingleton: true },
  { path: '/nimbus-activities', table: 'student_nimbus_activities' },

  // SPIC MACAY
  { path: '/spicmacay-heading', table: 'student_spicmacay_heading', isSingleton: true },
  { path: '/spicmacay-assertions', table: 'student_spicmacay_assertions' },
  { path: '/spicmacay-gallery', table: 'student_spicmacay_gallery', fileField: 'url' },

  // Innovation
  { path: '/innovation-heading', table: 'student_innovation_heading', isSingleton: true },
  { path: '/innovation-focus', table: 'student_innovation_focus' },
  { path: '/innovation-programs', table: 'student_innovation_programs' },
  { path: '/innovation-join-steps', table: 'student_innovation_join_steps' },

  // Sports
  { path: '/sports-intro-heading', table: 'student_sports_intro_heading', isSingleton: true },
  { path: '/sports-intro-facilities', table: 'student_sports_intro_facilities' },
  { path: '/sports-intro-events', table: 'student_sports_intro_events' },
  { path: '/sports-intro-achievements', table: 'student_sports_intro_achievements' },
  { path: '/lalkaar-heading', table: 'student_lalkaar_heading', isSingleton: true },
  { path: '/lalkaar-sections', table: 'student_lalkaar_sections' },
  { path: '/yogaday-heading', table: 'student_yogaday_heading', isSingleton: true },
  { path: '/yogaday-schedule', table: 'student_yogaday_schedule' },
  { path: '/yogaday-benefits', table: 'student_yogaday_benefits' },
  { path: '/yogaday-instructors', table: 'student_yogaday_instructors' },

  // NSS & NCC
  { path: '/nss-heading', table: 'student_nss_heading', isSingleton: true },
  { path: '/nss-objectives', table: 'student_nss_objectives' },
  { path: '/nss-activities', table: 'student_nss_activities' },
  { path: '/ncc-heading', table: 'student_ncc_heading', isSingleton: true },
  { path: '/ncc-camps', table: 'student_ncc_camps' },
  { path: '/ncc-community', table: 'student_ncc_community' },

  // Publications (Magazine & News Bulletin)
  { path: '/magazine-heading', table: 'student_magazine_heading', isSingleton: true },
  { path: '/magazine-archive', table: 'student_magazine_archive', fileField: 'download_url' },
  { path: '/news-bulletin-heading', table: 'student_news_bulletin_heading', isSingleton: true },
  { path: '/news-bulletins', table: 'student_news_bulletins', fileField: 'pdf_url' },

  // Hostels
  { path: '/hostel-management-heading', table: 'student_hostel_management_heading', isSingleton: true },
  { path: '/hostel-management-functionaries', table: 'student_hostel_management_functionaries' },
  { path: '/hostel-nith', table: 'student_hostel_nith', fileField: 'photo_url' },
  { path: '/hostel-nith-heading', table: 'student_hostel_nith_heading', isSingleton: true },
];

studentRoutes.forEach(route => {
  router.use(route.path, createGenericRouter(route.table, {
    isSingleton: route.isSingleton,
    fileField: route.fileField
  }));
});

module.exports = router;