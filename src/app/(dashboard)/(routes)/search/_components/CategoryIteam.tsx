"use client";
import { LucideIcon } from 'lucide-react'
import queryString from 'query-string';
import React from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { title } from 'process';
import { cn } from '@/lib/utils';

interface CategoryIteamProps {
    icon: LucideIcon,
    label: string,
    value: string,
}


const CategoryIteam = ({ label, value, icon: Icon }: CategoryIteamProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentCategoryId = searchParams.get("categoryId");
    const currentTitle = searchParams.get("title");
    const isSelected = currentCategoryId === value;

    const onClick = () => {
        const url = queryString.stringifyUrl({
            url: pathname,
            query: {
                title: currentTitle,
                categoryId: isSelected ? null : value,
            }
        }, { skipNull: true, skipEmptyString: true })
        router.push(url);
    }


    return (
        <button onClick={onClick} className={cn('py-1 px-3 text-sm font-semibold flex items-center  gap-2 rounded-full ',
            isSelected && "bg-secondary border-2 border-primary"
        )}>
            {Icon && <Icon size={16} />}
            {label}
        </button>
    )
}

export default CategoryIteam