"use client";
import { Category } from "@prisma/client";
import React from "react";
import CategoryIteam from "./CategoryIteam";
import {
    Camera,
    Computer,
    Dumbbell,
    Figma,
    LayoutDashboard,
    LayoutDashboardIcon,
    LucideIcon,
    Music,
    Settings,
} from "lucide-react";

interface CategoryListProps {
    items: Category[];
}

const iconMap: Record<Category["name"], LucideIcon> = {
    Music: Music,
    "Accountting": LayoutDashboardIcon,
    "Computer Science": Computer,
    Enginnering: Settings,
    Fitness: Dumbbell,
    Photography: Camera,
    "Web designer": Figma,
};

const CategoryList = ({ items }: CategoryListProps) => {
    return (
        <div className="p-6 ">
            <div className="flex items-center gap-6  overflow-x-auto">
                {items.map((item) => (
                    <CategoryIteam
                        key={item.id}
                        value={item.id}
                        label={item.name}
                        icon={iconMap[item.name]}
                    />
                ))}
            </div>
        </div>
    );
};

export default CategoryList;
