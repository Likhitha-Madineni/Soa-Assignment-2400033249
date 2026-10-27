
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import LibraryFinePaymentForm from "./components/LibraryFinePaymentForm";
import LibraryFinePaymentList from "./components/LibraryFinePaymentList";
import "./App.css";

const API_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:8001"
}/libraryfinepayment`;

function App() {
  const [payments, setPayments] = useState([]);
  const [editData, setEditData] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState("");

  const [deleteId, setDeleteId] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const notify = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
  };

  const fetchPayments = useCallback(async () => {
    setLoading(true);

    try {
      const response = await axios.get(`${API_URL}/displayall`);
      setPayments(Array.isArray(response.data) ? response.data : []);
    } catch {
      notify(
        "Cannot load records. Check that Spring Boot is running on port 8001.",
        "danger"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleSubmit = async (formData) => {
    setSaving(true);
    setMessage("");

    try {
      if (editData) {
        await axios.put(`${API_URL}/update/${editData.id}`, formData);
        notify("Payment updated successfully.");
      } else {
        await axios.post(`${API_URL}/add`, formData);
        notify("Payment added successfully.");
      }

      setEditData(null);
      setSearchResult(null);
      await fetchPayments();
      return true;
    } catch (error) {
      notify(
        error.response?.data?.message ||
          "Could not save payment. Check the backend and entered details.",
        "danger"
      );
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (payment) => {
    setEditData(payment);

    document.getElementById("payment-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Delete a payment from the table or search result.
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        `Are you sure you want to delete payment ID ${id}? This cannot be undone.`
      )
    ) {
      return false;
    }

    setDeletingId(id);
    setMessage("");

    try {
      // Verify that the record exists first.
      const response = await axios.get(`${API_URL}/display/${id}`);

      if (
        !response.data ||
        response.data.id == null ||
        String(response.data.id) !== String(id)
      ) {
        notify(`Payment ID ${id} not found.`, "danger");
        return false;
      }

      await axios.delete(`${API_URL}/delete/${id}`);

      notify(`Payment ID ${id} deleted successfully.`);

      if (String(editData?.id) === String(id)) {
        setEditData(null);
      }

      if (String(searchResult?.id) === String(id)) {
        setSearchResult(null);
      }

      await fetchPayments();
      return true;
    } catch (error) {
      if (error.response?.status === 404) {
        notify(`Payment ID ${id} not found.`, "danger");
      } else {
        notify(
          error.response?.data?.message ||
            `Could not delete payment ID ${id}. Check the backend connection.`,
          "danger"
        );
      }
      return false;
    } finally {
      setDeletingId(null);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    setSearchResult(null);
    setSearchError("");

    const id = searchId.trim();

    if (!/^[1-9]\d*$/.test(id)) {
      setSearchError("Enter a valid positive payment ID.");
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/display/${id}`);

      if (
        !response.data ||
        response.data.id == null ||
        String(response.data.id) !== id
      ) {
        setSearchError(`Payment ID ${id} not found.`);
      } else {
        setSearchResult(response.data);
      }
    } catch (error) {
      setSearchError(
        error.response?.status === 404
          ? `Payment ID ${id} not found.`
          : "Search failed. Check the backend connection."
      );
    }
  };

  // Delete directly by entering an ID.
  const handleDeleteById = async (event) => {
    event.preventDefault();
    setDeleteError("");
    setMessage("");

    const id = deleteId.trim();

    if (!/^[1-9]\d*$/.test(id)) {
      setDeleteError("Enter a valid positive payment ID.");
      return;
    }

    setDeleteLoading(true);

    try {
      // Check existence before asking to delete.
      const response = await axios.get(`${API_URL}/display/${id}`);
      const payment = response.data;

      if (
        !payment ||
        payment.id == null ||
        String(payment.id) !== id
      ) {
        setDeleteError(`Payment ID ${id} not found.`);
        return;
      }

      if (
        !window.confirm(
          `Are you sure you want to delete payment ID ${id}? This cannot be undone.`
        )
      ) {
        return;
      }

      await axios.delete(`${API_URL}/delete/${id}`);

      notify(`Payment ID ${id} deleted successfully.`);
      setDeleteId("");

      if (String(searchResult?.id) === id) {
        setSearchResult(null);
      }

      if (String(editData?.id) === id) {
        setEditData(null);
      }

      await fetchPayments();
    } catch (error) {
      if (error.response?.status === 404) {
        setDeleteError(`Payment ID ${id} not found.`);
      } else {
        notify(
          error.response?.data?.message ||
            "Unable to delete payment. Check the backend connection.",
          "danger"
        );
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const stats = useMemo(() => {
    const paid = payments.filter((p) => p.paid === true).length;
    const unpaid = payments.filter((p) => p.paid !== true).length;

    const totalAmount = payments.reduce(
      (sum, p) => sum + (Number(p.fineAmount) || 0),
      0
    );

    return {
      total: payments.length,
      paid,
      unpaid,
      totalAmount,
    };
  }, [payments]);

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesStatus =
        filter === "all" ||
        (filter === "paid" && payment.paid === true) ||
        (filter === "unpaid" && payment.paid !== true);

      const text =
        `${payment.id} ${payment.cardNumber}`.toLowerCase();

      return (
        matchesStatus &&
        text.includes(query.toLowerCase().trim())
      );
    });
  }, [payments, filter, query]);

  return (
    <>
      <Navbar />

      <main className="dashboard container-fluid">
        <section id="home" className="welcome-panel">
          <div>
            <h1>Fine Payment Dashboard</h1>
            <p>
              Manage, search, and track library fine payments in one place.
            </p>
          </div>

          <button
            className="btn btn-light refresh-main"
            type="button"
            onClick={fetchPayments}
            disabled={loading}
          >
            <i className="bi bi-arrow-clockwise me-2" />
            {loading ? "Refreshing..." : "Refresh data"}
          </button>
        </section>

        {message && (
          <div
            className={`alert alert-${messageType} alert-dismissible fade show`}
            role="alert"
          >
            {message}
            <button
              className="btn-close"
              type="button"
              aria-label="Close"
              onClick={() => setMessage("")}
            />
          </div>
        )}

        <section className="stats-grid">
          <article className="stat-card">
            <div className="stat-icon blue">
              <i className="bi bi-receipt" />
            </div>
            <span>Total records</span>
            <h2>{stats.total}</h2>
            <small>All payment records</small>
          </article>

          <article className="stat-card">
            <div className="stat-icon green">
              <i className="bi bi-check-circle" />
            </div>
            <span>Paid payments</span>
            <h2>{stats.paid}</h2>
            <small>Successfully marked paid</small>
          </article>

          <article className="stat-card">
            <div className="stat-icon orange">
              <i className="bi bi-clock-history" />
            </div>
            <span>Unpaid payments</span>
            <h2>{stats.unpaid}</h2>
            <small>Awaiting payment</small>
          </article>

          <article className="stat-card">
            <div className="stat-icon purple">
              <i className="bi bi-currency-rupee" />
            </div>
            <span>Total fine amount</span>
            <h2>
              ₹
              {stats.totalAmount.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h2>
            <small>Across all records</small>
          </article>
        </section>

        <section id="payment-form" className="panel form-panel">
          <div className="section-heading">
            <div>
              <h2>
                {editData ? "Update payment" : "Add a fine payment"}
              </h2>
              <p>
                {editData
                  ? `Editing payment ID ${editData.id}`
                  : "Enter the details below to create a payment record."}
              </p>
            </div>

            {editData && (
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setEditData(null)}
              >
                Cancel edit
              </button>
            )}
          </div>

          <LibraryFinePaymentForm
            key={editData?.id ?? "new-payment"}
            editData={editData}
            saving={saving}
            onSubmit={handleSubmit}
            onCancel={() => setEditData(null)}
          />
        </section>

        <section id="records" className="panel">
          <div className="section-heading">
            <div>
              <h2>All payments</h2>
              <p>
                Search records, filter payment status, edit, or delete.
              </p>
            </div>

            <span className="record-count">
              {filteredPayments.length} records
            </span>
          </div>

          <div className="toolbar">
            <div className="search-input">
              <i className="bi bi-search" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by ID or card number..."
                aria-label="Search payment records"
              />
            </div>

            <select
              className="form-select status-filter"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              aria-label="Filter by payment status"
            >
              <option value="all">All statuses</option>
              <option value="paid">Paid only</option>
              <option value="unpaid">Unpaid only</option>
            </select>
          </div>

          <LibraryFinePaymentList
            payments={filteredPayments}
            loading={loading}
            deletingId={deletingId}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRefresh={fetchPayments}
          />
        </section>

        <section id="find-payment" className="panel">
          <div className="section-heading">
            <div>
              <h2>Find a payment</h2>
              <p>Look up one record using its payment ID.</p>
            </div>
          </div>

          <form className="lookup-form" onSubmit={handleSearch}>
            <input
              className="form-control"
              type="number"
              min="1"
              step="1"
              required
              value={searchId}
              onChange={(event) => setSearchId(event.target.value)}
              placeholder="Enter payment ID"
            />

            <button className="btn btn-primary" type="submit">
              <i className="bi bi-search me-2" />
              Find payment
            </button>
          </form>

          {searchError && (
            <div className="alert alert-warning mt-3">
              {searchError}
            </div>
          )}

          {searchResult && (
            <div className="lookup-result">
              <div>
                <h3>Payment #{searchResult.id}</h3>
                <p>Card number: {searchResult.cardNumber}</p>
                <p>Payment date: {searchResult.paymentDate}</p>
                <h4>
                  ₹{Number(searchResult.fineAmount).toFixed(2)}
                </h4>

                <span
                  className={`status-badge ${
                    searchResult.paid ? "paid" : "unpaid"
                  }`}
                >
                  {searchResult.paid ? "Paid" : "Not paid"}
                </span>
              </div>

              <div className="lookup-actions">
                <button
                  className="btn btn-outline-primary"
                  type="button"
                  onClick={() => handleEdit(searchResult)}
                >
                  <i className="bi bi-pencil me-2" />
                  Edit
                </button>

                <button
                  className="btn btn-outline-danger"
                  type="button"
                  onClick={() => handleDelete(searchResult.id)}
                  disabled={deletingId === searchResult.id}
                >
                  <i className="bi bi-trash me-2" />
                  {deletingId === searchResult.id
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            </div>
          )}
        </section>

        <section id="delete-payment" className="panel">
          <div className="section-heading">
            <div>
              <h2>Delete payment by ID</h2>
              <p>
                Enter the ID of the payment you want to delete.
              </p>
            </div>
          </div>

          <form
            className="lookup-form"
            onSubmit={handleDeleteById}
          >
            <input
              className="form-control"
              type="number"
              min="1"
              step="1"
              required
              value={deleteId}
              onChange={(event) => {
                setDeleteId(event.target.value);
                setDeleteError("");
              }}
              placeholder="Enter payment ID to delete"
              aria-label="Payment ID to delete"
            />

            <button
              className="btn btn-danger"
              type="submit"
              disabled={deleteLoading || deletingId !== null}
            >
              <i className="bi bi-trash me-2" />
              {deleteLoading ? "Deleting..." : "Delete payment"}
            </button>
          </form>

          {deleteError && (
            <div className="alert alert-danger mt-3" role="alert">
              {deleteError}
            </div>
          )}
        </section>

        <footer className="dashboard-footer">
          <span>Library Fine Payment System</span>
          <span>Payment management dashboard</span>
        </footer>
      </main>
    </>
  );
}

export default App;
