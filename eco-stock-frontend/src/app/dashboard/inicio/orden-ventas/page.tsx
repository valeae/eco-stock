import { BarChart } from "lucide-react";

export default function OrdenVentas() {
  return (
    <div className="mt-6">
      <div className="bg-white border border-muted-DEFAULT rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-primary-DEFAULT to-primary-dark text-white flex justify-between items-center">
          <h3 className="font-semibold text-lg">Orden de ventas</h3>
          <div className="flex items-center space-x-2">
            <select
              aria-label="Filtrar por periodo"
              className="text-xs bg-white bg-opacity-20 border-0 rounded py-1 px-3 text-white focus:outline-none focus:ring-2 focus:ring-white"
            >
              <option>Este mes</option>
              <option>Últimos 3 meses</option>
              <option>Este año</option>
            </select>
            <BarChart size={18} className="ml-2" />
          </div>
        </div>

        <div className="overflow-x-auto max-h-80">
          <table className="min-w-full table-auto text-sm">
            <thead>
              <tr className="bg-muted-light text-heading-DEFAULT">
                <th className="py-3 px-5 text-left font-medium">Cliente</th>
                <th className="py-3 px-5 text-left font-medium">Fecha</th>
                <th className="py-3 px-5 text-left font-medium">Estado</th>
                <th className="py-3 px-5 text-right font-medium">Monto</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  client: "Agropecuaria El Futuro",
                  date: "22/04/2025",
                  status: "Pagado",
                  amount: "$1,250,000",
                },
                {
                  client: "Hacienda San José",
                  date: "21/04/2025",
                  status: "Pendiente",
                  amount: "$875,300",
                },
                {
                  client: "Cultivos Orgánicos S.A.",
                  date: "20/04/2025",
                  status: "Pagado",
                  amount: "$540,200",
                },
                {
                  client: "Finca La Esperanza",
                  date: "18/04/2025",
                  status: "Pagado",
                  amount: "$328,750",
                },
              ].map((item, index) => (
                <tr
                  key={item.client}
                  className={`${
                    index % 2 === 0
                      ? "bg-white"
                      : "bg-muted-light bg-opacity-20"
                  } hover:bg-primary-DEFAULT hover:bg-opacity-10 transition-all duration-200`}
                >
                  <td className="py-3 px-5 text-heading-DEFAULT">{item.client}</td>
                  <td className="py-3 px-5 text-heading-light">{item.date}</td>
                  <td className="py-3 px-5">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        item.status === "Pagado"
                          ? "bg-success-light text-success-dark"
                          : item.status === "Pendiente"
                          ? "bg-warning-light text-warning-dark"
                          : "bg-danger-light text-danger-dark"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-right font-semibold text-heading-DEFAULT">
                    {item.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
