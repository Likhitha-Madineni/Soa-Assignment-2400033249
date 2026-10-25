
function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <a className="navbar-brand fw-bold" href="#home">
          📚 Library Fine Payment
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#libraryNavbar"
          aria-controls="libraryNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="libraryNavbar">
          <div className="navbar-nav ms-auto">
            <a className="nav-link" href="#home">
              Home
            </a>

            <a className="nav-link" href="#add-payment">
              Add Payment
            </a>

            <a className="nav-link" href="#payments">
              View Records
            </a>

            <a className="nav-link" href="#find-payment">
              Find by ID
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
