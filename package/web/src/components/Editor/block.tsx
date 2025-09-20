import { forwardRef, type ElementRef } from "react";


const Block = forwardRef<ElementRef<"div">, {}>(({ }, ref) => {
	return (<div></div>)
}) 