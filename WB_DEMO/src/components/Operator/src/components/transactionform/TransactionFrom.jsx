/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect, useRef } from "react";
import { Chart, ArcElement } from "chart.js/auto";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { Link } from "react-router-dom";
// import Header from "../../../../Header/Header";
import SideBar5 from "../../../../SideBar/SideBar5";
// eslint-disable-next-line no-unused-vars
import camView from "../../assets/weighbridge.webp";
import "./transactionform.css";
// import ScannerImg1 from "../../assets/ScannerImg1.png";
import Camera_Icon from "../../assets/Camera_Icon.png";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRectangleXmark,
  faFloppyDisk,
  faPrint,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

function TransactionFrom() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const navigate = useNavigate();
  const chartRef = useRef(null);
  const chartRef2 = useRef(null);
  const homeMainContentRef = useRef(null);
  const queryParams = new URLSearchParams(window.location.search);

  const [currentDate, setCurrentDate] = useState(getFormattedDate());
  const [currentTime, setCurrentTime] = useState(getFormattedTime());
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);
  const [inputValue, setInputValue] = useState(0);
  const [grossWeight, setGrossWeight] = useState(
    queryParams.get("grossWeight").split("/")[0]
  );
  const [tareWeight, setTareWeight] = useState(
    queryParams.get("tareWeight").split("/")[0]
  );
  const [netWeight, setNetWeight] = useState(0);

  const [isGrossWeightMode, setIsGrossWeightMode] = useState(true);
  const [ticket, setTicket] = useState([]);

  const ticketNumber = queryParams.get("ticketNumber");
  // const grossWt = queryParams.get('grossWeight');
  // const tareWt = queryParams.get('tareWeight');

  console.log(ticketNumber);

  useEffect(() => {
    
    axios
      .get(`http://localhost:8080/api/v1/weighment/get/${ticketNumber}`, {
        withCredentials: true, // Include credentials
      })
      .then((response) => {
        // Update state with the fetched data
        setTicket(response.data);
        console.log(response.data); // Log fetched data
      })
      .catch((error) => {
        console.error("Error fetching weighments:", error);
      });
  }, []);

  useEffect(() => {
    setNetWeight(grossWeight - inputValue);
    console.log("Count changed:", netWeight);
  }, [tareWeight]);

  const handleChange1 = (e, grossWeight) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (grossWeight === 0) {
      setGrossWeight(newValue);
    } else {
      setTareWeight(newValue);
    }
  };

  // const handleSave = () => {
  // if (!isTareWeightEnabled) {
  //   setGrossWeight(inputValue);
  //   setInputValue();
  //   setIsTareWeightEnabled(true);
  // const handleSave = (inputValue,grossWeight) => {
  const handleSave = () => {
    // if (grossWeight === 0) {
    //   setGrossWeight(inputValue);

    //   alert("Gross Weight saved to the database");
    //   setInputValue();
    //   setSaveButtonDisabled(true);

    // } else {
    //   setTareWeight(inputValue);
    //   alert("Tare Weight saved to the database");
    //   setSaveButtonDisabled(true);
    // }
    if (isGrossWeightMode) {
      setGrossWeight(inputValue);
      alert("Gross Weight saved to the database");
    } else {
      setTareWeight(inputValue);
      alert("Tare Weight saved to the database");
    }

    setInputValue(""); // Clear input field
    setSaveButtonDisabled(true); // Disable save button
    const payload = {
      machineId: "1",
      ticketNo: ticketNumber,
      weight: inputValue,
    };

    axios
      .post("http://localhost:8080/api/v1/weighment/measure", payload, {
        withCredentials: true,
      })
      .then((response) => {
        console.log("Measurement saved:", response.data);
        // Handle response as needed
      })
      .catch((error) => {
        console.error("Error saving measurement:", error);
        // Handle error as needed
      });
  };

  // const handleClear = () => {
  //   setGrossWeight(0);
  //   setTareWeight(0);
  //   setNetWeight(0);
  //   setInputValue(0);
  // };

  function getFormattedDate() {
    const date = new Date();
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  }
  function getFormattedTime() {
    const date = new Date();
    let hours = date.getHours().toString().padStart(2, "0");
    let minutes = date.getMinutes().toString().padStart(2, "0");
    let seconds = date.getSeconds().toString().padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  }
  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  useEffect(() => {
    Chart.register(ArcElement);

    const resizeObserver = new ResizeObserver(() => {
      if (
        homeMainContentRef.current &&
        chartRef.current?.chartInstance &&
        chartRef2.current?.chartInstance
      ) {
        chartRef.current.chartInstance.resize();
        chartRef2.current.chartInstance.resize();
      }
    });

    if (homeMainContentRef.current) {
      resizeObserver.observe(homeMainContentRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const [formData, setFormData] = useState({
    date: "",
    inTime: "",
    poNo: "",
    challanNo: "",
    customer: "",
    supplier: "",
    supplierAddress: "",
    supplierContactNo: "",
    vehicleNo: "",
    transporter: "",
    driverDLNo: "",
    driverName: "",
    department: "",
    product: "",
    eWayBillNo: "",
    tpNo: "",
    vehicleType: "",
    tpNetWeight: "",
    rcFitnessUpto: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "poNo" || name === "challanNo") {
      setFormData((prevData) => ({
        ...prevData,
        [name === "poNo" ? "challanNo" : "poNo"]: value
          ? ""
          : prevData[name === "poNo" ? "challanNo" : "poNo"],
      }));
    }
  };

  return (
    <SideBar5>
      <div>
        {/* <Header toggleSidebar={toggleSidebar} /> */}

        <div
          className="container-fluid"
          // style={{ marginTop: "50px", marginRight: "140px" }}
        >
          <h2 className="text-center mb-2">Inbound Transaction Form</h2>
          <div className="row">
            <div className="col-md-3 mb-3">
              <input
                type="text"
                id="ticketNo"
                name="ticketNo"
                value={`Ticket No: ${ticketNumber}`}
                onChange={handleChange}
                required
                className="abcv"
                readOnly
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-3 mb-3">
              <label htmlFor="poNo" className="form-label ">
                PO No:
                <span style={{ color: "red", fontWeight: "bold" }}>*</span>
              </label>
              <div className="input-group">
                <input
                  type="text"
                  id="poNo"
                  name="poNo"
                  value={ticket.poNo}
                  onChange={handleChange}
                  required
                  className="abcv"
                  readOnly
                />
              </div>
            </div>
            {/* TP No */}
            <div className="col-md-3 mb-3 ">
              <label htmlFor="tpNo" className="form-label ">
                TP No:
                <span style={{ color: "red", fontWeight: "bold" }}>*</span>
              </label>
              <div className="input-group">
                <input
                  type="text"
                  id="tpNo"
                  name="tpNo"
                  value={ticket.tpNo}
                  onChange={handleChange}
                  required
                  className="abcv"
                  readOnly
                />
              </div>
            </div>

            {/* Challan No */}
            <div className="col-md-3 mb-3">
              <label htmlFor="challanNo" className="form-label ">
                Challan No:
                <span style={{ color: "red", fontWeight: "bold" }}>*</span>
              </label>
              <div className="input-group">
                <input
                  type="text"
                  id="challanNo"
                  name="challanNo"
                  value={ticket.challanNo}
                  onChange={handleChange}
                  required
                  className="abcv"
                  readOnly
                />
              </div>
            </div>
            {/* Vehicle No */}
            <div className="col-md-3 mb-3">
              <label htmlFor="vehicleNo" className="form-label ">
                Vehicle No:
                <span style={{ color: "red", fontWeight: "bold" }}>*</span>
              </label>
              <div className="input-group">
                <input
                  type="text"
                  id="vehicleNo"
                  name="vehicleNo"
                  value={ticket.vehicleNo}
                  onChange={handleChange}
                  required
                  className="abcv"
                  readOnly
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-7">
              <h5>Weighment Details:</h5>
              <div className="row">
                <div className="col-md-6">
                  <div className="sub">
                    <input
                      type="text"
                      className="abcv"
                      style={{
                        // backgroundColor: "rgb(116 165 217)",
                        backgroundColor: "#919295",
                        color: "white",
                        width: "260px",
                        height: "50px",
                        // border: "0px solid ",
                      }}
                      value={inputValue}
                      onChange={(e) => handleChange1(e, ticket.grossWeight)}

                      // oninput="reflectInput(this.value, 'grossWeight')"
                    />
                    <div className="icons-group">
                      <div>
                        <FontAwesomeIcon
                          icon={faFloppyDisk}
                          onClick={() =>
                            handleSave(inputValue, ticket.grossWeight)
                          }
                          disabled={saveButtonDisabled}
                          className="icons"
                        />
                      </div>
                      {/* <div>
                  <FontAwesomeIcon
                    icon={faTrash}
                    // onClick={handleClear}
                    className="icons"
                  />
                </div> */}
                      <div>
                        <FontAwesomeIcon icon={faPrint} className="icons" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="mno">
                  <div className="col-2 mt-2">
                    <label htmlFor="vehicleType" className="form-label">
                      Gross Weight:
                    </label>
                  </div>
                  <div style={{ display: "flex" }}>
                    <input
                      type="text"
                      autoComplete="off"
                      value={`${grossWeight} kg`}
                      className="abcx"
                      readOnly
                    />
                    <input
                      type="date"
                      value={currentDate}
                      onChange={(e) => setCurrentDate(e.target.value)}
                      className="abcx"
                      readOnly
                    />
                    <input
                      type="time"
                      value={currentTime}
                      onChange={(e) => setCurrentTime(e.target.value)}
                      className="abcx"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="pqr">
                  <div className="col-2 mt-2">
                    <label htmlFor="vehicleType" className="form-label">
                      Tare Weight:
                    </label>
                  </div>
                  <div style={{ display: "flex" }}>
                    <input
                      type="text"
                      autoComplete="off"
                      value={`${tareWeight} kg`}
                      //required={isTareWeightEnabled}
                      className="abcx"
                      readOnly
                    />
                    <input
                      type="date"
                      value={currentDate}
                      onChange={(e) => setCurrentDate(e.target.value)}
                      className="abcx"
                      readOnly
                    />
                    <input
                      type="time"
                      value={currentTime}
                      onChange={(e) => setCurrentTime(e.target.value)}
                      className="abcx"
                      readOnly
                    />
                  </div>
                </div>
              </div>
              <div className="row  mb-3">
                <div className="stu">
                  <div className="col-2 mt-2">
                    <label htmlFor="vehicleType" className="form-label">
                      Net Weight:
                    </label>
                  </div>
                  <div style={{ display: "flex" }}>
                    <input
                      type="text"
                      autoComplete="off"
                      value={`${netWeight} kg`}
                      // required={isTareWeightEnabled}
                      className="abcx"
                      readOnly
                    />
                    <input
                      type="date"
                      value={currentDate}
                      onChange={(e) => setCurrentDate(e.target.value)}
                      className="abcx"
                      readOnly
                    />
                    <input
                      type="time"
                      value={currentTime}
                      onChange={(e) => setCurrentTime(e.target.value)}
                      className="abcx"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-5" style={{ marginTop: "20px" }}>
              <div className="grid-container" id="z3">
                <div className="grid-item">
                  <div className="mnc">
                  <img src={camView} />
                  <div className="overlay">
                    <span>Cam-1</span>
                    <button className="ct-btn ">
                      <img src={Camera_Icon} alt="Captured" />
                    </button>
                  </div>
                  </div>
                </div>
                <div className="grid-item">
                <div className="mnc">
                  <img src={camView} />
                  <div className="overlay">
                    <span>Cam-2</span>
                    <button className="ct-btn ">
                      <img src={Camera_Icon} alt="Captured" />
                    </button>
                  </div>
                </div>
                </div>
                <div className="grid-item">
                <div className="mnc">
                  <img src={camView} />
                  <div className="overlay">
                    <span>Cam-3</span>
                    <button className="ct-btn ">
                      <img src={Camera_Icon} alt="Captured" />
                    </button>
                  </div>
                  </div>
                </div>
                <div className="grid-item">
                <div className="mnc">
                  <img src={camView} />
                  <div className="overlay">
                    <span>Cam-4</span>
                    <button className="ct-btn">
                      <img src={Camera_Icon} alt="Captured" />
                    </button>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <h5>Transaction Details:</h5>
            <div className="grid-container-op">
              <div className="grid-item-op">
                <label htmlFor="supplier" className="form-label">
                  Supplier:
                </label>
                <input
                  type="text"
                  id="supplier"
                  name="supplier"
                  value={ticket.supplierName}
                  onChange={handleChange}
                  className="abcv"
                  readOnly
                />
              </div>
              <div className="grid-item-op">
                <label htmlFor="supplierAddress" className="form-label">
                  Supplier Address:
                </label>
                <input
                  type="text"
                  id="supplierAddress"
                  name="supplierAddress"
                  value={ticket.supplierAddress}
                  onChange={handleChange}
                  className="abcv"
                  readOnly
                />
              </div>
              <div className="grid-item-op">
                <label htmlFor="transporter" className="form-label">
                  Transporter:
                </label>
                <input
                  type="text"
                  id="transporter"
                  name="transporter"
                  value={ticket.transporter}
                  onChange={handleChange}
                  className="abcv"
                  readOnly
                />
              </div>
              <div className="grid-item-op">
                <label htmlFor="department" className="form-label">
                  Department:
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={ticket.department}
                  onChange={handleChange}
                  className="abcv"
                  readOnly
                />
              </div>
              <div className="grid-item-op">
                <label htmlFor="driverDL" className="form-label">
                  Driver DL No:
                </label>
                <input
                  type="text"
                  id="driverDL"
                  name="driverDL"
                  value={ticket.driverDlNo}
                  onChange={handleChange}
                  className="abcv"
                  readOnly
                />
              </div>
              <div className="grid-item-op">
                <label htmlFor="driverName" className="form-label">
                  Driver Name:
                </label>
                <input
                  type="text"
                  id="driverName"
                  name="driverName"
                  value={ticket.driverName}
                  onChange={handleChange}
                  className="abcv"
                  readOnly
                />
              </div>
              <div className="grid-item-op">
                <label htmlFor="material" className="form-label">
                  Material:
                </label>
                <input
                  type="text"
                  id="material"
                  name="material"
                  value={ticket.material}
                  onChange={handleChange}
                  className="abcv"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SideBar5>
  );
}

// eslint-disable-next-line no-undef
export default TransactionFrom;
