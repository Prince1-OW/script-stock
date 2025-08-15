import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAuth = () => {
  const { data } = useQuery({
    queryKey: ["auth-session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return { 
        user: session?.user ? {
          id: session.user.id,
          email: session.user.email || ''
        } : null 
      };
    },
    staleTime: 5 * 60 * 1000,
  });

  const isAuthenticated = useMemo(() => !!data?.user, [data]);

  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = async (email: string, password: string) => {
    return await supabase.auth.signUp({ email, password });
  };

  const signOut = async () => {
    return await supabase.auth.signOut();
  };

  return { 
    user: data?.user, 
    isAuthenticated, 
    signIn, 
    signUp, 
    signOut 
  };
};
