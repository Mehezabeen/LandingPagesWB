import { useState } from "react";
import Swal from "sweetalert2";
import SideBar from "../../SideBar/SideBar";
import "./Transporter.css";

function Transporter() {
  const [transporterName, setTransporterName] = useState("");
  const [transporterContactNo, setTransporterContactNo] = useState("");
  const [transporterEmailId, setTransporterEmailId] = useState("");
  const [transporterAddress, setTransporterAddress] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [error, setError] = useState("");

  const handleCancel = () => {
    setTransporterName("");
    setTransporterContactNo("");
    setTransporterEmailId("");
    setTransporterAddress("");
    setEmailError("");
    setPhoneError("");
  };

  const handleSave = () => {
    let emailIsValid = true;
    let phoneIsValid = true;

    if (
      transporterName.trim() === "" ||
      transporterAddress.trim() === "" ||
      transporterContactNo.trim() === ""
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
    if (!emailRegex.test(transporterEmailId)) {
      setEmailError("Please enter a valid email address.");
      emailIsValid = false;
    } else {
      setEmailError("");
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(transporterContactNo)) {
      setPhoneError("Please enter a valid 10-digit phone number.");
      phoneIsValid = false;
    } else {
      setPhoneError("");
    }

    if (!emailIsValid || !phoneIsValid) {
      return;
    }

    const transporterData = {
      transporterName,
      transporterContactNo,
      transporterEmailId,
      transporterAddress,
    };

    fetch("http://localhost:8080/api/v1/transporter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transporterData),
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          return response.text();
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
        setError(error.message);
        Swal.fire({
          title: "Error",
          text: error.message,
          icon: "error",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn btn-danger",
          },
        });
      });
  };

  return (
    <SideBar>
      <div className="transporter-register">
        <div className="transporter-main-content">
          <h2 className="text-center">Transporter Registration</h2>
          <div className="create-user-container">
            <div
              className="card-body p-4"
              style={{ backgroundColor: "rgb(243,244,247)" }}
            >
              <form>
                <div className="row mb-2">
                  <div className="col-md-6">
                    <label htmlFor="transporterName" className="form-label">
                      Transporter Name{" "}
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        *
                      </span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="transporterName"
                      placeholder="Enter Transporter Name"
                      value={transporterName}
                      onChange={(e) => setTransporterName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label
                      htmlFor="transporterContactNo"
                      className="form-label"
                    >
                      Contact Number
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        {" "}*
                      </span>
                    </label>
                    <input
                      type="tel"
                      className={`form-control ${
                        phoneError ? "is-invalid" : ""
                      }`}
                      id="transporterContactNo"
                      placeholder="Enter Contact Number"
                      value={transporterContactNo}
                      onChange={(e) => setTransporterContactNo(e.target.value)}
                      required
                      pattern="\d{10}"
                      onInput={(e) =>
                        (e.target.value = e.target.value.replace(/\D/g, ""))
                      }
                      title="Please enter 10 numbers"
                      maxLength="10"
                    />
                    {phoneError && (
                      <div className="invalid-feedback">{phoneError}</div>
                    )}
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-md-6">
                    <label htmlFor="transporterEmailId" className="form-label">
                      Email ID
                    </label>
                    <input
                      type="email"
                      className={`form-control ${
                        emailError ? "is-invalid" : ""
                      }`}
                      id="transporterEmailId"
                      placeholder="Enter Email ID"
                      value={transporterEmailId}
                      onChange={(e) => setTransporterEmailId(e.target.value)}
                    />
                    {emailError && (
                      <div className="invalid-feedback">{emailError}</div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="transporterAddress" className="form-label">
                      Address{" "}
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        *
                      </span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="transporterAddress"
                      placeholder="Enter Address"
                      value={transporterAddress}
                      onChange={(e) => setTransporterAddress(e.target.value)}
                      required
                    />
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
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </SideBar>
  );
}

export default Transporter;
