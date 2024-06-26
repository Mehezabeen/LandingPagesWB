import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSave } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import "./CreateUser.css";
import SideBar from "../../SideBar/SideBar";


function CreateUser() {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState([]);
  const [emailId, setEmailId] = useState("");
  const [emailError, setEmailError] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [contactNoError, setContactNoError] = useState("");
  const [company, setCompany] = useState("");
  const [site, setSite] = useState("");
  const [companies, setCompanies] = useState([]);
  const [sites, setSites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/company/names")
      .then((response) => response.json())
      .then((data) => {
        console.log("Company List:", data);
        setCompanies(data);
      })
      .catch((error) => {
        console.error("Error fetching company list:", error);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/roles/get/all/role")
      .then((response) => response.json())
      .then((data) => {
        console.log("Roles List:", data);
        const filteredRoles = data.filter((role) => role !== "ADMIN");
        setRoles(filteredRoles);
      })
      .catch((error) => {
        console.error("Error fetching roles list:", error);
      });
  }, []);
  const handleCompanyChange = (e) => {
    setCompany(e.target.value);

    fetch(`http://localhost:8080/api/v1/sites/company/${e.target.value}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Site List:", data);
        const formattedSites = data.map((site) => ({
          site: `${site.siteName}, ${site.siteAddress}`,
        }));
        setSites(formattedSites);
      })
      .catch((error) => {
        console.error("Error fetching site list:", error);
      });
  };

  const handleCancel = () => {
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setRole([]);
    setEmailId("");
    setContactNo("");
    setCompany("");
    setSite("");
    setEmailError("");
    setContactNoError("");
  };

  const handleSave = () => {
    let emailIsValid = true;
    let phoneIsValid = true;

    if (
      role.length === 0 ||
      company.trim() === "" ||
      site.trim() === "" ||
      contactNo.trim() === "" ||
      firstName.trim() === "" ||
      lastName.trim() === "" ||
      emailId.trim() === ""
    ) {
      Swal.fire({
        title: "Please fill in all the required fields.",
        icon: "warning",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "btn btn-warning",
        },
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailId)) {
      setEmailError("Please enter a valid email address.");
      emailIsValid = false;
    } else {
      setEmailError("");
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(contactNo)) {
      setContactNoError("Please enter a valid 10-digit phone number.");
      phoneIsValid = false;
    } else {
      setContactNoError("");
    }

    if (!emailIsValid || !phoneIsValid) {
      return;
    }

    const userData = {
      firstName,
      middleName,
      lastName,
      site,
      company,
      emailId,
      contactNo,
      role,
    };

    setIsLoading(true);

    console.log("Payload sent to the API:", userData);

    fetch("http://localhost:8080/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          return response.text(); // Assume the success response is text
        } else {
          return response.json().then((error) => {
            throw new Error(error.message);
          });
        }
      })
      .then((data) => {
        console.log("Response from the API:", data);
        Swal.fire({
          title: data,
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn btn-success",
          },
        });
        handleCancel();
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire({
          title: "Error",
          text: error.message,
          icon: "error",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn btn-danger",
          },
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleRoleChange = (selectedRole) => {
    if (role.includes(selectedRole)) {
      setRole(role.filter((r) => r !== selectedRole));
    } else {
      setRole([...role, selectedRole]);
    }
  };

  const handleSelectAllRoles = () => {
    if (role.length === roles.length) {
      setRole([]);
    } else {
      setRole([...roles]);
    }
  };
  return (
    <SideBar>
      <div className="create-user">
        <div className="create-main-content">
          {isLoading ? (
            <div className="spinner-container">
              <div className="spinner"></div>
            </div>
          ) : (
            <>
              <h2 className="text-center">Create User</h2>
              <div className="create-user-container">
                <div className="card create-user-form mt-3">
                  <div
                    className="card-body"
                    style={{ backgroundColor: "rgb(243,244,247)" }}
                  >
                    <form>
                      <div className="row mb-3">
                        <div className="col-md-4">
                          <label htmlFor="firstName" className="form-label">
                            First Name
                            <span style={{ color: "red", fontWeight: "bold" }}>
                          {" "}*
                            </span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="firstName"
                            placeholder="Enter First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="middleName" className="form-label">
                            Middle Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="middleName"
                            placeholder="Enter Middle Name"
                            value={middleName}
                            onChange={(e) => setMiddleName(e.target.value)}
                          />
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="lastName" className="form-label">
                            Last Name
                            <span style={{ color: "red", fontWeight: "bold" }}>
                          {" "}*
                            </span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="lastName"
                            placeholder="Enter Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label htmlFor="emailId" className="form-label">
                            Email Id
                          </label>
                          <span style={{ color: "red", fontWeight: "bold" }}>
                            {" "}*
                          </span>
                          <input
                            type="email"
                            className={`form-control ${emailError ? "is-invalid" : ""
                              }`}
                            id="emailId"
                            placeholder="Enter email address"
                            value={emailId}
                            onChange={(e) => setEmailId(e.target.value)}
                            required
                          />
                          {emailError && (
                            <div className="invalid-feedback">{emailError}</div>
                          )}
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="contactNo" className="form-label">
                            Mobile Number
                            <span style={{ color: "red", fontWeight: "bold" }}>
                          {" "}*
                            </span>
                          </label>
                          <input
                            type="tel"
                            className={`form-control ${contactNoError ? "is-invalid" : ""
                              }`}
                            id="contactNo"
                            placeholder="Enter Mobile Number"
                            value={contactNo}
                            onChange={(e) => setContactNo(e.target.value)}
                            required
                            pattern="\d{10}"
                            onInput={(e) =>
                            (e.target.value = e.target.value.replace(
                              /\D/g,
                              ""
                            ))
                            }
                            title="Please enter 10 numbers"
                            maxLength="10"
                          />
                          {contactNoError && (
                            <div className="invalid-feedback">
                              {contactNoError}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label htmlFor="company" className="form-label">
                            Company Name
                            <span style={{ color: "red", fontWeight: "bold" }}>
                          {" "}*
                            </span>
                          </label>
                          <select
                            className="form-select"
                            id="company"
                            value={company}
                            onChange={handleCompanyChange}
                            required
                          >
                            <option value="">Select Company Name</option>
                            {companies.map((c, index) => (
                              <option key={index} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="site" className="form-label">
                            Site Name
                            <span style={{ color: "red", fontWeight: "bold" }}>
                          {" "}*
                            </span>
                          </label>
                          <select
                            className="form-select"
                            id="site"
                            value={site}
                            onChange={(e) => setSite(e.target.value)}
                            required
                          >
                            <option value="">Select Site Name</option>
                            {sites.map((s, index) => (
                              <option key={index} value={s.site}>
                                {s.site}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label htmlFor="role" className="form-label">
                            Role
                            <span style={{ color: "red", fontWeight: "bold" }}>
                          {" "}*
                            </span>
                          </label>
                          <div className="d-flex gap-2">
                            <div className="d-flex flex-wrap gap-2">
                              {role.map((r, index) => (
                                <div
                                  key={index}
                                  className="d-flex align-items-center bg-secondary text-white px-2 py-1 rounded"
                                >
                                  <span className="me-2">{r}</span>
                                  <FontAwesomeIcon
                                    icon={faTimes}
                                    className="cursor-pointer"
                                    onClick={() => handleRoleChange(r)}
                                  />
                                </div>
                              ))}
                              <button
                                className="btn btn-secondary dropdown-toggle"
                                type="button"
                                id="dropdownRole"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                Select Roles
                              </button>
                              <ul className="dropdown-menu" aria-labelledby="dropdownRole">
                                {roles.map((r, index) => (
                                  <li key={index}>
                                    <label className="dropdown-item">
                                      <input
                                        type="checkbox"
                                        onChange={() => handleRoleChange(r)}
                                        checked={role.includes(r)}
                                      />
                                      {r}
                                    </label>
                                  </li>
                                ))}
                                <li>
                                  <hr className="dropdown-divider" />
                                </li>
                                <li>
                                  <label className="dropdown-item">
                                    <input
                                      type="checkbox"
                                      onChange={handleSelectAllRoles}
                                      checked={role.length === roles.length}
                                    />
                                    Select All Roles
                                  </label>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex justify-content-end mt-3">
                        <button
                          type="button"
                          className="btn btn-danger me-4 btn-hover"
                          style={{
                            backgroundColor: "white",
                            color: "black",
                            border: "1px solid #cccccc",
                            fontWeight: "600",
                            width: "100px",

                            // transition: "transform 0.3s ease-in-out",
                          }}
                          onClick={handleCancel}
                        >
                          <FontAwesomeIcon icon={faTimes} className="me-1" />
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="btn btn-success-1 btn-hover"
                          style={{
                            backgroundColor: "white",
                            color: "black",
                            fontWeight: "600",
                            border: "1px solid #cccccc",
                            width: "100px",

                            // transition: "transform 0.3s ease-in-out",
                          }}
                          onClick={handleSave}
                        >
                          <FontAwesomeIcon icon={faSave} className="me-1" />
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </SideBar>
  );
}

export default CreateUser;
