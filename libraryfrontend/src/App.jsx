
import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import Navbar from "./components/Navbar.jsx";
import LibraryFinePaymentForm from "./components/LibraryFinePaymentForm.jsx";
import LibraryFinePaymentList from "./components/LibraryFinePaymentList.jsx";
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
  const [searchLoading, setSearchLoading] = useState(false);

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
  };

  // Display all payments
  const fetchPayments = useCallback(async () => {
    setLoading(true);

    try {
      const response = await axios.get(`${API_URL}/displayall`);
      setPayments(response.data);
    } catch (error) {
      showMessage(
        "Unable to load payments. Check the backend port and controller URL.",
        "danger"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // Add or update payment
  const handleSubmit = async (formData) => {
    setSaving(true);
    setMessage("");

    try {
      if (editData) {
        await axios.put(
          `${API_URL}/update/${editData.id}`,
          formData
        );
        showMessage("Fine payment updated successfully.");
        setEditData(null);
      } else {
        await axios.post(`${API_URL}/add`, formData);
        showMessage("Fine payment added successfully.");
      }

      setSearchResult(null);
      setSearchError("");
      await fetchPayments();
      return true;
    } catch (error) {
      showMessage(
        error.response?.data?.message ||
          "Unable to save payment. Check the backend and entered details.",
        "danger"
      );
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Edit payment
  const handleEdit = (payment) => {
    setEditData(payment);
    document.getElementById("add-payment")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // Delete payment
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment?")) {
      return;
    }

    setDeletingId(id);
    setMessage("");

    try {
      await axios.delete(`${API_URL}/delete/${id}`);
      showMessage("Fine payment deleted successfully.");

      if (editData?.id === id) {
        setEditData(null);
      }

      if (String(searchId) === String(id)) {
        setSearchResult(null);
        setSearchError("Payment ID not found.");
      }

      await fetchPayments();
    } catch (error) {
      showMessage("Unable to delete payment. Please try again.", "danger");
    } finally {
      setDeletingId(null);
    }
  };

  // Find payment by ID
  const findPayment = async (e) => {
    e.preventDefault();
    setSearchResult(null);
    setSearchError("");

    const id = searchId.trim();

    if (!/^[1-9]\d*$/.test(id)) {
      setSearchError("Please enter a valid Payment ID.");
      return;
    }

    setSearchLoading(true);

    try {
      const response = await axios.get(`${API_URL}/display/${id}`);
      const data = response.data;

      if (!data || data.id == null || String(data.id) !== id) {
        setSearchError("Payment ID not found.");
      } else {
        setSearchResult(data);
      }
    } catch (error) {
      setSearchError(
        error.response?.status === 404
          ? "Payment ID not found."
          : "Unable to search. Check the backend connection."
      );
    } finally {
      setSearchLoading(false);
    }
  };

  const paidCount = payments.filter(
    (payment) => payment.paid === true
  ).length;

  const unpaidCount = payments.filter(
    (payment) => payment.paid === false
  ).length;

  return (
    <>
      <Navbar />

      <main id="home" className="container py-4 py-md-5">
        <div className="page-heading mb-4">
          <p className="text-primary fw-semibold mb-1">
            LIBRARY SERVICES
          </p>
          <h1 className="fw-bold">Library Fine Payment System</h1>
          <p className="text-secondary mb-0">
            Manage library fine payments, update records, and check payment status.
          </p>
        </div>

        {message && (
          <div
            className={`alert alert-${messageType} alert-dismissible fade show`}
            role="alert"
          >
            {message}
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => setMessage("")}
            />
          </div>
        )}

        {/* Payment Overview */}
        <section className="mb-4" aria-label="Payment overview">
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <div className="card shadow-sm border-0 p-3 h-100">
                <span className="text-secondary">Total Payments</span>
                <h3 className="fw-bold mb-0">{payments.length}</h3>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="card shadow-sm border-0 p-3 h-100">
                <span className="text-secondary">Paid</span>
                <h3 className="fw-bold text-success mb-0">{paidCount}</h3>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="card shadow-sm border-0 p-3 h-100">
                <span className="text-secondary">Not Paid</span>
                <h3 className="fw-bold text-danger mb-0">{unpaidCount}</h3>
              </div>
            </div>
          </div>
        </section>

        {/* Add or Update Payment */}
        <section id="add-payment" className="mb-4">
          <div className="card shadow-sm border-0 p-3 p-md-4">
            <div className="mb-3">
              <h4 className="fw-bold mb-1">
                01. {editData ? "Update Payment" : "Add Fine Payment"}
              </h4>
              <p className="text-secondary mb-0">
                Enter the library card and fine payment details.
              </p>
            </div>

            <LibraryFinePaymentForm
              onSubmit={handleSubmit}
              editData={editData}
              onCancel={() => setEditData(null)}
              saving={saving}
            />
          </div>
        </section>

        {/* Display All Payments */}
        <section id="payments" className="mb-4">
          <div className="card shadow-sm border-0 p-3 p-md-4">
            <div className="mb-3">
              <h4 className="fw-bold mb-1">02. Display All Payments</h4>
              <p className="text-secondary mb-0">
                View, refresh, edit, and delete fine payment records.
              </p>
            </div>

            <LibraryFinePaymentList
              payments={payments}
              loading={loading}
              deletingId={deletingId}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRefresh={fetchPayments}
            />
          </div>
        </section>

        {/* Find Payment by ID */}
        <section id="find-payment" className="mb-4">
          <div className="card shadow-sm border-0 p-3 p-md-4">
            <div className="mb-3">
              <h4 className="fw-bold mb-1">03. Find Payment by ID</h4>
              <p className="text-secondary mb-0">
                Search for a payment using its generated ID.
              </p>
            </div>

            <form
              onSubmit={findPayment}
              className="row g-2 align-items-center"
            >
              <div className="col-12 col-md-8">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter Payment ID"
                  value={searchId}
                  onChange={(e) => {
                    setSearchId(e.target.value);
                    setSearchResult(null);
                    setSearchError("");
                  }}
                  min="1"
                  required
                />
              </div>

              <div className="col-12 col-md-4">
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={searchLoading}
                >
                  {searchLoading ? "Searching..." : "Find Payment"}
                </button>
              </div>
            </form>

            {searchError && (
              <div className="alert alert-danger mt-3 mb-0" role="alert">
                {searchError}
              </div>
            )}

            {searchResult && (
              <div className="mt-4 p-3 border rounded">
                <h5 className="fw-bold mb-3">Payment Details</h5>
                <p className="mb-2"><strong>ID:</strong> {searchResult.id}</p>
                <p className="mb-2">
                  <strong>Card Number:</strong> {searchResult.cardNumber}
                </p>
                <p className="mb-2">
                  <strong>Fine Amount:</strong>{" "}
                  {Number(searchResult.fineAmount).toFixed(2)}
                </p>
                <p className="mb-2">
                  <strong>Payment Date:</strong> {searchResult.paymentDate}
                </p>
                <p className="mb-3">
                  <strong>Status:</strong>{" "}
                  {searchResult.paid ? "Paid" : "Not Paid"}
                </p>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => handleEdit(searchResult)}
                >
                  Edit This Payment
                </button>
              </div>
            )}
          </div>
        </section>

        <footer className="text-center text-secondary py-4">
          Library Fine Payment System
        </footer>
      </main>
    </>
  );
}

export default App;
