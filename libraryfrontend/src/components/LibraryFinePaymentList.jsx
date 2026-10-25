
function LibraryFinePaymentList({
  payments,
  loading,
  deletingId,
  onEdit,
  onDelete,
  onRefresh,
}) {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-secondary">
          Total: {payments.length} payments
        </span>

        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={onRefresh}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {loading ? (
        <p className="text-secondary">Loading payments...</p>
      ) : payments.length === 0 ? (
        <p className="text-secondary">No payments found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Card Number</th>
                <th>Fine Amount</th>
                <th>Payment Date</th>
                <th>Paid</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.id}</td>
                  <td>{payment.cardNumber}</td>
                  <td>
                    {Number(payment.fineAmount).toFixed(2)}
                  </td>
                  <td>{payment.paymentDate}</td>

                  <td>
                    <span
                      className={`badge ${
                        payment.paid
                          ? "text-bg-success"
                          : "text-bg-danger"
                      }`}
                    >
                      {payment.paid ? "Paid" : "Not Paid"}
                    </span>
                  </td>

                  <td>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => onEdit(payment)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onDelete(payment.id)}
                        disabled={deletingId === payment.id}
                      >
                        {deletingId === payment.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default LibraryFinePaymentList;
