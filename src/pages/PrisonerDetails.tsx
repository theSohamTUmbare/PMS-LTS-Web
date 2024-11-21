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
  status: 'Incarcerated' | 'Released' | 'On Trial' | 'Transferred';
  cell_id?: number;
  behavior_record?: object;
  medical_history?: object;
  tracking_device_id?: number;
}


const PrisonerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [prisoner, setPrisoner] = useState<Prisoner | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<"behavior_record" | "medical_history" | null >(null);
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
    status: '',
    cell_id: '',
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
      console.log("in update")
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
        setPrisoner((prev) => (prev ? { ...prev, [field]: formData[field] } : prev))
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
                    className="bg-gray-500 hover:bg-gray-700 text-white font-medium px-3 rounded"
                  >
                    Edit
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
                className="bg-gray-500 hover:bg-gray-700 text-white font-medium py-1 px-3 rounded"
              >
                Edit
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
                  <p onClick={() => handleEditClick("behavior_record")}>{prisoner.behavior_record || "Not Found"}</p>
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
                className="bg-gray-500 hover:bg-gray-700 text-white font-medium py-1 px-3 rounded"
              >
                Edit
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
                <div >
                  <p onClick={() => handleEditClick("medical_history")}>{prisoner.medical_history || "Not Found"}</p>
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


export default PrisonerDetails