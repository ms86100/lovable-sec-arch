import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRetrospectives, useUpsertRetrospective } from "../hooks/useRetrospectives";

interface Props {
  projectId: string;
  iterationId?: string;
}

export function RetrospectiveBoard({ projectId, iterationId }: Props) {
  const { data: retros, isLoading } = useRetrospectives(projectId);
  const upsertRetro = useUpsertRetrospective();

  const [facilitator, setFacilitator] = useState("");
  const [notes, setNotes] = useState("");

  const startRetro = async () => {
    await upsertRetro.mutateAsync({ project_id: projectId, iteration_id: iterationId ?? null, facilitator, notes, status: "open" });
    setFacilitator("");
    setNotes("");
  };

  const closeRetro = async (id: string) => {
    await upsertRetro.mutateAsync({ id, status: "closed" } as any);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Start a Retrospective</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Facilitator</Label>
              <Input value={facilitator} onChange={(e) => setFacilitator(e.target.value)} placeholder="Name" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Notes</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Initial notes (optional)" />
            </div>
          </div>
          <Button onClick={startRetro} disabled={upsertRetro.isPending}>Start Retrospective</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Retrospectives</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading && <div className="text-sm text-muted-foreground">Loading...</div>}
          {!isLoading && (!retros || retros.length === 0) && (
            <div className="text-sm text-muted-foreground">No retrospectives yet.</div>
          )}
          <div className="space-y-2">
            {(retros || []).map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3 border border-border rounded-md">
                <div className="text-sm">
                  <div className="font-medium">{r.status.toUpperCase()} • {new Date(r.date).toDateString()}</div>
                  {r.facilitator && <div className="text-muted-foreground">Facilitator: {r.facilitator}</div>}
                </div>
                {r.status !== "closed" && (
                  <Button size="sm" variant="outline" onClick={() => closeRetro(r.id)}>Close</Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
