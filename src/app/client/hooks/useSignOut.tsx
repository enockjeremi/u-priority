import { useCallback } from "react";
import { useQueryClient } from "react-query";

import { QUERY_KEY } from "@/app/server/constants/query-keys";
import { navigate } from "@/app/server/actions/navigate";
import { removeUserToken } from "@/app/server/token/user-token";

export function useSignOut() {
  const queryClient = useQueryClient();

  const onSignOut = useCallback(() => {
    removeUserToken()
    queryClient.setQueryData([QUERY_KEY.user], null);
    navigate("/auth/sign-in");
  }, [queryClient]);

  return onSignOut;
}
