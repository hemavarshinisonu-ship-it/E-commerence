const db = require('../config/db');

// GET /api/wishlist — current user's liked products joined with product details
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const sql = `
      SELECT 
        w.id AS wishlist_id,
        w.created_at AS liked_at,
        p.id AS product_id,
        p.name,
        p.description,
        p.price,
        p.image,
        p.category,
        p.stock
      FROM wishlist_items w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = ?
      ORDER BY w.created_at DESC
    `;

    const [items] = await db.query(sql, [userId]);

    const formattedItems = items.map(item => ({
      ...item,
      price: parseFloat(item.price),
      liked: true
    }));

    return res.status(200).json(formattedItems);
  } catch (error) {
    console.error('Get Wishlist Error:', error);
    return res.status(500).json({ message: 'Server error fetching wishlist.' });
  }
};

// POST /api/wishlist/:productId — like a product (ignore if already liked, don't error)
exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required.' });
    }

    // Check if product exists
    const [products] = await db.query('SELECT * FROM products WHERE id = ?', [productId]);
    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Insert ignore to handle unique (user_id, product_id) gracefully without erroring
    await db.query(
      'INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (?, ?)',
      [userId, productId]
    );

    return res.status(200).json({
      message: 'Product added to wishlist.',
      productId: Number(productId),
      liked: true
    });
  } catch (error) {
    console.error('Add To Wishlist Error:', error);
    return res.status(500).json({ message: 'Server error adding product to wishlist.' });
  }
};

// DELETE /api/wishlist/:productId — unlike a product
exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    await db.query(
      'DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    return res.status(200).json({
      message: 'Product removed from wishlist.',
      productId: Number(productId),
      liked: false
    });
  } catch (error) {
    console.error('Remove From Wishlist Error:', error);
    return res.status(500).json({ message: 'Server error removing product from wishlist.' });
  }
};
