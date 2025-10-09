import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

// Mock data helpers (replace with real API calls)
const mockDeliveries = [
  {
    id: "D-1001",
    customer: "Amal Perera",
    address: "12 Flower Rd, Colombo",
    items: ["2x Rice & Curry", "1x Coke"],
    instructions: "Leave at the front desk",
    status: "assigned",
    riderId: "R-01",
    timestamps: {},
    customerPhone: "+94-77-123-4567",
  },
  {
    id: "D-1002",
    customer: "Nisha Silva",
    address: "5 Galle Face, Colombo",
    items: ["1x Kottu", "1x Juice"],
    instructions: "Call on arrival",
    status: "picked_up",
    riderId: "R-01",
    timestamps: { picked_up: new Date().toISOString() },
    customerPhone: "+94-71-765-4321",
  },
];

const mockOrders = [
  { id: "O-9001", customer: "Amal Perera", total: 1200, status: "pending" },
  { id: "O-9002", customer: "Nisha Silva", total: 800, status: "completed" },
];

const mockReservations = [
  { id: "R-5001", name: "Kumar", covers: 4, time: "2025-10-10T19:00:00", table: null },
  { id: "R-5002", name: "Shanthi", covers: 2, time: "2025-10-11T12:30:00", table: 5 },
];

// Small utility for formatted time
function fmt(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString();
}

// Top-level layout components
function Header({ title }) {
  return (
    <header className="bg-white shadow-sm p-4 flex items-center justify-between">
      <h1 className="text-xl font-semibold">{title}</h1>
      <nav className="flex gap-3 items-center">
        <Link to="/rider" className="text-sm hover:underline">
          Rider
        </Link>
        <Link to="/admin/orders" className="text-sm hover:underline">
          Admin
        </Link>
      </nav>
    </header>
  );
}

function Sidebar() {
  return (
    <aside className="w-60 p-4 bg-gray-50 border-r">
      <ul className="space-y-2 text-sm">
        <li>
          <Link to="/rider" className="block p-2 rounded hover:bg-white">
            Rider Dashboard
          </Link>
        </li>
        <li>
          <Link to="/admin/orders" className="block p-2 rounded hover:bg-white">
            Order Management
          </Link>
        </li>
        <li>
          <Link to="/admin/reservations" className="block p-2 rounded hover:bg-white">
            Table Reservations
          </Link>
        </li>
      </ul>
    </aside>
  );
}

