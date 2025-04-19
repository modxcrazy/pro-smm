import { db, auth } from './firebase.js';

// Load dashboard data
export async function loadDashboardData(userId) {
  try {
    // Load user balance
    const userDoc = await db.collection('users').doc(userId).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      document.getElementById('userBalance').textContent = 
        `$${userData.balance?.toFixed(2) || '0.00'}`;
    }

    // Load order stats
    const ordersRef = db.collection('orders').where('userId', '==', userId);
    
    // Total orders count
    const totalOrdersSnapshot = await ordersRef.get();
    document.getElementById('totalOrders').textContent = totalOrdersSnapshot.size;
    
    // Completed orders count
    const completedSnapshot = await ordersRef.where('status', '==', 'completed').get();
    document.getElementById('completedOrders').textContent = completedSnapshot.size;
    
    // Processing orders count
    const processingSnapshot = await ordersRef.where('status', '==', 'processing').get();
    document.getElementById('processingOrders').textContent = processingSnapshot.size;
    
    // Recent orders list
    const recentOrdersSnapshot = await ordersRef.orderBy('createdAt', 'desc').limit(5).get();
    const tbody = document.querySelector('#ordersTable tbody');
    tbody.innerHTML = '';
    
    recentOrdersSnapshot.forEach(doc => {
      const order = doc.data();
      const row = document.createElement('tr');
      
      row.innerHTML = `
        <td>${doc.id.substring(0, 8)}...</td>
        <td>${order.serviceName || 'N/A'}</td>
        <td>${order.quantity || 0}</td>
        <td>$${(order.price || 0).toFixed(2)}</td>
        <td><span class="status ${order.status || 'pending'}">${order.status || 'pending'}</span></td>
        <td>${order.createdAt?.toDate().toLocaleDateString() || 'N/A'}</td>
      `;
      
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading dashboard data:", error);
  }
}

// Check if user is admin
export async function checkAdminStatus(userId) {
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (userDoc.exists && userDoc.data().role === 'admin') {
      document.getElementById('adminLink').style.display = 'block';
    }
  } catch (error) {
    console.error("Error checking admin status:", error);
  }
}

// Common function to show loading state
export function showLoading(element) {
  element.innerHTML = '<div class="loading-spinner"></div>';
}

// Common function to show error message
export function showError(element, message) {
  element.innerHTML = `<div class="error-message">${message}</div>`;
}

// Format currency
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

// Format date
export function formatDate(timestamp) {
  if (!timestamp) return 'N/A';
  return timestamp.toDate().toLocaleString();
}
