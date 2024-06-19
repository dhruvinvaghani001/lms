import React from 'react';
import { AlertTriangle, CheckCircleIcon } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';


const bannerVariant = cva("border text-sm p-4 text-center flex items-center w-full gap-2", {
    variants: {
        variant: {
            warning: "bg-yellow-400/80 border-yellow-30 text-primary ",
            success: "bg-emerald-700 border-emerald-800 text-white  "
        }
    },
    defaultVariants: {
        variant: "warning",
    }
})

interface BannerProps extends VariantProps<typeof bannerVariant> {
    label: string,

}

const iconMap = {
    warning: AlertTriangle,
    success: CheckCircleIcon,
}


const Banner = ({ label, variant }: BannerProps) => {
    const Icon = iconMap[variant || "warning"];

    return (
        <div className={cn(bannerVariant({ variant }))}>
            <Icon className='h-4 w-4' />
            {label}
        </div>
    )
}

export default Banner