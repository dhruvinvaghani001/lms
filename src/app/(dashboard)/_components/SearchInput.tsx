"use client";
import { useDebounce } from "@/hooks/useDebounde";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import queryString from "query-string";
import { Input } from "@/components/ui/input";

const SearchInput = () => {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value);

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId");

  useEffect(() => {
    const url = queryString.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId: currentCategoryId,
          title: debouncedValue,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );
    router.push(url);
  }, [debouncedValue, currentCategoryId, router, pathname]);

  return (
    <div className="w-1/2 md:w-1/4">
      <Input
        onChange={(e) => setValue(e.target.value)}
        value={value}
        className="bg-muted focus:border-none focus:outline rounded-full px-4 ml-3 md:ml-0 w-full"
        placeholder="Seach Courses..."
      />
    </div>
  );
};

export default SearchInput;
