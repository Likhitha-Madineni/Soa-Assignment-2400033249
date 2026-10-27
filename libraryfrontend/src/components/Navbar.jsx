
function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg dashboard-navbar sticky-top">
      <div className="container-fluid px-lg-4">
        <a className="navbar-brand" href="#home">
          <span className="brand-icon">
            <i className="bi bi-book-half" />
          </span>
          <span>
            Library<span className="brand-light">Pay</span>
            <small>FINE MANAGEMENT</small>
          </span>
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <li className="nav-item">
              <a className="nav-link" href="#home">Dashboard</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#payment-form">Add payment</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#records">View records</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#find-payment">Find by ID</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
