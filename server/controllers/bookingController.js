const { query } = require('../database/db');

exports.createBooking = async (req, res) => {
  try {
    const farmerId = req.user.id;
    const {
      machinery_id,
      start_date,
      end_date,
      rental_type = 'daily',
      duration = 1,
      farmer_notes = '',
      weather_condition = 'Clear'
    } = req.body;

    if (!machinery_id || !start_date || !end_date) {
      return res.status(400).json({ success: false, message: 'Machinery, start date, and end date are required.' });
    }

    // Verify machinery exists and is available
    const machines = await query('SELECT * FROM machinery WHERE id = ?', [machinery_id]);
    if (machines.length === 0) {
      return res.status(404).json({ success: false, message: 'Machinery not found.' });
    }
    const machine = machines[0];

    if (!machine.is_available) {
      return res.status(400).json({ success: false, message: 'This machinery is currently marked as unavailable by the owner.' });
    }

    if (machine.owner_id === farmerId) {
      return res.status(400).json({ success: false, message: 'You cannot rent your own machinery.' });
    }

    // Collision Check: Check for overlapping bookings that are confirmed or pending
    // Overlap condition: (StartA <= EndB) and (EndA >= StartB)
    const collisions = await query(`
      SELECT id, start_date, end_date, status
      FROM bookings
      WHERE machinery_id = ?
        AND status IN ('pending', 'confirmed')
        AND (start_date <= ? AND end_date >= ?)
    `, [machinery_id, end_date, start_date]);

    if (collisions.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'This machinery is already reserved or booked for the selected date range. Please choose different dates.',
        conflictingBooking: collisions[0]
      });
    }

    // Calculate total rental amount
    let totalAmount = 0;
    const parsedDuration = Math.max(1, Number(duration));

    if (rental_type === 'hourly') {
      totalAmount = parsedDuration * Number(machine.hourly_rate);
    } else {
      // daily
      const d1 = new Date(start_date);
      const d2 = new Date(end_date);
      const diffDays = Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)) + 1);
      totalAmount = diffDays * Number(machine.daily_rate);
    }

    const result = await query(`
      INSERT INTO bookings (
        machinery_id, farmer_id, start_date, end_date, rental_type, duration,
        total_amount, status, farmer_notes, weather_condition_at_booking
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)
    `, [
      machinery_id,
      farmerId,
      start_date,
      end_date,
      rental_type,
      parsedDuration,
      totalAmount,
      farmer_notes,
      weather_condition
    ]);

    return res.status(201).json({
      success: true,
      message: 'Booking request sent to owner successfully!',
      bookingId: result.insertId,
      totalAmount
    });
  } catch (err) {
    console.error('Booking creation error:', err);
    return res.status(500).json({ success: false, message: 'Failed to process booking request.' });
  }
};

exports.getFarmerBookings = async (req, res) => {
  try {
    const farmerId = req.user.id;
    const bookings = await query(`
      SELECT b.*,
             m.title as machinery_title, m.category as machinery_category, m.image_url as machinery_image,
             m.location as machinery_location, m.brand_model,
             u.name as owner_name, u.phone as owner_phone, u.email as owner_email
      FROM bookings b
      JOIN machinery m ON b.machinery_id = m.id
      JOIN users u ON m.owner_id = u.id
      WHERE b.farmer_id = ?
      ORDER BY b.id DESC
    `, [farmerId]);

    return res.json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    console.error('Error getting farmer bookings:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve bookings.' });
  }
};

exports.getOwnerBookings = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const bookings = await query(`
      SELECT b.*,
             m.title as machinery_title, m.category as machinery_category, m.image_url as machinery_image,
             u.name as farmer_name, u.phone as farmer_phone, u.email as farmer_email, u.location as farmer_location
      FROM bookings b
      JOIN machinery m ON b.machinery_id = m.id
      JOIN users u ON b.farmer_id = u.id
      WHERE m.owner_id = ?
      ORDER BY b.id DESC
    `, [ownerId]);

    return res.json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    console.error('Error getting owner bookings:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve rental requests.' });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, owner_notes } = req.body; // status: 'confirmed', 'rejected', 'completed', 'cancelled'

    const validStatuses = ['pending', 'confirmed', 'rejected', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid booking status.' });
    }

    const rows = await query(`
      SELECT b.*, m.owner_id
      FROM bookings b
      JOIN machinery m ON b.machinery_id = m.id
      WHERE b.id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    const booking = rows[0];

    // Authorization checks
    if (status === 'cancelled') {
      // Farmer or owner can cancel
      if (booking.farmer_id !== req.user.id && booking.owner_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Unauthorized to cancel this booking.' });
      }
    } else {
      // Approving, rejecting, or marking completed belongs to the owner
      if (booking.owner_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Only the equipment owner can update this reservation.' });
      }
    }

    await query(`
      UPDATE bookings
      SET status = ?, owner_notes = COALESCE(?, owner_notes)
      WHERE id = ?
    `, [status, owner_notes || null, id]);

    return res.json({
      success: true,
      message: `Booking has been updated to "${status}".`,
      status
    });
  } catch (err) {
    console.error('Update booking status error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update booking status.' });
  }
};
