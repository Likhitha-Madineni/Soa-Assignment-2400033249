
import { useEffect, useState } from "react";

const emptyForm = {
  cardNumber: "",
  fineAmount: "",
  paymentDate: new Date().toISOString().slice(0, 10),
  paid: false,
};

function LibraryFinePaymentForm({ editData, saving, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editData) {
      setFormData({
        cardNumber: editData.cardNumber ?? "",
        fineAmount: editData.fineAmount ?? "",
        paymentDate: editData.paymentDate ?? "",
        paid: editData.paid === true,
      });
    } else {
      setFormData({ ...emptyForm });
    }
    setError("");
  }, [editData]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.cardNumber.trim()) {
      setError("Please enter a library card number.");
      return;
    }

    if (
      formData.fineAmount === "" ||
      !Number.isFinite(Number(formData.fineAmount)) ||
      Number(formData.fineAmount) <= 0
    ) {
      setError("Fine amount must be greater than zero.");
      return;
    }

    if (!formData.paymentDate) {
      setError("Please select a payment date.");
      return;
    }

    const succeeded = await onSubmit({
      cardNumber: formData.cardNumber.trim(),
      fineAmount: Number(formData.fineAmount),
      paymentDate: formData.paymentDate,
      paid: formData.paid,
    });

    if (succeeded && !editData) {
      setFormData({ ...emptyForm });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3">
        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="cardNumber">
            Library card number
          </label>
          <input
            className="form-control"
            id="cardNumber"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            placeholder="e.g. LIB1001"
            maxLength="50"
            required
          />
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="fineAmount">
            Fine amount (₹)
          </label>
          <input
            className="form-control"
            id="fineAmount"
            name="fineAmount"
            type="number"
            min="0.01"
            step="0.01"
            value={formData.fineAmount}
            onChange={handleChange}
            placeholder="Enter amount"
            required
          />
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="paymentDate">
            Payment date
          </label>
          <input
            className="form-control"
            id="paymentDate"
            name="paymentDate"
            type="date"
            value={formData.paymentDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-12 col-md-6">
          <div className="status-input">
            <div>
              <label className="form-label mb-1" htmlFor="paid">
                Payment completed
              </label>
              <p className="text-secondary small mb-0">
                Turn on if the fine has been paid.
              </p>
            </div>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                id="paid"
                name="paid"
                type="checkbox"
                role="switch"
                checked={formData.paid}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="col-12 d-flex gap-2 flex-wrap mt-4">
          <button className="btn btn-primary" type="submit" disabled={saving}>
            <i className={`bi ${saving ? "bi-hourglass-split" : editData ? "bi-check2-circle" : "bi-plus-circle"} me-2`} />
            {saving
              ? "Saving..."
              : editData
                ? "Update payment"
                : "Add payment"}
          </button>

          {editData && (
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={onCancel}
              disabled={saving}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

export default LibraryFinePaymentForm;
