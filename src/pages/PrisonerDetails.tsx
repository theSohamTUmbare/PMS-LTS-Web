import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import prisonerImageM from "../assets/prisoner.png";
import prisonerImageFM from "../assets/prisonerFM.png";
import axios from "axios";
import AddPrisonerForm from "../components/AddingPrisoner/AddPrisonerForm";

export interface Prisoner {
  prisoner_id: number;
  first_name: string;
  last_name: string;
  date_of_birth: Date;
  gender: string;
  national_id: string;
  entry_date: Date;
  release_date?: Date;
  status: "Incarcerated" | "Released" | "On Trial" | "Transferred";
  cell_id?: number;
  behavior_record?: object;
  medical_history?: object;
  tracking_device_id?: number;
}

const PrisonerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [prisoner, setPrisoner] = useState<Prisoner | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<
    "behavior_record" | "medical_history" | null
  >(null);
  const [formData, setFormData] = useState({
    behavior_record: "",
    medical_history: "",
  });
  const [formDataPrisoner, setFormDataPrisoner] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    national_id: "",
    entry_date: "",
    status: "",
    cell_id: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleEditClick = (field: "behavior_record" | "medical_history") => {
    setEditingField(field);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchPrisoner = async () => {
      try {
        const response = await axios.get(`/api/v1/prisoner/prisonerid/${id}`);
        setPrisoner(response.data.data); // Assuming `data.data` contains the required data.
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch prisoner details"
        );
      }
    };

    if (id) fetchPrisoner();
  }, [id]);

  useEffect(() => {
    if (prisoner) {
      setFormDataPrisoner({
        first_name: prisoner.first_name || "",
        last_name: prisoner.last_name || "",
        date_of_birth: prisoner.date_of_birth || "",
        gender: prisoner.gender || "",
        national_id: prisoner.national_id || "",
        entry_date: prisoner.entry_date || "",
        status: prisoner.status || "",
        cell_id: prisoner.cell_id || "",
      });
    }
  }, [prisoner]);

  // console.log(formDataPrisoner)
  if (error) return <p>Error: {error}</p>;
  if (!prisoner) return <p>Loading...</p>;

  // console.log(prisoner)

  const handlePrisonerUpdate = async (prisonerData: any) => {
    try {
      console.log("in update");
      const prisonerResponse = await axios.put(
        `/api/v1/prisoner/update/${id}`,
        prisonerData
      );

      if (prisonerResponse.status === 200) {
        closeModal();
        window.location.reload();
      } else {
        console.error("Error creating prisoner:", prisonerResponse.statusText);
      }
    } catch (error) {
      console.error("Error in handlePrisonerUpdate:", error);
    }
  };

  const handleSaveClick = async (
    field: "behavior_record" | "medical_history"
  ) => {
    try {
      // Sending the updated field data to the backend
      const response = await axios.put(
        `/api/v1/prisoner/update/${id}`, // Backend endpoint
        { [field]: formData[field] }, // Updated data sent in the body
        { headers: { "Content-Type": "application/json" } } // Specifying JSON content type
      );

      // Checking for a successful response
      if (response.status === 200) {
        setEditingField(null); // Exit editing mode
        setPrisoner((prev) =>
          prev ? { ...prev, [field]: formData[field] } : prev
        );
      }
    } catch (error) {
      console.error("Error updating prisoner field:", error);

      // Handle errors from the backend or network issues
      alert(
        error.response?.data?.message ||
          `Error updating ${field.replace("_", " ")}.`
      );
    }
  };

  const handleCancelClick = () => {
    setEditingField(null); // Exit editing mode without saving
    setFormData({
      behavior_record: prisoner.behavior_record || "",
      medical_history: prisoner.medical_history || "",
    });
  };

  const handleChange = (
    field: "behavior_record" | "medical_history",
    value: string
  ) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  return (
    <div className="bg-gray-100">
      <div className="container mx-auto my-5 p-5">
        <div className="md:flex no-wrap md:-mx-2">
          {/* Left Side */}
          <div className="w-full md:w-3/12 md:mx-2">
            {/* Profile Card */}
            <div className="bg-white p-3 border-t-4 border-green-400">
              <div className="image overflow-hidden">
                <img
                  className="h-auto w-full mx-auto object-cover"
                  src={
                    prisoner.gender == "Male" ? prisonerImageM : prisonerImageFM
                  }
                  alt="Prisoner Profile"
                />
              </div>

              <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">
                {prisoner.first_name} {prisoner.last_name}
              </h1>
              <h3 className="text-gray-600 font-lg text-semibold leading-6">
                {prisoner.first_name} {prisoner.last_name} is of{" "}
                {prisoner.national_id} nationality. Born on{" "}
                {formatDate(prisoner.date_of_birth)}. Entered in this prison on{" "}
                {formatDate(prisoner.entry_date)}
              </h3>

              <ul className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
                <li className="flex items-center py-3">
                  <span>Status</span>
                  <span className="ml-auto">
                    <span className="bg-green-500 py-1 px-2 rounded text-white text-sm">
                      {prisoner.status}
                    </span>
                  </span>
                </li>
                <li className="flex items-center py-3">
                  <span>Since</span>
                  <span className="ml-auto">
                    {formatDate(prisoner.entry_date)}
                  </span>
                </li>
              </ul>
            </div>
            {/* End of profile card */}
            <div className="my-4"></div>
            {/* Friends card */}

            {/* End of friends card */}
          </div>
          {/* Right Side */}
          <div className="w-full md:w-9/12 mx-2 h-64">
            {/* About Section */}
            <div className="bg-white p-3 shadow-sm rounded-sm">
              <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
                <span className="text-green-500">
                  <svg
                    className="h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </span>
                <div className=" flex justify-between items-center w-full">
                  <span className="tracking-wide">About</span>
                  <button
                    onClick={openModal}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-medium py-2 px-2 rounded"
                  >
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        d="M15.6729 3.91287C16.8918 2.69392 18.8682 2.69392 20.0871 3.91287C21.3061 5.13182 21.3061 7.10813 20.0871 8.32708L14.1499 14.2643C13.3849 15.0293 12.3925 15.5255 11.3215 15.6785L9.14142 15.9899C8.82983 16.0344 8.51546 15.9297 8.29289 15.7071C8.07033 15.4845 7.96554 15.1701 8.01005 14.8586L8.32149 12.6785C8.47449 11.6075 8.97072 10.615 9.7357 9.85006L15.6729 3.91287ZM18.6729 5.32708C18.235 4.88918 17.525 4.88918 17.0871 5.32708L11.1499 11.2643C10.6909 11.7233 10.3932 12.3187 10.3014 12.9613L10.1785 13.8215L11.0386 13.6986C11.6812 13.6068 12.2767 13.3091 12.7357 12.8501L18.6729 6.91287C19.1108 6.47497 19.1108 5.76499 18.6729 5.32708ZM11 3.99929C11.0004 4.55157 10.5531 4.99963 10.0008 5.00007C9.00227 5.00084 8.29769 5.00827 7.74651 5.06064C7.20685 5.11191 6.88488 5.20117 6.63803 5.32695C6.07354 5.61457 5.6146 6.07351 5.32698 6.63799C5.19279 6.90135 5.10062 7.24904 5.05118 7.8542C5.00078 8.47105 5 9.26336 5 10.4V13.6C5 14.7366 5.00078 15.5289 5.05118 16.1457C5.10062 16.7509 5.19279 17.0986 5.32698 17.3619C5.6146 17.9264 6.07354 18.3854 6.63803 18.673C6.90138 18.8072 7.24907 18.8993 7.85424 18.9488C8.47108 18.9992 9.26339 19 10.4 19H13.6C14.7366 19 15.5289 18.9992 16.1458 18.9488C16.7509 18.8993 17.0986 18.8072 17.362 18.673C17.9265 18.3854 18.3854 17.9264 18.673 17.3619C18.7988 17.1151 18.8881 16.7931 18.9393 16.2535C18.9917 15.7023 18.9991 14.9977 18.9999 13.9992C19.0003 13.4469 19.4484 12.9995 20.0007 13C20.553 13.0004 21.0003 13.4485 20.9999 14.0007C20.9991 14.9789 20.9932 15.7808 20.9304 16.4426C20.8664 17.116 20.7385 17.7136 20.455 18.2699C19.9757 19.2107 19.2108 19.9756 18.27 20.455C17.6777 20.7568 17.0375 20.8826 16.3086 20.9421C15.6008 21 14.7266 21 13.6428 21H10.3572C9.27339 21 8.39925 21 7.69138 20.9421C6.96253 20.8826 6.32234 20.7568 5.73005 20.455C4.78924 19.9756 4.02433 19.2107 3.54497 18.2699C3.24318 17.6776 3.11737 17.0374 3.05782 16.3086C2.99998 15.6007 2.99999 14.7266 3 13.6428V10.3572C2.99999 9.27337 2.99998 8.39922 3.05782 7.69134C3.11737 6.96249 3.24318 6.3223 3.54497 5.73001C4.02433 4.7892 4.78924 4.0243 5.73005 3.54493C6.28633 3.26149 6.88399 3.13358 7.55735 3.06961C8.21919 3.00673 9.02103 3.00083 9.99922 3.00007C10.5515 2.99964 10.9996 3.447 11 3.99929Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="text-gray-700">
                <div className="grid md:grid-cols-2 text-sm">
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">First Name</div>
                    <div className="px-4 py-2">{prisoner.first_name}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Last Name</div>
                    <div className="px-4 py-2">{prisoner.last_name}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Gender</div>
                    <div className="px-4 py-2">
                      {prisoner.gender || "Not found"}
                    </div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Nationality </div>
                    <div className="px-4 py-2">
                      {prisoner.national_id || "Not found"}
                    </div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Date of Birth</div>
                    <div className="px-4 py-2">
                      {prisoner.date_of_birth
                        ? formatDate(prisoner.date_of_birth)
                        : "Not found"}
                    </div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Status</div>
                    <div className="px-4 py-2">{prisoner.status}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Entry Date</div>
                    <div className="px-4 py-2">
                      {prisoner.entry_date
                        ? formatDate(prisoner.entry_date)
                        : "Not found"}
                    </div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Release Date</div>
                    <div className="px-4 py-2">
                      {prisoner.release_date
                        ? formatDate(prisoner.release_date)
                        : "Not Decleared"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="my-4"></div>

            {/* Experience and Education */}
            <div className="bg-white p-3 shadow-sm rounded-sm">
              <div className="grid grid-cols-2">
                {/* Experience Section */}
                <div>
                  <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                    <span className="text-green-500">
                      <svg
                        className="h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </span>
                    <span className="tracking-wide">Other Information</span>
                  </div>
                  <div className="text-gray-700">
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-1 font-semibold">Cell Block</div>
                      <div className="px-4 py-1">C</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-1 font-semibold">Cell id</div>
                      <div className="px-4 py-1">
                        {prisoner.cell_id || "Not found"}
                      </div>
                    </div>
                    {/* <div className="grid grid-cols-2">
                      <div className="px-4 py-1 font-semibold">
                        Behavior Remarks
                      </div>
                      <div className="px-4 py-1">{prisoner.behavior_record || "Not found"}</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-1 font-semibold">
                        Medical Histroy
                      </div>
                      <div className="px-4 py-1">{prisoner.medical_history || "Not found"}</div>
                    </div> */}
                  </div>
                </div>
                {/* Education Section */}
                <div className="flex items-center ">
                  <div className="border-2 border-amber-500 rounded-xl p-5">
                    <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3 ">
                      <span className="text-green-500">
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 2a8 8 0 110 16 8 8 0 010-16zm0 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z"
                          />
                        </svg>
                      </span>
                      <span className="tracking-wide">Tracking Device:</span>
                    </div>
                    <div className="text-gray-700">
                      <div className="grid grid-cols-2">
                        <div className="px-4 py-1 font-semibold">
                          Tracking Device Id:
                        </div>
                        <div className="py-1">
                          {prisoner.tracking_device_id || "Not Found"}
                        </div>
                      </div>
                      <div className="grid grid-cols-2">
                        <div className="px-4 py-1 font-semibold">
                          Tracking Device Name:
                        </div>
                        <div className=" py-1">Prisoner Tracker A8</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto my-5 p-5">
          <div>
            <div className=" flex justify-between items-center w-full ">
              <div className="px-4 py-1 font-semibold text-3xl ">
                Behavior Remarks
              </div>
              <button
                onClick={() => handleEditClick("behavior_record")}
                className="bg-gray-500 hover:bg-gray-700 text-white font-medium py-2 px-2 rounded"
              >
                <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        d="M15.6729 3.91287C16.8918 2.69392 18.8682 2.69392 20.0871 3.91287C21.3061 5.13182 21.3061 7.10813 20.0871 8.32708L14.1499 14.2643C13.3849 15.0293 12.3925 15.5255 11.3215 15.6785L9.14142 15.9899C8.82983 16.0344 8.51546 15.9297 8.29289 15.7071C8.07033 15.4845 7.96554 15.1701 8.01005 14.8586L8.32149 12.6785C8.47449 11.6075 8.97072 10.615 9.7357 9.85006L15.6729 3.91287ZM18.6729 5.32708C18.235 4.88918 17.525 4.88918 17.0871 5.32708L11.1499 11.2643C10.6909 11.7233 10.3932 12.3187 10.3014 12.9613L10.1785 13.8215L11.0386 13.6986C11.6812 13.6068 12.2767 13.3091 12.7357 12.8501L18.6729 6.91287C19.1108 6.47497 19.1108 5.76499 18.6729 5.32708ZM11 3.99929C11.0004 4.55157 10.5531 4.99963 10.0008 5.00007C9.00227 5.00084 8.29769 5.00827 7.74651 5.06064C7.20685 5.11191 6.88488 5.20117 6.63803 5.32695C6.07354 5.61457 5.6146 6.07351 5.32698 6.63799C5.19279 6.90135 5.10062 7.24904 5.05118 7.8542C5.00078 8.47105 5 9.26336 5 10.4V13.6C5 14.7366 5.00078 15.5289 5.05118 16.1457C5.10062 16.7509 5.19279 17.0986 5.32698 17.3619C5.6146 17.9264 6.07354 18.3854 6.63803 18.673C6.90138 18.8072 7.24907 18.8993 7.85424 18.9488C8.47108 18.9992 9.26339 19 10.4 19H13.6C14.7366 19 15.5289 18.9992 16.1458 18.9488C16.7509 18.8993 17.0986 18.8072 17.362 18.673C17.9265 18.3854 18.3854 17.9264 18.673 17.3619C18.7988 17.1151 18.8881 16.7931 18.9393 16.2535C18.9917 15.7023 18.9991 14.9977 18.9999 13.9992C19.0003 13.4469 19.4484 12.9995 20.0007 13C20.553 13.0004 21.0003 13.4485 20.9999 14.0007C20.9991 14.9789 20.9932 15.7808 20.9304 16.4426C20.8664 17.116 20.7385 17.7136 20.455 18.2699C19.9757 19.2107 19.2108 19.9756 18.27 20.455C17.6777 20.7568 17.0375 20.8826 16.3086 20.9421C15.6008 21 14.7266 21 13.6428 21H10.3572C9.27339 21 8.39925 21 7.69138 20.9421C6.96253 20.8826 6.32234 20.7568 5.73005 20.455C4.78924 19.9756 4.02433 19.2107 3.54497 18.2699C3.24318 17.6776 3.11737 17.0374 3.05782 16.3086C2.99998 15.6007 2.99999 14.7266 3 13.6428V10.3572C2.99999 9.27337 2.99998 8.39922 3.05782 7.69134C3.11737 6.96249 3.24318 6.3223 3.54497 5.73001C4.02433 4.7892 4.78924 4.0243 5.73005 3.54493C6.28633 3.26149 6.88399 3.13358 7.55735 3.06961C8.21919 3.00673 9.02103 3.00083 9.99922 3.00007C10.5515 2.99964 10.9996 3.447 11 3.99929Z"
                        fill="currentColor"
                      ></path>
                    </svg>
              </button>
            </div>
            <div className="px-4 py-1">
              {editingField === "behavior_record" ? (
                <div>
                  <textarea
                    defaultValue={prisoner.behavior_record}
                    onChange={(e) =>
                      handleChange("behavior_record", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                    rows={4}
                  />
                  <div className="mt-2">
                    <button
                      onClick={() => handleSaveClick("behavior_record")}
                      className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelClick}
                      className="px-4 py-2 bg-gray-300 rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p onClick={() => handleEditClick("behavior_record")}>
                    {prisoner.behavior_record || "Not Found"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Medical History */}
          <div className="py-8">
            <div className=" flex justify-between items-center w-full ">
              <div className="px-4 py-1 font-semibold text-3xl">
                Medical History
              </div>
              <button
                onClick={() => handleEditClick("medical_history")}
      
                className="bg-gray-500 hover:bg-gray-700  text-white font-medium py-2 px-2 rounded"
              >
                <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        d="M15.6729 3.91287C16.8918 2.69392 18.8682 2.69392 20.0871 3.91287C21.3061 5.13182 21.3061 7.10813 20.0871 8.32708L14.1499 14.2643C13.3849 15.0293 12.3925 15.5255 11.3215 15.6785L9.14142 15.9899C8.82983 16.0344 8.51546 15.9297 8.29289 15.7071C8.07033 15.4845 7.96554 15.1701 8.01005 14.8586L8.32149 12.6785C8.47449 11.6075 8.97072 10.615 9.7357 9.85006L15.6729 3.91287ZM18.6729 5.32708C18.235 4.88918 17.525 4.88918 17.0871 5.32708L11.1499 11.2643C10.6909 11.7233 10.3932 12.3187 10.3014 12.9613L10.1785 13.8215L11.0386 13.6986C11.6812 13.6068 12.2767 13.3091 12.7357 12.8501L18.6729 6.91287C19.1108 6.47497 19.1108 5.76499 18.6729 5.32708ZM11 3.99929C11.0004 4.55157 10.5531 4.99963 10.0008 5.00007C9.00227 5.00084 8.29769 5.00827 7.74651 5.06064C7.20685 5.11191 6.88488 5.20117 6.63803 5.32695C6.07354 5.61457 5.6146 6.07351 5.32698 6.63799C5.19279 6.90135 5.10062 7.24904 5.05118 7.8542C5.00078 8.47105 5 9.26336 5 10.4V13.6C5 14.7366 5.00078 15.5289 5.05118 16.1457C5.10062 16.7509 5.19279 17.0986 5.32698 17.3619C5.6146 17.9264 6.07354 18.3854 6.63803 18.673C6.90138 18.8072 7.24907 18.8993 7.85424 18.9488C8.47108 18.9992 9.26339 19 10.4 19H13.6C14.7366 19 15.5289 18.9992 16.1458 18.9488C16.7509 18.8993 17.0986 18.8072 17.362 18.673C17.9265 18.3854 18.3854 17.9264 18.673 17.3619C18.7988 17.1151 18.8881 16.7931 18.9393 16.2535C18.9917 15.7023 18.9991 14.9977 18.9999 13.9992C19.0003 13.4469 19.4484 12.9995 20.0007 13C20.553 13.0004 21.0003 13.4485 20.9999 14.0007C20.9991 14.9789 20.9932 15.7808 20.9304 16.4426C20.8664 17.116 20.7385 17.7136 20.455 18.2699C19.9757 19.2107 19.2108 19.9756 18.27 20.455C17.6777 20.7568 17.0375 20.8826 16.3086 20.9421C15.6008 21 14.7266 21 13.6428 21H10.3572C9.27339 21 8.39925 21 7.69138 20.9421C6.96253 20.8826 6.32234 20.7568 5.73005 20.455C4.78924 19.9756 4.02433 19.2107 3.54497 18.2699C3.24318 17.6776 3.11737 17.0374 3.05782 16.3086C2.99998 15.6007 2.99999 14.7266 3 13.6428V10.3572C2.99999 9.27337 2.99998 8.39922 3.05782 7.69134C3.11737 6.96249 3.24318 6.3223 3.54497 5.73001C4.02433 4.7892 4.78924 4.0243 5.73005 3.54493C6.28633 3.26149 6.88399 3.13358 7.55735 3.06961C8.21919 3.00673 9.02103 3.00083 9.99922 3.00007C10.5515 2.99964 10.9996 3.447 11 3.99929Z"
                        fill="currentColor"
                      ></path>
                    </svg>
              </button>
            </div>
            <div className="px-4 py-1">
              {editingField === "medical_history" ? (
                <div>
                  <textarea
                    defaultValue={prisoner.medical_history}
                    onChange={(e) =>
                      handleChange("medical_history", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                    rows={4}
                  />
                  <div className="mt-2">
                    <button
                      onClick={() => handleSaveClick("medical_history")}
                      className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelClick}
                      className="px-4 py-2 bg-gray-300 rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p onClick={() => handleEditClick("medical_history")}>
                    {prisoner.medical_history || "Not Found"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <AddPrisonerForm
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handlePrisonerUpdate}
          existingPrisonerData={formDataPrisoner}
        />
      )}
    </div>
  );
};

export default PrisonerDetails;
