import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import * as _  from 'lodash';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: "root"
})
export class ExcelService {

  constructor(

  ) { }
  public exportAsExcelFile(json: any[], excelFileName: string): void {

 // Convertir los datos JSON a una hoja de cálculo Excel
 const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);

 // Obtener la cantidad de columnas
 const columnCount = Object.keys(json[0]).length;

 // Definir el ancho predeterminado para todas las columnas
 const defaultWidth = 50;

 // Definir el ancho específico para las columnas
 const specificWidths = {
     2: 150, // Cuarta columna
     10: 100, // Undécima columna
     11: 100, // Decimotercera columna
     13: 100 // Decimocuarta columna
 };

 // Crear un arreglo de ancho de columnas con el ancho predeterminado para todas
 const columnWidths = Array(columnCount).fill({ wch: defaultWidth });

 // Establecer anchos de columna específicos
 for (const colIndex in specificWidths) {
     if (specificWidths.hasOwnProperty(colIndex)) {
         const index = parseInt(colIndex);
         columnWidths[index] = { wch: specificWidths[index] };
     }
 }

 // Reemplazar comas por saltos de línea en la sexta columna
 const columnIndexToFormat = 11; // Índice de la sexta columna (cuenta desde 0)
 const columnIndex = XLSX.utils.encode_col(columnIndexToFormat);
 
 for (let i = 1; i <= json.length; i++) {
  const cellRef = `${columnIndex}${i}`;
  if (worksheet[cellRef] && worksheet[cellRef].v !== null) { // Verificar si el valor no es nulo
      const value = worksheet[cellRef].v;
      const lines = value.split(','); // Dividir la cadena en líneas separadas
      worksheet[cellRef].v = lines.join('\n'); // Unir las líneas con saltos de línea
  }
}

 // Asignar los anchos de columna a la hoja de cálculo Excel
 worksheet['!cols'] = columnWidths;

 // Crear el libro de trabajo Excel y escribirlo en un archivo
 const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
 const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
 this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName  + EXCEL_EXTENSION);
  }
}
