function DataTable({ columns, rows, emptyMessage = "No data found.", keyExtractor }) {
  if (rows.length === 0) {
    return <p className="mutedText">{emptyMessage}</p>;
  }

  return (
    <div className="ordersTable">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={keyExtractor ? keyExtractor(row) : index}>
              {columns.map((column) => (
                <td key={column.key}>{column.render(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
