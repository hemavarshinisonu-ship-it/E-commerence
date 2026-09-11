const db = require('../config/db');

// POST /api/orders — create order from current cart
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shippingAddress, paymentMethod = 'google_pay', upiId } = req.body;

    // Fetch user cart items
    const [cartItems] = await db.query(
      `SELECT c.product_id, c.quantity, p.price, p.stock, p.name, p.image 
       FROM cart_items c 
       JOIN products p ON c.product_id = p.id 
       WHERE c.user_id = ?`,
      [userId]
    );

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty. Add items before checking out.' });
    }

    // Calculate total amount
    const totalAmount = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);

    // Address text formatting
    const addressStr = typeof shippingAddress === 'object'
      ? `${shippingAddress.name} (${shippingAddress.phone}), ${shippingAddress.address}, ${shippingAddress.city} - ${shippingAddress.pincode} [${shippingAddress.type || 'Home'}]`
      : (shippingAddress || 'Standard Delivery Address');

    // Create order record
    const [orderResult] = await db.query(
      'INSERT INTO orders (user_id, total_amount, status, shipping_address) VALUES (?, ?, ?, ?)',
      [userId, totalAmount.toFixed(2), 'paid', addressStr]
    );

    const orderId = orderResult.insertId;

    // Insert order items
    const purchasedItems = [];
    for (const item of cartItems) {
      await db.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price]
      );
      purchasedItems.push({
        id: item.product_id,
        name: item.name,
        image: item.image,
        quantity: item.quantity,
        price: parseFloat(item.price),
        total: parseFloat((item.price * item.quantity).toFixed(2))
      });
    }

    // Clear user cart
    await db.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);

    // Calculate estimated delivery date (3 days from today)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);

    return res.status(201).json({
      message: 'Order placed successfully!',
      order: {
        id: orderId,
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        status: 'paid',
        paymentMethod: paymentMethod.replace('_', ' ').toUpperCase(),
        upiId: upiId || null,
        itemsCount: cartItems.reduce((acc, item) => acc + item.quantity, 0),
        items: purchasedItems,
        shippingAddress: addressStr,
        estimatedDelivery: deliveryDate.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })
      }
    });
  } catch (error) {
    console.error('Create Order Error:', error);
    return res.status(500).json({ message: 'Server error processing order.' });
  }
};

// GET /api/orders — order history
exports.getOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const [orders] = await db.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    const formattedOrders = orders.map(order => ({
      ...order,
      total_amount: parseFloat(order.total_amount)
    }));

    return res.status(200).json(formattedOrders);
  } catch (error) {
    console.error('Get Orders Error:', error);
    return res.status(500).json({ message: 'Server error fetching order history.' });
  }
};

// GET /api/orders/:id — single order with items
exports.getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const [orders] = await db.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const order = orders[0];

    const [items] = await db.query(
      `SELECT oi.*, p.name, p.image, p.category 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
      [id]
    );

    const formattedItems = items.map(item => ({
      ...item,
      price: parseFloat(item.price),
      total: parseFloat((item.price * item.quantity).toFixed(2))
    }));

    return res.status(200).json({
      ...order,
      total_amount: parseFloat(order.total_amount),
      items: formattedItems
    });
  } catch (error) {
    console.error('Get Order By ID Error:', error);
    return res.status(500).json({ message: 'Server error fetching order details.' });
  }
};
