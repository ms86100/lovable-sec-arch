import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRunWhatIf, useScenarios } from "../hooks/useCapacity";

interface Props { projectId: string }

export function WhatIf({ projectId }: Props) {
  const { data: scenarios, isLoading } = useScenarios(projectId);
  const run = useRunWhatIf();

  const [velocityChange, setVelocityChange] = useState<number>(0);
  const [resourceLossDays, setResourceLossDays] = useState<number>(0);
  const [scopeIncrease, setScopeIncrease] = useState<number>(0);

  const onRun = async () => {
    await run.mutateAsync({ projectId, variables: { velocity_change_percent: velocityChange, resource_loss_days: resourceLossDays, scope_increase_percent: scopeIncrease } });
    setVelocityChange(0); setResourceLossDays(0); setScopeIncrease(0);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>What-If Analysis</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-2">
            <Label>Velocity Change %</Label>
            <Input type="number" value={velocityChange} onChange={(e) => setVelocityChange(Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label>Resource Loss (days)</Label>
            <Input type="number" value={resourceLossDays} onChange={(e) => setResourceLossDays(Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label>Scope Increase %</Label>
            <Input type="number" value={scopeIncrease} onChange={(e) => setScopeIncrease(Number(e.target.value))} />
          </div>
          <Button onClick={onRun} disabled={run.isPending}>Run</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Saved Scenarios</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {isLoading && <div className="text-sm text-muted-foreground">Loading...</div>}
          {!isLoading && (!scenarios || scenarios.length === 0) && (
            <div className="text-sm text-muted-foreground">No scenarios yet.</div>
          )}
          {(scenarios || []).map((s) => (
            <div key={s.id} className="p-3 border border-border rounded-md text-sm">
              <div className="font-medium">Variables</div>
              <pre className="text-xs text-muted-foreground overflow-auto">{JSON.stringify(s.variables, null, 2)}</pre>
              {s.result_summary && (
                <div className="mt-2">
                  <div className="font-medium">Result</div>
                  <pre className="text-xs text-muted-foreground overflow-auto">{JSON.stringify(s.result_summary, null, 2)}</pre>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
