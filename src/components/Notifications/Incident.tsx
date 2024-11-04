import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faShieldAlt, faCalendarAlt, faClock, faCommentDots, faCheckCircle } from "@fortawesome/free-solid-svg-icons";

export type Incident = {
  prisonerName: string;
  guardName: string;
  date: string;
  time: string;
  description: string;
  actionTaken: string;
};

type IncidentsProps = {
  incidents: Incident[];
};

const Incidents: React.FC<IncidentsProps> = ({ incidents }) => {
  return (
    <div className="p-6 max-w-lg mx-auto bg-gray-50 shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Recent Incidents</h2>
      {incidents.map((incident, index) => (
        <div
          key={index}
          className="bg-white p-5 rounded-xl mb-5 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center mb-2">
            <FontAwesomeIcon icon={faUser} className="text-gray-600 mr-2" />
            <span className="font-semibold text-gray-700">Prisoner:</span>
            <span className="ml-2 text-gray-800">{incident.prisonerName}</span>
          </div>

          <div className="flex items-center mb-2">
            <FontAwesomeIcon icon={faShieldAlt} className="text-gray-600 mr-2" />
            <span className="font-semibold text-gray-700">Reported by Guard:</span>
            <span className="ml-2 text-gray-800">{incident.guardName}</span>
          </div>

          <div className="flex items-center mb-2">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-600 mr-2" />
            <span className="font-semibold text-gray-700">Date:</span>
            <span className="ml-2 text-gray-800">{incident.date}</span>
          </div>

          <div className="flex items-center mb-2">
            <FontAwesomeIcon icon={faClock} className="text-gray-600 mr-2" />
            <span className="font-semibold text-gray-700">Time:</span>
            <span className="ml-2 text-gray-800">{incident.time}</span>
          </div>

          <div className="flex items-start mb-2">
            <FontAwesomeIcon icon={faCommentDots} className="text-gray-600 mt-1 mr-2" />
            <span className="font-semibold text-gray-700">Description:</span>
            <span className="ml-2 text-gray-800">{incident.description}</span>
          </div>

          <div className="flex items-start">
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mt-1 mr-2" />
            <span className="font-semibold text-gray-700">Action Taken:</span>
            <span className="ml-2 text-gray-800">{incident.actionTaken}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Incidents;
