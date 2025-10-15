import { useEffect } from "react";

function authenticatePageUseEffect(isAuthenticated: boolean, isLoading: boolean, router: any){
    return (
        useEffect(()=>{
            if(!isAuthenticated && !isLoading){
              return router.push("/");
            }
          }, [isLoading])
    )
}

export {
    authenticatePageUseEffect
}