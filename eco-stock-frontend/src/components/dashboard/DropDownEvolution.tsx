import {
    BarChart3,
    ChevronDown,
  } from "lucide-react";
  import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
  } from "recharts";
  
  // Ajustar según tu tipo
  interface Producto {
    id: number;
    nombre: string;
    categoria: string;
    rotacion: number;
    tendencia: "positiva" | "negativa";
    cambio: number;
    evolucion: { mes: string; rotacion: number }[];
  }
  
  interface Props {
    producto: Producto;
    isOpen: boolean;
    onToggle: () => void;
  }
  
  const DropDownEvolution = ({ producto, isOpen, onToggle }: Props) => (
    <div className="border-t border-muted-light">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-2 flex items-center justify-center gap-2 text-primary-dark hover:bg-primary-ecoLight transition-colors text-sm"
      >
        <BarChart3 size={16} />
        Ver evolución (6 meses)
        <ChevronDown
          className={`transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          size={16}
        />
      </button>
  
      {isOpen && (
        <div className="px-4 pb-4">
          <div className="bg-muted-light rounded-lg p-3">
            <h4 className="font-medium text-heading-dark mb-3 text-sm">
              Evolución de rotación - {producto.nombre}
            </h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={producto.evolucion}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 10,
                    bottom: 10,
                  }}
                  barCategoryGap="20%"
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="mes" 
                    axisLine={false}
                    tickLine={false}
                    fontSize={11}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    fontSize={11}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      fontSize: "12px",
                    }}
                    formatter={(value) => [`${value}%`, "Rotación"]}
                  />
                  <Bar 
                    dataKey="rotacion" 
                    fill="#16a34a" 
                    radius={[2, 2, 0, 0]}
                    maxBarSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
  export default DropDownEvolution;