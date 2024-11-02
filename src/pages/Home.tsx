import Alert, { AlertProps, AlertType } from "../components/Alert";
import Incidents, { Incident } from "../components/Incident";

const alertData: AlertProps[] = [
  {
    index: 0,
    type: AlertType.Informational,
    message: "Routine prisoner headcount completed.",
  },
  {
    index: 1,
    type: AlertType.Warning,
    message: "Suspicious activity reported near the cell block.",
  },
  {
    index: 2,
    type: AlertType.Critical,
    message: "Prisoner escaped from the facility!",
  },
];

const incidentData: Incident[] = [
  {
    prisonerName: "John Doe",
    guardName: "Officer Smith",
    date: "2024-11-01",
    time: "14:30",
    description: "Prisoner attempted to escape.",
    actionTaken: "Restrained and placed in solitary confinement.",
  },
  {
    prisonerName: "Jane Doe",
    guardName: "Officer Brown",
    date: "2024-11-01",
    time: "09:15",
    description: "Prisoner found with contraband.",
    actionTaken: "Confiscated items and issued a warning.",
  },
  // Add more incidents as needed
];

const Home = () => {
  return (
    <div className="mx-6 sm:mx-12 my-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Incidents Section */}
        <div className="lg:w-2/3">
          <div className="bg-white border border-gray-200 shadow-lg p-6 rounded-2xl">
            <Incidents incidents={incidentData} />
          </div>
        </div>

        {/* Alerts Section */}
        <div className="lg:w-1/3">
          <div className="bg-gray-50 border border-gray-200 shadow-lg p-6 rounded-2xl">
            <h1 className="font-sans text-xl font-semibold mb-4 text-center text-gray-700">
              Recent Alerts
            </h1>
            <div className="border border-gray-300 shadow-md p-6 rounded-2xl max-w-lg mx-auto">
              <Alert alerts={alertData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
