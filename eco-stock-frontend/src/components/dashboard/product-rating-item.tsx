interface Props {
  name: string;
  rating: number;
  sales: string;
  percent: number;
}

export default function ProductRatingItem({
  name,
  rating,
  sales,
  percent,
}: Props) {
  const letter = name.charAt(0);

  return (
    <div className="py-4 px-5 border-b border-muted bg-white hover:bg-blue-50 transition-colors rounded-md shadow-sm">
      <div className="flex justify-between items-center">
        {/* Avatar + Nombre + Estrellas */}
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary-DEFAULT text-white font-semibold flex items-center justify-center mr-4 shadow-md">
            {letter}
          </div>
          <div>
            <div className="text-heading-DEFAULT font-semibold text-gray-900">{name}</div>
            <div className="flex mt-1 space-x-0.5">
              {["one", "two", "three", "four", "five"].map((id, i) => (
                <svg
                  key={id}
                  className={`w-4 h-4 ${
                    i < rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <title>Star</title>
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>

        {/* Ventas + Porcentaje */}
        <div className="text-right">
          <div className="text-heading-DEFAULT font-bold text-gray-800">{sales}</div>
          <div className="text-xs flex items-center justify-end mt-1">
            <svg
              className="w-3 h-3 text-green-500 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>Growth</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            <span className="text-green-700 font-medium">{percent}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
