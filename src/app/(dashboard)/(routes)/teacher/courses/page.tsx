import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

type Props = {}

const page = (props: Props) => {
    return (
        <div className=''>
            <div className="main__section flex justify-start items-center p-8">
                <Link href="/teacher/create">
                    <Button variant="default" className="bg-secondary-foreground">Craete New</Button>
                </Link>
            </div>
        </div>
    )
}

export default page