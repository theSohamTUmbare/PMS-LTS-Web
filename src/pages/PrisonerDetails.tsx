import React, { useState } from "react";
import prisonerImage from "./prisoner.png";



const PrisonerDetails: React.FC = () => {
  
  return (
    <div className="bg-gray-100">
      {/* End of Navbar */}

      <div className="container mx-auto my-5 p-5">
        <div className="md:flex no-wrap md:-mx-2">
          {/* Left Side */}
          <div className="w-full md:w-3/12 md:mx-2">
            {/* Profile Card */}
            <div className="bg-white p-3 border-t-4 border-green-400">
              <div className="image overflow-hidden">
                <img
                  className="h-auto w-full mx-auto object-cover"
                  src={prisonerImage}
                  alt="Prisoner Profile"
                />
              </div>

              <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">
                Jon the don
              </h1>
              <h3 className="text-gray-600 font-lg text-semibold leading-6">
                Jon the don is of United States nationality. Born on 9 November
                2003. Entered in this prison on 7 November 2016
              </h3>

              <ul className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
                <li className="flex items-center py-3">
                  <span>Status</span>
                  <span className="ml-auto">
                    <span className="bg-green-500 py-1 px-2 rounded text-white text-sm">
                      On trail
                    </span>
                  </span>
                </li>
                <li className="flex items-center py-3">
                  <span>Since</span>
                  <span className="ml-auto">Nov 07, 2016</span>
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
                <span className="tracking-wide">About</span>
              </div>
              <div className="text-gray-700">
                <div className="grid md:grid-cols-2 text-sm">
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">First Name</div>
                    <div className="px-4 py-2">Jon</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Last Name</div>
                    <div className="px-4 py-2">Don</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Gender</div>
                    <div className="px-4 py-2">Female</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Nationality </div>
                    <div className="px-4 py-2">India</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Date of Birth</div>
                    <div className="px-4 py-2">Nov 9, 2003</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Status</div>
                    <div className="px-4 py-2">On trail</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Entry Date</div>
                    <div className="px-4 py-2">Nov 7, 2016</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Release Date</div>
                    <div className="px-4 py-2">Not Declared</div>
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
                      <div className="px-4 py-1">7</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-1 font-semibold">
                        Behavior Remarks
                      </div>
                      <div className="px-4 py-1">Normal</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-1 font-semibold">
                        Medical Histroy
                      </div>
                      <div className="px-4 py-1">None</div>
                    </div>
                  </div>
                </div>
                {/* Education Section */}
                <div>
                  <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                    {/* <span className="text-green-500">
                      <svg
                        className="h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path fill="#fff" d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path
                          fill="#fff"
                          d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                        />
                      </svg>
                    </span> */}
                    <span className="tracking-wide px-36">Tracking Device</span>
                  </div>
                  <ul className="list-inside space-y-2 px-36">
                    <li>
                      <div className="text-teal-600">Tracking Device Id</div>
                      <div className="text-gray-500 text-xs">AJ854300a79</div>
                    </li>
                    <li>
                      <div className="text-teal-600">Tracking Device Name</div>
                      <div className="text-gray-500 text-xs">
                        Prisoner Tracker A8
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrisonerDetails;
