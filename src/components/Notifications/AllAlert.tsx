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

export interface AlertProps {
  index: number;
  type: AlertType;
  message: string;
  time: Date;
  device: string;
}

const AllAlertData: React.FC<AlertProps> = ({
  index,
  type,
  message,
  time,
  device,
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
    <div className="border border-gray-300 bg-gray-50 shadow-lg p-3 pb-0 rounded-2xl max-w-full">
      <div
        key={index}
        className={`px-6 py-4 border-l-8 ${borderColor} bg-gray-50 mb-0`}
        style={{ minHeight: "80px" }} // Adjust height as needed
      >
        <div className="flex flex-row justify-between items-center gap-x-6">
          {/* Icon */}
          <FontAwesomeIcon
            className={`${iconColor} text-3xl`} // Larger icon
            icon={icon}
          />

          {/* Main Content */}
          <div className="flex flex-col flex-grow">
            
            <div className="font-bold text-xl text-gray-800">
              {type.toUpperCase()}
            </div>
            
            
            <p className="text-base text-gray-600 mt-2">{message}</p>
          </div>

          
        </div>

      </div>
      <div className="text-sm text-gray-500 mt-2">{time.toString()}</div>
        {/* Device */}
        <div className="text-sm text-gray-500 text-right mb-2">{device}</div>
    </div>
  );
};

export interface AlertsWrapperProps {
  alerts: AlertProps[];
}

const AllAlert = ({ alerts }: AlertsWrapperProps) => {
  return (
    <div className="space-y-3">
      {alerts.map((alert, index) => (
        <AllAlertData
          key={index}
          index={index}
          type={alert.type}
          message={alert.message}
          time={alert.time}
          device={alert.device}
        />
      ))}
    </div>
  );
};

export default AllAlert;
