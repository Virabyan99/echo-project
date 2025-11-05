import { add } from "@workspace/math/add"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello widget</h1>
        <Button size="sm">Button</Button>
        <p>The sum of 2 and 3 is:  {add(2, 3)}</p>
        <Input /> 
      </div>
    </div>
  )
}
