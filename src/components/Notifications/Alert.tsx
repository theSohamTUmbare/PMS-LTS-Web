import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation, faCircleExclamation, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

export enum AlertType {
  Informational = "informational",
  Warning = "warning",
  Critical = "critical",
}

export interface AlertProps {
  index: number;
  alert_type: AlertType;
  message: string;
}

const AlertData: React.FC<AlertProps> = ({ index, alert_type, message }) => {
  const icon = alert_type === AlertType.Critical ? faTriangleExclamation :
               alert_type === AlertType.Warning ? faCircleExclamation :
               faInfoCircle;

  const iconColor = alert_type === AlertType.Critical ? "text-red-600" :
                    alert_type === AlertType.Warning ? "text-yellow-600" :
                    "text-blue-600";

  const borderColor = alert_type === AlertType.Critical ? "border-red-600" :
                      alert_type === AlertType.Warning ? "border-yellow-600" :
                      "border-blue-600";

  const label = alert_type === AlertType.Critical ? "CRITICAL" :
                      alert_type === AlertType.Warning ? "WARNING" :
                      "INFORMATIONAL";

  return (
    <div key={index} className={`px-4 py-2 border-l-4 ${borderColor} bg-gray-50 text-sm mb-3 shadow`}>
      <div className="flex flex-row gap-x-5">
        <FontAwesomeIcon
          className={`${iconColor} text-xl mt-1`}
          icon={icon}
        />
        <div className="flex flex-col items-start">
          <div className="justify-center font-bold">{label}</div>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export interface AlertsWrapperProps {
  alerts: AlertProps[];
}

const  Alert: React.FC<AlertsWrapperProps> = ({ alerts }) => {
  console.log(alerts)
  return (
    <div className="space-y-3">
      {alerts.map((alert, index) => (
        <AlertData key={index} index={index} alert_type={alert.alert_type} message={alert.message} />
      ))}
    </div>
  );
};

export default Alert;