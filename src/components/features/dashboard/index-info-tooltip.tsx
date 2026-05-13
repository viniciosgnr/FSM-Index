import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { INDEX_DEFINITIONS } from "@/lib/constants";

type Props = {
  indexKey: keyof typeof INDEX_DEFINITIONS;
  children?: React.ReactNode;
};

export function IndexInfoTooltip({ indexKey, children }: Props) {
  const info = INDEX_DEFINITIONS[indexKey];

  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <div className="inline-flex items-center gap-1.5 cursor-help group">
          {children}
          <Info className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </TooltipTrigger>
      <TooltipContent className="p-4 max-w-xs bg-popover shadow-xl border-border">
        <div className="space-y-2">
          <h4 className="font-bold text-sm" style={{ color: info.color }}>{info.name}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {info.definition}
          </p>
          <div className="pt-2 border-t border-border mt-2">
            <p className="text-[0.65rem] font-semibold text-foreground mb-1 uppercase tracking-wider opacity-60">Formula:</p>
            <code className="text-[0.7rem] bg-muted text-slate-800 px-2 py-1 rounded block font-mono font-bold leading-relaxed">
              {info.formula}
            </code>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
