// // components/GlassTableBody.jsx
// export default function GlassTableBody({ data, columns, renderActions }) {
//   return (
//     <tbody
//       className="
//         bg-white/3
//         backdrop-blur-xl
//         divide-y divide-white/5
//         border border-white/5
//         rounded-xl
//       "
//     >
//       {data.length > 0 ? (
//         data.map((row, index) => (
//           <tr
//             key={index}
//             className="
//               hover:bg-white/5 
//               transition-all 
//               duration-200
//               hover:shadow-md 
//               hover:shadow-black/20
//             "
//           >
//             {columns.map((col, i) => (
//               <td
//                 key={i}
//                 className="
//                   px-4 py-3 
//                   whitespace-nowrap 
//                   text-white/80 
//                   text-sm
//                 "
//               >
//                 {typeof col.render === "function"
//                   ? col.render(row)
//                   : row[col.key]}
//               </td>
//             ))}

//             {renderActions && (
//               <td className="px-4 py-3 whitespace-nowrap text-sm">
//                 {renderActions(row)}
//               </td>
//             )}
//           </tr>
//         ))
//       ) : (
//         <tr>
//           <td
//             colSpan={columns.length + (renderActions ? 1 : 0)}
//             className="
//               px-4 py-4 
//               text-center 
//               text-white/50 
//               text-sm
//             "
//           >
//             Aucun utilisateur trouvé
//           </td>
//         </tr>
//       )}
//     </tbody>
//   );
// }
