const db = require('../config/db');

// GET /api/cart — current user's cart joined with product details
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const sql = `
      SELECT 
        c.id AS cart_id,
        c.quantity,
        p.id AS product_id,
        p.name,
        p.price,
        p.image,
        p.stock,
        p.category
      FROM cart_items c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
      ORDER BY c.created_at DESC
    `;

    const [items] = await db.query(sql, [userId]);

    const formattedItems = items.map(item => ({
      ...item,
      price: parseFloat(item.price),
      total: parseFloat((item.price * item.quantity).toFixed(2))
    }));

    const subtotal = formattedItems.reduce((acc, item) => acc + item.total, 0);

    return res.status(200).json({
      items: formattedItems,
      subtotal: parseFloat(subtotal.toFixed(2)),
      itemCount: formattedItems.reduce((acc, item) => acc + item.quantity, 0)
    });
  } catch (error) {
    console.error('Get Cart Error:', error);
    return res.status(500).json({ message: 'Server error fetching shopping cart.' });
  }
};

// POST /api/cart — add item to cart (increment quantity if already exists)
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required.' });
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({ message: 'Quantity must be a positive integer.' });
    }

    // Check if product exists
    const [products] = await db.query('SELECT * FROM products WHERE id = ?', [productId]);
    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const product = products[0];

    // Check existing cart item
    const [existing] = await db.query(
      'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    if (existing && existing.length > 0) {
      const newQuantity = existing[0].quantity + qty;
      if (newQuantity > product.stock) {
        return res.status(400).json({ message: `Cannot add more. Stock limit reached (${product.stock} available).` });
      }
      await db.query(
        'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?',
        [newQuantity, userId, productId]
      );
    } else {
      if (qty > product.stock) {
        return res.status(400).json({ message: `Cannot add requested quantity. Stock available: ${product.stock}` });
      }
      await db.query(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [userId, productId, qty]
      );
    }

    return res.status(200).json({ message: `Added ${product.name} to cart.`, productId });
  } catch (error) {
    console.error('Add To Cart Error:', error);
    return res.status(500).json({ message: 'Server error adding item to cart.' });
  }
};

// PUT /api/cart/:productId — update item quantity
exports.updateCartQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    const qty = parseInt(quantity, 10);
    if (isNaN(qty)) {
      return res.status(400).json({ message: 'Valid quantity is required.' });
    }

    if (qty <= 0) {
      // Remove if quantity is 0 or less
      await db.query(
        'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?',
        [userId, productId]
      );
      return res.status(200).json({ message: 'Item removed from cart.', productId });
    }

    // Check stock limit
    const [products] = await db.query('SELECT stock FROM products WHERE id = ?', [productId]);
    if (products && products.length > 0 && qty > products[0].stock) {
      return res.status(400).json({ message: `Only ${products[0].stock} items available in stock.` });
    }

    await db.query(
      'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?',
      [qty, userId, productId]
    );

    return res.status(200).json({ message: 'Cart quantity updated.', productId, quantity: qty });
  } catch (error) {
    console.error('Update Cart Quantity Error:', error);
    return res.status(500).json({ message: 'Server error updating cart quantity.' });
  }
};

// DELETE /api/cart/:productId — remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    await db.query(
      'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    return res.status(200).json({ message: 'Item removed from cart.', productId });
  } catch (error) {
    console.error('Remove From Cart Error:', error);
    return res.status(500).json({ message: 'Server error removing item from cart.' });
  }
};