// --- Rider Views ---
function RiderDashboard() {
  const [deliveries, setDeliveries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Replace with fetch('/api/rider/deliveries')
    setDeliveries(mockDeliveries.filter((d) => d.riderId === "R-01"));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Rider Dashboard</h2>

      <div className="grid gap-4">
        {deliveries.map((d) => (
          <div key={d.id} className="p-4 bg-white rounded shadow-sm flex justify-between">
            <div>
              <div className="text-lg font-medium">{d.customer}</div>
              <div className="text-sm text-gray-600">{d.address}</div>
              <div className="text-sm text-gray-500">{d.items.join(", ")}</div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="text-sm">Status: <span className="font-semibold">{d.status}</span></div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/rider/delivery/${d.id}`)}
                  className="px-3 py-1 bg-indigo-600 text-white rounded"
                >
                  Open
                </button>
                <a href={`tel:${d.customerPhone}`} className="px-3 py-1 border rounded text-sm">
                  Call
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeliveryDetails() {
  const { id } = useParams();
  const [delivery, setDelivery] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const d = mockDeliveries.find((x) => x.id === id);
    setDelivery(d || null);
  }, [id]);

  if (!delivery) {
    return (
      <div className="p-6">
        <h2 className="text-xl">Delivery not found</h2>
        <button onClick={() => navigate(-1)} className="mt-4 px-3 py-1 bg-gray-200 rounded">
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold">Delivery {delivery.id}</h2>
          <div className="text-sm text-gray-600">{delivery.customer} — {delivery.customerPhone}</div>
        </div>
        <div className="text-sm text-gray-500">Assigned Rider: {delivery.riderId}</div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded shadow-sm">
          <h3 className="font-medium mb-2">Address & Instructions</h3>
          <div className="text-sm">{delivery.address}</div>
          <div className="text-sm text-gray-600 mt-2">{delivery.instructions}</div>
        </div>

        <div className="p-4 bg-white rounded shadow-sm">
          <h3 className="font-medium mb-2">Order Items</h3>
          <ul className="list-disc ml-5 text-sm">
            {delivery.items.map((it, i) => (
              <li key={i}>{it}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4">
        <DeliveryStatusUpdate delivery={delivery} onUpdate={() => {
          // For this demo we simply navigate back after update
          navigate('/rider');
        }} />
      </div>

      <div className="mt-6">
        <h4 className="text-sm text-gray-600">Navigation (placeholder)</h4>
        <div className="mt-2 p-3 bg-gray-100 rounded">[Integrate map provider here — e.g., Google Maps / Mapbox]</div>
      </div>
    </div>
  );
}

function DeliveryStatusUpdate({ delivery, onUpdate }) {
  const [status, setStatus] = useState(delivery.status);
  const [timestamps, setTimestamps] = useState(delivery.timestamps || {});

  function markStatus(next) {
    const newTimestamps = { ...timestamps };
    newTimestamps[next] = new Date().toISOString();

    // Here you'd call API to update the delivery status
    setStatus(next);
    setTimestamps(newTimestamps);

    // Update mockDeliveries in-memory for demo (mutating global mock)
    const idx = mockDeliveries.findIndex((m) => m.id === delivery.id);
    if (idx >= 0) {
      mockDeliveries[idx] = { ...mockDeliveries[idx], status: next, timestamps: newTimestamps };
    }

    if (onUpdate) onUpdate();
  }

  return (
    <div className="p-4 bg-white rounded shadow-sm">
      <h3 className="font-medium mb-2">Update Delivery Status</h3>
      <div className="flex items-center gap-2">
        <button
          disabled={status === 'picked_up'}
          onClick={() => markStatus('picked_up')}
          className="px-3 py-1 rounded border disabled:opacity-50"
        >
          Mark Picked Up
        </button>
        <button
          disabled={status === 'en_route'}
          onClick={() => markStatus('en_route')}
          className="px-3 py-1 rounded border disabled:opacity-50"
        >
          Mark En Route
        </button>
        <button
          disabled={status === 'delivered'}
          onClick={() => markStatus('delivered')}
          className="px-3 py-1 rounded border disabled:opacity-50"
        >
          Mark Delivered
        </button>
      </div>

      <div className="mt-3 text-sm text-gray-600">
        <div>Current: <strong>{status}</strong></div>
        <div className="mt-2">Timestamps:</div>
        <ul className="ml-5 list-disc">
          <li>Picked up: {fmt(timestamps.picked_up)}</li>
          <li>En route: {fmt(timestamps.en_route)}</li>
          <li>Delivered: {fmt(timestamps.delivered)}</li>
        </ul>
      </div>
    </div>
  );
}

// --- Admin Views ---
function OrderManagement() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // replace with fetch('/api/orders')
    setOrders(mockOrders);
  }, []);

  function updateStatus(orderId, nextStatus) {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o)));
    // call API to persist
  }

  function assignToRider(orderId, riderId) {
    // In a real app you'd call API to assign
    alert(`Assigning ${orderId} to rider ${riderId} (demo)`);
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Order Management</h2>
      <div className="bg-white rounded shadow-sm p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="py-2">Order</th>
              <th className="py-2">Customer</th>
              <th className="py-2">Total</th>
              <th className="py-2">Status</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b">
                <td className="py-2">{o.id}</td>
                <td className="py-2">{o.customer}</td>
                <td className="py-2">LKR {o.total}</td>
                <td className="py-2">{o.status}</td>
                <td className="py-2 flex gap-2">
                  <button onClick={() => updateStatus(o.id, 'preparing')} className="px-2 py-1 border rounded text-xs">Preparing</button>
                  <button onClick={() => updateStatus(o.id, 'ready')} className="px-2 py-1 border rounded text-xs">Ready</button>
                  <button onClick={() => updateStatus(o.id, 'completed')} className="px-2 py-1 border rounded text-xs">Complete</button>
                  <button onClick={() => assignToRider(o.id, 'R-01')} className="px-2 py-1 border rounded text-xs">Assign</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReservationManagement() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    setReservations(mockReservations);
  }, []);

  function cancelReservation(id) {
    setReservations((prev) => prev.filter((r) => r.id !== id));
  }

  function editReservation(id, updates) {
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Table Reservation Management</h2>
      <div className="grid gap-3">
        {reservations.map((r) => (
          <div key={r.id} className="p-4 bg-white rounded shadow-sm flex justify-between">
            <div>
              <div className="font-medium">{r.name} — {r.covers} covers</div>
              <div className="text-sm text-gray-600">Time: {new Date(r.time).toLocaleString()}</div>
              <div className="text-sm text-gray-600">Table: {r.table ?? 'TBD'}</div>
            </div>
            <div className="flex gap-2 items-center">
              <button onClick={() => editReservation(r.id, { table: r.table ?? 1 })} className="px-2 py-1 border rounded text-sm">Assign Table</button>
              <button onClick={() => cancelReservation(r.id)} className="px-2 py-1 border rounded text-sm">Cancel</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// App shell
export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header title="Delivery + Restaurant Admin" />
        <div className="flex">
          <Sidebar />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/rider" element={<RiderDashboard />} />
              <Route path="/rider/delivery/:id" element={<DeliveryDetails />} />

              <Route path="/admin/orders" element={<OrderManagement />} />
              <Route path="/admin/reservations" element={<ReservationManagement />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold">Welcome</h2>
      <p className="text-sm text-gray-600 mt-2">Choose Rider or Admin area from the header or sidebar.</p>
    </div>
  );
}

function NotFound() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold">404 — Not Found</h2>
      <p className="mt-2 text-sm text-gray-600">This route does not exist.</p>
    </div>
  );
}
