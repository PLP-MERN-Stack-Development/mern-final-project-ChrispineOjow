import {Card, CardContent} from "./ui/card";
import { cn } from "@/lib/utils"

function StatisticCard({children, className}){

    return(
        <>
        
            <Card className={cn(" w-50 my-10 mx-15 h-60" ,className)}>
                <CardContent>
                    {children}
                </CardContent>
            </Card>
        </>
    )
}

export default StatisticCard;