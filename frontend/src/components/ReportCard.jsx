import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";

function ReportCard({
    locationName,
    children,
    className,
    onEdit,
    onDelete,
    isDeleting = false,
    disableActions = false
}) {
    return (
        <>
            <Card className={cn("relative min-h-32 w-[80%] ms-15 mb-10", className)}>
                <CardContent className="h-full p-6">

                    <h4 className="text-xl font-semibold mb-3">
                     {locationName || 'Unnamed Location'}
                    </h4>
                    {children}
                    {(onEdit || onDelete) && !disableActions && (
                        <div className="absolute bottom-4 right-4 flex gap-2">
                            {onEdit && (
                                <Button
                                    className="bg-blue-500 text-white hover:cursor-pointer"
                                    onClick={onEdit}
                                >
                                    Edit
                                </Button>
                            )}
                            {onDelete && (
                                <Button
                                    className="bg-red-500 text-white hover:cursor-pointer disabled:opacity-60"
                                    onClick={onDelete}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? "Deleting..." : "Delete"}
                                </Button>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
}

export default ReportCard;