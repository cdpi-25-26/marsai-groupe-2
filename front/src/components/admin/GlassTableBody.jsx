// components/GlassTableBody.jsx
export default function GlassTableBody({ data, columns, renderActions }) {
  return (
    <tbody
      className="
        bg-white/5 
        backdrop-blur-md 
        divide-y divide-white/10 
        border border-white/10 
        rounded-xl
      "
    >
      {data.length > 0 ? (
        data.map((row, index) => (
          <tr
            key={index}
            className="hover:bg-white/10 transition-colors"
          >
            {columns.map((col, i) => (
              <td
                key={i}
                className="px-6 py-4 whitespace-nowrap text-white/90"
              >
                {typeof col.render === "function"
                  ? col.render(row)
                  : row[col.key]}
              </td>
            ))}

            {renderActions && (
              <td className="px-6 py-4 whitespace-nowrap">
                {renderActions(row)}
              </td>
            )}
          </tr>
        ))
      ) : (
        <tr>
          <td
            colSpan={columns.length + (renderActions ? 1 : 0)}
            className="px-6 py-4 text-center text-white/60"
          >
            Aucun utilisateur trouvé
          </td>
        </tr>
      )}
    </tbody>
  );
}
