import { useState, useEffect } from "react";
import axios from "axios";
import AllAlert, {
  AlertProps,
  AlertType,
} from "../components/Notifications/AllAlert";

const AlertTable: React.FC = () => {
  const [alertData, setAlertData] = useState<AlertProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("/api/v1/alert/all");
        const alerts = response.data.data.map((alert: any, index: number) => ({
          index,
          type:
            alert.alert_type === "Critical"
              ? AlertType.Critical
              : alert.alert_type === "Warning"
              ? AlertType.Warning
              : AlertType.Informational,
          message: alert.details,
        }));
        setAlertData(alerts);
      } catch (err) {
        setError("Failed to fetch alerts.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  return (
    <div className=" p-6  max-w-full mx-8">
      {loading ? (
        <p className="text-gray-500 text-center">Loading alerts...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        
        <AllAlert alerts={alertData} />
      )}
    </div>
  );
};

export default AlertTable;
