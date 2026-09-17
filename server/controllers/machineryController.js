const { query } = require('../database/db');

exports.getAllMachinery = async (req, res) => {
  try {
    const { category, search, location, minPrice, maxPrice, availableOnly, ownerId } = req.query;

    let sql = `
      SELECT m.*, u.name as owner_name, u.phone as owner_phone, u.location as owner_location,
             (SELECT COUNT(*) FROM reviews r WHERE r.machinery_id = m.id) as review_count
      FROM machinery m
      JOIN users u ON m.owner_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (ownerId) {
      sql += ' AND m.owner_id = ?';
      params.push(Number(ownerId));
    }

    if (category && category !== 'All') {
      sql += ' AND m.category = ?';
      params.push(category);
    }

    if (availableOnly === 'true') {
      sql += ' AND m.is_available = 1';
    }

    if (search) {
      sql += ' AND (m.title LIKE ? OR m.brand_model LIKE ? OR m.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (location) {
      sql += ' AND m.location LIKE ?';
      params.push(`%${location}%`);
    }

    if (minPrice) {
      sql += ' AND m.daily_rate >= ?';
      params.push(Number(minPrice));
    }

    if (maxPrice) {
      sql += ' AND m.daily_rate <= ?';
      params.push(Number(maxPrice));
    }

    sql += ' ORDER BY m.id DESC';

    const items = await query(sql, params);
    return res.json({ success: true, count: items.length, machinery: items });
  } catch (err) {
    console.error('Error fetching machinery:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve machinery listings.' });
  }
};

exports.getMachineryById = async (req, res) => {
  try {
    const { id } = req.params;
    const items = await query(`
      SELECT m.*, u.name as owner_name, u.email as owner_email, u.phone as owner_phone, u.location as owner_location, u.avatar as owner_avatar
      FROM machinery m
      JOIN users u ON m.owner_id = u.id
      WHERE m.id = ?
    `, [id]);

    if (items.length === 0) {
      return res.status(404).json({ success: false, message: 'Machinery not found.' });
    }

    const machine = items[0];

    // Fetch reviews
    const reviews = await query(`
      SELECT r.*, u.name as farmer_name, u.avatar as farmer_avatar
      FROM reviews r
      JOIN users u ON r.farmer_id = u.id
      WHERE r.machinery_id = ?
      ORDER BY r.created_at DESC
    `, [id]);

    // Fetch active bookings for calendar display
    const bookings = await query(`
      SELECT start_date, end_date, status
      FROM bookings
      WHERE machinery_id = ? AND status IN ('pending', 'confirmed') AND end_date >= DATE('now')
    `, [id]);

    return res.json({
      success: true,
      machinery: {
        ...machine,
        reviews,
        booked_ranges: bookings
      }
    });
  } catch (err) {
    console.error('Error fetching machinery details:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve machinery details.' });
  }
};

exports.createMachinery = async (req, res) => {
  try {
    const {
      title,
      category,
      brand_model,
      hp_power,
      fuel_type,
      hourly_rate,
      daily_rate,
      location,
      latitude,
      longitude,
      image_url,
      description,
      operational_guidelines
    } = req.body;

    if (!title || !category || !brand_model || !hourly_rate || !daily_rate || !location) {
      return res.status(400).json({ success: false, message: 'Please provide all required machinery details.' });
    }

    const defaultImages = {
      Tractor: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=80',
      Harvester: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800&auto=format&fit=crop&q=80',
      Rotavator: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=800&auto=format&fit=crop&q=80',
      Sprayer: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=800&auto=format&fit=crop&q=80',
      'Seed Drill': 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=800&auto=format&fit=crop&q=80',
      Default: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80'
    };

    const finalImage = image_url && image_url.trim() ? image_url : (defaultImages[category] || defaultImages.Default);

    const result = await query(`
      INSERT INTO machinery (
        owner_id, title, category, brand_model, hp_power, fuel_type,
        hourly_rate, daily_rate, location, latitude, longitude,
        image_url, description, operational_guidelines, is_available, rating
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 5.0)
    `, [
      req.user.id,
      title.trim(),
      category,
      brand_model.trim(),
      hp_power || '50 HP',
      fuel_type || 'Diesel',
      Number(hourly_rate),
      Number(daily_rate),
      location.trim(),
      latitude || 18.5204,
      longitude || 73.8567,
      finalImage,
      description || '',
      operational_guidelines || ''
    ]);

    return res.status(201).json({
      success: true,
      message: 'Machinery listed successfully!',
      machineryId: result.insertId
    });
  } catch (err) {
    console.error('Create machinery error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create machinery listing.' });
  }
};

exports.updateMachinery = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await query('SELECT owner_id FROM machinery WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Machinery not found.' });
    }

    if (existing[0].owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized to update this machinery listing.' });
    }

    const {
      title, category, brand_model, hp_power, fuel_type,
      hourly_rate, daily_rate, location, image_url, description, operational_guidelines, is_available
    } = req.body;

    await query(`
      UPDATE machinery SET
        title = COALESCE(?, title),
        category = COALESCE(?, category),
        brand_model = COALESCE(?, brand_model),
        hp_power = COALESCE(?, hp_power),
        fuel_type = COALESCE(?, fuel_type),
        hourly_rate = COALESCE(?, hourly_rate),
        daily_rate = COALESCE(?, daily_rate),
        location = COALESCE(?, location),
        image_url = COALESCE(?, image_url),
        description = COALESCE(?, description),
        operational_guidelines = COALESCE(?, operational_guidelines),
        is_available = COALESCE(?, is_available)
      WHERE id = ?
    `, [
      title, category, brand_model, hp_power, fuel_type,
      hourly_rate, daily_rate, location, image_url, description, operational_guidelines, is_available, id
    ]);

    return res.json({ success: true, message: 'Machinery updated successfully!' });
  } catch (err) {
    console.error('Update machinery error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update machinery listing.' });
  }
};

exports.toggleAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await query('SELECT owner_id, is_available FROM machinery WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Machinery not found.' });
    }

    if (existing[0].owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    const newStatus = existing[0].is_available ? 0 : 1;
    await query('UPDATE machinery SET is_available = ? WHERE id = ?', [newStatus, id]);

    return res.json({
      success: true,
      message: `Machinery is now marked as ${newStatus ? 'Available' : 'Unavailable'}.`,
      is_available: Boolean(newStatus)
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to toggle availability.' });
  }
};

exports.deleteMachinery = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await query('SELECT owner_id FROM machinery WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Machinery not found.' });
    }

    if (existing[0].owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this listing.' });
    }

    await query('DELETE FROM machinery WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Machinery deleted successfully.' });
  } catch (err) {
    console.error('Delete machinery error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete machinery listing.' });
  }
};
