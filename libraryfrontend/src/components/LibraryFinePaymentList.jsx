
function LibraryFinePaymentList({
  payments,
  loading,
  deletingId,
  onEdit,
  onDelete,
  onRefresh,
}) {
  if (loading) {
    return (
      <div className="empty-state">
        <div className="spinner-border text-primary mb-3" role="status" />
        <p>Loading payment records...</p>
      </div>
    );
  }

  return (
    <>
      <div className="table-responsive">
        <table className="table align-middle payment-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Card number</th>
              <th>Fine amount</th>
              <th>Payment date</th>
              <th>Status</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td className="fw-semibold">#{payment.id}</td>
                <td>{payment.cardNumber}</td>
                <td className="fw-semibold">
                  ₹{Number(payment.fineAmount).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td>{payment.paymentDate}</td>
                <td>
                  <span
                    className={`status-badge ${
                      payment.paid ? "paid" : "unpaid"
                    }`}
                  >
                    <i
                      className={`bi ${
                        payment.paid ? "bi-check-circle" : "bi-clock"
                      } me-1`}
                    />
                    {payment.paid ? "Paid" : "Not paid"}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => onEdit(payment)}
                      title={`Edit payment ${payment.id}`}
                    >
                      <i className="bi bi-pencil" /> Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDelete(payment.id)}
                      disabled={deletingId === payment.id}
                      title={`Delete payment ${payment.id}`}
                    >
                      <i className="bi bi-trash" />
                      {deletingId === payment.id ? " Deleting..." : " Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {payments.length === 0 && (
        <div className="empty-state">
          <i className="bi bi-inbox empty-icon" />
          <h5>No payments found</h5>
          <p>Try another search or add a new payment record.</p>
          <button className="btn btn-outline-primary" onClick={onRefresh}>
            <i className="bi bi-arrow-clockwise me-2" />
            Refresh records
          </button>
        </div>
      )}
    </>
  );
}

export default LibraryFinePaymentList;
