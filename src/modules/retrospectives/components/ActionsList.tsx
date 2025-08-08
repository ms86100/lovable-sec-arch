import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useActions, useUpsertAction } from "../hooks/useRetrospectives";

interface Props {
  retrospectiveId: string;
}

export function ActionsList({ retrospectiveId }: Props) {
  const { data: actions } = useActions(retrospectiveId);
  const upsert = useUpsertAction();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<string>("");

  const add = async () => {
    await upsert.mutateAsync({ retrospective_id: retrospectiveId, title, description, due_date: dueDate || null, status: "open" });
    setTitle("");
    setDescription("");
    setDueDate("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Due Date</Label>
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          <div className="space-y-2 md:col-span-3">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </div>
        <Button onClick={add} disabled={upsert.isPending}>Add Action</Button>

        <div className="space-y-2">
          {(actions || []).map((a) => (
            <div key={a.id} className="p-3 border border-border rounded-md text-sm">
              <div className="font-medium">{a.title} <span className="text-muted-foreground">• {a.status}</span></div>
              {a.description && <div className="text-muted-foreground">{a.description}</div>}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
