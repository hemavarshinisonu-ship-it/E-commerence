import React, { useState, useEffect } from 'react';
import * as orderApi from '../api/orders';
import EmptyState from '../components/EmptyState';
import { Package, Clock, CheckCircle2, ChevronDown, ChevronUp, MapPin } from 'lucide-react';

const OrdersPage = ({ setCurrentPage }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [orderDetailsMap, setOrderDetailsMap] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await orderApi.getOrders();
        setOrders(data || []);
      } catch (err) {
        console.error('Fetch orders error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggleExpand = async (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      return;
    }

    setExpandedOrderId(orderId);

    if (!orderDetailsMap[orderId]) {
      try {
        const details = await orderApi.getOrderById(orderId);
        setOrderDetailsMap((prev) => ({ ...prev, [orderId]: details }));
      } catch (err) {
        console.error('Fetch order detail error:', err);
      }
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <Package size={28} color="var(--accent-primary)" />
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Order History</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Review your past purchases and track current order status.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading order history...</div>
      ) : orders.length === 0 ? (
        <EmptyState
          type="orders"
          title="No Orders Yet"
          subtitle="You haven't placed any orders yet. Start shopping today!"
          actionText="Browse Shop"
          onAction={() => setCurrentPage('home')}
        />
      ) : (
        <div className="orders-container">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const details = orderDetailsMap[order.id];

            return (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <div className="order-id">Order #{order.id}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={14} />
                      <span>{new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Total Amount</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        ${parseFloat(order.total_amount).toFixed(2)}
                      </div>
                    </div>

                    <span className="order-status">
                      <CheckCircle2 size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                      {order.status}
                    </span>

                    <button
                      onClick={() => toggleExpand(order.id)}
                      className="nav-item"
                      style={{ background: 'var(--bg-surface-hover)' }}
                    >
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={14} color="var(--accent-primary)" />
                  <span>Shipping Address: <strong>{order.shipping_address || 'Standard Delivery'}</strong></span>
                </div>

                {/* Expanded Item List */}
                {isExpanded && (
                  <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px dashed var(--border-color)' }}>
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Purchased Items</h4>
                    {details ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {details.items?.map((item) => (
                          <div key={item.id} style={{ display: 'flex', alignItems: 'center', justify: 'space-between', gap: '1rem', background: 'rgba(11, 15, 25, 0.4)', padding: '0.6rem 1rem', borderRadius: 'var(--radius-md)' }}>
                            <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Qty: {item.quantity} × ${item.price.toFixed(2)}</div>
                            </div>
                            <div style={{ fontWeight: 700 }}>${item.total.toFixed(2)}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div>Loading order items...</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
