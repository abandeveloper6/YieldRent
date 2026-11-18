const { query } = require('../database/db');

exports.getStats = async (req, res) => {
  try {
    const totalMachinery = await query('SELECT COUNT(*) as count FROM machinery');
    const totalFarmers = await query("SELECT COUNT(*) as count FROM users WHERE role = 'farmer'");
    const totalOwners = await query("SELECT COUNT(*) as count FROM users WHERE role = 'owner'");
    const totalBookings = await query('SELECT COUNT(*) as count FROM bookings');
    const activeRentals = await query("SELECT COUNT(*) as count FROM bookings WHERE status = 'confirmed'");

    const categories = await query(`
      SELECT category, COUNT(*) as count
      FROM machinery
      GROUP BY category
      ORDER BY count DESC
    `);

    return res.json({
      success: true,
      stats: {
        totalMachinery: totalMachinery[0].count || totalMachinery[0]['COUNT(*)'] || 0,
        totalFarmers: totalFarmers[0].count || totalFarmers[0]['COUNT(*)'] || 0,
        totalOwners: totalOwners[0].count || totalOwners[0]['COUNT(*)'] || 0,
        totalBookings: totalBookings[0].count || totalBookings[0]['COUNT(*)'] || 0,
        activeRentals: activeRentals[0].count || activeRentals[0]['COUNT(*)'] || 0,
        categories
      }
    });
  } catch (err) {
    console.error('Stats error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve stats.' });
  }
};
