const { query } = require('../database/db');

exports.getInquiries = async (req, res) => {
  try {
    const userId = req.user.id;
    const inquiries = await query(`
      SELECT i.*,
             m.title as machinery_title, m.category as machinery_category,
             sender.name as sender_name, sender.avatar as sender_avatar,
             receiver.name as receiver_name, receiver.avatar as receiver_avatar
      FROM inquiries i
      LEFT JOIN machinery m ON i.machinery_id = m.id
      JOIN users sender ON i.sender_id = sender.id
      JOIN users receiver ON i.receiver_id = receiver.id
      WHERE i.sender_id = ? OR i.receiver_id = ?
      ORDER BY i.created_at ASC
    `, [userId, userId]);

    return res.json({ success: true, count: inquiries.length, inquiries });
  } catch (err) {
    console.error('Error fetching inquiries:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve messages.' });
  }
};

exports.sendInquiry = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { machinery_id, receiver_id, message } = req.body;

    if (!receiver_id || !message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Recipient and message text are required.' });
    }

    if (Number(receiver_id) === senderId) {
      return res.status(400).json({ success: false, message: 'Cannot message yourself.' });
    }

    const result = await query(`
      INSERT INTO inquiries (machinery_id, sender_id, receiver_id, message)
      VALUES (?, ?, ?, ?)
    `, [machinery_id || null, senderId, receiver_id, message.trim()]);

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully!',
      inquiryId: result.insertId
    });
  } catch (err) {
    console.error('Error sending inquiry:', err);
    return res.status(500).json({ success: false, message: 'Failed to send message.' });
  }
};
