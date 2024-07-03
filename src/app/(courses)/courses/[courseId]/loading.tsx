import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import React from "react";
import { Puff } from "react-loader-spinner";

const Loading = () => {
  const { theme } = useTheme();
  return (
    <main className="h-[100vh] flex justify-center items-center">
      <Puff
        visible={true}
        height="80"
        width="80"
        color={`${theme === "dark" ? "#FFF" : "#000"}`}
        ariaLabel="puff-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </main>
  );
};

export default Loading;
