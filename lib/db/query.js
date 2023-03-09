export class QueryTable {
  constructor(tableName = "", tableKey = "id", tableSchema = {}) {
    this.key = tableKey;
    this.name = tableName;
    this.schema = tableSchema;
  }

  create(config = { pretty: false }) {
    let tab = config.pretty ? "\t" : "";
    let newLine = config.pretty ? "\n" : "";
    const tableSchema = Object.entries(this.schema)
      .map(([key, value]) => {
        const isKey = this.key == key ? " PRIMARY KEY" : "";
        return `${tab}${key} ${value}${isKey}`;
      })
      .join(`, ${newLine}`);
    return `CREATE TABLE IF NOT EXISTS ${this.name} (${newLine}${tableSchema}${newLine})`;
  }

  insert(rowData, config = { pretty: false }) {
    let tab = config.pretty ? "\t" : "";
    let newLine = config.pretty ? "\n" : "";
    let keysData = Object.keys(rowData).join(", ");
    let valuesData = Object.entries(rowData)
      .map(([key, value]) => {
        const valueType = this.schema[key];
        if (valueType.startsWith("STRING")) {
          if (valueType.endsWith("[]")) {
            return `ARRAY[${value.map((v) => `'${v}'`).join(", ")}]`;
          }
          return `'${value}'`;
        }
        return value;
      })
      .join(", ");
    return `UPSERT INTO ${this.name} (${keysData}) VALUES ${newLine}${tab}(${valuesData})`;
  }
}
