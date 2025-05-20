interface InfoCardProps {
    title: string;
    description: string;
  }
  
  export default function InfoCard({ title, description }: InfoCardProps) {
    return (
      <div className="bg-white border border-green-200 rounded-xl p-4 shadow hover:shadow-md transition">
        <h4 className="text-sm font-semibold text-green-700 mb-1">{title}</h4>
        <p className="text-sm text-gray-800">{description}</p>
      </div>
    );
  }
  