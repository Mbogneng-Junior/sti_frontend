"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Database, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type Props = {
  data: object;
};

export const RawDataViewer = ({ data }: Props) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="h-full bg-slate-900 border-slate-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-slate-400" />
            <CardTitle className="text-lg text-slate-200">Données Brutes</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-slate-400 border-slate-600">
              JSON
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-[500px] rounded-md border border-slate-700 bg-slate-950 p-4">
          <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
            {JSON.stringify(data, null, 2)}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
