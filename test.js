const { sql } = require('./src/db/neon');
(async () => {
  const result = await sql.query('SELECT * FROM about_nith_goals LIMIT 1');
  console.log("type of result:", typeof result);
  console.log("result keys:", Object.keys(result));
  console.log("is array:", Array.isArray(result));
  console.log(result);
})();
