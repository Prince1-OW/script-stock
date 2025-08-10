import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

export const useAuth = () => {
  const { data } = useQuery({
    queryKey: ["auth-session"],
    queryFn: async () => {
      // Placeholder: wire to Supabase later
      return { user: null } as { user: null | { id: string; email: string } };
    },
    staleTime: 5 * 60 * 1000,
  });

  const isAuthenticated = useMemo(() => !!data?.user, [data]);

  return { user: data?.user, isAuthenticated };
};
