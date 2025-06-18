// components/shared/ExportUtils.ts
export const exportToCSV = <T extends Record<string, unknown>>(
  data: T[],
  headers: string[],
  filename: string
) => {
  try {
    const csvData = data.map((item) =>
      headers.map((header) => {
        const value = item[header.toLowerCase().replace(/\s+/g, "")];
        return typeof value === "string" ? `"${value}"` : value;
      }).join(",")
    );

    const csvContent = [headers.join(","), ...csvData].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("Error al generar CSV:", error);
    return false;
  }
};