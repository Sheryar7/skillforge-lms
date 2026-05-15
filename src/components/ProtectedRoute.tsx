// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabase-client";

// export default function ProtectedRoute({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();

//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkUser = async () => {
//       const {
//         data: { session },
//       } = await supabase.auth.getSession();

//       if (!session) {
//         router.push("/login");
//       } else {
//         setLoading(false);
//       }
//     };

//     checkUser();
//   }, [router]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#f5f7fb]">

//         <div className="flex flex-col items-center gap-4">

//           <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />

//           <p className="text-gray-500 text-sm">
//             Checking authentication...
//           </p>

//         </div>

//       </div>
//     );
//   }

//   return <>{children}</>;
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";

const DEV_BYPASS = true;

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {

  // ✅ TEMPORARY TESTING BYPASS
  if (DEV_BYPASS) {
    return <>{children}</>;
  }

  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f7fb]">

        <div className="flex flex-col items-center gap-4">

          <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />

          <p className="text-gray-500 text-sm">
            Checking authentication...
          </p>

        </div>

      </div>
    );
  }

  return <>{children}</>;
}