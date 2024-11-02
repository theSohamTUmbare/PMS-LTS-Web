import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation, faCircleExclamation, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

export enum AlertType {
  Informational = "informational",
  Warning = "warning",
  Critical = "critical",
}

export interface AlertProps {
  index: number;
  type: AlertType;
  message: string;
}

const AlertData = ({ index, type, message }: AlertProps) => {
  const icon = type === AlertType.Critical ? faTriangleExclamation :
               type === AlertType.Warning ? faCircleExclamation :
               faInfoCircle;

  const iconColor = type === AlertType.Critical ? "text-red-600" :
                    type === AlertType.Warning ? "text-yellow-600" :
                    "text-blue-600";

  const borderColor = type === AlertType.Critical ? "border-red-600" :
                      type === AlertType.Warning ? "border-yellow-600" :
                      "border-blue-600";

  return (
    <div key={index} className={`px-4 py-2 border-l-4 ${borderColor} bg-gray-50 text-sm mb-3 shadow`}>
      <div className="flex flex-row gap-x-5">
        <FontAwesomeIcon
          className={`${iconColor} text-xl mt-1`}
          icon={icon}
        />
        <div className="flex flex-col items-start">
          <div className="justify-center font-bold">{type.toUpperCase()}</div>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export interface AlertsWrapperProps {
  alerts: AlertProps[];
}

const   Alert = ({ alerts }: AlertsWrapperProps) => {
  return (
    <div className="space-y-3">
      {alerts.map((alert, index) => (
        <AlertData key={index} index={index} type={alert.type} message={alert.message} />
      ))}
    </div>
  );
};

export default Alert;