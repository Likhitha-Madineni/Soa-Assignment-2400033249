
import { useEffect, useState } from "react";

const initialForm = {
  cardNumber: "",
  fineAmount: "",
  paymentDate: "",
  paid: false,
};

function LibraryFinePaymentForm({ onSubmit, editData, onCancel, saving }) {
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (editData) {
      setFormData({
        cardNumber: editData.cardNumber ?? "",
        fineAmount: editData.fineAmount ?? "",
        paymentDate: editData.paymentDate ?? "",
        paid: editData.paid ?? false,
      });
    } else {
      setFormData(initialForm);
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.cardNumber.trim()) {
      alert("Please enter the library card number.");
      return;
    }

    if (
      formData.fineAmount === "" ||
      !Number.isFinite(Number(formData.fineAmount)) ||
      Number(formData.fineAmount) < 0
    ) {
      alert("Please enter a valid, non-negative fine amount.");
      return;
    }

    if (!formData.paymentDate) {
      alert("Please select the payment date.");
      return;
    }

    await onSubmit({
      ...formData,
      cardNumber: formData.cardNumber.trim(),
      fineAmount: Number(formData.fineAmount),
      paid: Boolean(formData.paid),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="cardNumber" className="form-label">
          Library Card Number
        </label>
        <input
          id="cardNumber"
          name="cardNumber"
          type="text"
          className="form-control"
          placeholder="Enter library card number"
          value={formData.cardNumber}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="fineAmount" className="form-label">
          Fine Amount
        </label>
        <input
          id="fineAmount"
          name="fineAmount"
          type="number"
          className="form-control"
          placeholder="Enter fine amount"
          min="0"
          step="0.01"
          value={formData.fineAmount}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="paymentDate" className="form-label">
          Payment Date
        </label>
        <input
          id="paymentDate"
          name="paymentDate"
          type="date"
          className="form-control"
          value={formData.paymentDate}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-check mb-3">
        <input
          id="paid"
          name="paid"
          type="checkbox"
          className="form-check-input"
          checked={formData.paid}
          onChange={handleChange}
        />
        <label htmlFor="paid" className="form-check-label">
          Fine Paid
        </label>
      </div>

      <div className="d-flex gap-2">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : editData
              ? "Update Payment"
              : "Add Payment"}
        </button>

        {editData && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={saving}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default LibraryFinePaymentForm;
