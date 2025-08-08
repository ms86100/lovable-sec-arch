import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRCA, useUpsertRCA } from "../hooks/useRetrospectives";

interface Props {
  retrospectiveId: string;
}

export function RCAForm({ retrospectiveId }: Props) {
  const { data: rcas } = useRCA(retrospectiveId);
  const upsert = useUpsertRCA();

  const [method, setMethod] = useState<string>("five_whys");
  const [content, setContent] = useState<string>("");

  const save = async () => {
    await upsert.mutateAsync({ retrospective_id: retrospectiveId, method, content: content ? JSON.parse(content) : {} });
    setContent("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Root Cause Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Method</Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="five_whys">5 Whys</SelectItem>
                <SelectItem value="fishbone">Fishbone Diagram</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Content (JSON)</Label>
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder='{"whys": ["..."]}' rows={6} />
          </div>
        </div>
        <Button onClick={save} disabled={upsert.isPending}>Save RCA</Button>

        <div className="space-y-2">
          {(rcas || []).map((r) => (
            <div key={r.id} className="p-3 border border-border rounded-md text-sm">
              <div className="font-medium">{r.method}</div>
              <pre className="text-xs text-muted-foreground overflow-auto">{JSON.stringify(r.content, null, 2)}</pre>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
