const db = require('../config/db');

// GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    const userId = req.user ? req.user.id : null;

    let sql = `
      SELECT p.*,
        IF(w.id IS NOT NULL, TRUE, FALSE) AS liked
      FROM products p
      LEFT JOIN wishlist_items w ON p.id = w.product_id AND w.user_id = ?
      WHERE 1=1
    `;
    const params = [userId];

    if (category) {
      sql += ` AND LOWER(p.category) = LOWER(?)`;
      params.push(category);
    }

    if (search) {
      sql += ` AND (LOWER(p.name) LIKE LOWER(?) OR LOWER(p.description) LIKE LOWER(?))`;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (sort === 'price_asc') {
      sql += ` ORDER BY p.price ASC`;
    } else if (sort === 'price_desc') {
      sql += ` ORDER BY p.price DESC`;
    } else if (sort === 'newest') {
      sql += ` ORDER BY p.created_at DESC`;
    } else {
      sql += ` ORDER BY p.id ASC`;
    }

    const [products] = await db.query(sql, params);

    // Format liked boolean properly
    const formattedProducts = products.map(p => ({
      ...p,
      price: parseFloat(p.price),
      liked: Boolean(p.liked)
    }));

    return res.status(200).json(formattedProducts);
  } catch (error) {
    console.error('Get Products Error:', error);
    return res.status(500).json({ message: 'Server error fetching products.' });
  }
};

// GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user.id : null;

    const sql = `
      SELECT p.*,
        IF(w.id IS NOT NULL, TRUE, FALSE) AS liked
      FROM products p
      LEFT JOIN wishlist_items w ON p.id = w.product_id AND w.user_id = ?
      WHERE p.id = ?
    `;

    const [products] = await db.query(sql, [userId, id]);

    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const product = {
      ...products[0],
      price: parseFloat(products[0].price),
      liked: Boolean(products[0].liked)
    };

    return res.status(200).json(product);
  } catch (error) {
    console.error('Get Product By ID Error:', error);
    return res.status(500).json({ message: 'Server error fetching product details.' });
  }
};
