
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
  audits: any[];
}
export default function AuditTable({ audits }: Props) {
  const handleExport = () => {
    const csv = [
      ["Time", "User", "Action", "Context", "IP"],
      ...audits.map(a =>
        [
          new Date(a.created_at).toLocaleString(),
          a.user_id,
          a.action,
          JSON.stringify(a.context),
          a.ip_address,
        ]
      ),
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "audit_logs.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold">Audit Trail</h2>
          <button className="gov-button-primary px-3 py-1 rounded" onClick={handleExport}>Export CSV</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr>
                <th className="px-2 py-1">Time</th>
                <th className="px-2 py-1">User</th>
                <th className="px-2 py-1">Action</th>
                <th className="px-2 py-1">Context</th>
                <th className="px-2 py-1">IP</th>
              </tr>
            </thead>
            <tbody>
              {audits.map((a) => (
                <tr key={a.id}>
                  <td className="px-2 py-1">{new Date(a.created_at).toLocaleString()}</td>
                  <td className="px-2 py-1">{a.user_id}</td>
                  <td className="px-2 py-1"><Badge>{a.action}</Badge></td>
                  <td className="px-2 py-1 max-w-xs truncate">{JSON.stringify(a.context)}</td>
                  <td className="px-2 py-1">{a.ip_address || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
