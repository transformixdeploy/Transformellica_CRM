// import Link from 'next/link';
// import { useState } from 'react';

// interface UserData {
//   title: string;
//   id: string;
//   categoryUrl: string;
// }

// interface UserDataHistoryProps {
//   data: UserData[];
// }

// const UserDataHistory: React.FC<UserDataHistoryProps> = ({ data }) => {
//   const [searchTerm, setSearchTerm] = useState('');

//   const filteredData = data.filter((item) =>
//     item.title.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div>
//       <h1>User Data History</h1>
//       <input
//         type="text"
//         placeholder="Search by title..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />
//       <ul>
//         {filteredData.map((item) => (
//           <li key={item.id}>
//             <Link href={`/${item.categoryUrl}/${item.id}`}>
//               {item.title}
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default UserDataHistory;





'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { Search, FileText, X, SquareArrowOutUpRight } from 'lucide-react';

interface UserData {
  title: string;
  id: string;
  categoryUrl: string;
}

interface UserDataHistoryProps {
  data: UserData[];
}

export default function UserDataHistory({ data }: UserDataHistoryProps) {
  const [search, setSearch] = useState('');

    const filteredData = data.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <aside className="min-w-fit p-4">
      {/* Header */}
      <h2 className="mb-3 text-lg font-semibold">History</h2>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-8 py-1.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />

        {/* Clear search button */}
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* List */}
      {filteredData.length ? (
        <ul className="space-y-1">
          {filteredData.map((item) => (
            <li key={item.id}>
              <Link
                href={`/${item.categoryUrl}/${item.id}`}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-700 transition-colors group"
              >
                <SquareArrowOutUpRight className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span className="text-sm  group-hover:text-blue-600">
                  {item.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-gray-500 text-center">
          {search ? 'No matches' : 'No history yet'}
        </p>
      )}
    </aside>
  );
}


// 'use client';

// import Link from 'next/link';
// import { useState } from 'react';
// import { Search, SquareArrowOutUpRight, X } from 'lucide-react';

// interface UserData {
//   title: string;
//   id: string;
//   categoryUrl: string;
// }

// interface UserDataHistoryProps {
//   data: UserData[];
// }

// export default function UserDataHistory({ data }: UserDataHistoryProps) {
//   const [search, setSearch] = useState('');

//   const filteredData = data.filter((item) =>
//     item.title.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <aside className="h-full flex flex-col min-w-fit p-4">
//       {/* Header */}
//       <h2 className="mb-3 text-lg font-semibold">History</h2>

//       {/* Search */}
//       <div className="relative mb-4 flex-shrink-0">
//         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//         <input
//           type="text"
//           placeholder="Search…"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="w-full pl-9 pr-8 py-1.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
//         />
//         {search && (
//           <button
//             onClick={() => setSearch('')}
//             className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//           >
//             <X className="h-4 w-4" />
//           </button>
//         )}
//       </div>

//       {/* Scrollable List */}
//       <div className="flex-1 overflow-y-auto pr-1 -mr-1">
//         {filteredData.length ? (
//           <ul className="space-y-1">
//             {filteredData.map((item) => (
//               <li key={item.id}>
//                 <Link
//                   href={`/${item.categoryUrl}/${item.id}`}
//                   className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-700 transition-colors group"
//                 >
//                   <SquareArrowOutUpRight className="h-4 w-4 text-blue-600 flex-shrink-0" />
//                   <span className="text-sm text-gray-700 truncate group-hover:text-blue-600">
//                     {item.title}
//                   </span>
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-xs text-gray-500 text-center py-4">
//             {search ? 'No matches' : 'No history yet'}
//           </p>
//         )}
//       </div>
//     </aside>
//   );
// }