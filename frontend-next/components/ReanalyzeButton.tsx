import { Button } from "./ui/button";

interface Props {
    onClick: ()=>void
}

export function ReanalyzeButton(props : Props){
    return (
        <Button onClick={props.onClick} size="lg" className="bg-background text-red-600 hover:bg-background/90 shadow-lg transform hover:scale-105 hover:cursor-pointer">
            Reanalyze
        </Button>
    )
}