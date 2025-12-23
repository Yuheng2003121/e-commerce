import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  return (
    <div className="p-4 flex flex-col gap-4">
      <div>
        <Button size={"lg"} variant={'elevated'}>Button</Button>
      </div>
      <div>
        <Input/>
      </div>
      <div>
        <Progress value={50}/>
      </div>
      <div>
        <Textarea/>
      </div>
    </div>
  );
}
