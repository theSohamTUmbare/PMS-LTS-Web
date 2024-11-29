import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTriangleExclamation,
  faCircleExclamation,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

export enum AlertType {
  Informational = "informational",
  Warning = "warning",
  Critical = "critical",
}

export interface ApiAlert {
  alert_type: "Critical" | "Warning" | "Informational";
  details: string;
}
export interface AlertProps {
  index: number;
  type: AlertType;
  message: string;
  time: string;
  prisoner_name: string;
}

const AllAlertData: React.FC<AlertProps> = ({
  index,
  type,
  message,
  time,
  prisoner_name,
}) => {
  const icon =
    type === AlertType.Critical
      ? faTriangleExclamation
      : type === AlertType.Warning
      ? faCircleExclamation
      : faInfoCircle;

  const iconColor =
    type === AlertType.Critical
      ? "text-red-600"
      : type === AlertType.Warning
      ? "text-yellow-600"
      : "text-blue-600";

  const borderColor =
    type === AlertType.Critical
      ? "border-red-600"
      : type === AlertType.Warning
      ? "border-yellow-600"
      : "border-blue-600";

  return (
    <div
      key={index}
      className={`relative border border-gray-300 bg-gray-50 shadow-md rounded-md px-4 py-3 flex items-center space-x-4 ${borderColor} border-l-4 border-r-0 border-t-0 border-b-0 overflow-hidden group`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-r from-transparent ${borderColor.replace(
          "border-",
          "to-"
        )} transform -translate-x-full transition-transform duration-500 ease-in-out group-hover:translate-x-0`}
      ></div>
      <div className="group absolute w-0 h-0 border border-gray-300">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-red-600 transform -translate-x-full transition-transform duration-500 ease-in-out group-hover:translate-x-0"></div>
        <div className="absolute z-1  text-center"></div>
      </div>
      <div className="group absolute w-0 h-0 border border-gray-300">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-yellow-600 transform -translate-x-full transition-transform duration-500 ease-in-out group-hover:translate-x-0"></div>
        <div className="absolute z-1  text-center"></div>
      </div>
      <div className="group absolute w-0 h-0 border border-gray-300">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-600 transform -translate-x-full transition-transform duration-500 ease-in-out group-hover:translate-x-0"></div>
        <div className="absolute z-1  text-center"></div>
      </div>
      <div className="flex-shrink-0 relative z-10">
        <FontAwesomeIcon
          className={`${iconColor} text-3xl`} // Larger icon
          icon={icon}
        />
      </div>

      <div className="flex-grow relative z-10">
        <div className="text-base font-semibold text-gray-800">{message}</div>
        <div className="text-sm text-gray-500">Prisoner: {prisoner_name}</div>
      </div>

      <div className="flex-shrink-0 text-right relative z-10">
        <div className="text-sm text-gray-600">
          {time.split(",")[0] + time.split(",")[1]}
        </div>
        <div className="text-[13px] text-gray-500">{time.split(",")[2]}</div>
      </div>
    </div>
  );
};

export interface AlertsWrapperProps {
  alerts: AlertProps[];
}

const AllAlert = ({ alerts }: AlertsWrapperProps) => {
  const criticalCount = alerts.filter(
    (alert) => alert.type === AlertType.Critical
  ).length;
  const warningCount = alerts.filter(
    (alert) => alert.type === AlertType.Warning
  ).length;
  const informationalCount = alerts.filter(
    (alert) => alert.type === AlertType.Informational
  ).length;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Alerts Header */}
      <div className="flex items-center justify-between mb-4 bg-gray-800 text-white rounded-t-[20px] rounded-b-md p-4 shadow-lg">
        <div>
          <h1 className="text-2xl pl-3 font-bold text-white">Alerts</h1>
          <p className="text-sm pl-3 text-gray-300">
            {alerts.length} total alerts
          </p>
        </div>
        <div className="flex gap-5 text-[14px] mr-5">
          {/* Counts for each alert type */}
          <div className="flex items-center gap-1 text-red-400">
            <FontAwesomeIcon
              icon={faTriangleExclamation}
              className="text-red-500"
            />
            <span className="pt-[1px]">{criticalCount} Critical</span>
          </div>
          <div className="flex items-center gap-1 text-yellow-400">
            <FontAwesomeIcon
              icon={faCircleExclamation}
              className="text-yellow-500"
            />
            <span className="pt-[1px]">{warningCount} Warnings</span>
          </div>
          <div className="flex items-center gap-1 text-blue-400">
            <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500" />
            <span className="pt-[1px]">{informationalCount} Informational</span>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {alerts.map((alert, index) => (
          <AllAlertData
            key={index}
            index={index}
            type={alert.type}
            message={alert.message}
            time={alert.time}
            prisoner_name={alert.prisoner_name}
          />
        ))}
      </div>
    </div>
  );
};

export default AllAlert;
