import * as XLSX from "xlsx";

export class ExcelLoader {
  async loadFromBuffer(buffer: ArrayBuffer): Promise<string> {
    try {
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      //   console.log("jsonData", jsonData);
      return JSON.stringify(jsonData);
    } catch (error) {
      console.error("Error parsing Excel:", error);
      throw new Error("Failed to parse Excel file");
    }
  }
  async loadExcelFromBuffer(buffer: ArrayBuffer) {
    // Read workbook
    const workbook = XLSX.read(Buffer.from(buffer), { type: "buffer" });
    const sheets: Record<string, any[]> = {};

    workbook.SheetNames.forEach((name) => {
      // Convert each sheet to an array of row objects
      const worksheet = workbook.Sheets[name];
      sheets[name] = XLSX.utils.sheet_to_json(worksheet, {
        header: 1, // returns rows as arrays of cells
        defval: "", // fill empty cells with empty string
      });
    });

    console.log("First 5 items:", sheets.Sheet1.slice(0, 10));
    return sheets;
  }
}

export default ExcelLoader;
